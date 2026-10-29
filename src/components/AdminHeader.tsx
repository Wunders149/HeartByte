import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Monitor, ShieldCheck, ArrowLeft, Plus, Globe, Menu, X, Calendar, Users, Bell, TrendingUp } from 'lucide-react';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface AdminHeaderProps {
  activeTab: 'events' | 'attendees' | 'speeddating' | 'analytics';
  onSelectTab: (tab: 'events' | 'attendees' | 'speeddating' | 'analytics') => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  bgmActive: boolean;
  onToggleBgm: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenCreateEvent: () => void;
  onExitToPublic: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onSelectTab,
  crtEnabled,
  onToggleCrt,
  bgmActive,
  onToggleBgm,
  isMuted,
  onToggleMute,
  language,
  onToggleLanguage,
  onOpenCreateEvent,
  onExitToPublic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const handleMobileTab = (tab: 'events' | 'attendees' | 'speeddating' | 'analytics') => {
    audio.playSelect();
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur border-b-2 border-yellow-500/40 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6 md:gap-8">
        {/* Zone 1: Admin Brand Wordmark */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle for Admin Tabs */}
          <button
            onClick={() => {
              audio.playSelect();
              setMobileMenuOpen(prev => !prev);
            }}
            aria-label="Toggle admin menu"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/50 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <span className="p-1 sm:p-1.5 bg-yellow-400/20 border border-yellow-400/60 rounded text-yellow-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div className="flex flex-col">
              <span className="font-pixel text-yellow-400 text-xs sm:text-sm tracking-tight whitespace-nowrap">
                HeartByte
              </span>
              <span className="font-retro text-[9px] sm:text-[10px] text-slate-400 whitespace-nowrap hidden xs:inline">
                {t.brandSubtitleAdmin}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Admin Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-retro tracking-wide text-slate-300">
          <button
            onClick={() => {
              audio.playSelect();
              onSelectTab('events');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-yellow-400 ${
              activeTab === 'events' ? 'text-yellow-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.tabEvents}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onSelectTab('attendees');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-yellow-400 ${
              activeTab === 'attendees' ? 'text-yellow-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.tabCheckIn}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onSelectTab('speeddating');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-yellow-400 ${
              activeTab === 'speeddating' ? 'text-yellow-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.tabFloorBell}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onSelectTab('analytics');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-yellow-400 ${
              activeTab === 'analytics' ? 'text-yellow-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            {t.tabAnalytics}
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleLanguage();
            }}
            title={language === 'en' ? 'Passer en Français' : 'Switch to English'}
            className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-yellow-400 text-xs font-retro text-yellow-300 flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <Globe className="w-4 h-4 text-yellow-400" />
            <span className="font-pixel text-[11px] font-bold">{language.toUpperCase()}</span>
          </button>

          {/* New Event Button (Desktop/Tablet) */}
          <button
            onClick={() => {
              audio.playSelect();
              onOpenCreateEvent();
            }}
            className="hidden sm:flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-retro text-yellow-300 bg-yellow-950/40 border border-yellow-500/50 hover:bg-yellow-900/40 rounded-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newCampaign}</span>
          </button>

          {/* CRT scanlines toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleCrt();
            }}
            title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
            className={`min-h-[44px] min-w-[44px] p-2 rounded-lg border text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
              crtEnabled
                ? 'border-yellow-400 text-yellow-300 bg-yellow-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="font-retro hidden xl:inline text-[10px]">CRT</span>
          </button>

          {/* 8-bit BGM Toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleBgm();
            }}
            title={bgmActive ? 'Mute Chiptune BGM' : 'Play 8-Bit BGM'}
            className={`min-h-[44px] min-w-[44px] p-2 rounded-lg border text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
              bgmActive
                ? 'border-yellow-400 text-yellow-300 bg-yellow-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-4 h-4" />
            <span className="font-retro hidden xl:inline text-[10px]">BGM</span>
          </button>

          {/* Master Sound FX Toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute 8-Bit Sound FX' : 'Mute Sound FX'}
            className={`min-h-[44px] min-w-[44px] p-2 rounded-lg border text-xs transition-all active:scale-95 flex items-center justify-center gap-1 ${
              !isMuted
                ? 'border-yellow-400 text-yellow-300 bg-yellow-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Primary CTA: Exit to Public App */}
          <button
            onClick={() => {
              audio.playSelect();
              onExitToPublic();
            }}
            className="min-h-[44px] px-3.5 py-2 text-xs font-pixel text-slate-950 bg-yellow-400 hover:bg-yellow-300 active:scale-95 rounded-lg shadow-md transition-all whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">{t.exitToPublic}</span>
          </button>
        </div>
      </div>

      {/* Mobile Admin Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 animate-fade-in bg-slate-950/95 rounded-xl p-3 space-y-1.5 shadow-2xl">
          <div className="text-[10px] font-pixel text-yellow-400 px-3 py-1 uppercase tracking-wider">
            {language === 'fr' ? 'Navigation Organisateur' : 'Organizer Navigation'}
          </div>

          <button
            onClick={() => handleMobileTab('events')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              activeTab === 'events'
                ? 'bg-yellow-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-yellow-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{t.tabEvents}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">01</span>
          </button>

          <button
            onClick={() => handleMobileTab('attendees')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              activeTab === 'attendees'
                ? 'bg-yellow-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-yellow-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{t.tabCheckIn}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">02</span>
          </button>

          <button
            onClick={() => handleMobileTab('speeddating')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              activeTab === 'speeddating'
                ? 'bg-yellow-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-yellow-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>{t.tabFloorBell}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">03</span>
          </button>

          <button
            onClick={() => handleMobileTab('analytics')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro flex items-center justify-between transition-colors ${
              activeTab === 'analytics'
                ? 'bg-yellow-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:bg-slate-900 hover:text-yellow-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{t.tabAnalytics}</span>
            </div>
            <span className="text-[10px] font-pixel opacity-70">04</span>
          </button>

          <div className="pt-2 border-t border-slate-900">
            <button
              onClick={() => {
                audio.playSelect();
                onOpenCreateEvent();
                setMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg text-xs font-retro bg-yellow-950/60 border border-yellow-500/50 text-yellow-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newCampaign}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
