import React from 'react';
import { AvatarConfig, Expression, SkinTone, HairColor, OutfitColor } from '../types/dating';

interface PixelAvatarProps {
  avatar: AvatarConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  expressionOverride?: Expression;
  showReactionBadge?: boolean;
  className?: string;
  animate?: boolean;
}

// Color palettes for 8-bit aesthetic
const SKIN_COLORS: Record<SkinTone, { base: string; shadow: string }> = {
  fair: { base: '#fed7aa', shadow: '#fdba74' },
  peach: { base: '#fbcfe8', shadow: '#f472b6' },
  'warm-tan': { base: '#f59e0b', shadow: '#d97706' },
  'deep-bronze': { base: '#92400e', shadow: '#78350f' },
  'cyber-lilac': { base: '#c084fc', shadow: '#9333ea' },
  'alien-mint': { base: '#6ee7b7', shadow: '#10b981' }
};

const HAIR_COLORS: Record<HairColor, { base: string; highlight: string }> = {
  'neon-cyan': { base: '#06b6d4', highlight: '#67e8f9' },
  'neon-pink': { base: '#f43f5e', highlight: '#fda4af' },
  raven: { base: '#1e293b', highlight: '#475569' },
  golden: { base: '#facc15', highlight: '#fef08a' },
  ruby: { base: '#dc2626', highlight: '#f87171' },
  lavender: { base: '#a855f7', highlight: '#d8b4fe' },
  emerald: { base: '#059669', highlight: '#34d399' }
};

const OUTFIT_COLORS: Record<OutfitColor, { primary: string; secondary: string }> = {
  cyan: { primary: '#0284c7', secondary: '#38bdf8' },
  magenta: { primary: '#db2777', secondary: '#f472b6' },
  yellow: { primary: '#eab308', secondary: '#fef08a' },
  purple: { primary: '#7c3aed', secondary: '#c084fc' },
  emerald: { primary: '#047857', secondary: '#10b981' },
  crimson: { primary: '#be123c', secondary: '#f43f5e' }
};

