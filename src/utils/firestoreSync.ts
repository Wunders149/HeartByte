import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  AvatarConfig,
  CommunityEvent,
  DateResult,
  EventRegistration,
  PlayerProfile,
} from '../types/dating';

// Blueprint-synchronized volumetric limits & patterns (firebase-blueprint.json)
const ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

const LIMITS = {
  EVENT_ID_MAX: 64,
  ID_MAX: 128,
  TITLE_MAX: 120,
  SUBTITLE_MAX: 200,
  DESC_MAX: 1000,
  BENEFICIARY_MAX: 120,
  DATE_MAX: 80,
  TIME_MAX: 80,
  VENUE_NAME_MAX: 120,
  VENUE_ADDR_MAX: 200,
  CREATOR_NAME_MAX: 80,
  PROMPT_MAX: 300,
  TIER_NAME_MAX: 80,
  TIER_PERKS_MAX: 200,
  NAME_MAX: 80,
  EMAIL_MAX: 120,
  PRONOUNS_MAX: 40,
  BIO_MAX: 200,
  USER_BIO_MAX: 250,
  VIBE_MAX: 50,
  GAME_MAX: 80,
  TICKET_CODE_MAX: 40,
  REGISTERED_AT_MAX: 60,
  NOTES_MAX: 300,
  MESSAGE_MAX: 500,
};

function sanitizeStr(val: string | undefined | null, maxLen: number, fallback = ''): string {
  const cleaned = (val ?? fallback).toString().trim();
  return cleaned.slice(0, maxLen);
}

function sanitizeId(val: string, maxLen = LIMITS.ID_MAX): string {
  const cleaned = val.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, maxLen);
  if (!ID_REGEX.test(cleaned)) {
    return `id-${Date.now()}`.slice(0, maxLen);
  }
  return cleaned;
}

function sanitizeAvatar(avatar: AvatarConfig): AvatarConfig {
  return {
    skinTone: avatar.skinTone,
    hairStyle: avatar.hairStyle,
    hairColor: avatar.hairColor,
    eyeStyle: avatar.eyeStyle,
    outfitStyle: avatar.outfitStyle,
    outfitColor: avatar.outfitColor,
    accessory: avatar.accessory,
    expression: avatar.expression,
  };
}

export interface StoredMatchMessage {
  id: string;
  userId: string;
  suitorId: string;
  sender: 'player' | 'suitor';
  text: string;
  timestamp: string;
  isDateInvite?: boolean;
  dateAccepted?: boolean;
}

// --- SUBSCRIPTIONS (Only attach when auth.currentUser is authenticated!) ---

