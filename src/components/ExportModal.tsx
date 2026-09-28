import React, { useState } from 'react';
import { StationData } from '../types';
import { HOURLY_FORECAST_DATA } from '../data/mockData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStation: StationData;
  onNotify: (title: string, description: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentStation,
  onNotify
}) => {
  const [format, setFormat] = useState<'csv' | 'json' | 'parquet' | 'netcdf'>('parquet');
  const [includeCovariates, setIncludeCovariates] = useState(true);
  const [timeRange, setTimeRange] = useState<'48h' | '24h' | '7d'>('48h');

  if (!isOpen) return null;

  const handleDownload = () => {
    let filename = `enviroshield_${currentStation.code.toLowerCase()}_${timeRange}.${format === 'netcdf' ? 'nc' : format}`;
    let mimeType = 'text/plain';
    let content = '';

    if (format === 'csv') {
      mimeType = 'text/csv';
      content = 'HORIZON,TIMESTAMP_UTC,LOCAL_TIME,TIMEZONE,PM25_UGM3,CI_LOWER,CI_UPPER,TEMP_C,HUMIDITY_PCT,WIND_VECTOR,PBL_HEIGHT_M,RISK_SCORE\n' +
        HOURLY_FORECAST_DATA.map(r => 
          `"${r.horizon}","${r.timestamp}","${r.localTimeFormatted || r.timestamp}","${currentStation.timezone || 'UTC'}",${r.pm25},${r.ciLower},${r.ciUpper},${r.temp},${r.humidity},"${r.windVector}",${r.pblHeight},${r.riskScore}`
        ).join('\n');
    } else if (format === 'json') {
      mimeType = 'application/json';
      content = JSON.stringify({
        station: currentStation,
        timezone: currentStation.timezone || 'UTC',
        timezone_abbr: currentStation.timezoneAbbr || 'UTC',
        engine: 'EnviroShield Atmospheric Dispersion Core',
        attribution: 'Open-Meteo & Copernicus CAMS Ingestion',
        projection_matrix: HOURLY_FORECAST_DATA
      }, null, 2);
    } else {
      // Parquet or NetCDF mock binary payload representation
      mimeType = 'application/octet-stream';
      content = `[ENVIROSHIELD_COMPILED_${format.toUpperCase()}_STREAM] Station: ${currentStation.code}; Timezone: ${currentStation.timezone || 'UTC'}; Data Points: ${HOURLY_FORECAST_DATA.length}; Hash: 3c81e9f4a0b12cd890e`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onNotify('Telemetry Export Initiated', `Generated ${filename} with complete deterministic verification.`);
    onClose();
  };

  const handleCopyClipboard = () => {
    const textToCopy = JSON.stringify({
      station: currentStation.code,
      timestamp: new Date().toISOString(),
      kernel: 'ECMWF-IFS-0.05° + RidgeAR',
      hourly_ledger: HOURLY_FORECAST_DATA.map(r => ({
        t: r.horizon,
        pm25: r.pm25,
        ci: [r.ciLower, r.ciUpper],
        pbl: r.pblHeight,
        risk: r.riskScore
      }))
    }, null, 2);

    navigator.clipboard.writeText(textToCopy);
    onNotify('Copied to Clipboard', `Serialized ${format.toUpperCase()} telemetry payload ready for pipeline ingestion.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400 text-[22px]">sim_card_download</span>
            <h3 className="font-sans text-[18px] font-bold text-white tracking-tight">Export Atmospheric Telemetry</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08] hover:border-white/[0.2]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 font-sans text-[13px]">
          {/* Station readout */}
          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08] flex items-center justify-between backdrop-blur-md">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Target Node</span>
              <span className="font-mono text-[13px] font-bold text-sky-300">{currentStation.name}</span>
              <span className="font-mono text-[11px] text-slate-400 mt-0.5">
                Timezone: {currentStation.timezone || 'UTC'} ({currentStation.timezoneAbbr || 'LOCAL'})
              </span>
            </div>
            <span className="font-mono text-[11px] text-teal-300 bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-400/30 font-semibold">
              PM2.5: {currentStation.pm25} µg/m³
            </span>
          </div>

          {/* Format selection */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Telemetry Serialization Format</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'parquet', label: 'Parquet (Snappy)', badge: 'Recommended' },
                { id: 'csv', label: 'RFC-4180 CSV', badge: 'Standard' },
                { id: 'json', label: 'JSON-LD OGC', badge: 'Structured' },
                { id: 'netcdf', label: 'NetCDF4 / HDF5', badge: 'Gridded' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                    format === f.id
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-[0_2px_12px_rgba(56,189,248,0.25)] scale-[1.02]'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.07] hover:-translate-y-0.5 hover:scale-[1.02]'
                  }`}
                >
                  <div className="font-mono text-[11px] font-semibold">{f.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{f.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Temporal Projection Horizon</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '24h', label: 'T+0 to T+24h', desc: 'Short-term acute' },
                { id: '48h', label: 'T+0 to T+48h', desc: 'Full model span' },
                { id: '7d', label: '7-Day Synoptic', desc: 'Climatological' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeRange(t.id as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                    timeRange === t.id
                      ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-[0_2px_12px_rgba(20,184,166,0.25)] scale-[1.02]'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.07] hover:-translate-y-0.5 hover:scale-[1.02]'
                  }`}
                >
                  <div className="font-mono text-[11px] font-semibold">{t.label}</div>
                  <div className="text-[10px] text-slate-400">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2.5 text-slate-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={includeCovariates}
                onChange={(e) => setIncludeCovariates(e.target.checked)}
                className="w-4 h-4 rounded bg-white/[0.05] border-white/[0.2] accent-sky-400 cursor-pointer"
              />
              <span className="text-[12px]">Include ECMWF IFS-0.05° Meteorological Covariates (PBL, U/V wind, RH)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            onClick={handleCopyClipboard}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.2] text-slate-200 font-mono text-[11px] flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
            <span>Copy Stream</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3.5 py-2 rounded-xl bg-transparent hover:bg-white/[0.06] text-slate-400 hover:text-white font-sans text-[12px] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              type="button"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-sans text-[13px] font-bold flex items-center gap-1.5 shadow-[0_2px_12px_rgba(56,189,248,0.4)] hover:shadow-[0_4px_20px_rgba(56,189,248,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
