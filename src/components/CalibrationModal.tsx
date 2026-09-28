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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#191c21] border border-[#272a30] rounded-lg max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#272a30]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#44e2cd] text-[22px]">tune</span>
            <div>
              <h3 className="font-sans text-[18px] font-semibold text-[#e1e2ea]">
                Instrument Calibration Log & Traceability
              </h3>
              <span className="font-mono text-[11px] text-[#87929a]">
                Array Node: {station.code} • Firmware: {station.hardwareFw}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#87929a] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 font-mono text-[11px]">
          <div className="bg-[#111319] p-3 rounded border border-[#272a30] flex items-center justify-between">
            <div>
              <span className="text-[#87929a] block">CERTIFICATE ID:</span>
              <span className="text-[#8ed5ff] font-semibold">ISO-14064-VALIDATED-STK-902</span>
            </div>
            <div className="text-right">
              <span className="text-[#87929a] block">WMO-TI STATUS:</span>
              <span className="text-[#44e2cd] font-semibold">CALIBRATED (4m AGO)</span>
            </div>
          </div>

          <div className="border border-[#272a30] rounded overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#111319] text-[#87929a] text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Subsystem</th>
                  <th className="p-2.5">Serial No.</th>
                  <th className="p-2.5">Last Recalibration</th>
                  <th className="p-2.5">Sensor Drift</th>
                  <th className="p-2.5 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272a30] text-[#e1e2ea]">
                <tr className="hover:bg-[#272a30]/50 transition-colors">
                  <td className="p-2.5 font-sans font-medium text-white">Laser Optical Particle Counter</td>
                  <td className="p-2.5 text-[#87929a]">OPC-9982-X</td>
                  <td className="p-2.5">2025-03-12</td>
                  <td className="p-2.5 text-[#44e2cd]">&lt; 0.4% / yr</td>
                  <td className="p-2.5 text-right text-[#44e2cd]">WMO Tier-1 PASS</td>
                </tr>
                <tr className="hover:bg-[#272a30]/50 transition-colors">
                  <td className="p-2.5 font-sans font-medium text-white">Sonic 3D Anemometer</td>
                  <td className="p-2.5 text-[#87929a]">SON-3D-4101</td>
                  <td className="p-2.5">2025-04-01</td>
                  <td className="p-2.5 text-[#44e2cd]">±0.01 m/s</td>
                  <td className="p-2.5 text-right text-[#44e2cd]">NIST PASS</td>
                </tr>
                <tr className="hover:bg-[#272a30]/50 transition-colors">
                  <td className="p-2.5 font-sans font-medium text-white">Capacitive Thin-Film Hygrometer</td>
                  <td className="p-2.5 text-[#87929a]">HYG-NIST-88</td>
                  <td className="p-2.5">2025-02-18</td>
                  <td className="p-2.5 text-[#44e2cd]">±0.8% RH</td>
                  <td className="p-2.5 text-right text-[#44e2cd]">TRACEABLE</td>
                </tr>
                <tr className="hover:bg-[#272a30]/50 transition-colors">
                  <td className="p-2.5 font-sans font-medium text-white">Radiosonde Sounding Receiver</td>
                  <td className="p-2.5 text-[#87929a]">SND-SYN-0419</td>
                  <td className="p-2.5">2025-05-18</td>
                  <td className="p-2.5 text-[#44e2cd]">0.5 hPa</td>
                  <td className="p-2.5 text-right text-[#44e2cd]">SYNOPTIC 12Z</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#272a30]">
          <span className="font-mono text-[10px] text-[#87929a]">
            SECURE BOOT SHA-256 CHECK: VERIFIED 0x3c81e9f4...2b01
          </span>
          <button
            onClick={() => {
              onNotify('Self-Test Dispatched', 'All 4 sensor pods acknowledged telemetry ping with 0.00ms latency.');
              onClose();
            }}
            className="px-4 py-1.5 rounded bg-[#38bdf8] text-[#004965] font-semibold text-[13px] hover:bg-[#8ed5ff] transition-colors"
          >
            Trigger Full Hardware Self-Test
          </button>
        </div>
      </div>
    </div>
  );
};
