import React from 'react';
import { GlobalLocationSearchResult, PRESET_WORLD_CITIES } from '../services/airQualityApi';

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  flag: string;
  cityName: string;
  targetCity: GlobalLocationSearchResult;
  phenomenon: string;
  expectedAqi: string;
  color: string;
  bgColor: string;
  borderColor: string;
  keyPhysics: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'pristine-alpine',
    title: 'Pristine Alpine & Coastal Air',
    subtitle: 'High ventilation, low particulate mass, unconstrained dispersion',
    flag: '🇨🇭',
    cityName: 'Zurich / Switzerland',
    targetCity: {
      id: 'zurich',
      name: 'Zurich',
      country: 'Switzerland',
      countryCode: 'CH',
      lat: 47.3769,
      lng: 8.5417,
      elevation: 408,
      flag: '🇨🇭',
      timezone: 'Europe/Zurich'
    },
    phenomenon: 'Deep planetary boundary layer (~1,450m) with brisk alpine breezes',
    expectedAqi: 'Score ~12 · Clean Air',
    color: 'text-[#44e2cd]',
    bgColor: 'bg-[#44e2cd]/10',
    borderColor: 'border-[#44e2cd]/30',
    keyPhysics: 'PM2.5 mass density < 1.0 × 10⁻¹¹ g/cm³; all outdoor workouts 100% safe.'
  },
  {
    id: 'winter-inversion-crisis',
    title: 'Severe Thermal Inversion Crisis',
    subtitle: 'The "pot lid" effect trapping urban emissions at ground level',
    flag: '🇮🇳',
    cityName: 'New Delhi / India',
    targetCity: PRESET_WORLD_CITIES[0], // Delhi
    phenomenon: 'Thermal inversion ceiling drops to < 35,000 cm while surface wind falls to 0.3 m/s',
    expectedAqi: 'Score ~86 · High Health Alert',
    color: 'text-[#ffb4ab]',
    bgColor: 'bg-[#93000a]/15',
    borderColor: 'border-[#ffb4ab]/40',
    keyPhysics: 'Particulate density surges > 8.0 × 10⁻¹¹ g/cm³; N95 respirators required outdoors.'
  },
  {
    id: 'coastal-megacity',
    title: 'Dynamic Maritime Megacity',
    subtitle: 'High urban density mitigated by maritime sea-breeze flushing',
    flag: '🇯🇵',
    cityName: 'Tokyo / Japan',
    targetCity: PRESET_WORLD_CITIES[1], // Tokyo
    phenomenon: 'Cyclic Pacific sea-breeze boundary clears afternoon vehicle exhaust',
    expectedAqi: 'Score ~24 · Nominal / Good',
    color: 'text-[#38bdf8]',
    bgColor: 'bg-[#38bdf8]/10',
    borderColor: 'border-[#38bdf8]/30',
    keyPhysics: 'Surface wind speeds ~350 cm/s continuously dilute ground particulates.'
  },
  {
    id: 'high-altitude-basin',
    title: 'High-Altitude Valley Basin',
    subtitle: 'Low air pressure and photochemical ozone trap',
    flag: '🇺🇸',
    cityName: 'Denver / United States',
    targetCity: {
      id: 'denver',
      name: 'Denver',
      country: 'United States',
      countryCode: 'US',
      lat: 39.7392,
      lng: -104.9903,
      elevation: 1609,
      flag: '🇺🇸',
      timezone: 'America/Denver'
    },
    phenomenon: 'Barometric pressure drops to ~840,000 Ba with strong ultraviolet ozone catalysis',
    expectedAqi: 'Score ~42 · Moderate Ozone',
    color: 'text-[#fbbf24]',
    bgColor: 'bg-[#fbbf24]/10',
    borderColor: 'border-[#fbbf24]/30',
    keyPhysics: 'Low density air increases particle inhalation speed; midday ozone spikes.'
  }
];

interface DemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
}

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-950/90 border border-white/[0.12] rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <span className="material-symbols-outlined text-[20px]">science</span>
            </div>
            <div>
              <h2 className="font-sans text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
                Interactive Atmospheric Demo Scenarios
                <span className="font-mono text-[10px] text-amber-300 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30 font-bold">
                  FOR EVALUATORS & DEMOS
                </span>
              </h2>
              <p className="font-sans text-[11px] text-slate-400">
                Test distinct global atmospheric conditions with 1 click to see live physics, timezones, and health reactions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08] hover:border-white/[0.2]"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-5 overflow-y-auto flex flex-col gap-3.5">
          {DEMO_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              className="p-4.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/[0.22] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
              onClick={() => {
                onSelectScenario(sc);
                onClose();
              }}
            >
              <div className="flex items-start gap-3.5">
                <span className="text-3xl mt-0.5 shrink-0 group-hover:scale-110 transition-transform">{sc.flag}</span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans font-bold text-[15px] text-white group-hover:text-sky-300 transition-colors">
                      {sc.title}
                    </span>
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bgColor} ${sc.color} ${sc.borderColor}`}>
                      {sc.expectedAqi}
                    </span>
                  </div>
                  <span className="font-sans text-[12px] text-sky-400 font-medium mt-0.5">
                    Location: {sc.cityName}
                  </span>
                  <p className="font-sans text-[12px] text-slate-300 mt-1 leading-snug">
                    <strong className="text-white">Atmospheric Phenomenon:</strong> {sc.phenomenon}
                  </p>
                  <span className="font-sans text-[11px] text-slate-400 mt-1">
                    {sc.keyPhysics}
                  </span>
                </div>
              </div>

              <button
                className="px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.1] group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-sky-500 group-hover:text-slate-950 text-slate-200 font-sans text-[12px] font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 self-start sm:self-center shadow-xs group-hover:shadow-[0_4px_16px_rgba(56,189,248,0.4)] group-hover:scale-105"
              >
                <span>Launch Scenario</span>
                <span className="material-symbols-outlined text-[15px] transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between">
          <span className="font-mono text-[11px] text-slate-400">
            Every scenario instantly resolves local timezones, CGS physics units, and hourly trajectories.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.2] text-slate-300 hover:text-white font-sans text-[12px] font-medium transition-all duration-200 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
