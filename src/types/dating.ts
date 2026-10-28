export type HairStyle = 'spiky' | 'bob' | 'pixie' | 'afro' | 'long' | 'cap' | 'fade';
export type HairColor = 'neon-cyan' | 'neon-pink' | 'raven' | 'golden' | 'ruby' | 'lavender' | 'emerald';
export type SkinTone = 'fair' | 'peach' | 'warm-tan' | 'deep-bronze' | 'cyber-lilac' | 'alien-mint';
export type EyeStyle = 'normal' | 'wink' | 'shades' | 'round-glasses' | 'sparkle' | 'sleepy';
export type OutfitStyle = 'arcade-jacket' | 'cyber-turtleneck' | 'cozy-sweater' | 'vintage-shirt' | 'hoodie';
export type OutfitColor = 'cyan' | 'magenta' | 'yellow' | 'purple' | 'emerald' | 'crimson';
export type Accessory = 'none' | 'headphones' | 'cat-ears' | 'bandana' | 'gold-chain' | 'boba';
export type Expression = 'idle' | 'happy' | 'blush' | 'shock' | 'love' | 'skeptical';

export interface AvatarConfig {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  eyeStyle: EyeStyle;
  outfitStyle: OutfitStyle;
  outfitColor: OutfitColor;
  accessory: Accessory;
  expression: Expression;
}

export interface DialogueChoice {
  id: string;
  text: string;
  chemistryChange: number; // e.g. +20, -10
  suitorResponse: string;
  resultingExpression: Expression;
  reactionTag: 'smooth' | 'funny' | 'awkward' | 'spicy';
}

export interface DateRound {
  prompt: string;
  suitorSays: string;
  choices: DialogueChoice[];
}

export interface Suitor {
  id: string;
  name: string;
  age: number;
  title: string;
  gender: 'men' | 'women' | 'nonbinary';
  archetype: string;
  bio: string;
  flirtingStyle: string;
  favoriteSnack: string;
  redFlag: string;
  greenFlag: string;
  initialChemistry: number;
  avatar: AvatarConfig;
  rounds: [DateRound, DateRound, DateRound];
  // Minimum chemistry needed for the suitor to say YES to the player!
  minMatchChemistry: number;
  matchMessage: string;
  rejectionMessage: string;
  inviteDateLocation: string;
  secondDateActivity: string;
}

export type PlayerDecision = 'like' | 'pass' | 'superlike' | null;

export interface DateResult {
  suitorId: string;
  playerDecision: PlayerDecision;
  suitorDecision: 'like' | 'pass';
  finalChemistry: number;
  playerNotes: string;
  isMutualMatch: boolean;
}

export interface PlayerProfile {
  name: string;
  pronouns: string;
  interestedIn: 'all' | 'men' | 'women' | 'nonbinary';
  vibeTag: string;
  bio: string;
  favorite8BitGame: string;
  avatar: AvatarConfig;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string;
  isPopular?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  pronouns: string;
  interestedIn: 'all' | 'men' | 'women' | 'nonbinary';
  ticketTierId: string;
  ticketPrice: number;
  additionalDonation: number;
  totalAmount: number;
  avatar: AvatarConfig;
  bio: string;
  registeredAt: string;
  ticketCode: string;
  checkedIn?: boolean;
  checkedInAt?: string;
}

export type CauseCategory = 'arts' | 'community' | 'environment' | 'education' | 'tech';
export type EventStatus = 'draft' | 'open' | 'active' | 'completed';

export interface CommunityEvent {
  id: string;
  title: string;
  subtitle: string;
  causeCategory: CauseCategory;
  description: string;
  beneficiaryName: string;
  fundraisingGoal: number;
  currentFundsRaised: number;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  maxCapacity: number;
  ticketTiers: TicketTier[];
  creatorName: string;
  customCausePrompt?: string;
  status?: EventStatus;
  offlineDonations?: number;
}

export interface AdminSession {
  isAuthenticated: boolean;
  adminEmail: string;
  role: 'organizer' | 'superadmin';
}

export type AppPortal = 'public' | 'admin';

export type AppScreen = 
  | 'TITLE'
  | 'EVENTS_DIRECTORY'
  | 'EVENT_LOBBY'
  | 'CREATE_EVENT'
  | 'REGISTER_EVENT'
  | 'AVATAR_CREATOR'
  | 'SPEED_DATE'
  | 'DATE_SUMMARY'
  | 'MATCH_REVEAL'
  | 'MATCH_MESSENGER'
  | 'ADMIN_DASHBOARD';
