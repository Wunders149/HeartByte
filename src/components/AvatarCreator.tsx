import React, { useState } from 'react';
import { PlayerProfile, HairStyle, HairColor, SkinTone, EyeStyle, OutfitStyle, OutfitColor, Accessory } from '../types/dating';
import { PixelAvatar } from './PixelAvatar';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { Sparkles, Check, RefreshCw } from 'lucide-react';

interface AvatarCreatorProps {
  profile: PlayerProfile;
  language?: Language;
  onSaveProfile: (profile: PlayerProfile) => void;
  onStartDating: () => void;
}

const SKIN_TONES: { id: SkinTone; label: string; color: string }[] = [
  { id: 'fair', label: 'Fair', color: '#fed7aa' },
  { id: 'peach', label: 'Peach', color: '#fbcfe8' },
  { id: 'warm-tan', label: 'Caramel', color: '#f59e0b' },
  { id: 'deep-bronze', label: 'Bronze', color: '#92400e' },
  { id: 'cyber-lilac', label: 'Lilac', color: '#c084fc' },
  { id: 'alien-mint', label: 'Mint', color: '#6ee7b7' },
];

const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: 'spiky', label: 'Spiky Punk' },
  { id: 'bob', label: 'Pixel Bob' },
  { id: 'pixie', label: 'Cute Pixie' },
  { id: 'afro', label: 'Afro Puff' },
  { id: 'long', label: 'Cascading' },
  { id: 'cap', label: 'Arcade Cap' },
  { id: 'fade', label: 'Side Fade' },
];

const HAIR_COLORS: { id: HairColor; label: string; color: string }[] = [
  { id: 'neon-cyan', label: 'Cyan', color: '#06b6d4' },
  { id: 'neon-pink', label: 'Pink', color: '#f43f5e' },
  { id: 'raven', label: 'Raven', color: '#1e293b' },
  { id: 'golden', label: 'Gold', color: '#facc15' },
  { id: 'ruby', label: 'Ruby', color: '#dc2626' },
  { id: 'lavender', label: 'Lilac', color: '#a855f7' },
  { id: 'emerald', label: 'Emerald', color: '#059669' },
];

const EYE_STYLES: { id: EyeStyle; label: string }[] = [
  { id: 'normal', label: 'Classic' },
  { id: 'wink', label: 'Playful Wink' },
  { id: 'shades', label: '8-Bit Shades' },
  { id: 'round-glasses', label: 'Specs' },
  { id: 'sparkle', label: 'Anime Sparkle' },
];

const OUTFIT_STYLES: { id: OutfitStyle; label: string }[] = [
  { id: 'arcade-jacket', label: 'Bomber Jacket' },
  { id: 'cyber-turtleneck', label: 'Cyber Turtleneck' },
  { id: 'cozy-sweater', label: 'Knit Sweater' },
  { id: 'vintage-shirt', label: 'Bowling Shirt' },
  { id: 'hoodie', label: 'Pixel Hoodie' },
];

const OUTFIT_COLORS: { id: OutfitColor; label: string; color: string }[] = [
  { id: 'cyan', label: 'Cyan', color: '#0284c7' },
  { id: 'magenta', label: 'Magenta', color: '#db2777' },
  { id: 'yellow', label: 'Gold', color: '#eab308' },
  { id: 'purple', label: 'Purple', color: '#7c3aed' },
  { id: 'emerald', label: 'Green', color: '#047857' },
  { id: 'crimson', label: 'Crimson', color: '#be123c' },
];

const ACCESSORIES: { id: Accessory; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'cat-ears', label: 'Cat Ears' },
  { id: 'bandana', label: 'Bandana' },
  { id: 'gold-chain', label: 'Gold Chain' },
  { id: 'boba', label: 'Boba Cup' },
];

