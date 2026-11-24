import React, { useState } from 'react';
import { CommunityEvent, EventRegistration, EventStatus, CauseCategory, Suitor, DateResult } from '../types/dating';
import { PixelAvatar } from './PixelAvatar';
import { audio } from '../utils/audio';
import { Language, TRANSLATIONS } from '../utils/i18n';
import { 
  ShieldCheck, 
  Building2, 
  Users, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  Bell, 
  Heart, 
  ArrowLeft,
  Filter,
  Check,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

import { CustomModal } from './CustomModal';
import { CustomConfirmModal } from './CustomConfirmModal';
import { OfflineDonationModal } from './OfflineDonationModal';

interface AdminDashboardProps {
  events: CommunityEvent[];
  registrations: EventRegistration[];
  suitors: Suitor[];
  dateResults: DateResult[];
  language?: Language;
  activeTab?: 'events' | 'attendees' | 'speeddating' | 'analytics';
  onTabChange?: (tab: 'events' | 'attendees' | 'speeddating' | 'analytics') => void;
  onUpdateEvent: (updatedEvent: CommunityEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenCreateEvent: () => void;
  onToggleCheckIn: (registrationId: string) => void;
  onDeleteRegistration: (registrationId: string) => void;
  onAddOfflineDonation: (eventId: string, amount: number, donorName: string) => void;
  onBackToLobby: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  registrations,
  suitors,
  dateResults,
  language = 'fr',
  activeTab: controlledTab,
  onTabChange,
  onUpdateEvent,
  onDeleteEvent,
  onOpenCreateEvent,
  onToggleCheckIn,
  onDeleteRegistration,
  onAddOfflineDonation,
  onBackToLobby,
}) => {
  const [internalTab, setInternalTab] = useState<'events' | 'attendees' | 'speeddating' | 'analytics'>('events');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: 'events' | 'attendees' | 'speeddating' | 'analytics') => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const t = TRANSLATIONS[language];
  
  // Custom Modal Pop Up States
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CommunityEvent | null>(null);
  const [regToDelete, setRegToDelete] = useState<EventRegistration | null>(null);
  const [eventForDonation, setEventForDonation] = useState<CommunityEvent | null>(null);

  // Overall metrics
  const totalRevenue = events.reduce((sum, e) => sum + e.currentFundsRaised, 0);
  const totalGoal = events.reduce((sum, e) => sum + e.fundraisingGoal, 0);
  const totalRegistered = registrations.length;
  const totalCheckedIn = registrations.filter(r => r.checkedIn).length;
  const mutualMatchesCount = dateResults.filter(r => r.isMutualMatch).length;

  // Filtered registrations
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.attendeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ticketCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEventFilter === 'all' || r.eventId === selectedEventFilter;
    return matchesSearch && matchesEvent;
  });

  // Export registrations as CSV
  const handleExportCSV = () => {
    audio.playSelect();
    const headers = ['Registration ID', 'Event ID', 'Attendee Name', 'Email', 'Pronouns', 'Ticket Code', 'Ticket Price', 'Additional Donation', 'Total Amount', 'Checked In', 'Registered At'];
    const rows = registrations.map(r => [
      r.id,
      r.eventId,
      `"${r.attendeeName.replace(/"/g, '""')}"`,
      r.attendeeEmail,
      r.pronouns,
      r.ticketCode,
      r.ticketPrice,
      r.additionalDonation,
      r.totalAmount,
      r.checkedIn ? 'YES' : 'NO',
      `"${r.registeredAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heartbyte_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEditEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    audio.playHeartGain();
    onUpdateEvent(editingEvent);
    setEditingEvent(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
      {/* Admin Top Header & Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <button
            onClick={() => {
              audio.playSelect();
              onBackToLobby();
            }}
            className="min-h-[40px] text-xs font-retro text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Retour à l’Espace Public' : 'Return to User Lobby'}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-yellow-400/20 border border-yellow-400/50 rounded-lg text-yellow-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-pixel text-slate-100">
              {language === 'fr' ? 'Console Organisateur' : 'Organizer Admin Console'}
            </h1>
          </div>
          <p className="text-xs font-retro text-slate-400 mt-1">
            {language === 'fr'
              ? 'Gérez les soirées caritatives, validez les billets sur place et suivez les dons en temps réel.'
              : 'Manage fundraising campaigns, check-in attendees, assign speed dating tables, and view real-time donor receipts.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="min-h-[44px] px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-retro text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <Download className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{language === 'fr' ? 'Exporter CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => {
              audio.playSelect();
              onOpenCreateEvent();
            }}
            className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-slate-950 font-pixel text-xs rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>{language === 'fr' ? 'Nouvelle Soirée' : 'Create Campaign'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-[11px] font-retro text-slate-400 flex items-center justify-between gap-1 mb-1">
            <span className="truncate">{language === 'fr' ? 'FONDS RÉCOLTÉS' : 'TOTAL FUNDS RAISED'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="font-pixel text-base sm:text-xl text-emerald-400 tabular-nums">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1 truncate">
            {language === 'fr' ? `Sur ${events.length} soirées` : `Across ${events.length} events`}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-[11px] font-retro text-slate-400 flex items-center justify-between gap-1 mb-1">
            <span className="truncate">{language === 'fr' ? 'INSCRITS' : 'REGISTERED'}</span>
            <Users className="w-4 h-4 text-pink-400 shrink-0" />
          </div>
          <div className="font-pixel text-base sm:text-xl text-pink-400 tabular-nums">
            {totalRegistered}
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1 truncate tabular-nums">
            {totalCheckedIn} {language === 'fr' ? 'enregistrés sur place' : 'checked in'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-[11px] font-retro text-slate-400 flex items-center justify-between gap-1 mb-1">
            <span className="truncate">{language === 'fr' ? 'TAUX D’ACCUEIL' : 'CHECK-IN RATE'}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          </div>
          <div className="font-pixel text-base sm:text-xl text-cyan-400 tabular-nums">
            {totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0}%
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1 truncate tabular-nums">
            {totalCheckedIn} / {totalRegistered} {language === 'fr' ? 'vérifiés' : 'verified'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-[10px] sm:text-[11px] font-retro text-slate-400 flex items-center justify-between gap-1 mb-1">
            <span className="truncate">{language === 'fr' ? 'MATCHS' : 'MATCHES'}</span>
            <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
          </div>
          <div className="font-pixel text-base sm:text-xl text-yellow-400 tabular-nums">
            {mutualMatchesCount}
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1 truncate">
            {language === 'fr' ? 'Étincelles mutuelles' : 'Mutual sparks'}
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-5 sm:mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('events');
          }}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'events' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabEvents} ({events.length})
        </button>
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('attendees');
          }}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'attendees' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabCheckIn} ({registrations.length})
        </button>
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('speeddating');
          }}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'speeddating' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabFloorBell}
        </button>
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('analytics');
          }}
          className={`min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'analytics' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabAnalytics}
        </button>
      </div>

      {/* TAB 1: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div>
              <h3 className="font-pixel text-sm text-yellow-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'fr' ? 'Gestion des Soirées Caritatives' : 'Fundraising Events Management'}</span>
              </h3>
              <p className="text-xs font-retro text-slate-400 mt-0.5">
                {language === 'fr' 
                  ? 'Espace réservé aux organisateurs : publiez, modifiez et suivez les objectifs de dons.'
                  : 'Organizer-only control room: publish, edit, and track fundraiser goals.'}
              </p>
            </div>

            <button
              onClick={() => {
                audio.playSelect();
                onOpenCreateEvent();
              }}
              className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-pixel text-xs rounded-lg shadow transition-all active:scale-95 inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'fr' ? '+ Créer une Soirée Bénéfice' : '+ Create Benefit Event'}</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center">
              <div className="w-14 h-14 mx-auto mb-3 bg-yellow-950/60 rounded-full flex items-center justify-center border border-yellow-500/40">
                <Building2 className="w-7 h-7 text-yellow-400" />
              </div>
              <h3 className="font-pixel text-base text-yellow-400 mb-2">
                {language === 'fr' ? 'Aucune Soirée Caritative Active' : 'No Active Fundraiser Events'}
              </h3>
              <p className="text-xs font-retro text-slate-400 max-w-md mx-auto mb-6">
                {language === 'fr'
                  ? 'En tant qu’organisateur, vous avez les droits exclusifs pour lancer et gérer des soirées de speed dating solidaire.'
                  : 'As an organizer, you have exclusive authority to launch and manage community speed dating fundraisers.'}
              </p>
              <button
                onClick={() => {
                  audio.playSelect();
                  onOpenCreateEvent();
                }}
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'fr' ? '+ Créer la Première Soirée' : '+ Create First Benefit Event'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => {
              const eventRegs = registrations.filter(r => r.eventId === event.id);
              const percent = Math.min(100, Math.round((event.currentFundsRaised / event.fundraisingGoal) * 100));

              return (
                <div
                  key={event.id}
                  className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-pixel text-cyan-400 uppercase">
                        {event.causeCategory}
                      </span>
                      <span className={`text-[10px] font-retro px-2 py-0.5 rounded border ${
                        event.status === 'completed'
                          ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                          : event.status === 'active'
                          ? 'border-yellow-400/50 bg-yellow-950/40 text-yellow-300'
                          : 'border-pink-500/50 bg-pink-950/40 text-pink-300'
                      }`}>
                        {event.status ? event.status.toUpperCase() : 'REGISTRATION OPEN'}
                      </span>
                    </div>

                    <h3 className="font-pixel text-sm text-slate-100 mb-1 leading-snug">
                      {event.title}
                    </h3>
                    <div className="text-xs font-retro text-pink-400 mb-3">
                      Beneficiary: {event.beneficiaryName}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 mb-4 text-xs font-retro">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Total Raised:</span>
                        <span className="font-pixel text-emerald-400 text-sm">
                          ${event.currentFundsRaised.toLocaleString()} / ${event.fundraisingGoal.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-emerald-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                        <span>{eventRegs.length} Registrations</span>
                        <span>Capacity: {event.maxCapacity}</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-retro text-slate-400 space-y-1 mb-4">
                      <div><strong>Venue:</strong> {event.venueName}</div>
                      <div><strong>Date:</strong> {event.date} · {event.time}</div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        audio.playSelect();
                        setEditingEvent(event);
                      }}
                      className="min-h-[44px] py-2 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-retro text-[11px] sm:text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition-all active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'fr' ? 'Éditer' : 'Edit'}</span>
                    </button>

                    <button
                      onClick={() => {
                        audio.playSelect();
                        setEventForDonation(event);
                      }}
                      className="min-h-[44px] py-2 px-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-retro text-[11px] sm:text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition-all active:scale-95"
                      title={language === 'fr' ? 'Ajouter un don hors-ligne / mécénat' : 'Add offline donation / sponsor match'}
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">+$ Sponsor</span>
                    </button>

                    <button
                      onClick={() => {
                        audio.playPass();
                        setEventToDelete(event);
                      }}
                      className="min-h-[44px] py-2 px-2 bg-slate-800 hover:bg-rose-950/60 text-rose-400 font-retro text-[11px] sm:text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1 transition-all active:scale-95"
                      title={language === 'fr' ? 'Supprimer cet événement' : 'Delete event'}
                    >
                      <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{language === 'fr' ? 'Supprimer' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* TAB 2: Attendee Check-In Desk */}
      {activeTab === 'attendees' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-3.5 sm:p-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher nom, email, code billet...' : 'Search by name, email, ticket code...'}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-base sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
              <select
                value={selectedEventFilter}
                onChange={e => setSelectedEventFilter(e.target.value)}
                className="min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base sm:text-xs font-retro text-slate-200 focus:outline-none focus:border-pink-500 flex-1 sm:flex-initial"
              >
                <option value="all">{language === 'fr' ? `Tous les événements (${registrations.length})` : `All Events (${registrations.length})`}</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>

              <div className="text-xs font-retro text-slate-400 whitespace-nowrap tabular-nums">
                {language === 'fr' ? `${filteredRegistrations.length} inscrits` : `Showing ${filteredRegistrations.length} daters`}
              </div>
            </div>
          </div>

          {/* Mobile Attendee Card List (< md) */}
          <div className="md:hidden space-y-3">
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-8 px-4 text-slate-500 font-retro text-xs bg-slate-950/60 rounded-xl border border-dashed border-slate-800">
                {language === 'fr'
                  ? 'Aucune inscription ne correspond à vos filtres.'
                  : 'No attendee registrations match your search filters.'}
              </div>
            ) : (
              filteredRegistrations.map(reg => {
                const event = events.find(e => e.id === reg.eventId);
                const isCheckedIn = Boolean(reg.checkedIn);

                return (
                  <div
                    key={reg.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1 bg-slate-900 border border-slate-800 rounded shrink-0">
                          <PixelAvatar avatar={reg.avatar} size="xs" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-pixel text-xs text-slate-100 truncate">{reg.attendeeName}</div>
                          <div className="text-[11px] font-retro text-slate-400 truncate">
                            {reg.attendeeEmail} · {reg.pronouns}
                          </div>
                        </div>
                      </div>
                      <span className="font-pixel text-xs text-emerald-400 font-bold shrink-0 tabular-nums">
                        ${reg.totalAmount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[11px] font-retro border-t border-slate-900 pt-2">
                      <span className="font-pixel text-[10px] text-yellow-400 bg-yellow-950/40 border border-yellow-500/40 px-2 py-0.5 rounded">
                        {reg.ticketCode}
                      </span>
                      <span className="text-slate-400 truncate">
                        {event?.title || (language === 'fr' ? 'Événement inconnu' : 'Unknown Event')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          audio.playSelect();
                          onToggleCheckIn(reg.id);
                        }}
                        className={`flex-1 min-h-[44px] px-3 py-2 rounded-lg border text-xs font-retro flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                          isCheckedIn
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {isCheckedIn ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>{language === 'fr' ? 'Enregistré ✓' : 'Checked In ✓'}</span>
                          </>
                        ) : (
                          <span>{language === 'fr' ? 'Valider l’entrée' : 'Mark Check-In'}</span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          audio.playPass();
                          setRegToDelete(reg);
                        }}
                        className="min-h-[44px] min-w-[44px] p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 flex items-center justify-center transition-colors active:scale-95"
                        aria-label={language === 'fr' ? 'Supprimer cette inscription' : 'Delete registration'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop Attendee Records Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs font-retro">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-pixel">
                <tr>
                  <th className="py-3 px-4">{language === 'fr' ? 'Participant / Sprite' : 'Attendee / Sprite'}</th>
                  <th className="py-3 px-4">{language === 'fr' ? 'Code Billet' : 'Ticket Code'}</th>
                  <th className="py-3 px-4">{language === 'fr' ? 'Événement' : 'Event'}</th>
                  <th className="py-3 px-4">{language === 'fr' ? 'Payé & Don' : 'Paid & Donated'}</th>
                  <th className="py-3 px-4">{language === 'fr' ? 'Statut Accueil' : 'Status & Check-In'}</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-retro">
                      {language === 'fr'
                        ? 'Aucune inscription ne correspond à vos filtres.'
                        : 'No attendee registrations match your search filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map(reg => {
                    const event = events.find(e => e.id === reg.eventId);
                    const isCheckedIn = Boolean(reg.checkedIn);

                    return (
                      <tr key={reg.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-slate-900 border border-slate-800 rounded shrink-0">
                              <PixelAvatar avatar={reg.avatar} size="xs" />
                            </div>
                            <div>
                              <div className="font-pixel text-slate-200">{reg.attendeeName}</div>
                              <div className="text-slate-400 text-[11px]">{reg.attendeeEmail} · {reg.pronouns}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-pixel text-[11px] text-yellow-400 bg-yellow-950/40 border border-yellow-500/40 px-2 py-0.5 rounded">
                            {reg.ticketCode}
                          </span>
                        </td>

                        <td className="py-3 px-4 max-w-[180px]">
                          <span className="truncate block text-slate-300" title={event?.title}>
                            {event?.title || 'Unknown Event'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-pixel text-emerald-400 text-xs font-bold tabular-nums">
                            ${reg.totalAmount}
                          </span>
                          <span className="text-slate-500 text-[10px] block tabular-nums">
                            (${reg.ticketPrice} + ${reg.additionalDonation} don)
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              audio.playSelect();
                              onToggleCheckIn(reg.id);
                            }}
                            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg border text-xs font-retro flex items-center gap-1.5 transition-all active:scale-95 ${
                              isCheckedIn
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                                : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
                            }`}
                          >
                            {isCheckedIn ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{language === 'fr' ? 'Enregistré ✓' : 'Checked In ✓'}</span>
                              </>
                            ) : (
                              <span>{language === 'fr' ? 'Valider l’entrée' : 'Mark Check-In'}</span>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              audio.playPass();
                              setRegToDelete(reg);
                            }}
                            className="min-h-[44px] min-w-[44px] p-2 rounded-lg transition-colors text-slate-500 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center ml-auto"
                            title={language === 'fr' ? 'Annuler / Supprimer cette inscription' : 'Cancel / Delete Registration'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Speed Dating Floor & Live Bell Control */}
      {activeTab === 'speeddating' && (
        <div className="space-y-6">
          {/* Table Management & Ring Round Bell */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-pixel text-base text-slate-100 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-yellow-400" />
                  <span>Venue Round Bell & Timer Broadcast</span>
                </h3>
                <p className="text-xs font-retro text-slate-400 mt-1">
                  Trigger 8-bit chimes across all tables to signal daters to rotate to their next conversation partner.
                </p>
              </div>

              <button
                onClick={() => {
                  audio.playRoundBell();
                }}
                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:translate-y-0.5 flex items-center gap-2 shrink-0"
              >
                <Bell className="w-4 h-4 fill-slate-950" />
                <span>SOUND ROUND BELL (8-BIT)</span>
              </button>
            </div>

            {/* Simulated Live Table Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suitors.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-500 font-retro text-xs bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  {language === 'fr'
                    ? 'Aucune table active pour le moment. Les tables se remplissent dès que les participants s’inscrivent !'
                    : 'No active tables yet. Tables will seat registered daters once attendees sign up!'}
                </div>
              ) : (
                suitors.map((suitor, idx) => (
                  <div key={suitor.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
                      <span className="font-pixel text-[11px] text-pink-400">TABLE 0{idx + 1}</span>
                      <span className="text-[10px] font-retro text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                        SEATED & READY
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-slate-900 border border-slate-800 rounded">
                        <PixelAvatar avatar={suitor.avatar} size="xs" />
                      </div>
                      <div>
                        <div className="font-pixel text-xs text-slate-200">{suitor.name}</div>
                        <div className="text-[11px] font-retro text-cyan-400">{suitor.archetype}</div>
                        <div className="text-[10px] font-retro text-slate-400 mt-0.5">
                          Min Match Req: {suitor.minMatchChemistry}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Financial & Donor Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cause Category Revenue Breakdown */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
              <h3 className="font-pixel text-sm text-slate-100 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Revenue by Cause Category</span>
              </h3>

              <div className="space-y-4 font-retro text-xs">
                {(['community', 'tech', 'environment', 'arts', 'education'] as CauseCategory[]).map(cat => {
                  const catEvents = events.filter(e => e.causeCategory === cat);
                  const catTotal = catEvents.reduce((sum, e) => sum + e.currentFundsRaised, 0);
                  const catPercent = totalRevenue > 0 ? Math.round((catTotal / totalRevenue) * 100) : 0;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="capitalize">{cat} ({catEvents.length} events)</span>
                        <span className="font-pixel text-emerald-400">${catTotal.toLocaleString()} ({catPercent}%)</span>
                      </div>
                      <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full"
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Community Donors Leaderboard */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6">
              <h3 className="font-pixel text-sm text-slate-100 flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>Top Community Benefactors</span>
              </h3>

              <div className="space-y-3 font-retro text-xs">
                {[...registrations]
                  .sort((a, b) => b.totalAmount - a.totalAmount)
                  .slice(0, 5)
                  .map((reg, idx) => (
                    <div
                      key={reg.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-pixel text-yellow-400 text-xs">#{idx + 1}</span>
                        <PixelAvatar avatar={reg.avatar} size="xs" />
                        <div>
                          <div className="font-pixel text-slate-200">{reg.attendeeName}</div>
                          <div className="text-[10px] text-slate-400">{reg.ticketCode}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-pixel text-emerald-400">${reg.totalAmount}</span>
                        <span className="text-[10px] text-slate-500 block">Generous Supporter</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Edit Event Modal Pop Up */}
      {editingEvent && (
        <CustomModal
          isOpen={Boolean(editingEvent)}
          onClose={() => setEditingEvent(null)}
          title={language === 'fr' ? 'Modifier l’Événement' : 'Edit Campaign Details'}
          subtitle={
            language === 'fr'
              ? 'Mettre à jour les informations de collecte, capacité et lieu.'
              : 'Update fundraising goals, capacity, and venue details.'
          }
          icon={<Edit3 className="w-5 h-5 text-cyan-400" />}
          badge="CAMPAIGN CONFIG"
          theme="cyan"
          maxWidth="lg"
        >
          <form onSubmit={handleSaveEditEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1">
                {language === 'fr' ? 'Titre de l’événement *' : 'Event Title *'}
              </label>
              <input
                type="text"
                required
                value={editingEvent.title}
                onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">
                  {language === 'fr' ? 'Organisation Bénéficiaire *' : 'Beneficiary Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.beneficiaryName}
                  onChange={e => setEditingEvent({ ...editingEvent, beneficiaryName: e.target.value })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">
                  {language === 'fr' ? 'Objectif de Collecte ($ USD) *' : 'Fundraising Goal ($ USD) *'}
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={editingEvent.fundraisingGoal}
                  onChange={e => setEditingEvent({ ...editingEvent, fundraisingGoal: Number(e.target.value) })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base sm:text-xs font-pixel text-emerald-400 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">
                  {language === 'fr' ? 'Statut de l’événement' : 'Event Status'}
                </label>
                <select
                  value={editingEvent.status || 'open'}
                  onChange={e => setEditingEvent({ ...editingEvent, status: e.target.value as EventStatus })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="open">{language === 'fr' ? 'Inscriptions Ouvertes' : 'Registration Open'}</option>
                  <option value="active">{language === 'fr' ? 'Speed Dating en Direct' : 'Active Speed Dating Live'}</option>
                  <option value="completed">{language === 'fr' ? 'Terminé / Objectif Atteint' : 'Completed / Goal Met'}</option>
                  <option value="draft">{language === 'fr' ? 'Brouillon' : 'Draft Mode'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">
                  {language === 'fr' ? 'Capacité Maximale' : 'Max Capacity'}
                </label>
                <input
                  type="number"
                  min="2"
                  value={editingEvent.maxCapacity}
                  onChange={e => setEditingEvent({ ...editingEvent, maxCapacity: Number(e.target.value) })}
                  className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1">
                {language === 'fr' ? 'Lieu / Salle' : 'Venue Name & Address'}
              </label>
              <input
                type="text"
                value={editingEvent.venueName}
                onChange={e => setEditingEvent({ ...editingEvent, venueName: e.target.value })}
                className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-base sm:text-xs font-retro text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 border border-slate-700 text-xs font-retro text-slate-300 hover:text-white rounded-xl transition-colors"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                {language === 'fr' ? 'Enregistrer les Modifications' : 'Save Changes'}
              </button>
            </div>
          </form>
        </CustomModal>
      )}

      {/* Custom Confirm Modal: Delete Event */}
      <CustomConfirmModal
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={() => {
          if (eventToDelete) {
            onDeleteEvent(eventToDelete.id);
            setEventToDelete(null);
          }
        }}
        title={language === 'fr' ? 'Supprimer cet Événement ?' : 'Delete Event Campaign?'}
        message={
          eventToDelete ? (
            <div className="space-y-2">
              <p>
                {language === 'fr'
                  ? 'Êtes-vous certain de vouloir supprimer la soirée caritative :'
                  : 'Are you sure you want to permanently delete this fundraising event:'}
              </p>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-rose-500/40 text-rose-300 font-pixel text-xs">
                "{eventToDelete.title}"
              </div>
              <p className="text-slate-400 text-xs">
                {language === 'fr'
                  ? 'Toutes les inscriptions associées, profils de speed dating et reçus fiscaux seront également supprimés. Cette action est irréversible.'
                  : 'All linked participant registrations, speed dating records, and receipts will be removed. This cannot be undone.'}
              </p>
            </div>
          ) : null
        }
        confirmLabel={language === 'fr' ? 'Oui, Supprimer Définitivement' : 'Yes, Delete Permanently'}
        cancelLabel={language === 'fr' ? 'Annuler' : 'Keep Event'}
        danger={true}
        theme="rose"
        iconType="trash"
      />

      {/* Custom Confirm Modal: Delete Registration */}
      <CustomConfirmModal
        isOpen={Boolean(regToDelete)}
        onClose={() => setRegToDelete(null)}
        onConfirm={() => {
          if (regToDelete) {
            onDeleteRegistration(regToDelete.id);
            setRegToDelete(null);
          }
        }}
        title={language === 'fr' ? 'Annuler cette Inscription ?' : 'Cancel Registration?'}
        message={
          regToDelete ? (
            <div className="space-y-2">
              <p>
                {language === 'fr'
                  ? 'Voulez-vous annuler le billet et retirer le participant :'
                  : 'Do you want to cancel the ticket and remove attendee:'}
              </p>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-rose-500/40 text-slate-200 font-retro text-xs">
                <span className="font-pixel text-pink-400 block">{regToDelete.attendeeName}</span>
                <span className="text-slate-400 block text-[11px]">
                  {regToDelete.attendeeEmail} · Billet #{regToDelete.ticketCode}
                </span>
                <span className="text-emerald-400 font-pixel text-[11px] block mt-1">
                  Total payé: ${regToDelete.totalAmount}
                </span>
              </div>
            </div>
          ) : null
        }
        confirmLabel={language === 'fr' ? 'Confirmer l’Annulation' : 'Confirm Cancellation'}
        cancelLabel={language === 'fr' ? 'Garder l’Inscription' : 'Keep Registration'}
        danger={true}
        theme="rose"
        iconType="trash"
      />

      {/* Custom Modal: Offline Donation / Sponsor Match */}
      <OfflineDonationModal
        isOpen={Boolean(eventForDonation)}
        event={eventForDonation}
        language={language}
        onClose={() => setEventForDonation(null)}
        onSubmitDonation={(eventId, amount, donorName) => {
          onAddOfflineDonation(eventId, amount, donorName);
          setEventForDonation(null);
        }}
      />
    </div>
  );
};