export function subscribeToEvents(
  isAdmin: boolean,
  onData: (events: CommunityEvent[]) => void
): Unsubscribe {
  const path = 'events';
  const eventsRef = collection(db, path);
  const q = isAdmin
    ? eventsRef
    : query(eventsRef, where('status', 'in', ['open', 'active', 'completed']));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: CommunityEvent[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || '',
          subtitle: data.subtitle || '',
          causeCategory: data.causeCategory || 'community',
          description: data.description || '',
          beneficiaryName: data.beneficiaryName || '',
          fundraisingGoal: Number(data.fundraisingGoal) || 2000,
          currentFundsRaised: Number(data.currentFundsRaised) || 0,
          attendeeCount: Number(data.attendeeCount) || 0,
          date: data.date || '',
          time: data.time || '',
          venueName: data.venueName || '',
          venueAddress: data.venueAddress || '',
          maxCapacity: Number(data.maxCapacity) || 30,
          ticketTiers: Array.isArray(data.ticketTiers) ? data.ticketTiers : [],
          creatorName: data.creatorName || 'Community Organizer',
          creatorId: data.creatorId || '',
          customCausePrompt: data.customCausePrompt,
          status: data.status || 'open',
          offlineDonations: Number(data.offlineDonations) || 0,
          lastRegistrationId: data.lastRegistrationId,
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeToEventPublicProfiles(
  eventId: string,
  onData: (profiles: EventRegistration[]) => void
): Unsubscribe {
  const cleanEventId = sanitizeId(eventId, LIMITS.EVENT_ID_MAX);
  const path = `events/${cleanEventId}/publicProfiles`;
  const q = query(collection(db, path), where('eventId', '==', cleanEventId));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: EventRegistration[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          eventId: data.eventId || cleanEventId,
          userId: data.userId || '',
          attendeeName: data.attendeeName || '',
          attendeeEmail: '',
          pronouns: data.pronouns || 'they/them',
          interestedIn: data.interestedIn || 'all',
          ticketTierId: 'public-profile',
          ticketPrice: 0,
          additionalDonation: 0,
          totalAmount: 0,
          avatar: data.avatar,
          bio: data.bio || '',
          registeredAt: '',
          ticketCode: '',
          checkedIn: Boolean(data.checkedIn),
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeToRegistrations(
  userId: string,
  isAdmin: boolean,
  onData: (registrations: EventRegistration[]) => void
): Unsubscribe {
  const path = 'registrations';
  const regRef = collection(db, path);
  const q = isAdmin ? regRef : query(regRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: EventRegistration[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          eventId: data.eventId || '',
          userId: data.userId || '',
          attendeeName: data.attendeeName || '',
          attendeeEmail: data.attendeeEmail || '',
          pronouns: data.pronouns || 'they/them',
          interestedIn: data.interestedIn || 'all',
          ticketTierId: data.ticketTierId || '',
          ticketPrice: Number(data.ticketPrice) || 0,
          additionalDonation: Number(data.additionalDonation) || 0,
          totalAmount: Number(data.totalAmount) || 0,
          avatar: data.avatar,
          bio: data.bio || '',
          registeredAt: data.registeredAt || '',
          ticketCode: data.ticketCode || '',
          checkedIn: Boolean(data.checkedIn),
          checkedInAt: data.checkedInAt,
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeToUserProfile(
  userId: string,
  onData: (profile: PlayerProfile | null) => void
): Unsubscribe {
  const path = `users/${userId}`;
  return onSnapshot(
    doc(db, 'users', userId),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const data = snap.data();
      onData({
        name: data.name || '',
        pronouns: data.pronouns || 'they/them',
        interestedIn: data.interestedIn || 'all',
        vibeTag: data.vibeTag || 'Player 1',
        bio: data.bio || '',
        favorite8BitGame: data.favorite8BitGame || '',
        avatar: data.avatar,
      });
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeToDateResults(
  userId: string,
  onData: (results: DateResult[]) => void
): Unsubscribe {
  const path = `users/${userId}/dateResults`;
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: DateResult[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          suitorId: data.suitorId || d.id,
          playerDecision: data.playerDecision || 'pass',
          suitorDecision: data.suitorDecision || 'pass',
          finalChemistry: Number(data.finalChemistry) || 0,
          playerNotes: data.playerNotes || '',
          isMutualMatch: Boolean(data.isMutualMatch),
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeToMatchMessages(
  userId: string,
  onData: (messages: StoredMatchMessage[]) => void
): Unsubscribe {
  const path = `users/${userId}/matchMessages`;
  const q = query(collection(db, path), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: StoredMatchMessage[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId || userId,
          suitorId: data.suitorId || '',
          sender: data.sender || 'player',
          text: data.text || '',
          timestamp: data.timestamp || '',
          isDateInvite: Boolean(data.isDateInvite),
          dateAccepted: Boolean(data.dateAccepted),
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// --- MUTATIONS ---

export async function createEventInFirestore(
  event: CommunityEvent,
  adminUid: string
): Promise<void> {
  const eventId = sanitizeId(event.id, LIMITS.EVENT_ID_MAX);
  const path = `events/${eventId}`;

  const tiers = event.ticketTiers.slice(0, 5).map((tier, idx) => ({
    id: sanitizeId(tier.id || `tier-${idx + 1}`, LIMITS.EVENT_ID_MAX),
    name: sanitizeStr(tier.name, LIMITS.TIER_NAME_MAX, `Tier ${idx + 1}`),
    price: Math.max(0, Number(tier.price) || 0),
    perks: sanitizeStr(tier.perks, LIMITS.TIER_PERKS_MAX),
    ...(tier.isPopular ? { isPopular: true } : {}),
  }));

  const payload: Record<string, unknown> = {
    id: eventId,
    title: sanitizeStr(event.title, LIMITS.TITLE_MAX, 'Fundraiser'),
    subtitle: sanitizeStr(event.subtitle, LIMITS.SUBTITLE_MAX),
    causeCategory: event.causeCategory,
    description: sanitizeStr(event.description, LIMITS.DESC_MAX),
    beneficiaryName: sanitizeStr(event.beneficiaryName, LIMITS.BENEFICIARY_MAX, 'Community Cause'),
    fundraisingGoal: Math.min(10000000, Math.max(100, Number(event.fundraisingGoal) || 2000)),
    currentFundsRaised: 0,
    attendeeCount: 0,
    date: sanitizeStr(event.date, LIMITS.DATE_MAX),
    time: sanitizeStr(event.time, LIMITS.TIME_MAX),
    venueName: sanitizeStr(event.venueName, LIMITS.VENUE_NAME_MAX),
    venueAddress: sanitizeStr(event.venueAddress, LIMITS.VENUE_ADDR_MAX),
    maxCapacity: Math.min(5000, Math.max(2, Number(event.maxCapacity) || 30)),
    ticketTiers: tiers,
    creatorName: sanitizeStr(event.creatorName, LIMITS.CREATOR_NAME_MAX, 'Organizer'),
    creatorId: adminUid,
    status: event.status || 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (event.customCausePrompt) {
    payload.customCausePrompt = sanitizeStr(event.customCausePrompt, LIMITS.PROMPT_MAX);
  }

  try {
    await setDoc(doc(db, 'events', eventId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateEventInFirestore(event: CommunityEvent): Promise<void> {
  const eventId = sanitizeId(event.id, LIMITS.EVENT_ID_MAX);
  const path = `events/${eventId}`;

  const tiers = event.ticketTiers.slice(0, 5).map((tier, idx) => ({
    id: sanitizeId(tier.id || `tier-${idx + 1}`, LIMITS.EVENT_ID_MAX),
    name: sanitizeStr(tier.name, LIMITS.TIER_NAME_MAX, `Tier ${idx + 1}`),
    price: Math.max(0, Number(tier.price) || 0),
    perks: sanitizeStr(tier.perks, LIMITS.TIER_PERKS_MAX),
    ...(tier.isPopular ? { isPopular: true } : {}),
  }));

  const payload: Record<string, unknown> = {
    title: sanitizeStr(event.title, LIMITS.TITLE_MAX, 'Fundraiser'),
    subtitle: sanitizeStr(event.subtitle, LIMITS.SUBTITLE_MAX),
    causeCategory: event.causeCategory,
    description: sanitizeStr(event.description, LIMITS.DESC_MAX),
    beneficiaryName: sanitizeStr(event.beneficiaryName, LIMITS.BENEFICIARY_MAX, 'Community Cause'),
    fundraisingGoal: Math.min(10000000, Math.max(100, Number(event.fundraisingGoal) || 2000)),
    currentFundsRaised: Math.max(0, Number(event.currentFundsRaised) || 0),
    attendeeCount: Math.max(0, Number(event.attendeeCount) || 0),
    date: sanitizeStr(event.date, LIMITS.DATE_MAX),
    time: sanitizeStr(event.time, LIMITS.TIME_MAX),
    venueName: sanitizeStr(event.venueName, LIMITS.VENUE_NAME_MAX),
    venueAddress: sanitizeStr(event.venueAddress, LIMITS.VENUE_ADDR_MAX),
    maxCapacity: Math.min(5000, Math.max(2, Number(event.maxCapacity) || 30)),
    ticketTiers: tiers,
    creatorName: sanitizeStr(event.creatorName, LIMITS.CREATOR_NAME_MAX, 'Organizer'),
    status: event.status || 'open',
    updatedAt: serverTimestamp(),
  };

  if (event.customCausePrompt) {
    payload.customCausePrompt = sanitizeStr(event.customCausePrompt, LIMITS.PROMPT_MAX);
  }
  if (typeof event.offlineDonations === 'number') {
    payload.offlineDonations = Math.max(0, event.offlineDonations);
  }

  try {
    await updateDoc(doc(db, 'events', eventId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEventInFirestore(eventId: string): Promise<void> {
  const cleanId = sanitizeId(eventId, LIMITS.EVENT_ID_MAX);
  const path = `events/${cleanId}`;
  try {
    await deleteDoc(doc(db, 'events', cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createRegistrationBatch(
  registration: EventRegistration,
  event: CommunityEvent,
  userId: string
): Promise<void> {
  const regId = sanitizeId(registration.id, LIMITS.ID_MAX);
  const eventId = sanitizeId(event.id, LIMITS.EVENT_ID_MAX);
  const ticketTierId = sanitizeId(registration.ticketTierId, LIMITS.EVENT_ID_MAX);
  const ticketPrice = Math.max(0, Number(registration.ticketPrice) || 0);
  const additionalDonation = Math.max(0, Number(registration.additionalDonation) || 0);
  const totalAmount = ticketPrice + additionalDonation;

  const batch = writeBatch(db);

  // 1. Private registration record (PII isolated)
  const regRef = doc(db, 'registrations', regId);
  batch.set(regRef, {
    id: regId,
    eventId,
    userId,
    attendeeName: sanitizeStr(registration.attendeeName, LIMITS.NAME_MAX, 'Guest'),
    attendeeEmail: sanitizeStr(registration.attendeeEmail, LIMITS.EMAIL_MAX, 'guest@example.com'),
    pronouns: sanitizeStr(registration.pronouns, LIMITS.PRONOUNS_MAX, 'they/them'),
    interestedIn: registration.interestedIn || 'all',
    ticketTierId,
    ticketPrice,
    additionalDonation,
    totalAmount,
    bio: sanitizeStr(registration.bio, LIMITS.BIO_MAX),
    avatar: sanitizeAvatar(registration.avatar),
    registeredAt: sanitizeStr(registration.registeredAt, LIMITS.REGISTERED_AT_MAX, 'Just now'),
    ticketCode: sanitizeStr(registration.ticketCode, LIMITS.TICKET_CODE_MAX, `TKT-${Date.now()}`),
    checkedIn: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2. Public non-PII profile for speed dating floor
  const publicRef = doc(db, 'events', eventId, 'publicProfiles', regId);
  batch.set(publicRef, {
    id: regId,
    eventId,
    userId,
    attendeeName: sanitizeStr(registration.attendeeName, LIMITS.NAME_MAX, 'Guest'),
    pronouns: sanitizeStr(registration.pronouns, LIMITS.PRONOUNS_MAX, 'they/them'),
    interestedIn: registration.interestedIn || 'all',
    bio: sanitizeStr(registration.bio, LIMITS.BIO_MAX),
    avatar: sanitizeAvatar(registration.avatar),
    checkedIn: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 3. Atomic event funds & attendee count increment
  const eventRef = doc(db, 'events', eventId);
  batch.update(eventRef, {
    currentFundsRaised: (Number(event.currentFundsRaised) || 0) + totalAmount,
    attendeeCount: (Number(event.attendeeCount) || 0) + 1,
    lastRegistrationId: regId,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `registrations/${regId}`);
  }
}

export async function addOfflineDonationBatch(
  event: CommunityEvent,
  amount: number,
  donorName: string,
  adminUid: string
): Promise<void> {
  const eventId = sanitizeId(event.id, LIMITS.EVENT_ID_MAX);
  const regId = sanitizeId(`reg-sponsor-${Date.now()}`, LIMITS.ID_MAX);
  const cleanAmount = Math.max(1, Number(amount) || 0);
  const cleanDonor = sanitizeStr(donorName, LIMITS.NAME_MAX, 'Community Sponsor');

  const sponsorAvatar: AvatarConfig = {
    skinTone: 'cyber-lilac',
    hairStyle: 'cap',
    hairColor: 'golden',
    eyeStyle: 'shades',
    outfitStyle: 'arcade-jacket',
    outfitColor: 'yellow',
    accessory: 'gold-chain',
    expression: 'love',
  };

  const batch = writeBatch(db);

  batch.set(doc(db, 'registrations', regId), {
    id: regId,
    eventId,
    userId: adminUid,
    attendeeName: cleanDonor,
    attendeeEmail: 'sponsor@community.local',
    pronouns: 'partner',
    interestedIn: 'all',
    ticketTierId: 'tier-sponsor',
    ticketPrice: 0,
    additionalDonation: cleanAmount,
    totalAmount: cleanAmount,
    bio: 'Official Community Business Partner / Match Donor',
    avatar: sponsorAvatar,
    registeredAt: 'Just now',
    ticketCode: `SPONSOR-${Math.floor(100 + Math.random() * 900)}`,
    checkedIn: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(doc(db, 'events', eventId, 'publicProfiles', regId), {
    id: regId,
    eventId,
    userId: adminUid,
    attendeeName: cleanDonor,
    pronouns: 'partner',
    interestedIn: 'all',
    bio: 'Official Community Business Partner / Match Donor',
    avatar: sponsorAvatar,
    checkedIn: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.update(doc(db, 'events', eventId), {
    currentFundsRaised: (Number(event.currentFundsRaised) || 0) + cleanAmount,
    offlineDonations: (Number(event.offlineDonations) || 0) + cleanAmount,
    attendeeCount: (Number(event.attendeeCount) || 0) + 1,
    lastRegistrationId: regId,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `events/${eventId}`);
  }
}

export async function toggleCheckInBatch(
  registration: EventRegistration,
  nextState: boolean
): Promise<void> {
  const regId = sanitizeId(registration.id, LIMITS.ID_MAX);
  const eventId = sanitizeId(registration.eventId, LIMITS.EVENT_ID_MAX);

  const batch = writeBatch(db);
  const regPayload: Record<string, unknown> = {
    checkedIn: nextState,
    updatedAt: serverTimestamp(),
  };
  if (nextState) {
    regPayload.checkedInAt = new Date()
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      .slice(0, 40);
  }

  batch.update(doc(db, 'registrations', regId), regPayload);
  batch.update(doc(db, 'events', eventId, 'publicProfiles', regId), {
    checkedIn: nextState,
    updatedAt: serverTimestamp(),
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `registrations/${regId}`);
  }
}

export async function deleteRegistrationBatch(
  registration: EventRegistration,
  event: CommunityEvent | undefined
): Promise<void> {
  const regId = sanitizeId(registration.id, LIMITS.ID_MAX);
  const eventId = sanitizeId(registration.eventId, LIMITS.EVENT_ID_MAX);

  const batch = writeBatch(db);
  batch.delete(doc(db, 'registrations', regId));
  batch.delete(doc(db, 'events', eventId, 'publicProfiles', regId));

  if (event) {
    batch.update(doc(db, 'events', eventId), {
      currentFundsRaised: Math.max(0, (Number(event.currentFundsRaised) || 0) - registration.totalAmount),
      attendeeCount: Math.max(0, (Number(event.attendeeCount) || 1) - 1),
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `registrations/${regId}`);
  }
}

export async function saveUserProfileInFirestore(
  userId: string,
  profile: PlayerProfile,
  isExisting: boolean
): Promise<void> {
  const path = `users/${userId}`;
  const docRef = doc(db, 'users', userId);

  const baseFields = {
    name: sanitizeStr(profile.name, LIMITS.NAME_MAX),
    pronouns: sanitizeStr(profile.pronouns, LIMITS.PRONOUNS_MAX, 'they/them'),
    interestedIn: profile.interestedIn || 'all',
    vibeTag: sanitizeStr(profile.vibeTag, LIMITS.VIBE_MAX, 'Player 1'),
    bio: sanitizeStr(profile.bio, LIMITS.USER_BIO_MAX),
    favorite8BitGame: sanitizeStr(profile.favorite8BitGame, LIMITS.GAME_MAX),
    avatar: sanitizeAvatar(profile.avatar),
    updatedAt: serverTimestamp(),
  };

  try {
    if (isExisting) {
      await updateDoc(docRef, baseFields);
    } else {
      await setDoc(docRef, {
        userId,
        ...baseFields,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, isExisting ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function saveDateResultInFirestore(
  userId: string,
  eventId: string,
  result: DateResult,
  isExisting: boolean
): Promise<void> {
  const suitorId = sanitizeId(result.suitorId, LIMITS.ID_MAX);
  const cleanEventId = sanitizeId(eventId, LIMITS.EVENT_ID_MAX);
  const path = `users/${userId}/dateResults/${suitorId}`;
  const docRef = doc(db, 'users', userId, 'dateResults', suitorId);

  const playerDecision =
    result.playerDecision === 'like' || result.playerDecision === 'superlike'
      ? result.playerDecision
      : 'pass';

  const fields = {
    playerDecision,
    suitorDecision: result.suitorDecision,
    finalChemistry: Math.min(100, Math.max(0, Number(result.finalChemistry) || 0)),
    playerNotes: sanitizeStr(result.playerNotes, LIMITS.NOTES_MAX),
    isMutualMatch: Boolean(result.isMutualMatch),
    updatedAt: serverTimestamp(),
  };

  try {
    if (isExisting) {
      await updateDoc(docRef, fields);
    } else {
      await setDoc(docRef, {
        userId,
        suitorId,
        eventId: cleanEventId,
        ...fields,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, isExisting ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function clearDateResultsInFirestore(
  userId: string,
  suitorIds: string[]
): Promise<void> {
  if (suitorIds.length === 0) return;
  const batch = writeBatch(db);
  for (const id of suitorIds) {
    batch.delete(doc(db, 'users', userId, 'dateResults', sanitizeId(id, LIMITS.ID_MAX)));
  }
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}/dateResults`);
  }
}

export async function saveMatchMessageInFirestore(
  userId: string,
  msg: StoredMatchMessage
): Promise<void> {
  const msgId = sanitizeId(msg.id, LIMITS.ID_MAX);
  const suitorId = sanitizeId(msg.suitorId, LIMITS.ID_MAX);
  const path = `users/${userId}/matchMessages/${msgId}`;

  const payload: Record<string, unknown> = {
    id: msgId,
    userId,
    suitorId,
    sender: msg.sender,
    text: sanitizeStr(msg.text, LIMITS.MESSAGE_MAX, '...'),
    timestamp: sanitizeStr(msg.timestamp, 40, 'Just now'),
    createdAt: serverTimestamp(),
  };

  if (typeof msg.isDateInvite === 'boolean') {
    payload.isDateInvite = msg.isDateInvite;
  }
  if (typeof msg.dateAccepted === 'boolean') {
    payload.dateAccepted = msg.dateAccepted;
  }

  try {
    await setDoc(doc(db, 'users', userId, 'matchMessages', msgId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
