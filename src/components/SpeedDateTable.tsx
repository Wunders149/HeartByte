import React, { useState, useEffect, useRef } from 'react';
import { Suitor, Expression, PlayerDecision, DialogueChoice, PlayerProfile } from '../types/dating';
import { PixelAvatar } from './PixelAvatar';
import { audio } from '../utils/audio';
import { Heart, X, Star, Clock, Sparkles, MessageSquare, Flame } from 'lucide-react';

interface SpeedDateTableProps {
  suitor: Suitor;
  playerProfile: PlayerProfile;
  dateNumber: number;
  totalDates: number;
  onFinishDate: (suitorId: string, decision: PlayerDecision, finalChemistry: number, notes: string) => void;
  onSkipToNext: () => void;
}

export const SpeedDateTable: React.FC<SpeedDateTableProps> = ({
  suitor,
  playerProfile,
  dateNumber,
  totalDates,
  onFinishDate,
  onSkipToNext,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [chemistry, setChemistry] = useState<number>(suitor.initialChemistry);
  const [expression, setExpression] = useState<Expression>('idle');
  const [spokenText, setSpokenText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showMinigame, setShowMinigame] = useState<boolean>(false);
  const [minigameCompleted, setMinigameCompleted] = useState<boolean>(false);
  const [minigameScale, setMinigameScale] = useState<number>(1);
  const [minigameFeedback, setMinigameFeedback] = useState<string | null>(null);
  const [floatingDelta, setFloatingDelta] = useState<{ value: number; key: number } | null>(null);
  const [dateState, setDateState] = useState<'dating' | 'verdict'>('dating');
  const [playerNotes, setPlayerNotes] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(45); // 45s timer for snappy speed dating

  const currentRound = suitor.rounds[currentRoundIdx] || suitor.rounds[0];
  const typingTimerRef = useRef<number | null>(null);

  // Typewriter effect for suitor speech
  useEffect(() => {
    setIsTyping(true);
    setSpokenText('');
    const fullText = currentRound.suitorSays;
    let idx = 0;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = window.setInterval(() => {
      idx++;
      setSpokenText(fullText.slice(0, idx));
      if (idx % 2 === 0) {
        audio.playBlip();
      }
      if (idx >= fullText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 24);

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [currentRoundIdx, suitor.id]);

  // Speed dating timer
  useEffect(() => {
    if (dateState === 'verdict') return;

    const interval = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        if (prev <= 6) {
          audio.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [dateState]);

  // Rhythm minigame pulse loop
  useEffect(() => {
    if (!showMinigame || minigameCompleted) return;

    let growing = true;
    let current = 0.6;
    const pulseInterval = window.setInterval(() => {
      if (growing) {
        current += 0.04;
        if (current >= 1.4) growing = false;
      } else {
        current -= 0.04;
        if (current <= 0.5) growing = true;
      }
      setMinigameScale(current);
    }, 35);

    return () => clearInterval(pulseInterval);
  }, [showMinigame, minigameCompleted]);

  const handleTimeUp = () => {
    audio.playRoundBell();
    setDateState('verdict');
  };

  const handleChoiceClick = (choice: DialogueChoice) => {
    if (isTyping || selectedChoiceId) return;

    audio.playSelect();
    setSelectedChoiceId(choice.id);

    // Apply chemistry delta
    const delta = choice.chemistryChange;
    const newChem = Math.max(0, Math.min(100, chemistry + delta));
    setChemistry(newChem);
    setExpression(choice.resultingExpression);

    // Sound effect based on chemistry change
    if (delta > 0) {
      audio.playHeartGain();
    } else {
      audio.playChemistryDrop();
    }

    setFloatingDelta({ value: delta, key: Date.now() });

    // Show Suitor response
    setSpokenText(choice.suitorResponse);

    // After brief reaction dwell, advance round or trigger mini-game
    setTimeout(() => {
      if (currentRoundIdx === 0 && !minigameCompleted) {
        // Trigger quick Heart Sync minigame between round 1 and 2
        setShowMinigame(true);
      } else if (currentRoundIdx < suitor.rounds.length - 1) {
        audio.playRoundBell();
        setCurrentRoundIdx(prev => prev + 1);
        setSelectedChoiceId(null);
        setExpression('idle');
      } else {
        // Speed Date round complete -> go to Verdict
        audio.playRoundBell();
        setDateState('verdict');
      }
    }, 2200);
  };

  const handleMinigameClick = () => {
    if (minigameCompleted) return;

    // Sweet spot is between 0.9 and 1.15 scale
    const isPerfect = minigameScale >= 0.88 && minigameScale <= 1.18;
    const isGood = minigameScale >= 0.75 && minigameScale <= 1.3;

    if (isPerfect) {
      audio.playSuperLike();
      setMinigameFeedback('PERFECT SYNC! +15 ♥');
      setChemistry(prev => Math.min(100, prev + 15));
      setExpression('love');
      setFloatingDelta({ value: 15, key: Date.now() });
    } else if (isGood) {
      audio.playHeartGain();
      setMinigameFeedback('GOOD VIBE! +8 ♥');
      setChemistry(prev => Math.min(100, prev + 8));
      setExpression('happy');
      setFloatingDelta({ value: 8, key: Date.now() });
    } else {
      audio.playPass();
      setMinigameFeedback('OUT OF SYNC! 0 ♥');
      setExpression('skeptical');
    }

    setMinigameCompleted(true);

    setTimeout(() => {
      setShowMinigame(false);
      audio.playRoundBell();
      setCurrentRoundIdx(prev => prev + 1);
      setSelectedChoiceId(null);
      setExpression('idle');
      setMinigameFeedback(null);
    }, 1500);
  };

  const handleCastVerdict = (decision: PlayerDecision) => {
    if (decision === 'superlike') {
      audio.playSuperLike();
    } else if (decision === 'like') {
      audio.playMatchFanfare();
    } else {
      audio.playPass();
    }
    onFinishDate(suitor.id, decision, chemistry, playerNotes);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
      {/* Top HUD Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Date Round Counter */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3">
          <div className="px-2 sm:px-2.5 py-1 bg-pink-950/60 border border-pink-500/40 rounded text-pink-300 font-pixel text-[11px] sm:text-xs">
            ROUND {dateNumber}/{totalDates}
          </div>
          <div className="text-xs font-retro text-slate-300">
            Speed Date with <span className="text-pink-400 font-bold">{suitor.name}</span>
          </div>
        </div>

        {/* 45s Speed Date Timer */}
        <div className="flex items-center justify-between sm:justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} />
            <span className={`font-pixel text-xs ${timeLeft <= 10 ? 'text-red-400 font-bold' : 'text-slate-200'}`}>
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
          <button
            onClick={onSkipToNext}
            className="text-[11px] font-retro text-slate-400 hover:text-slate-200 ml-2 underline underline-offset-2 p-1"
          >
            Skip Date
          </button>
        </div>

        {/* Live Chemistry Meter */}
        <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[180px]">
          <div className="flex items-center gap-1 font-pixel text-xs text-pink-400 shrink-0">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>{chemistry}%</span>
          </div>
          <div className="flex-1 h-3 bg-slate-950 border border-slate-700 rounded-full overflow-hidden p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${chemistry}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Dating Encounter Arena */}
      <div className="relative bg-slate-950 border-2 sm:border-4 border-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl">
        {/* Retro Grid Background & Atmosphere */}
        <div className="absolute inset-0 bg-retro-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Chemistry Delta Notification */}
        {floatingDelta && (
          <div
            key={floatingDelta.key}
            className={`absolute top-16 sm:top-20 right-1/2 translate-x-1/2 z-30 font-pixel text-sm sm:text-base md:text-lg animate-heart-float pointer-events-none text-center whitespace-nowrap ${
              floatingDelta.value > 0 ? 'text-pink-400' : 'text-slate-400'
            }`}
          >
            {floatingDelta.value > 0 ? `+${floatingDelta.value} ♥ CHEMISTRY!` : `${floatingDelta.value} 💔 AWKWARD...`}
          </div>
        )}

        {/* Interactive Mid-Date Heart Sync Minigame Overlay */}
        {showMinigame && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in">
            <div className="text-xs font-retro text-cyan-400 mb-2">QUICK-TIME VIBE CHECK!</div>
            <h3 className="text-base sm:text-lg md:text-xl font-pixel text-pink-400 mb-4 sm:mb-6">
              Lock Eyes & Sync Hearts!
            </h3>
            <p className="text-xs text-slate-300 font-retro max-w-sm mb-6 sm:mb-8">
              Click the button right when the pulsing heart aligns with the target ring!
            </p>

            {/* Target Ring & Pulsing Heart */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-6 sm:mb-8">
              {/* Outer Target Ring */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-dashed border-cyan-400 rounded-full opacity-80" />
              {/* Expanding Heart */}
              <div
                className="absolute text-pink-500 text-4xl sm:text-5xl transition-transform"
                style={{ transform: `scale(${minigameScale})` }}
              >
                ♥
              </div>
            </div>

            {minigameFeedback ? (
              <div className="font-pixel text-xs sm:text-sm text-yellow-300 animate-bounce">
                {minigameFeedback}
              </div>
            ) : (
              <button
                onClick={handleMinigameClick}
                className="min-h-[44px] px-6 sm:px-8 py-3 bg-pink-500 hover:bg-pink-400 active:scale-95 font-pixel text-xs text-slate-950 rounded-lg shadow-lg transition-transform"
              >
                SYNC NOW! (SPACE/CLICK)
              </button>
            )}
          </div>
        )}

        {dateState === 'dating' ? (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left: Pixel Suitor Portrait & Dossier (Adaptive size for mobile vs desktop) */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative p-3 sm:p-6 bg-slate-900 border-2 border-pink-500/60 rounded-xl shadow-lg mb-2 sm:mb-4">
                {/* Desktop Avatar (size xl) */}
                <div className="hidden sm:block">
                  <PixelAvatar
                    avatar={suitor.avatar}
                    expressionOverride={expression}
                    size="xl"
                    animate={true}
                  />
                </div>
                {/* Mobile Phone Avatar (size md) to preserve vertical space */}
                <div className="sm:hidden">
                  <PixelAvatar
                    avatar={suitor.avatar}
                    expressionOverride={expression}
                    size="md"
                    animate={true}
                  />
                </div>

                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-pink-600 font-pixel text-[9px] sm:text-[10px] text-white rounded-full whitespace-nowrap shadow">
                  {suitor.archetype}
                </div>
              </div>

              <h2 className="font-pixel text-sm sm:text-base md:text-lg text-slate-100 mt-2">
                {suitor.name}, {suitor.age}
              </h2>
              <div className="text-[11px] sm:text-xs font-retro text-cyan-400 mt-0.5">
                {suitor.title}
              </div>

              {/* Suitor Quick Badges */}
              <div className="mt-2 sm:mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-retro text-slate-400">
                <span className="text-emerald-400">★ {suitor.greenFlag}</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400">⚡ {suitor.redFlag}</span>
              </div>
            </div>

            {/* Right: Dialogue Box & Player Response Choices */}
            <div className="md:col-span-7 flex flex-col justify-between sm:min-h-[380px]">
              {/* Suitor Speech Box (NES/SNES RPG style) */}
              <div className="pixel-box-pink p-3.5 sm:p-5 rounded-lg mb-4 sm:mb-6 relative">
                <div className="text-[10px] font-pixel text-pink-400 mb-1.5 sm:mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" />
                  <span>{suitor.name.toUpperCase()} SAYS:</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base font-retro text-slate-100 leading-relaxed min-h-[56px] sm:min-h-[72px]">
                  {spokenText}
                  {isTyping && <span className="inline-block w-2 h-4 bg-pink-400 ml-1 animate-blink" />}
                </p>
                <div className="text-[10px] font-retro text-slate-500 text-right mt-1.5">
                  Round {currentRoundIdx + 1} of 3
                </div>
              </div>

              {/* Player Dialogue Options */}
              <div className="space-y-2.5 sm:space-y-3">
                <div className="text-[10px] font-pixel text-cyan-400 tracking-wider">
                  SELECT YOUR RESPONSE:
                </div>

                {currentRound.choices.map((choice, idx) => {
                  const isSelected = selectedChoiceId === choice.id;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => handleChoiceClick(choice)}
                      disabled={isTyping || selectedChoiceId !== null}
                      className={`w-full min-h-[44px] text-left p-3 sm:p-3.5 rounded-lg border-2 font-retro text-xs sm:text-sm transition-all flex items-start gap-2.5 sm:gap-3 group relative ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-950/40 text-yellow-200 font-bold scale-[1.01]'
                          : selectedChoiceId !== null
                          ? 'border-slate-800 bg-slate-900/50 text-slate-500 opacity-50 cursor-not-allowed'
                          : isTyping
                          ? 'border-slate-800 bg-slate-900/50 text-slate-500 cursor-wait'
                          : 'border-slate-800 bg-slate-900 hover:border-pink-500 hover:bg-slate-850 text-slate-200 hover:translate-x-1 active:bg-slate-800'
                      }`}
                    >
                      <span className="font-pixel text-pink-400 text-xs shrink-0 mt-0.5 group-hover:text-yellow-400">
                        {idx === 0 ? '▶ A' : idx === 1 ? '▶ B' : '▶ C'}
                      </span>
                      <span className="flex-1 leading-snug">{choice.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Speed Date Verdict & PDA Scoring Phase */
          <div className="relative z-10 max-w-xl mx-auto text-center py-2 sm:py-4">
            <div className="text-xs font-retro text-yellow-400 mb-1.5">ROUND CONCLUDED</div>
            <h2 className="text-xl sm:text-2xl font-pixel text-pink-400 mb-3 sm:mb-4">
              Speed Date Verdict
            </h2>

            <div className="flex items-center justify-center gap-4 sm:gap-6 my-4 sm:my-6">
              <PixelAvatar avatar={playerProfile.avatar} size="md" />
              <div className="text-pink-500 font-pixel text-lg sm:text-xl">♥</div>
              <PixelAvatar avatar={suitor.avatar} size="md" expressionOverride={expression} />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4 mb-4 sm:mb-6 text-left">
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <span className="text-xs font-retro text-slate-400">Final Chemistry Score</span>
                <span className="font-pixel text-xs sm:text-sm text-pink-400">{chemistry}%</span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden mb-3 sm:mb-4">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-amber-400 rounded-full"
                  style={{ width: `${chemistry}%` }}
                />
              </div>

              {/* Private Notes Pad */}
              <label className="block text-[11px] font-pixel text-slate-400 mb-1.5">
                PDA Notes on {suitor.name} (Optional):
              </label>
              <input
                type="text"
                value={playerNotes}
                onChange={e => setPlayerNotes(e.target.value)}
                placeholder="e.g. Loves late night ramen, very cute laugh, wants to co-op..."
                className="w-full min-h-[42px] bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs font-retro text-slate-200 focus:outline-none focus:border-pink-500"
                maxLength={80}
              />
            </div>

            <p className="text-xs font-retro text-slate-300 mb-5 sm:mb-6 px-2">
              Would you like to match with {suitor.name}? Both parties must say YES to reveal mutual contact!
            </p>

            {/* Verdict Action Buttons with mobile thumb zone targets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
              {/* Pass */}
              <button
                onClick={() => handleCastVerdict('pass')}
                className="min-h-[50px] py-3 px-3 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-600 rounded-lg font-pixel text-xs text-slate-300 flex items-center sm:flex-col justify-center gap-2 sm:gap-1.5 transition-all active:translate-y-0.5"
              >
                <X className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Pass</span>
              </button>

              {/* Like */}
              <button
                onClick={() => handleCastVerdict('like')}
                className="min-h-[50px] py-3 px-3 bg-pink-600 hover:bg-pink-500 border-2 border-pink-400 rounded-lg font-pixel text-xs text-white shadow-lg flex items-center sm:flex-col justify-center gap-2 sm:gap-1.5 transition-all active:translate-y-0.5"
              >
                <Heart className="w-5 h-5 fill-white text-white shrink-0" />
                <span>Like ♥</span>
              </button>

              {/* Super Like */}
              <button
                onClick={() => handleCastVerdict('superlike')}
                className="min-h-[50px] py-3 px-3 bg-gradient-to-br from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 border-2 border-yellow-200 rounded-lg font-pixel text-xs text-slate-950 shadow-lg flex items-center sm:flex-col justify-center gap-2 sm:gap-1.5 transition-all active:translate-y-0.5"
              >
                <Star className="w-5 h-5 fill-slate-950 text-slate-950 shrink-0" />
                <span>Super Like!</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
