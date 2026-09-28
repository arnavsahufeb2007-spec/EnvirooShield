import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive' | 'highlight';
  glowColor?: 'emerald' | 'amber' | 'rose' | 'sky';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  glowColor,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-[#0d121c]/65 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.08)]',
    elevated:
      'bg-[#121826]/75 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_40px_0_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.14)]',
    subtle:
      'bg-[#0a0e16]/50 backdrop-blur-md border border-white/[0.05] shadow-sm',
    interactive:
      'bg-[#0d121c]/60 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:bg-[#141b2a]/75 hover:border-white/[0.18] hover:shadow-[0_16px_40px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 transition-all duration-300',
    highlight:
      'bg-gradient-to-br from-[#121b2d]/80 via-[#0d121c]/70 to-[#0e1724]/80 backdrop-blur-xl border border-sky-400/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(56,189,248,0.2)]'
  };

  const glowStyles = {
    emerald: 'relative before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-b before:from-emerald-500/20 before:to-transparent before:pointer-events-none',
    amber: 'relative before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-b before:from-amber-500/20 before:to-transparent before:pointer-events-none',
    rose: 'relative before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-b before:from-rose-500/20 before:to-transparent before:pointer-events-none',
    sky: 'relative before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-b before:from-sky-500/20 before:to-transparent before:pointer-events-none'
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${variantStyles[variant]} ${
        glowColor ? glowStyles[glowColor] : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
