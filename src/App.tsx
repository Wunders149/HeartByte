/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  AppScreen,
  AppPortal,
  PlayerProfile,
  DateResult,
  PlayerDecision,
  CommunityEvent,
  EventRegistration,
} from './types/dating';
import { registrationToSuitor } from './utils/suitorGenerator';
import { PublicHeader } from './components/PublicHeader';
import { TitleScreen } from './components/TitleScreen';
import { EventsDirectory } from './components/EventsDirectory';
import { EventLobby } from './components/EventLobby';
import { AvatarCreator } from './components/AvatarCreator';
import { SpeedDateTable } from './components/SpeedDateTable';
import { MatchRevealScreen } from './components/MatchRevealScreen';
import { MatchMessenger } from './components/MatchMessenger';
import { RegistrationModal } from './components/RegistrationModal';
import { EventCreatorModal } from './components/EventCreatorModal';
import { AdminPortal } from './components/AdminPortal';
import { OrganizerAuthModal } from './components/OrganizerAuthModal';
import { EventRoadmap } from './components/EventRoadmap';
import { MobileBottomNav } from './components/MobileBottomNav';
import { audio } from './utils/audio';
import { Language, TRANSLATIONS } from './utils/i18n';
import { useFirebase } from './context/FirebaseContext';
import {
  addOfflineDonationBatch,
  clearDateResultsInFirestore,
  createEventInFirestore,
  createRegistrationBatch,
  deleteEventInFirestore,
  deleteRegistrationBatch,
  saveDateResultInFirestore,
  saveMatchMessageInFirestore,
  saveUserProfileInFirestore,
  StoredMatchMessage,
  subscribeToDateResults,
  subscribeToEventPublicProfiles,
  subscribeToEvents,
  subscribeToMatchMessages,
  subscribeToRegistrations,
  subscribeToUserProfile,
  toggleCheckInBatch,
  updateEventInFirestore,
} from './utils/firestoreSync';
import { ShieldCheck } from 'lucide-react';

const CLEAN_INITIAL_PLAYER_PROFILE: PlayerProfile = {
  name: '',
  pronouns: 'they/them',
  interestedIn: 'all',
  vibeTag: 'Player 1',
  bio: '',
  favorite8BitGame: '',
  avatar: {
    skinTone: 'peach',
    hairStyle: 'spiky',
    hairColor: 'neon-cyan',
    eyeStyle: 'wink',
    outfitStyle: 'arcade-jacket',
    outfitColor: 'magenta',
    accessory: 'headphones',
    expression: 'idle',
  },
};

