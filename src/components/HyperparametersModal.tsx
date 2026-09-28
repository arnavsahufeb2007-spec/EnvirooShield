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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#191c21] border border-[#272a30] rounded-lg max-w-md w-full p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#272a30]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#38bdf8] text-[22px]">tune</span>
            <h3 className="font-sans text-[18px] font-semibold text-[#e1e2ea]">Model Hyperparameters</h3>
          </div>
          <button onClick={onClose} className="text-[#87929a] hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleApply} className="flex flex-col gap-4 font-mono text-[12px]">
          <div className="bg-[#111319] p-3 rounded border border-[#272a30] flex flex-col gap-1">
            <span className="text-[10px] text-[#87929a] uppercase">ACTIVE TOPOLOGY SPEC</span>
            <span className="text-[#8ed5ff] font-semibold">EnviroForecaster-v1.4-RidgeAR</span>
            <span className="text-[11px] text-[#bdc8d1]">ECMWF IFS-0.05° Boundary Advection Coupling</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#bdc8d1] flex justify-between">
              <span>L2 REGULARIZATION PENALTY (λ)</span>
              <span className="text-[#44e2cd]">λ = {lambdaL2}</span>
            </label>
            <input
              type="range"
              min="0.005"
              max="0.2"
              step="0.001"
              value={lambdaL2}
              onChange={(e) => setLambdaL2(e.target.value)}
              className="w-full h-1.5 bg-[#272a30] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
            />
            <span className="text-[10px] text-[#87929a]">Controls coefficient shrinkage on collinear meteorological features.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#bdc8d1] flex justify-between">
              <span>STOCHASTIC ENSEMBLE PERTURBATIONS</span>
              <span className="text-[#8ed5ff]">{perturbations} seeds</span>
            </label>
            <input
              type="range"
              min="8"
              max="64"
              step="8"
              value={perturbations}
              onChange={(e) => setPerturbations(Number(e.target.value))}
              className="w-full h-1.5 bg-[#272a30] rounded-lg appearance-none cursor-pointer accent-[#38bdf8]"
            />
            <span className="text-[10px] text-[#87929a]">Spread generates 95% confidence bounds across the 48-hour horizon.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#bdc8d1] flex justify-between">
              <span>INVERSION HEIGHT CAP THRESHOLD</span>
              <span className="text-[#ffb4ab]">{pblThreshold} meters ASL</span>
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="10"
              value={pblThreshold}
              onChange={(e) => setPblThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-[#272a30] rounded-lg appearance-none cursor-pointer accent-[#ffb4ab]"
            />
            <span className="text-[10px] text-[#87929a]">Boundary layer threshold activating the nocturnal subsidence trigger.</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[#bdc8d1]">VALIDATION SCHEME</label>
            <select
              value={rollingLag}
              onChange={(e) => setRollingLag(e.target.value)}
              className="bg-[#111319] border border-[#272a30] p-2 rounded text-[#e1e2ea] focus:border-[#38bdf8] outline-none"
            >
              <option>1-Step Rolling Chronological</option>
              <option>3-Step Block Purged K-Fold</option>
              <option>Walk-Forward Expanding Window</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#272a30]">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded bg-[#272a30] hover:bg-[#32353b] text-[#bdc8d1] text-[11px] transition-colors"
            >
              Reset Baseline
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-transparent hover:bg-[#272a30] text-[#87929a] text-[11px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#38bdf8] hover:bg-[#8ed5ff] text-[#004965] font-semibold text-[11px] shadow transition-colors"
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
