import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CommunityEvent, EventRegistration, PlayerProfile } from '../types/dating';
import { PixelAvatar } from './PixelAvatar';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { X, Check, Ticket, Heart, Sparkles, Building2, QrCode } from 'lucide-react';

interface RegistrationModalProps {
  event: CommunityEvent;
  playerProfile: PlayerProfile;
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
  onCompleteRegistration: (registration: EventRegistration) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  playerProfile,
  isOpen,
  language = 'fr',
  onClose,
  onCompleteRegistration,
}) => {
  const [selectedTierId, setSelectedTierId] = useState<string>(
    event.ticketTiers[0]?.id || ''
  );
  const [additionalDonation, setAdditionalDonation] = useState<number>(10);
  const [attendeeName, setAttendeeName] = useState<string>(playerProfile.name || '');
  const [attendeeEmail, setAttendeeEmail] = useState<string>('alex.heart@example.com');
  const [pronouns, setPronouns] = useState<string>(playerProfile.pronouns || 'they/them');
  const [interestedIn, setInterestedIn] = useState<PlayerProfile['interestedIn']>(playerProfile.interestedIn || 'all');
  const [datingBio, setDatingBio] = useState<string>(
    language === 'fr' 
      ? 'Ravi(e) de soutenir cette cause et de faire de belles rencontres !' 
      : (playerProfile.bio || 'Excited to support this cause and meet lovely people!')
  );
  const [ticketIssued, setTicketIssued] = useState<EventRegistration | null>(null);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const selectedTier = event.ticketTiers.find(t => t.id === selectedTierId) || event.ticketTiers[0];
  const ticketPrice = selectedTier?.price || 15;
  const totalAmount = ticketPrice + additionalDonation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeeEmail.trim()) return;

    audio.playMatchFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#ec4899', '#38bdf8', '#facc15']
    });

    const randomCode = `${event.id.slice(0, 4).toUpperCase()}-${attendeeName.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newRegistration: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      attendeeName: attendeeName.trim(),
      attendeeEmail: attendeeEmail.trim(),
      pronouns,
      interestedIn,
      ticketTierId: selectedTier.id,
      ticketPrice,
      additionalDonation,
      totalAmount,
      avatar: playerProfile.avatar,
      bio: datingBio,
      registeredAt: 'Just now',
      ticketCode: randomCode,
    };

    setTicketIssued(newRegistration);
    onCompleteRegistration(newRegistration);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-pink-500 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button with 44px touch target */}
        <button
          onClick={() => {
            audio.playSelect();
            onClose();
          }}
          aria-label="Close registration dialog"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {ticketIssued ? (
          /* Ticket Confirmation Screen */
          <div className="text-center py-2 sm:py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-500/50 rounded-full font-retro text-xs text-emerald-300 mb-3">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.confirmedBadge}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-pixel text-pink-400 mb-2">
              {t.confirmedTitle}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-retro mb-6 max-w-md mx-auto">
              {language === 'fr'
                ? <>Merci d’avoir contribué à hauteur de <strong>${ticketIssued.totalAmount}</strong> pour {event.beneficiaryName} ! Votre billet a été émis.</>
                : <>Thank you for contributing <strong>${ticketIssued.totalAmount}</strong> to {event.beneficiaryName}! Your ticket has been issued.</>}
            </p>

            {/* Retro 8-Bit Ticket Stub */}
            <div className="relative bg-slate-950 border-4 border-dashed border-yellow-400 rounded-xl p-4 sm:p-6 text-left shadow-xl max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <div className="font-pixel text-[10px] text-yellow-400">{t.passTicketBadge}</div>
                  <div className="font-pixel text-xs sm:text-sm text-slate-100">{event.title}</div>
                </div>
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>

              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg shrink-0">
                  <PixelAvatar avatar={ticketIssued.avatar} size="sm" />
                </div>
                <div>
                  <div className="font-pixel text-xs text-slate-200">{ticketIssued.attendeeName}</div>
                  <div className="text-xs font-retro text-cyan-400">{ticketIssued.pronouns} · {selectedTier.name}</div>
                  <div className="text-[11px] font-retro text-emerald-400 mt-1">
                    {language === 'fr' ? 'Don effectué :' : 'Donated:'} ${ticketIssued.totalAmount}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-retro text-slate-400 border-t border-slate-800 pt-3">
                <div>
                  <span className="block text-slate-500 text-[10px]">{language === 'fr' ? 'DATE & LIEU :' : 'DATE & VENUE:'}</span>
                  <span className="truncate block">{event.date} · {event.venueName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-500 text-[10px]">{t.ticketCodeLabel}</span>
                  <span className="font-pixel text-yellow-400 text-xs">{ticketIssued.ticketCode}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playSelect();
                onClose();
              }}
              className="min-h-[44px] px-6 py-2.5 bg-pink-500 hover:bg-pink-400 font-pixel text-xs text-slate-950 rounded-lg shadow-md transition-all active:translate-y-0.5"
            >
              {t.enterLobbyBtn}
            </button>
          </div>
        ) : (
          /* Registration & Donation Form */
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <div className="text-[11px] font-retro text-cyan-400 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{t.regModalBadge}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-pixel text-pink-400">
                {t.registerSpeedDatingTitle}
              </h2>
              <p className="text-xs text-slate-400 font-retro mt-1">
                {event.title} · {language === 'fr' ? 'Au profit de' : 'Benefiting'} {event.beneficiaryName}
              </p>
            </div>

            {/* Step 1: Select Ticket Tier */}
            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-2">
                {t.step1Tier}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {event.ticketTiers.map(tier => {
                  const isSelected = selectedTierId === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        audio.playSelect();
                        setSelectedTierId(tier.id);
                      }}
                      className={`min-h-[64px] text-left p-3 sm:p-3.5 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-pink-500 bg-pink-950/40 text-slate-100 shadow'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {tier.isPopular && (
                        <div className="absolute -top-2.5 right-2 bg-yellow-400 text-slate-950 font-pixel text-[9px] px-2 py-0.5 rounded-full">
                          {language === 'fr' ? 'POPULAIRE' : 'POPULAR'}
                        </div>
                      )}
                      <div>
                        <div className="font-pixel text-xs text-slate-200 mb-1">
                          {tier.name}
                        </div>
                        <div className="text-sm font-pixel text-emerald-400 mb-1.5">
                          ${tier.price}
                        </div>
                        <div className="text-[11px] font-retro text-slate-400 leading-snug">
                          {tier.perks}
                        </div>
                      </div>
                      <div className="mt-2.5 text-[10px] font-retro text-cyan-400">
                        {isSelected ? (language === 'fr' ? '✓ Sélectionné' : '✓ Selected') : (language === 'fr' ? 'Choisir ce palier' : 'Choose tier')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Additional Community Donation */}
            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-2">
                {t.step2Donation}
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 5, 15, 25, 50].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      audio.playSelect();
                      setAdditionalDonation(amt);
                    }}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg border text-xs font-retro transition-all active:scale-95 flex items-center justify-center ${
                      additionalDonation === amt
                        ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 font-bold ring-1 ring-emerald-400/50'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {amt === 0 ? (language === 'fr' ? 'Aucun don en plus' : 'No extra') : `+$${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Attendee Details & Speed Dating Preferences */}
            <div className="border-t border-slate-800 pt-5">
              <label className="block text-xs font-pixel text-slate-300 mb-3">
                {t.step3Profile}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-retro text-slate-400 mb-1">{t.fullNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={attendeeName}
                    onChange={e => setAttendeeName(e.target.value)}
                    placeholder="e.g. Alex Heart"
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-retro text-slate-400 mb-1">{t.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={e => setAttendeeEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-retro text-slate-400 mb-1">{t.pronounsLabel}</label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={e => setPronouns(e.target.value)}
                    placeholder="they/them, iel, elle, il"
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-retro text-slate-400 mb-1">{t.interestedInLabel}</label>
                  <select
                    value={interestedIn}
                    onChange={e => setInterestedIn(e.target.value as PlayerProfile['interestedIn'])}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">{language === 'fr' ? 'Tout le monde' : 'Everyone'}</option>
                    <option value="women">{t.women}</option>
                    <option value="men">{t.men}</option>
                    <option value="nonbinary">{t.nonbinary}</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-[11px] font-retro text-slate-400 mb-1">
                  {t.introPromptLabel}
                </label>
                <textarea
                  value={datingBio}
                  onChange={e => setDatingBio(e.target.value)}
                  placeholder={language === 'fr' ? 'Partagez une phrase d’accroche et ce qui fait de vous une personne formidable à rencontrer...' : 'Share a quick line about why you are here and what makes you a great conversation partner...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500 min-h-[64px] resize-none"
                  maxLength={120}
                />
              </div>
            </div>

            {/* Total and Checkout */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <div className="text-xs font-retro text-slate-400">
                  {t.totalDonationLabel}
                </div>
                <div className="font-pixel text-base sm:text-lg text-emerald-400">
                  ${totalAmount} <span className="text-[11px] font-retro text-slate-400">(${ticketPrice} {language === 'fr' ? 'billet' : 'ticket'} + ${additionalDonation} {language === 'fr' ? 'don' : 'donation'})</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-slate-950 font-pixel text-xs rounded-xl shadow-lg active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>{t.completeRegBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
