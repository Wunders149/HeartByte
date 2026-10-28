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

interface AdminDashboardProps {
  events: CommunityEvent[];
  registrations: EventRegistration[];
  suitors: Suitor[];
  dateResults: DateResult[];
  language?: Language;
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
  onUpdateEvent,
  onDeleteEvent,
  onOpenCreateEvent,
  onToggleCheckIn,
  onDeleteRegistration,
  onAddOfflineDonation,
  onBackToLobby,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'speeddating' | 'analytics'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const t = TRANSLATIONS[language];
  
  // Event Editing Modal / Drawer State
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  
  // Offline Donation State
  const [donationEventId, setDonationEventId] = useState<string>('');
  const [donationAmount, setDonationAmount] = useState<number>(100);
  const [sponsorName, setSponsorName] = useState<string>('');

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

  const handleAddDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationEventId || donationAmount <= 0) return;
    audio.playMatchFanfare();
    onAddOfflineDonation(donationEventId, donationAmount, sponsorName || 'Community Sponsor');
    setDonationEventId('');
    setDonationAmount(100);
    setSponsorName('');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Admin Top Header & Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => {
              audio.playSelect();
              onBackToLobby();
            }}
            className="text-xs font-retro text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Lobby</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-yellow-400/20 border border-yellow-400/50 rounded-lg text-yellow-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl md:text-3xl font-pixel text-slate-100">
              Organizer Admin Console
            </h1>
          </div>
          <p className="text-xs font-retro text-slate-400 mt-1">
            Manage fundraising campaigns, check-in attendees, assign speed dating tables, and view real-time donor receipts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-retro text-xs rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              audio.playSelect();
              onOpenCreateEvent();
            }}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-slate-950 font-pixel text-xs rounded-lg shadow-md transition-all active:translate-y-0.5 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="text-[11px] font-retro text-slate-400 flex items-center justify-between mb-1">
            <span>TOTAL FUNDS RAISED</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-pixel text-lg sm:text-xl text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1">
            Across {events.length} community events
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="text-[11px] font-retro text-slate-400 flex items-center justify-between mb-1">
            <span>REGISTERED ATTENDEES</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <div className="font-pixel text-lg sm:text-xl text-pink-400">
            {totalRegistered}
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1">
            {totalCheckedIn} checked in at venue
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="text-[11px] font-retro text-slate-400 flex items-center justify-between mb-1">
            <span>VENUE CHECK-IN RATE</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-pixel text-lg sm:text-xl text-cyan-400">
            {totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0}%
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1">
            {totalCheckedIn} of {totalRegistered} verified
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 sm:p-4">
          <div className="text-[11px] font-retro text-slate-400 flex items-center justify-between mb-1">
            <span>SPEED DATING MATCHES</span>
            <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="font-pixel text-lg sm:text-xl text-yellow-400">
            {mutualMatchesCount}
          </div>
          <div className="text-[10px] font-retro text-slate-500 mt-1">
            Mutual sparks recorded
          </div>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 overflow-x-auto">
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('events');
          }}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'events' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Fundraising Events ({events.length})
        </button>
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('attendees');
          }}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'attendees' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Attendee Check-In Desk ({registrations.length})
        </button>
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('speeddating');
          }}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'speeddating' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Speed Dating Floor & Bell Control
        </button>
        <button
          onClick={() => {
            audio.playSelect();
            setActiveTab('analytics');
          }}
          className={`min-h-[42px] px-3.5 sm:px-4 py-2 text-xs font-retro rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-pink-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Financial & Donor Analytics
        </button>
      </div>

      {/* TAB 1: Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-6">
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
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-retro text-xs rounded border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        audio.playSelect();
                        setDonationEventId(event.id);
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-retro text-xs rounded border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+$ Sponsor</span>
                    </button>

                    <button
                      onClick={() => {
                        audio.playPass();
                        if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
                          onDeleteEvent(event.id);
                        }
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-rose-950/60 text-rose-400 font-retro text-xs rounded border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Offline Donation Form */}
          {donationEventId && (
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 max-w-xl mx-auto shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-sm text-emerald-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Record Offline Donation / Sponsor Match</span>
                </h3>
                <button
                  onClick={() => setDonationEventId('')}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddDonationSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-retro text-slate-300 mb-1">
                    Sponsor / Donor Name
                  </label>
                  <input
                    type="text"
                    required
                    value={sponsorName}
                    onChange={e => setSponsorName(e.target.value)}
                    placeholder="e.g. Local Coffee Roasters Match"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-retro text-slate-300 mb-1">
                    Donation Amount ($ USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="5"
                    required
                    value={donationAmount}
                    onChange={e => setDonationAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-pixel text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDonationEventId('')}
                    className="px-3 py-1.5 text-xs font-retro text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-pixel text-xs rounded-lg shadow"
                  >
                    Credit Donation →
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Attendee Check-In Desk */}
      {activeTab === 'attendees' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 sm:p-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, ticket code..."
                className="w-full min-h-[42px] bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
              <select
                value={selectedEventFilter}
                onChange={e => setSelectedEventFilter(e.target.value)}
                className="min-h-[42px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-200 focus:outline-none focus:border-pink-500 flex-1 sm:flex-initial"
              >
                <option value="all">All Events ({registrations.length})</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>

              <div className="text-xs font-retro text-slate-400 whitespace-nowrap">
                Showing {filteredRegistrations.length} daters
              </div>
            </div>
          </div>

          {/* Attendee Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-retro">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-pixel">
                <tr>
                  <th className="py-3 px-4">Attendee / Sprite</th>
                  <th className="py-3 px-4">Ticket Code</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Paid & Donated</th>
                  <th className="py-3 px-4">Status & Check-In</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 font-retro">
                      No attendee registrations match your search filters.
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
                          <span className="font-pixel text-emerald-400 text-xs font-bold">
                            ${reg.totalAmount}
                          </span>
                          <span className="text-slate-500 text-[10px] block">
                            (${reg.ticketPrice} + ${reg.additionalDonation} don)
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              audio.playSelect();
                              onToggleCheckIn(reg.id);
                            }}
                            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg border text-xs font-retro flex items-center gap-1.5 transition-all active:scale-95 ${
                              isCheckedIn
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                                : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-500'
                            }`}
                          >
                            {isCheckedIn ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Checked In ✓</span>
                              </>
                            ) : (
                              <span>Mark Check-In</span>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              audio.playPass();
                              if (confirm(`Remove registration for ${reg.attendeeName}?`)) {
                                onDeleteRegistration(reg.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                            title="Cancel / Delete Registration"
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
              {suitors.map((suitor, idx) => (
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
              ))}
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

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-400 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-pixel text-base text-cyan-300">Edit Campaign Details</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-1">Beneficiary Name</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.beneficiaryName}
                    onChange={e => setEditingEvent({ ...editingEvent, beneficiaryName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-1">Fundraising Goal ($)</label>
                  <input
                    type="number"
                    required
                    value={editingEvent.fundraisingGoal}
                    onChange={e => setEditingEvent({ ...editingEvent, fundraisingGoal: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-pixel text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-1">Event Status</label>
                  <select
                    value={editingEvent.status || 'open'}
                    onChange={e => setEditingEvent({ ...editingEvent, status: e.target.value as EventStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100"
                  >
                    <option value="open">Registration Open</option>
                    <option value="active">Active Speed Dating Live</option>
                    <option value="completed">Completed / Goal Met</option>
                    <option value="draft">Draft Mode</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-pixel text-slate-300 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={editingEvent.maxCapacity}
                    onChange={e => setEditingEvent({ ...editingEvent, maxCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-pixel text-slate-300 mb-1">Venue Name</label>
                <input
                  type="text"
                  value={editingEvent.venueName}
                  onChange={e => setEditingEvent({ ...editingEvent, venueName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 border border-slate-700 text-xs font-retro text-slate-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-pixel text-xs rounded-lg shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
