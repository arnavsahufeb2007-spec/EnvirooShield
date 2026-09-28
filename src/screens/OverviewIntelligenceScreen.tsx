import React from 'react';
import { NavTab, StationData, HourlyForecastRow, UnitSystem } from '../types';
import { GlobalSearchBar } from '../components/GlobalSearchBar';
import { GlobalLocationSearchResult } from '../services/airQualityApi';
import { useStationTime } from '../utils/timezoneUtils';
import { CleanestWindowCard } from '../components/CleanestWindowCard';
import { ActivitySafetyMatrix } from '../components/ActivitySafetyMatrix';
import { DEMO_SCENARIOS, DemoScenario } from '../components/DemoScenariosModal';
import { HOURLY_FORECAST_DATA } from '../data/mockData';
import { calculateAQI, getAQICategory, formatTelemetryMetric } from '../utils/aqiUtils';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';

interface OverviewIntelligenceScreenProps {
  station: StationData;
  onNavigateTab: (tab: NavTab) => void;
  unitSystem?: UnitSystem;
  onSelectLocation?: (loc: GlobalLocationSearchResult) => void;
  isLoading?: boolean;
  hourlyForecast?: HourlyForecastRow[];
  onOpenCompare?: () => void;
  onOpenScenarios?: () => void;
}

