import React, { useState } from 'react';
import { Suitor, DateResult, PlayerProfile, CommunityEvent, EventRegistration } from '../types/dating';
import { PixelAvatar } from './PixelAvatar';
import { CommunityFundraiserBar } from './CommunityFundraiserBar';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { Heart, Play, Users, MessageSquare, Flame, Check, HelpCircle, Ticket, ArrowLeft, Award, Sparkles } from 'lucide-react';

interface EventLobbyProps {
  event: CommunityEvent;
  suitors: Suitor[];
  results: DateResult[];
  registrations: EventRegistration[];
  playerProfile: PlayerProfile;
  language?: Language;
  onStartDateWith: (suitorId: string) => void;
  onStartFullEvent: () => void;
  onOpenAvatarCreator: () => void;
  onOpenMessenger: (suitorId?: string) => void;
  onOpenReveal: () => void;
  onOpenRegister: () => void;
  onBackToDirectory: () => void;
}

export const EventLobby: React.FC<EventLobbyProps> = ({
  event,
  suitors,
  results,
  registrations,
  playerProfile,
  language = 'fr',
  onStartDateWith,
  onStartFullEvent,
  onOpenAvatarCreator,
  onOpenMessenger,
  onOpenReveal,
  onOpenRegister,
  onBackToDirectory,
}) => {
  const [filter, setFilter] = useState<'all' | 'women' | 'men' | 'nonbinary'>('all');
  const [showRules, setShowRules] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dating-floor' | 'attendees'>('dating-floor');
  const t = TRANSLATIONS[language];

  const completedSuitorIds = new Set(results.map(r => r.suitorId));
  const matchedSuitorIds = new Set(results.filter(r => r.isMutualMatch).map(r => r.suitorId));

  const filteredSuitors = suitors.filter(s => {
    if (filter === 'all') return true;
    return s.gender === filter;
  });

  const eventRegistrations = registrations.filter(r => r.eventId === event.id);
  const allCompleted = suitors.length > 0 && results.length === suitors.length;

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {/* Top Navigation Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
        <button
          onClick={() => {
            audio.playSelect();
            onBackToDirectory();
          }}
          className="min-h-[40px] text-xs font-retro text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.browseAllCauses}</span>
        </button>

        <div className="text-xs font-retro text-slate-400">
          {language === 'fr' ? 'Organisé par :' : 'Organizer:'} <span className="text-slate-200">{event.creatorName}</span>
        </div>
      </div>

      {/* Community Fundraiser Progress Banner */}
      <CommunityFundraiserBar
        event={event}
        registrationCount={eventRegistrations.length}
        language={language}
        onOpenRegister={onOpenRegister}
      />

      {/* Hero Welcome Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-pink-950/30 to-slate-900 border-2 border-pink-500/40 rounded-2xl p-6 md:p-8 mb-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-retro text-cyan-400 mb-2">
              <span>{event.venueName.toUpperCase()}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'fr' ? 'PISTE DE SPEED DATING' : 'SPEED DATING FLOOR'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-pixel text-pink-400 tracking-tight text-wrap-balance">
              {event.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-retro mt-2 max-w-xl">
              {language === 'fr' ? (
                <>Rencontrez des participants engagés, soutenez <strong>{event.beneficiaryName}</strong> et découvrez votre Joueur 2 !</>
              ) : (
                <>Meet fellow community members, support <strong>{event.beneficiaryName}</strong>, and discover your player two!</>
              )}
            </p>

            {/* Quick Player Stats */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-retro text-slate-400 justify-center md:justify-start">
              <span>{language === 'fr' ? `Rencontres : ${results.length}/${suitors.length} faites` : `Dates: ${results.length}/${suitors.length} completed`}</span>
              <span aria-hidden="true">·</span>
              <span className="text-pink-400 font-bold">{matchedSuitorIds.size} {t.mutualMatchesBadge}</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => {
                  audio.playSelect();
                  setShowRules(!showRules);
                }}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.howToPlay}</span>
              </button>
            </div>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {allCompleted ? (
              <button
                onClick={() => {
                  audio.playMatchFanfare();
                  onOpenReveal();
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:translate-y-0.5 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>{t.viewMatchReveal}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  audio.playRoundBell();
                  onStartFullEvent();
                }}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:translate-y-0.5 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{t.startSpeedDating} ({suitors.length - results.length} {language === 'fr' ? 'Restants' : 'Left'})</span>
              </button>
            )}

            {results.length > 0 && !allCompleted && (
              <button
                onClick={() => {
                  audio.playMatchFanfare();
                  onOpenReveal();
                }}
                className="px-4 py-3 bg-yellow-950/80 hover:bg-yellow-900/80 border border-yellow-500/50 text-yellow-300 font-retro text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-yellow-400" />
                <span>{t.viewMatchReveal} ({results.length})</span>
              </button>
            )}

            <button
              onClick={() => {
                audio.playSelect();
                onOpenRegister();
              }}
              className="px-4 py-3 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 font-retro text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-emerald-400" />
              <span>{t.registerDonateBtn}</span>
            </button>
          </div>
        </div>

        {/* Expandable Rules Drawer */}
        {showRules && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-retro text-slate-300 animate-fade-in">
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
              <div className="font-pixel text-[11px] text-pink-400 mb-1">{t.rules1Title}</div>
              <p>{t.rules1Desc}</p>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
              <div className="font-pixel text-[11px] text-cyan-400 mb-1">{t.rules2Title}</div>
              <p>{t.rules2Desc}</p>
            </div>
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800">
              <div className="font-pixel text-[11px] text-yellow-400 mb-1">{t.rules3Title}</div>
              <p>{t.rules3Desc}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Floor Tab Switcher: Dating Floor vs Registered Attendees */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => {
              audio.playSelect();
              setActiveTab('dating-floor');
            }}
            className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dating-floor'
                ? 'bg-pink-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.speedDatingTablesTab} ({suitors.length} Tables)
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              setActiveTab('attendees');
            }}
            className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'attendees'
                ? 'bg-pink-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.communityDonorsTab} ({eventRegistrations.length})</span>
          </button>
        </div>

        {matchedSuitorIds.size > 0 && (
          <button
            onClick={() => {
              audio.playSelect();
              onOpenMessenger();
            }}
            className="min-h-[42px] px-3.5 py-2 text-xs font-pixel text-pink-400 bg-pink-950/60 border border-pink-500/40 hover:bg-pink-900/60 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.openMatchesBtn} ({matchedSuitorIds.size})</span>
          </button>
        )}
      </div>

      {activeTab === 'dating-floor' ? (
        <>
          {/* Suitor Orientation Filters */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            <span className="text-xs font-retro text-slate-400 mr-2">{t.filterSuitors}</span>
            <button
              onClick={() => {
                audio.playSelect();
                setFilter('all');
              }}
              className={`px-3 py-1 text-xs font-retro rounded border transition-colors ${
                filter === 'all'
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              {t.allSuitors} ({suitors.length})
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setFilter('women');
              }}
              className={`px-3 py-1 text-xs font-retro rounded border transition-colors ${
                filter === 'women'
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              {t.women}
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setFilter('men');
              }}
              className={`px-3 py-1 text-xs font-retro rounded border transition-colors ${
                filter === 'men'
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              {t.men}
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setFilter('nonbinary');
              }}
              className={`px-3 py-1 text-xs font-retro rounded border transition-colors ${
                filter === 'nonbinary'
                  ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              {t.nonbinary}
            </button>
          </div>

          {/* Suitors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuitors.map(suitor => {
              const isCompleted = completedSuitorIds.has(suitor.id);
              const isMatched = matchedSuitorIds.has(suitor.id);
              const result = results.find(r => r.suitorId === suitor.id);

              return (
                <div
                  key={suitor.id}
                  className={`relative bg-slate-900 border-2 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-pink-500/80 hover:shadow-lg ${
                    isMatched
                      ? 'border-pink-500 bg-pink-950/15'
                      : isCompleted
                      ? 'border-slate-800 opacity-90'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-pixel text-[10px] text-cyan-400">
                      {suitor.archetype}
                    </span>

                    {isMatched ? (
                      <span className="text-[10px] font-pixel text-pink-400 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-500/40 flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-pink-400" />
                        <span>{t.mutualMatchTag}</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="text-[10px] font-retro text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                        <Check className="w-3 h-3 text-slate-400" />
                        <span>{t.dateConcluded}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-retro text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        {t.waitingAtTable}
                      </span>
                    )}
                  </div>

                  {/* Suitor Portrait & Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                        <PixelAvatar
                          avatar={suitor.avatar}
                          expressionOverride={isMatched ? 'love' : 'idle'}
                          size="md"
                        />
                      </div>
                      <div>
                        <h3 className="font-pixel text-sm md:text-base text-slate-100">
                          {suitor.name}, {suitor.age}
                        </h3>
                        <div className="text-xs font-retro text-cyan-400 mt-0.5">
                          {suitor.title}
                        </div>
                        <div className="text-[11px] font-retro text-slate-400 mt-1">
                          {language === 'fr' ? 'Style de Drague :' : 'Flirting Style:'} <span className="text-slate-300">{suitor.flirtingStyle}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-retro text-slate-300 leading-relaxed mb-4 line-clamp-3">
                      {suitor.bio}
                    </p>

                    {/* Compatibility Quirks */}
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 text-[11px] font-retro space-y-1 mb-4">
                      <div className="text-emerald-400 truncate">
                        ★ <strong>{language === 'fr' ? 'Point Fort :' : 'Green Flag:'}</strong> {suitor.greenFlag}
                      </div>
                      <div className="text-amber-400 truncate">
                        ⚡ <strong>{language === 'fr' ? 'Point Faible :' : 'Red Flag:'}</strong> {suitor.redFlag}
                      </div>
                    </div>

                    {/* Date chemistry record if completed */}
                    {result && (
                      <div className="text-xs font-retro text-slate-400 mb-4 flex items-center justify-between">
                        <span>{language === 'fr' ? 'Résultat d’Alchimie :' : 'Chemistry Result:'}</span>
                        <span className="font-pixel text-pink-400">{result.finalChemistry}%</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    {isMatched ? (
                      <button
                        onClick={() => {
                          audio.playSelect();
                          onOpenMessenger(suitor.id);
                        }}
                        className="w-full min-h-[44px] py-2.5 bg-pink-500 hover:bg-pink-400 text-slate-950 font-pixel text-xs rounded-lg transition-all shadow flex items-center justify-center gap-1.5 active:translate-y-0.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{t.chatWithMatch}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          audio.playSelect();
                          onStartDateWith(suitor.id);
                        }}
                        className={`w-full min-h-[44px] py-2.5 font-pixel text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 active:translate-y-0.5 ${
                          isCompleted
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                            : 'bg-pink-500 hover:bg-pink-400 text-slate-950 shadow'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? t.dateAgain : t.sitAtTable}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Registered Community Daters Roster View */
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <h3 className="font-pixel text-lg text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>{language === 'fr' ? `Donateurs & Inscrits (${eventRegistrations.length})` : `Registered Community Donors (${eventRegistrations.length})`}</span>
              </h3>
              <p className="text-xs font-retro text-slate-400 mt-1">
                {language === 'fr' ? `Chaque billet vendu soutient notre objectif de $${event.fundraisingGoal.toLocaleString()} pour ${event.beneficiaryName} !` : `Every ticket sold fuels our $${event.fundraisingGoal.toLocaleString()} goal for ${event.beneficiaryName}!`}
              </p>
            </div>

            <button
              onClick={() => {
                audio.playSelect();
                onOpenRegister();
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-xs rounded-lg shadow transition-all active:translate-y-0.5 flex items-center gap-1.5 shrink-0"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{language === 'fr' ? "S'inscrire soi-même →" : 'Register Yourself →'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventRegistrations.map(reg => (
              <div
                key={reg.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4 transition-all hover:border-pink-500/50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
                    <PixelAvatar avatar={reg.avatar} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-xs text-slate-100">{reg.attendeeName}</span>
                      <span className="text-[10px] font-retro text-cyan-400">{reg.pronouns}</span>
                    </div>
                    <div className="text-[11px] font-retro text-slate-400 line-clamp-1 mt-0.5">
                      {reg.bio}
                    </div>
                    <div className="text-[10px] font-pixel text-yellow-400 mt-1 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{reg.ticketCode}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-retro text-slate-400 block">DONATED</span>
                  <span className="font-pixel text-sm text-emerald-400 font-bold">
                    ${reg.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
