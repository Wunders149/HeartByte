import React from 'react';
import { AppScreen } from '../types/dating';
import { Language } from '../utils/i18n';
import { audio } from '../utils/audio';
import { Calendar, Users, Heart, MessageSquare, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  matchesCount: number;
  language: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  matchesCount,
  language,
}) => {
  const isFrench = language === 'fr';

  const navItems = [
    {
      id: 'EVENTS_DIRECTORY' as AppScreen,
      label: isFrench ? 'Causes' : 'Causes',
      icon: Calendar,
      isActive: currentScreen === 'EVENTS_DIRECTORY' || currentScreen === 'TITLE',
    },
    {
      id: 'EVENT_LOBBY' as AppScreen,
      label: isFrench ? 'Salon' : 'Lobby',
      icon: Users,
      isActive: currentScreen === 'EVENT_LOBBY',
    },
    {
      id: 'SPEED_DATE' as AppScreen,
      label: isFrench ? 'Dates' : 'Dates',
      icon: Heart,
      isActive: currentScreen === 'SPEED_DATE',
      isCenterAction: true,
    },
    {
      id: 'MATCH_MESSENGER' as AppScreen,
      label: isFrench ? 'Matchs' : 'Matches',
      icon: MessageSquare,
      badge: matchesCount > 0 ? matchesCount : undefined,
      isActive: currentScreen === 'MATCH_MESSENGER' || currentScreen === 'MATCH_REVEAL',
    },
    {
      id: 'AVATAR_CREATOR' as AppScreen,
      label: isFrench ? 'Avatar' : 'Sprite',
      icon: Sparkles,
      isActive: currentScreen === 'AVATAR_CREATOR',
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-pink-500/35 px-1.5 pt-1 shadow-[0_-8px_24px_rgba(0,0,0,0.6)] pb-[max(env(safe-area-inset-bottom),6px)]"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isSelected = item.isActive;

          if (item.isCenterAction) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  audio.playSelect();
                  onNavigate(item.id);
                }}
                className="flex flex-col items-center justify-center min-h-[50px] -mt-2 group focus:outline-none"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-pink-500 border-yellow-300 ring-2 ring-pink-500/40 scale-105'
                      : 'bg-slate-900 border-pink-500/80 group-hover:border-pink-400 group-hover:bg-slate-800'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isSelected
                        ? 'fill-slate-950 text-slate-950'
                        : 'text-pink-400 fill-pink-500/40 group-hover:fill-pink-500'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-pixel tracking-tighter mt-0.5 transition-colors ${
                    isSelected ? 'text-pink-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                audio.playSelect();
                onNavigate(item.id);
              }}
              className={`flex flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl transition-all relative active:scale-95 ${
                isSelected
                  ? 'text-pink-400 bg-pink-950/35'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              {isSelected && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-pink-400 rounded-full" />
              )}
              <div className="relative">
                <Icon className={`w-5 h-5 ${isSelected ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-pink-500 text-white font-pixel text-[9px] flex items-center justify-center shadow-sm tabular-nums">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-retro tracking-wide mt-0.5 truncate max-w-full ${
                  isSelected ? 'font-bold text-pink-300' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
