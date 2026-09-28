import React, { useState } from 'react';
import { StationData, HourlyForecastRow, UnitSystem } from '../types';
import { HOURLY_FORECAST_DATA } from '../data/mockData';
import { useStationTime } from '../utils/timezoneUtils';
import { calculateAQI, getAQICategory, formatTelemetryMetric } from '../utils/aqiUtils';
import { Card } from '../components/ui/Card';

interface ForecastEngineScreenProps {
  station: StationData;
  onOpenHyperparameters: () => void;
  onOpenExport: () => void;
  onNotify: (title: string, description: string) => void;
  unitSystem?: UnitSystem;
  simpleMode?: boolean;
  hourlyForecast?: HourlyForecastRow[];
}

export const ForecastEngineScreen: React.FC<ForecastEngineScreenProps> = ({
  station,
  onOpenHyperparameters,
  onOpenExport,
  onNotify,
  unitSystem = 'standard',
  hourlyForecast
}) => {
  const stationTime = useStationTime(station);
  const forecastData: HourlyForecastRow[] =
    hourlyForecast && hourlyForecast.length > 0 ? hourlyForecast : HOURLY_FORECAST_DATA;

  // Selected scrubber index
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectedRow = forecastData[selectedIndex] || forecastData[0];

  // Dynamically compute milestones
  const peakRow = forecastData.reduce(
    (prev, curr) => (curr.pm25 > prev.pm25 ? curr : prev),
    forecastData[0]
  );
  const reliefRow = forecastData[forecastData.length - 1];

  const selectedAqi = calculateAQI(selectedRow.pm25);
  const selectedAqiCat = getAQICategory(selectedAqi);

  const pm25Metric = formatTelemetryMetric(selectedRow.pm25, 'pm25', unitSystem);
  const pblMetric = formatTelemetryMetric(selectedRow.pblHeight, 'pblHeight', unitSystem);

  const handleDownloadCsv = () => {
    const headers = 'Horizon,LocalTime,PM2.5(ug/m3),AQI,Temp(C),Humidity(%),Wind,PBLHeight(m)\n';
    const rows = forecastData
      .map(
        (r) =>
          `"${r.horizon}","${r.localTimeFormatted || r.timestamp}",${r.pm25},${calculateAQI(r.pm25)},${r.temp},${r.humidity},"${r.windVector}",${r.pblHeight}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${station.code}_48h_forecast.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Export Complete', '48-hour forecast CSV downloaded successfully.');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6 relative">
      
      {/* 1. Header & Horizon Title */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up stagger-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400 text-[24px]">timeline</span>
            <h1 className="text-[22px] sm:text-[24px] font-bold text-white tracking-tight">
              48-Hour Atmospheric Forecast Engine
            </h1>
          </div>
          <p className="text-[13px] text-slate-400 mt-1">
            Hour-by-hour boundary layer compression, particulate dispersion, and wind trajectories for{' '}
            <strong className="text-white">{station.region}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={onOpenHyperparameters}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-slate-300 hover:text-white text-[12px] font-medium transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md shadow-xs"
            title="Adjust boundary layer and meteorological forecast parameters"
          >
            <span className="material-symbols-outlined text-[16px] text-sky-400">tune</span>
            <span>Tuning Parameters</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_2px_12px_rgba(56,189,248,0.35)] hover:shadow-[0_4px_20px_rgba(56,189,248,0.5)] hover:-translate-y-0.5"
            title="Download complete 48-hour data table as CSV"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download CSV</span>
          </button>
        </div>
      </Card>

      {/* 2. Three Critical Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 animate-fade-in-up stagger-2">
        {/* Milestone 1: Current Baseline */}
        <Card variant="interactive" className="p-5 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-sky-400 px-2 py-0.5 rounded-full bg-sky-500/10">
                Milestone 1 • Now (T+0)
              </span>
              <span className="text-[11px] font-mono text-slate-400">{stationTime.time24}</span>
            </div>
            <div className="text-[18px] font-bold text-white mt-1">
              Current Baseline: {station.pm25.toFixed(1)} µg/m³
            </div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Thermal inversion ceiling holding at {station.pblHeight}m with surface winds at {station.windSpeedMS} m/s ({station.windDirection}).
            </p>
          </div>
          <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Status:</span>
            <span className="text-sky-400 font-semibold">{station.riskLabel}</span>
          </div>
        </Card>

        {/* Milestone 2: Peak Smog Spike */}
        <Card variant="interactive" className="p-5 flex flex-col justify-between gap-3 border-rose-500/30 bg-rose-950/20 hover:border-rose-500/50 hover:shadow-[0_8px_25px_rgba(239,68,68,0.2)]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400 px-2 py-0.5 rounded-full bg-rose-500/20">
                Milestone 2 • Projected Peak
              </span>
              <span className="text-[11px] font-mono text-rose-300">
                {peakRow.localTimeFormatted || peakRow.horizon}
              </span>
            </div>
            <div className="text-[18px] font-bold text-rose-200 mt-1">
              Smog Spike: {peakRow.pm25} µg/m³ [AQI {calculateAQI(peakRow.pm25)}]
            </div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Boundary layer compresses down to {peakRow.pblHeight}m with calm wind vector {peakRow.windVector}. Maximum particulate entrapment.
            </p>
          </div>
          <div className="pt-2.5 border-t border-rose-500/20 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Category:</span>
            <span className="text-rose-400 font-semibold">{getAQICategory(calculateAQI(peakRow.pm25)).label}</span>
          </div>
        </Card>

        {/* Milestone 3: Fresh Air Relief */}
        <Card variant="interactive" className="p-5 flex flex-col justify-between gap-3 border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/50 hover:shadow-[0_8px_25px_rgba(16,185,129,0.2)]">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20">
                Milestone 3 • Fresh Air Relief
              </span>
              <span className="text-[11px] font-mono text-emerald-300">
                {reliefRow.localTimeFormatted || reliefRow.horizon}
              </span>
            </div>
            <div className="text-[18px] font-bold text-emerald-200 mt-1">
              Clearing Front: {reliefRow.pm25} µg/m³
            </div>
            <p className="text-[12px] text-slate-300 leading-relaxed">
              Atmospheric mixing height expands to {reliefRow.pblHeight}m with brisk dispersion winds at {reliefRow.windVector}.
            </p>
          </div>
          <div className="pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Outlook:</span>
            <span className="text-emerald-400 font-semibold">Clean Front Arrival</span>
          </div>
        </Card>
      </div>

      {/* 3. Interactive Timeline Scrubber & Hour Inspector */}
      <Card variant="elevated" className="p-5 sm:p-7 flex flex-col gap-6 animate-fade-in-up stagger-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-400 text-[20px]">tune</span>
              Interactive Timeline Scrubber
            </h2>
            <p className="text-[12px] text-slate-400">
              Drag the scrubber to inspect projected atmospheric conditions for any of the next 48 hours
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-300 font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
              Selected: <strong className="text-sky-300">{selectedRow.horizon}</strong> ({selectedRow.localTimeFormatted || selectedRow.timestamp})
            </span>
          </div>
        </div>

        {/* Selected Hour Telemetry Inspector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Projected AQI</span>
            <span className="text-[22px] font-bold text-white font-sans mt-0.5">
              {selectedAqi}
            </span>
            <span className={`text-[10px] font-semibold ${selectedAqiCat.textColor}`}>
              {selectedAqiCat.label}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">PM2.5 Level</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {pm25Metric.primary}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              CI: [{selectedRow.ciLower} - {selectedRow.ciUpper}]
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Boundary Layer (PBL)</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {pblMetric.primary}
            </span>
            <span className="text-[10px] text-slate-400">
              {selectedRow.pblHeight < 700 ? 'Inversion Cap' : 'Active Mixing'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Surface Wind</span>
            <span className="text-[20px] font-bold text-white font-mono mt-0.5">
              {selectedRow.windVector}
            </span>
            <span className="text-[10px] text-slate-400">
              Vector: {selectedRow.windAngle}°
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Temperature</span>
            <span className="text-[20px] font-bold text-white font-sans mt-0.5">
              {selectedRow.temp.toFixed(1)} °C
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {((selectedRow.temp * 9) / 5 + 32).toFixed(0)} °F
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex flex-col">
            <span className="text-[11px] text-slate-400 font-medium">Relative Moisture</span>
            <span className="text-[20px] font-bold text-white font-sans mt-0.5">
              {selectedRow.humidity}%
            </span>
            <span className="text-[10px] text-slate-400">
              {selectedRow.humidity > 65 ? 'Haze Swelling' : 'Dry Particle'}
            </span>
          </div>
        </div>

        {/* Range Scrubber Slider */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex justify-between items-center text-[12px] font-medium text-slate-400">
            <span>Now (T+0h)</span>
            <span className="text-sky-300 font-mono font-semibold">
              Current Scrubber: {selectedRow.horizon} ({selectedRow.localTimeFormatted || selectedRow.timestamp})
            </span>
            <span>T+48h (Relief)</span>
          </div>

          <input
            type="range"
            min={0}
            max={forecastData.length - 1}
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-sky-400 hover:bg-white/[0.12] transition-colors"
          />

          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
            {forecastData.filter((_, idx) => idx % 4 === 0).map((row, idx) => (
              <span key={idx}>{row.horizon}</span>
            ))}
          </div>
        </div>

        {/* Diagnostic Narrative for Selected Hour */}
        <div className="p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] flex items-start gap-3.5">
          <span className="material-symbols-outlined text-sky-400 text-[22px] shrink-0 mt-0.5">
            insights
          </span>
          <div className="flex flex-col gap-0.5 text-[13px]">
            <span className="text-white font-semibold">
              Atmospheric Prognosis for {selectedRow.horizon} ({selectedRow.localTimeFormatted || selectedRow.timestamp}):
            </span>
            <p className="text-slate-300 leading-relaxed">
              At this hour, PM2.5 particulate mass is projected at <strong className="text-white">{pm25Metric.primary}</strong>{' '}
              with an estimated <strong className={selectedAqiCat.textColor}>AQI of {selectedAqi} ({selectedAqiCat.label})</strong>.{' '}
              {selectedRow.pblNote || 'Diurnal boundary layer progression.'}{' '}
              Surface winds at {selectedRow.windVector} will{' '}
              {selectedRow.pm25 > 80 ? 'limit horizontal transport and trap smog.' : 'provide steady ventilation.'}
            </p>
          </div>
        </div>
      </Card>

      {/* 4. Complete 48-Hour Data Ledger */}
      <Card variant="elevated" className="p-5 sm:p-6 flex flex-col gap-4 animate-fade-in-up stagger-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold text-white tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-400 text-[20px]">table_rows</span>
              Complete 48-Hour Hourly Ledger
            </h2>
            <p className="text-[12px] text-slate-400">
              Verifiable hourly projections generated from numerical boundary layer modeling
            </p>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            {forecastData.length} Total Timesteps
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-white/[0.08]">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-white/[0.04] backdrop-blur-md border-b border-white/[0.08] text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Horizon</th>
                <th className="py-2.5 px-3">Local Time</th>
                <th className="py-2.5 px-3">PM2.5 ({unitSystem === 'standard' ? 'µg/m³' : 'g/cm³'})</th>
                <th className="py-2.5 px-3">AQI Status</th>
                <th className="py-2.5 px-3">Boundary Layer</th>
                <th className="py-2.5 px-3">Wind Vector</th>
                <th className="py-2.5 px-3">Temp / RH</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-mono">
              {forecastData.map((row, idx) => {
                const rowAqi = calculateAQI(row.pm25);
                const rowCat = getAQICategory(rowAqi);
                const isSelected = idx === selectedIndex;
                const isPeak = row.pm25 === peakRow.pm25;

                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-500/15 text-white'
                        : isPeak
                        ? 'bg-rose-950/25 text-rose-200 hover:bg-rose-900/35'
                        : 'hover:bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-sky-400">
                      {row.horizon}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200">
                      {row.localTimeFormatted || row.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {unitSystem === 'scientific'
                        ? `${(row.pm25 * 1e-12).toExponential(2)}`
                        : `${row.pm25.toFixed(1)}`}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${rowCat.bgColor} ${rowCat.textColor} ${rowCat.borderColor}`}
                      >
                        AQI {rowAqi} • {rowCat.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {row.pblHeight} m {row.pblHeight < 700 ? '⚠️' : ''}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {row.windVector}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {row.temp}°C • {row.humidity}%
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex(idx);
                        }}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-colors ${
                          isSelected ? 'bg-sky-500 text-slate-950 font-bold' : 'text-sky-400 hover:underline'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