export const AvatarCreator: React.FC<AvatarCreatorProps> = ({
  profile,
  language = 'fr',
  onSaveProfile,
  onStartDating,
}) => {
  const [currentProfile, setCurrentProfile] = useState<PlayerProfile>(profile);
  const [activeTab, setActiveTab] = useState<'avatar' | 'profile'>('avatar');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const t = TRANSLATIONS[language];

  const updateAvatar = (partial: Partial<PlayerProfile['avatar']>) => {
    audio.playSelect();
    setCurrentProfile(prev => ({
      ...prev,
      avatar: { ...prev.avatar, ...partial }
    }));
  };

  const randomizeAvatar = () => {
    audio.playSuperLike();
    const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    setCurrentProfile(prev => ({
      ...prev,
      avatar: {
        skinTone: randomItem(SKIN_TONES).id,
        hairStyle: randomItem(HAIR_STYLES).id,
        hairColor: randomItem(HAIR_COLORS).id,
        eyeStyle: randomItem(EYE_STYLES).id,
        outfitStyle: randomItem(OUTFIT_STYLES).id,
        outfitColor: randomItem(OUTFIT_COLORS).id,
        accessory: randomItem(ACCESSORIES).id,
        expression: 'idle'
      }
    }));
  };

  const handleSave = () => {
    audio.playHeartGain();
    onSaveProfile(currentProfile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const isFr = language === 'fr';

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {/* Title & Kicker */}
      <div className="text-center mb-4 sm:mb-8">
        <div className="text-xs font-retro text-cyan-400 tracking-wider mb-1 sm:mb-2">
          {isFr ? 'CONFIGURATION DU PROFIL JOUEUR' : 'PLAYER PROFILE CONFIGURATION'}
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-pixel text-pink-400 text-wrap-balance">
          {isFr ? 'Créez Votre Prétendant 8-Bit' : 'Customize Your 8-Bit Suitor'}
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1 sm:mt-2 font-retro max-w-xl mx-auto px-2">
          {isFr
            ? 'Concevez votre sprite rétro pixel, personnalisez vos centres d’intérêt et préparez-vous aux rencontres express.'
            : 'Design your retro pixel sprite, choose your dating preferences, and prepare for high-speed romantic encounters.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
        {/* Left Column: Live Pixel Avatar Preview & ID Card (Sticky on mobile for instant visual feedback) */}
        <div className="lg:col-span-5 bg-slate-900 border-2 border-pink-500/50 rounded-xl p-3 sm:p-6 shadow-xl relative overflow-hidden sticky top-14 sm:static z-20 backdrop-blur-md">
          <div className="absolute top-2 right-3 text-[10px] font-pixel text-pink-500/60 hidden sm:block">
            ID: P1-LOVER
          </div>

          <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 pt-1 sm:pt-4 sm:pb-6">
            <div className="p-2 sm:p-4 bg-slate-950/90 border-2 border-cyan-400/40 rounded-lg shadow-inner shrink-0">
              {/* Desktop Avatar Preview */}
              <div className="hidden sm:block">
                <PixelAvatar
                  avatar={currentProfile.avatar}
                  size="xl"
                  animate={true}
                />
              </div>
              {/* Compact Mobile Avatar Preview */}
              <div className="sm:hidden">
                <PixelAvatar
                  avatar={currentProfile.avatar}
                  size="sm"
                  animate={true}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 sm:text-center">
              <h2 className="font-pixel text-xs sm:text-lg text-slate-100 truncate">
                {currentProfile.name || (isFr ? 'Joueur Anonyme' : 'Anonymous Player')}
              </h2>
              <div className="text-[11px] sm:text-xs font-retro text-cyan-400 truncate mt-0.5 sm:mt-1">
                {currentProfile.pronouns} · {currentProfile.vibeTag}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400 mt-1 sm:mt-3 italic max-w-xs line-clamp-1 sm:line-clamp-none hidden xs:block">
                &ldquo;{currentProfile.bio || (isFr ? 'Prêt(e) à matcher au diner 8-bit !' : 'Ready to match at the 8-bit diner.')}&rdquo;
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-2 sm:mt-6 w-full">
                <button
                  onClick={randomizeAvatar}
                  className="flex-1 px-2.5 sm:px-4 py-2 sm:py-2.5 min-h-[44px] text-[11px] sm:text-xs font-retro text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isFr ? 'Aléatoire' : 'Randomize'}</span>
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 px-3 sm:px-5 py-2 sm:py-2.5 min-h-[44px] text-[11px] sm:text-xs font-pixel text-slate-950 bg-pink-500 hover:bg-pink-400 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>{savedSuccess ? (isFr ? 'Sauvegardé !' : 'Saved!') : (isFr ? 'Enregistrer' : 'Save Sprite')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Tabs */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 sm:p-6">
          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg mb-4 sm:mb-6 border border-slate-800">
            <button
              onClick={() => {
                audio.playSelect();
                setActiveTab('avatar');
              }}
              className={`flex-1 py-2.5 min-h-[44px] text-xs font-retro rounded-md transition-all flex items-center justify-center active:scale-98 ${
                activeTab === 'avatar'
                  ? 'bg-pink-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFr ? 'Apparence Sprite' : 'Pixel Appearance'}
            </button>
            <button
              onClick={() => {
                audio.playSelect();
                setActiveTab('profile');
              }}
              className={`flex-1 py-2.5 min-h-[44px] text-xs font-retro rounded-md transition-all flex items-center justify-center active:scale-98 ${
                activeTab === 'profile'
                  ? 'bg-pink-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isFr ? 'Bio & Préférences' : 'Dating Bio & Prefs'}
            </button>
          </div>

          {activeTab === 'avatar' ? (
            <div className="space-y-5 sm:space-y-6">
              {/* Skin Tone */}
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-2">
                  {isFr ? 'Teinte de Peau' : 'Skin Palette'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SKIN_TONES.map(item => (
                    <button
                      key={item.id}
                      onClick={() => updateAvatar({ skinTone: item.id })}
                      className={`flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-lg border text-xs font-retro transition-all active:scale-95 ${
                        currentProfile.avatar.skinTone === item.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold ring-1 ring-cyan-400/50'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/50 shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hairstyle */}
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-2">
                  {isFr ? 'Coupe de Cheveux' : 'Hair Style'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HAIR_STYLES.map(item => (
                    <button
                      key={item.id}
                      onClick={() => updateAvatar({ hairStyle: item.id })}
                      className={`px-3 py-2.5 min-h-[44px] rounded-lg border text-xs font-retro text-left transition-all active:scale-95 truncate flex items-center ${
                        currentProfile.avatar.hairStyle === item.id
                          ? 'border-pink-500 bg-pink-950/40 text-pink-200 font-bold ring-1 ring-pink-500/50'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-2">
                  {isFr ? 'Couleur de Cheveux' : 'Hair Dye'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HAIR_COLORS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => updateAvatar({ hairColor: item.id })}
                      className={`flex items-center gap-2.5 px-3 py-2 min-h-[44px] rounded-lg border text-xs font-retro transition-all active:scale-95 ${
                        currentProfile.avatar.hairColor === item.id
                          ? 'border-pink-400 bg-pink-950/40 text-pink-200 font-bold ring-1 ring-pink-400/50'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40 shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eyes & Eyewear */}
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-2">
                  {isFr ? 'Regard & Lunettes' : 'Eyes / Eyewear'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EYE_STYLES.map(item => (
                    <button
                      key={item.id}
                      onClick={() => updateAvatar({ eyeStyle: item.id })}
                      className={`px-3 py-2.5 min-h-[44px] rounded-lg border text-xs font-retro text-left transition-all active:scale-95 flex items-center ${
                        currentProfile.avatar.eyeStyle === item.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold ring-1 ring-cyan-400/50'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit Style & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-2">
                    {isFr ? 'Style de Tenue' : 'Outfit Style'}
                  </label>
                  <div className="space-y-2">
                    {OUTFIT_STYLES.map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateAvatar({ outfitStyle: item.id })}
                        className={`w-full px-3 py-2.5 min-h-[44px] rounded-lg border text-xs font-retro text-left transition-all active:scale-98 truncate flex items-center ${
                          currentProfile.avatar.outfitStyle === item.id
                            ? 'border-pink-500 bg-pink-950/40 text-pink-200 font-bold ring-1 ring-pink-500/50'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-2">
                    {isFr ? 'Couleur de la Tenue' : 'Outfit Color'}
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {OUTFIT_COLORS.map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateAvatar({ outfitColor: item.id })}
                        className={`flex items-center gap-2 px-2.5 py-2 min-h-[44px] rounded-lg border text-xs font-retro transition-all active:scale-95 ${
                          currentProfile.avatar.outfitColor === item.id
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 font-bold ring-1 ring-cyan-400/50'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/40"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-pixel text-slate-300 mb-2">
                    {isFr ? 'Accessoire' : 'Accessory'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ACCESSORIES.map(item => (
                      <button
                        key={item.id}
                        onClick={() => updateAvatar({ accessory: item.id })}
                        className={`px-2.5 py-2 min-h-[44px] rounded-lg border text-xs font-retro text-left transition-all active:scale-95 truncate flex items-center ${
                          currentProfile.avatar.accessory === item.id
                            ? 'border-pink-400 bg-pink-950/40 text-pink-200 font-bold ring-1 ring-pink-400/50'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Bio & Preferences Tab */
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1.5 sm:mb-2">
                  {isFr ? 'Pseudo du Joueur' : 'Player Name'}
                </label>
                <input
                  type="text"
                  value={currentProfile.name}
                  onChange={e => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                  placeholder={isFr ? 'ex. Alex Heart' : 'e.g. Alex Heart'}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-retro focus:border-pink-500 focus:outline-none"
                  maxLength={20}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-1.5 sm:mb-2">
                    {isFr ? 'Pronoms' : 'Pronouns'}
                  </label>
                  <input
                    type="text"
                    value={currentProfile.pronouns}
                    onChange={e => setCurrentProfile({ ...currentProfile, pronouns: e.target.value })}
                    placeholder={isFr ? 'iel, elle, il, autre' : 'they/them, she/her, he/him'}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-retro focus:border-pink-500 focus:outline-none"
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-1.5 sm:mb-2">
                    {isFr ? 'Recherche à rencontrer' : 'Looking to Date'}
                  </label>
                  <select
                    value={currentProfile.interestedIn}
                    onChange={e => setCurrentProfile({ ...currentProfile, interestedIn: e.target.value as PlayerProfile['interestedIn'] })}
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-retro focus:border-pink-500 focus:outline-none"
                  >
                    <option value="all">{isFr ? 'Tout le monde (Tous prétendants)' : 'Everyone (All Suitors)'}</option>
                    <option value="women">{isFr ? 'Femmes' : 'Women Suitors'}</option>
                    <option value="men">{isFr ? 'Hommes' : 'Men Suitors'}</option>
                    <option value="nonbinary">{isFr ? 'Non-Binaire' : 'Non-Binary Suitors'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1.5 sm:mb-2">
                  {isFr ? 'Tempérament & Vibe' : 'Archetype / Vibe'}
                </label>
                <input
                  type="text"
                  value={currentProfile.vibeTag}
                  onChange={e => setCurrentProfile({ ...currentProfile, vibeTag: e.target.value })}
                  placeholder={isFr ? 'ex. Passionné(e) de Synthwave, Gamer Cozy, Recordman Arcade' : 'e.g. Synthwave Enthusiast, Cozy Gamer, High Score Chaser'}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-retro focus:border-pink-500 focus:outline-none"
                  maxLength={35}
                />
              </div>

              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1.5 sm:mb-2">
                  {isFr ? 'Bio de Speed Dating' : 'Speed Dating Bio'}
                </label>
                <textarea
                  value={currentProfile.bio}
                  onChange={e => setCurrentProfile({ ...currentProfile, bio: e.target.value })}
                  placeholder={isFr ? 'Rédigez une courte présentation rétro sur ce qui fait de vous le Joueur 2 idéal...' : 'Write a brief retro pitch about what makes you a 10/10 player two...'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-retro focus:border-pink-500 focus:outline-none h-20 resize-none"
                  maxLength={140}
                />
              </div>

              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1.5 sm:mb-2">
                  {isFr ? 'Jeu Rétro 8-Bit Nostalgique' : 'Favorite 8-Bit Nostalgia'}
                </label>
                <input
                  type="text"
                  value={currentProfile.favorite8BitGame}
                  onChange={e => setCurrentProfile({ ...currentProfile, favorite8BitGame: e.target.value })}
                  placeholder={isFr ? 'ex. Chrono Trigger, Pac-Man, EarthBound, Zelda' : 'e.g. Chrono Trigger, Pac-Man, EarthBound, Mega Man'}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 font-retro focus:border-pink-500 focus:outline-none"
                  maxLength={30}
                />
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-6 sm:mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400 font-retro">
              {isFr 
                ? '★ Étape 02/06 complétée · Profil prêt pour les rencontres' 
                : '★ Stage 02/06 complete · Profile ready for speed dating'}
            </span>
            <button
              onClick={() => {
                handleSave();
                onStartDating();
              }}
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-xs font-pixel text-slate-950 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{isFr ? 'Étape Suivante : Entrer dans le Salon →' : 'Next Step: Enter Lounge →'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
