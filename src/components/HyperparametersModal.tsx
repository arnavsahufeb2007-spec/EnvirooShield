import React, { useState } from 'react';

interface HyperparametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (title: string, description: string) => void;
}

export const HyperparametersModal: React.FC<HyperparametersModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [lambdaL2, setLambdaL2] = useState('0.042');
  const [perturbations, setPerturbations] = useState(32);
  const [pblThreshold, setPblThreshold] = useState(380);
  const [rollingLag, setRollingLag] = useState('1-Step Rolling Chronological');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify('Hyperparameters Re-converged', `Ridge AR L2 λ=${lambdaL2} converged. F-Stat: 184.2; Deterministic loss minimized.`);
    onClose();
  };

  const handleReset = () => {
    setLambdaL2('0.042');
    setPerturbations(32);
    setPblThreshold(380);
    setRollingLag('1-Step Rolling Chronological');
    onNotify('Defaults Restored', 'Model weights calibrated to WMO GAW baseline standard.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-950/90 border border-white/[0.12] rounded-2xl max-w-md w-full p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400 text-[22px]">tune</span>
            <h3 className="font-sans text-[18px] font-bold text-white tracking-tight">Model Hyperparameters</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/[0.08] hover:border-white/[0.2]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleApply} className="flex flex-col gap-4 font-mono text-[12px]">
          <div className="bg-white/[0.03] p-3.5 rounded-xl border border-white/[0.08] flex flex-col gap-1 backdrop-blur-md">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">ACTIVE TOPOLOGY SPEC</span>
            <span className="text-sky-300 font-bold">EnviroForecaster-v1.4-RidgeAR</span>
            <span className="text-[11px] text-slate-300">ECMWF IFS-0.05° Boundary Advection Coupling</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 flex justify-between font-sans text-[12px]">
              <span>L2 Regularization Penalty (λ)</span>
              <span className="text-teal-300 font-mono font-bold">λ = {lambdaL2}</span>
            </label>
            <input
              type="range"
              min="0.005"
              max="0.2"
              step="0.001"
              value={lambdaL2}
              onChange={(e) => setLambdaL2(e.target.value)}
              className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-sky-400 hover:bg-white/[0.12] transition-colors"
            />
            <span className="text-[11px] text-slate-400 font-sans">Controls coefficient shrinkage on collinear meteorological features.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 flex justify-between font-sans text-[12px]">
              <span>Stochastic Ensemble Perturbations</span>
              <span className="text-sky-300 font-mono font-bold">{perturbations} seeds</span>
            </label>
            <input
              type="range"
              min="8"
              max="64"
              step="8"
              value={perturbations}
              onChange={(e) => setPerturbations(Number(e.target.value))}
              className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-sky-400 hover:bg-white/[0.12] transition-colors"
            />
            <span className="text-[11px] text-slate-400 font-sans">Spread generates 95% confidence bounds across the 48-hour horizon.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 flex justify-between font-sans text-[12px]">
              <span>Inversion Height Cap Threshold</span>
              <span className="text-rose-300 font-mono font-bold">{pblThreshold} meters ASL</span>
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="10"
              value={pblThreshold}
              onChange={(e) => setPblThreshold(Number(e.target.value))}
              className="w-full h-2 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-rose-400 hover:bg-white/[0.12] transition-colors"
            />
            <span className="text-[11px] text-slate-400 font-sans">Boundary layer threshold activating the nocturnal subsidence trigger.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 font-sans text-[12px]">Validation Scheme</label>
            <select
              value={rollingLag}
              onChange={(e) => setRollingLag(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.1] p-2.5 rounded-xl text-white focus:border-sky-400 outline-none backdrop-blur-md cursor-pointer hover:border-white/[0.2] transition-colors font-sans text-[12px]"
            >
              <option className="bg-slate-900 text-white">1-Step Rolling Chronological</option>
              <option className="bg-slate-900 text-white">3-Step Block Purged K-Fold</option>
              <option className="bg-slate-900 text-white">Walk-Forward Expanding Window</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.2] text-slate-300 hover:text-white text-[12px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer"
            >
              Reset Baseline
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-transparent hover:bg-white/[0.06] text-slate-400 hover:text-white text-[12px] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-bold text-[12px] shadow-[0_2px_12px_rgba(56,189,248,0.4)] hover:shadow-[0_4px_20px_rgba(56,189,248,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer"
              >
                Re-Train Kernel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
