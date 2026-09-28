import React from 'react';
import { StationData } from '../types';

interface ActivitySafetyMatrixProps {
  station: StationData;
}

export const ActivitySafetyMatrix: React.FC<ActivitySafetyMatrixProps> = ({ station }) => {
  const pm = station.pm25;
  const risk = station.riskScore;

  // Derive granular advice based on PM2.5 and physical risk score
  const activities = [
    {
      category: 'Outdoor Cardio & Running',
      icon: 'directions_run',
      status: pm < 25 ? 'OPTIMAL' : pm < 45 ? 'MODERATE' : pm < 75 ? 'UNFAVORABLE' : 'HAZARDOUS',
      statusText: pm < 25 ? 'Safe & Recommended' : pm < 45 ? 'Moderate Pace Only' : pm < 75 ? 'Reduce Duration' : 'Avoid / Gym Only',
      color: pm < 25 ? 'text-[#44e2cd]' : pm < 45 ? 'text-[#38bdf8]' : pm < 75 ? 'text-[#fbbf24]' : 'text-[#ffb4ab]',
      bgColor: pm < 25 ? 'bg-[#44e2cd]/15' : pm < 45 ? 'bg-[#38bdf8]/15' : pm < 75 ? 'bg-[#fbbf24]/15' : 'bg-[#ffb4ab]/15',
      borderColor: pm < 25 ? 'border-[#44e2cd]/30' : pm < 45 ? 'border-[#38bdf8]/30' : pm < 75 ? 'border-[#fbbf24]/30' : 'border-[#ffb4ab]/30',
      advice:
        pm < 25
          ? 'Deep lung ventilation during intense aerobic training is completely safe.'
          : pm < 45
          ? 'Short jogs (<45 mins) are fine; sensitive athletes should avoid threshold sprints.'
          : pm < 75
          ? 'Elevated particle inhalation can trigger bronchial tightening. Move workouts indoors.'
          : 'High risk of micro-alveolar inflammation. Absolutely avoid vigorous outdoor cardio.'
    },
    {
      category: 'Kids & Sensitive Groups',
      icon: 'family_restroom',
      status: pm < 20 ? 'OPTIMAL' : pm < 40 ? 'ACCEPTABLE' : pm < 65 ? 'CAUTION' : 'HIGH_RISK',
      statusText: pm < 20 ? 'Free Outdoor Play' : pm < 40 ? 'Normal Playtime' : pm < 65 ? 'Limit Exposure' : 'Keep Indoors',
      color: pm < 20 ? 'text-[#44e2cd]' : pm < 40 ? 'text-[#38bdf8]' : pm < 65 ? 'text-[#fbbf24]' : 'text-[#ffb4ab]',
      bgColor: pm < 20 ? 'bg-[#44e2cd]/15' : pm < 40 ? 'bg-[#38bdf8]/15' : pm < 65 ? 'bg-[#fbbf24]/15' : 'bg-[#ffb4ab]/15',
      borderColor: pm < 20 ? 'border-[#44e2cd]/30' : pm < 40 ? 'border-[#38bdf8]/30' : pm < 65 ? 'border-[#fbbf24]/30' : 'border-[#ffb4ab]/30',
      advice:
        pm < 20
          ? 'Children, pregnant women, and elderly individuals can enjoy full outdoor recreation.'
          : pm < 40
          ? 'General play is safe. Asthmatic children should keep fast-relief inhalers nearby.'
          : pm < 65
          ? 'Limit prolonged playground activities to under 45 minutes; favor shaded or indoor areas.'
          : 'Severe particulate load. Children and seniors should remain in filtered indoor air.'
    },
    {
      category: 'Home & Window Ventilation',
      icon: 'window',
      status: pm < 30 ? 'SAFE' : pm < 50 ? 'SELECTIVE' : 'CLOSED',
      statusText: pm < 30 ? 'Open Windows Safely' : pm < 50 ? 'Short Airing Only' : 'Keep Windows Sealed',
      color: pm < 30 ? 'text-[#44e2cd]' : pm < 50 ? 'text-[#fbbf24]' : 'text-[#ffb4ab]',
      bgColor: pm < 30 ? 'bg-[#44e2cd]/15' : pm < 50 ? 'bg-[#fbbf24]/15' : 'bg-[#ffb4ab]/15',
      borderColor: pm < 30 ? 'border-[#44e2cd]/30' : pm < 50 ? 'border-[#fbbf24]/30' : 'border-[#ffb4ab]/30',
      advice:
        pm < 30
          ? 'Open opposite windows for 20-30 minutes to purge indoor CO2 and freshen living spaces.'
          : pm < 50
          ? 'Brief 10-minute airing allowed during peak afternoon breeze; keep closed overnight.'
          : 'Seal external windows and doors. Activate mechanical HEPA purifiers in high fan mode.'
    },
    {
      category: 'Protective Mask Guidance',
      icon: 'masks',
      status: pm < 35 ? 'NONE' : pm < 70 ? 'RECOMMENDED' : 'MANDATORY',
      statusText: pm < 35 ? 'No Mask Needed' : pm < 70 ? 'Surgical / KN95' : 'N95 / FFP2 Strongly Advised',
      color: pm < 35 ? 'text-[#44e2cd]' : pm < 70 ? 'text-[#fbbf24]' : 'text-[#ffb4ab]',
      bgColor: pm < 35 ? 'bg-[#44e2cd]/15' : pm < 70 ? 'bg-[#fbbf24]/15' : 'bg-[#ffb4ab]/15',
      borderColor: pm < 35 ? 'border-[#44e2cd]/30' : pm < 70 ? 'border-[#fbbf24]/30' : 'border-[#ffb4ab]/30',
      advice:
        pm < 35
          ? 'Ambient air is breathable without protective filtration.'
          : pm < 70
          ? 'A well-fitted N95 or KN95 respirator protects during active street-side commutes.'
          : 'Sub-micron soot particles bypass nasal filters. Tight-seal N95/FFP2 essential outdoors.'
    },
    {
      category: 'Daily Commute & Travel',
      icon: 'directions_bike',
      status: pm < 35 ? 'ACTIVE' : pm < 65 ? 'MODERATE' : 'PROTECTED',
      statusText: pm < 35 ? 'Walk / Cycle Safe' : pm < 65 ? 'Prefer Low-Traffic' : 'Cabin Air Recirculation',
      color: pm < 35 ? 'text-[#44e2cd]' : pm < 65 ? 'text-[#38bdf8]' : 'text-[#ffb4ab]',
      bgColor: pm < 35 ? 'bg-[#44e2cd]/15' : pm < 65 ? 'bg-[#38bdf8]/15' : 'bg-[#ffb4ab]/15',
      borderColor: pm < 35 ? 'border-[#44e2cd]/30' : pm < 65 ? 'border-[#38bdf8]/30' : 'border-[#ffb4ab]/30',
      advice:
        pm < 35
          ? 'Walking, bicycling, and outdoor transit are pleasant and hazard-free.'
          : pm < 65
          ? 'Commute via low-traffic green corridors to reduce direct exposure to diesel exhaust.'
          : 'Set vehicle ventilation to internal recirculation mode. Prefer subway/metro over open rickshaw.'
    },
    {
      category: 'Pet Care & Walking',
      icon: 'pets',
      status: pm < 40 ? 'NORMAL' : pm < 75 ? 'SHORTER' : 'BRIEF_ONLY',
      statusText: pm < 40 ? 'Normal Walks' : pm < 75 ? 'Moderate Length' : 'Quick Relief Walks Only',
      color: pm < 40 ? 'text-[#44e2cd]' : pm < 75 ? 'text-[#fbbf24]' : 'text-[#ffb4ab]',
      bgColor: pm < 40 ? 'bg-[#44e2cd]/15' : pm < 75 ? 'bg-[#fbbf24]/15' : 'bg-[#ffb4ab]/15',
      borderColor: pm < 40 ? 'border-[#44e2cd]/30' : pm < 75 ? 'border-[#fbbf24]/30' : 'border-[#ffb4ab]/30',
      advice:
        pm < 40
          ? 'Dogs can run, fetch, and exercise outdoors without respiratory restrictions.'
          : pm < 75
          ? 'Keep walks under 20 minutes; avoid busy arterial avenues where exhaust settles low.'
          : 'Pavement-level particulate concentration is highest. Quick bathroom breaks only; wipe paws.'
    }
  ];

  return (
    <div className="bg-[#151922] border border-[#272a30] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
      {/* Title & Status Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#272a30] pb-4">
        <div>
          <h3 className="font-sans text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">health_and_safety</span>
            Plain-English Activity Safety Matrix
          </h3>
          <p className="font-sans text-[12px] text-[#87929a] mt-0.5">
            Actionable daily decisions for {station.region.split('-')[0].trim()} based on real-time physics and particulate density
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] self-start sm:self-center">
          <span className="text-[#87929a]">Overall Safety:</span>
          <span className={`px-2.5 py-0.5 rounded font-bold border ${
            risk < 30
              ? 'bg-[#44e2cd]/15 text-[#44e2cd] border-[#44e2cd]/40'
              : risk < 55
              ? 'bg-[#38bdf8]/15 text-[#8ed5ff] border-[#38bdf8]/40'
              : risk < 75
              ? 'bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/40'
              : 'bg-[#ffb4ab]/15 text-[#ffb4ab] border-[#ffb4ab]/40'
          }`}>
            {risk < 30 ? 'SAFE & CLEAN' : risk < 55 ? 'MODERATE RISK' : risk < 75 ? 'ELEVATED CAUTION' : 'HIGH HEALTH ALERT'}
          </span>
        </div>
      </div>

      {/* Grid of 6 Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {activities.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-[#191e28] border ${item.borderColor} hover:border-[#38bdf8]/50 transition-all flex flex-col justify-between gap-2.5 shadow`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </div>
                  <span className="font-sans text-[13px] font-bold text-white">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`font-mono text-[11px] font-bold ${item.color}`}>
                  ● {item.statusText}
                </span>
              </div>

              <p className="font-sans text-[11px] text-[#cbd5e1] leading-relaxed">
                {item.advice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