export default function App() {
  const { user, isAuthReady, isAdmin } = useFirebase();

  const [portal, setPortal] = useState<AppPortal>(() => {
    return (localStorage.getItem('heartbyte_active_portal') as AppPortal) || 'public';
  });

  const [screen, setScreen] = useState<AppScreen>('TITLE');
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(CLEAN_INITIAL_PLAYER_PROFILE);
  const [hasRemoteProfile, setHasRemoteProfile] = useState(false);

  // Firestore-backed collections
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>('');
  const [publicProfiles, setPublicProfiles] = useState<EventRegistration[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [results, setResults] = useState<DateResult[]>([]);
  const [storedMessages, setStoredMessages] = useState<StoredMatchMessage[]>([]);

  // Modals & Admin Session
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOrganizerAuthOpen, setIsOrganizerAuthOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerTargetEvent, setRegisterTargetEvent] = useState<CommunityEvent | null>(null);

  // Dating session queue state
  const [activeSuitorId, setActiveSuitorId] = useState<string>('');
  const [datingQueue, setDatingQueue] = useState<string[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);

  // Language state ('en' or 'fr') - defaults to French 'fr'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('heartbyte_lang') as Language;
    return saved === 'en' ? 'en' : 'fr';
  });

  // Retro Display & Audio Settings
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [bgmActive, setBgmActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('heartbyte_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('heartbyte_active_portal', portal);
  }, [portal]);

  // Attach Firestore listeners ONLY when auth is ready and user is authenticated
  useEffect(() => {
    if (!isAuthReady) return;

    if (!user) {
      setEvents([]);
      setPublicProfiles([]);
      setRegistrations([]);
      setResults([]);
      setStoredMessages([]);
      setHasRemoteProfile(false);
      setPlayerProfile(CLEAN_INITIAL_PLAYER_PROFILE);
      return;
    }

    const unsubEvents = subscribeToEvents(isAdmin, (loadedEvents) => {
      setEvents(loadedEvents);
      setActiveEventId((prev) => {
        if (prev && loadedEvents.some((e) => e.id === prev)) return prev;
        return loadedEvents[0]?.id || '';
      });
    });

    const unsubRegistrations = subscribeToRegistrations(user.uid, isAdmin, (loadedRegs) => {
      setRegistrations(loadedRegs);
    });

    const unsubProfile = subscribeToUserProfile(user.uid, (remoteProfile) => {
      if (remoteProfile) {
        setPlayerProfile(remoteProfile);
        setHasRemoteProfile(true);
      } else {
        setHasRemoteProfile(false);
        setPlayerProfile((prev) => ({
          ...CLEAN_INITIAL_PLAYER_PROFILE,
          ...prev,
          name: prev.name || user.displayName || '',
        }));
      }
    });

    const unsubResults = subscribeToDateResults(user.uid, (loadedResults) => {
      setResults(loadedResults);
    });

    const unsubMessages = subscribeToMatchMessages(user.uid, (loadedMsgs) => {
      setStoredMessages(loadedMsgs);
    });

    return () => {
      unsubEvents();
      unsubRegistrations();
      unsubProfile();
      unsubResults();
      unsubMessages();
    };
  }, [isAuthReady, user, isAdmin]);

  // Subscribe to non-PII public attendee booth profiles for the active event
  useEffect(() => {
    if (!isAuthReady || !user || !activeEventId) {
      setPublicProfiles([]);
      return;
    }

    const unsubProfiles = subscribeToEventPublicProfiles(activeEventId, (profiles) => {
      setPublicProfiles(profiles);
    });

    return () => {
      unsubProfiles();
    };
  }, [isAuthReady, user, activeEventId]);

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const handleToggleCrt = () => {
    setCrtEnabled((prev) => !prev);
  };

  const handleToggleBgm = () => {
    const active = audio.toggleBgm();
    setBgmActive(active);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.setMuted(nextMuted);
    if (nextMuted) setBgmActive(false);
  };

  // Admin Only: Create Event
  const handleCreateEvent = async (newEvent: CommunityEvent) => {
    if (!isAdmin || !user || portal !== 'admin') return;
    await createEventInFirestore(newEvent, user.uid);
    setActiveEventId(newEvent.id);
  };

  // Admin Only: Update Event
  const handleUpdateEvent = async (updatedEvent: CommunityEvent) => {
    if (!isAdmin) return;
    await updateEventInFirestore(updatedEvent);
  };

  // Admin Only: Delete Event
  const handleDeleteEvent = async (eventId: string) => {
    if (!isAdmin) return;
    await deleteEventInFirestore(eventId);
    if (activeEventId === eventId && events.length > 1) {
      const remaining = events.filter((e) => e.id !== eventId);
      setActiveEventId(remaining[0]?.id || '');
    }
  };

  // Admin Only: Offline Donation / Sponsor Match
  const handleAddOfflineDonation = async (eventId: string, amount: number, donorName: string) => {
    if (!isAdmin || !user) return;
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;
    await addOfflineDonationBatch(evt, amount, donorName, user.uid);
  };

  // Admin Only: Attendee Check-In Toggle
  const handleToggleCheckIn = async (registrationId: string) => {
    if (!isAdmin) return;
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;
    const nextState = !reg.checkedIn;
    if (nextState) {
      audio.playHeartGain();
    } else {
      audio.playPass();
    }
    await toggleCheckInBatch(reg, nextState);
  };

  // Admin Only: Delete / Refund Registration
  const handleDeleteRegistration = async (registrationId: string) => {
    if (!isAdmin) return;
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;
    const evt = events.find((e) => e.id === reg.eventId);
    await deleteRegistrationBatch(reg, evt);
  };

  // Authenticated User: Complete Registration & Donation Atomically
  const handleCompleteRegistration = async (newRegistration: EventRegistration) => {
    if (!user) return;
    const targetEvt = events.find((e) => e.id === newRegistration.eventId);
    if (!targetEvt) return;
    await createRegistrationBatch(newRegistration, targetEvt, user.uid);
  };

  const handleSaveProfile = async (nextProfile: PlayerProfile) => {
    setPlayerProfile(nextProfile);
    if (user) {
      await saveUserProfileInFirestore(user.uid, nextProfile, hasRemoteProfile);
    }
  };

  const openRegisterModalFor = (event: CommunityEvent) => {
    setRegisterTargetEvent(event);
    setIsRegisterModalOpen(true);
  };

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0] || null;

  // Use non-PII publicProfiles for the active event floor; fallback to user's own registrations if needed
  const activeEventAttendees = useMemo(() => {
    if (!activeEvent) return [];
    if (publicProfiles.length > 0) return publicProfiles;
    return registrations.filter((r) => r.eventId === activeEvent.id);
  }, [publicProfiles, registrations, activeEvent]);

  const eventSuitors = useMemo(() => {
    if (!activeEvent) return [];
    return activeEventAttendees.map((r) => registrationToSuitor(r, activeEvent, language));
  }, [activeEventAttendees, activeEvent, language]);

  const allSuitors = useMemo(() => {
    const mergedMap = new Map<string, EventRegistration>();
    registrations.forEach((r) => mergedMap.set(r.id, r));
    publicProfiles.forEach((p) => {
      if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
    });
    return Array.from(mergedMap.values()).map((r) => {
      const evt = events.find((e) => e.id === r.eventId);
      return registrationToSuitor(r, evt, language);
    });
  }, [registrations, publicProfiles, events, language]);

  const currentSuitor = eventSuitors.find((s) => s.id === activeSuitorId) || eventSuitors[0] || null;
  const matchedSuitors = allSuitors.filter((s) =>
    results.some((r) => r.suitorId === s.id && r.isMutualMatch)
  );

  // Start Speed Dating with a specific suitor
  const handleStartDateWith = (suitorId: string) => {
    setActiveSuitorId(suitorId);
    setDatingQueue([suitorId]);
    setCurrentQueueIndex(0);
    setScreen('SPEED_DATE');
  };

  // Start Full Speed Dating Event
  const handleStartFullEvent = () => {
    if (eventSuitors.length === 0) {
      if (activeEvent) {
        openRegisterModalFor(activeEvent);
      } else {
        setScreen('EVENTS_DIRECTORY');
      }
      return;
    }
    const alreadyDated = new Set(results.map((r) => r.suitorId));
    const remaining = eventSuitors.filter((s) => !alreadyDated.has(s.id)).map((s) => s.id);
    const queue = remaining.length > 0 ? remaining : eventSuitors.map((s) => s.id);

    setDatingQueue(queue);
    setCurrentQueueIndex(0);
    setActiveSuitorId(queue[0]);
    setScreen('SPEED_DATE');
  };

  // Handle completion of a speed date round
  const handleFinishDate = async (
    suitorId: string,
    decision: PlayerDecision,
    finalChemistry: number,
    notes: string
  ) => {
    const suitor = allSuitors.find((s) => s.id === suitorId);
    const suitorLikedBack = suitor ? finalChemistry >= suitor.minMatchChemistry : false;
    const isMutualMatch = (decision === 'like' || decision === 'superlike') && suitorLikedBack;

    const newResult: DateResult = {
      suitorId,
      playerDecision: decision,
      suitorDecision: suitorLikedBack ? 'like' : 'pass',
      finalChemistry,
      playerNotes: notes,
      isMutualMatch,
    };

    const existing = results.some((r) => r.suitorId === suitorId);
    setResults((prev) => {
      const filtered = prev.filter((r) => r.suitorId !== suitorId);
      return [...filtered, newResult];
    });

    if (user && activeEvent) {
      void saveDateResultInFirestore(user.uid, activeEvent.id, newResult, existing);
    }

    if (currentQueueIndex + 1 < datingQueue.length) {
      const nextIdx = currentQueueIndex + 1;
      setCurrentQueueIndex(nextIdx);
      setActiveSuitorId(datingQueue[nextIdx]);
    } else {
      setScreen('MATCH_REVEAL');
    }
  };

  // Skip current date and advance
  const handleSkipDate = () => {
    audio.playPass();
    if (currentQueueIndex + 1 < datingQueue.length) {
      const nextIdx = currentQueueIndex + 1;
      setCurrentQueueIndex(nextIdx);
      setActiveSuitorId(datingQueue[nextIdx]);
    } else {
      if (results.length > 0) {
        setScreen('MATCH_REVEAL');
      } else {
        setScreen('EVENT_LOBBY');
      }
    }
  };

  // Safe roadmap & navigation router
  const handleNavigateScreen = (targetScreen: AppScreen) => {
    if (targetScreen === 'SPEED_DATE') {
      if (eventSuitors.length === 0) {
        setScreen('EVENT_LOBBY');
        return;
      }
      if (datingQueue.length === 0 || currentQueueIndex >= datingQueue.length) {
        handleStartFullEvent();
        return;
      }
    }
    setScreen(targetScreen);
  };

  // Reset all speed dating progress
  const handleResetDates = async () => {
    const suitorIds = results.map((r) => r.suitorId);
    setResults([]);
    setCurrentQueueIndex(0);
    setScreen('EVENT_LOBBY');
    if (user && suitorIds.length > 0) {
      await clearDateResultsInFirestore(user.uid, suitorIds);
    }
  };

  const t = TRANSLATIONS[language];

  // If currently in Admin Portal, render the dedicated Admin environment
  if (portal === 'admin') {
    return (
      <>
        <AdminPortal
          events={events}
          registrations={registrations}
          suitors={allSuitors}
          dateResults={results}
          isAuthenticated={isAdmin}
          onAuthenticated={() => {}}
          onLogout={() => {
            setIsCreateModalOpen(false);
          }}
          crtEnabled={crtEnabled}
          onToggleCrt={handleToggleCrt}
          bgmActive={bgmActive}
          onToggleBgm={handleToggleBgm}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          onOpenCreateEvent={() => {
            if (isAdmin) setIsCreateModalOpen(true);
          }}
          onToggleCheckIn={handleToggleCheckIn}
          onDeleteRegistration={handleDeleteRegistration}
          onAddOfflineDonation={handleAddOfflineDonation}
          onExitToPublic={() => setPortal('public')}
        />

        {/* Event Creator Modal: Exclusive to Verified Admins */}
        {isAdmin && (
          <EventCreatorModal
            isOpen={isCreateModalOpen}
            language={language}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateEvent={handleCreateEvent}
          />
        )}
      </>
    );
  }

  // Otherwise render the Public Dater App
  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col relative">
      {/* Optional CRT Scanlines Effect Overlay */}
      {crtEnabled && <div className="fixed inset-0 crt-overlay pointer-events-none z-50" />}
      {crtEnabled && <div className="fixed inset-0 crt-vignette pointer-events-none z-40" />}

      {/* Public Top Bar Navigation */}
      <PublicHeader
        currentScreen={screen}
        onNavigate={handleNavigateScreen}
        matchesCount={matchedSuitors.length}
        crtEnabled={crtEnabled}
        onToggleCrt={handleToggleCrt}
        bgmActive={bgmActive}
        onToggleBgm={handleToggleBgm}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onStartSpeedDating={handleStartFullEvent}
      />

      {/* Visual Event Workflow Roadmap ("Work Road") */}
      <EventRoadmap
        currentScreen={screen}
        onNavigate={handleNavigateScreen}
        language={language}
        datesCompletedCount={results.length}
        totalDatesCount={eventSuitors.length}
        matchesCount={matchedSuitors.length}
        hasRegistered={registrations.length > 0}
      />

      {/* Screen Views */}
      <main className="flex-1 pb-6">
        {screen === 'TITLE' && (
          <TitleScreen
            playerProfile={playerProfile}
            featuredSuitors={allSuitors}
            events={events}
            language={language}
            onStartGame={() => setScreen('EVENT_LOBBY')}
            onOpenEventsDirectory={() => setScreen('EVENTS_DIRECTORY')}
            onOpenAvatarCreator={() => setScreen('AVATAR_CREATOR')}
          />
        )}

        {screen === 'EVENTS_DIRECTORY' && (
          <EventsDirectory
            events={events}
            registrations={registrations}
            activeEventId={activeEventId}
            language={language}
            onSelectEvent={(id) => setActiveEventId(id)}
            onOpenRegister={(evt) => openRegisterModalFor(evt)}
            onEnterDatingFloor={(evt) => {
              setActiveEventId(evt.id);
              setScreen('EVENT_LOBBY');
            }}
          />
        )}

        {screen === 'EVENT_LOBBY' && (
          <EventLobby
            event={activeEvent}
            suitors={eventSuitors}
            results={results}
            registrations={activeEventAttendees}
            playerProfile={playerProfile}
            language={language}
            onStartDateWith={handleStartDateWith}
            onStartFullEvent={handleStartFullEvent}
            onOpenAvatarCreator={() => setScreen('AVATAR_CREATOR')}
            onOpenMessenger={(suitorId) => {
              if (suitorId) setActiveSuitorId(suitorId);
              setScreen('MATCH_MESSENGER');
            }}
            onOpenReveal={() => setScreen('MATCH_REVEAL')}
            onOpenRegister={() => {
              if (activeEvent) {
                openRegisterModalFor(activeEvent);
              } else {
                setScreen('EVENTS_DIRECTORY');
              }
            }}
            onBackToDirectory={() => setScreen('EVENTS_DIRECTORY')}
          />
        )}

        {screen === 'AVATAR_CREATOR' && (
          <AvatarCreator
            profile={playerProfile}
            language={language}
            onSaveProfile={handleSaveProfile}
            onStartDating={() => setScreen('EVENT_LOBBY')}
          />
        )}

        {screen === 'SPEED_DATE' && (
          <SpeedDateTable
            suitor={currentSuitor}
            playerProfile={playerProfile}
            dateNumber={currentQueueIndex + 1}
            totalDates={datingQueue.length || 1}
            language={language}
            onFinishDate={handleFinishDate}
            onSkipToNext={handleSkipDate}
            onExitToLobby={() => setScreen('EVENT_LOBBY')}
          />
        )}

        {screen === 'MATCH_REVEAL' && (
          <MatchRevealScreen
            results={results}
            suitors={allSuitors}
            playerProfile={playerProfile}
            language={language}
            onOpenMessenger={(suitorId) => {
              if (suitorId) setActiveSuitorId(suitorId);
              setScreen('MATCH_MESSENGER');
            }}
            onResetDates={handleResetDates}
            onBackToLobby={() => setScreen('EVENT_LOBBY')}
          />
        )}

        {screen === 'MATCH_MESSENGER' && (
          <MatchMessenger
            matchedSuitors={matchedSuitors}
            playerProfile={playerProfile}
            initialSuitorId={activeSuitorId}
            language={language}
            storedMessages={storedMessages}
            onPersistMessage={(suitorId, msg) => {
              if (user) {
                void saveMatchMessageInFirestore(user.uid, {
                  id: msg.id,
                  userId: user.uid,
                  suitorId,
                  sender: msg.sender,
                  text: msg.text,
                  timestamp: msg.timestamp,
                  isDateInvite: msg.isDateInvite,
                  dateAccepted: msg.dateAccepted,
                });
              }
            }}
            onBackToLobby={() => setScreen('EVENT_LOBBY')}
            onOpenReveal={() => setScreen('MATCH_REVEAL')}
          />
        )}
      </main>

      {/* User Registration & Ticket Purchase Modal */}
      {registerTargetEvent && (
        <RegistrationModal
          event={registerTargetEvent}
          playerProfile={playerProfile}
          isOpen={isRegisterModalOpen}
          language={language}
          onClose={() => {
            setIsRegisterModalOpen(false);
            setRegisterTargetEvent(null);
          }}
          onCompleteRegistration={handleCompleteRegistration}
        />
      )}

      {/* Custom Admin Authentication Modal Pop Up */}
      <OrganizerAuthModal
        isOpen={isOrganizerAuthOpen}
        language={language}
        onClose={() => setIsOrganizerAuthOpen(false)}
        onSuccessCreateEvent={() => {
          setIsOrganizerAuthOpen(false);
          setPortal('admin');
          setIsCreateModalOpen(true);
        }}
        onSuccessOpenDashboard={() => {
          setIsOrganizerAuthOpen(false);
          setPortal('admin');
        }}
      />

      {/* Floating Retro Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentScreen={screen}
        onNavigate={handleNavigateScreen}
        matchesCount={matchedSuitors.length}
        language={language}
      />

      {/* Public Retro Bottom Status Bar (Clearance above mobile bottom nav) */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/90 pt-3.5 pb-24 md:pb-3.5 px-4 text-center text-xs font-retro text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div>{t.footerCopyright}</div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px]">
            <span>{t.footerProceeds}</span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            {/* Separate Admin Entrance via Custom Modal */}
            <button
              onClick={() => {
                audio.playSelect();
                if (isAdmin) {
                  setPortal('admin');
                } else {
                  setIsOrganizerAuthOpen(true);
                }
              }}
              className="min-h-[44px] sm:min-h-0 px-3 sm:px-0 text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.footerOrganizerLink}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
