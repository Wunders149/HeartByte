import React, { useState } from 'react';
import { CustomModal } from './CustomModal';
import { ShieldCheck, Lock, KeyRound, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
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
const ORGANIZER_EMAIL = 'razafimahefaphilibert7@gmail.com';

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
      onSuccessCreateEvent();
    } else {
      audio.playPass();
      setErrorMsg(
        language === 'fr'
          ? 'Code secret organisateur invalide. Utilisez HEARTBYTE89 ou l’accès 1-clic.'
          : 'Invalid organizer keycode. Use HEARTBYTE89 or 1-click access below.'
      );
    }
  };

  const handleQuickAccess = () => {
    audio.playMatchFanfare();
    sessionStorage.setItem('heartbyte_admin_auth', 'true');
    setErrorMsg(null);
    setPasscode('');
    onSuccessCreateEvent();
  };

  const handleOpenDashboardDirectly = () => {
    audio.playSelect();
    sessionStorage.setItem('heartbyte_admin_auth', 'true');
    if (onSuccessOpenDashboard) {
      onSuccessOpenDashboard();
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
      title={language === 'fr' ? 'Accès Organisateur Vérifié' : 'Organizer Verification'}
      subtitle={
        language === 'fr'
          ? 'Seuls les organisateurs peuvent publier et gérer des soirées de speed dating caritatives.'
          : 'Only authorized organizers can publish and manage community speed dating fundraisers.'
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
              value={passcode}
              onChange={e => {
                setPasscode(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="HEARTBYTE89 / 8888"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs font-pixel text-yellow-300 focus:outline-none focus:border-yellow-400 placeholder:text-slate-600 transition-colors"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 rounded-xl text-rose-300 font-retro text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 px-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{language === 'fr' ? 'Déverrouiller & Créer' : 'Unlock & Create Event'}</span>
          </button>

          <button
            type="button"
            onClick={handleQuickAccess}
            className="w-full min-h-[44px] py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-yellow-500/50 text-yellow-300 font-retro text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            <span>{language === 'fr' ? 'Accès 1-Clic Organisateur' : '1-Click Quick Unlock'}</span>
          </button>
        </div>
      </form>

      {/* Alternative link to open entire dashboard */}
      {onSuccessOpenDashboard && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={handleOpenDashboardDirectly}
            className="text-xs font-retro text-slate-400 hover:text-yellow-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>{language === 'fr' ? 'Ouvrir le Tableau de Bord Organisateur Complet' : 'Open Full Organizer Admin Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </CustomModal>
  );
};
