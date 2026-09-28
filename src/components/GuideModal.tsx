import React from 'react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-400/15 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div>
              <h3 className="font-sans text-[18px] font-bold text-white tracking-tight">How EnviroShield Works</h3>
              <p className="font-sans text-[12px] text-slate-400">A 60-second plain-English guide to understanding this app</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08] hover:border-white/[0.2]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 font-sans text-[13px] text-slate-200">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-white/[0.18] transition-colors">
            <div className="w-7 h-7 rounded-xl bg-sky-400 text-slate-950 font-bold flex items-center justify-center shrink-0 font-mono text-[13px] shadow-sm">
              1
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">Why does air pollution suddenly spike?</span>
              <p className="text-slate-300 leading-relaxed">
                Pollution doesn't spike just because factories or cars emit more. It turns into an acute crisis when <strong className="text-sky-300">weather traps the air</strong>. When wind stops and a cold layer sits over warm ground (called a <em className="text-teal-300">thermal inversion</em>), it acts like a giant glass lid over the city, trapping exhaust at street level.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-white/[0.18] transition-colors">
            <div className="w-7 h-7 rounded-xl bg-teal-400 text-slate-950 font-bold flex items-center justify-center shrink-0 font-mono text-[13px] shadow-sm">
              2
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">What does the Risk Score (0 - 100) mean?</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-1.5 text-[11px] font-mono text-center">
                <div className="p-2 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default">0-25: Clean Air</div>
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-200 border border-sky-500/40 font-bold hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default shadow-xs">25-50: Moderate (Now)</div>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default">50-70: High Smog</div>
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default">70+: Critical Crisis</div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                The index scores immediate physiological risk on a 0 to 100 scale: Scores below 25 represent pristine air, while scores above 75 trigger alerts for sensitive groups and outdoor exercise avoidance.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-white/[0.18] transition-colors">
            <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 font-mono text-[13px] shadow-sm">
              3
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">Cleanest Window & 48-Hour Forecast</span>
              <p className="text-slate-300 leading-relaxed">
                Our model projects hour-by-hour boundary layer and smog trajectories. The <strong className="text-teal-300">Cleanest Window of the Day</strong> identifies the optimal hours to open home windows, run outdoors, or walk pets, while warning you of upcoming smog peaks.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-white/[0.18] transition-colors">
            <div className="w-7 h-7 rounded-xl bg-sky-300 text-slate-950 font-bold flex items-center justify-center shrink-0 font-mono text-[13px] shadow-sm">
              4
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white text-[14px]">Side-by-Side Compare & Demo Scenarios</span>
              <p className="text-slate-300 leading-relaxed">
                • <strong>Compare Cities:</strong> Click <strong className="text-teal-300">Compare</strong> in the navbar to compare any two world cities side-by-side with synchronized local clocks and dispersion differentials.
                <br />
                • <strong>Demo Scenarios:</strong> Click <strong className="text-sky-300">Demo Scenarios</strong> to test distinct planetary archetypes (pristine alpine air, trapped urban smog, maritime sea breeze) in 1 click.
                <br />
                • <strong>Measurement Standards:</strong> Toggle between universal EPA AQI (µg/m³) and Eulerian CGS physical units (g/cm³, dyn/cm², cm/s) in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-bold text-[13px] rounded-xl transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(56,189,248,0.4)] hover:shadow-[0_4px_20px_rgba(56,189,248,0.5)] hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
};
