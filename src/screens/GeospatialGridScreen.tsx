import React from 'react';
import { StationData, StationId, UnitSystem } from '../types';
import { STATIONS } from '../data/mockData';
import { useStationTime } from '../utils/timezoneUtils';
import { calculateAQI, getAQICategory, formatTelemetryMetric } from '../utils/aqiUtils';
import { Card } from '../components/ui/Card';
import { MapAreaPicker } from '../components/MapAreaPicker';

interface GeospatialGridScreenProps {
  currentStation: StationData;
  onSelectStation: (id: StationId) => void;
  onOpenSounding: () => void;
  onNotify: (title: string, description: string) => void;
  unitSystem?: UnitSystem;
  simpleMode?: boolean;
  onSelectMapPoint: (lat: number, lng: number) => void;
  isLoadingLocation?: boolean;
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
  onSelectMapPoint,
  isLoadingLocation = false,
  unitSystem = 'standard'
}) => {
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

      {/* 2. Google Maps embed: location basemap, not an AQI or plume overlay. */}
      <Card variant="elevated" className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Select an area · {currentStation.region}</h2>
            <p className="mt-1 text-xs text-slate-400">
              Click the map to choose any area and load environmental data. Open the same coordinates in Google Maps using the link.
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${currentStation.lat},${currentStation.lng}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Open in Google Maps ↗
          </a>
        </div>
        <MapAreaPicker
          lat={currentStation.lat}
          lng={currentStation.lng}
          onConfirm={({ lat, lng }) => onSelectMapPoint(lat, lng)}
          isLoading={isLoadingLocation}
        />
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
