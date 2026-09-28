import React, { useState } from 'react';
import { StationData, StationId } from '../types';
import { STATIONS } from '../data/mockData';
import { formatPM_CGS, formatWind_CGS, formatHeight_CGS, formatPressure_CGS } from '../utils/cgsUtils';
import { useStationTime } from '../utils/timezoneUtils';

interface LiveTelemetryScreenProps {
  station: StationData;
  onSelectStation: (id: StationId) => void;
  onOpenCalibration: () => void;
  onNotify: (title: string, description: string) => void;
  simpleMode?: boolean;
}

export const LiveTelemetryScreen: React.FC<LiveTelemetryScreenProps> = ({
  station,
  onSelectStation,
  onOpenCalibration,
  onNotify,
  simpleMode = true
}) => {
  const [scrubberPosition, setScrubberPosition] = useState(83.33); // %
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracersActive, setTracersActive] = useState(false);
  const stationTime = useStationTime(station);

  const pm25CGS = formatPM_CGS(station.pm25, 'PM2.5');
  const pm10CGS = formatPM_CGS(station.pm10, 'PM10');
  const windCGS = formatWind_CGS(station.windSpeedMS, station.windDirection);
  const heightCGS = formatHeight_CGS(station.pblHeight);
  const pressureCGS = formatPressure_CGS(station.pressure);

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrubberPosition(parseFloat(e.target.value));
  };

  const handleInjectTracers = () => {
    setTracersActive(true);
    onNotify('Lagrangian Tracers Injected', '10,000 synthetic PM2.5 particle paths released into boundary layer simulation.');
    setTimeout(() => setTracersActive(false), 3000);
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 pb-8">
      {/* Plain-English Sensor Guide when Simple Mode is enabled */}
      {simpleMode && (
        <div className="bg-[#151c28] border border-[#38bdf8]/40 rounded-xl p-4 sm:p-5 shadow-lg mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/20 border border-[#38bdf8]/40 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">sensors</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-white text-[14px]">
                  What are these instruments measuring? (CGS Standard)
                </span>
                <span className="font-mono text-[10px] bg-[#44e2cd]/20 text-[#44e2cd] border border-[#44e2cd]/30 px-2 py-0.5 rounded font-bold">
                  CGS CONTEXT
                </span>
              </div>
              <p className="font-sans text-[12px] text-[#cbd5e1] leading-relaxed">
                • <strong>PM2.5 Mass Density ({pm25CGS.cgsFormatted}):</strong> Microscopic fine particles. {pm25CGS.context} (SI: {pm25CGS.siEquiv}).
                <br />
                • <strong>Inversion Ceiling ({heightCGS.cgsFormatted}):</strong> Atmospheric ceiling ({heightCGS.siEquiv}) trapping smoke close to street level.
                <br />
                • <strong>Wind Velocity ({windCGS.cgsFormatted}):</strong> {windCGS.context} ({windCGS.siEquiv}).
                <br />
                • <strong>Barometric Force ({pressureCGS.cgsFormatted}):</strong> Surface pressure of {pressureCGS.cgsValue.toLocaleString()} Barye. {pressureCGS.context}
              </p>
            </div>
          </div>
          <button
            onClick={handleInjectTracers}
            className="px-4 py-2 bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#00354a] font-bold text-[12px] rounded-lg transition-colors whitespace-nowrap shadow cursor-pointer shrink-0 self-end md:self-center"
          >
            Test Smoke Injection
          </button>
        </div>
      )}

      {/* System Breadcrumb & Master Synchronizer Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 bg-[#191c21] px-4 rounded border border-[#272a30] shadow-sm mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#bdc8d1]">
            <span className="text-[#8ed5ff] font-semibold">ROOT</span>
            <span className="text-[#87929a]">/</span>
            <span>REGIONAL_SOUNDING</span>
            <span className="text-[#87929a]">/</span>
            <span className="text-white font-medium">{station.code}</span>
          </div>

          <div className="h-3 w-px bg-[#3e484f] hidden sm:block" />

          {/* Station Local Time Synchronizer */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded bg-[#11161f] border border-[#38bdf8]/30">
            <span className="text-[12px]">{stationTime.isNight ? '🌙' : '☀️'}</span>
            <span className="text-[#8ed5ff] font-bold">STATION TIME:</span>
            <span className="text-white font-bold">{stationTime.time24}</span>
            <span className="text-[#44e2cd] text-[10px]">[{stationTime.timezoneAbbr || stationTime.utcOffsetStr}]</span>
          </div>

          <div className="h-3 w-px bg-[#3e484f] hidden md:block" />

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#bdc8d1]">
            <span className="text-[#87929a]">CLUSTER DENSITY:</span>
            <span className="text-white font-medium">46 ACTIVE SENSOR PODS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#1d2025] px-2.5 py-1 rounded border border-[#272a30]">
            <span className="material-symbols-outlined text-[#8ed5ff] text-[15px]">sensors</span>
            <span className="font-mono text-[11px] text-white">99.82% INGEST_STABILITY</span>
          </div>
          <button
            onClick={onOpenCalibration}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#272a30] hover:bg-[#32353b] text-white font-mono text-[11px] border border-[#3e484f] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#44e2cd] text-[15px]">tune</span>
            <span>CALIBRATION LOG</span>
          </button>
        </div>
      </div>

      {/* Section 1: Live Station Header & High-Precision Environmental Core */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-4">
        {/* Main Station Dossier Banner */}
        <div className="xl:col-span-8 bg-[#191c21] rounded border border-[#272a30] p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-64 h-64 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#38bdf8] text-[#004965] font-mono text-[10px] uppercase tracking-wider font-bold">
                  URBAN METEOROLOGY & DISPERSION MATRIX
                </span>
                <span className="font-mono text-[11px] text-[#87929a]">GEODETIC DATUM: WGS84</span>
              </div>
              <div className="flex items-center gap-1 text-[#8ed5ff] font-mono text-[11px]">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>HARDWARE SECURE BOOT (SHA-256 VALIDATED)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-7">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h1 className="font-sans text-[26px] sm:text-[30px] font-bold tracking-tight text-white">
                    {station.code}
                  </h1>
                  <span className="font-mono text-[14px] text-[#44e2cd] font-semibold">
                    {station.region}
                  </span>
                </div>
                <p className="font-sans text-[13px] text-[#bdc8d1] mt-1.5 max-w-xl leading-relaxed">
                  Tier-1 Baseline Observation Complex. Continuous radiosonde profile synthesis, multipoint electrochemical sensing, and micrometeorological sonic flux anemometry.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 font-mono text-[11px] items-center">
                  <div><span className="text-[#87929a]">COORDINATES:</span> <span className="text-white">{station.lat.toFixed(4)}°N, {station.lng.toFixed(4)}°E</span></div>
                  <div><span className="text-[#87929a]">ALTITUDE:</span> <span className="text-white">{station.elevation}m ASL</span></div>
                  <div><span className="text-[#87929a]">PRESSURE:</span> <span className="text-white">{station.pressure} hPa</span></div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#38bdf8]/15 border border-[#38bdf8]/40">
                    <span>{stationTime.isNight ? '🌙' : '☀️'}</span>
                    <span className="text-[#8ed5ff] font-bold">LOCAL CLOCK:</span>
                    <span className="text-white font-bold">{stationTime.time12}</span>
                    <span className="text-[#38bdf8] text-[10px]">({stationTime.timezoneAbbr || stationTime.utcOffsetStr})</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#1d2025] rounded border border-[#272a30] p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">
                    SYNTHETIC DISPERSION HEALTH
                  </span>
                  <span className="font-mono text-[11px] text-[#3cddc7] bg-[#03c6b2]/20 px-1.5 py-0.5 rounded border border-[#03c6b2]/40">
                    POOR VENTILATION
                  </span>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="font-sans text-[36px] font-bold text-white leading-none">{station.riskScore}</span>
                  <span className="font-mono text-[14px] text-[#87929a]">/ 100</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#93000a] text-[#ffdad6] font-mono text-[10px] font-bold ml-auto">
                    STAGNANT FLUX
                  </span>
                </div>
                <div className="font-sans text-[12px] text-[#bdc8d1] flex items-center justify-between">
                  <span>Dominant vector:</span>
                  <span className="text-[#8ed5ff] font-medium">PM2.5 Stagnation Layer (Tropospheric Cap)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 bg-[#272a30]/50 rounded border border-[#272a30] px-3 py-1.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="text-[#87929a]">RADIOMETER:</span>
                <span className="text-white">1,024 W/m² (DNI)</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="text-[#87929a]">TURBIDITY:</span>
                <span className="text-white">τ = 0.74 (MODERATE)</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className="text-[#87929a]">UPTIME:</span>
                <span className="text-[#44e2cd]">{station.uptime}</span>
              </div>
            </div>
            <div className="font-mono text-[11px] text-[#bdc8d1]">
              NODE REVISION: <span className="text-[#8ed5ff] font-semibold">{station.hardwareFw}</span>
            </div>
          </div>
        </div>

        {/* Live Sounding Quick Spatial View & Context */}
        <div className="xl:col-span-4 bg-[#191c21] rounded border border-[#272a30] p-5 sm:p-6 flex flex-col justify-between shadow-sm relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">satellite_alt</span>
              <span className="font-sans text-[15px] font-semibold text-white">Boundary Satellite Fix</span>
            </div>
            <span className="font-mono text-[11px] text-[#87929a]">INSAT-3DR TIR-1</span>
          </div>

          {/* Mini graphic */}
          <div className="w-full h-40 rounded bg-[#0b0e13] border border-[#272a30] relative overflow-hidden flex items-end p-2.5">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e13] via-transparent to-[#38bdf8]/10" />

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="invLayer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="300" y2="40" stroke="#272a30" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#272a30" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="120" x2="300" y2="120" stroke="#272a30" strokeWidth="1" strokeDasharray="3,3" />

              <rect x="0" y="65" width="300" height="15" fill="url(#invLayer)" />
              <line x1="0" y1="65" x2="300" y2="65" stroke="#ffb4ab" strokeWidth="1.5" strokeDasharray="4,2" />

              <circle cx="40" cy="110" r="1.5" fill="#e1e2ea" opacity="0.6" />
              <circle cx="75" cy="95" r="1.5" fill="#8ed5ff" opacity="0.7" />
              <circle cx="120" cy="130" r="2" fill="#ffb4ab" opacity="0.8" />
              <circle cx="160" cy="100" r="1.5" fill="#8ed5ff" opacity="0.5" />
              <circle cx="210" cy="120" r="2.5" fill="#ffb4ab" opacity="0.9" />
              <circle cx="260" cy="85" r="1" fill="#e1e2ea" opacity="0.4" />
              <circle cx="280" cy="115" r="1.8" fill="#8ed5ff" opacity="0.7" />

              <path d="M 30,150 Q 80,120 140,75 T 270,15" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="140" cy="75" r="4" fill="#38bdf8" />
            </svg>

            <div className="relative z-10 w-full flex items-center justify-between font-mono text-[11px] bg-[#1d2025]/90 backdrop-blur-sm p-1.5 rounded border border-[#272a30]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab]" />
                <span className="text-white">INVERSION LID: {station.pblHeight}m</span>
              </div>
              <span className="text-[#8ed5ff] font-medium">STABLE ENTRAINMENT</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#bdc8d1]">Surface Thermal Flux:</span>
            <span className="text-white font-medium">+142 W/m² (Sensible)</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] mt-0.5">
            <span className="text-[#bdc8d1]">Lidar Depolarization Ratio:</span>
            <span className="text-[#44e2cd] font-medium">δ = 0.18 (Spherical/Soot Mix)</span>
          </div>
        </div>
      </div>

      {/* Section 2: Quad-Instrument Telemetry Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {/* Instrument 1: Aerosol Loading */}
        <div className="bg-[#191c21] rounded border border-[#272a30] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 bg-[#272a30]/40 px-2 py-1 rounded">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">grain</span>
                <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Aerosol Loading & Speciation</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">PM2.5 DENSITY (CGS)</span>
                  <span className="font-mono text-[11px] text-[#ffb4ab] font-bold">5.7x WHO LIMIT</span>
                </div>
                <div className="flex flex-col mt-1">
                  <span className="font-mono text-[18px] sm:text-[20px] font-bold text-white">{pm25CGS.cgsFormatted}</span>
                  <span className="font-mono text-[10px] text-[#87929a]">
                    SI Equiv: <strong className="text-[#cbd5e1]">{station.pm25} µg/m³</strong> • Threshold: 1.50×10⁻¹¹ g/cm³
                  </span>
                </div>

                {/* Sparkline for PM2.5 */}
                <div className="mt-2 h-8 w-full">
                  <svg className="w-full h-full" viewBox="0 0 120 30" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      points="0,22 10,24 20,20 30,18 40,25 50,15 60,12 70,8 80,10 90,14 100,7 110,6 120,5"
                      stroke="#ffb4ab"
                      strokeWidth="1.8"
                    />
                    <linearGradient id="aerosolFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0" />
                    </linearGradient>
                    <polygon
                      fill="url(#aerosolFill)"
                      points="0,22 10,24 20,20 30,18 40,25 50,15 60,12 70,8 80,10 90,14 100,7 110,6 120,5 120,30 0,30"
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 font-mono">
                <div className="bg-[#1d2025] rounded border border-[#272a30] p-2">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">PM10 (CGS)</span>
                  <div className="text-[12px] text-white font-bold">{pm10CGS.cgsFormatted}</div>
                  <div className="text-[9px] text-[#87929a]">{station.pm10} µg/m³</div>
                </div>
                <div className="bg-[#1d2025] rounded border border-[#272a30] p-2">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">NO2 (OXIDES)</span>
                  <div className="text-[14px] text-white font-bold">{station.no2} <span className="text-[10px] text-[#87929a]">ppb</span></div>
                  <div className="text-[9px] text-[#87929a]">Photochemical</div>
                </div>
                <div className="bg-[#1d2025] rounded border border-[#272a30] p-2">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">O3 (SURFACE)</span>
                  <div className="text-[15px] text-white font-bold">{station.o3} <span className="text-[10px] text-[#87929a]">ppb</span></div>
                </div>
                <div className="bg-[#1d2025] rounded border border-[#272a30] p-2">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">CO (MONOXIDE)</span>
                  <div className="text-[15px] text-white font-bold">{station.co} <span className="text-[10px] text-[#87929a]">ppm</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 bg-[#272a30]/40 rounded border border-[#272a30] p-2 flex justify-between font-mono text-[11px]">
            <span className="text-[#bdc8d1]">SO2 Tracer:</span>
            <span className="text-[#44e2cd] font-semibold">{station.so2} µg/m³ [NORMAL]</span>
          </div>
        </div>

        {/* Instrument 2: Thermal Sounding & Thermodynamics */}
        <div className="bg-[#191c21] rounded border border-[#272a30] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 bg-[#272a30]/40 px-2 py-1 rounded">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">thermostat</span>
                <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Thermal Sounding</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#44e2cd]" />
            </div>

            <div className="space-y-2">
              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">DRY BULB AMBIENT</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-[24px] font-bold text-white">{station.dryTemp}</span>
                    <span className="font-mono text-[11px] text-[#87929a]">°C</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">WET BULB TEMPERATURE</span>
                  <div className="flex items-baseline justify-end gap-1 mt-0.5">
                    <span className="font-mono text-[16px] font-bold text-[#8ed5ff]">{station.wetTemp}</span>
                    <span className="font-mono text-[11px] text-[#87929a]">°C</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5">
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">HEAT INDEX ELEVATION</span>
                  <span className="text-[11px] text-[#ffb4ab] font-bold">+2.8°C Offset</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-sans text-[12px] text-[#bdc8d1]">Apparent Thermal Load:</span>
                  <span className="font-mono text-[14px] text-white font-bold">31.6°C RealFeel</span>
                </div>
                <div className="w-full bg-[#0b0e13] h-1.5 rounded mt-2 overflow-hidden flex">
                  <div className="bg-[#44e2cd] h-full" style={{ width: '50%' }} />
                  <div className="bg-[#38bdf8] h-full" style={{ width: '30%' }} />
                  <div className="bg-[#ffb4ab] h-full" style={{ width: '20%' }} />
                </div>
              </div>

              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">RADIOSONDE LAPSE RATE</span>
                  <div className="text-[14px] text-white font-bold">-5.2°C <span className="text-[11px] text-[#87929a]">/ 1000m</span></div>
                </div>
                <span className="text-[10px] text-[#44e2cd] px-2 py-0.5 rounded bg-[#272a30] font-bold border border-[#44e2cd]/30">
                  SUBLAPSE
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 bg-[#272a30]/40 rounded border border-[#272a30] p-2 flex justify-between font-mono text-[11px]">
            <span className="text-[#bdc8d1]">Ground Emissivity:</span>
            <span className="text-white font-medium">ε = 0.94 (Asphalt/Concrete)</span>
          </div>
        </div>

        {/* Instrument 3: Moisture Flux & Hydro */}
        <div className="bg-[#191c21] rounded border border-[#272a30] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 bg-[#272a30]/40 px-2 py-1 rounded">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">humidity_mid</span>
                <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Moisture Flux & Hydro</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#44e2cd]" />
            </div>

            <div className="space-y-2">
              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 flex justify-between items-center">
                <div>
                  <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">RELATIVE HUMIDITY (RH)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-[24px] font-bold text-[#44e2cd]">{station.humidity}</span>
                    <span className="font-mono text-[11px] text-[#87929a]">%</span>
                  </div>
                </div>
                {/* Radial Gauge */}
                <div className="w-12 h-12 relative flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#272a30" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#44e2cd"
                      strokeWidth="3"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * station.humidity) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-mono text-[10px] text-white font-bold">{station.humidity}%</span>
                </div>
              </div>

              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">DEW POINT DEPRESSION</span>
                  <span className="text-[14px] text-white font-bold">21.4°C</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-1 border-t border-[#272a30]">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">VAPOR PRESSURE DEFICIT</span>
                  <span className="text-[11px] text-[#8ed5ff] font-bold">VPD 1.26 kPa</span>
                </div>
              </div>

              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#87929a] uppercase font-semibold">AEROSOL HYDRO-GROWTH</span>
                  <span className="font-mono text-[11px] text-[#44e2cd] font-bold mt-0.5">ACTIVE CONDENSATION</span>
                </div>
                <span className="material-symbols-outlined text-[#44e2cd] text-[20px]">water_drop</span>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 bg-[#272a30]/40 rounded border border-[#272a30] p-2 flex justify-between font-mono text-[11px]">
            <span className="text-[#bdc8d1]">Precip Probability:</span>
            <span className="text-white font-medium">0% [Dry Trajectory]</span>
          </div>
        </div>

        {/* Instrument 4: Kinematics & Advection */}
        <div className="bg-[#191c21] rounded border border-[#272a30] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 bg-[#272a30]/40 px-2 py-1 rounded">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">air</span>
                <span className="font-mono text-[10px] font-semibold text-[#bdc8d1] uppercase">Kinematics & Advection</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 flex justify-between items-center">
                <div>
                  <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-semibold">SONIC HORIZONTAL WIND</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-mono text-[24px] font-bold text-white">{station.windSpeedKmH}</span>
                    <span className="font-mono text-[11px] text-[#87929a]">km/h</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#8ed5ff] font-medium">VECTOR: {station.windDirection}</span>
                </div>

                {/* Polar Compass Anemometer */}
                <div className="w-12 h-12 rounded-full bg-[#0b0e13] border border-[#272a30] flex items-center justify-center relative">
                  <svg className="w-10 h-10" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="none" stroke="#272a30" strokeWidth="1" />
                    <line x1="20" y1="2" x2="20" y2="38" stroke="#3e484f" strokeWidth="0.7" />
                    <line x1="2" y1="20" x2="38" y2="20" stroke="#3e484f" strokeWidth="0.7" />
                    {/* Arrow Vector based on degrees */}
                    <g transform={`rotate(${station.windDegrees}, 20, 20)`}>
                      <line x1="20" y1="20" x2="20" y2="5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                      <polygon points="20,3 17,9 23,9" fill="#38bdf8" />
                    </g>
                  </svg>
                  <span className="absolute text-[8px] font-mono text-[#87929a] top-0.5">N</span>
                </div>
              </div>

              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">VENTILATION INDEX</span>
                  <span className="text-[14px] text-[#ffdad6] font-bold">{station.ventilationIndex.toLocaleString()} m²/s</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 font-sans text-[11px] text-[#bdc8d1]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffb4ab]" />
                  <span>Restricted clearing capacity</span>
                </div>
              </div>

              <div className="bg-[#1d2025] rounded border border-[#272a30] p-2.5 flex justify-between items-center font-mono">
                <div>
                  <span className="text-[10px] text-[#87929a] uppercase font-semibold">PBL HEURISTIC (MIXING HEIGHT)</span>
                  <div className="text-[14px] text-white font-bold">{station.pblHeight}m <span className="text-[10px] text-[#87929a]">ASL</span></div>
                </div>
                <span className="font-mono text-[9px] text-[#ffb4ab] bg-[#93000a] px-1.5 py-0.5 rounded font-bold uppercase">
                  GROUND CAPPED
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 mt-2 bg-[#272a30]/40 rounded border border-[#272a30] p-2 flex justify-between font-mono text-[11px]">
            <span className="text-[#bdc8d1]">Friction Velocity (u*):</span>
            <span className="text-white font-medium">0.28 m/s (Low Drag)</span>
          </div>
        </div>
      </div>

      {/* Section 3: Lagrangian Particle Dispersion Chamber */}
      <div className="bg-[#191c21] rounded border border-[#272a30] p-5 sm:p-6 shadow-sm mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8ed5ff] text-[20px]">blur_on</span>
              <h2 className="font-sans text-[18px] sm:text-[20px] font-bold text-white">
                Lagrangian Particle Dispersion Chamber
              </h2>
            </div>
            <p className="font-sans text-[12px] text-[#bdc8d1] mt-0.5">
              Dynamic micro-scale simulation of thermal stratigraphy and boundary entrapment above {station.code} grid cells.
            </p>
          </div>

          {/* Live Physics Constants Panel */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <div className="bg-[#1d2025] px-2.5 py-1 rounded border border-[#272a30]">
              <span className="text-[#87929a]">RESIDENCE TIME:</span>{' '}
              <span className="text-[#8ed5ff] font-semibold">18.4 Hours</span>
            </div>
            <div className="bg-[#1d2025] px-2.5 py-1 rounded border border-[#272a30]">
              <span className="text-[#87929a]">REYNOLDS:</span>{' '}
              <span className="text-[#44e2cd] font-semibold">Re = 4.2×10⁶</span>
            </div>
            <div className="bg-[#1d2025] px-2.5 py-1 rounded border border-[#ffb4ab]/40">
              <span className="text-[#87929a]">VENTING STATUS:</span>{' '}
              <span className="text-[#ffb4ab] font-bold uppercase">BLOCKED (0.02 m/s w')</span>
            </div>
          </div>
        </div>

        {/* Visual Interactive Inversion Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Simulation Viewport */}
          <div className="lg:col-span-8 bg-[#0b0e13] rounded border border-[#272a30] p-3 relative min-h-[320px] flex flex-col justify-between overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="warmAir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
                </linearGradient>
                <pattern id="chamberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1d2025" strokeWidth="1" />
                </pattern>
              </defs>

              <rect width="600" height="300" fill="url(#chamberGrid)" />

              {/* Free Atmosphere Region */}
              <text x="20" y="35" fill="#87929a" className="font-mono text-[10px]">
                FREE TROPOSPHERE [LAMINAR HIGH VELOCITY]
              </text>
              <path d="M 0,45 Q 150,35 300,50 T 600,40" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6,4" opacity="0.4" />
              <path d="M 0,70 Q 200,60 400,75 T 600,65" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="8,4" opacity="0.4" />

              {/* Thermal Inversion Lid Zone */}
              <rect x="0" y="110" width="600" height="28" fill="url(#warmAir)" />
              <line x1="0" y1="110" x2="600" y2="110" stroke="#ffb4ab" strokeWidth="1.5" strokeDasharray="6,3" />
              <line x1="0" y1="138" x2="600" y2="138" stroke="#ffb4ab" strokeWidth="1" strokeDasharray="2,2" />
              <text x="20" y="126" fill="#ffb4ab" className="font-mono text-[10px] font-bold">
                INVERSION CEILING: 620m ASL [dT/dz &gt; 0 - ENTRAINMENT RESISTANCE]
              </text>

              {/* Trapped Particle Trajectories */}
              <path
                d="M 80,280 C 100,240 90,160 140,145 C 190,135 240,150 280,145 C 340,140 400,165 480,150 C 530,140 570,160 600,155"
                fill="none"
                stroke="#ffb4ab"
                strokeWidth="2"
                opacity="0.8"
                className={tracersActive ? 'animate-pulse' : ''}
              />
              <path
                d="M 180,280 C 200,210 220,155 270,145 C 320,135 360,180 430,165 C 500,150 540,175 600,170"
                fill="none"
                stroke="#8ed5ff"
                strokeWidth="1.8"
                opacity="0.7"
              />

              {/* Diffuse Eddies */}
              <ellipse cx="230" cy="180" rx="45" ry="18" fill="none" stroke="#44e2cd" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
              <ellipse cx="440" cy="200" rx="60" ry="25" fill="none" stroke="#44e2cd" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />

              {/* Particle Cluster Density Points */}
              <g fill="#ffdad6">
                <circle cx="100" cy="220" r="2" opacity="0.8" />
                <circle cx="120" cy="190" r="2.5" opacity="0.9" />
                <circle cx="140" cy="160" r="2" opacity="0.7" />
                <circle cx="180" cy="150" r="3" opacity="0.85" />
                <circle cx="210" cy="165" r="2" opacity="0.9" />
                <circle cx="260" cy="148" r="2.5" opacity="0.8" />
                <circle cx="310" cy="155" r="2" opacity="0.6" />
                <circle cx="370" cy="160" r="3" opacity="0.9" />
                <circle cx="430" cy="150" r="2" opacity="0.8" />
                <circle cx="490" cy="165" r="2.5" opacity="0.7" />
                <circle cx="530" cy="170" r="3" opacity="0.85" />
                <circle cx="570" cy="160" r="2" opacity="0.6" />
              </g>

              {/* Extra animated tracer particles when active */}
              {tracersActive && (
                <g fill="#38bdf8">
                  <circle cx="160" cy="180" r="4" className="animate-ping" />
                  <circle cx="320" cy="170" r="4" className="animate-ping" />
                  <circle cx="450" cy="160" r="4" className="animate-ping" />
                </g>
              )}

              {/* Ground Baseline Topology */}
              <rect x="0" y="270" width="600" height="30" fill="#1d2025" />
              <line x1="0" y1="270" x2="600" y2="270" stroke="#87929a" strokeWidth="1" />
              <rect x="70" y="250" width="20" height="20" fill="#272a30" />
              <rect x="95" y="240" width="15" height="30" fill="#32353b" />
              <rect x="170" y="245" width="25" height="25" fill="#272a30" />
              <rect x="230" y="255" width="35" height="15" fill="#32353b" />
              <rect x="400" y="248" width="22" height="22" fill="#272a30" />
            </svg>

            {/* Overlays */}
            <div className="relative z-10 flex justify-between items-start font-mono text-[11px]">
              <div className="bg-[#191c21]/90 backdrop-blur-md px-2 py-0.5 rounded border border-[#272a30] text-white">
                Z-AXIS: VERTICAL DISPERSION [0m - 1200m]
              </div>
              <div className="flex items-center gap-1.5 bg-[#191c21]/90 backdrop-blur-md px-2 py-0.5 rounded border border-[#272a30] text-[#8ed5ff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-ping" />
                <span>LAGRANGIAN RESOLVER: 10,000 TRAJECTORIES</span>
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-end font-mono text-[11px] pt-8">
              <div className="bg-[#191c21]/90 backdrop-blur-md px-2 py-0.5 rounded border border-[#272a30] text-[#bdc8d1]">
                GROUND FLUX: <span className="text-white font-semibold">Connaught Urban Canyon</span>
              </div>
              <div className="bg-[#191c21]/90 backdrop-blur-md px-2 py-0.5 rounded border border-[#272a30] text-[#44e2cd]">
                VENTING FRACTION: 3.4% [CRITICAL RETENTION]
              </div>
            </div>
          </div>

          {/* Controls & Parameters */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            <div className="bg-[#1d2025] rounded border border-[#272a30] p-4 space-y-3">
              <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-bold tracking-wider">
                BOUNDARY EQUATION TUNING
              </span>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#87929a]">Richardson Number (Ri):</span>
                  <span className="text-white font-semibold">0.42 (Stable &gt; 0.25)</span>
                </div>
                <div className="w-full bg-[#272a30] h-1 rounded overflow-hidden">
                  <div className="bg-[#38bdf8] h-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#87929a]">Monin-Obukhov Length (L):</span>
                  <span className="text-white font-semibold">+48.2m (Suppressed)</span>
                </div>
                <div className="w-full bg-[#272a30] h-1 rounded overflow-hidden">
                  <div className="bg-[#44e2cd] h-full" style={{ width: '38%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#87929a]">Roughness Length (z0):</span>
                  <span className="text-white font-semibold">1.85m (High Canopy)</span>
                </div>
                <div className="w-full bg-[#272a30] h-1 rounded overflow-hidden">
                  <div className="bg-[#38bdf8] h-full" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            <div className="bg-[#1d2025] rounded border border-[#272a30] p-4 flex flex-col gap-1.5">
              <span className="font-mono text-[10px] text-[#bdc8d1] uppercase font-bold">
                SOUNDING PROTOCOL SPEC
              </span>
              <p className="font-sans text-[12px] text-[#bdc8d1] leading-relaxed">
                The strong nighttime radiative cooling of the surface created an intense thermal inversion lid at 620m ASL. Airborne particulates emitted across central NCR remain trapped within the shallow surface boundary.
              </p>
              <div className="pt-1 flex items-center justify-between font-mono text-[11px] text-[#44e2cd]">
                <span>Forecasted Breakup:</span>
                <span className="font-semibold text-white">11:30 UTC (+4.5 hrs)</span>
              </div>
            </div>

            <button
              onClick={handleInjectTracers}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#272a30] hover:bg-[#32353b] text-white font-sans text-[13px] font-medium rounded border border-[#3e484f] transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">cloud_sync</span>
              <span>Inject Synthetic Tracers (Run Model)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: 24-Hour Chronological Scrubber & Multi-Station Matrix */}
      <div className="bg-[#191c21] rounded border border-[#272a30] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#44e2cd] text-[20px]">history_toggle_off</span>
              <h2 className="font-sans text-[18px] sm:text-[20px] font-bold text-white">
                Synchronous 24-Hour Temporal Scrubber
              </h2>
            </div>
            <span className="font-sans text-[12px] text-[#bdc8d1]">
              Step through calibrated historical time-slices or stream synoptic ground readings.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[#87929a]">SCRUBBER FOCUS:</span>
              <span className="px-2 py-0.5 rounded bg-[#38bdf8] text-[#004965] font-bold">
                T - 04:00 (10:40 UTC)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setScrubberPosition(Math.max(0, scrubberPosition - 10))}
                className="p-1 rounded bg-[#272a30] hover:bg-[#32353b] text-white border border-[#272a30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">skip_previous</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded bg-[#272a30] hover:bg-[#32353b] text-white border border-[#272a30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setScrubberPosition(Math.min(100, scrubberPosition + 10))}
                className="p-1 rounded bg-[#272a30] hover:bg-[#32353b] text-white border border-[#272a30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">skip_next</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Scrubber Bar Element */}
        <div className="bg-[#0b0e13] p-4 rounded border border-[#272a30] mb-5">
          <div className="flex justify-between font-mono text-[11px] text-[#87929a] mb-2">
            <span>T - 24 Hours</span>
            <span>T - 18 Hours</span>
            <span>T - 12 Hours</span>
            <span>T - 06 Hours</span>
            <span className="text-[#8ed5ff] font-semibold">T - 0 Now (Live)</span>
          </div>

          <div className="relative w-full h-4 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={scrubberPosition}
              onChange={handleScrubberChange}
              className="w-full h-1 bg-[#272a30] rounded-full appearance-none cursor-pointer accent-[#38bdf8]"
            />
          </div>

          <div className="flex justify-between font-mono text-[10px] text-[#bdc8d1] mt-2">
            <span>14:40 (Yesterday)</span>
            <span>20:40</span>
            <span>02:40</span>
            <span>08:40</span>
            <span className="text-[#44e2cd] font-semibold">14:40 UTC (CURRENT)</span>
          </div>
        </div>

        {/* Multi-Station Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-[12px]">
            <thead>
              <tr className="bg-[#111319] font-mono text-[10px] text-[#87929a] uppercase border-b border-[#272a30]">
                <th className="py-2.5 px-3">Station ID / Node</th>
                <th className="py-2.5 px-3">Region & Morph</th>
                <th className="py-2.5 px-3">AQ Composite</th>
                <th className="py-2.5 px-3">PM2.5 (µg/m³)</th>
                <th className="py-2.5 px-3">Temperature</th>
                <th className="py-2.5 px-3">Ventilation</th>
                <th className="py-2.5 px-3">Boundary Inversion</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#272a30]/50 font-mono text-[11px]">
              {Object.values(STATIONS).map((st) => {
                const isSelected = st.id === station.id;
                return (
                  <tr
                    key={st.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-[#272a30]/60 text-white font-medium'
                        : 'hover:bg-[#1d2025] text-[#bdc8d1]'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[#8ed5ff] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#ffb4ab]' : 'bg-[#44e2cd]'}`} />
                      <span className="font-semibold">{st.code}</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded bg-[#38bdf8] text-[#004965] text-[9px] uppercase font-bold">
                          CURRENT
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#87929a] font-sans">{st.region}</td>
                    <td className={`py-2.5 px-3 font-bold ${st.riskScore > 40 ? 'text-[#ffb4ab]' : 'text-[#44e2cd]'}`}>
                      {st.riskScore} / 100
                    </td>
                    <td className={`py-2.5 px-3 font-bold ${st.pm25 > 50 ? 'text-[#ffb4ab]' : 'text-[#44e2cd]'}`}>
                      {st.pm25}
                    </td>
                    <td className="py-2.5 px-3 text-[#e1e2ea]">
                      {st.dryTemp}°C (RH {st.humidity}%)
                    </td>
                    <td className={`py-2.5 px-3 ${st.ventilationIndex < 2000 ? 'text-[#ffb4ab]' : 'text-[#44e2cd]'}`}>
                      {st.ventilationIndex.toLocaleString()} m²/s
                    </td>
                    <td className={`py-2.5 px-3 ${st.pblHeight < 700 ? 'text-[#ffb4ab]' : 'text-[#44e2cd]'}`}>
                      {st.pblHeight}m [{st.pblHeight < 700 ? 'TRAPPED' : 'VENTED'}]
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isSelected ? (
                        <span className="text-[#44e2cd] bg-[#1d2025] px-2 py-0.5 rounded border border-[#272a30]">
                          ACTIVE SOURCE
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectStation(st.id);
                            onNotify('Station Switched', `Active telemetry anchor switched to ${st.name}.`);
                          }}
                          className="text-[#e1e2ea] hover:text-[#8ed5ff] transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-[#272a30]"
                        >
                          COMPARE
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Warning Bar */}
        <div className="mt-3.5 p-3 bg-[#1d2025] rounded border border-[#272a30] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb4ab] text-[18px]">warning</span>
            <span className="font-mono text-[11px] text-[#e1e2ea]">
              ADVISORY NCR-ADV-09: PM2.5 ground persistence expected until 11:30 UTC solar destabilization.
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-[#87929a]">DOWNSTREAM RECEPTOR:</span>
            <span className="text-[#8ed5ff] font-medium">Ghaziabad / Noida Industrial Corridor (SE Vector)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
