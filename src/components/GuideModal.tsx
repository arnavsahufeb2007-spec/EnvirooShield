import React from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#191c21] border border-[#38bdf8]/40 rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#272a30]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/20 flex items-center justify-center border border-[#38bdf8]/40">
              <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">lightbulb</span>
            </div>
            <div>
              <h3 className="font-sans text-[18px] font-bold text-white">How EnviroShield Works</h3>
              <p className="font-sans text-[12px] text-[#bdc8d1]">A 60-second plain-English guide to understanding this app</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#87929a] hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 font-sans text-[13px] text-[#e1e2ea]">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[#111319] border border-[#272a30]">
            <div className="w-7 h-7 rounded-full bg-[#38bdf8] text-[#00354a] font-bold flex items-center justify-center shrink-0 font-mono text-[13px]">
              1
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">Why does air pollution suddenly spike?</span>
              <p className="text-[#bdc8d1] leading-relaxed">
                Pollution doesn't spike just because factories or cars emit more. It turns into an acute crisis when <strong className="text-[#38bdf8]">weather traps the air</strong>. When wind stops and a cold layer sits over warm ground (called a <em className="text-[#44e2cd]">thermal inversion</em>), it acts like a giant glass lid over the city, trapping exhaust at street level.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[#111319] border border-[#272a30]">
            <div className="w-7 h-7 rounded-full bg-[#44e2cd] text-[#00354a] font-bold flex items-center justify-center shrink-0 font-mono text-[13px]">
              2
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">What does the Risk Score (0 - 100) mean?</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-1 text-[11px] font-mono text-center">
                <div className="p-1.5 rounded bg-[#44e2cd]/15 text-[#44e2cd] border border-[#44e2cd]/30">0-25: Clean Air</div>
                <div className="p-1.5 rounded bg-[#38bdf8]/20 text-[#8ed5ff] border border-[#38bdf8]/30 font-bold">25-50: Moderate (Now)</div>
                <div className="p-1.5 rounded bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30">50-70: High Smog</div>
                <div className="p-1.5 rounded bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/30">70+: Critical Crisis</div>
              </div>
              <p className="text-[#bdc8d1] leading-relaxed">
                The index scores immediate physiological risk on a 0 to 100 scale: Scores below 25 represent pristine air, while scores above 75 trigger alerts for sensitive groups and outdoor exercise avoidance.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[#111319] border border-[#272a30]">
            <div className="w-7 h-7 rounded-full bg-[#f59e0b] text-[#00354a] font-bold flex items-center justify-center shrink-0 font-mono text-[13px]">
              3
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">Cleanest Window & 48-Hour Forecast</span>
              <p className="text-[#bdc8d1] leading-relaxed">
                Our model projects hour-by-hour boundary layer and smog trajectories. The <strong className="text-[#44e2cd]">Cleanest Window of the Day</strong> identifies the optimal hours to open home windows, run outdoors, or walk pets, while warning you of upcoming smog peaks.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-lg bg-[#111319] border border-[#272a30]">
            <div className="w-7 h-7 rounded-full bg-[#8ed5ff] text-[#00354a] font-bold flex items-center justify-center shrink-0 font-mono text-[13px]">
              4
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">Side-by-Side Compare & Demo Scenarios</span>
              <p className="text-[#cbd5e1] leading-relaxed">
                • <strong>Compare Cities:</strong> Click <strong className="text-[#44e2cd]">Compare</strong> in the navbar to compare any two world cities side-by-side with synchronized local clocks and dispersion differentials.
                <br />
                • <strong>Demo Scenarios:</strong> Click <strong className="text-[#8ed5ff]">Demo Scenarios</strong> to test distinct planetary archetypes (pristine alpine air, trapped urban smog, maritime sea breeze) in 1 click.
                <br />
                • <strong>CGS Measurement Standard:</strong> Particulate density is measured in <strong className="text-[#38bdf8]">g/cm³</strong> (1 µg/m³ = 10⁻¹² g/cm³), pressure in <strong className="text-[#44e2cd]">dyn/cm² (barye)</strong>, wind speed in <strong className="text-[#8ed5ff]">cm/s</strong>, and height in <strong className="text-white">cm</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#272a30]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#00354a] font-bold text-[13px] rounded-lg transition-colors cursor-pointer shadow-md"
          >
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
};
