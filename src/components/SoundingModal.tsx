import React from 'react';
import { StationData } from '../types';

interface SoundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: StationData;
}

export const SoundingModal: React.FC<SoundingModalProps> = ({ isOpen, onClose, station }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#191c21] border border-[#272a30] rounded-lg max-w-4xl w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#272a30]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8ed5ff] text-[22px]">vertical_shades_closed</span>
            <div>
              <h3 className="font-sans text-[18px] font-semibold text-[#e1e2ea]">
                Full Vertical Atmospheric Radiosonde Sounding
              </h3>
              <span className="font-mono text-[11px] text-[#87929a]">
                Station {station.code} • WMO Id: 42182 • Sensor: Vaisala RS41-SGP
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#87929a] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Top Sounding Parameters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111319] p-3 rounded border border-[#272a30] font-mono text-[11px]">
          <div>
            <span className="text-[#87929a] block">INVERSION BASE:</span>
            <span className="text-[#ffb4ab] font-bold text-[14px]">620 m ASL</span>
          </div>
          <div>
            <span className="text-[#87929a] block">CAPE (CONVECTIVE):</span>
            <span className="text-[#44e2cd] font-bold text-[14px]">420 J/kg</span>
          </div>
          <div>
            <span className="text-[#87929a] block">CIN (INHIBITION):</span>
            <span className="text-[#8ed5ff] font-bold text-[14px]">-182 J/kg</span>
          </div>
          <div>
            <span className="text-[#87929a] block">LCL (CONDENSATION):</span>
            <span className="text-[#e1e2ea] font-bold text-[14px]">780 m AGL</span>
          </div>
        </div>

        {/* Skew-T Sounding SVG Chart */}
        <div className="relative w-full h-80 bg-[#0b0e13] rounded border border-[#272a30] p-4 flex flex-col justify-between overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
            <defs>
              <pattern id="skewGrid" width="80" height="40" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#272a30" strokeWidth="0.8" strokeDasharray="2,2"/>
              </pattern>
            </defs>
            <rect width="800" height="320" fill="url(#skewGrid)" />

            {/* Pressure Levels & Heights */}
            <line x1="0" y1="280" x2="800" y2="280" stroke="#3e484f" strokeWidth="1" strokeDasharray="3,3" />
            <text x="10" y="275" fill="#87929a" className="font-mono text-[10px]">1000 hPa (Surface: 216m)</text>

            <line x1="0" y1="220" x2="800" y2="220" stroke="#3e484f" strokeWidth="1" strokeDasharray="3,3" />
            <text x="10" y="215" fill="#87929a" className="font-mono text-[10px]">925 hPa (750m)</text>

            <line x1="0" y1="160" x2="800" y2="160" stroke="#3e484f" strokeWidth="1" strokeDasharray="3,3" />
            <text x="10" y="155" fill="#87929a" className="font-mono text-[10px]">850 hPa (1,500m)</text>

            <line x1="0" y1="100" x2="800" y2="100" stroke="#3e484f" strokeWidth="1" strokeDasharray="3,3" />
            <text x="10" y="95" fill="#87929a" className="font-mono text-[10px]">700 hPa (3,100m)</text>

            <line x1="0" y1="40" x2="800" y2="40" stroke="#3e484f" strokeWidth="1" strokeDasharray="3,3" />
            <text x="10" y="35" fill="#87929a" className="font-mono text-[10px]">500 hPa (5,800m Free Tropo)</text>

            {/* Inversion Cap Layer Shading */}
            <rect x="0" y="225" width="800" height="25" fill="#ffb4ab" fillOpacity="0.12" />
            <line x1="0" y1="237" x2="800" y2="237" stroke="#ffb4ab" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="400" y="234" fill="#ffb4ab" textAnchor="middle" className="font-mono text-[11px] font-bold">
              THERMAL INVERSION LAYER (dT/dz = +3.2°C/100m) • STAGNATION TRAP
            </text>

            {/* Dry Adiabat / Temperature Curve (Red/Amber) */}
            <path
              d="M 520,290 C 500,250 540,230 480,210 C 420,180 340,110 260,30"
              fill="none"
              stroke="#ffb4ab"
              strokeWidth="2.5"
            />

            {/* Dew Point Curve (Teal/Cyan) */}
            <path
              d="M 440,290 C 430,250 460,230 380,210 C 310,180 230,110 160,30"
              fill="none"
              stroke="#44e2cd"
              strokeWidth="2"
              strokeDasharray="4,2"
            />

            {/* Wind Barbs on Right Margin */}
            <g stroke="#8ed5ff" strokeWidth="1.2">
              {/* Surface Wind Barb */}
              <line x1="750" y1="280" x2="780" y2="280" />
              <line x1="770" y1="280" x2="775" y2="270" />
              {/* 925 hPa */}
              <line x1="750" y1="220" x2="780" y2="220" />
              <line x1="765" y1="220" x2="770" y2="210" />
              {/* 850 hPa */}
              <line x1="750" y1="160" x2="780" y2="160" />
              <line x1="760" y1="160" x2="770" y2="150" />
              <line x1="770" y1="160" x2="780" y2="150" />
              {/* 700 hPa */}
              <line x1="750" y1="100" x2="780" y2="100" />
              <line x1="760" y1="100" x2="770" y2="90" />
              <line x1="770" y1="100" x2="780" y2="90" />
            </g>
          </svg>

          <div className="flex items-center justify-between text-[#bdc8d1] font-mono text-[11px] px-2 bg-[#111319]/80 py-1 rounded">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#ffb4ab] inline-block"></span> Dry Bulb Temperature (T)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#44e2cd] inline-block border-b border-dashed"></span> Dew Point (Td)
            </span>
            <span className="text-[#8ed5ff]">Wind Vector Shear Column</span>
          </div>
        </div>

        {/* Diagnostic Assessment Text */}
        <div className="bg-[#111319] p-4 rounded border border-[#272a30] text-[13px] leading-relaxed text-[#bdc8d1]">
          <strong className="text-white">Synoptic Sounding Verdict:</strong> Extreme radiational cooling in the nocturnal boundary layer created an intense thermal inversion lid at 620m AMSL with positive lapse rate (+3.2°C per 100m). Mechanical turbulence is severely dampened (Ri = 0.42 &gt; critical threshold 0.25). Particulate matter remains locked near the surface until convective boundary layer growth initiates after 11:30 UTC.
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#38bdf8] text-[#004965] font-semibold text-[13px] hover:bg-[#8ed5ff] transition-colors"
          >
            Close Sounding
          </button>
        </div>
      </div>
    </div>
  );
};
