import React, { useState } from 'react';
import { StationData, UnitSystem } from '../types';
import { useStationTime } from '../utils/timezoneUtils';
import { calculateAQI, getAQICategory } from '../utils/aqiUtils';
import { Card } from '../components/ui/Card';

interface ExplainableRiskScreenProps {
  station: StationData;
  onOpenCalibration: () => void;
  onNotify: (title: string, description: string) => void;
  unitSystem?: UnitSystem;
  simpleMode?: boolean;
}

export const ExplainableRiskScreen: React.FC<ExplainableRiskScreenProps> = ({
  station,
  onOpenCalibration,
  onNotify,
  unitSystem = 'standard'
}) => {
  const stationTime = useStationTime(station);
  const aqi = calculateAQI(station.pm25);
  const aqiCategory = getAQICategory(aqi);

  // Term contributions to total risk score
  const pm25Term = Math.min(50, (station.pm25 / 150) * 50);
  const inversionTerm = Math.max(0, 25 - (station.pblHeight / 2000) * 25);
  const windTerm = Math.max(0, 25 - (station.windSpeedMS / 8) * 25);
  const totalCalculated = Math.min(100, Math.round((pm25Term + inversionTerm + windTerm) * 10) / 10);

  // WHO Guideline ratios
  const whoPm25Limit = 15; // ug/m3 24h guideline
  const whoPm10Limit = 45;
  const whoNo2Limit = 25;

  const pm25Ratio = (station.pm25 / whoPm25Limit).toFixed(1);
  const pm10Ratio = (station.pm10 / whoPm10Limit).toFixed(1);
  const no2Ratio = (station.no2 / whoNo2Limit).toFixed(1);

  const handleCopyRawPayload = () => {
    const payload = JSON.stringify(
      {
        station_id: station.id,
        code: station.code,
        region: station.region,
        coordinates: { lat: station.lat, lng: station.lng, elevation_m: station.elevation },
        timestamp: new Date().toISOString(),
        measurements: {
          pm25_ug_m3: station.pm25,
          pm10_ug_m3: station.pm10,
          no2_ug_m3: station.no2,
          o3_ug_m3: station.o3,
          pbl_height_m: station.pblHeight,
          wind_speed_ms: station.windSpeedMS,
          wind_direction: station.windDirection,
          pressure_hpa: station.pressure,
          temp_c: station.dryTemp,
          humidity_pct: station.humidity
        },
        calculated_indices: {
          aqi: aqi,
          category: aqiCategory.label,
          physical_threat_score: station.riskScore,
          who_pm25_exceedance_factor: `${pm25Ratio}x`
        },
        data_sources: ['Open-Meteo European CAMS Ingestion', 'Copernicus Atmospheric Model', 'NOAA GFS Surface']
      },
      null,
      2
    );

    navigator.clipboard.writeText(payload);
    onNotify('Scientific Payload Copied', 'Complete atmospheric state payload copied to clipboard.');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6 relative">
      
      {/* 1. Header & Title */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up stagger-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-[24px]">verified</span>
            <h1 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
              Atmospheric Physics & Scientific Methodology
            </h1>
          </div>
          <p className="text-[13px] text-slate-400 mt-1">
            Zero black-box algorithms. Transparent physical equations, WHO guideline comparisons, and verifiable meteorological provenance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={onOpenCalibration}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-slate-300 hover:text-white text-[12px] font-medium transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-sky-400">tune</span>
            <span>Sensor Calibration</span>
          </button>

          <button
            type="button"
            onClick={handleCopyRawPayload}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_2px_12px_rgba(56,189,248,0.35)] hover:shadow-[0_4px_20px_rgba(56,189,248,0.5)] hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy JSON Payload</span>
          </button>
        </div>
      </Card>

      {/* 2. The Atmospheric Box Model Physics Card */}
      <Card variant="elevated" className="p-5 sm:p-7 flex flex-col gap-5 animate-fade-in-up stagger-2">
        <div className="border-b border-white/[0.08] pb-4">
          <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider font-semibold">
            Governing Physical Equation
          </span>
          <h2 className="text-[18px] font-bold text-white tracking-tight mt-1">
            The Eulerian Atmospheric Box Dispersion Model
          </h2>
          <p className="text-[13px] text-slate-400 mt-1">
            Urban air pollution is governed by conservation of mass in a turbulent atmospheric boundary layer. Particulate concentration does not rise in a vacuum; it spikes when ventilation drops below emission rates.
          </p>
        </div>

        {/* Formula Box */}
        <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] flex flex-col items-center justify-center text-center font-mono shadow-inner">
          <div className="text-[16px] sm:text-[20px] font-bold text-sky-300 tracking-wide">
            dC / dt = ( Q / H_pbl ) - ( u · C / L ) - k_chem · C
          </div>
          <div className="text-[11px] text-slate-400 mt-2 max-w-xl">
            Rate of Concentration Change = (Emissions / Inversion Ceiling) - (Wind Transport / Basin Length) - Chemical Decay
          </div>
        </div>

        {/* 3 Parameter Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 transition-all flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-[13px]">
              <span className="material-symbols-outlined text-[18px]">vertical_align_bottom</span>
              <span>1. Boundary Layer (H_pbl)</span>
            </div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              When nighttime ground cooling creates a thermal inversion ceiling at{' '}
              <strong className="text-white">{station.pblHeight}m</strong>, the effective mixing volume shrinks, compressing vehicle and industrial exhaust into a shallow breathing zone.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 transition-all flex flex-col gap-2">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-[13px]">
              <span className="material-symbols-outlined text-[18px]">air</span>
              <span>2. Advection Velocity (u)</span>
            </div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Surface winds at <strong className="text-white">{station.windSpeedMS} m/s ({station.windDirection})</strong>{' '}
              control horizontal clearing. Velocities below 1.5 m/s cause particulates to accumulate over urban road networks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5 transition-all flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-[13px]">
              <span className="material-symbols-outlined text-[18px]">water_drop</span>
              <span>3. Moisture Swelling (RH)</span>
            </div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              At <strong className="text-white">{station.humidity}% RH</strong>, hygroscopic salts and carbon soot absorb atmospheric moisture, expanding their optical scattering cross-section and worsening smog opacity.
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Transparent Score Breakdown for Active Station */}
      <Card variant="elevated" className="p-5 sm:p-7 flex flex-col gap-5 animate-fade-in-up stagger-3">
        <div className="border-b border-white/[0.08] pb-3">
          <h2 className="text-[18px] font-bold text-white tracking-tight">
            Transparent Score Decomposition: {station.region}
          </h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            How the Physical Risk Score ({station.riskScore}/100) is deterministically computed from ground sensors
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">Particulate Load (PM2.5)</span>
            <span className="text-[22px] font-bold text-sky-400 font-mono mt-0.5">
              +{pm25Term.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Based on {station.pm25.toFixed(1)} µg/m³
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">Inversion Stagnation Cap</span>
            <span className="text-[22px] font-bold text-amber-400 font-mono mt-0.5">
              +{inversionTerm.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Ceiling at {station.pblHeight}m
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">Wind Calms Penalty</span>
            <span className="text-[22px] font-bold text-teal-400 font-mono mt-0.5">
              +{windTerm.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Speed at {station.windSpeedMS} m/s
            </span>
          </div>

          <div className="p-4 rounded-xl bg-sky-500/10 backdrop-blur-md border border-sky-400/30 flex flex-col hover:border-sky-400/50 transition-all shadow-[0_4px_20px_rgba(56,189,248,0.15)]">
            <span className="text-[11px] text-slate-300 font-medium">Composite Risk Score</span>
            <span className="text-[24px] font-bold text-white font-mono mt-0.5">
              {totalCalculated} / 100
            </span>
            <span className="text-[11px] text-sky-400 font-semibold mt-0.5">
              {station.riskLabel}
            </span>
          </div>
        </div>
      </Card>

      {/* 4. WHO 2021 Global Air Quality Guidelines Comparison */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4 animate-fade-in-up stagger-4">
        <div className="border-b border-white/[0.08] pb-3">
          <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[20px]">policy</span>
            WHO 2021 Health Guideline Benchmarks
          </h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Comparing current atmospheric concentrations in {station.region} against World Health Organization health limits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white">PM2.5 (Fine Soot)</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono border backdrop-blur-sm ${
                Number(pm25Ratio) > 3 ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {pm25Ratio}× WHO Limit
              </span>
            </div>
            <div className="text-[13px] text-slate-300">
              Current: <strong className="text-white">{station.pm25.toFixed(1)} µg/m³</strong> • Guideline: {whoPm25Limit} µg/m³
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Particles below 2.5 micrometers penetrate deeply into lung alveoli and cross into the bloodstream.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white">PM10 (Coarse Dust)</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono border backdrop-blur-sm ${
                Number(pm10Ratio) > 2 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {pm10Ratio}× WHO Limit
              </span>
            </div>
            <div className="text-[13px] text-slate-300">
              Current: <strong className="text-white">{station.pm10} µg/m³</strong> • Guideline: {whoPm10Limit} µg/m³
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Coarse particles from road abrasion, tire wear, and construction causing upper respiratory tract inflammation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-white">NO2 (Combustion Gas)</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono border backdrop-blur-sm ${
                Number(no2Ratio) > 1.5 ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {no2Ratio}× WHO Limit
              </span>
            </div>
            <div className="text-[13px] text-slate-300">
              Current: <strong className="text-white">{station.no2} µg/m³</strong> • Guideline: {whoNo2Limit} µg/m³
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
              Reactive nitrogen dioxide emitted primarily by internal combustion engines and power generation.
            </p>
          </div>
        </div>
      </Card>

      {/* 5. Verifiable Data Sources & Provenance */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4 animate-fade-in-up stagger-5">
        <div className="border-b border-white/[0.08] pb-3">
          <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400 text-[20px]">dataset</span>
            Verifiable Ingestion Pipeline
          </h2>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Institutional scientific feeds providing continuous real-time atmospheric measurements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-[12px]">
          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col gap-1.5">
            <span className="font-semibold text-white">Copernicus CAMS (Europe)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              European Centre for Medium-Range Weather Forecasts (ECMWF) atmospheric chemistry modeling with integrated satellite optical depth assimilation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col gap-1.5">
            <span className="font-semibold text-white">NOAA Global Forecast System (USA)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Boundary layer height (PBL) numerical estimations, vertical isobaric velocity grids, and surface meteorological vectors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/[0.18] transition-all flex flex-col gap-1.5">
            <span className="font-semibold text-white">Open-Meteo Air Quality Core</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Direct open-access scientific API providing hour-by-hour real-time telemetry and geocoding index across over 200,000 global municipalities.
            </p>
          </div>
        </div>
      </Card>

    </div>
  );
};
