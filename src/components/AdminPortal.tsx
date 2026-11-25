import React, { useState } from 'react';
import { CommunityEvent, EventRegistration, Suitor, DateResult } from '../types/dating';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { useFirebase } from '../context/FirebaseContext';
import { ADMIN_EMAIL, isFirebaseAdminUser } from '../firebase';
import { Lock, ArrowLeft, AlertCircle, Globe, LogIn } from 'lucide-react';

interface AdminPortalProps {
  events: CommunityEvent[];
  registrations: EventRegistration[];
  suitors: Suitor[];
  dateResults: DateResult[];
  isAuthenticated: boolean;
  onAuthenticated: () => void;
  onLogout: () => void;
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

export const AdminPortal: React.FC<AdminPortalProps> = ({
  events,
  registrations,
  suitors,
  dateResults,
  isAuthenticated,
  onAuthenticated,
  onLogout,
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
  const { user, isAdmin, authLoading, authError, clearAuthError, signIn, logout } = useFirebase();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'speeddating' | 'analytics'>('events');

  const t = TRANSLATIONS[language];

  const handleGoogleLogin = async () => {
    audio.playSelect();
    setErrorMsg(null);
    clearAuthError();

    const signedInUser = await signIn();
    if (!signedInUser) return;

    if (isFirebaseAdminUser(signedInUser)) {
      audio.playMatchFanfare();
      onAuthenticated();
    } else {
      audio.playPass();
      setErrorMsg(
        language === 'fr'
          ? `Accès refusé pour ${signedInUser.email || 'ce compte'}. Seul l’administrateur (${ADMIN_EMAIL}) est autorisé.`
          : `Access denied for ${signedInUser.email || 'this account'}. Only the admin (${ADMIN_EMAIL}) is authorized.`
      );
    }
  };

  const handleLogout = async () => {
    audio.playSelect();
    await logout();
    onLogout();
    onExitToPublic();
  };

  // Require real Firebase Admin auth
  if (!isAuthenticated || !isAdmin) {
    const displayedError = errorMsg || authError;

    return (
      <div className="min-h-[calc(100vh-68px)] flex flex-col items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
        {/* Language switch at top right */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => {
              audio.playSelect();
              onToggleLanguage();
            }}
            className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-retro text-yellow-300 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Globe className="w-4 h-4" />
            <span className="font-pixel text-[10px]">{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-retro-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-slate-900 border-2 border-yellow-500/60 rounded-2xl p-5 sm:p-8 shadow-2xl">
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

          <div className="space-y-4">
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-retro text-slate-300 space-y-1.5">
              <div className="font-pixel text-[10px] text-yellow-400">
                {language === 'fr' ? 'COMPTE ORGANISATEUR AUTORISÉ' : 'AUTHORIZED ORGANIZER ACCOUNT'}
              </div>
              <p className="text-slate-400">
                {language === 'fr'
                  ? `Connectez-vous via Google avec l’adresse ${ADMIN_EMAIL} pour gérer les soirées et inscriptions.`
                  : `Sign in with Google using ${ADMIN_EMAIL} to manage campaigns and attendees.`}
              </p>
              {user && !isAdmin && (
                <div className="text-[11px] text-amber-300 pt-1">
                  {language === 'fr' ? 'Connecté :' : 'Signed in:'} {user.email}
                </div>
              )}
            </div>

            {displayedError && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-lg text-rose-300 font-retro text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{displayedError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full min-h-[48px] py-2.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-slate-950 font-pixel text-xs rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {authLoading
                  ? (language === 'fr' ? 'Connexion...' : 'Signing in...')
                  : (language === 'fr' ? 'Connexion Google Admin' : 'Sign in with Google')}
              </span>
            </button>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onExitToPublic}
              className="min-h-[44px] px-4 text-xs font-retro text-slate-400 hover:text-slate-200 inline-flex items-center justify-center gap-1.5 mx-auto"
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
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
            <span>{t.footerStaffSession}: {user?.email || ADMIN_EMAIL}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={handleLogout} className="min-h-[44px] sm:min-h-0 px-2 text-yellow-400 hover:underline">
              {t.footerLockLogout}
            </button>
            <span className="text-slate-700">·</span>
            <button onClick={onExitToPublic} className="min-h-[44px] sm:min-h-0 px-2 text-slate-400 hover:underline">
              {t.exitToPublic}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
