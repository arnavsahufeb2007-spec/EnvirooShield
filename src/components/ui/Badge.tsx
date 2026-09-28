import React from 'react';

export type BadgeVariant = 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous' | 'neutral' | 'accent';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false
}) => {
  const styles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    good: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dotColor: 'bg-emerald-400'
    },
    moderate: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dotColor: 'bg-amber-400'
    },
    sensitive: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      dotColor: 'bg-orange-400'
    },
    unhealthy: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      dotColor: 'bg-rose-400'
    },
    'very-unhealthy': {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      dotColor: 'bg-purple-400'
    },
    hazardous: {
      bg: 'bg-rose-950/40',
      text: 'text-rose-300',
      border: 'border-rose-700/50',
      dotColor: 'bg-rose-500'
    },
    neutral: {
      bg: 'bg-[#1a202c]',
      text: 'text-slate-300',
      border: 'border-slate-700/50',
      dotColor: 'bg-slate-400'
    },
    accent: {
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
      dotColor: 'bg-sky-400'
    }
  };

  const current = styles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor}`} />}
      {children}
    </span>
  );
};
