import React from 'react';
import { StationData } from '../types';
import { Card } from './ui/Card';
import { calculateAQI, getAQICategory } from '../utils/aqiUtils';

interface ActivitySafetyMatrixProps {
  station: StationData;
}

export const ActivitySafetyMatrix: React.FC<ActivitySafetyMatrixProps> = ({ station }) => {
  const pm = station.pm25;
  const aqi = calculateAQI(pm);
  const aqiCat = getAQICategory(aqi);

  const activities = [
    {
      category: 'Outdoor Cardio & Running',
      icon: 'directions_run',
      status: pm < 25 ? 'Optimal' : pm < 45 ? 'Moderate' : pm < 75 ? 'Caution' : 'Avoid Outdoors',
      color: pm < 25 ? 'text-emerald-400' : pm < 45 ? 'text-amber-400' : pm < 75 ? 'text-orange-400' : 'text-rose-400',
      bgColor: pm < 25 ? 'bg-emerald-500/10' : pm < 45 ? 'bg-amber-500/10' : pm < 75 ? 'bg-orange-500/10' : 'bg-rose-500/10',
      borderColor: pm < 25 ? 'border-emerald-500/30' : pm < 45 ? 'border-amber-500/30' : pm < 75 ? 'border-orange-500/30' : 'border-rose-500/30',
      glow: pm < 25 ? 'hover:shadow-[0_8px_25px_rgba(16,185,129,0.15)]' : 'hover:shadow-[0_8px_25px_rgba(239,68,68,0.15)]',
      advice:
        pm < 25
          ? 'Deep lung ventilation during intense aerobic training is completely safe.'
          : pm < 45
          ? 'Short runs (<45 mins) are fine; sensitive athletes should avoid peak interval sprints.'
          : pm < 75
          ? 'Elevated particle inhalation triggers airway resistance. Move workouts indoors.'
          : 'High risk of micro-alveolar irritation. Avoid vigorous outdoor workouts.'
    },
    {
      category: 'Children & Sensitive Groups',
      icon: 'family_restroom',
      status: pm < 20 ? 'Optimal' : pm < 40 ? 'Acceptable' : pm < 65 ? 'Limit Play' : 'Keep Indoors',
      color: pm < 20 ? 'text-emerald-400' : pm < 40 ? 'text-amber-400' : pm < 65 ? 'text-orange-400' : 'text-rose-400',
      bgColor: pm < 20 ? 'bg-emerald-500/10' : pm < 40 ? 'bg-amber-500/10' : pm < 65 ? 'bg-orange-500/10' : 'bg-rose-500/10',
      borderColor: pm < 20 ? 'border-emerald-500/30' : pm < 40 ? 'border-amber-500/30' : pm < 65 ? 'border-orange-500/30' : 'border-rose-500/30',
      glow: pm < 20 ? 'hover:shadow-[0_8px_25px_rgba(16,185,129,0.15)]' : 'hover:shadow-[0_8px_25px_rgba(245,158,11,0.15)]',
      advice:
        pm < 20
          ? 'Children, pregnant individuals, and seniors can enjoy full outdoor recreation.'
          : pm < 40
          ? 'Normal playtime. Asthmatic children should keep fast-relief inhalers on hand.'
          : pm < 65
          ? 'Limit prolonged playground activities to under 45 minutes; favor shaded parks.'
          : 'Severe particulate load. Children and seniors should remain in filtered indoor air.'
    },
    {
      category: 'Home & Window Ventilation',
      icon: 'window',
      status: pm < 30 ? 'Safe to Air Out' : pm < 50 ? 'Brief Airing Only' : 'Keep Sealed',
      color: pm < 30 ? 'text-emerald-400' : pm < 50 ? 'text-amber-400' : 'text-rose-400',
      bgColor: pm < 30 ? 'bg-emerald-500/10' : pm < 50 ? 'bg-amber-500/10' : 'bg-rose-500/10',
      borderColor: pm < 30 ? 'border-emerald-500/30' : pm < 50 ? 'border-amber-500/30' : 'border-rose-500/30',
      glow: pm < 30 ? 'hover:shadow-[0_8px_25px_rgba(16,185,129,0.15)]' : 'hover:shadow-[0_8px_25px_rgba(239,68,68,0.15)]',
      advice:
        pm < 30
          ? 'Open windows for 20-30 minutes to circulate fresh air and reduce indoor CO2.'
          : pm < 50
          ? 'Brief 10-minute airing during afternoon breeze; keep windows sealed overnight.'
          : 'Keep windows and exterior doors shut. Run indoor HEPA purifiers.'
    },
    {
      category: 'Mask & Respiratory Protection',
      icon: 'masks',
      status: pm < 35 ? 'Not Required' : pm < 70 ? 'Recommended' : 'N95 / FFP2 Essential',
      color: pm < 35 ? 'text-emerald-400' : pm < 70 ? 'text-amber-400' : 'text-rose-400',
      bgColor: pm < 35 ? 'bg-emerald-500/10' : pm < 70 ? 'bg-amber-500/10' : 'bg-rose-500/10',
      borderColor: pm < 35 ? 'border-emerald-500/30' : pm < 70 ? 'border-amber-500/30' : 'border-rose-500/30',
      glow: 'hover:shadow-[0_8px_25px_rgba(56,189,248,0.15)]',
      advice:
        pm < 35
          ? 'Ambient air is clean and breathable without personal protective filtration.'
          : pm < 70
          ? 'A well-fitted N95 or KN95 respirator protects during busy roadside commutes.'
          : 'Sub-micron soot penetrates deeply into lung tissue. Wear a sealed N95/FFP2 outdoors.'
    },
    {
      category: 'Daily Commute & Transit',
      icon: 'directions_bike',
      status: pm < 35 ? 'Walk & Cycle' : pm < 65 ? 'Moderate Caution' : 'Cabin Recirculation',
      color: pm < 35 ? 'text-emerald-400' : pm < 65 ? 'text-sky-400' : 'text-rose-400',
      bgColor: pm < 35 ? 'bg-emerald-500/10' : pm < 65 ? 'bg-sky-500/10' : 'bg-rose-500/10',
      borderColor: pm < 35 ? 'border-emerald-500/30' : pm < 65 ? 'border-sky-500/30' : 'border-rose-500/30',
      glow: 'hover:shadow-[0_8px_25px_rgba(56,189,248,0.15)]',
      advice:
        pm < 35
          ? 'Walking, cycling, and outdoor commuting are pleasant and hazard-free.'
          : pm < 65
          ? 'Choose routes along green parks rather than heavy diesel-truck traffic corridors.'
          : 'Set vehicle ventilation to internal recirculation mode. Prefer metro/subway over open transit.'
    },
    {
      category: 'Pet Recreation & Walking',
      icon: 'pets',
      status: pm < 40 ? 'Normal Walks' : pm < 75 ? 'Shorter Walks' : 'Quick Relief Only',
      color: pm < 40 ? 'text-emerald-400' : pm < 75 ? 'text-amber-400' : 'text-rose-400',
      bgColor: pm < 40 ? 'bg-emerald-500/10' : pm < 75 ? 'bg-amber-500/10' : 'bg-rose-500/10',
      borderColor: pm < 40 ? 'border-emerald-500/30' : pm < 75 ? 'border-amber-500/30' : 'border-rose-500/30',
      glow: 'hover:shadow-[0_8px_25px_rgba(245,158,11,0.15)]',
      advice:
        pm < 40
          ? 'Dogs and outdoor pets can run, fetch, and exercise without respiratory restrictions.'
          : pm < 75
          ? 'Keep walks under 20 minutes; avoid major congested streets where particulate settles low.'
          : 'Particulate density is highest near ground level. Quick bathroom breaks only.'
    }
  ];

  return (
    <Card variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(45,212,191,0.25)]">
            <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-[16px] tracking-tight">
              Activity & Health Recommendations
            </h3>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Specific daily guidance for {station.region.split('-')[0].trim()} based on current atmospheric conditions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] self-start sm:self-center">
          <span className="text-slate-400">Current Health Index:</span>
          <span
            className={`px-3 py-0.5 rounded-full font-semibold border backdrop-blur-md ${aqiCat.bgColor} ${aqiCat.textColor} ${aqiCat.borderColor}`}
          >
            AQI {aqi} • {aqiCat.label}
          </span>
        </div>
      </div>

      {/* Grid of 6 Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {activities.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-white/[0.03] backdrop-blur-xl border ${item.borderColor} ${item.glow} flex flex-col justify-between gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-white">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-[11px] font-semibold ${item.color}`}>
                  ● {item.status}
                </span>
              </div>

              <p className="text-[12px] text-slate-300 leading-relaxed">
                {item.advice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
