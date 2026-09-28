import React, { useState } from 'react';
import { NavTab, StationData, HourlyForecastRow } from '../types';
import {
  formatPM_CGS,
  formatPressure_CGS,
  formatWind_CGS,
  formatHeight_CGS,
  getOverallRiskContext
} from '../utils/cgsUtils';
import { GlobalSearchBar } from '../components/GlobalSearchBar';
import { GlobalLocationSearchResult, PRESET_WORLD_CITIES } from '../services/airQualityApi';
import { useStationTime } from '../utils/timezoneUtils';
import { CleanestWindowCard } from '../components/CleanestWindowCard';
import { ActivitySafetyMatrix } from '../components/ActivitySafetyMatrix';
import { DEMO_SCENARIOS } from '../components/DemoScenariosModal';
import { HOURLY_FORECAST_DATA } from '../data/mockData';

interface OverviewIntelligenceScreenProps {
  station: StationData;
  onNavigateTab: (tab: NavTab) => void;
  simpleMode?: boolean;
  onSelectLocation?: (loc: GlobalLocationSearchResult) => void;
  isLoading?: boolean;
  hourlyForecast?: HourlyForecastRow[];
  onOpenCompare?: () => void;
  onOpenScenarios?: () => void;
}

export const OverviewIntelligenceScreen: React.FC<OverviewIntelligenceScreenProps> = ({
  station,
  onNavigateTab,
  simpleMode = true,
  onSelectLocation,
  isLoading = false,
  hourlyForecast,
  onOpenCompare,
  onOpenScenarios
}) => {
  // Live Clock synchronized with Active City Timezone
  const stationTime = useStationTime(station);

  // CGS Unit Conversions & Context
  const pm25CGS = formatPM_CGS(station.pm25, 'PM2.5');
  const pm10CGS = formatPM_CGS(station.pm10, 'PM10');
  const pressureCGS = formatPressure_CGS(station.pressure);
  const windCGS = formatWind_CGS(station.windSpeedMS, station.windDirection);
  const heightCGS = formatHeight_CGS(station.pblHeight);
  const elevationCGS = `${(station.elevation * 100).toLocaleString()} cm`;

  // Health and Risk plain-English contextual synthesis
  const riskContext = getOverallRiskContext(station.riskScore, station.region.split('-')[0].trim());

  // Active Forecast Data
  const forecastList: HourlyForecastRow[] = hourlyForecast && hourlyForecast.length > 0
    ? hourlyForecast
    : HOURLY_FORECAST_DATA;

  const peakForecast = forecastList.find((f) => f.horizon.includes('PEAK') || f.horizon.includes('24h')) || forecastList[2];
  const reliefForecast = forecastList[forecastList.length - 1];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
      
      {/* 1. WORLDWIDE SEARCH & ACTIVE LOCATION BAR */}
      <section className="bg-[#151922] border border-[#272a30] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col gap-4">
        {onSelectLocation && (
          <GlobalSearchBar
            onSelectLocation={onSelectLocation}
            selectedCityName={station.name}
            isLoading={isLoading}
          />
        )}

        {/* Selected City Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-[#272a30]">
          <div className="flex items-start sm:items-center gap-3">
            <span className="text-3xl sm:text-4xl drop-shadow">{station.flag || '🌍'}</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-sans text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
                  {station.region}
                </h1>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#38bdf8]/15 text-[#8ed5ff] border border-[#38bdf8]/30">
                  {station.code}
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1 font-mono text-[11px] text-[#44e2cd] animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#44e2cd]"></span>
                    FETCHING LIVE GLOBAL FEED...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[12px] font-mono text-[#87929a] flex-wrap mt-0.5">
                <span>Coordinates: {station.lat.toFixed(2)}°N, {station.lng.toFixed(2)}°E</span>
                <span>•</span>
                <span>Altitude: <strong className="text-[#cbd5e1]">{elevationCGS} ({station.elevation}m)</strong></span>
                <span>•</span>
                <span className="text-[#44e2cd] font-semibold">Continuous Global Sync</span>
              </div>
            </div>
          </div>

          {/* Right Action Block: Dynamic Local City Time & CGS Badges */}
          <div className="flex items-center gap-3 flex-wrap self-start md:self-center">
            {/* Dynamic Local City Time & Timezone Card */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#16202c] border border-[#38bdf8]/40 shadow-md">
              <span className="text-2xl">{stationTime.isNight ? '🌙' : '☀️'}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#8ed5ff] tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#44e2cd] animate-pulse"></span>
                    LOCAL TIME ({stationTime.timezoneAbbr || stationTime.utcOffsetStr})
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#38bdf8]/20 text-[#8ed5ff] font-semibold">
                    {stationTime.dayPeriod}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono text-[18px] sm:text-[20px] font-extrabold text-white tracking-tight">
                    {stationTime.time12}
                  </span>
                  <span className="font-mono text-[11px] text-[#87929a]">
                    ({stationTime.time24})
                  </span>
                </div>
                <span className="font-sans text-[11px] text-[#cbd5e1] flex items-center gap-1.5">
                  <span>{stationTime.dateStr}</span>
                  <span className="text-[#87929a]">•</span>
                  <span className="font-mono text-[10px] text-[#38bdf8] font-bold">{stationTime.timezone}</span>
                </span>
              </div>
            </div>

            {/* CGS Standard Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a202c] border border-[#38bdf8]/30 shrink-0">
              <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">straighten</span>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase font-bold text-[#8ed5ff] tracking-wider">
                  CGS UNIT STANDARD
                </span>
                <span className="font-mono text-[11px] text-[#e2e8f0]">
                  g/cm³ • dyn/cm² • cm/s
                </span>
              </div>
            </div>

            {/* Compare City Button */}
            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#16202c] hover:bg-[#1f2c3d] border border-[#44e2cd]/40 text-[#44e2cd] hover:text-white transition-all font-sans text-[12px] font-bold shadow-md cursor-pointer shrink-0"
                title="Compare this city with any other city side-by-side"
              >
                <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                <span>Compare City</span>
              </button>
            )}
          </div>
        </div>

        {/* Evaluator Quick Demo Scenarios Ribbon */}
        <div className="pt-2 border-t border-[#272a30] flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">science</span>
            <span className="font-mono text-[11px] font-bold text-[#8ed5ff] uppercase tracking-wider">
              EVALUATOR DEMO SCENARIOS:
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
            {DEMO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSelectLocation && onSelectLocation(sc.targetCity)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-[#161a24] hover:bg-[#202736] border border-[#2d3442] hover:border-[#38bdf8]/50 text-white font-sans text-[11px] font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                title={sc.subtitle}
              >
                <span>{sc.flag}</span>
                <span className="font-bold">{sc.cityName.split('/')[0].trim()}</span>
                <span className={`font-mono text-[9px] font-bold px-1 rounded ${sc.bgColor} ${sc.color}`}>
                  {sc.expectedAqi.split('·')[0].trim()}
                </span>
              </button>
            ))}

            {onOpenScenarios && (
              <button
                onClick={onOpenScenarios}
                className="px-2 py-1 text-[11px] text-[#38bdf8] hover:text-[#8ed5ff] font-sans font-bold flex items-center gap-0.5 shrink-0 cursor-pointer"
              >
                <span>View Details</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. SIMPLE, UNCLUTTERED AIR QUALITY STATUS & HEALTH GUIDANCE */}
      <section className="bg-[#151922] border border-[#272a30] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Air Score & Health Gauge (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 pr-0 lg:pr-4 lg:border-r border-[#272a30]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-[#87929a] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#44e2cd]"></span>
                CURRENT AIR QUALITY STATUS
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold border ${riskContext.badge.bg} ${riskContext.badge.color} ${riskContext.badge.border}`}>
                {riskContext.badge.text}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-sans text-[52px] sm:text-[60px] font-black text-white leading-none tracking-tight">
                {station.riskScore}
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-[18px] text-[#87929a] font-medium">/ 100</span>
                <span className="font-sans text-[12px] text-[#8ed5ff] font-semibold">Physical Risk Index</span>
              </div>
            </div>

            {/* Visual Risk Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="relative w-full h-3 bg-[#0d1017] rounded-full overflow-hidden flex border border-[#272a30]">
                <div className="w-1/4 bg-[#44e2cd]/60 h-full" title="0-25 Low Risk" />
                <div className="w-1/4 bg-[#38bdf8]/60 h-full" title="25-50 Moderate" />
                <div className="w-1/4 bg-[#fbbf24]/60 h-full" title="50-75 High" />
                <div className="w-1/4 bg-[#ffb4ab]/80 h-full" title="75-100 Critical" />
                
                {/* Pointer indicator */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${Math.min(98, Math.max(2, station.riskScore))}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-[#87929a]">
                <span>0 Clean</span>
                <span>25 Moderate</span>
                <span>50 Elevated</span>
                <span>75 High</span>
                <span>100 Critical</span>
              </div>
            </div>

            <div className="bg-[#1a202c] p-3 rounded-xl border border-[#2d3748] flex flex-col gap-1">
              <span className="font-sans text-[13px] font-bold text-white">
                {riskContext.headline}
              </span>
              <p className="font-sans text-[12px] text-[#cbd5e1] leading-relaxed">
                {riskContext.description}
              </p>
            </div>
          </div>

          {/* Plain-English Practical Health Guidance (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <span className="font-mono text-[11px] font-bold text-[#87929a] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">health_and_safety</span>
              PRACTICAL HEALTH RECOMMENDATIONS TODAY
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {riskContext.actionItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#191e28] border border-[#272a30] flex items-start gap-3 hover:border-[#38bdf8]/40 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.allowed ? 'bg-[#44e2cd]/15 text-[#44e2cd]' : 'bg-[#ffb4ab]/15 text-[#ffb4ab]'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[13px] font-bold text-white">
                      {item.title}
                    </span>
                    <span className="font-sans text-[11px] text-[#cbd5e1] mt-0.5 leading-snug">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Plain English Weather Context */}
            <div className="p-3 bg-[#131b26] rounded-xl border border-[#38bdf8]/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#38bdf8] text-[22px] shrink-0">wb_cloudy</span>
              <div className="flex flex-col text-[12px]">
                <span className="text-white font-semibold">
                  Why is the air like this in {station.region.split('-')[0].trim()}?
                </span>
                <span className="text-[#cbd5e1]">
                  A <strong>thermal inversion ceiling at {heightCGS.cgsFormatted}</strong> acts like a pot lid over the city, while slow wind speeds (<strong>{windCGS.cgsFormatted}</strong>) prevent smoke from dispersing.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2B. CLEANEST WINDOW OF THE DAY (BEST OUTDOOR HOUR) */}
      <CleanestWindowCard
        station={station}
        hourlyForecast={forecastList}
        onNavigateForecast={() => onNavigateTab('forecast-engine')}
      />

      {/* 2C. DETAILED ACTIVITY SAFETY MATRIX */}
      <ActivitySafetyMatrix station={station} />

      {/* 3. ESSENTIAL MEASUREMENTS IN CGS UNITS WITH DIRECT CONTEXT */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="font-sans text-[18px] sm:text-[20px] font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">bar_chart</span>
              Key Environmental Measurements (CGS Units)
            </h2>
            <p className="font-sans text-[12px] text-[#87929a]">
              All particulate mass densities, pressures, and velocities measured in physical CGS standard with real-world health contexts.
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#44e2cd] bg-[#44e2cd]/10 px-2.5 py-1 rounded-md border border-[#44e2cd]/30 self-start sm:self-center font-bold">
            STANDARD CGS UNITS: g/cm³ • dyn/cm² • cm/s
          </span>
        </div>

        {/* 6 Clean Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          
          {/* Card 1: PM2.5 */}
          <div className="bg-[#151922] border border-[#272a30] hover:border-[#38bdf8]/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow transition-all">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#8ed5ff] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">blur_on</span>
                  PM2.5 Mass Density
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${pm25CGS.statusBadge.bg} ${pm25CGS.statusBadge.color} ${pm25CGS.statusBadge.border}`}>
                  {pm25CGS.statusBadge.label}
                </span>
              </div>
              
              {/* Primary CGS Value */}
              <div className="flex flex-col mt-1">
                <span className="font-mono text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  {pm25CGS.scientificNotation}
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">
                  SI Equivalent: <strong className="text-[#e2e8f0]">{pm25CGS.siEquiv}</strong>
                </span>
              </div>
            </div>

            {/* Context Box */}
            <div className="bg-[#1a202c] p-2.5 rounded-lg border border-[#2d3748] flex flex-col gap-1">
              <span className="font-sans text-[11px] font-bold text-[#8ed5ff] uppercase">
                What this means:
              </span>
              <p className="font-sans text-[11px] text-[#cbd5e1] leading-relaxed">
                {pm25CGS.context}
              </p>
            </div>
          </div>

          {/* Card 2: PM10 */}
          <div className="bg-[#151922] border border-[#272a30] hover:border-[#38bdf8]/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow transition-all">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#8ed5ff] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">grain</span>
                  PM10 Coarse Particulate
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1f2633] text-[#cbd5e1] border border-[#2d3748]">
                  COARSE DUST
                </span>
              </div>
              
              {/* Primary CGS Value */}
              <div className="flex flex-col mt-1">
                <span className="font-mono text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  {pm10CGS.scientificNotation}
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">
                  SI Equivalent: <strong className="text-[#e2e8f0]">{pm10CGS.siEquiv}</strong>
                </span>
              </div>
            </div>

            {/* Context Box */}
            <div className="bg-[#1a202c] p-2.5 rounded-lg border border-[#2d3748] flex flex-col gap-1">
              <span className="font-sans text-[11px] font-bold text-[#8ed5ff] uppercase">
                What this means:
              </span>
              <p className="font-sans text-[11px] text-[#cbd5e1] leading-relaxed">
                Coarse dust from roads, construction, and soil. Causes eye burning, coughing, and throat dryness.
              </p>
            </div>
          </div>

          {/* Card 3: Atmospheric Pressure */}
          <div className="bg-[#151922] border border-[#272a30] hover:border-[#38bdf8]/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow transition-all">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#8ed5ff] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">compress</span>
                  Atmospheric Pressure
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${pressureCGS.statusBadge.bg} ${pressureCGS.statusBadge.color} ${pressureCGS.statusBadge.border}`}>
                  {pressureCGS.statusBadge.label}
                </span>
              </div>
              
              {/* Primary CGS Value */}
              <div className="flex flex-col mt-1">
                <span className="font-mono text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  {pressureCGS.cgsFormatted}
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">
                  CGS Barye: <strong className="text-[#e2e8f0]">{pressureCGS.cgsValue.toLocaleString()} Ba</strong> ({pressureCGS.siEquiv})
                </span>
              </div>
            </div>

            {/* Context Box */}
            <div className="bg-[#1a202c] p-2.5 rounded-lg border border-[#2d3748] flex flex-col gap-1">
              <span className="font-sans text-[11px] font-bold text-[#8ed5ff] uppercase">
                What this means:
              </span>
              <p className="font-sans text-[11px] text-[#cbd5e1] leading-relaxed">
                {pressureCGS.context} Standard sea level is ~1.013 × 10⁶ dyn/cm².
              </p>
            </div>
          </div>

          {/* Card 4: Surface Wind Speed */}
          <div className="bg-[#151922] border border-[#272a30] hover:border-[#38bdf8]/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow transition-all">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#8ed5ff] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">air</span>
                  Wind Velocity & Direction
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${windCGS.statusBadge.bg} ${windCGS.statusBadge.color} ${windCGS.statusBadge.border}`}>
                  {windCGS.statusBadge.label}
                </span>
              </div>
              
              {/* Primary CGS Value */}
              <div className="flex flex-col mt-1">
                <span className="font-mono text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  {windCGS.cgsFormatted}
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">
                  Blowing <strong className="text-[#44e2cd]">{station.windDirection}</strong> • {windCGS.siEquiv}
                </span>
              </div>
            </div>

            {/* Context Box */}
            <div className="bg-[#1a202c] p-2.5 rounded-lg border border-[#2d3748] flex flex-col gap-1">
              <span className="font-sans text-[11px] font-bold text-[#8ed5ff] uppercase">
                What this means:
              </span>
              <p className="font-sans text-[11px] text-[#cbd5e1] leading-relaxed">
                {windCGS.context} Speeds under 150 cm/s cause pollutants to pool directly over roadways.
              </p>
            </div>
          </div>

          {/* Card 5: Inversion Ceiling (PBL Height) */}
          <div className="bg-[#151922] border border-[#272a30] hover:border-[#38bdf8]/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow transition-all">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#8ed5ff] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">vertical_align_bottom</span>
                  Inversion Ceiling (PBL)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${heightCGS.statusBadge.bg} ${heightCGS.statusBadge.color} ${heightCGS.statusBadge.border}`}>
                  {heightCGS.statusBadge.label}
                </span>
              </div>
              
              {/* Primary CGS Value */}
              <div className="flex flex-col mt-1">
                <span className="font-mono text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  {heightCGS.cgsFormatted}
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">
                  Ceiling Altitude: <strong className="text-[#e2e8f0]">{heightCGS.siEquiv}</strong>
                </span>
              </div>
            </div>

            {/* Context Box */}
            <div className="bg-[#1a202c] p-2.5 rounded-lg border border-[#2d3748] flex flex-col gap-1">
              <span className="font-sans text-[11px] font-bold text-[#8ed5ff] uppercase">
                What this means:
              </span>
              <p className="font-sans text-[11px] text-[#cbd5e1] leading-relaxed">
                {heightCGS.context}
              </p>
            </div>
          </div>

          {/* Card 6: Temperature & Humidity */}
          <div className="bg-[#151922] border border-[#272a30] hover:border-[#38bdf8]/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow transition-all">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#8ed5ff] uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">thermostat</span>
                  Temperature & Moisture
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1f2633] text-[#44e2cd] border border-[#2d3748]">
                  {station.humidity}% RH
                </span>
              </div>
              
              {/* Primary CGS Value */}
              <div className="flex flex-col mt-1">
                <span className="font-mono text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
                  {station.dryTemp} °C <span className="text-[14px] text-[#87929a]">({(station.dryTemp + 273.15).toFixed(1)} K)</span>
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">
                  Dew Point: <strong className="text-[#e2e8f0]">{station.wetTemp} °C</strong> • AOD: {station.opticalDepthAOD}
                </span>
              </div>
            </div>

            {/* Context Box */}
            <div className="bg-[#1a202c] p-2.5 rounded-lg border border-[#2d3748] flex flex-col gap-1">
              <span className="font-sans text-[11px] font-bold text-[#8ed5ff] uppercase">
                What this means:
              </span>
              <p className="font-sans text-[11px] text-[#cbd5e1] leading-relaxed">
                When humidity is above 65%, microscopic dry soot particles absorb water and swell in size, creating dense gray haze and reducing visibility.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SIMPLE 48-HOUR FORECAST & CLEAR MILESTONES */}
      <section className="bg-[#151922] border border-[#272a30] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">timeline</span>
              <h2 className="font-sans text-[18px] sm:text-[20px] font-bold text-white tracking-tight">
                48-Hour Plain-English Forecast
              </h2>
            </div>
            <p className="font-sans text-[12px] text-[#87929a] mt-0.5">
              Predicted smog trajectories, thermal inversion changes, and when the air will clear up.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('forecast-engine')}
            className="px-3.5 py-1.5 bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#00354a] font-sans text-[12px] font-bold rounded-lg transition-colors shadow flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <span>Detailed 48h Engine</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* 3 Step Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Step 1: Right Now */}
          <div className="p-4 rounded-xl bg-[#191e28] border border-[#272a30] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#44e2cd] tracking-wider px-2 py-0.5 rounded bg-[#44e2cd]/15">
                MILESTONE 1 • NOW
              </span>
              <span className="font-mono text-[11px] text-[#87929a]">T+0 hrs</span>
            </div>
            <span className="font-sans text-[15px] font-bold text-white">
              Current Baseline: {pm25CGS.scientificNotation}
            </span>
            <p className="font-sans text-[12px] text-[#cbd5e1] leading-relaxed">
              Air is currently {station.riskLabel.toLowerCase()}. Thermal inversion lid is holding at {heightCGS.cgsFormatted}.
            </p>
          </div>

          {/* Step 2: Peak Smog Event */}
          <div className="p-4 rounded-xl bg-[#191e28] border border-[#ffb4ab]/40 bg-[#93000a]/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#ffb4ab] tracking-wider px-2 py-0.5 rounded bg-[#ffb4ab]/20">
                MILESTONE 2 • PEAK SMOG SPIKE
              </span>
              <span className="font-mono text-[11px] text-[#ffb4ab]">T+24 hrs</span>
            </div>
            <span className="font-sans text-[15px] font-bold text-white">
              Tomorrow Afternoon: {formatPM_CGS(peakForecast?.pm25 || 96.1).scientificNotation}
            </span>
            <p className="font-sans text-[12px] text-[#ffdad6] leading-relaxed">
              ⚠️ Inversion ceiling compresses down to 31,000 cm while surface winds fall to near zero (30 cm/s). Smog will peak.
            </p>
          </div>

          {/* Step 3: Fresh Air Relief */}
          <div className="p-4 rounded-xl bg-[#191e28] border border-[#44e2cd]/40 bg-[#44e2cd]/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#44e2cd] tracking-wider px-2 py-0.5 rounded bg-[#44e2cd]/20">
                MILESTONE 3 • FRESH AIR RELIEF
              </span>
              <span className="font-mono text-[11px] text-[#44e2cd]">T+48 hrs</span>
            </div>
            <span className="font-sans text-[15px] font-bold text-white">
              In 48 Hours: {formatPM_CGS(reliefForecast?.pm25 || 58.3).scientificNotation}
            </span>
            <p className="font-sans text-[12px] text-[#cbd5e1] leading-relaxed">
              🌬️ A fast atmospheric clearing front arrives with brisk winds (540 cm/s), lifting the ceiling to 134,000 cm and clearing the air.
            </p>
          </div>
        </div>

        {/* Clean Simplified Forecast Line SVG */}
        <div className="bg-[#0e1218] p-4 rounded-xl border border-[#272a30] flex flex-col gap-2">
          <div className="flex justify-between items-center text-[11px] font-mono text-[#87929a]">
            <span>PREDICTED PM2.5 MASS DENSITY (CGS: g/cm³) OVER 48 HOURS</span>
            <span className="text-[#38bdf8]">Clean Wind Clears Air at T+48h</span>
          </div>

          <div className="w-full h-28 relative">
            <svg className="w-full h-full" viewBox="0 0 500 100" fill="none" preserveAspectRatio="none">
              {/* Guide lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#272a30" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#272a30" strokeDasharray="3 3" />
              
              {/* Gradient fill */}
              <defs>
                <linearGradient id="forecastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d="M 0 50 Q 80 48, 150 40 T 250 18 T 350 55 T 500 80 L 500 100 L 0 100 Z"
                fill="url(#forecastGrad)"
              />
              <path
                d="M 0 50 Q 80 48, 150 40 T 250 18 T 350 55 T 500 80"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Milestones */}
              <circle cx="0" cy="50" r="4" fill="#44e2cd" />
              <circle cx="250" cy="18" r="5" fill="#ffb4ab" className="animate-pulse" />
              <circle cx="500" cy="80" r="4" fill="#44e2cd" />
            </svg>
          </div>

          <div className="flex justify-between items-center font-mono text-[10px] text-[#87929a]">
            <span>Now (T+0): {pm25CGS.cgsFormatted}</span>
            <span className="text-[#ffb4ab] font-bold">Tomorrow Peak: ~9.61 × 10⁻¹¹ g/cm³</span>
            <span className="text-[#44e2cd] font-bold">48h Clean: ~5.83 × 10⁻¹¹ g/cm³</span>
          </div>
        </div>
      </section>

      {/* 5. CLEAN GATEWAY TO ADVANCED TOOLS */}
      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-[18px] sm:text-[20px] font-bold text-white tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">explore</span>
          Explore Deeper Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1 */}
          <button
            onClick={() => onNavigateTab('live-telemetry-sounding')}
            className="p-4 bg-[#151922] hover:bg-[#1a202c] border border-[#272a30] hover:border-[#38bdf8]/60 rounded-xl flex flex-col text-left transition-all shadow cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">sensors</span>
            </div>
            <span className="font-sans text-[14px] font-bold text-white group-hover:text-[#38bdf8] transition-colors">
              Live Sensors & Sounding
            </span>
            <span className="font-sans text-[11px] text-[#87929a] mt-1 leading-snug">
              Atmospheric chamber simulation, optical spectrometry, and lidar profiles.
            </span>
            <span className="font-sans text-[11px] text-[#8ed5ff] font-bold mt-3">
              Open Live Sensors →
            </span>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => onNavigateTab('forecast-engine')}
            className="p-4 bg-[#151922] hover:bg-[#1a202c] border border-[#272a30] hover:border-[#44e2cd]/60 rounded-xl flex flex-col text-left transition-all shadow cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#44e2cd]/15 text-[#44e2cd] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">timeline</span>
            </div>
            <span className="font-sans text-[14px] font-bold text-white group-hover:text-[#44e2cd] transition-colors">
              48-Hour Forecast Engine
            </span>
            <span className="font-sans text-[11px] text-[#87929a] mt-1 leading-snug">
              Hour-by-hour confidence intervals, weather models, and parameter tuning.
            </span>
            <span className="font-sans text-[11px] text-[#44e2cd] font-bold mt-3">
              Open Forecast Engine →
            </span>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => onNavigateTab('geospatial-grid-stations')}
            className="p-4 bg-[#151922] hover:bg-[#1a202c] border border-[#272a30] hover:border-[#8ed5ff]/60 rounded-xl flex flex-col text-left transition-all shadow cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#8ed5ff]/15 text-[#8ed5ff] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <span className="font-sans text-[14px] font-bold text-white group-hover:text-[#8ed5ff] transition-colors">
              Worldwide City Map
            </span>
            <span className="font-sans text-[11px] text-[#87929a] mt-1 leading-snug">
              Compare regional air quality across cities worldwide with spatial dispersion.
            </span>
            <span className="font-sans text-[11px] text-[#8ed5ff] font-bold mt-3">
              Open City Map →
            </span>
          </button>

          {/* Card 4 */}
          <button
            onClick={() => onNavigateTab('explainable-risk-provenance')}
            className="p-4 bg-[#151922] hover:bg-[#1a202c] border border-[#272a30] hover:border-[#38bdf8]/60 rounded-xl flex flex-col text-left transition-all shadow cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <span className="font-sans text-[14px] font-bold text-white group-hover:text-[#38bdf8] transition-colors">
              Why Trust Us (Math & Audit)
            </span>
            <span className="font-sans text-[11px] text-[#87929a] mt-1 leading-snug">
              Step-by-step formula math, zero black box AI, and sensor calibration curves.
            </span>
            <span className="font-sans text-[11px] text-[#38bdf8] font-bold mt-3">
              Verify Math →
            </span>
          </button>
        </div>
      </section>

    </div>
  );
};
