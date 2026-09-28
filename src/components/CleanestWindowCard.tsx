import React from 'react';
import { StationData, HourlyForecastRow } from '../types';
import { calculateCleanestWindow } from '../utils/cleanestWindowUtils';
import { Card } from './ui/Card';

interface CleanestWindowCardProps {
  station: StationData;
  hourlyForecast?: HourlyForecastRow[];
  onNavigateForecast?: () => void;
}

export const CleanestWindowCard: React.FC<CleanestWindowCardProps> = ({
  station,
  hourlyForecast = [],
  onNavigateForecast
}) => {
  const result = calculateCleanestWindow(hourlyForecast, station);

  const getStatusBadge = () => {
    switch (result.bestSlot.relativeStatus) {
      case 'ACTIVE_NOW':
        return {
          text: 'Active Right Now',
          classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        };
      case 'UPCOMING':
        return {
          text: `In ~${result.bestSlot.relativeHoursAway} hours`,
          classes: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
        };
      case 'TOMORROW':
        return {
          text: 'Tomorrow Morning',
          classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <Card variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <span className="material-symbols-outlined text-[22px]">wb_sunny</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white text-[16px] tracking-tight">
                Cleanest Outdoor Window
              </h3>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border backdrop-blur-md ${badge.classes}`}>
                {badge.text}
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Identified by 48-hour boundary layer and atmospheric dispersion modeling
            </p>
          </div>
        </div>

        {onNavigateForecast && (
          <button
            type="button"
            onClick={onNavigateForecast}
            className="text-[12px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors self-start sm:self-center cursor-pointer group"
          >
            <span>View 48h Timeline</span>
            <span className="material-symbols-outlined text-[15px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        )}
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Golden Window Card */}
        <div className="p-4 rounded-xl bg-emerald-950/25 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_8px_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Optimal Outdoor Period
              </span>
              <span className="text-[11px] font-mono text-emerald-300/80">
                Threat Score: {result.bestSlot.riskScore}/100
              </span>
            </div>

            <div className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">
              {result.bestSlot.localTimeDisplay}
            </div>

            <p className="text-[12px] text-slate-300 leading-relaxed">
              {result.summarySentence}
            </p>
          </div>

          <div className="pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Projected PM2.5:</span>
            <span className="text-emerald-400 font-semibold">
              {result.bestSlot.avgPm25} µg/m³ ({result.bestSlot.riskLabel})
            </span>
          </div>
        </div>

        {/* Peak Pollution Period */}
        <div className="p-4 rounded-xl bg-rose-950/25 backdrop-blur-xl border border-rose-500/30 hover:border-rose-500/50 hover:shadow-[0_8px_25px_rgba(239,68,68,0.2)] transition-all duration-300 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Maximum Smog Stagnation (Avoid)
              </span>
              <span className="text-[11px] font-mono text-rose-300/80">
                Threat Score: {result.worstSlot.riskScore}/100
              </span>
            </div>

            <div className="text-[20px] sm:text-[22px] font-bold text-rose-200 tracking-tight">
              {result.worstSlot.localTimeDisplay}
            </div>

            <p className="text-[12px] text-slate-300 leading-relaxed">
              {result.worstSlot.reason}. Ground-level particulate density reaches diurnal peak.
            </p>
          </div>

          <div className="pt-2.5 border-t border-rose-500/20 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Peak PM2.5:</span>
            <span className="text-rose-400 font-semibold">
              {result.worstSlot.pm25} µg/m³ ({result.worstSlot.riskLabel})
            </span>
          </div>
        </div>
      </div>

      {/* 3 Practical Action Guidance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 transition-all flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            result.recommendations.outdoorExercise.allowed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            <span className="material-symbols-outlined text-[19px]">directions_run</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-white">Running & Exercise</span>
            <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {result.recommendations.outdoorExercise.text}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 transition-all flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            result.recommendations.windowVentilation.allowed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            <span className="material-symbols-outlined text-[19px]">window</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-white">Home Ventilation</span>
            <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {result.recommendations.windowVentilation.text}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 transition-all flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            result.recommendations.outdoorPlay.allowed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            <span className="material-symbols-outlined text-[19px]">family_restroom</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-white">Children & Seniors</span>
            <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {result.recommendations.outdoorPlay.text}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
