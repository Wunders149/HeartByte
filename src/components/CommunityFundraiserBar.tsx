import React from 'react';
import { CommunityEvent } from '../types/dating';
import { Heart, Target, Users, Sparkles, Building2 } from 'lucide-react';

interface CommunityFundraiserBarProps {
  event: CommunityEvent;
  registrationCount: number;
  onOpenRegister: () => void;
}

export const CommunityFundraiserBar: React.FC<CommunityFundraiserBarProps> = ({
  event,
  registrationCount,
  onOpenRegister,
}) => {
  const percentage = Math.min(100, Math.round((event.currentFundsRaised / event.fundraisingGoal) * 100));
  const remaining = Math.max(0, event.fundraisingGoal - event.currentFundsRaised);

  return (
    <div className="bg-slate-900 border-2 border-pink-500/50 rounded-xl p-4 md:p-5 shadow-xl relative overflow-hidden mb-6">
      {/* Background Retro Grid glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Cause Beneficiary & Event Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-retro text-cyan-400 mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span className="font-bold">BENEFICIARY:</span>
            <span>{event.beneficiaryName}</span>
          </div>
          <h2 className="text-base md:text-lg font-pixel text-slate-100">
            {event.title}
          </h2>
        </div>

        {/* Register & Support Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenRegister}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-400 hover:to-rose-300 text-slate-950 font-pixel text-xs rounded-lg shadow-md active:translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-slate-950" />
            <span>Register & Donate</span>
          </button>
        </div>
      </div>

      {/* Progress Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 py-2 border-y border-slate-800 text-xs font-retro">
        <div>
          <div className="text-slate-400 text-[10px]">TOTAL RAISED</div>
          <div className="font-pixel text-sm md:text-base text-emerald-400">
            ${event.currentFundsRaised.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px]">GOAL TARGET</div>
          <div className="font-pixel text-sm md:text-base text-slate-200">
            ${event.fundraisingGoal.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px]">COMMUNITY PROGRESS</div>
          <div className="font-pixel text-sm md:text-base text-pink-400">
            {percentage}% FUNDED
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px]">REGISTERED DATERS</div>
          <div className="font-pixel text-sm md:text-base text-cyan-300 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{registrationCount} / {event.maxCapacity}</span>
          </div>
        </div>
      </div>

      {/* 8-Bit Progress Bar */}
      <div className="mt-2">
        <div className="h-4 bg-slate-950 border border-slate-700 rounded-full overflow-hidden p-0.5 relative">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(236,72,153,0.5)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-retro text-slate-400 mt-1.5">
          <span>{percentage}% reached</span>
          <span>
            {remaining > 0 ? `$${remaining.toLocaleString()} needed to save cause` : 'GOAL REACHED! ★'}
          </span>
        </div>
      </div>
    </div>
  );
};
