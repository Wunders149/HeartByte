import React, { useState } from 'react';
import { Suitor, PlayerProfile } from '../types/dating';
import { PixelAvatar } from './PixelAvatar';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { Send, MapPin, Calendar, Heart, CheckCircle2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'player' | 'suitor';
  text: string;
  timestamp: string;
  isDateInvite?: boolean;
}

interface MatchMessengerProps {
  matchedSuitors: Suitor[];
  playerProfile: PlayerProfile;
  initialSuitorId?: string;
  language?: Language;
  onBackToLobby: () => void;
}

export const MatchMessenger: React.FC<MatchMessengerProps> = ({
  matchedSuitors,
  playerProfile,
  initialSuitorId,
  language = 'fr',
  onBackToLobby,
}) => {
  const [selectedSuitorId, setSelectedSuitorId] = useState<string>(
    initialSuitorId || matchedSuitors[0]?.id || ''
  );
  const [mobilePane, setMobilePane] = useState<'list' | 'chat'>('chat');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [dateAcceptedMap, setDateAcceptedMap] = useState<Record<string, boolean>>({});
  const t = TRANSLATIONS[language];

  // Suitor conversations store
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(() => {
    const init: Record<string, ChatMessage[]> = {};
    matchedSuitors.forEach(s => {
      init[s.id] = [
        {
          id: '1',
          sender: 'suitor',
          text: language === 'fr'
            ? `Coucou ${playerProfile.name || ''} ! J'ai tellement apprécié notre speed dating tout à l'heure. Ton énergie était 10/10 !`
            : `Hey ${playerProfile.name || 'there'}! I had so much fun at our speed dating table earlier. Your vibe was totally 10/10!`,
          timestamp: language === 'fr' ? 'À l’instant' : 'Just now'
        },
        {
          id: '2',
          sender: 'suitor',
          text: language === 'fr'
            ? `Je me demandais... est-ce que tu aimerais faire un 2e rendez-vous avec moi à ${s.inviteDateLocation} ? On pourrait faire : ${s.secondDateActivity} !`
            : `I was wondering... would you want to go on Date #2 with me at ${s.inviteDateLocation}? We could do ${s.secondDateActivity}!`,
          timestamp: language === 'fr' ? 'À l’instant' : 'Just now',
          isDateInvite: true
        }
      ];
    });
    return init;
  });

  const activeSuitor = matchedSuitors.find(s => s.id === selectedSuitorId) || matchedSuitors[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeSuitor) return;

    audio.playSelect();
    const userText = inputMessage.trim();
    setInputMessage('');

    const newPlayerMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'player',
      text: userText,
      timestamp: 'Just now'
    };

    setConversations(prev => ({
      ...prev,
      [activeSuitor.id]: [...(prev[activeSuitor.id] || []), newPlayerMsg]
    }));

    // Suitor smart playful auto-reply
    setTimeout(() => {
      audio.playHeartGain();
      const replies = [
        `Haha I totally agree with that! You always say the right thing.`,
        `That sounds amazing! I'm already counting down the pixels until we hang out again.`,
        `You're officially my favorite person from this speed dating event ♥`,
        `Deal! I'm bringing your favorite snack: ${playerProfile.favorite8BitGame ? 'and we will play ' + playerProfile.favorite8BitGame : 'retro treats'}!`
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const suitorReplyMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'suitor',
        text: randomReply,
        timestamp: 'Just now'
      };

      setConversations(prev => ({
        ...prev,
        [activeSuitor.id]: [...(prev[activeSuitor.id] || []), suitorReplyMsg]
      }));
    }, 1200);
  };

  const handleAcceptDate = (suitorId: string) => {
    audio.playMatchFanfare();
    setDateAcceptedMap(prev => ({ ...prev, [suitorId]: true }));

    // Send confirmation message in chat
    const confirmMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'player',
      text: `YES! Date #2 is officially locked in! Looking forward to it! ♥`,
      timestamp: 'Just now'
    };

    setConversations(prev => ({
      ...prev,
      [suitorId]: [...(prev[suitorId] || []), confirmMsg]
    }));
  };

  if (matchedSuitors.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 sm:py-16 px-4 text-center">
        <div className="p-6 sm:p-8 bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-xl">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-pixel text-pink-400 mb-2">{language === 'fr' ? 'Aucun Match pour l’Instant' : 'No Matches Yet'}</h2>
          <p className="text-xs md:text-sm text-slate-300 font-retro mb-6">
            {language === 'fr'
              ? 'Vous n’avez pas encore de correspondances mutuelles. Participez aux tables de speed dating pour rencontrer les participants !'
              : 'You haven’t completed any speed dating rounds or mutual matches yet. Go to the Speed Dating table to meet suitors!'}
          </p>
          <button
            onClick={onBackToLobby}
            className="min-h-[44px] px-6 py-2.5 bg-pink-500 hover:bg-pink-400 font-pixel text-xs text-slate-950 rounded-lg shadow-md transition-all active:translate-y-0.5"
          >
            {t.startSpeedDating} →
          </button>
        </div>
      </div>
    );
  }

  const currentChat = activeSuitor ? conversations[activeSuitor.id] || [] : [];
  const isDateAccepted = activeSuitor ? dateAcceptedMap[activeSuitor.id] : false;

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <div className="text-xs font-retro text-cyan-400">{t.pdaMessengerTitle}</div>
          <h1 className="text-xl sm:text-2xl font-pixel text-pink-400">{t.matchChatHubTitle}</h1>
        </div>
        <button
          onClick={onBackToLobby}
          className="min-h-[40px] px-3.5 py-1.5 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-retro text-slate-300 rounded-lg transition-colors self-start sm:self-auto"
        >
          {language === 'fr' ? '← Retour au Salon' : '← Back to Lobby'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6 bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-[540px]">
        {/* Left Column: Matches Contact List (Mobile collapsible) */}
        <div className={`md:col-span-4 border-r border-slate-800 bg-slate-900/60 p-3 sm:p-4 ${
          mobilePane === 'chat' ? 'hidden md:block' : 'block'
        }`}>
          <div className="text-[11px] font-pixel text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
            <span>{t.yourMatchesCount} ({matchedSuitors.length})</span>
          </div>

          <div className="space-y-2">
            {matchedSuitors.map(suitor => {
              const isSelected = activeSuitor?.id === suitor.id;
              const hasAcceptedDate = dateAcceptedMap[suitor.id];

              return (
                <button
                  key={suitor.id}
                  onClick={() => {
                    audio.playSelect();
                    setSelectedSuitorId(suitor.id);
                    setMobilePane('chat');
                  }}
                  className={`w-full text-left min-h-[56px] p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-950/30 shadow-md'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <PixelAvatar avatar={suitor.avatar} size="xs" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-xs text-slate-100 truncate">
                        {suitor.name}
                      </span>
                      {hasAcceptedDate && (
                        <span className="text-[10px] font-retro text-emerald-400">Date 2 ✓</span>
                      )}
                    </div>
                    <div className="text-[11px] font-retro text-slate-400 truncate mt-0.5">
                      {suitor.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Window & 2nd Date Invitation */}
        <div className={`md:col-span-8 flex flex-col justify-between p-3.5 sm:p-4 md:p-6 bg-slate-950 ${
          mobilePane === 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          {activeSuitor ? (
            <>
              {/* Active Suitor Chat Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 mb-3 sm:mb-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Mobile Back-to-Contacts Button */}
                  <button
                    onClick={() => setMobilePane('list')}
                    className="md:hidden min-h-[40px] px-2.5 py-1 text-xs font-retro text-cyan-400 hover:text-cyan-300 rounded border border-slate-800 bg-slate-900 flex items-center gap-1"
                  >
                    ← {t.navMatches}
                  </button>
                  <PixelAvatar avatar={activeSuitor.avatar} size="xs" />
                  <div>
                    <h2 className="font-pixel text-xs sm:text-sm text-slate-100">{activeSuitor.name}</h2>
                    <div className="text-[11px] sm:text-xs font-retro text-cyan-400">{activeSuitor.title}</div>
                  </div>
                </div>

                <div className="text-[11px] sm:text-xs font-retro text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span className="truncate max-w-[120px] sm:max-w-xs">{activeSuitor.inviteDateLocation}</span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 max-h-[380px]">
                {currentChat.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'player' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl p-3.5 text-xs md:text-sm font-retro leading-relaxed ${
                        msg.sender === 'player'
                          ? 'bg-pink-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none shadow'
                      }`}
                    >
                      {msg.text}

                      {/* Date 2 Invitation Card */}
                      {msg.isDateInvite && (
                        <div className="mt-3 p-3 bg-slate-950/80 border border-pink-500/40 rounded-lg">
                          <div className="flex items-center gap-1.5 text-xs font-pixel text-pink-400 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                            <span>{t.date2InvitationTitle}</span>
                          </div>
                          <div className="text-xs font-retro text-slate-300">
                            <strong>{t.locationLabel}</strong> {activeSuitor.inviteDateLocation}
                          </div>
                          <div className="text-xs font-retro text-slate-300 mt-0.5">
                            <strong>{t.activityLabel}</strong> {activeSuitor.secondDateActivity}
                          </div>

                          <div className="mt-3">
                            {isDateAccepted ? (
                              <div className="flex items-center gap-1.5 text-xs font-pixel text-emerald-400">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>{t.dateScheduledBadge}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAcceptDate(activeSuitor.id)}
                                className="w-full py-2 bg-pink-500 hover:bg-pink-400 text-slate-950 font-pixel text-xs rounded transition-all shadow active:translate-y-0.5 flex items-center justify-center gap-1.5"
                              >
                                <Heart className="w-3.5 h-3.5 fill-slate-950" />
                                <span>{t.acceptDate2Btn}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-retro mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder={language === 'fr' ? `Envoyer un message rétro à ${activeSuitor.name}...` : `Send a retro message to ${activeSuitor.name}...`}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-xs md:text-sm font-retro text-slate-100 focus:outline-none focus:border-pink-500 placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2.5 bg-pink-500 hover:bg-pink-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-pixel text-xs rounded-lg flex items-center gap-1.5 transition-all shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.sendBtn}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 font-retro">
              {language === 'fr' ? 'Sélectionnez un match pour discuter' : 'Select a match to start chatting'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
