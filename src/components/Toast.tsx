import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#191c21] border border-[#38bdf8]/40 shadow-[0_8px_24px_rgba(0,0,0,0.8)] rounded p-3 flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-right-4 duration-200"
        >
          <div className="w-6 h-6 rounded bg-[#38bdf8]/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[#38bdf8] text-[16px]">
              {toast.type === 'warning' ? 'warning' : 'verified'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[12px] font-semibold text-[#e1e2ea] tracking-tight">
              {toast.title}
            </div>
            <div className="font-sans text-[11px] text-[#bdc8d1] mt-0.5 leading-snug">
              {toast.description}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#87929a] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
