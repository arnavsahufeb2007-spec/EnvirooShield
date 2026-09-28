import React, { useState, useEffect } from 'react';
import { StationData } from '../types';
import { PRESET_WORLD_CITIES, fetchGlobalAirQuality, GlobalLocationSearchResult } from '../services/airQualityApi';
import { getStationTimeInfo } from '../utils/timezoneUtils';
import { formatPM_CGS, formatPressure_CGS, formatWind_CGS, formatHeight_CGS } from '../utils/cgsUtils';

interface CityCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStation: StationData;
  onSelectStation: (loc: GlobalLocationSearchResult) => void;
}

export const CityCompareModal: React.FC<CityCompareModalProps> = ({
  isOpen,
  onClose,
  currentStation,
  onSelectStation
}) => {
  // Candidate city to compare against (defaults to Tokyo or London or New York if current is Tokyo)
  const defaultTarget = PRESET_WORLD_CITIES.find(
    (c) => c.name.toLowerCase() !== currentStation.name.toLowerCase() && c.id !== currentStation.id
  ) || PRESET_WORLD_CITIES[1];

  const [selectedTargetLoc, setSelectedTargetLoc] = useState<GlobalLocationSearchResult>(defaultTarget);
  const [targetStation, setTargetStation] = useState<StationData | null>(null);
  const [isLoadingTarget, setIsLoadingTarget] = useState(false);

  // Fetch target station data when selectedTargetLoc changes
  useEffect(() => {
    if (!isOpen || !selectedTargetLoc) return;

    let isMounted = true;
    setIsLoadingTarget(true);

    fetchGlobalAirQuality(selectedTargetLoc)
      .then((res) => {
        if (isMounted) {
          setTargetStation(res.station);
        }
      })
      .catch((err) => {
        console.error('Error fetching compare target station:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingTarget(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedTargetLoc]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Time calculations
  const now = new Date();
  const timeA = getStationTimeInfo(now, currentStation.timezone, currentStation.timezoneAbbr, currentStation.utcOffsetSeconds);
  const timeB = targetStation
    ? getStationTimeInfo(now, targetStation.timezone, targetStation.timezoneAbbr, targetStation.utcOffsetSeconds)
    : getStationTimeInfo(now, selectedTargetLoc.timezone);

  // Calculate time difference in minutes using utcOffsetHours
  const offsetDiffMinutes = Math.round((timeB.utcOffsetHours - timeA.utcOffsetHours) * 60);
  const diffHours = Math.floor(Math.abs(offsetDiffMinutes) / 60);
  const diffRemainingMinutes = Math.abs(offsetDiffMinutes) % 60;
  const isAhead = offsetDiffMinutes > 0;
  const isSame = offsetDiffMinutes === 0;

  const timeDifferenceText = isSame
    ? 'Same timezone'
    : `${diffHours > 0 ? `${diffHours}h ` : ''}${diffRemainingMinutes > 0 ? `${diffRemainingMinutes}m ` : ''}${
        isAhead ? 'ahead of' : 'behind'
      } ${currentStation.name.split(' ')[0]}`;

  // CGS metrics
  const pmA = formatPM_CGS(currentStation.pm25, 'PM2.5');
  const pmB = targetStation ? formatPM_CGS(targetStation.pm25, 'PM2.5') : null;

  const windA = formatWind_CGS(currentStation.windSpeedMS, currentStation.windDirection);
  const windB = targetStation ? formatWind_CGS(targetStation.windSpeedMS, targetStation.windDirection) : null;

  const heightA = formatHeight_CGS(currentStation.pblHeight);
  const heightB = targetStation ? formatHeight_CGS(targetStation.pblHeight) : null;

  // Comparison verdict
  const cleaner = targetStation
    ? targetStation.pm25 < currentStation.pm25
      ? targetStation
      : currentStation
    : currentStation;

  const dirtier = cleaner === currentStation ? targetStation : currentStation;
  const diffPct = dirtier && cleaner
    ? Math.round(((dirtier.pm25 - cleaner.pm25) / Math.max(1, dirtier.pm25)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#11141c] border border-[#272a30] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#272a30] bg-[#161a24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
            </div>
            <div>
              <h2 className="font-sans text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
                Side-by-Side City Atmospheric Comparison
                <span className="font-mono text-[10px] text-[#44e2cd] bg-[#44e2cd]/15 px-2 py-0.5 rounded border border-[#44e2cd]/30 font-bold">
                  LIVE CGS SYNC
                </span>
              </h2>
              <p className="font-sans text-[11px] text-[#87929a]">
                Compare live local clocks, thermal inversion ceilings, particulate densities, and health risks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1f2430] hover:bg-[#272a30] text-[#87929a] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Target City Selector Bar */}
        <div className="px-5 py-3 bg-[#131620] border-b border-[#272a30] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-[#87929a] font-bold uppercase tracking-wider">
            Compare <strong className="text-white">{currentStation.region}</strong> with:
          </span>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {PRESET_WORLD_CITIES.map((city) => {
              const isSelected = selectedTargetLoc.id === city.id;
              const isCurrent = currentStation.id === city.id;
              if (isCurrent) return null; // Don't compare with itself

              return (
                <button
                  key={city.id}
                  onClick={() => setSelectedTargetLoc(city)}
                  className={`px-2.5 py-1 rounded-lg font-sans text-[11px] font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#38bdf8] text-[#00354a] font-bold shadow-sm'
                      : 'bg-[#191d28] text-[#cbd5e1] hover:bg-[#252b38] hover:text-white border border-[#272a30]'
                  }`}
                >
                  <span>{city.flag}</span>
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body: Scrollable Comparison Grid */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          
          {/* Verdict Banner */}
          {targetStation && (
            <div className={`p-4 rounded-xl border flex items-center gap-3.5 ${
              diffPct > 0
                ? 'bg-[#131b26] border-[#38bdf8]/40'
                : 'bg-[#151922] border-[#272a30]'
            }`}>
              <span className="text-3xl shrink-0">
                {diffPct > 25 ? '⚖️' : '📊'}
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-[14px] font-bold text-white">
                  {cleaner.name.split(' ')[0]} has {diffPct}% cleaner air than {dirtier?.name.split(' ')[0]} right now
                </span>
                <span className="font-sans text-[12px] text-[#cbd5e1] mt-0.5 leading-relaxed">
                  {cleaner.name.split(' ')[0]} benefits from an inversion ceiling of{' '}
                  <strong className="text-[#44e2cd]">{((cleaner.pblHeight || 800) * 100).toLocaleString()} cm</strong> and wind velocity of{' '}
                  <strong className="text-[#44e2cd]">{((cleaner.windSpeedMS || 2) * 100).toFixed(0)} cm/s</strong>, allowing faster air dispersion.
                </span>
              </div>
            </div>
          )}

          {/* Side-by-Side Dual Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Column A: Active City */}
            <div className="p-4 rounded-xl bg-[#141822] border border-[#38bdf8]/40 flex flex-col gap-3.5 shadow-md">
              <div className="flex items-center justify-between border-b border-[#272a30] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{currentStation.flag || '🌍'}</span>
                  <div>
                    <span className="font-mono text-[9px] uppercase font-bold text-[#8ed5ff] tracking-wider block">
                      ACTIVE STATION
                    </span>
                    <h3 className="font-sans text-[18px] font-bold text-white tracking-tight leading-tight">
                      {currentStation.region}
                    </h3>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#38bdf8]/20 text-[#8ed5ff] font-bold">
                  {currentStation.code}
                </span>
              </div>

              {/* Local Clock */}
              <div className="p-3 rounded-lg bg-[#0e1219] border border-[#272a30] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{timeA.isNight ? '🌙' : '☀️'}</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-[#87929a] font-bold">
                      LOCAL CLOCK ({timeA.timezoneAbbr || timeA.utcOffsetStr})
                    </span>
                    <span className="font-mono text-[16px] font-extrabold text-white">
                      {timeA.time24} <span className="text-[12px] font-normal text-[#87929a]">({timeA.time12})</span>
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#cbd5e1]">
                  {timeA.dateStr.split(',')[0]}
                </span>
              </div>

              {/* Air Quality & Risk Score */}
              <div className="p-3 rounded-lg bg-[#0e1219] border border-[#272a30] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#87929a] font-bold">PHYSICAL RISK SCORE</span>
                  <span className="font-sans text-[26px] font-black text-white leading-tight">
                    {currentStation.riskScore} <span className="text-[14px] text-[#87929a] font-normal">/ 100</span>
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${pmA.statusBadge.bg} ${pmA.statusBadge.color} ${pmA.statusBadge.border}`}>
                  {currentStation.riskLabel}
                </span>
              </div>

              {/* Metric Breakdown */}
              <div className="flex flex-col gap-2 font-mono text-[12px]">
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">PM2.5 Density (CGS):</span>
                  <span className="text-white font-bold">{pmA.scientificNotation}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">PM2.5 (SI):</span>
                  <span className="text-[#e2e8f0] font-bold">{currentStation.pm25} µg/m³</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">Temperature:</span>
                  <span className="text-[#e2e8f0] font-bold">{currentStation.dryTemp} °C ({currentStation.humidity}% RH)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">Surface Wind:</span>
                  <span className="text-[#e2e8f0] font-bold">{windA.cgsFormatted}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#87929a]">Inversion Ceiling:</span>
                  <span className="text-[#e2e8f0] font-bold">{heightA.cgsFormatted}</span>
                </div>
              </div>
            </div>

            {/* Column B: Comparison Target City */}
            <div className="p-4 rounded-xl bg-[#141822] border border-[#272a30] flex flex-col gap-3.5 shadow-md relative">
              {isLoadingTarget && (
                <div className="absolute inset-0 bg-[#11141c]/80 backdrop-blur-xs flex items-center justify-center rounded-xl z-10">
                  <div className="flex items-center gap-2 font-mono text-[12px] text-[#38bdf8]">
                    <span className="w-4 h-4 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin"></span>
                    <span>Fetching live data for {selectedTargetLoc.name}...</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-[#272a30] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedTargetLoc.flag || '🌍'}</span>
                  <div>
                    <span className="font-mono text-[9px] uppercase font-bold text-[#44e2cd] tracking-wider block">
                      COMPARISON TARGET
                    </span>
                    <h3 className="font-sans text-[18px] font-bold text-white tracking-tight leading-tight">
                      {selectedTargetLoc.name}, {selectedTargetLoc.country}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelectStation(selectedTargetLoc);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#00354a] font-sans text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
                  title="Make this city the primary active monitoring station"
                >
                  Switch to Active
                </button>
              </div>

              {/* Local Clock */}
              <div className="p-3 rounded-lg bg-[#0e1219] border border-[#272a30] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{timeB.isNight ? '🌙' : '☀️'}</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] text-[#87929a] font-bold">
                      LOCAL CLOCK ({timeB.timezoneAbbr || timeB.utcOffsetStr})
                    </span>
                    <span className="font-mono text-[16px] font-extrabold text-white">
                      {timeB.time24} <span className="text-[12px] font-normal text-[#87929a]">({timeB.time12})</span>
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1f2633] text-[#8ed5ff] font-semibold">
                  {timeDifferenceText}
                </span>
              </div>

              {/* Air Quality & Risk Score */}
              <div className="p-3 rounded-lg bg-[#0e1219] border border-[#272a30] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#87929a] font-bold">PHYSICAL RISK SCORE</span>
                  <span className="font-sans text-[26px] font-black text-white leading-tight">
                    {targetStation ? targetStation.riskScore : '—'} <span className="text-[14px] text-[#87929a] font-normal">/ 100</span>
                  </span>
                </div>
                {pmB && (
                  <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border ${pmB.statusBadge.bg} ${pmB.statusBadge.color} ${pmB.statusBadge.border}`}>
                    {targetStation?.riskLabel}
                  </span>
                )}
              </div>

              {/* Metric Breakdown */}
              <div className="flex flex-col gap-2 font-mono text-[12px]">
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">PM2.5 Density (CGS):</span>
                  <span className="text-white font-bold">{pmB?.scientificNotation || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">PM2.5 (SI):</span>
                  <span className="text-[#e2e8f0] font-bold">{targetStation?.pm25 || '—'} µg/m³</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">Temperature:</span>
                  <span className="text-[#e2e8f0] font-bold">{targetStation?.dryTemp || '—'} °C ({targetStation?.humidity || '—'}% RH)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#1f2633]">
                  <span className="text-[#87929a]">Surface Wind:</span>
                  <span className="text-[#e2e8f0] font-bold">{windB?.cgsFormatted || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#87929a]">Inversion Ceiling:</span>
                  <span className="text-[#e2e8f0] font-bold">{heightB?.cgsFormatted || '—'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#161a24] border-t border-[#272a30] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-[#87929a] text-center sm:text-left">
            Comparing live feeds using Open-Meteo atmospheric dispersion physics models.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#1f2430] hover:bg-[#272a30] text-[#cbd5e1] hover:text-white font-sans text-[12px] font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            {targetStation && (
              <button
                onClick={() => {
                  onSelectStation(selectedTargetLoc);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#00354a] font-sans text-[12px] font-bold transition-colors shadow cursor-pointer flex items-center gap-1.5"
              >
                <span>Switch to {selectedTargetLoc.name}</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
