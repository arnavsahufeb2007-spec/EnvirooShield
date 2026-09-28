import React from 'react';
import { UnitSystem } from '../../types';

interface UnitToggleProps {
  unitSystem: UnitSystem;
  onToggle: (val: UnitSystem) => void;
  className?: string;
}

export const UnitToggle: React.FC<UnitToggleProps> = ({
  unitSystem,
  onToggle,
  className = ''
}) => {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] text-[11px] font-medium shadow-inner ${className}`}
      role="group"
      aria-label="Unit system selector"
    >
      <button
        type="button"
        onClick={() => onToggle('standard')}
        className={`px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
          unitSystem === 'standard'
            ? 'bg-gradient-to-r from-sky-400 to-sky-500 text-slate-950 font-bold shadow-[0_2px_12px_rgba(56,189,248,0.4)] scale-[1.02]'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.08] hover:scale-[1.02] hover:-translate-y-0.5'
        }`}
        title="Universal Air Quality Index (AQI) and SI units (µg/m³, hPa, km/h)"
      >
        <span className="material-symbols-outlined text-[14px]">speed</span>
        <span>Standard (AQI)</span>
      </button>

      <button
        type="button"
        onClick={() => onToggle('scientific')}
        className={`px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
          unitSystem === 'scientific'
            ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-slate-950 font-bold shadow-[0_2px_12px_rgba(68,226,205,0.4)] scale-[1.02]'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.08] hover:scale-[1.02] hover:-translate-y-0.5'
        }`}
        title="Scientific CGS Units (g/cm³, dyn/cm², cm/s)"
      >
        <span className="material-symbols-outlined text-[14px]">science</span>
        <span>CGS Physics</span>
      </button>
    </div>
  );
};
