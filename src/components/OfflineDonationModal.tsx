import React, { useState } from 'react';
import { CustomModal } from './CustomModal';
import { DollarSign, Building2, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';
import { Language } from '../utils/i18n';
import { CommunityEvent } from '../types/dating';

interface OfflineDonationModalProps {
  isOpen: boolean;
  event: CommunityEvent | null;
  language?: Language;
  onClose: () => void;
  onSubmitDonation: (eventId: string, amount: number, donorName: string) => void;
}

export const OfflineDonationModal: React.FC<OfflineDonationModalProps> = ({
  isOpen,
  event,
  language = 'fr',
  onClose,
  onSubmitDonation,
}) => {
  const [sponsorName, setSponsorName] = useState('');
  const [donationAmount, setDonationAmount] = useState<number>(100);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim() || donationAmount <= 0) return;

    audio.playHeartGain();
    onSubmitDonation(event.id, donationAmount, sponsorName.trim());
    setSponsorName('');
    setDonationAmount(100);
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={language === 'fr' ? 'Don Hors-Ligne & Mécénat' : 'Record Offline Donation / Sponsor Match'}
      subtitle={
        language === 'fr'
          ? `Ajouter des fonds récoltés pour la soirée "${event.title}".`
          : `Credit offline or business sponsor funds toward "${event.title}".`
      }
      icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
      badge={language === 'fr' ? 'MÉCÉNAT ENTREPRISE' : 'SPONSOR MATCH'}
      theme="emerald"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-pixel text-slate-300 mb-1.5">
            {language === 'fr' ? 'Nom du Donateur ou Entreprise Partenaire *' : 'Sponsor / Business Partner Name *'}
          </label>
          <input
            type="text"
            required
            autoFocus
            value={sponsorName}
            onChange={e => setSponsorName(e.target.value)}
            placeholder={language === 'fr' ? 'ex. Café Rétro Paris & Associés' : 'e.g. Local Coffee Roasters Match'}
            className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-base sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="block text-xs font-pixel text-slate-300 mb-1.5">
            {language === 'fr' ? 'Montant du Don ($ USD) *' : 'Donation Amount ($ USD) *'}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-pixel text-emerald-400 text-sm">$</span>
            <input
              type="number"
              min="1"
              step="5"
              required
              value={donationAmount}
              onChange={e => setDonationAmount(Number(e.target.value))}
              className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-base sm:text-xs font-pixel text-emerald-400 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Quick Amount Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-retro text-slate-400 w-full sm:w-auto">{language === 'fr' ? 'Montants rapides :' : 'Quick select:'}</span>
          {[50, 100, 250, 500].map(amount => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                audio.playSelect();
                setDonationAmount(amount);
              }}
              className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-pixel transition-all active:scale-95 tabular-nums ${
                donationAmount === amount
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 border border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[44px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-retro text-xs rounded-xl border border-slate-700 transition-colors active:scale-95"
          >
            {language === 'fr' ? 'Annuler' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Enregistrer le Don →' : 'Credit Donation →'}</span>
          </button>
        </div>
      </form>
    </CustomModal>
  );
};
