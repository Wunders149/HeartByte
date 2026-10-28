import React from 'react';
import { Volume2, VolumeX, Music, Monitor, Plus, ShieldCheck } from 'lucide-react';
import { audio } from '../utils/audio';
import { AppScreen } from '../types/dating';

interface RetroHeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  matchesCount: number;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  bgmActive: boolean;
  onToggleBgm: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCreateEvent: () => void;
}

export const RetroHeader: React.FC<RetroHeaderProps> = ({
  currentScreen,
  onNavigate,
  matchesCount,
  crtEnabled,
  onToggleCrt,
  bgmActive,
  onToggleBgm,
  isMuted,
  onToggleMute,
  onOpenCreateEvent,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur border-b-2 border-pink-500/30 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            audio.playSelect();
            onNavigate('EVENTS_DIRECTORY');
          }}
          className="flex items-center gap-2 text-left group focus-visible:outline-none"
        >
          <span className="font-pixel text-pink-500 text-sm md:text-base tracking-tighter group-hover:text-pink-400 transition-colors whitespace-nowrap shrink-0">
            ♥ HeartByte
          </span>
          <span className="font-retro text-xs text-cyan-400 hidden sm:inline whitespace-nowrap shrink-0">
            Fundraiser & Dating
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-retro tracking-wide text-slate-300">
          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('EVENTS_DIRECTORY');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-400 ${
              currentScreen === 'EVENTS_DIRECTORY' ? 'text-pink-400 font-bold underline underline-offset-4' : ''
            }`}
          >
            Causes & Events
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
            Dating Floor
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
            Speed Dates
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
            <span>Matches</span>
            {matchesCount > 0 && (
              <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.2 rounded font-pixel">
                {matchesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              audio.playSelect();
              onNavigate('ADMIN_DASHBOARD');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-yellow-400 flex items-center gap-1 ${
              currentScreen === 'ADMIN_DASHBOARD'
                ? 'text-yellow-400 font-bold underline underline-offset-4'
                : 'text-yellow-300/80 hover:text-yellow-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Hub</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Retro Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* CRT scanlines toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleCrt();
            }}
            title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
            className={`p-1.5 rounded border text-xs transition-colors flex items-center gap-1 ${
              crtEnabled
                ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="font-retro hidden lg:inline text-[10px]">CRT</span>
          </button>

          {/* 8-bit BGM Toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleBgm();
            }}
            title={bgmActive ? 'Mute Chiptune BGM' : 'Play 8-Bit BGM'}
            className={`p-1.5 rounded border text-xs transition-colors flex items-center gap-1 ${
              bgmActive
                ? 'border-pink-500 text-pink-300 bg-pink-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="font-retro hidden lg:inline text-[10px]">BGM</span>
          </button>

          {/* Master Sound FX Toggle */}
          <button
            onClick={() => {
              audio.playSelect();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute 8-Bit Sound FX' : 'Mute Sound FX'}
            className={`p-1.5 rounded border text-xs transition-colors flex items-center gap-1 ${
              !isMuted
                ? 'border-emerald-500 text-emerald-300 bg-emerald-950/40'
                : 'border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="font-retro hidden lg:inline text-[10px]">SFX</span>
          </button>

          {/* Primary CTA: Create Fundraiser Event */}
          <button
            onClick={() => {
              audio.playSelect();
              onOpenCreateEvent();
            }}
            className="px-3.5 py-1.5 text-xs font-pixel text-slate-950 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 active:translate-y-0.5 rounded shadow-sm transition-transform whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            <span>Create Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
