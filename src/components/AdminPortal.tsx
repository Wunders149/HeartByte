import React, { useState } from 'react';
import { CommunityEvent, EventRegistration, Suitor, DateResult } from '../types/dating';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { ShieldCheck, Lock, KeyRound, ArrowLeft, AlertCircle, Globe } from 'lucide-react';

interface AdminPortalProps {
  events: CommunityEvent[];
  registrations: EventRegistration[];
  suitors: Suitor[];
  dateResults: DateResult[];
  crtEnabled: boolean;
  onToggleCrt: () => void;
  bgmActive: boolean;
  onToggleBgm: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onUpdateEvent: (updatedEvent: CommunityEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenCreateEvent: () => void;
  onToggleCheckIn: (registrationId: string) => void;
  onDeleteRegistration: (registrationId: string) => void;
  onAddOfflineDonation: (eventId: string, amount: number, donorName: string) => void;
  onExitToPublic: () => void;
}

const DEFAULT_ORGANIZER_PIN = 'HEARTBYTE89';
const ORGANIZER_EMAIL = 'razafimahefaphilibert7@gmail.com';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  events,
  registrations,
  suitors,
  dateResults,
  crtEnabled,
  onToggleCrt,
  bgmActive,
  onToggleBgm,
  isMuted,
  onToggleMute,
  language,
  onToggleLanguage,
  onUpdateEvent,
  onDeleteEvent,
  onOpenCreateEvent,
  onToggleCheckIn,
  onDeleteRegistration,
  onAddOfflineDonation,
  onExitToPublic,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('heartbyte_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'speeddating' | 'analytics'>('events');

  const t = TRANSLATIONS[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toUpperCase() === DEFAULT_ORGANIZER_PIN || passcode.trim() === '8888') {
      audio.playMatchFanfare();
      setIsAuthenticated(true);
      sessionStorage.setItem('heartbyte_admin_auth', 'true');
      setErrorMsg(null);
    } else {
      audio.playPass();
      setErrorMsg(language === 'fr' 
        ? 'Code secret invalide. Indice : Utilisez HEARTBYTE89 ou cliquez sur Accès 1-Clic.' 
        : 'Invalid Organizer Keycode. Hint: Use HEARTBYTE89 or click 1-Click Access below.');
    }
  };

  const handleQuickDemoLogin = () => {
    audio.playMatchFanfare();
    setIsAuthenticated(true);
    sessionStorage.setItem('heartbyte_admin_auth', 'true');
    setErrorMsg(null);
  };

  const handleLogout = () => {
    audio.playSelect();
    setIsAuthenticated(false);
    sessionStorage.removeItem('heartbyte_admin_auth');
    onExitToPublic();
  };

  // If not authenticated, render the retro Organizer Gateway
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
        {/* Language switch at top right */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => {
              audio.playSelect();
              onToggleLanguage();
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-retro text-yellow-300 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-pixel text-[10px]">{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-retro-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-slate-900 border-2 border-yellow-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-yellow-400/15 border border-yellow-400/40 rounded-xl text-yellow-400 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-pixel text-yellow-400 tracking-wider uppercase mb-1">
              {t.staffOnlyBadge}
            </div>
            <h2 className="text-xl font-pixel text-slate-100">
              {t.adminPortalTitle}
            </h2>
            <p className="text-xs font-retro text-slate-400 mt-1">
              {t.adminPortalDesc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-pixel text-slate-300 mb-1.5">
                {t.staffKeycodeLabel}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="HEARTBYTE89 / 8888"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs font-pixel text-yellow-300 focus:outline-none focus:border-yellow-400 placeholder:text-slate-600"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-300 font-retro text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-pixel text-xs rounded-lg shadow-md transition-all active:translate-y-0.5"
            >
              {t.verifyUnlockBtn}
            </button>
          </form>

          {/* 1-Click Organizer Quick Demo Access */}
          <div className="mt-5 pt-5 border-t border-slate-800 text-center space-y-3">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-yellow-500/40 text-yellow-300 font-retro text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span>{t.quickAccessBtn} ({ORGANIZER_EMAIL})</span>
            </button>

            <button
              type="button"
              onClick={onExitToPublic}
              className="text-xs font-retro text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'Retourner à l’Application Publique' : 'Return to Public Dater App'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Once authenticated, render full organizer dashboard with dedicated AdminHeader
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col">
      <AdminHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        crtEnabled={crtEnabled}
        onToggleCrt={onToggleCrt}
        bgmActive={bgmActive}
        onToggleBgm={onToggleBgm}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        language={language}
        onToggleLanguage={onToggleLanguage}
        onOpenCreateEvent={onOpenCreateEvent}
        onExitToPublic={onExitToPublic}
      />

      <main className="flex-1">
        <AdminDashboard
          events={events}
          registrations={registrations}
          suitors={suitors}
          dateResults={dateResults}
          language={language}
          onUpdateEvent={onUpdateEvent}
          onDeleteEvent={onDeleteEvent}
          onOpenCreateEvent={onOpenCreateEvent}
          onToggleCheckIn={onToggleCheckIn}
          onDeleteRegistration={onDeleteRegistration}
          onAddOfflineDonation={onAddOfflineDonation}
          onBackToLobby={onExitToPublic}
        />
      </main>

      {/* Admin Bottom Bar */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/95 py-3 px-4 text-center text-xs font-retro text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>{t.footerStaffSession}: {ORGANIZER_EMAIL}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={handleLogout} className="text-yellow-400 hover:underline">
              {t.footerLockLogout}
            </button>
            <span className="text-slate-700">·</span>
            <button onClick={onExitToPublic} className="text-slate-400 hover:underline">
              {t.exitToPublic}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