export const PixelAvatar: React.FC<PixelAvatarProps> = ({
  avatar,
  size = 'md',
  expressionOverride,
  showReactionBadge = true,
  className = '',
  animate = true
}) => {
  const currentExpression = expressionOverride || avatar.expression;

  const sizePixels = {
    xs: 40,
    sm: 64,
    md: 100,
    lg: 160,
    xl: 220
  }[size];

  const skin = SKIN_COLORS[avatar.skinTone] || SKIN_COLORS.peach;
  const hair = HAIR_COLORS[avatar.hairColor] || HAIR_COLORS['neon-cyan'];
  const outfit = OUTFIT_COLORS[avatar.outfitColor] || OUTFIT_COLORS.cyan;

  return (
    <div 
      className={`relative inline-block select-none ${animate ? 'hover:scale-105 transition-transform duration-150' : ''} ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full pixel-art filter drop-shadow-md"
        shapeRendering="crispEdges"
      >
        {/* Background Aura / Halo */}
        {currentExpression === 'love' && (
          <rect x="2" y="2" width="20" height="20" fill="#f43f5e" opacity="0.15" />
        )}

        {/* Head Base (Skin) */}
        <rect x="6" y="5" width="12" height="11" fill={skin.base} />
        <rect x="7" y="16" width="10" height="1" fill={skin.shadow} />
        <rect x="5" y="8" width="1" height="6" fill={skin.shadow} />
        <rect x="18" y="8" width="1" height="6" fill={skin.shadow} />

        {/* Neck */}
        <rect x="10" y="16" width="4" height="2" fill={skin.shadow} />

        {/* Hair Styles */}
        {avatar.hairStyle === 'spiky' && (
          <g>
            <rect x="5" y="2" width="4" height="3" fill={hair.base} />
            <rect x="10" y="1" width="4" height="4" fill={hair.highlight} />
            <rect x="15" y="2" width="4" height="3" fill={hair.base} />
            <rect x="5" y="5" width="14" height="3" fill={hair.base} />
            <rect x="4" y="6" width="2" height="4" fill={hair.base} />
            <rect x="18" y="6" width="2" height="4" fill={hair.base} />
          </g>
        )}

        {avatar.hairStyle === 'bob' && (
          <g>
            <rect x="6" y="3" width="12" height="4" fill={hair.base} />
            <rect x="5" y="4" width="2" height="10" fill={hair.base} />
            <rect x="17" y="4" width="2" height="10" fill={hair.base} />
            <rect x="8" y="3" width="7" height="2" fill={hair.highlight} />
            <rect x="6" y="6" width="12" height="2" fill={hair.base} />
          </g>
        )}

        {avatar.hairStyle === 'pixie' && (
          <g>
            <rect x="6" y="3" width="12" height="4" fill={hair.base} />
            <rect x="4" y="5" width="2" height="5" fill={hair.base} />
            <rect x="18" y="5" width="1" height="4" fill={hair.base} />
            <rect x="7" y="3" width="8" height="2" fill={hair.highlight} />
            <rect x="6" y="7" width="5" height="1" fill={hair.base} />
          </g>
        )}

        {avatar.hairStyle === 'afro' && (
          <g>
            <rect x="4" y="1" width="16" height="7" fill={hair.base} />
            <rect x="3" y="3" width="18" height="6" fill={hair.base} />
            <rect x="6" y="2" width="10" height="2" fill={hair.highlight} />
            <rect x="3" y="9" width="3" height="4" fill={hair.base} />
            <rect x="18" y="9" width="3" height="4" fill={hair.base} />
          </g>
        )}

        {avatar.hairStyle === 'long' && (
          <g>
            <rect x="5" y="2" width="14" height="5" fill={hair.base} />
            <rect x="4" y="5" width="3" height="14" fill={hair.base} />
            <rect x="17" y="5" width="3" height="14" fill={hair.base} />
            <rect x="7" y="3" width="9" height="2" fill={hair.highlight} />
            <rect x="6" y="6" width="12" height="2" fill={hair.base} />
          </g>
        )}

        {avatar.hairStyle === 'cap' && (
          <g>
            <rect x="5" y="2" width="14" height="4" fill="#be123c" />
            <rect x="4" y="5" width="16" height="2" fill="#9f1239" />
            <rect x="14" y="6" width="7" height="1" fill="#475569" />
            <rect x="5" y="7" width="2" height="4" fill={hair.base} />
            <rect x="17" y="7" width="2" height="4" fill={hair.base} />
          </g>
        )}

        {avatar.hairStyle === 'fade' && (
          <g>
            <rect x="7" y="2" width="10" height="4" fill={hair.base} />
            <rect x="8" y="2" width="7" height="2" fill={hair.highlight} />
            <rect x="5" y="5" width="2" height="4" fill={hair.base} opacity="0.5" />
            <rect x="17" y="5" width="2" height="4" fill={hair.base} opacity="0.5" />
          </g>
        )}

        {/* Eyes & Eyewear */}
        {avatar.eyeStyle === 'shades' ? (
          <g>
            <rect x="6" y="9" width="12" height="3" fill="#0f172a" />
            <rect x="7" y="10" width="4" height="2" fill="#1e293b" />
            <rect x="13" y="10" width="4" height="2" fill="#1e293b" />
            <rect x="8" y="9" width="2" height="1" fill="#38bdf8" />
            <rect x="14" y="9" width="2" height="1" fill="#38bdf8" />
          </g>
        ) : avatar.eyeStyle === 'round-glasses' ? (
          <g>
            <rect x="7" y="9" width="4" height="4" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="13" y="9" width="4" height="4" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="11" y="10" width="2" height="1" fill="#e2e8f0" />
            <rect x="8" y="10" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="10" width="2" height="2" fill="#0f172a" />
            <rect x="8" y="10" width="1" height="1" fill="#ffffff" />
            <rect x="14" y="10" width="1" height="1" fill="#ffffff" />
          </g>
        ) : currentExpression === 'love' ? (
          <g>
            {/* Heart eyes! */}
            <rect x="7" y="9" width="1" height="2" fill="#ec4899" />
            <rect x="9" y="9" width="1" height="2" fill="#ec4899" />
            <rect x="7" y="10" width="3" height="1" fill="#ec4899" />
            <rect x="8" y="11" width="1" height="1" fill="#ec4899" />

            <rect x="14" y="9" width="1" height="2" fill="#ec4899" />
            <rect x="16" y="9" width="1" height="2" fill="#ec4899" />
            <rect x="14" y="10" width="3" height="1" fill="#ec4899" />
            <rect x="15" y="11" width="1" height="1" fill="#ec4899" />
          </g>
        ) : avatar.eyeStyle === 'wink' ? (
          <g>
            {/* Left Eye open */}
            <rect x="8" y="9" width="2" height="3" fill="#0f172a" />
            <rect x="8" y="9" width="1" height="1" fill="#ffffff" />
            {/* Right Eye wink */}
            <rect x="14" y="10" width="3" height="1" fill="#0f172a" />
            <rect x="13" y="11" width="1" height="1" fill="#0f172a" />
            <rect x="17" y="11" width="1" height="1" fill="#0f172a" />
          </g>
        ) : (
          <g>
            {/* Standard Eyes */}
            <rect x="8" y="9" width="2" height="3" fill="#0f172a" />
            <rect x="8" y="9" width="1" height="1" fill="#ffffff" />
            <rect x="14" y="9" width="2" height="3" fill="#0f172a" />
            <rect x="14" y="9" width="1" height="1" fill="#ffffff" />
          </g>
        )}

        {/* Cheeks / Blush */}
        {(currentExpression === 'blush' || currentExpression === 'love' || avatar.eyeStyle === 'sparkle') && (
          <g>
            <rect x="6" y="12" width="2" height="1" fill="#fb7185" />
            <rect x="16" y="12" width="2" height="1" fill="#fb7185" />
          </g>
        )}

        {/* Mouth / Expressions */}
        {currentExpression === 'happy' || currentExpression === 'love' ? (
          <g>
            <rect x="10" y="13" width="4" height="2" fill="#be123c" />
            <rect x="11" y="14" width="2" height="1" fill="#f43f5e" />
          </g>
        ) : currentExpression === 'shock' ? (
          <rect x="11" y="13" width="2" height="2" fill="#be123c" />
        ) : currentExpression === 'skeptical' ? (
          <rect x="10" y="14" width="4" height="1" fill="#78350f" />
        ) : (
          <rect x="10" y="14" width="4" height="1" fill="#be123c" />
        )}

        {/* Torso / Outfits */}
        {avatar.outfitStyle === 'arcade-jacket' && (
          <g>
            <rect x="6" y="18" width="12" height="6" fill={outfit.primary} />
            <rect x="5" y="19" width="2" height="5" fill={outfit.primary} />
            <rect x="17" y="19" width="2" height="5" fill={outfit.primary} />
            {/* Open zipper with neon shirt */}
            <rect x="10" y="18" width="4" height="6" fill="#0f172a" />
            <rect x="11" y="18" width="2" height="6" fill={outfit.secondary} />
            {/* Lapels */}
            <rect x="9" y="18" width="1" height="4" fill={outfit.secondary} />
            <rect x="14" y="18" width="1" height="4" fill={outfit.secondary} />
          </g>
        )}

        {avatar.outfitStyle === 'cyber-turtleneck' && (
          <g>
            <rect x="9" y="16" width="6" height="2" fill="#0f172a" />
            <rect x="5" y="18" width="14" height="6" fill="#1e293b" />
            {/* Cyber neon circuit lines */}
            <rect x="6" y="19" width="1" height="4" fill={outfit.secondary} />
            <rect x="17" y="19" width="1" height="4" fill={outfit.secondary} />
            <rect x="11" y="19" width="2" height="4" fill={outfit.primary} />
          </g>
        )}

        {avatar.outfitStyle === 'cozy-sweater' && (
          <g>
            <rect x="5" y="17" width="14" height="7" fill={outfit.primary} />
            <rect x="4" y="18" width="2" height="6" fill={outfit.primary} />
            <rect x="18" y="18" width="2" height="6" fill={outfit.primary} />
            {/* Knit pattern stitches */}
            <rect x="8" y="19" width="2" height="1" fill={outfit.secondary} />
            <rect x="14" y="19" width="2" height="1" fill={outfit.secondary} />
            <rect x="9" y="21" width="2" height="1" fill={outfit.secondary} />
            <rect x="13" y="21" width="2" height="1" fill={outfit.secondary} />
          </g>
        )}

        {avatar.outfitStyle === 'vintage-shirt' && (
          <g>
            <rect x="6" y="18" width="12" height="6" fill={outfit.primary} />
            <rect x="5" y="19" width="2" height="5" fill={outfit.primary} />
            <rect x="17" y="19" width="2" height="5" fill={outfit.primary} />
            {/* Bowling retro horizontal stripe */}
            <rect x="6" y="20" width="12" height="2" fill={outfit.secondary} />
            <rect x="11" y="18" width="2" height="6" fill="#f8fafc" />
            <rect x="11" y="19" width="1" height="1" fill="#0f172a" />
            <rect x="11" y="22" width="1" height="1" fill="#0f172a" />
          </g>
        )}

        {avatar.outfitStyle === 'hoodie' && (
          <g>
            <rect x="5" y="17" width="14" height="7" fill={outfit.primary} />
            <rect x="4" y="18" width="2" height="6" fill={outfit.primary} />
            <rect x="18" y="18" width="2" height="6" fill={outfit.primary} />
            {/* Drawstrings */}
            <rect x="10" y="18" width="1" height="4" fill="#f8fafc" />
            <rect x="13" y="18" width="1" height="4" fill="#f8fafc" />
            {/* Front pouch pocket */}
            <rect x="8" y="21" width="8" height="3" fill={outfit.secondary} />
          </g>
        )}

        {/* Accessories */}
        {avatar.accessory === 'headphones' && (
          <g>
            {/* Headband */}
            <rect x="5" y="1" width="14" height="2" fill="#0f172a" />
            {/* Ear cups */}
            <rect x="3" y="7" width="3" height="5" fill="#f43f5e" />
            <rect x="18" y="7" width="3" height="5" fill="#f43f5e" />
          </g>
        )}

        {avatar.accessory === 'cat-ears' && (
          <g>
            <rect x="4" y="1" width="4" height="3" fill="#ec4899" />
            <rect x="5" y="2" width="2" height="1" fill="#fbcfe8" />
            <rect x="16" y="1" width="4" height="3" fill="#ec4899" />
            <rect x="17" y="2" width="2" height="1" fill="#fbcfe8" />
          </g>
        )}

        {avatar.accessory === 'bandana' && (
          <g>
            <rect x="6" y="5" width="12" height="2" fill="#ef4444" />
            <rect x="5" y="6" width="2" height="1" fill="#ef4444" />
            <rect x="17" y="6" width="2" height="1" fill="#ef4444" />
            <rect x="8" y="5" width="1" height="1" fill="#ffffff" />
            <rect x="13" y="5" width="1" height="1" fill="#ffffff" />
          </g>
        )}

        {avatar.accessory === 'gold-chain' && (
          <g>
            <rect x="9" y="17" width="6" height="2" fill="#eab308" />
            <rect x="11" y="19" width="2" height="2" fill="#facc15" />
          </g>
        )}

        {avatar.accessory === 'boba' && (
          <g>
            <rect x="18" y="17" width="4" height="6" fill="#f8fafc" opacity="0.9" />
            <rect x="19" y="19" width="2" height="3" fill="#c084fc" />
            <rect x="19" y="21" width="1" height="1" fill="#0f172a" />
            <rect x="20" y="21" width="1" height="1" fill="#0f172a" />
            <rect x="20" y="15" width="1" height="3" fill="#f43f5e" />
          </g>
        )}

        {/* Emotion Special FX (Sweat drop or heart) */}
        {currentExpression === 'shock' && (
          <g>
            <rect x="19" y="5" width="2" height="3" fill="#38bdf8" />
            <rect x="20" y="4" width="1" height="1" fill="#38bdf8" />
          </g>
        )}
      </svg>

      {/* Floating 8-bit Heart Badge on Match / Love */}
      {showReactionBadge && currentExpression === 'love' && (
        <div className="absolute -top-3 -right-2 text-pink-500 font-pixel text-xs animate-bounce drop-shadow">
          ♥
        </div>
      )}

      {showReactionBadge && currentExpression === 'shock' && (
        <div className="absolute -top-3 -right-2 text-cyan-400 font-pixel text-xs animate-pulse">
          ?!
        </div>
      )}
    </div>
  );
};
