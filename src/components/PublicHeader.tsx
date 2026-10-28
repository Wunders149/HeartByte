import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Monitor, Heart, Globe, Menu, X, Users, Calendar, Sparkles, MessageSquare } from 'lucide-react';
import { audio } from '../utils/audio';
import { AppScreen } from '../types/dating';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface PublicHeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  matchesCount: number;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  bgmActive: boolean;
  onToggleBgm: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onStartSpeedDating: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentScreen,
  onNavigate,
  matchesCount,
  crtEnabled,
  onToggleCrt,
  bgmActive,
  onToggleBgm,
  isMuted,
  onToggleMute,
  language,
  onToggleLanguage,
  onStartSpeedDating,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleMobileNav = (screen: AppScreen) => {
    audio.playSelect();
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur border-b-2 border-pink-500/30 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Hamburger (Visible < md) */}
          <button
            onClick={() => {
              audio.playSelect();
              setMobileMenuOpen(prev => !prev);
            }}
            aria-label="Toggle navigation menu"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-pink-400 hover:text-pink-300 hover:border-pink-500/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('EVENTS_DIRECTORY');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-left group focus-visible:outline-none"
          >
            <span className="font-pixel text-pink-500 text-xs sm:text-sm md:text-base tracking-tighter group-hover:text-pink-400 transition-colors whitespace-nowrap shrink-0">
              ♥ HeartByte
            </span>
            <span className="font-retro text-xs text-cyan-400 hidden lg:inline whitespace-nowrap shrink-0">
              {t.brandSubtitlePublic}
            </span>
          </button>
        </div>

        {/* Zone 2: Public Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-retro tracking-wide text-slate-300">
          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('EVENTS_DIRECTORY');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${
              currentScreen === 'EVENTS_DIRECTORY' ? 'text-pink-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.navCauses}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('EVENT_LOBBY');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${
              currentScreen === 'EVENT_LOBBY' ? 'text-pink-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.navFloor}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('SPEED_DATE');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${
              currentScreen === 'SPEED_DATE' ? 'text-pink-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.navDates}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('MATCH_MESSENGER');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 flex items-center gap-1.5 ${
              currentScreen === 'MATCH_MESSENGER' || currentScreen === 'MATCH_REVEAL'
                ? 'text-pink-400 font-bold underline underline-offset-4'
                : ''
            }`}
          >
            <span>{t.navMatches}</span>
            {matchesCount > 0 && (
              <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.2 rounded font-pixel">
                {matchesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('AVATAR_CREATOR');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${
              currentScreen === 'AVATAR_CREATOR' ? 'text-pink-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.navAvatar}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Retro Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher (EN / FR) */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleLanguage();
            }}
            title={language === 'en' ? 'Passer en Français' : 'Switch to English'}
            className="min-h-[40px] px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-cyan-400 text-xs font-retro text-cyan-300 flex items-center justify-center gap-1 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-pixel text-[10px]">{language.toUpperCase()}</span>
          </button>

          {/* CRT scanlines toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleCrt();
            }}
            title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
            className={`min-h-[40px] min-w-[36px] sm:min-w-[40px] p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-center gap-1 ${
              crtEnabled
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="font-retro hidden xl:inline text-[10px]">CRT</span>
          </button>

          {/* 8-bit BGM Toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleBgm();
            }}
            title={bgmActive ? 'Mute Chiptune BGM' : 'Play 8-Bit BGM'}
            className={`min-h-[40px] min-w-[36px] sm:min-w-[40px] p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-center gap-1 ${
              bgmActive
                ? 'border-pink-500 text-pink-300 bg-pink-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="font-retro hidden xl:inline text-[10px]">BGM</span>
          </button>

          {/* Master Sound FX Toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute 8-Bit Sound FX' : 'Mute Sound FX'}
            className={`min-h-[40px] min-w-[36px] sm:min-w-[40px] p-1.5 rounded-lg border text-xs transition-colors flex items-center justify-center gap-1 ${
              !isMuted
                ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Primary CTA: Speed Date */}
          <button
            onClick={() => {
              audio.playSelect();
              onStartSpeedDating();
              setMobileMenuOpen(false);
            }}
            className="min-h-[40px] px-2.5 sm:px-3.5 py-1.5 text-xs font-pixel text-slate-950 bg-pink-500 hover:bg-pink-400 active:translate-y-0.5 rounded-lg shadow-sm transition-transform whitespace-nowrap shrink-0 flex items-center justify-center gap-1 sm:gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden xs:inline sm:inline">{t.speedDateBtn}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 animate-fade-in bg-slate-950/95 rounded-xl p-3 space-y-1.5 shadow-2xl">
          <div className="text-[10px] font-pixel text-cyan-400 px-3 py-1 uppercase tracking-wider">
            {language === 'fr' ? 'Menu de Navigation' : 'Navigation Menu'}
          </div>

          <button
            onClick={() => handleMobileNav('EVENTS_DIRECTORY')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              currentScreen === 'EVENTS_DIRECTORY'
                ? 'bg-pink-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{t.navCauses}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">01</span>
          </button>

          <button
            onClick={() => handleMobileNav('EVENT_LOBBY')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              currentScreen === 'EVENT_LOBBY'
                ? 'bg-pink-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{t.navFloor}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">02</span>
          </button>

          <button
            onClick={() => handleMobileNav('SPEED_DATE')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              currentScreen === 'SPEED_DATE'
                ? 'bg-pink-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{t.navDates}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">03</span>
          </button>

          <button
            onClick={() => handleMobileNav('MATCH_MESSENGER')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              currentScreen === 'MATCH_MESSENGER' || currentScreen === 'MATCH_REVEAL'
                ? 'bg-pink-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{t.navMatches}</span>
            </div>
            {matchesCount > 0 ? (
              <span className="text-[10px] bg-pink-400 text-slate-950 px-2 py-0.5 rounded font-pixel">
                {matchesCount} {language === 'fr' ? 'Matchs' : 'Matches'}
              </span>
            ) : (
              <span className="text-[10px] font-pixel opacity-70">04</span>
            )}
          </button>

          <button
            onClick={() => handleMobileNav('AVATAR_CREATOR')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              currentScreen === 'AVATAR_CREATOR'
                ? 'bg-pink-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{t.navAvatar}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">05</span>
          </button>
        </div>
      )}
    </header>
  );
};
