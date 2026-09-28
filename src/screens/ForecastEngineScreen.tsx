import React, { useState } from 'react';
import { HOURLY_FORECAST_DATA, RIDGE_FEATURES } from '../data/mockData';
import { StationData, HourlyForecastRow } from '../types';
import { useStationTime } from '../utils/timezoneUtils';

interface ForecastEngineScreenProps {
  station: StationData;
  onOpenHyperparameters: () => void;
  onOpenExport: () => void;
  onNotify: (title: string, description: string) => void;
  simpleMode?: boolean;
  hourlyForecast?: HourlyForecastRow[];
}

export const ForecastEngineScreen: React.FC<ForecastEngineScreenProps> = ({
  station,
  onOpenHyperparameters,
  onOpenExport,
  onNotify,
  simpleMode = true,
  hourlyForecast
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'parquet'>('parquet');
  const [activeNode, setActiveNode] = useState<string | null>('T+24h');
  const stationTime = useStationTime(station);

  const forecastData = hourlyForecast && hourlyForecast.length > 0 ? hourlyForecast : HOURLY_FORECAST_DATA;

  // Dynamically compute milestones from active station & forecast
  const peakRow = forecastData.reduce((prev, curr) => (curr.pm25 > prev.pm25 ? curr : prev), forecastData[0]);
  const reliefRow = forecastData[forecastData.length - 1] || forecastData[forecastData.length - 1];

  const handleExportFormatClick = (fmt: 'csv' | 'json' | 'parquet') => {
    setSelectedFormat(fmt);
    onNotify('Format Switched', `Hourly Ledger ledger formatted for ${fmt.toUpperCase()} export stream.`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Plain-English Timeline Guide when Simple Mode is enabled */}
      {simpleMode && (
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-3">
          <div className="bg-[#151c28] border border-[#38bdf8]/40 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">schedule</span>
                <span className="font-sans font-bold text-white text-[15px]">
                  48-Hour Air Quality Story: {station.region}
                </span>
              </div>
              <span className="font-mono text-[10px] bg-[#38bdf8]/20 text-[#8ed5ff] border border-[#38bdf8]/30 px-2 py-0.5 rounded font-bold">
                DYNAMIC LOCAL TIMELINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-[12px]">
              <div className="p-3 rounded-lg bg-[#111319] border border-[#272a30]">
                <div className="flex items-center justify-between text-[#8ed5ff] font-bold mb-1">
                  <span>1. Right Now (T+0)</span>
                  <span className="font-mono">{station.pm25} µg/m³</span>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  Current baseline for {station.name.split(' ')[0]}. Inversion ceiling at {station.pblHeight}m with surface winds at {station.windSpeedMS} m/s ({station.windDirection}).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#111319] border border-[#ffb4ab]/40">
                <div className="flex items-center justify-between text-[#ffb4ab] font-bold mb-1">
                  <span>2. Projected Peak ({peakRow.localTimeFormatted || peakRow.horizon})</span>
                  <span className="font-mono text-[#ffb4ab]">{peakRow.pm25} µg/m³ [{peakRow.riskCategory}]</span>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  <strong>Peak Trajectory:</strong> Boundary layer ceiling shifts to {peakRow.pblHeight}m with wind vector {peakRow.windVector}. {peakRow.pblNote || 'Maximum diurnal smog accumulation.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#111319] border border-[#44e2cd]/40">
                <div className="flex items-center justify-between text-[#44e2cd] font-bold mb-1">
                  <span>3. In 48 Hours ({reliefRow.localTimeFormatted || reliefRow.horizon})</span>
                  <span className="font-mono text-[#44e2cd]">{reliefRow.pm25} µg/m³ [{reliefRow.riskCategory}]</span>
                </div>
                <p className="text-[#cbd5e1] leading-relaxed">
                  <strong>48h Forecast Outlook:</strong> Ceiling expands to {reliefRow.pblHeight}m with winds at {reliefRow.windVector}. {reliefRow.pblNote || 'Atmospheric dispersion clearing front.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Model Topology & Validation Header Ledger */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-3 bg-[#0b0e13] border-b border-[#272a30]/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-[#38bdf8] text-[#004965] font-mono text-[11px] font-bold tracking-wider uppercase">
              ARCH_SPEC
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-[16px] font-semibold text-[#e1e2ea]">
                EnviroForecaster-v1.4-RidgeAR
              </span>
              <span className="font-mono text-[11px] text-[#bdc8d1]">
                (Autoregressive Ridge + ECMWF IFS-0.05° Meteorological Covariates)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-[#bdc8d1] flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#44e2cd]"></span>
              <span className="text-[10px] uppercase text-[#87929a] font-semibold">ENSEMBLE:</span>
              <span className="text-[#e1e2ea] font-medium">32 Perturbations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase text-[#87929a] font-semibold">HORIZON:</span>
              <span className="text-[#3cddc7] font-medium">T+0h → T+48h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase text-[#87929a] font-semibold">VALIDATION_LAG:</span>
              <span className="text-[#8ed5ff] font-medium">1-Step Rolling Chronological</span>
            </div>
          </div>
        </div>

        {/* Telemetric Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          <div className="bg-[#191c21] p-3 rounded border border-[#272a30]/60 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Mean Abs Error (MAE)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-[24px] font-semibold text-[#e1e2ea]">3.42</span>
              <span className="font-mono text-[11px] text-[#bdc8d1]">µg/m³</span>
            </div>
            <span className="font-mono text-[11px] text-[#44e2cd] mt-1">±0.12 vs 7d avg</span>
          </div>

          <div className="bg-[#191c21] p-3 rounded border border-[#272a30]/60 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Root Mean Sq Err (RMSE)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-[24px] font-semibold text-[#e1e2ea]">4.88</span>
              <span className="font-mono text-[11px] text-[#bdc8d1]">µg/m³</span>
            </div>
            <span className="font-mono text-[11px] text-[#44e2cd] mt-1">Within σ&lt;1.05 bound</span>
          </div>

          <div className="bg-[#191c21] p-3 rounded border border-[#272a30]/60 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Coeff of Deter (R²)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-[24px] font-semibold text-[#8ed5ff]">0.941</span>
              <span className="font-mono text-[11px] text-[#8ed5ff]">fit</span>
            </div>
            <span className="font-mono text-[11px] text-[#bdc8d1] mt-1">High deterministic lock</span>
          </div>

          <div className="bg-[#191c21] p-3 rounded border border-[#272a30]/60 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Current PM2.5 (T+0)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-[24px] font-semibold text-[#62fae3]">86.4</span>
              <span className="font-mono text-[11px] text-[#bdc8d1]">µg/m³</span>
            </div>
            <span className="font-mono text-[11px] text-[#bdc8d1] mt-1">Risk Index 45.9 [MOD]</span>
          </div>

          <div className="bg-[#191c21] p-3 rounded border border-[#93000a]/40 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] font-semibold text-[#ffb4ab] uppercase">Peak Surge (T+24)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-[24px] font-bold text-[#ffb4ab]">96.1</span>
              <span className="font-mono text-[11px] text-[#ffb4ab]">µg/m³</span>
            </div>
            <span className="font-mono text-[11px] text-[#ffb4ab] mt-1">Risk Index 52.4 [HIGH]</span>
          </div>

          <div className="bg-[#191c21] p-3 rounded border border-[#272a30]/60 shadow-sm flex flex-col justify-between">
            <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Terminal Horizon (T+48)</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-[24px] font-semibold text-[#44e2cd]">58.3</span>
              <span className="font-mono text-[11px] text-[#bdc8d1]">µg/m³</span>
            </div>
            <span className="font-mono text-[11px] text-[#44e2cd] mt-1">Frontal Dispersal [MOD]</span>
          </div>
        </div>
      </section>

      {/* Interactive Control & Alert Ribbon */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-3 bg-[#111319]">
        <div className="bg-[#1d2025] p-3 sm:p-4 rounded border border-[#272a30] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#ffb4ab]/20 border border-[#ffb4ab]/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[20px]">warning</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans text-[16px] font-bold text-[#e1e2ea]">
                  SYNOPTIC ADVISORY // CRITICAL INVERSION ALERT
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-semibold">
                  SEV-2 TRIGGER
                </span>
              </div>
              <p className="font-sans text-[12px] text-[#bdc8d1] mt-1 leading-relaxed">
                Anticipated planetary boundary layer compression peak at <strong className="text-white">T+24h (Tomorrow 14:00 UTC)</strong>. Surface wind deceleration to ≤0.8 m/s traps ground particulates. Recommended mitigation window for mandatory industrial emission curtailment and vehicular dampening: <strong className="text-[#8ed5ff] font-mono">02:00 - 08:00 IST</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
            <button
              onClick={onOpenHyperparameters}
              className="px-3 py-1.5 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] font-mono text-[11px] flex items-center gap-1.5 border border-[#3e484f] shadow-sm transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Hyperparameters</span>
            </button>
            <button
              onClick={onOpenExport}
              className="px-3.5 py-1.5 rounded bg-[#38bdf8] text-[#004965] hover:bg-[#8ed5ff] font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">sim_card_download</span>
              <span>Export GeoJSON NetCDF</span>
            </button>
          </div>
        </div>
      </section>

      {/* Primary Analytical Split Layout */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-3 grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Large-Scale Predictive Time-Series Visualization Panel (8 cols) */}
        <div className="xl:col-span-8 bg-[#191c21] p-4 rounded border border-[#272a30] flex flex-col justify-between shadow-md">
          {/* Panel Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3 border-b border-[#272a30]/50">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">timeline</span>
                <span className="font-sans text-[16px] font-bold text-[#e1e2ea]">
                  Continuous Dispersion & Concentration Trajectory
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#bdc8d1]">
                T-24h (Observed Ingestion) through T+48h (RidgeAR Stochastic Projection)
              </span>
            </div>

            {/* Legend Strip */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#87929a]"></span>
                <span className="text-[#bdc8d1]">Observed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#38bdf8]"></span>
                <span className="text-[#8ed5ff] font-semibold">Forecast Vector</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 bg-[#38bdf8]/20 rounded-xs"></span>
                <span className="text-[#bdc8d1]">95% Envelope</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#ffb4ab]"></span>
                <span className="text-[#ffb4ab]">NAAQS (60)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#44e2cd]"></span>
                <span className="text-[#44e2cd]">WHO (15)</span>
              </div>
            </div>
          </div>

          {/* High Precision Inline SVG Time-Series Chart */}
          <div className="w-full relative bg-[#0b0e13] p-2 rounded my-3 border border-[#272a30] overflow-hidden">
            {/* Inflection Marker Tooltip */}
            <div className="absolute top-4 left-[64%] -translate-x-1/2 z-20 pointer-events-none hidden md:flex flex-col items-center">
              <div className="bg-[#32353b]/95 p-2 rounded border border-[#ffb4ab]/40 shadow-2xl flex flex-col gap-0.5 font-mono text-[11px] text-[#e1e2ea]">
                <div className="flex items-center justify-between gap-4 text-[#ffb4ab]">
                  <span className="font-bold">T+24h [PEAK INFLECTION]</span>
                  <span className="font-extrabold text-[12px]">96.1 µg/m³</span>
                </div>
                <div className="flex justify-between text-[#bdc8d1] text-[10px]">
                  <span>95% CI:</span>
                  <span>85.4 - 106.8 µg/m³</span>
                </div>
                <div className="flex justify-between text-[#bdc8d1] text-[10px]">
                  <span>Mechanism:</span>
                  <span className="text-[#ffb4ab] font-semibold">Stagnant Inversion Lock</span>
                </div>
                <div className="flex justify-between text-[#bdc8d1] text-[10px]">
                  <span>PBL Height:</span>
                  <span>310 m (↓ 64%)</span>
                </div>
              </div>
              <div className="w-0.5 h-28 bg-[#ffb4ab]/60"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffb4ab] ring-4 ring-[#ffb4ab]/25 -mt-1.5"></div>
            </div>

            {/* SVG Coordinate System (1000 x 420) */}
            <svg className="w-full h-auto text-[#e1e2ea] select-none" viewBox="0 0 1000 420" preserveAspectRatio="none">
              <defs>
                <linearGradient id="envelopeGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="historyGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#87929a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#87929a" stopOpacity="0.0" />
                </linearGradient>
                <pattern id="forecastGrid" width="125" height="70" patternUnits="userSpaceOnUse">
                  <path d="M 125 0 L 0 0 0 70" fill="none" stroke="#272a30" strokeWidth="0.8" strokeDasharray="2,3" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="1000" height="350" fill="url(#forecastGrid)" />

              {/* Guidelines */}
              {/* WHO 24h Guideline: 15 µg/m³ -> Y = ~303.5 */}
              <line x1="0" y1="303.5" x2="1000" y2="303.5" stroke="#44e2cd" strokeWidth="1.2" strokeDasharray="4,4" opacity="0.85" />
              <text x="12" y="299" fill="#44e2cd" opacity="0.9" className="font-mono text-[10px]">WHO 24h Limit: 15 µg/m³</text>

              {/* National Standard (NAAQS): 60 µg/m³ -> Y = 164 */}
              <line x1="0" y1="164" x2="1000" y2="164" stroke="#ffb4ab" strokeWidth="1.2" strokeDasharray="4,4" opacity="0.85" />
              <text x="12" y="159" fill="#ffb4ab" opacity="0.9" className="font-mono text-[10px]">National Standard: 60 µg/m³ (NAAQS-24H)</text>

              {/* T=0 Separator Axis line (X = 333.3) */}
              <line x1="333" y1="0" x2="333" y2="350" stroke="#87929a" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="339" y="22" fill="#8ed5ff" className="font-mono text-[11px] font-bold">T+0 [NOW]</text>

              {/* Shaded 95% Confidence Envelope */}
              <path
                d="M 333,82.16 
                   C 416,70, 450,58.9, 500,58.6 
                   C 583,58.3, 620,-9.6, 666, -9.6 
                   C 750,-9.6, 790,52.6, 833,52.6 
                   C 916,52.6, 950,89.6, 1000,89.6 
                   L 1000,248.94 
                   C 950,248.94, 916,188.8, 833,188.8 
                   C 790,188.8, 750,113.78, 666,113.78 
                   C 620,113.78, 583,133.0, 500,133.0 
                   C 450,133.0, 416,94.32, 333,82.16 Z"
                fill="url(#envelopeGrad)"
              />

              {/* Historical Observed Curve (T-24 to T-0) */}
              <path
                d="M 0,225 
                   C 55,230, 83,195, 111,180 
                   C 166,150, 194,175, 222,140 
                   C 260,95, 290,110, 333,82.16"
                fill="none"
                stroke="#bdc8d1"
                strokeWidth="2.5"
              />

              {/* Historical Area Fill */}
              <path
                d="M 0,225 
                   C 55,230, 83,195, 111,180 
                   C 166,150, 194,175, 222,140 
                   C 260,95, 290,110, 333,82.16 
                   L 333,350 L 0,350 Z"
                fill="url(#historyGrad)"
              />

              {/* Forecast Model Spline Trajectory */}
              <path
                d="M 333,82.16 
                   C 400,82.16, 450,95.8, 500,95.8 
                   C 560,95.8, 610,52.09, 666,52.09 
                   C 725,52.09, 780,120.6, 833,120.6 
                   C 890,120.6, 940,169.27, 1000,169.27"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Concentric Node Rings */}
              {/* T+0 */}
              <circle cx="333" cy="82.16" r="5" fill="#38bdf8" className="cursor-pointer" onClick={() => setActiveNode('T+0')} />
              <circle cx="333" cy="82.16" r="9" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />

              {/* T+12h */}
              <circle cx="500" cy="95.8" r="4.5" fill="#38bdf8" className="cursor-pointer" onClick={() => setActiveNode('T+12h')} />

              {/* T+24h PEAK */}
              <circle cx="666" cy="52.09" r="6" fill="#ffb4ab" className="cursor-pointer" onClick={() => setActiveNode('T+24h')} />
              <circle cx="666" cy="52.09" r="11" fill="none" stroke="#ffb4ab" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: '666px 52.09px' }} opacity="0.7" />

              {/* T+36h */}
              <circle cx="833" cy="120.6" r="4.5" fill="#38bdf8" className="cursor-pointer" onClick={() => setActiveNode('T+36h')} />

              {/* T+48h */}
              <circle cx="1000" cy="169.27" r="5" fill="#44e2cd" className="cursor-pointer" onClick={() => setActiveNode('T+48h')} />

              {/* X-Axis Rule */}
              <line x1="0" y1="350" x2="1000" y2="350" stroke="#3e484f" strokeWidth="1.5" />
              <text x="0" y="375" fill="#87929a" className="font-mono text-[11px]">T-24h (00:00)</text>
              <text x="160" y="375" fill="#87929a" className="font-mono text-[11px]">T-12h</text>
              <text x="325" y="375" fill="#8ed5ff" className="font-mono text-[11px] font-bold">T+0 [NOW]</text>
              <text x="490" y="375" fill="#87929a" className="font-mono text-[11px]">T+12h</text>
              <text x="652" y="375" fill="#ffb4ab" className="font-mono text-[11px] font-bold">T+24h [PEAK]</text>
              <text x="820" y="375" fill="#87929a" className="font-mono text-[11px]">T+36h</text>
              <text x="945" y="375" fill="#44e2cd" className="font-mono text-[11px]">T+48h [FRONT]</text>

              {/* Y-Axis Value Labels */}
              <text x="965" y="32" fill="#87929a" className="font-mono text-[10px]">100 µg/m³</text>
              <text x="970" y="94" fill="#87929a" className="font-mono text-[10px]">80 µg/m³</text>
              <text x="970" y="156" fill="#87929a" className="font-mono text-[10px]">60 µg/m³</text>
              <text x="970" y="218" fill="#87929a" className="font-mono text-[10px]">40 µg/m³</text>
              <text x="970" y="280" fill="#87929a" className="font-mono text-[10px]">20 µg/m³</text>
            </svg>
          </div>

          {/* Inflection Details Multi-Card Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <div 
              onClick={() => setActiveNode('T+0')}
              className={`p-2.5 rounded border transition-all cursor-pointer ${
                activeNode === 'T+0' ? 'bg-[#272a30] border-[#38bdf8]' : 'bg-[#1d2025] border-[#272a30]'
              }`}
            >
              <div className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">T+0 NOW</div>
              <div className="font-mono text-[15px] font-bold text-[#8ed5ff] mt-0.5">
                86.4 <span className="font-mono text-[11px] font-normal text-[#87929a]">µg/m³</span>
              </div>
              <div className="font-mono text-[11px] text-[#bdc8d1] mt-0.5">Risk 45.9 (Mod)</div>
            </div>

            <div 
              onClick={() => setActiveNode('T+12h')}
              className={`p-2.5 rounded border transition-all cursor-pointer ${
                activeNode === 'T+12h' ? 'bg-[#272a30] border-[#38bdf8]' : 'bg-[#1d2025] border-[#272a30]'
              }`}
            >
              <div className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">T+12h</div>
              <div className="font-mono text-[15px] font-bold text-[#e1e2ea] mt-0.5">
                82.0 <span className="font-mono text-[11px] font-normal text-[#87929a]">µg/m³</span>
              </div>
              <div className="font-mono text-[11px] text-[#bdc8d1] mt-0.5">Risk 43.8 (Mod)</div>
            </div>

            <div 
              onClick={() => setActiveNode('T+24h')}
              className={`p-2.5 rounded border shadow-sm transition-all cursor-pointer ${
                activeNode === 'T+24h' ? 'bg-[#272a30] border-[#ffb4ab]' : 'bg-[#272a30] border-[#ffb4ab]/60'
              }`}
            >
              <div className="font-mono text-[10px] text-[#ffb4ab] uppercase font-bold">T+24h [PEAK EVENT]</div>
              <div className="font-mono text-[15px] font-bold text-[#ffb4ab] mt-0.5">
                96.1 <span className="font-mono text-[11px] font-normal text-[#ffb4ab]">µg/m³</span>
              </div>
              <div className="font-mono text-[11px] text-[#ffb4ab] mt-0.5">Risk 52.4 (High)</div>
            </div>

            <div 
              onClick={() => setActiveNode('T+36h')}
              className={`p-2.5 rounded border transition-all cursor-pointer ${
                activeNode === 'T+36h' ? 'bg-[#272a30] border-[#38bdf8]' : 'bg-[#1d2025] border-[#272a30]'
              }`}
            >
              <div className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">T+36h</div>
              <div className="font-mono text-[15px] font-bold text-[#e1e2ea] mt-0.5">
                74.0 <span className="font-mono text-[11px] font-normal text-[#87929a]">µg/m³</span>
              </div>
              <div className="font-mono text-[11px] text-[#bdc8d1] mt-0.5">Risk 41.2 (Mod)</div>
            </div>

            <div 
              onClick={() => setActiveNode('T+48h')}
              className={`p-2.5 rounded border transition-all cursor-pointer ${
                activeNode === 'T+48h' ? 'bg-[#272a30] border-[#44e2cd]' : 'bg-[#1d2025] border-[#272a30]'
              }`}
            >
              <div className="font-mono text-[10px] text-[#44e2cd] uppercase font-semibold">T+48h ADVECTIVE</div>
              <div className="font-mono text-[15px] font-bold text-[#44e2cd] mt-0.5">
                58.3 <span className="font-mono text-[11px] font-normal text-[#87929a]">µg/m³</span>
              </div>
              <div className="font-mono text-[11px] text-[#44e2cd] mt-0.5">Risk 34.0 (Mod)</div>
            </div>
          </div>
        </div>

        {/* Covariate Influence Decomposition Panel (4 cols) */}
        <div className="xl:col-span-4 bg-[#191c21] p-4 rounded border border-[#272a30] flex flex-col justify-between shadow-md">
          <div className="flex flex-col pb-3 border-b border-[#272a30]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#44e2cd] text-[18px]">balance</span>
                <span className="font-sans text-[16px] font-bold text-[#e1e2ea]">
                  Ridge Feature Weights
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-[#32353b] text-[#44e2cd] uppercase font-semibold rounded border border-[#44e2cd]/30">
                L2 λ=0.042
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#bdc8d1] mt-1">
              Covariate Shapley/Ridge Attribution to Inversion Surge
            </span>
          </div>

          {/* Feature Bars List */}
          <div className="flex flex-col gap-4 my-auto py-3">
            {RIDGE_FEATURES.map((feat, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#e1e2ea] font-medium">{feat.name}</span>
                  <span className={feat.category === 'error' ? 'text-[#ffb4ab] font-bold' : (feat.category === 'secondary' ? 'text-[#44e2cd] font-bold' : 'text-[#8ed5ff] font-bold')}>
                    {feat.impact}
                  </span>
                </div>
                <div className="w-full h-2 rounded-xs bg-[#32353b] overflow-hidden">
                  <div
                    className={`h-full rounded-xs ${
                      feat.category === 'error' ? 'bg-[#ffb4ab]' : (feat.category === 'secondary' ? 'bg-[#44e2cd]' : 'bg-[#38bdf8]')
                    }`}
                    style={{ width: `${feat.weight}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-[#87929a] uppercase tracking-wider">
                  {feat.description}
                </span>
              </div>
            ))}
          </div>

          {/* Synthesis Diagnostics Card */}
          <div className="bg-[#1d2025] p-3 rounded border border-[#272a30] flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#87929a] uppercase font-semibold">
                COVARIATE CONVERGENCE
              </span>
              <span className="font-mono text-[11px] text-[#e1e2ea]">
                p-value &lt; 0.0001 (F-Stat 184.2)
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-[#44e2cd]/15 flex items-center justify-center border border-[#44e2cd]/30">
              <span className="material-symbols-outlined text-[#44e2cd] text-[18px]">check_circle</span>
            </div>
          </div>
        </div>
      </section>

      {/* Horizon Inspector & Hourly Prediction Ledger */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-3 mb-8">
        <div className="bg-[#191c21] p-4 rounded border border-[#272a30] shadow-md flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-3 border-b border-[#272a30]/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">table_chart</span>
                <h3 className="font-sans text-[16px] font-bold text-[#e1e2ea]">
                  Horizon Inspector & Hourly Ledger (T+0 to T+48)
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#bdc8d1]">
                Deterministic Autoregressive Projection Matrix with Ensemble Perturbations
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#87929a] uppercase font-semibold">EXPORT FORMAT:</span>
              {(['csv', 'json', 'parquet'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => handleExportFormatClick(fmt)}
                  className={`px-2.5 py-1 rounded font-mono text-[11px] uppercase transition-colors cursor-pointer border ${
                    selectedFormat === fmt
                      ? 'bg-[#32353b] text-[#8ed5ff] font-bold border-[#38bdf8]/50'
                      : 'bg-[#1d2025] text-[#bdc8d1] border-[#272a30] hover:bg-[#272a30]'
                  }`}
                >
                  {fmt === 'parquet' ? 'Parquet (Snappy)' : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone Information Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#151a24] px-3.5 py-2 rounded-lg border border-[#38bdf8]/30 my-2 gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px]">{stationTime.isNight ? '🌙' : '☀️'}</span>
              <span className="font-mono text-[11px] text-[#8ed5ff] font-bold uppercase tracking-wider">
                TIMETABLE SYNCHRONIZED:
              </span>
              <span className="font-mono text-[11px] text-white font-semibold">
                {station.region}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#38bdf8]/20 text-[#8ed5ff] border border-[#38bdf8]/30">
                {stationTime.timezone}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] flex-wrap">
              <span className="text-[#87929a]">TIMEZONE:</span>
              <span className="text-[#44e2cd] font-bold">{stationTime.timezoneAbbr || 'LOCAL'} ({stationTime.utcOffsetStr})</span>
              <span className="text-[#87929a]">|</span>
              <span className="text-[#87929a]">CURRENT CLOCK:</span>
              <span className="text-white font-bold">{stationTime.time12}</span>
            </div>
          </div>

          {/* Precision Data Table */}
          <div className="w-full overflow-x-auto mt-2">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#0b0e13] text-[#bdc8d1] uppercase text-[10px] border-b border-[#272a30]">
                  <th className="py-2.5 px-3">HORIZON</th>
                  <th className="py-2.5 px-3">LOCAL TIME ({stationTime.timezoneAbbr || 'LOCAL'})</th>
                  <th className="py-2.5 px-3">PM2.5 PREDICTED</th>
                  <th className="py-2.5 px-3">95% CONF INTERVAL</th>
                  <th className="py-2.5 px-3">TEMP (°C)</th>
                  <th className="py-2.5 px-3">HUMIDITY (%)</th>
                  <th className="py-2.5 px-3">WIND VECTOR</th>
                  <th className="py-2.5 px-3">PBL HEIGHT</th>
                  <th className="py-2.5 px-3 text-right">RISK ASSESSMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272a30]/50 text-[#e1e2ea]">
                {forecastData.map((row, index) => {
                  let rowBg = 'hover:bg-[#1d2025] transition-colors';
                  if (row.isCritical) rowBg = 'bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/15 transition-colors';
                  else if (row.isFrontArrival) rowBg = 'bg-[#44e2cd]/5 hover:bg-[#44e2cd]/10 transition-colors';
                  else if (row.isHighlight) rowBg = 'bg-[#191c21]/80 hover:bg-[#1d2025] transition-colors';

                  return (
                    <tr key={index} className={rowBg}>
                      <td className={`py-2 px-3 font-semibold ${row.isCritical ? 'text-[#ffb4ab] flex items-center gap-1' : (row.isFrontArrival ? 'text-[#44e2cd]' : (row.isHighlight ? 'text-[#8ed5ff]' : 'text-[#e1e2ea]'))}`}>
                        {row.isCritical && (
                          <span className="material-symbols-outlined text-[14px]">priority_high</span>
                        )}
                        <span>{row.horizon}</span>
                      </td>
                      <td className={`py-2 px-3 ${row.isCritical ? 'text-[#ffb4ab] font-medium' : 'text-[#87929a]'}`}>
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{row.localTimeFormatted || row.timestamp}</span>
                          <span className="text-[10px] text-[#87929a]">{row.localTimestamp || row.timestamp}</span>
                        </div>
                      </td>
                      <td className={`py-2 px-3 font-bold ${row.isCritical ? 'text-[#ffb4ab] text-[12px]' : (row.isFrontArrival ? 'text-[#44e2cd]' : 'text-white')}`}>
                        {row.pm25.toFixed(1)} µg/m³
                      </td>
                      <td className={`py-2 px-3 ${row.isCritical ? 'text-[#ffb4ab]' : 'text-[#87929a]'}`}>
                        [{row.ciLower.toFixed(1)} - {row.ciUpper.toFixed(1)}]
                      </td>
                      <td className={`py-2 px-3 ${row.isCritical ? 'text-[#ffb4ab]' : 'text-[#e1e2ea]'}`}>
                        {row.temp.toFixed(1)}°C
                      </td>
                      <td className={`py-2 px-3 ${row.isCritical ? 'text-[#ffb4ab]' : 'text-[#e1e2ea]'}`}>
                        {row.humidity}%
                      </td>
                      <td className={`py-2 px-3 flex items-center gap-1.5 ${row.isCritical ? 'text-[#ffb4ab]' : (row.isFrontArrival ? 'text-[#44e2cd]' : 'text-[#bdc8d1]')}`}>
                        {row.windAngle === 0 ? (
                          <span className="material-symbols-outlined text-[13px] text-[#ffb4ab]">clear</span>
                        ) : (
                          <span
                            className="material-symbols-outlined text-[13px]"
                            style={{ transform: `rotate(${row.windAngle}deg)` }}
                          >
                            north
                          </span>
                        )}
                        <span>{row.windVector}</span>
                      </td>
                      <td className={`py-2 px-3 font-medium ${row.isCritical ? 'text-[#ffb4ab] font-bold' : (row.isFrontArrival ? 'text-[#44e2cd]' : 'text-[#e1e2ea]')}`}>
                        {row.pblHeight.toLocaleString()} m {row.pblNote || ''}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {row.isCritical ? (
                          <span className="px-2 py-0.5 rounded bg-[#ffb4ab] text-[#690005] font-extrabold text-[10px] tracking-wide">
                            RISK {row.riskScore.toFixed(1)} • CRITICAL
                          </span>
                        ) : row.riskCategory === 'HIGH' ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-semibold text-[10px]">
                            RISK {row.riskScore.toFixed(1)} • HIGH
                          </span>
                        ) : row.riskCategory === 'ELEV' ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#93000a]/80 text-[#ffdad6] font-semibold text-[10px]">
                            RISK {row.riskScore.toFixed(1)} • ELEV
                          </span>
                        ) : row.riskCategory === 'NOMINAL' ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#44e2cd]/20 text-[#44e2cd] font-bold text-[10px]">
                            RISK {row.riskScore.toFixed(1)} • NOMINAL
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-[#32353b] text-[#e1e2ea] font-semibold text-[10px]">
                            RISK {row.riskScore.toFixed(1)} • MOD
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footnote Ledger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 mt-2 border-t border-[#272a30]/50 text-[#87929a] font-mono text-[11px] gap-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>DETERMINISTIC KERNEL: SHA-256 (3c81e9f4...2b01) Verified by WMO GAW Node</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Ensemble Spread Deviation σ = 7.21%</span>
              <span>•</span>
              <span className="text-[#8ed5ff]">Next Pipeline Run: 15:00:00 UTC</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
