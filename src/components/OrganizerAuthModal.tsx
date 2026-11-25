import React, { useState } from 'react';
import { CustomModal } from './CustomModal';
import { ShieldCheck, Lock, AlertCircle, LogIn } from 'lucide-react';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { useFirebase } from '../context/FirebaseContext';
import { ADMIN_EMAIL, isFirebaseAdminUser } from '../firebase';

interface OrganizerAuthModalProps {
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
  onSuccessCreateEvent: () => void;
  onSuccessOpenDashboard?: () => void;
}

export const OrganizerAuthModal: React.FC<OrganizerAuthModalProps> = ({
  isOpen,
  language = 'fr',
  onClose,
  onSuccessCreateEvent,
  onSuccessOpenDashboard,
}) => {
  const { user, isAdmin, authLoading, authError, clearAuthError, signIn } = useFirebase();
  const [localError, setLocalError] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleGoogleAdminSignIn = async () => {
    audio.playSelect();
    setLocalError(null);
    clearAuthError();

    if (isAdmin) {
      audio.playMatchFanfare();
      if (onSuccessOpenDashboard) {
        onSuccessOpenDashboard();
      } else {
        onSuccessCreateEvent();
      }
      return;
    }

    const signedInUser = await signIn();
    if (!signedInUser) return;

    if (isFirebaseAdminUser(signedInUser)) {
      audio.playMatchFanfare();
      if (onSuccessOpenDashboard) {
        onSuccessOpenDashboard();
      } else {
        onSuccessCreateEvent();
      }
    } else {
      audio.playPass();
      setLocalError(
        language === 'fr'
          ? `Accès refusé pour ${signedInUser.email || 'ce compte'}. Seul l’administrateur autorisé (${ADMIN_EMAIL}) peut publier.`
          : `Access denied for ${signedInUser.email || 'this account'}. Only the authorized admin (${ADMIN_EMAIL}) can post.`
      );
    }
  };

  const displayError = localError || authError;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        setLocalError(null);
        clearAuthError();
        onClose();
      }}
      title={language === 'fr' ? 'Connexion Administrateur' : 'Admin Verification'}
      subtitle={
        language === 'fr'
          ? 'Seul l’administrateur vérifié peut accéder à l’espace de publication et créer des événements.'
          : 'Only the verified administrator can access the posting console and publish new events.'
      }
      icon={<Lock className="w-5 h-5 text-yellow-400" />}
      badge={t.staffOnlyBadge}
      theme="yellow"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-retro text-slate-300 space-y-1.5">
          <div className="font-pixel text-[10px] text-yellow-400">
            {language === 'fr' ? 'AUTHENTIFICATION FIREBASE REQUISE' : 'FIREBASE AUTHENTICATION REQUIRED'}
          </div>
          <p className="text-slate-400 leading-relaxed">
            {language === 'fr'
              ? `Connectez-vous avec le compte Google administrateur (${ADMIN_EMAIL}) pour déverrouiller la gestion des événements.`
              : `Sign in with the organizer Google account (${ADMIN_EMAIL}) to unlock campaign management.`}
          </p>
          {user && !isAdmin && (
            <div className="pt-1 text-[11px] text-amber-300">
              {language === 'fr' ? 'Connecté actuellement :' : 'Currently signed in:'} {user.email}
            </div>
          )}
        </div>

        {displayError && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 font-retro text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{displayError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleAdminSignIn}
          disabled={authLoading}
          className="w-full min-h-[48px] py-2.5 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-60 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          <span>
            {authLoading
              ? (language === 'fr' ? 'Vérification...' : 'Verifying...')
              : isAdmin
              ? (language === 'fr' ? 'Ouvrir la Console Admin →' : 'Open Admin Console →')
              : (language === 'fr' ? 'Connexion Google Admin' : 'Sign in with Admin Google')}
          </span>
        </button>
      </div>
    </CustomModal>
  );
};
