import React from 'react';
import { StationData } from '../types';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: StationData;
  onNotify: (title: string, description: string) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  station,
  onNotify
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-400/15 text-teal-400 flex items-center justify-center border border-teal-400/30">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h3 className="font-sans text-[18px] font-bold text-white tracking-tight">
                Instrument Calibration Log & Traceability
              </h3>
              <span className="font-mono text-[11px] text-slate-400">
                Array Node: {station.code} • Firmware: {station.hardwareFw}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08] hover:border-white/[0.2]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 font-mono text-[11px]">
          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08] flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">CERTIFICATE ID:</span>
              <span className="text-sky-300 font-bold">ISO-14064-VALIDATED-STK-902</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">WMO-TI STATUS:</span>
              <span className="text-teal-300 font-bold">CALIBRATED (4m AGO)</span>
            </div>
          </div>

          <div className="border border-white/[0.08] rounded-xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left">
              <thead className="bg-white/[0.04] text-slate-400 text-[10px] uppercase border-b border-white/[0.08]">
                <tr>
                  <th className="p-3">Subsystem</th>
                  <th className="p-3">Serial No.</th>
                  <th className="p-3">Last Recalibration</th>
                  <th className="p-3">Sensor Drift</th>
                  <th className="p-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-200">
                <tr className="hover:bg-white/[0.06] transition-colors">
                  <td className="p-3 font-sans font-medium text-white">Laser Optical Particle Counter</td>
                  <td className="p-3 text-slate-400">OPC-9982-X</td>
                  <td className="p-3">2025-03-12</td>
                  <td className="p-3 text-teal-300 font-bold">&lt; 0.4% / yr</td>
                  <td className="p-3 text-right text-teal-300 font-semibold">WMO Tier-1 PASS</td>
                </tr>
                <tr className="hover:bg-white/[0.06] transition-colors">
                  <td className="p-3 font-sans font-medium text-white">Sonic 3D Anemometer</td>
                  <td className="p-3 text-slate-400">SON-3D-4101</td>
                  <td className="p-3">2025-04-01</td>
                  <td className="p-3 text-teal-300 font-bold">±0.01 m/s</td>
                  <td className="p-3 text-right text-teal-300 font-semibold">NIST PASS</td>
                </tr>
                <tr className="hover:bg-white/[0.06] transition-colors">
                  <td className="p-3 font-sans font-medium text-white">Capacitive Thin-Film Hygrometer</td>
                  <td className="p-3 text-slate-400">HYG-NIST-88</td>
                  <td className="p-3">2025-02-18</td>
                  <td className="p-3 text-teal-300 font-bold">±0.8% RH</td>
                  <td className="p-3 text-right text-teal-300 font-semibold">TRACEABLE</td>
                </tr>
                <tr className="hover:bg-white/[0.06] transition-colors">
                  <td className="p-3 font-sans font-medium text-white">Radiosonde Sounding Receiver</td>
                  <td className="p-3 text-slate-400">SND-SYN-0419</td>
                  <td className="p-3">2025-05-18</td>
                  <td className="p-3 text-teal-300 font-bold">0.5 hPa</td>
                  <td className="p-3 text-right text-teal-300 font-semibold">SYNOPTIC 12Z</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
          <span className="font-mono text-[10px] text-slate-400">
            SECURE BOOT SHA-256 CHECK: VERIFIED 0x3c81e9f4...2b01
          </span>
          <button
            onClick={() => {
              onNotify('Self-Test Dispatched', 'All 4 sensor pods acknowledged telemetry ping with 0.00ms latency.');
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 font-sans font-bold text-[12px] shadow-[0_2px_12px_rgba(20,184,166,0.4)] hover:shadow-[0_4px_20px_rgba(20,184,166,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer"
          >
            Trigger Full Hardware Self-Test
          </button>
        </div>
      </div>
    </div>
  );
};
