'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const radiusStyles = 'rounded-[23px]';

  const variantStyles = {
    primary: 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-sm font-semibold',
    secondary: 'bg-[#075985] text-white hover:bg-[#0C4A6E] border border-[#0284C7]/30',
    outline: 'border border-[#BAE6FD] hover:bg-[#EFF8FF] text-[#0C4A6E]',
    whatsapp: 'bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md',
    ghost: 'text-[#486581] hover:bg-[#EFF8FF] hover:text-[#0C4A6E]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${radiusStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
