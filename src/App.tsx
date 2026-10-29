/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppScreen, AppPortal, PlayerProfile, DateResult, PlayerDecision, CommunityEvent, EventRegistration } from './types/dating';
import { INITIAL_COMMUNITY_EVENTS, INITIAL_REGISTRATIONS } from './data/communityEvents';
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
import { EventRoadmap } from './components/EventRoadmap';
import { MobileBottomNav } from './components/MobileBottomNav';
import { audio } from './utils/audio';
import { Language, TRANSLATIONS } from './utils/i18n';
import { ShieldCheck } from 'lucide-react';

// Clean initial player profile (no fictional demo name/character)
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
    expression: 'idle'
  }
};

// Safe helper to purge cached mock events from previous runs
function getCleanInitialEvents(): CommunityEvent[] {
  try {
    const saved = localStorage.getItem('heartbyte_events');
    if (!saved) return INITIAL_COMMUNITY_EVENTS;
    const parsed = JSON.parse(saved);
    const mockIds = ['starlight-arcade-save', 'neon-shelter-drive', 'whisker-cat-garden', 'downtown-indie-dev'];
    if (Array.isArray(parsed) && parsed.some((e: any) => mockIds.includes(e.id))) {
      localStorage.removeItem('heartbyte_events');
      return [];
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Safe helper to purge cached mock registrations from previous runs
function getCleanInitialRegistrations(): EventRegistration[] {
  try {
    const saved = localStorage.getItem('heartbyte_registrations');
    if (!saved) return INITIAL_REGISTRATIONS;
    const parsed = JSON.parse(saved);
    const mockIds = ['reg-nova', 'reg-kai', 'reg-rowan', 'reg-blaze'];
    if (Array.isArray(parsed) && parsed.some((r: any) => mockIds.includes(r.id))) {
      localStorage.removeItem('heartbyte_registrations');
      return [];
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Safe helper to purge cached mock player profile
function getCleanInitialPlayerProfile(): PlayerProfile {
  try {
    const saved = localStorage.getItem('heartbyte_player_profile');
    if (!saved) return CLEAN_INITIAL_PLAYER_PROFILE;
    const parsed = JSON.parse(saved);
    if (parsed.name === 'Alex Heart') {
      localStorage.removeItem('heartbyte_player_profile');
      return CLEAN_INITIAL_PLAYER_PROFILE;
    }
    return parsed;
  } catch {
    return CLEAN_INITIAL_PLAYER_PROFILE;
  }
}

export default function App() {
  // Top-level portal separation: 'public' (attendees & speed daters) vs 'admin' (organizers)
  const [portal, setPortal] = useState<AppPortal>(() => {
    return (localStorage.getItem('heartbyte_active_portal') as AppPortal) || 'public';
  });

  const [screen, setScreen] = useState<AppScreen>('TITLE');
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(getCleanInitialPlayerProfile);

  // Community Events state
  const [events, setEvents] = useState<CommunityEvent[]>(getCleanInitialEvents);

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    const initialEvents = getCleanInitialEvents();
    return initialEvents[0]?.id || '';
  });

  // Registrations state
  const [registrations, setRegistrations] = useState<EventRegistration[]>(getCleanInitialRegistrations);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerTargetEvent, setRegisterTargetEvent] = useState<CommunityEvent | null>(null);

  // Dating session state
  const [results, setResults] = useState<DateResult[]>([]);
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

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('heartbyte_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('heartbyte_active_portal', portal);
  }, [portal]);

  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));
  };

  useEffect(() => {
    localStorage.setItem('heartbyte_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('heartbyte_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('heartbyte_player_profile', JSON.stringify(playerProfile));
  }, [playerProfile]);

  // Sound toggles
  const handleToggleCrt = () => {
    setCrtEnabled(prev => !prev);
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

  // Handle Event Creation
  const handleCreateEvent = (newEvent: CommunityEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    setActiveEventId(newEvent.id);
    if (portal === 'public') {
      setScreen('EVENT_LOBBY');
    }
  };

  // Handle Event Updates (Admin)
  const handleUpdateEvent = (updatedEvent: CommunityEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  // Handle Event Deletion (Admin)
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    if (activeEventId === eventId && events.length > 1) {
      const remaining = events.filter(e => e.id !== eventId);
      setActiveEventId(remaining[0].id);
    }
  };

  // Handle Offline Donation / Sponsor Match (Admin)
  const handleAddOfflineDonation = (eventId: string, amount: number, donorName: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          currentFundsRaised: evt.currentFundsRaised + amount,
          offlineDonations: (evt.offlineDonations || 0) + amount
        };
      }
      return evt;
    }));

    // Record sponsor registration record
    const sponsorReg: EventRegistration = {
      id: `reg-sponsor-${Date.now()}`,
      eventId,
      attendeeName: donorName,
      attendeeEmail: 'sponsor@community.local',
      pronouns: 'partner',
      interestedIn: 'all',
      ticketTierId: 'tier-sponsor',
      ticketPrice: 0,
      additionalDonation: amount,
      totalAmount: amount,
      registeredAt: 'Just now',
      ticketCode: `SPONSOR-${Math.floor(100 + Math.random() * 900)}`,
      checkedIn: true,
      bio: 'Official Community Business Partner / Match Donor',
      avatar: {
        skinTone: 'cyber-lilac',
        hairStyle: 'cap',
        hairColor: 'golden',
        eyeStyle: 'shades',
        outfitStyle: 'arcade-jacket',
        outfitColor: 'yellow',
        accessory: 'gold-chain',
        expression: 'love'
      }
    };

    setRegistrations(prev => [sponsorReg, ...prev]);
  };

  // Handle Attendee Check-In Toggle (Admin)
  const handleToggleCheckIn = (registrationId: string) => {
    setRegistrations(prev => prev.map(reg => {
      if (reg.id === registrationId) {
        const nextState = !reg.checkedIn;
        if (nextState) {
          audio.playHeartGain();
        } else {
          audio.playPass();
        }
        return {
          ...reg,
          checkedIn: nextState,
          checkedInAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return reg;
    }));
  };

  // Handle Registration Deletion / Refund (Admin)
  const handleDeleteRegistration = (registrationId: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;

    // Deduct amount from event funds
    setEvents(prev => prev.map(evt => {
      if (evt.id === reg.eventId) {
        return {
          ...evt,
          currentFundsRaised: Math.max(0, evt.currentFundsRaised - reg.totalAmount)
        };
      }
      return evt;
    }));

    setRegistrations(prev => prev.filter(r => r.id !== registrationId));
  };

  // Handle User Registration & Donation
  const handleCompleteRegistration = (newRegistration: EventRegistration) => {
    setRegistrations(prev => [newRegistration, ...prev]);
    
    // Update funds raised for the event
    setEvents(prev => prev.map(evt => {
      if (evt.id === newRegistration.eventId) {
        return {
          ...evt,
          currentFundsRaised: evt.currentFundsRaised + newRegistration.totalAmount
        };
      }
      return evt;
    }));
  };

  const openRegisterModalFor = (event: CommunityEvent) => {
    setRegisterTargetEvent(event);
    setIsRegisterModalOpen(true);
  };

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
        setIsCreateModalOpen(true);
      }
      return;
    }
    const alreadyDated = new Set(results.map(r => r.suitorId));
    const remaining = eventSuitors.filter(s => !alreadyDated.has(s.id)).map(s => s.id);
    const queue = remaining.length > 0 ? remaining : eventSuitors.map(s => s.id);

    setDatingQueue(queue);
    setCurrentQueueIndex(0);
    setActiveSuitorId(queue[0]);
    setScreen('SPEED_DATE');
  };

  // Handle completion of a speed date round
  const handleFinishDate = (
    suitorId: string,
    decision: PlayerDecision,
    finalChemistry: number,
    notes: string
  ) => {
    const suitor = allSuitors.find(s => s.id === suitorId);
    const suitorLikedBack = suitor ? finalChemistry >= suitor.minMatchChemistry : false;
    const isMutualMatch = (decision === 'like' || decision === 'superlike') && suitorLikedBack;

    const newResult: DateResult = {
      suitorId,
      playerDecision: decision,
      suitorDecision: suitorLikedBack ? 'like' : 'pass',
      finalChemistry,
      playerNotes: notes,
      isMutualMatch
    };

    setResults(prev => {
      const filtered = prev.filter(r => r.suitorId !== suitorId);
      return [...filtered, newResult];
    });

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
  const handleResetDates = () => {
    setResults([]);
    setCurrentQueueIndex(0);
    setScreen('EVENT_LOBBY');
  };

  const activeEvent = events.find(e => e.id === activeEventId) || events[0] || null;

  // Dynamically compute suitors seated at tables from real registrations for the active event
  const eventSuitors = useMemo(() => {
    if (!activeEvent) return [];
    return registrations
      .filter(r => r.eventId === activeEvent.id)
      .map(r => registrationToSuitor(r, activeEvent, language));
  }, [registrations, activeEvent, language]);

  // All suitors across all registered events
  const allSuitors = useMemo(() => {
    return registrations.map(r => {
      const evt = events.find(e => e.id === r.eventId);
      return registrationToSuitor(r, evt, language);
    });
  }, [registrations, events, language]);

  const currentSuitor = eventSuitors.find(s => s.id === activeSuitorId) || eventSuitors[0] || null;
  const matchedSuitors = allSuitors.filter(s =>
    results.some(r => r.suitorId === s.id && r.isMutualMatch)
  );

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
          onOpenCreateEvent={() => setIsCreateModalOpen(true)}
          onToggleCheckIn={handleToggleCheckIn}
          onDeleteRegistration={handleDeleteRegistration}
          onAddOfflineDonation={handleAddOfflineDonation}
          onExitToPublic={() => setPortal('public')}
        />

        {/* Event Creator Modal: Exclusive to Authenticated Organizers */}
        <EventCreatorModal
          isOpen={isCreateModalOpen}
          language={language}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateEvent={handleCreateEvent}
        />
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

      {/* Screen Views with bottom padding for mobile dock */}
      <main className="flex-1 pb-20 md:pb-6">
        {screen === 'TITLE' && (
          <TitleScreen
            playerProfile={playerProfile}
            featuredSuitors={allSuitors}
            events={events}
            language={language}
            onStartGame={() => setScreen('EVENT_LOBBY')}
            onOpenEventsDirectory={() => setScreen('EVENTS_DIRECTORY')}
            onOpenCreateEvent={() => {
              audio.playSelect();
              setPortal('admin');
            }}
            onOpenAvatarCreator={() => setScreen('AVATAR_CREATOR')}
          />
        )}

        {screen === 'EVENTS_DIRECTORY' && (
          <EventsDirectory
            events={events}
            registrations={registrations}
            activeEventId={activeEventId}
            language={language}
            onSelectEvent={id => setActiveEventId(id)}
            onOpenCreateEvent={() => {
              audio.playSelect();
              setPortal('admin');
            }}
            onOpenRegister={evt => openRegisterModalFor(evt)}
            onEnterDatingFloor={evt => {
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
            registrations={registrations}
            playerProfile={playerProfile}
            language={language}
            onStartDateWith={handleStartDateWith}
            onStartFullEvent={handleStartFullEvent}
            onOpenAvatarCreator={() => setScreen('AVATAR_CREATOR')}
            onOpenMessenger={suitorId => {
              if (suitorId) setActiveSuitorId(suitorId);
              setScreen('MATCH_MESSENGER');
            }}
            onOpenReveal={() => setScreen('MATCH_REVEAL')}
            onOpenRegister={() => {
              if (activeEvent) {
                openRegisterModalFor(activeEvent);
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            onBackToDirectory={() => setScreen('EVENTS_DIRECTORY')}
          />
        )}

        {screen === 'AVATAR_CREATOR' && (
          <AvatarCreator
            profile={playerProfile}
            language={language}
            onSaveProfile={setPlayerProfile}
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
            onOpenMessenger={suitorId => {
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

      {/* Floating Retro Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentScreen={screen}
        onNavigate={handleNavigateScreen}
        matchesCount={matchedSuitors.length}
        language={language}
      />

      {/* Public Retro Bottom Status Bar */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/90 py-3.5 px-4 text-center text-xs font-retro text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            {t.footerCopyright}
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>{t.footerProceeds}</span>
            <span className="text-slate-700">·</span>
            {/* Separate Organizer Entrance */}
            <button
              onClick={() => {
                audio.playSelect();
                setPortal('admin');
              }}
              className="text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1 transition-colors"
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
