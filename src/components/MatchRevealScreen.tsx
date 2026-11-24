import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Suitor, DateResult, PlayerProfile } from '../types/dating';
import { PixelAvatar } from './PixelAvatar';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { Heart, MessageCircle, Sparkles, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { CustomConfirmModal } from './CustomConfirmModal';

interface MatchRevealScreenProps {
  results: DateResult[];
  suitors: Suitor[];
  playerProfile: PlayerProfile;
  language?: Language;
  onOpenMessenger: (suitorId?: string) => void;
  onResetDates: () => void;
  onBackToLobby?: () => void;
}

export const MatchRevealScreen: React.FC<MatchRevealScreenProps> = ({
  results,
  suitors,
  playerProfile,
  language = 'fr',
  onOpenMessenger,
  onResetDates,
  onBackToLobby,
}) => {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const mutualMatches = results.filter(r => r.isMutualMatch);

  // Trigger match fanfare and confetti on mount
  useEffect(() => {
    if (mutualMatches.length > 0) {
      audio.playMatchFanfare();
      // Burst celebratory pixel confetti
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#38bdf8', '#facc15', '#a855f7']
      });
    }

    // Auto reveal cards sequentially
    const timeouts: NodeJS.Timeout[] = [];
    results.forEach((res, index) => {
      const timeout = setTimeout(() => {
        setRevealedIds(prev => new Set(prev).add(res.suitorId));
        if (res.isMutualMatch) {
          audio.playHeartGain();
        }
      }, (index + 1) * 350);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {/* Header Banner */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-950/60 border border-pink-500/50 rounded-full font-retro text-xs text-pink-300 mb-3">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>{t.ceremonyBadge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-pixel text-pink-400 mb-2">
          {t.matchmakingResultsTitle}
        </h1>
        <p className="text-xs md:text-sm text-slate-300 font-retro max-w-lg mx-auto">
          {t.ballotsCountedDesc}
        </p>

        {/* Mutual Match Count Ticker */}
        <div className="mt-4 inline-block bg-slate-900 border-2 border-yellow-400/80 rounded-xl px-5 sm:px-6 py-2.5 shadow-lg">
          <span className="font-pixel text-xs sm:text-sm text-yellow-400 tabular-nums">
            {mutualMatches.length} {t.mutualMatchesFound}
          </span>
        </div>
      </div>

      {/* Grid of Suitors Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {results.map(result => {
          const suitor = suitors.find(s => s.id === result.suitorId);
          if (!suitor) return null;

          const isRevealed = revealedIds.has(suitor.id);
          const isMutual = result.isMutualMatch;
          const playerLiked = result.playerDecision === 'like' || result.playerDecision === 'superlike';
          const suitorLiked = result.suitorDecision === 'like';

          return (
            <div
              key={suitor.id}
              className={`relative bg-slate-900 rounded-xl border-2 p-4 sm:p-5 transition-all duration-500 flex flex-col justify-between ${
                isMutual
                  ? 'border-pink-500 shadow-xl shadow-pink-500/10 sm:scale-[1.02]'
                  : 'border-slate-800'
              }`}
            >
              {/* Mutual Match Ribbon */}
              {isMutual && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-400 text-slate-950 font-pixel text-[10px] px-3 py-0.5 rounded-full shadow-md whitespace-nowrap">
                  ★ {language === 'fr' ? 'C’EST UN MATCH !' : 'IT’S A MATCH!'} ★
                </div>
              )}

              <div>
                {/* Avatar and Basic Info */}
                <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
                    <PixelAvatar
                      avatar={suitor.avatar}
                      expressionOverride={isMutual ? 'love' : 'idle'}
                      size="md"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-pixel text-sm text-slate-100 truncate">
                      {suitor.name}
                    </h3>
                    <div className="text-xs font-retro text-cyan-400 truncate">
                      {suitor.title}
                    </div>
                    <div className="text-[11px] font-retro text-slate-400 mt-1 tabular-nums">
                      {t.chemistryLabel} : <span className="text-pink-400 font-bold">{result.finalChemistry}%</span>
                    </div>
                  </div>
                </div>

                {/* Secret Decisions Breakdown */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs font-retro space-y-1.5 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{t.yourVote}</span>
                    <span className={playerLiked ? 'text-pink-400 font-bold' : 'text-slate-500'}>
                      {result.playerDecision === 'superlike' ? (language === 'fr' ? '★ Super-Like !' : '★ Super Like!') : result.playerDecision === 'like' ? (language === 'fr' ? '♥ Coup de Cœur' : '♥ Like') : (language === 'fr' ? '✕ Passé' : '✕ Pass')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">{suitor.name} {t.suitorVote}</span>
                    <span className={suitorLiked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {isRevealed ? (suitorLiked ? t.likedYouBack : t.passedVote) : t.tallyingVote}
                    </span>
                  </div>
                </div>

                {/* Suitor Post-Date Note */}
                <div className="text-xs font-retro text-slate-300 italic mb-4 min-h-[40px]">
                  &ldquo;{isMutual ? suitor.matchMessage : suitor.rejectionMessage}&rdquo;
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isMutual ? (
                  <button
                    onClick={() => {
                      audio.playSelect();
                      onOpenMessenger(suitor.id);
                    }}
                    className="w-full min-h-[44px] py-2.5 px-3 bg-pink-500 hover:bg-pink-400 text-slate-950 font-pixel text-xs rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.chatAndPlanDate2}</span>
                  </button>
                ) : (
                  <div className="text-center py-2 text-[11px] font-retro text-slate-500">
                    {language === 'fr' ? 'Connexion Amicale' : 'Friendly Connection'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          {onBackToLobby && (
            <button
              onClick={() => {
                audio.playSelect();
                onBackToLobby();
              }}
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-retro text-slate-300 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <span>{t.backToLobbyWithoutReset}</span>
            </button>
          )}

          <button
            onClick={() => {
              audio.playSelect();
              setIsResetConfirmOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-retro text-slate-400 hover:text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>{t.speedDateAgainReset}</span>
          </button>
        </div>

        <button
          onClick={() => {
            audio.playSelect();
            onOpenMessenger();
          }}
          className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-xs font-pixel text-slate-950 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>{t.openMessengerBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Confirm Modal: Reset Speed Dates */}
      <CustomConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          setIsResetConfirmOpen(false);
          onResetDates();
        }}
        title={language === 'fr' ? 'Recommencer le Speed Dating ?' : 'Reset Speed Dating Round?'}
        message={
          <div className="space-y-2">
            <p>
              {language === 'fr'
                ? 'Voulez-vous réinitialiser toutes vos rencontres et recommencer une nouvelle session ?'
                : 'Would you like to reset your dating progress and start a fresh round of dates?'}
            </p>
            <p className="text-slate-400 text-xs">
              {language === 'fr'
                ? 'Vos choix secrets précédents seront effacés pour vous permettre de re-découvrir les prétendants.'
                : 'Your previous ballots and mutual match tallies will be cleared so you can date again.'}
            </p>
          </div>
        }
        confirmLabel={language === 'fr' ? 'Oui, Recommencer' : 'Yes, Reset & Date Again'}
        cancelLabel={language === 'fr' ? 'Garder mes Résultats' : 'Keep Current Results'}
        danger={false}
        theme="cyan"
        iconType="reset"
      />
    </div>
  );
};
