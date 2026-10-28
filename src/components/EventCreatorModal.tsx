import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CommunityEvent, CauseCategory, TicketTier } from '../types/dating';
import { audio } from '../utils/audio';
import { X, Plus, Sparkles, Building2, Calendar, MapPin, Target, DollarSign } from 'lucide-react';

interface EventCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: CommunityEvent) => void;
}

export const EventCreatorModal: React.FC<EventCreatorModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [causeCategory, setCauseCategory] = useState<CauseCategory>('community');
  const [fundraisingGoal, setFundraisingGoal] = useState<number>(2500);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Saturday, December 12, 2026');
  const [time, setTime] = useState('7:00 PM - 10:00 PM');
  const [venueName, setVenueName] = useState('Community Social Hall & Retro Lounge');
  const [venueAddress, setVenueAddress] = useState('100 Community Plaza');
  const [maxCapacity, setMaxCapacity] = useState<number>(36);
  const [creatorName, setCreatorName] = useState('');
  const [customCausePrompt, setCustomCausePrompt] = useState('What community dream would you love to build together with a partner?');

  // Ticket Tiers
  const [tier1Name, setTier1Name] = useState('Supporter Ticket');
  const [tier1Price, setTier1Price] = useState<number>(15);
  const [tier1Perks, setTier1Perks] = useState('Speed dating entry + 1 complimentary drink + event badge');

  const [tier2Name, setTier2Name] = useState('Patron Pass');
  const [tier2Price, setTier2Price] = useState<number>(35);
  const [tier2Perks, setTier2Perks] = useState('Entry + 2 drinks + community tote bag + Super Like perk');

  const [tier3Name, setTier3Name] = useState('Community Champion');
  const [tier3Price, setTier3Price] = useState<number>(75);
  const [tier3Perks, setTier3Perks] = useState('VIP reserved table + sponsor shoutout + lifetime pass to next year event');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !beneficiaryName.trim()) return;

    audio.playMatchFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ec4899', '#38bdf8', '#eab308', '#10b981']
    });

    const ticketTiers: TicketTier[] = [
      {
        id: `tier-1-${Date.now()}`,
        name: tier1Name,
        price: Number(tier1Price) || 15,
        perks: tier1Perks,
      },
      {
        id: `tier-2-${Date.now()}`,
        name: tier2Name,
        price: Number(tier2Price) || 35,
        perks: tier2Perks,
        isPopular: true,
      },
      {
        id: `tier-3-${Date.now()}`,
        name: tier3Name,
        price: Number(tier3Price) || 75,
        perks: tier3Perks,
      },
    ];

    const newEvent: CommunityEvent = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `Speed dating benefit night for ${beneficiaryName}`,
      causeCategory,
      beneficiaryName: beneficiaryName.trim(),
      description: description.trim() || `Join us for an 8-bit speed dating fundraiser to support ${beneficiaryName}.`,
      fundraisingGoal: Number(fundraisingGoal) || 2000,
      currentFundsRaised: 0,
      date,
      time,
      venueName,
      venueAddress,
      maxCapacity: Number(maxCapacity) || 30,
      creatorName: creatorName.trim() || 'Community Organizer',
      customCausePrompt,
      ticketTiers,
    };

    onCreateEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-pink-500 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => {
            audio.playSelect();
            onClose();
          }}
          aria-label="Close dialog"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 sm:mb-6">
          <div className="text-[11px] font-retro text-cyan-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EVENT CREATOR WIZARD</span>
          </div>
          <h2 className="text-xl md:text-2xl font-pixel text-pink-400">
            Create Speed Dating Fundraiser
          </h2>
          <p className="text-xs text-slate-400 font-retro mt-1">
            Host a community speed dating event to raise funds for your cause, charity, or local initiative.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cause and Beneficiary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Save the Local Community Garden & Cat Sanctuary"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Beneficiary Organization / Project *
              </label>
              <input
                type="text"
                required
                value={beneficiaryName}
                onChange={e => setBeneficiaryName(e.target.value)}
                placeholder="e.g. Hope Animal Rescue & Sanctuary"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Cause Category
              </label>
              <select
                value={causeCategory}
                onChange={e => setCauseCategory(e.target.value as CauseCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              >
                <option value="community">Community & Neighborhood</option>
                <option value="arts">Arts, Music & Culture</option>
                <option value="environment">Animal Welfare & Environment</option>
                <option value="tech">Technology & Gaming Preservation</option>
                <option value="education">Youth & Education</option>
              </select>
            </div>
          </div>

          {/* Goal & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Fundraising Goal ($ USD) *
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={fundraisingGoal}
                onChange={e => setFundraisingGoal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-emerald-400 font-pixel focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Max Capacity (Attendees)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={maxCapacity}
                onChange={e => setMaxCapacity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Organizer Name
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={e => setCreatorName(e.target.value)}
                placeholder="e.g. Jordan River (Lead)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-pixel text-slate-300 mb-1.5">
              Event Description & Purpose of Funds
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain why this community fundraiser is happening and what the speed dating donations will help purchase or build..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500 h-20 resize-none"
            />
          </div>

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-5">
            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Event Date
              </label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="e.g. Friday, December 18, 2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Time Slot
              </label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 7:30 PM - 10:30 PM"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Venue Name
              </label>
              <input
                type="text"
                value={venueName}
                onChange={e => setVenueName(e.target.value)}
                placeholder="e.g. The Retro Lounge & Cafe"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-pixel text-slate-300 mb-1.5">
                Venue Address
              </label>
              <input
                type="text"
                value={venueAddress}
                onChange={e => setVenueAddress(e.target.value)}
                placeholder="e.g. 123 Main Street"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-retro text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Ticket Donation Tiers */}
          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-pixel text-pink-400">
                Ticket & Donation Tiers
              </label>
              <span className="text-[10px] font-retro text-slate-400">
                3 tiers configured
              </span>
            </div>

            <div className="space-y-3">
              {/* Tier 1 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={tier1Name}
                    onChange={e => setTier1Name(e.target.value)}
                    placeholder="Tier 1 Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-retro text-slate-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    value={tier1Price}
                    onChange={e => setTier1Price(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-pixel text-emerald-400"
                  />
                </div>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={tier1Perks}
                    onChange={e => setTier1Perks(e.target.value)}
                    placeholder="Perks description"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-retro text-slate-300"
                  />
                </div>
              </div>

              {/* Tier 2 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={tier2Name}
                    onChange={e => setTier2Name(e.target.value)}
                    placeholder="Tier 2 Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-retro text-slate-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    value={tier2Price}
                    onChange={e => setTier2Price(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-pixel text-emerald-400"
                  />
                </div>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={tier2Perks}
                    onChange={e => setTier2Perks(e.target.value)}
                    placeholder="Perks description"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-retro text-slate-300"
                  />
                </div>
              </div>

              {/* Tier 3 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={tier3Name}
                    onChange={e => setTier3Name(e.target.value)}
                    placeholder="Tier 3 Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-retro text-slate-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    value={tier3Price}
                    onChange={e => setTier3Price(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-pixel text-emerald-400"
                  />
                </div>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={tier3Perks}
                    onChange={e => setTier3Perks(e.target.value)}
                    placeholder="Perks description"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-retro text-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                audio.playSelect();
                onClose();
              }}
              className="min-h-[44px] px-4 py-2 border border-slate-700 bg-slate-950 hover:bg-slate-800 text-xs font-retro text-slate-300 rounded-lg transition-colors order-2 sm:order-1 text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[48px] px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 font-pixel text-xs text-slate-950 rounded-lg shadow-lg active:translate-y-0.5 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Fundraiser Event →</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
