import React from 'react';
import { Card } from './Card';

interface MetricCardProps {
  label: string;
  icon: string;
  primaryValue: string;
  secondaryValue?: string;
  contextText?: string;
  badgeText?: string;
  badgeVariant?: 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'neutral' | 'accent';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  icon,
  primaryValue,
  secondaryValue,
  contextText,
  badgeText,
  badgeVariant = 'neutral',
  className = ''
}) => {
  const badgeColors = {
    good: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    moderate: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    sensitive: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    unhealthy: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    neutral: 'bg-white/[0.06] text-slate-300 border-white/[0.08]',
    accent: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
  };

  return (
    <Card
      variant="interactive"
      className={`p-4 sm:p-5 flex flex-col justify-between gap-3 group ${className}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[12px] font-semibold text-slate-300 group-hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all">
              <span className="material-symbols-outlined text-[17px]">{icon}</span>
            </div>
            {label}
          </span>
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border backdrop-blur-sm ${badgeColors[badgeVariant]}`}
            >
              {badgeText}
            </span>
          )}
        </div>

        <div className="flex flex-col mt-1">
          <div className="text-[22px] sm:text-[24px] font-bold tracking-tight text-white font-sans group-hover:text-sky-200 transition-colors">
            {primaryValue}
          </div>
          {secondaryValue && (
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              {secondaryValue}
            </div>
          )}
        </div>
      </div>

      {contextText && (
        <div className="pt-2.5 border-t border-white/[0.06] text-[11px] text-slate-400 group-hover:text-slate-300 leading-relaxed transition-colors">
          {contextText}
        </div>
      )}
    </Card>
  );
};