export const OverviewIntelligenceScreen: React.FC<OverviewIntelligenceScreenProps> = ({
  station,
  onNavigateTab,
  unitSystem = 'standard',
  onSelectLocation,
  isLoading = false,
  hourlyForecast,
  onOpenCompare,
  onOpenScenarios
}) => {
  const stationTime = useStationTime(station);

  // Calculate AQI & category
  const aqi = calculateAQI(station.pm25);
  const aqiCategory = getAQICategory(aqi);

  // Active Forecast Data
  const forecastList: HourlyForecastRow[] =
    hourlyForecast && hourlyForecast.length > 0 ? hourlyForecast : HOURLY_FORECAST_DATA;

  const peakForecast =
    forecastList.reduce((prev, curr) => (curr.pm25 > prev.pm25 ? curr : prev), forecastList[0]);
  const reliefForecast = forecastList[forecastList.length - 1];

  // Metric formatters based on UnitSystem
  const pm25Metric = formatTelemetryMetric(station.pm25, 'pm25', unitSystem);
  const pm10Metric = formatTelemetryMetric(station.pm10, 'pm10', unitSystem);
  const pblMetric = formatTelemetryMetric(station.pblHeight, 'pblHeight', unitSystem);
  const windMetric = formatTelemetryMetric(station.windSpeedMS, 'wind', unitSystem);
  const pressureMetric = formatTelemetryMetric(station.pressure, 'pressure', unitSystem);
  const tempMetric = formatTelemetryMetric(station.dryTemp, 'temp', unitSystem);

  const cityNameClean = station.region.split('-')[0].trim();

  // Circular progress calculations for AQI
  const circumference = 2 * Math.PI * 46;
  const progressRatio = Math.min(1, Math.max(0, aqi / 300));
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6 relative">
      
      {/* 1. Global Search & Active Location Glass Ribbon */}
      <Card variant="elevated" className="p-4 sm:p-5 flex flex-col gap-4 animate-fade-in-up stagger-1">
        {onSelectLocation && (
          <GlobalSearchBar
            onSelectLocation={onSelectLocation}
            selectedCityName={station.name}
            isLoading={isLoading}
          />
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
          <div className="flex items-start sm:items-center gap-3">
            <span className="text-3xl sm:text-4xl drop-shadow-md">{station.flag || '🌍'}</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
                  {station.region}
                </h1>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                  {station.code}
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    Fetching Live Feeds...
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-slate-400 flex-wrap mt-0.5 font-mono">
                <span>{station.lat.toFixed(2)}°N, {station.lng.toFixed(2)}°E</span>
                <span>•</span>
                <span>Elevation: <strong className="text-slate-300 font-medium">{station.elevation}m ({station.elevation * 100} cm)</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-sans font-medium">Verified Weather Stream</span>
              </div>
            </div>
          </div>

          {/* Right Action Block: Dynamic Local City Time */}
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
            <div
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] text-[12px] shadow-xs"
              title={`Local time in ${station.region} (${stationTime.timezone})`}
            >
              <span className="text-xl">{stationTime.isNight ? '🌙' : '☀️'}</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  <span>Local Time</span>
                  <span>({stationTime.timezoneAbbr || stationTime.utcOffsetStr})</span>
                </div>
                <div className="text-[16px] font-bold text-white font-mono leading-tight mt-0.5">
                  {stationTime.time12}
                </div>
              </div>
            </div>

            {onOpenCompare && (
              <button
                type="button"
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-teal-400/50 text-teal-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_4px_14px_rgba(20,184,166,0.2)] text-[12px] font-medium cursor-pointer backdrop-blur-md shadow-xs"
                title="Compare this city with any other city side-by-side"
              >
                <span className="material-symbols-outlined text-[17px]">compare_arrows</span>
                <span>Compare</span>
              </button>
            )}
          </div>
        </div>

        {/* Demo Scenarios Ribbon */}
        <div className="pt-2.5 border-t border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-400 text-[12px] shrink-0 font-medium">
            <span className="material-symbols-outlined text-[16px] text-amber-400">science</span>
            <span>Atmospheric Presets:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {DEMO_SCENARIOS.map((sc: DemoScenario) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectLocation && onSelectLocation(sc.targetCity)}
                disabled={isLoading}
                className="px-3 py-1.2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-sky-400/40 hover:shadow-[0_4px_14px_rgba(56,189,248,0.2)] hover:-translate-y-0.5 hover:scale-105 text-slate-200 text-[11px] font-medium transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer backdrop-blur-md group"
                title={sc.subtitle}
              >
                <span className="group-hover:scale-110 transition-transform">{sc.flag}</span>
                <span className="font-semibold group-hover:text-sky-300 transition-colors">{sc.cityName.split('/')[0].trim()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${sc.bgColor} ${sc.color} border border-white/[0.06]`}>
                  {sc.expectedAqi.split('·')[0].trim()}
                </span>
              </button>
            ))}

            {onOpenScenarios && (
              <button
                type="button"
                onClick={onOpenScenarios}
                className="px-2.5 py-1 text-[11px] text-sky-400 hover:text-sky-300 hover:scale-105 font-semibold flex items-center gap-0.5 shrink-0 cursor-pointer transition-all"
              >
                <span>All Scenarios</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* 2. Hero Air Quality & Health Guidance Card with Animated Glow Ring */}
      <Card
        variant="elevated"
        className="p-5 sm:p-7 flex flex-col gap-6 relative overflow-hidden animate-fade-in-up stagger-2"
      >
        {/* Ambient Radial Glass Glow inside card */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-[90px] opacity-35 pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: aqiCategory.color }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Main Air Score & Circular Gauge (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 pr-0 lg:pr-6 lg:border-r border-white/[0.08]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: aqiCategory.color }}
                />
                Live Air Quality Status
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-md ${aqiCategory.bgColor} ${aqiCategory.textColor} ${aqiCategory.borderColor}`}
              >
                {aqiCategory.label}
              </span>
            </div>

            {/* Circular Gauge + Big Score */}
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                  {/* Background Track */}
                  <circle
                    cx="55"
                    cy="55"
                    r="46"
                    className="stroke-white/[0.08]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Animated Progress Arc */}
                  <circle
                    cx="55"
                    cy="55"
                    r="46"
                    stroke={aqiCategory.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Center Badge Icon */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]" style={{ color: aqiCategory.color }}>
                    air
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-[52px] sm:text-[60px] font-black text-white leading-none tracking-tight">
                    {aqi}
                  </span>
                  <span className="text-[14px] text-slate-400 font-medium">/ 500 AQI</span>
                </div>
                <span className="text-[12px] text-sky-400 font-mono mt-1">
                  {station.pm25.toFixed(1)} µg/m³ PM2.5 Mass
                </span>
                <span className="text-[11px] text-slate-400">
                  EPA Standard Index
                </span>
              </div>
            </div>

            {/* Spectrum Bar with Animated Needle */}
            <div className="flex flex-col gap-1.5">
              <div className="relative w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden flex border border-white/[0.08]">
                <div className="w-1/6 bg-emerald-500/80 h-full" title="0-50 Good" />
                <div className="w-1/6 bg-amber-500/80 h-full" title="51-100 Moderate" />
                <div className="w-1/6 bg-orange-500/80 h-full" title="101-150 Sensitive" />
                <div className="w-1/6 bg-rose-500/80 h-full" title="151-200 Unhealthy" />
                <div className="w-1/6 bg-purple-500/80 h-full" title="201-300 Very Unhealthy" />
                <div className="w-1/6 bg-rose-950 h-full" title="301-500 Hazardous" />

                {/* Pointer indicator */}
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] transform -translate-x-1/2 transition-all duration-700"
                  style={{ left: `${Math.min(98, Math.max(2, (aqi / 300) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0 Good</span>
                <span>50</span>
                <span>100</span>
                <span>150</span>
                <span>200</span>
                <span>300+</span>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-md p-3.5 rounded-xl border border-white/[0.08] flex flex-col gap-1">
              <span className="text-[13px] font-semibold text-white">
                {aqiCategory.advice}
              </span>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                {aqiCategory.healthImplications}
              </p>
            </div>
          </div>

          {/* Meteorological Reason & Plain-English Context (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-sky-400">cloud</span>
              <span className="text-[13px] font-semibold text-white">
                Atmospheric Dynamics Behind Today's Air in {cityNameClean}
              </span>
            </div>

            <div className="p-4 bg-white/[0.03] backdrop-blur-md rounded-xl border border-white/[0.08] flex items-start gap-3.5">
              <span className="material-symbols-outlined text-sky-400 text-[24px] shrink-0 mt-0.5">
                vertical_align_bottom
              </span>
              <div className="flex flex-col gap-1 text-[13px]">
                <span className="text-white font-semibold">
                  Thermal Boundary Layer Ceiling at {pblMetric.primary}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  The boundary layer ceiling acts like a lid over the basin. With ground surface winds at{' '}
                  <strong className="text-sky-300">{windMetric.primary} ({station.windDirection})</strong>,{' '}
                  {station.windSpeedMS < 2
                    ? 'particulates are stagnant and pooling close to street level.'
                    : 'air currents are actively assisting in horizontal dispersion.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex items-start gap-3">
                <span className="material-symbols-outlined text-teal-400 text-[20px] shrink-0 mt-0.5">
                  water_drop
                </span>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-white">
                    Moisture Swelling ({station.humidity}% RH)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {station.humidity > 65
                      ? 'High humidity causes dry soot particles to hygroscopically swell, worsening visible smog.'
                      : 'Moderate humidity keeps fine particles dry with crisp atmospheric clarity.'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-400 text-[20px] shrink-0 mt-0.5">
                  compress
                </span>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-white">
                    Barometric Pressure ({pressureMetric.primary})
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    {pressureMetric.context}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Card>

      {/* 3. Cleanest Outdoor Window of the Day */}
      <div className="animate-fade-in-up stagger-3">
        <CleanestWindowCard
          station={station}
          hourlyForecast={forecastList}
          onNavigateForecast={() => onNavigateTab('forecast-engine')}
        />
      </div>

      {/* 4. Activity & Health Safety Guidance */}
      <div className="animate-fade-in-up stagger-4">
        <ActivitySafetyMatrix station={station} />
      </div>

      {/* 5. Key Atmospheric Telemetry (6 Glass Metric Cards) */}
      <section className="flex flex-col gap-3 animate-fade-in-up stagger-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-400 text-[20px]">speed</span>
              Key Environmental Telemetry
            </h2>
            <p className="text-[12px] text-slate-400">
              Live physical measurements with dual {unitSystem === 'standard' ? 'Standard (AQI / SI)' : 'Scientific (CGS)'} unit support
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono self-start sm:self-center">
            Mode: <strong className="text-sky-400 uppercase">{unitSystem}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <MetricCard
            label={pm25Metric.label}
            icon="blur_on"
            primaryValue={pm25Metric.primary}
            secondaryValue={pm25Metric.secondary}
            contextText={pm25Metric.context}
            badgeText={station.pm25 < 35 ? 'Acceptable' : 'Elevated'}
            badgeVariant={station.pm25 < 35 ? 'good' : 'unhealthy'}
            className="hover:border-sky-400/40"
          />

          <MetricCard
            label={pm10Metric.label}
            icon="grain"
            primaryValue={pm10Metric.primary}
            secondaryValue={pm10Metric.secondary}
            contextText={pm10Metric.context}
            badgeText="Coarse Dust"
            badgeVariant="neutral"
            className="hover:border-teal-400/40"
          />

          <MetricCard
            label={pblMetric.label}
            icon="vertical_align_bottom"
            primaryValue={pblMetric.primary}
            secondaryValue={pblMetric.secondary}
            contextText={pblMetric.context}
            badgeText={station.pblHeight < 800 ? 'Inversion Cap' : 'Open Mixing'}
            badgeVariant={station.pblHeight < 800 ? 'sensitive' : 'good'}
            className="hover:border-amber-400/40"
          />

          <MetricCard
            label={windMetric.label}
            icon="air"
            primaryValue={windMetric.primary}
            secondaryValue={`Blowing ${station.windDirection} • ${windMetric.secondary}`}
            contextText={windMetric.context}
            badgeText={station.windSpeedMS < 2 ? 'Stagnant' : 'Brisk'}
            badgeVariant={station.windSpeedMS < 2 ? 'sensitive' : 'good'}
            className="hover:border-sky-400/40"
          />

          <MetricCard
            label={pressureMetric.label}
            icon="compress"
            primaryValue={pressureMetric.primary}
            secondaryValue={pressureMetric.secondary}
            contextText={pressureMetric.context}
            badgeText="Surface Level"
            badgeVariant="neutral"
            className="hover:border-slate-500"
          />

          <MetricCard
            label={tempMetric.label}
            icon="thermostat"
            primaryValue={tempMetric.primary}
            secondaryValue={`${station.humidity}% RH • Dew Point: ${station.wetTemp}°C`}
            contextText="Surface thermodynamics driving boundary layer expansion."
            badgeText={`${station.humidity}% Moisture`}
            badgeVariant="accent"
            className="hover:border-sky-400/40"
          />
        </div>
      </section>

      {/* 6. 48-Hour Forecast Teaser & Timeline with Shimmer SVG */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-400 text-[20px]">timeline</span>
              <h2 className="text-[18px] font-bold text-white tracking-tight">
                48-Hour Forecast Trajectory
              </h2>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Projected particulate levels, boundary layer compression, and clearing front timeline
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('forecast-engine')}
            className="px-3.5 py-1.5 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-bold text-[12px] rounded-xl transition-all duration-200 flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-[0_2px_12px_rgba(56,189,248,0.35)] hover:shadow-[0_4px_20px_rgba(56,189,248,0.5)] hover:-translate-y-0.5"
          >
            <span>Detailed Forecast Engine</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* 3 Step Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col gap-2 hover:border-white/[0.18] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-sky-400 px-2 py-0.5 rounded-full bg-sky-500/10 font-mono">
                Now • T+0h
              </span>
              <span className="text-[11px] font-mono text-slate-400">{station.pm25.toFixed(1)} µg/m³</span>
            </div>
            <span className="text-[14px] font-semibold text-white">
              Current Baseline: AQI {aqi} ({aqiCategory.label})
            </span>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Thermal ceiling holding at {station.pblHeight}m with surface winds at {station.windSpeedMS} m/s.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 backdrop-blur-md border border-rose-500/30 flex flex-col gap-2 hover:border-rose-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-rose-400 px-2 py-0.5 rounded-full bg-rose-500/15 font-mono">
                Peak Smog Spike • {peakForecast.localTimeFormatted || peakForecast.horizon}
              </span>
              <span className="text-[11px] font-mono text-rose-300">{peakForecast.pm25} µg/m³</span>
            </div>
            <span className="text-[14px] font-semibold text-rose-200">
              Projected Maximum Accumulation
            </span>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Inversion ceiling compresses down to {peakForecast.pblHeight}m while surface winds slow down, causing smog buildup.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 backdrop-blur-md border border-emerald-500/30 flex flex-col gap-2 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 font-mono">
                Clearing Front • {reliefForecast.localTimeFormatted || reliefForecast.horizon}
              </span>
              <span className="text-[11px] font-mono text-emerald-300">{reliefForecast.pm25} µg/m³</span>
            </div>
            <span className="text-[14px] font-semibold text-emerald-200">
              Fresh Air Dispersal
            </span>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Atmospheric mixing expands to {reliefForecast.pblHeight}m with brisk dispersion winds clearing the air.
            </p>
          </div>
        </div>

        {/* Clean Forecast Line Chart with Gradient and Pulsing Nodes */}
        <div className="bg-[#070a12]/80 backdrop-blur-md p-4 rounded-xl border border-white/[0.08] flex flex-col gap-2">
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>48-HOUR PM2.5 CONCENTRATION TREND (µg/m³)</span>
            <span className="text-sky-400 font-semibold">Clearing front at T+48h</span>
          </div>

          <div className="w-full h-24 relative">
            <svg className="w-full h-full" viewBox="0 0 500 100" fill="none" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

              <defs>
                <linearGradient id="forecastGradGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d="M 0 50 Q 80 48, 150 40 T 250 18 T 350 55 T 500 80 L 500 100 L 0 100 Z"
                fill="url(#forecastGradGlass)"
              />
              <path
                d="M 0 50 Q 80 48, 150 40 T 250 18 T 350 55 T 500 80"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <circle cx="0" cy="50" r="4.5" fill="#10b981" className="shadow-lg" />
              <circle cx="250" cy="18" r="5.5" fill="#ef4444" className="animate-pulse" />
              <circle cx="500" cy="80" r="4.5" fill="#10b981" />
            </svg>
          </div>

          <div className="flex justify-between items-center font-mono text-[10px] text-slate-400">
            <span>Now: {station.pm25.toFixed(1)} µg/m³</span>
            <span className="text-rose-400 font-semibold">Peak: {peakForecast.pm25} µg/m³</span>
            <span className="text-emerald-400 font-semibold">Clearing: {reliefForecast.pm25} µg/m³</span>
          </div>
        </div>
      </Card>

      {/* 7. Explore Platform Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <button
          type="button"
          onClick={() => onNavigateTab('forecast-engine')}
          className="p-4 bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] hover:border-sky-400/40 rounded-2xl flex flex-col text-left transition-all duration-300 cursor-pointer group shadow-sm hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
            <span className="material-symbols-outlined text-[20px]">timeline</span>
          </div>
          <span className="text-[14px] font-semibold text-white group-hover:text-sky-300 transition-colors">
            48-Hour Forecast Engine
          </span>
          <span className="text-[12px] text-slate-400 mt-1 leading-relaxed">
            Hour-by-hour boundary layer evolution, confidence intervals, and wind trajectories.
          </span>
          <span className="text-[11px] text-sky-400 font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Open Timeline</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('geospatial-grid-stations')}
          className="p-4 bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] hover:border-teal-400/40 rounded-2xl flex flex-col text-left transition-all duration-300 cursor-pointer group shadow-sm hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all">
            <span className="material-symbols-outlined text-[20px]">public</span>
          </div>
          <span className="text-[14px] font-semibold text-white group-hover:text-teal-300 transition-colors">
            Interactive World Map
          </span>
          <span className="text-[12px] text-slate-400 mt-1 leading-relaxed">
            Cartographic view of global air quality stations with wind streams and dispersion.
          </span>
          <span className="text-[11px] text-teal-400 font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore Map</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('explainable-risk-provenance')}
          className="p-4 bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-xl border border-white/[0.08] hover:border-amber-400/40 rounded-2xl flex flex-col text-left transition-all duration-300 cursor-pointer group shadow-sm hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <span className="text-[14px] font-semibold text-white group-hover:text-amber-300 transition-colors">
            Science & Methodology
          </span>
          <span className="text-[12px] text-slate-400 mt-1 leading-relaxed">
            Transparent physical equations, WHO guideline comparisons, and verifiable data provenance.
          </span>
          <span className="text-[11px] text-amber-400 font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Science</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </span>
        </button>
      </div>

    </div>
  );
};
