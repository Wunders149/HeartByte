import React, { useState } from 'react';
import { CommunityEvent, EventRegistration, CauseCategory } from '../types/dating';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { Heart, Plus, Users, Calendar, MapPin, Target, Sparkles, Building2, Flame, ShieldCheck } from 'lucide-react';

interface EventsDirectoryProps {
  events: CommunityEvent[];
  registrations: EventRegistration[];
  activeEventId: string;
  language?: Language;
  onSelectEvent: (eventId: string) => void;
  onOpenCreateEvent: () => void;
  onOpenRegister: (event: CommunityEvent) => void;
  onEnterDatingFloor: (event: CommunityEvent) => void;
}

export const EventsDirectory: React.FC<EventsDirectoryProps> = ({
  events,
  registrations,
  activeEventId,
  language = 'fr',
  onSelectEvent,
  onOpenCreateEvent,
  onOpenRegister,
  onEnterDatingFloor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CauseCategory>('all');
  const t = TRANSLATIONS[language];

  const filteredEvents = events.filter(e => {
    if (selectedCategory === 'all') return true;
    return e.causeCategory === selectedCategory;
  });

  // Calculate total community impact across all events
  const totalRaisedOverall = events.reduce((acc, e) => acc + e.currentFundsRaised, 0);
  const totalGoalOverall = events.reduce((acc, e) => acc + e.fundraisingGoal, 0);
  const totalRegistrations = registrations.length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Community Impact Ticker Header */}
      <div className="bg-gradient-to-r from-slate-900 via-pink-950/40 to-slate-900 border-2 border-pink-500/50 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-retro text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? 'RÉPERTOIRE DES SOIRÉES CARITATIVES' : 'COMMUNITY FUNDRAISER DIRECTORY'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-pixel text-pink-400 tracking-tight text-wrap-balance">
              {t.datingForCause}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-retro mt-2 max-w-xl">
              {language === 'fr'
                ? 'Transformez les étincelles amoureuses en force solidaire ! Chaque soirée de speed dating finance directement des projets locaux, refuges et espaces créatifs.'
                : 'Turn romantic sparks into community power! Each speed dating event raises funds directly for local neighborhood causes, shelters, and creator spaces.'}
            </p>

            {/* Impact Metrics */}
            <div className="flex flex-wrap items-center gap-4 mt-5 text-xs font-retro">
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">{t.totalDonationsLabel}</span>
                <span className="font-pixel text-emerald-400 text-sm">
                  ${totalRaisedOverall.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">{t.datersRegistered}</span>
                <span className="font-pixel text-pink-400 text-sm">
                  {totalRegistrations} {language === 'fr' ? 'Participants' : 'Attendees'}
                </span>
              </div>
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block">{t.activeCausesCount}</span>
                <span className="font-pixel text-cyan-400 text-sm">
                  {events.length} {language === 'fr' ? 'Événements' : 'Events'}
                </span>
              </div>
            </div>
          </div>

          {/* Organizer-only Access to Create Events */}
          <div className="shrink-0">
            <button
              onClick={() => {
                audio.playSelect();
                onOpenCreateEvent();
              }}
              className="px-5 py-3 bg-yellow-950/70 hover:bg-yellow-900/70 border border-yellow-500/60 text-yellow-300 font-retro text-xs rounded-xl shadow-lg active:translate-y-0.5 transition-all flex items-center gap-2 group"
            >
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>{language === 'fr' ? 'Espace Organisateur (Créer)' : 'Organizer Portal (Create)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto max-w-full pb-1 scrollbar-none">
          <button
            onClick={() => {
              audio.playSelect();
              setSelectedCategory('all');
            }}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-retro rounded-lg transition-all active:scale-95 shrink-0 flex items-center justify-center whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-pink-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.allCauses} ({events.length})
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              setSelectedCategory('community');
            }}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-retro rounded-lg transition-all active:scale-95 shrink-0 flex items-center justify-center whitespace-nowrap ${
              selectedCategory === 'community'
                ? 'bg-pink-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Communauté' : 'Community'}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              setSelectedCategory('tech');
            }}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-retro rounded-lg transition-all active:scale-95 shrink-0 flex items-center justify-center whitespace-nowrap ${
              selectedCategory === 'tech'
                ? 'bg-pink-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Tech & Jeux' : 'Tech & Gaming'}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              setSelectedCategory('environment');
            }}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-retro rounded-lg transition-all active:scale-95 shrink-0 flex items-center justify-center whitespace-nowrap ${
              selectedCategory === 'environment'
                ? 'bg-pink-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Animaux & Éco' : 'Animals & Eco'}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              setSelectedCategory('arts');
            }}
            className={`min-h-[44px] px-3.5 py-2 text-xs font-retro rounded-lg transition-all active:scale-95 shrink-0 flex items-center justify-center whitespace-nowrap ${
              selectedCategory === 'arts'
                ? 'bg-pink-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Arts & Musique' : 'Arts & Music'}
          </button>
        </div>

        <div className="text-xs font-retro text-slate-400">
          {t.showingCount} {filteredEvents.length} {language === 'fr' ? 'campagnes de speed dating' : 'speed dating campaigns'}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl p-10 sm:p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-950/60 rounded-full flex items-center justify-center border border-yellow-500/40">
              <ShieldCheck className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="font-pixel text-lg text-slate-100 mb-2">
              {language === 'fr' ? 'Aucune Soirée Caritative Actuellement' : 'No Fundraiser Events Yet'}
            </h3>
            <p className="text-xs sm:text-sm font-retro text-slate-400 max-w-md mx-auto mb-6">
              {language === 'fr'
                ? 'Seuls les organisateurs vérifiés (admin) ont les droits pour publier des soirées caritatives. Connectez-vous à l’Espace Organisateur pour créer votre premier événement !'
                : 'Only verified organizers (admins) are authorized to publish fundraiser events. Log in to the Organizer Portal to create your first event!'}
            </p>
            <button
              onClick={() => {
                audio.playSelect();
                onOpenCreateEvent();
              }}
              className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'fr' ? 'Espace Organisateur (Connexion Admin) →' : 'Organizer Portal (Admin Login) →'}</span>
            </button>
          </div>
        ) : (
          filteredEvents.map(event => {
            const eventRegs = registrations.filter(r => r.eventId === event.id);
            const percent = Math.min(100, Math.round((event.currentFundsRaised / event.fundraisingGoal) * 100));
          const isCurrentActive = event.id === activeEventId;

          return (
            <div
              key={event.id}
              className={`relative bg-slate-900 border-2 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:border-pink-500/80 hover:shadow-xl ${
                isCurrentActive ? 'border-pink-500 bg-pink-950/10' : 'border-slate-800'
              }`}
            >
              {isCurrentActive && (
                <div className="absolute -top-3 right-6 bg-pink-500 text-slate-950 font-pixel text-[9px] px-2.5 py-0.5 rounded-full shadow">
                  ★ CURRENT EVENT ★
                </div>
              )}

              <div>
                {/* Beneficiary Header */}
                <div className="flex items-center gap-1.5 text-[10px] font-pixel text-cyan-400 mb-1.5 uppercase">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{event.beneficiaryName}</span>
                </div>

                <h3 className="font-pixel text-base text-slate-100 mb-2 leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs font-retro text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Logistics */}
                <div className="space-y-1.5 text-[11px] font-retro text-slate-400 bg-slate-950/70 p-3 rounded-lg border border-slate-800 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{event.venueName}</span>
                  </div>
                </div>

                {/* Fundraising Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-retro mb-1.5">
                    <span className="text-emerald-400 font-pixel">
                      ${event.currentFundsRaised.toLocaleString()}
                    </span>
                    <span className="text-slate-400">
                      {language === 'fr' ? 'Objectif :' : 'Goal:'} ${event.fundraisingGoal.toLocaleString()} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-emerald-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-retro text-slate-500 mt-1">
                    <span>{eventRegs.length} {language === 'fr' ? 'participants inscrits' : 'community daters registered'}</span>
                    <span>Max {event.maxCapacity}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    audio.playSelect();
                    onOpenRegister(event);
                  }}
                  className="min-h-[44px] py-2.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-pink-400 font-pixel text-[10px] rounded-lg transition-all text-center flex items-center justify-center active:scale-95"
                >
                  {language === 'fr' ? "S'inscrire / Donner" : 'Register / Donate'}
                </button>

                <button
                  onClick={() => {
                    audio.playRoundBell();
                    onSelectEvent(event.id);
                    onEnterDatingFloor(event);
                  }}
                  className="min-h-[44px] py-2.5 px-2 bg-pink-500 hover:bg-pink-400 text-slate-950 font-pixel text-[10px] rounded-lg transition-all shadow text-center active:scale-95 flex items-center justify-center"
                >
                  {language === 'fr' ? 'Entrer dans la salle →' : 'Enter Event Floor →'}
                </button>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
