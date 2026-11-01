import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { audio } from '../utils/audio';

export type ModalTheme = 'pink' | 'yellow' | 'cyan' | 'emerald' | 'rose';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  theme?: ModalTheme;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

const THEME_STYLES: Record<ModalTheme, {
  border: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  titleColor: string;
}> = {
  pink: {
    border: 'border-pink-500',
    glow: 'shadow-[0_0_30px_rgba(236,72,153,0.25)]',
    badgeBg: 'bg-pink-950/70 border-pink-500/50',
    badgeText: 'text-pink-300',
    titleColor: 'text-pink-400',
  },
  yellow: {
    border: 'border-yellow-400',
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.25)]',
    badgeBg: 'bg-yellow-950/70 border-yellow-500/50',
    badgeText: 'text-yellow-300',
    titleColor: 'text-yellow-400',
  },
  cyan: {
    border: 'border-cyan-400',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.25)]',
    badgeBg: 'bg-cyan-950/70 border-cyan-500/50',
    badgeText: 'text-cyan-300',
    titleColor: 'text-cyan-400',
  },
  emerald: {
    border: 'border-emerald-500',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    badgeBg: 'bg-emerald-950/70 border-emerald-500/50',
    badgeText: 'text-emerald-300',
    titleColor: 'text-emerald-400',
  },
  rose: {
    border: 'border-rose-500',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    badgeBg: 'bg-rose-950/70 border-rose-500/50',
    badgeText: 'text-rose-300',
    titleColor: 'text-rose-400',
  },
};

const MAX_WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
};

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  badge,
  theme = 'pink',
  maxWidth = 'xl',
  children,
  footer,
  hideCloseButton = false,
}) => {
  // ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audio.playSelect();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const styles = THEME_STYLES[theme];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audio.playSelect();
          onClose();
        }
      }}
    >
      <div
        className={`relative w-full ${MAX_WIDTHS[maxWidth]} bg-slate-900 border-2 ${styles.border} ${styles.glow} rounded-2xl shadow-2xl p-5 sm:p-6 md:p-7 max-h-[92vh] flex flex-col my-auto transition-transform duration-200 animate-in zoom-in-95`}
      >
        {/* Retro scanline overlay within modal */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-2xl" />

        {/* Close Button */}
        {!hideCloseButton && (
          <button
            onClick={() => {
              audio.playSelect();
              onClose();
            }}
            aria-label="Close modal"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="mb-4 sm:mb-5 pr-8">
          {badge && (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-pixel tracking-wider uppercase mb-2 ${styles.badgeBg} ${styles.badgeText}`}>
              {icon}
              <span>{badge}</span>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            {!badge && icon && (
              <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0`}>
                {icon}
              </div>
            )}
            <div>
              <h2 className={`text-lg sm:text-xl md:text-2xl font-pixel ${styles.titleColor} leading-snug`}>
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 font-retro mt-1 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body with internal scrolling */}
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-4">
          {children}
        </div>

        {/* Optional Modal Footer */}
        {footer && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
