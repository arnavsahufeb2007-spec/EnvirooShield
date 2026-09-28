import React from 'react';

interface FooterProps {
  onCopyHash?: (text: string, label: string) => void;
  onSelectStation?: (stationId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectStation }) => {
  return (
    <footer className="w-full bg-[#080a0f] border-t border-slate-800/80 mt-16 text-slate-400">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-[13px]">
          
          {/* Col 1: Platform Overview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white font-bold text-[15px]">
              <span className="material-symbols-outlined text-sky-400 text-[20px]">air</span>
              <span>EnviroShield Platform</span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-400">
              High-precision planetary atmospheric computation, 48-hour photochemical forecasting, and transparent physical boundary layer dispersion modeling.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Engine Version: v4.8 • React 19 + TypeScript
            </div>
          </div>

          {/* Col 2: Ingestion & Data Partners */}
          <div className="flex flex-col gap-3">
            <span className="text-white font-semibold text-[13px] tracking-wide uppercase font-mono">
              Scientific Data Sources
            </span>
            <ul className="flex flex-col gap-2 text-[12px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Open-Meteo Global Air Quality API</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>Copernicus Atmosphere Service (CAMS)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>NOAA Global Forecast System (GFS)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>WHO 2021 Air Quality Benchmarks</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Monitoring Nodes */}
          <div className="flex flex-col gap-3">
            <span className="text-white font-semibold text-[13px] tracking-wide uppercase font-mono">
              Global Station Network
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[12px]">
              {[
                { id: 'delhi', name: '🇮🇳 Delhi' },
                { id: 'tokyo', name: '🇯🇵 Tokyo' },
                { id: 'new-york', name: '🇺🇸 New York' },
                { id: 'london', name: '🇬🇧 London' },
                { id: 'paris', name: '🇫🇷 Paris' },
                { id: 'cairo', name: '🇪🇬 Cairo' },
                { id: 'mumbai', name: '🇮🇳 Mumbai' },
                { id: 'sao-paulo', name: '🇧🇷 São Paulo' }
              ].map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => onSelectStation && onSelectStation(city.id)}
                  className="text-left text-slate-400 hover:text-sky-400 transition-colors cursor-pointer py-0.5"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Open Access & Standards */}
          <div className="flex flex-col gap-3">
            <span className="text-white font-semibold text-[13px] tracking-wide uppercase font-mono">
              Open Standards & Integrity
            </span>
            <p className="text-[12px] leading-relaxed text-slate-400">
              All physical models adhere to open scientific standards. Real-time measurements are ingested directly from continuous in-situ monitoring stations and numerical forecast ensembles.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>100% Deterministic Physics</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-500">
          <div>
            © {new Date().getFullYear()} EnviroShield Atmospheric Intelligence. Open scientific platform.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 transition-colors">Privacy & Data Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors">Methodology Citation</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors">Open Source Core</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
