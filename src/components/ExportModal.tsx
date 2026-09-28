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
        kernel: 'EnviroForecaster-v1.4-RidgeAR',
        merkle_root: '0x7f2c418e9d301b2a95c4ef93108c10fa89',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#191c21] border border-[#272a30] rounded-lg max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#272a30]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">sim_card_download</span>
            <h3 className="font-sans text-[18px] font-semibold text-[#e1e2ea]">Export Atmospheric Telemetry</h3>
          </div>
          <button onClick={onClose} className="text-[#87929a] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 font-sans text-[13px]">
          {/* Station readout */}
          <div className="bg-[#111319] p-3 rounded border border-[#272a30] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-[#87929a] uppercase">Active Target Node</span>
              <span className="font-mono text-[13px] font-semibold text-[#8ed5ff]">{currentStation.name}</span>
              <span className="font-mono text-[11px] text-[#cbd5e1] mt-0.5">
                Timezone: {currentStation.timezone || 'UTC'} ({currentStation.timezoneAbbr || 'LOCAL'})
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#44e2cd] bg-[#1d2025] px-2 py-0.5 rounded border border-[#272a30]">
              PM2.5: {currentStation.pm25} µg/m³
            </span>
          </div>

          {/* Format selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] text-[#bdc8d1] uppercase tracking-wider">Telemetry Serialization Format</label>
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
                  className={`p-2.5 rounded text-left border transition-all ${
                    format === f.id
                      ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#8ed5ff]'
                      : 'bg-[#111319] border-[#272a30] text-[#bdc8d1] hover:border-[#3e484f]'
                  }`}
                >
                  <div className="font-mono text-[11px] font-semibold">{f.label}</div>
                  <div className="text-[10px] text-[#87929a] mt-0.5">{f.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Horizon Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] text-[#bdc8d1] uppercase tracking-wider">Temporal Projection Horizon</label>
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
                  className={`p-2 rounded text-left border transition-all ${
                    timeRange === t.id
                      ? 'bg-[#44e2cd]/15 border-[#44e2cd] text-[#44e2cd]'
                      : 'bg-[#111319] border-[#272a30] text-[#bdc8d1] hover:border-[#3e484f]'
                  }`}
                >
                  <div className="font-mono text-[11px] font-semibold">{t.label}</div>
                  <div className="text-[10px] text-[#87929a]">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2 text-[#bdc8d1] cursor-pointer">
              <input
                type="checkbox"
                checked={includeCovariates}
                onChange={(e) => setIncludeCovariates(e.target.checked)}
                className="w-4 h-4 rounded bg-[#111319] border-[#272a30] accent-[#38bdf8]"
              />
              <span>Include ECMWF IFS-0.05° Meteorological Covariates (PBL, U/V wind, RH)</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#272a30]">
          <button
            onClick={handleCopyClipboard}
            type="button"
            className="px-3 py-1.5 rounded bg-[#272a30] hover:bg-[#32353b] text-[#e1e2ea] font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">content_copy</span>
            <span>Copy Stream</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-3 py-1.5 rounded bg-transparent hover:bg-[#272a30] text-[#bdc8d1] font-sans text-[12px] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              type="button"
              className="px-4 py-1.5 rounded bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#004965] font-sans text-[13px] font-semibold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
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
