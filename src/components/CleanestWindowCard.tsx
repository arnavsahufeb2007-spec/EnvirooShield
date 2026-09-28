import React from 'react';
import { StationData, HourlyForecastRow } from '../types';
import { calculateCleanestWindow } from '../utils/cleanestWindowUtils';

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
          text: 'ACTIVE RIGHT NOW',
          classes: 'bg-[#44e2cd]/15 text-[#44e2cd] border-[#44e2cd]/30 animate-pulse'
        };
      case 'UPCOMING':
        return {
          text: `IN ~${result.bestSlot.relativeHoursAway} HOURS`,
          classes: 'bg-[#38bdf8]/15 text-[#8ed5ff] border-[#38bdf8]/30'
        };
      case 'TOMORROW':
        return {
          text: 'TOMORROW MORNING/AFTERNOON',
          classes: 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30'
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="bg-[#151922] border border-[#272a30] hover:border-[#38bdf8]/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#272a30] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#44e2cd]/15 text-[#44e2cd] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">wb_sunny</span>
          </div>
          <div>
            <h3 className="font-sans font-bold text-white text-[16px] tracking-tight flex items-center gap-2">
              Cleanest Window of the Day
              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${badge.classes}`}>
                {badge.text}
              </span>
            </h3>
            <p className="font-sans text-[12px] text-[#87929a]">
              Calculated from 48-hour boundary layer and atmospheric dispersion models
            </p>
          </div>
        </div>

        {onNavigateForecast && (
          <button
            onClick={onNavigateForecast}
            className="text-[12px] font-sans font-bold text-[#38bdf8] hover:text-[#8ed5ff] flex items-center gap-1 transition-colors self-start sm:self-center cursor-pointer"
          >
            <span>View Full Timeline</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Golden Window Card */}
        <div className="p-4 rounded-xl bg-[#121c25] border border-[#44e2cd]/30 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#44e2cd] tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#44e2cd]"></span>
                OPTIMAL OUTDOOR TIME
              </span>
              <span className="font-mono text-[11px] text-[#8ed5ff]">
                Score: {result.bestSlot.riskScore}/100
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-sans text-[20px] font-extrabold text-white">
                {result.bestSlot.localTimeDisplay}
              </span>
            </div>

            <p className="font-sans text-[12px] text-[#cbd5e1] leading-relaxed">
              {result.summarySentence}
            </p>
          </div>

          <div className="pt-2 border-t border-[#272a30] flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#87929a]">Expected PM2.5:</span>
            <span className="text-[#44e2cd] font-bold">
              {result.bestSlot.avgPm25} µg/m³ ({result.bestSlot.riskLabel})
            </span>
          </div>
        </div>

        {/* Peak Smog to Avoid */}
        <div className="p-4 rounded-xl bg-[#221518] border border-[#ffb4ab]/30 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#ffb4ab] tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab]"></span>
                WORST POLLUTION SLOT (AVOID)
              </span>
              <span className="font-mono text-[11px] text-[#ffb4ab]">
                Score: {result.worstSlot.riskScore}/100
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-sans text-[20px] font-extrabold text-[#ffdad6]">
                {result.worstSlot.localTimeDisplay}
              </span>
            </div>

            <p className="font-sans text-[12px] text-[#ffdad6]/80 leading-relaxed">
              {result.worstSlot.reason}. Ground-level particulate density peaks.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ffb4ab]/20 flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#87929a]">Peak PM2.5:</span>
            <span className="text-[#ffb4ab] font-bold">
              {result.worstSlot.pm25} µg/m³ ({result.worstSlot.riskLabel})
            </span>
          </div>
        </div>

      </div>

      {/* 3 Practical Action Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#191e28] border border-[#272a30] flex items-start gap-2.5">
          <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
            result.recommendations.outdoorExercise.allowed ? 'text-[#44e2cd]' : 'text-[#ffb4ab]'
          }`}>
            directions_run
          </span>
          <div className="flex flex-col">
            <span className="font-sans text-[12px] font-bold text-white">Running & Exercise</span>
            <span className="font-sans text-[11px] text-[#cbd5e1] mt-0.5 leading-snug">
              {result.recommendations.outdoorExercise.text}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#191e28] border border-[#272a30] flex items-start gap-2.5">
          <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
            result.recommendations.windowVentilation.allowed ? 'text-[#44e2cd]' : 'text-[#ffb4ab]'
          }`}>
            window
          </span>
          <div className="flex flex-col">
            <span className="font-sans text-[12px] font-bold text-white">Home Ventilation</span>
            <span className="font-sans text-[11px] text-[#cbd5e1] mt-0.5 leading-snug">
              {result.recommendations.windowVentilation.text}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#191e28] border border-[#272a30] flex items-start gap-2.5">
          <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
            result.recommendations.outdoorPlay.allowed ? 'text-[#44e2cd]' : 'text-[#ffb4ab]'
          }`}>
            family_restroom
          </span>
          <div className="flex flex-col">
            <span className="font-sans text-[12px] font-bold text-white">Children & Seniors</span>
            <span className="font-sans text-[11px] text-[#cbd5e1] mt-0.5 leading-snug">
              {result.recommendations.outdoorPlay.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
