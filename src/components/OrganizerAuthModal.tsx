import React, { useState } from 'react';
import { CustomModal } from './CustomModal';
import { ShieldCheck, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface OrganizerAuthModalProps {
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
  onSuccessCreateEvent: () => void;
  onSuccessOpenDashboard?: () => void;
}

const DEFAULT_ORGANIZER_PIN = 'HEARTBYTE89';

export const OrganizerAuthModal: React.FC<OrganizerAuthModalProps> = ({
  isOpen,
  language = 'fr',
  onClose,
  onSuccessCreateEvent,
  onSuccessOpenDashboard,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = passcode.trim().toUpperCase();

    if (code === DEFAULT_ORGANIZER_PIN || code === '8888') {
      audio.playMatchFanfare();
      sessionStorage.setItem('heartbyte_admin_auth', 'true');
      setErrorMsg(null);
      setPasscode('');
      if (onSuccessOpenDashboard) {
        onSuccessOpenDashboard();
      } else {
        onSuccessCreateEvent();
      }
    } else {
      audio.playPass();
      setErrorMsg(
        language === 'fr'
          ? 'Code secret administrateur invalide. Seul l’administrateur peut publier.'
          : 'Invalid admin keycode. Only the admin is authorized to post.'
      );
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={() => {
        setErrorMsg(null);
        setPasscode('');
        onClose();
      }}
      title={language === 'fr' ? 'Connexion Administrateur' : 'Admin Verification'}
      subtitle={
        language === 'fr'
          ? 'Seul l’administrateur peut accéder à l’espace de publication et créer des événements.'
          : 'Only the administrator can access the posting console and publish new events.'
      }
      icon={<Lock className="w-5 h-5 text-yellow-400" />}
      badge={t.staffOnlyBadge}
      theme="yellow"
      maxWidth="md"
    >
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-[11px] font-pixel text-slate-300 mb-1.5">
            {t.staffKeycodeLabel}
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              autoFocus
              required
              value={passcode}
              onChange={e => {
                setPasscode(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="••••••••••"
              className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-base sm:text-xs font-pixel text-yellow-300 focus:outline-none focus:border-yellow-400 placeholder:text-slate-600 transition-colors"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 font-retro text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.verifyUnlockBtn}</span>
        </button>
      </form>
    </CustomModal>
  );
};
