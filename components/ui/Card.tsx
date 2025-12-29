import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
  const baseStyles = "rounded-2xl transition-all duration-300 hover:shadow-2xl";
  const variants = {
    default: "bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800",
    glass: "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/50 dark:border-slate-800/50 shadow-lg",
  };

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
