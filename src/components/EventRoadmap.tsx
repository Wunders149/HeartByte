import React, { useState } from 'react';
import { AppScreen } from '../types/dating';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { audio } from '../utils/audio';
import { 
  Calendar, 
  Sparkles, 
  Users, 
  Heart, 
  Trophy, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Map, 
  Flame,
  ArrowRight
} from 'lucide-react';

export interface EventRoadmapProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  language: Language;
  datesCompletedCount: number;
  totalDatesCount: number;
  matchesCount: number;
  hasRegistered?: boolean;
}

interface RoadmapStep {
  id: AppScreen;
  stepNumber: number;
  titleKey: string;
  descKey: string;
  icon: React.ComponentType<{ className?: string }>;
  isComplete: boolean;
  isCurrent: boolean;
  badge?: string;
}

export const EventRoadmap: React.FC<EventRoadmapProps> = ({
  currentScreen,
  onNavigate,
  language,
  datesCompletedCount,
  totalDatesCount,
  matchesCount,
  hasRegistered = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = TRANSLATIONS[language];

  const steps: RoadmapStep[] = [
    {
      id: 'EVENTS_DIRECTORY',
      stepNumber: 1,
      titleKey: language === 'fr' ? '01. Cause & Pass' : '01. Cause & Pass',
      descKey: language === 'fr' 
        ? 'Choisir une cause & réserver son pass solidaire' 
        : 'Select community cause & secure donation pass',
      icon: Calendar,
      isComplete: hasRegistered,
      isCurrent: currentScreen === 'EVENTS_DIRECTORY' || currentScreen === 'TITLE',
    },
    {
      id: 'AVATAR_CREATOR',
      stepNumber: 2,
      titleKey: language === 'fr' ? '02. Sprite & Profil' : '02. Sprite & Bio',
      descKey: language === 'fr' 
        ? 'Personnaliser son avatar 8-bit & centres d’intérêt' 
        : 'Design your 8-bit pixel avatar & retro dating bio',
      icon: Sparkles,
      isComplete: true, // Player starts with custom initial profile
      isCurrent: currentScreen === 'AVATAR_CREATOR',
    },
    {
      id: 'EVENT_LOBBY',
      stepNumber: 3,
      titleKey: language === 'fr' ? '03. Salon & Accueil' : '03. Lounge & Floor',
      descKey: language === 'fr' 
        ? 'Règles du jeu, donateurs & découverte des tables' 
        : 'Floor rules, attendee list & table overview',
      icon: Users,
      isComplete: datesCompletedCount > 0,
      isCurrent: currentScreen === 'EVENT_LOBBY',
      badge: datesCompletedCount > 0 ? `${datesCompletedCount}/${totalDatesCount}` : undefined
    },
    {
      id: 'SPEED_DATE',
      stepNumber: 4,
      titleKey: language === 'fr' ? '04. Rencontres Express' : '04. Speed Dating',
      descKey: language === 'fr' 
        ? 'Tête-à-tête 45s, dialogues, alchimie & votes secrets' 
        : '45s rapid dates, dialogue choices & secret ballot',
      icon: Heart,
      isComplete: totalDatesCount > 0 && datesCompletedCount >= totalDatesCount,
      isCurrent: currentScreen === 'SPEED_DATE',
      badge: datesCompletedCount > 0 ? `${datesCompletedCount}/${totalDatesCount}` : undefined
    },
    {
      id: 'MATCH_REVEAL',
      stepNumber: 5,
      titleKey: language === 'fr' ? '05. Verdicts & Matchs' : '05. Match Reveal',
      descKey: language === 'fr' 
        ? 'Cérémonie du dépouillement & révélations mutuelles' 
        : 'Ceremony results & mutual spark calculations',
      icon: Trophy,
      isComplete: matchesCount > 0,
      isCurrent: currentScreen === 'MATCH_REVEAL',
      badge: matchesCount > 0 ? `${matchesCount} ${language === 'fr' ? 'Matchs' : 'Matches'}` : undefined
    },
    {
      id: 'MATCH_MESSENGER',
      stepNumber: 6,
      titleKey: language === 'fr' ? '06. Messagerie & Date 2' : '06. 8-Bit Chat',
      descKey: language === 'fr' 
        ? 'Discuter avec ses coups de cœur & fixer un 2e rendez-vous' 
        : 'Chat with mutual matches & confirm Date #2 IRL',
      icon: MessageSquare,
      isComplete: matchesCount > 0,
      isCurrent: currentScreen === 'MATCH_MESSENGER',
    },
  ];

  const currentStepObj = steps.find(s => s.isCurrent) || steps[0];
  const nextStep = steps.find(s => s.stepNumber === currentStepObj.stepNumber + 1);

  const handleStepClick = (screen: AppScreen) => {
    audio.playSelect();
    onNavigate(screen);
  };

  return (
    <section aria-label="Event Roadmap" className="w-full bg-slate-950/90 border-b border-pink-500/20 px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto">
        {/* Compact Bar Mode: Current Stage Indicator + Toggle Button */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {/* Roadmap Label Pill */}
            <button
              onClick={() => {
                audio.playSelect();
                setIsExpanded(prev => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg bg-slate-900 border border-pink-500/30 hover:border-pink-500 text-xs font-pixel text-pink-400 shrink-0 transition-all active:scale-95"
              title={language === 'fr' ? 'Afficher le parcours de l’événement' : 'Toggle event roadmap'}
            >
              <Map className="w-4 h-4 text-cyan-400" />
              <span className="hidden xs:inline">
                {language === 'fr' ? 'PARCOURS' : 'ROADMAP'}
              </span>
              <span className="text-[10px] text-slate-400 font-retro">
                ({currentStepObj.stepNumber}/6)
              </span>
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-pink-400 ml-0.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-pink-400 ml-0.5" />
              )}
            </button>

            {/* Quick Horizontal Mini-Stepper on Desktop */}
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-retro text-slate-400">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <React.Fragment key={st.id}>
                    <button
                      onClick={() => handleStepClick(st.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded transition-all active:scale-95 ${
                        st.isCurrent
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50 font-bold'
                          : st.isComplete
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st.isComplete && !st.isCurrent ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Icon className="w-3 h-3 shrink-0" />
                      )}
                      <span>{st.titleKey.split('.')[1]?.trim() || st.titleKey}</span>
                      {st.badge && (
                        <span className="text-[9px] bg-slate-800 px-1 rounded text-cyan-300">
                          {st.badge}
                        </span>
                      )}
                    </button>
                    {idx < steps.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Active Stage Label on Mobile / Tablet */}
            <div className="lg:hidden flex items-center gap-1.5 text-xs font-retro text-slate-300 truncate">
              <span className="text-pink-400 font-bold font-pixel text-[11px]">
                {currentStepObj.titleKey}
              </span>
              <span className="text-slate-500 hidden sm:inline">·</span>
              <span className="text-slate-400 hidden sm:inline truncate max-w-[200px]">
                {currentStepObj.descKey}
              </span>
            </div>
          </div>

          {/* Quick Action: Next Step Hint CTA */}
          {nextStep && (
            <button
              onClick={() => handleStepClick(nextStep.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-lg bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-slate-950 font-pixel text-xs shrink-0 shadow transition-all active:scale-95"
            >
              <span>{language === 'fr' ? 'Suivant' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Detailed Expanded Drawer: Interactive Full Event Work Road */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <div className="text-[10px] font-pixel text-cyan-400 uppercase tracking-wider">
                  {language === 'fr' ? 'FEUILLE DE ROUTE DE L’ÉVÉNEMENT' : 'EVENT WORKFLOW ROADMAP'}
                </div>
                <div className="text-xs font-retro text-slate-300">
                  {language === 'fr'
                    ? 'Progressez à travers chaque phase pour soutenir la cause et trouver votre Joueur 2 :'
                    : 'Progress through each stage to support the cause and discover your Player Two:'}
                </div>
              </div>

              {/* Live Metric Badges */}
              <div className="flex items-center gap-2 text-xs font-retro">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {language === 'fr' ? 'Rencontres :' : 'Dates:'} <strong className="text-pink-400">{datesCompletedCount}/{totalDatesCount}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {language === 'fr' ? 'Matchs :' : 'Matches:'} <strong className="text-yellow-400">{matchesCount}</strong>
                </span>
              </div>
            </div>

            {/* 6-Step Visual Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-2.5">
              {steps.map(step => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`p-2.5 rounded-xl border-2 text-left flex flex-col justify-between transition-all group ${
                      step.isCurrent
                        ? 'bg-pink-950/50 border-pink-500 shadow-md shadow-pink-500/20 scale-[1.02]'
                        : step.isComplete
                        ? 'bg-slate-900/80 border-emerald-500/50 hover:border-emerald-400'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className={`p-1.5 rounded-lg ${
                          step.isCurrent
                            ? 'bg-pink-500 text-slate-950'
                            : step.isComplete
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        {step.isComplete ? (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-pixel text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            <Check className="w-2.5 h-2.5" />
                            {language === 'fr' ? 'Fait' : 'Done'}
                          </span>
                        ) : step.isCurrent ? (
                          <span className="text-[9px] font-pixel text-pink-400 bg-pink-950/60 px-1.5 py-0.5 rounded border border-pink-500/40 animate-pulse">
                            {language === 'fr' ? 'Actuel' : 'Active'}
                          </span>
                        ) : (
                          <span className="text-[9px] font-retro text-slate-500">
                            {language === 'fr' ? 'Étape' : 'Step'} 0{step.stepNumber}
                          </span>
                        )}
                      </div>

                      <div className={`font-pixel text-[11px] leading-tight mb-1 group-hover:text-pink-400 transition-colors ${
                        step.isCurrent ? 'text-pink-300 font-bold' : 'text-slate-200'
                      }`}>
                        {step.titleKey}
                      </div>

                      <div className="font-retro text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {step.descKey}
                      </div>
                    </div>

                    {step.badge && (
                      <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-retro">
                        <span className="text-slate-500">{language === 'fr' ? 'Statut :' : 'Status:'}</span>
                        <span className="text-cyan-400 font-pixel text-[9px]">{step.badge}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
