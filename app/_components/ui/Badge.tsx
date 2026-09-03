'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sky' | 'emerald' | 'amber' | 'blue' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'sky',
  className = '',
}) => {
  const variantStyles = {
    sky: 'bg-[#0EA5E9]/10 text-[#0284C7] border-[#BAE6FD]',
    emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    blue: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    slate: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
