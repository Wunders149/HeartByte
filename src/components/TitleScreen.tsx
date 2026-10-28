import React from 'react';
import { PixelAvatar } from './PixelAvatar';
import { audio } from '../utils/audio';
import { PlayerProfile, Suitor, CommunityEvent } from '../types/dating';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { Heart, Sparkles, Play, Plus, Building2, Users } from 'lucide-react';

interface TitleScreenProps {
  playerProfile: PlayerProfile;
  featuredSuitors: Suitor[];
  events: CommunityEvent[];
  language?: Language;
  onStartGame: () => void;
  onOpenEventsDirectory: () => void;
  onOpenCreateEvent: () => void;
  onOpenAvatarCreator: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  playerProfile,
  featuredSuitors,
  events,
  language = 'en',
  onStartGame,
  onOpenEventsDirectory,
  onOpenCreateEvent,
  onOpenAvatarCreator,
}) => {
  const t = TRANSLATIONS[language];
  const totalRaised = events.reduce((sum, e) => sum + e.currentFundsRaised, 0);

  return (
    <div className="relative min-h-[calc(100vh-68px)] flex flex-col items-center justify-center py-6 sm:py-12 px-3 sm:px-4 overflow-hidden">
      {/* Background Retro Grid & Glow */}
      <div className="absolute inset-0 bg-retro-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Title Hero Card */}
      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Retro Header Kicker */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 bg-pink-950/70 border border-pink-500/40 rounded-full font-retro text-[11px] sm:text-xs text-pink-300 mb-4 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'fr' ? 'COLLECTE COMMUNAUTAIRE & RENCONTRES ÉCLAIR' : 'COMMUNITY FUNDRAISER SPEED DATING'}</span>
        </div>

        {/* Game Title with 3D Pixel Glow */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-pixel text-pink-400 tracking-tighter leading-tight drop-shadow-[0_4px_12px_rgba(244,63,94,0.4)] text-wrap-balance mb-3 sm:mb-4">
          HeartByte
        </h1>

        <div className="font-retro text-xs sm:text-lg text-cyan-300 font-bold tracking-widest uppercase mb-3 sm:mb-4 px-2">
          {t.tagline}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 font-retro max-w-xl mx-auto mb-6 sm:mb-8 px-2 leading-relaxed">
          {language === 'fr'
            ? 'Créez des événements de speed dating caritatifs, inscrivez-vous avec des billets solidaires et rencontrez des célibataires géniaux dans une ambiance arcade 8-bit !'
            : 'Create speed dating fundraisers, register attendees with donation ticket tiers, and meet incredible local daters—all styled as a vibrant 8-bit retro arcade adventure!'}
        </p>

        {/* Community Impact Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 bg-slate-900 border-2 border-emerald-500/60 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg mb-6 sm:mb-8 text-xs font-retro">
          <span className="text-slate-400">{t.totalFundsRaised}</span>
          <span className="font-pixel text-emerald-400 text-sm">
            ${totalRaised.toLocaleString()}
          </span>
          <span className="text-slate-600 hidden xs:inline">·</span>
          <span className="text-cyan-400 font-pixel text-xs">
            {events.length} {language === 'fr' ? 'Causes Actives' : 'Active Events'}
          </span>
        </div>

        {/* Featured Pixel Avatars Showcase */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-10 overflow-x-auto py-2">
          {featuredSuitors.slice(0, 4).map((suitor, idx) => (
            <div
              key={suitor.id}
              className={`p-1.5 sm:p-2 bg-slate-900 border-2 rounded-xl shadow-lg transition-transform hover:-translate-y-1 sm:hover:-translate-y-2 ${
                idx % 2 === 0 ? 'border-pink-500/60' : 'border-cyan-400/60'
              }`}
            >
              <PixelAvatar avatar={suitor.avatar} size="xs" animate={true} />
              <div className="text-[9px] sm:text-[10px] font-pixel text-slate-300 mt-1 truncate max-w-[54px] sm:max-w-[64px]">
                {suitor.name.split(' ')[0]}
              </div>
            </div>
          ))}

          {/* Plus Player */}
          <div className="p-1.5 sm:p-2 bg-slate-900 border-2 border-yellow-400/80 rounded-xl shadow-lg transition-transform hover:-translate-y-1 sm:hover:-translate-y-2">
            <PixelAvatar avatar={playerProfile.avatar} size="xs" animate={true} />
            <div className="text-[9px] sm:text-[10px] font-pixel text-yellow-400 mt-1 truncate max-w-[54px] sm:max-w-[64px]">
              You (P1)
            </div>
          </div>
        </div>

        {/* Action Button Cluster */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 max-w-lg mx-auto mb-6 sm:mb-8">
          <button
            onClick={() => {
              audio.playMatchFanfare();
              onStartGame();
            }}
            className="min-h-[48px] px-6 sm:px-7 py-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-slate-950 font-pixel text-xs sm:text-sm rounded-xl shadow-xl transition-all active:translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <Play className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>{language === 'fr' ? 'ENTRER EN SESSION' : 'ENTER SPEED DATING'}</span>
          </button>

          <button
            onClick={() => {
              audio.playSelect();
              onOpenEventsDirectory();
            }}
            className="min-h-[48px] px-5 sm:px-6 py-3 bg-slate-900 hover:bg-slate-800 border-2 border-cyan-500/60 hover:border-cyan-400 text-cyan-300 font-retro text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Building2 className="w-4 h-4" />
            <span>{t.browseAllCauses}</span>
          </button>

          <button
            onClick={() => {
              audio.playSelect();
              onOpenAvatarCreator();
            }}
            className="min-h-[48px] px-4 sm:px-5 py-3 bg-slate-900 hover:bg-slate-800 border-2 border-purple-500/60 hover:border-purple-400 text-purple-300 font-retro text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{t.customizeSprite}</span>
          </button>

          <button
            onClick={() => {
              audio.playSelect();
              onOpenCreateEvent();
            }}
            className="min-h-[48px] px-4 sm:px-5 py-3 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-600 text-slate-200 font-retro text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{language === 'fr' ? 'Créer Événement' : 'Create Event'}</span>
          </button>
        </div>

        {/* Retro Insert Coin Insert Text */}
        <div className="text-xs font-pixel text-pink-500/70 animate-pulse tracking-wider">
          {language === 'fr' 
            ? '♥ SOUTENEZ UNE CAUSE · TROUVEZ VOTRE JOUEUR 2 ♥'
            : '♥ SUPPORT A CAUSE · FIND YOUR PLAYER TWO ♥'}
        </div>

        {/* Game Rules Adjacency */}
        <div className="mt-12 max-w-lg mx-auto bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left">
          <div className="flex items-center gap-2 text-xs font-pixel text-cyan-400 mb-2">
            <Heart className="w-3.5 h-3.5 fill-cyan-400" />
            <span>{language === 'fr' ? 'OBJECTIF SOLIDAIRE & RÈGLES DU JEU' : 'COMMUNITY GOAL & HOW IT WORKS'}</span>
          </div>
          <ul className="text-xs font-retro text-slate-400 space-y-1.5 list-disc list-inside">
            {language === 'fr' ? (
              <>
                <li>Les organisateurs créent des soirées speed dating avec objectifs de dons & paliers de billets.</li>
                <li>Les participants s’inscrivent, choisissent leur pass solidaire et reçoivent un badge rétro 8-bit.</li>
                <li>Participez à des tête-à-tête de 45 secondes avec répliques à choix multiples et jauge d’alchimie.</li>
                <li>Les matchs mutuels débloquent le chat rétro, et 100% des bénéfices financent la cause locale !</li>
              </>
            ) : (
              <>
                <li>Community organizers create speed dating events with fundraising goals & ticket tiers.</li>
                <li>Users register, select their donation pass, and generate an 8-bit ticket badge.</li>
                <li>Attendees participate in 45-second speed dating rounds with dialogue & chemistry meters.</li>
                <li>Mutual matches unlock retro chat, and 100% of event proceeds fuel the community cause!</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
