import React, { useState } from 'react';
import { StationData, StationId, UnitSystem } from '../types';
import { STATIONS } from '../data/mockData';
import { useStationTime } from '../utils/timezoneUtils';
import { calculateAQI, getAQICategory, formatTelemetryMetric } from '../utils/aqiUtils';
import { Card } from '../components/ui/Card';

interface GeospatialGridScreenProps {
  currentStation: StationData;
  onSelectStation: (id: StationId) => void;
  onOpenSounding: () => void;
  onNotify: (title: string, description: string) => void;
  unitSystem?: UnitSystem;
  simpleMode?: boolean;
}

interface WorldCityPin {
  id: StationId;
  name: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
}

export const GeospatialGridScreen: React.FC<GeospatialGridScreenProps> = ({
  currentStation,
  onSelectStation,
  onNotify,
  unitSystem = 'standard'
}) => {
  const [showPlume, setShowPlume] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [showInversion, setShowInversion] = useState(true);

  const stationTime = useStationTime(currentStation);
  const currentAqi = calculateAQI(currentStation.pm25);
  const currentCat = getAQICategory(currentAqi);

  const worldPins: WorldCityPin[] = [
    { id: 'delhi', name: 'Delhi', country: 'India', flag: '🇮🇳', lat: 28.61, lng: 77.20, aqi: calculateAQI(86.4), pm25: 86.4 },
    { id: 'tokyo', name: 'Tokyo', country: 'Japan', flag: '🇯🇵', lat: 35.67, lng: 139.65, aqi: calculateAQI(18.6), pm25: 18.6 },
    { id: 'new-york', name: 'New York', country: 'United States', flag: '🇺🇸', lat: 40.71, lng: -74.00, aqi: calculateAQI(14.2), pm25: 14.2 },
    { id: 'london', name: 'London', country: 'United Kingdom', flag: '🇬🇧', lat: 51.50, lng: -0.12, aqi: calculateAQI(16.4), pm25: 16.4 },
    { id: 'paris', name: 'Paris', country: 'France', flag: '🇫🇷', lat: 48.85, lng: 2.35, aqi: calculateAQI(19.0), pm25: 19.0 },
    { id: 'cairo', name: 'Cairo', country: 'Egypt', flag: '🇪🇬', lat: 30.04, lng: 31.23, aqi: calculateAQI(92.4), pm25: 92.4 },
    { id: 'mumbai', name: 'Mumbai', country: 'India', flag: '🇮🇳', lat: 19.07, lng: 72.87, aqi: calculateAQI(34.0), pm25: 34.0 },
    { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', flag: '🇧🇷', lat: -23.55, lng: -46.63, aqi: calculateAQI(24.5), pm25: 24.5 }
  ];

  const handleStationClick = (id: StationId) => {
    onSelectStation(id);
    const stationName = STATIONS[id]?.name || id;
    onNotify('Station Selected', `Active atmospheric telemetry centered on ${stationName}.`);
  };

  // Convert lat/lng to SVG percentage coordinates (Equirectangular projection)
  const getCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  const activeCoords = getCoordinates(currentStation.lat, currentStation.lng);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6 relative">
      
      {/* 1. Header & Quick Switcher */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up stagger-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-400 text-[24px]">public</span>
            <h1 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
              Interactive Global Air Quality Map
            </h1>
          </div>
          <p className="text-[13px] text-slate-400 mt-1">
            Global monitoring network across 8 major metropolitan regions. Click any city to center telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {worldPins.map((pin) => {
            const isSelected = currentStation.id === pin.id;
            const pinCat = getAQICategory(pin.aqi);
            return (
              <button
                key={pin.id}
                type="button"
                onClick={() => handleStationClick(pin.id)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer backdrop-blur-md border ${
                  isSelected
                    ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 font-bold border-sky-400/80 shadow-[0_4px_18px_rgba(56,189,248,0.45)] scale-[1.03] -translate-y-0.5'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.09] border-white/[0.08] hover:border-white/[0.22] hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_4px_14px_rgba(255,255,255,0.06)]'
                }`}
              >
                <span>{pin.flag}</span>
                <span>{pin.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : pinCat.textColor
                  }`}
                >
                  {pin.aqi}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Interactive Map Canvas */}
      <Card variant="elevated" className="p-4 sm:p-6 flex flex-col gap-4 animate-fade-in-up stagger-2">
        {/* Map Controls Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-semibold text-white mr-1">Atmospheric Layers:</span>
            <button
              type="button"
              onClick={() => setShowPlume(!showPlume)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer backdrop-blur-md border flex items-center gap-1.5 ${
                showPlume
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-[0_2px_12px_rgba(56,189,248,0.25)] scale-[1.02] hover:bg-sky-500/25 hover:border-sky-400/70 hover:scale-[1.04] hover:-translate-y-0.5'
                  : 'bg-white/[0.03] text-slate-400 border-white/[0.07] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.18] hover:scale-[1.02] hover:-translate-y-0.5'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">grain</span>
              <span>PM2.5 Plume</span>
            </button>
            <button
              type="button"
              onClick={() => setShowWind(!showWind)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer backdrop-blur-md border flex items-center gap-1.5 ${
                showWind
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-[0_2px_12px_rgba(20,184,166,0.25)] scale-[1.02] hover:bg-teal-500/25 hover:border-teal-400/70 hover:scale-[1.04] hover:-translate-y-0.5'
                  : 'bg-white/[0.03] text-slate-400 border-white/[0.07] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.18] hover:scale-[1.02] hover:-translate-y-0.5'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">air</span>
              <span>Wind Vectors</span>
            </button>
            <button
              type="button"
              onClick={() => setShowInversion(!showInversion)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer backdrop-blur-md border flex items-center gap-1.5 ${
                showInversion
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_2px_12px_rgba(245,158,11,0.25)] scale-[1.02] hover:bg-amber-500/25 hover:border-amber-400/70 hover:scale-[1.04] hover:-translate-y-0.5'
                  : 'bg-white/[0.03] text-slate-400 border-white/[0.07] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.18] hover:scale-[1.02] hover:-translate-y-0.5'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">compress</span>
              <span>Inversion Ceilings</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[12px] text-slate-400 font-mono">
            <span>Focused: <strong className="text-white">{currentStation.region}</strong></span>
            <span>•</span>
            <span className="text-sky-400">{currentStation.lat.toFixed(2)}°N, {currentStation.lng.toFixed(2)}°E</span>
          </div>
        </div>

        {/* Vector Map Canvas */}
        <div className="relative w-full h-[360px] sm:h-[440px] bg-[#07090e]/90 rounded-2xl border border-white/[0.08] overflow-hidden select-none shadow-inner">
          {/* Subtle Grid Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="#38bdf8" strokeDasharray="2 4" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#38bdf8" strokeDasharray="3 3" />
            <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="#38bdf8" strokeDasharray="2 4" />
            <line x1="25%" y1="0%" x2="25%" y2="100%" stroke="#38bdf8" strokeDasharray="2 4" />
            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#38bdf8" strokeDasharray="3 3" />
            <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="#38bdf8" strokeDasharray="2 4" />
          </svg>

          {/* Continents Outline Representation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-500 fill-current">
              <path d="M 150 80 Q 250 60 280 140 Q 240 220 180 200 Z" />
              <path d="M 280 250 Q 360 270 320 380 Q 260 400 270 280 Z" />
              <path d="M 480 80 Q 580 90 560 160 Q 480 180 460 120 Z" />
              <path d="M 480 200 Q 580 220 540 360 Q 460 340 470 240 Z" />
              <path d="M 600 70 Q 820 90 840 220 Q 680 240 620 160 Z" />
              <path d="M 760 300 Q 860 310 840 400 Q 750 380 760 320 Z" />
            </svg>
          </div>

          {/* Active Plume Overlay */}
          {showPlume && (
            <div
              className="absolute pointer-events-none rounded-full blur-3xl transition-all duration-700 animate-pulse-glow"
              style={{
                left: `${activeCoords.x}%`,
                top: `${activeCoords.y}%`,
                width: '200px',
                height: '200px',
                transform: 'translate(-50%, -50%)',
                backgroundColor: currentCat.color,
                opacity: 0.3
              }}
            />
          )}

          {/* City Nodes */}
          {worldPins.map((pin) => {
            const { x, y } = getCoordinates(pin.lat, pin.lng);
            const isSelected = currentStation.id === pin.id;
            const pinCat = getAQICategory(pin.aqi);

            return (
              <div
                key={pin.id}
                className="absolute cursor-pointer transition-transform duration-300 hover:scale-115 z-20"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => handleStationClick(pin.id)}
              >
                {/* Active Selection Pulse Ring */}
                {isSelected && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-60"
                    style={{ backgroundColor: pinCat.color, transform: 'scale(2.2)' }}
                  />
                )}

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-xl border backdrop-blur-xl transition-all ${
                    isSelected
                      ? 'bg-slate-950/90 border-sky-400 ring-2 ring-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                      : 'bg-[#0d121c]/80 border-white/[0.12] hover:border-white/[0.3] hover:bg-[#141b2a]/90'
                  }`}
                >
                  <span className="text-sm">{pin.flag}</span>
                  <span className="text-[11px] font-semibold text-white">{pin.name}</span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: pinCat.color }}
                  />
                  <span className="text-[10px] font-mono text-slate-300 font-bold">
                    {pin.aqi}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-[#0d1017]/85 border border-white/[0.08] rounded-xl p-3 backdrop-blur-xl flex flex-col gap-1.5 text-[11px] shadow-lg">
            <span className="font-semibold text-slate-200">AQI Spectrum:</span>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> &lt;50 Good
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 51-100 Mod
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-orange-400" /> 101-150 Sens
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> 151+ High
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Station Detail Inspector Panel */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4 animate-fade-in-up stagger-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl drop-shadow-md">{currentStation.flag || '🌍'}</span>
            <div>
              <h2 className="text-[18px] font-bold text-white tracking-tight">
                {currentStation.region}
              </h2>
              <p className="text-[12px] text-slate-400">
                Monitoring node telemetry & active boundary layer status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span
              className={`px-3 py-1 rounded-full text-[12px] font-semibold border backdrop-blur-md ${currentCat.bgColor} ${currentCat.textColor} ${currentCat.borderColor}`}
            >
              AQI {currentAqi} • {currentCat.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">PM2.5 Mass</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {formatTelemetryMetric(currentStation.pm25, 'pm25', unitSystem).primary}
            </span>
            <span className="text-[10px] text-slate-400">Fine soot particulates</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">Inversion Ceiling</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {formatTelemetryMetric(currentStation.pblHeight, 'pblHeight', unitSystem).primary}
            </span>
            <span className="text-[10px] text-slate-400">Boundary lid height</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">Surface Wind</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {formatTelemetryMetric(currentStation.windSpeedMS, 'wind', unitSystem).primary}
            </span>
            <span className="text-[10px] text-slate-400">Blowing {currentStation.windDirection}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">Atmospheric Force</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {formatTelemetryMetric(currentStation.pressure, 'pressure', unitSystem).primary}
            </span>
            <span className="text-[10px] text-slate-400">Barometric surface pressure</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col col-span-2 sm:col-span-1 hover:border-white/[0.18] transition-all">
            <span className="text-[11px] text-slate-400 font-medium">Local Station Clock</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {stationTime.time24}
            </span>
            <span className="text-[10px] text-sky-400">{stationTime.timezone}</span>
          </div>
        </div>
      </Card>

    </div>
  );
};
