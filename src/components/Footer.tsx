import React from 'react';

interface FooterProps {
  onCopyHash: (text: string, label: string) => void;
  onSelectStation?: (stationId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCopyHash, onSelectStation }) => {
  const merkleRoot = '0x7f2c418e9d301b2a95c4ef93108c10fa89';

  return (
    <footer className="w-full bg-[#0b0e13] border-t border-[#272a30]/60 mt-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">verified</span>
              <span className="font-mono text-[11px] font-semibold text-[#e1e2ea] uppercase tracking-wider">
                Institutional Affiliation
              </span>
            </div>
            <p className="font-sans text-[12px] leading-relaxed text-[#bdc8d1]">
              Data ingested under sovereign scientific agreements with ECMWF Integrated Forecasting System, Copernicus Atmosphere Monitoring Service (CAMS), and WMO Global Atmosphere Watch (GAW) Urban Research Meteorological & Environment (GURME) initiatives.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#44e2cd] text-[18px]">enhanced_encryption</span>
              <span className="font-mono text-[11px] font-semibold text-[#e1e2ea] uppercase tracking-wider">
                Cryptographic Verification
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#bdc8d1] flex flex-col gap-1.5">
              <span className="text-[#87929a]">MERKLE_ROOT_SHA256:</span>
              <button
                type="button"
                onClick={() => onCopyHash(merkleRoot, 'Merkle Root SHA-256')}
                title="Click to copy SHA-256 Hash"
                className="text-left text-[#8ed5ff] break-all bg-[#191c21] hover:bg-[#272a30] p-2 rounded border border-[#272a30] transition-colors cursor-pointer group flex items-center justify-between"
              >
                <span>{merkleRoot}</span>
                <span className="material-symbols-outlined text-[14px] text-[#87929a] group-hover:text-[#8ed5ff] ml-1 shrink-0">content_copy</span>
              </button>
              <div className="flex items-center justify-between text-[11px] mt-0.5">
                <span className="text-[#87929a]">LAST_AUDIT_STAMP:</span>
                <span className="text-[#e1e2ea]">2025-05-18T14:40:02.109Z</span>
              </div>
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#a1d2ff] text-[18px]">settings_input_component</span>
              <span className="font-mono text-[11px] font-semibold text-[#e1e2ea] uppercase tracking-wider">
                Operational Interfaces
              </span>
            </div>
            <ul className="flex flex-col gap-1.5 font-mono text-[11px]">
              <li className="flex items-center justify-between text-[#bdc8d1] hover:text-white transition-colors">
                <span>gRPC Protobuf Schema (v2.4)</span>
                <span className="text-[#87929a] bg-[#191c21] px-1.5 py-0.5 rounded">9092/TCP</span>
              </li>
              <li className="flex items-center justify-between text-[#bdc8d1] hover:text-white transition-colors">
                <span>REST OpenAPI 3.1 Spec</span>
                <span className="text-[#87929a] bg-[#191c21] px-1.5 py-0.5 rounded">443/HTTPS</span>
              </li>
              <li className="flex items-center justify-between text-[#bdc8d1] hover:text-white transition-colors">
                <span>NetCDF4 / OPeNDAP Telemetry</span>
                <span className="text-[#44e2cd] bg-[#191c21] px-1.5 py-0.5 rounded">ACTIVE</span>
              </li>
              <li className="flex items-center justify-between text-[#bdc8d1] hover:text-white transition-colors">
                <span>OGC Sensor Observation Service</span>
                <span className="text-[#87929a] bg-[#191c21] px-1.5 py-0.5 rounded">SOS v2.0</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#8ed5ff] text-[18px]">radar</span>
              <span className="font-mono text-[11px] font-semibold text-[#e1e2ea] uppercase tracking-wider">
                Active Ground Arrays
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#bdc8d1] flex flex-col gap-1.5">
              {[
                { id: 'delhi', name: '🇮🇳 ND-CENTRAL-04 (DELHI)' },
                { id: 'tokyo', name: '🇯🇵 TYO-KANTO-01 (TOKYO)' },
                { id: 'new-york', name: '🇺🇸 NYC-MANH-01 (NEW YORK)' },
                { id: 'london', name: '🇬🇧 LON-THAMES-01 (LONDON)' },
                { id: 'cairo', name: '🇪🇬 CAI-NILE-01 (CAIRO)' },
                { id: 'mumbai', name: '🇮🇳 MUM-COAST-01 (MUMBAI)' }
              ].map((arr) => (
                <div 
                  key={arr.id} 
                  onClick={() => onSelectStation?.(arr.id)}
                  className="flex justify-between items-center bg-[#191c21]/60 px-2 py-1 rounded border border-[#272a30]/30 hover:border-[#38bdf8]/40 transition-colors cursor-pointer"
                >
                  <span className="text-[#e1e2ea] truncate">{arr.name}</span>
                  <span className="text-[#44e2cd] flex items-center gap-1 shrink-0 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#44e2cd]"></span>
                    SYNCED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright / compliance */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-[#272a30]/50 text-center md:text-left gap-2">
          <div className="flex items-center gap-3 flex-wrap justify-center font-mono text-[11px] text-[#bdc8d1]">
            <span className="font-semibold text-white">ENVIROSHIELD ATMOSPHERIC COMPUTATION PLATFORM</span>
            <span className="text-[#87929a]">|</span>
            <span className="text-[#8ed5ff]">ISO 14064-3 / WMO-No. 8 COMPLIANT</span>
          </div>
          <div className="font-mono text-[10px] text-[#87929a]">
            © 2025 ENVIROSHIELD RESEARCH FOUNDATION. STRICT SCIENTIFIC REPRODUCIBILITY GUARANTEED.
          </div>
        </div>
      </div>
    </footer>
  );
};
