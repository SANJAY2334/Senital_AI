import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-mono font-medium rounded-lg transition-colors soc-focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500/50 shadow-sm';
      break;
    case 'secondary':
      variantStyle =
        'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/70';
      break;
    case 'outline':
      variantStyle =
        'bg-transparent hover:bg-slate-800/50 text-slate-300 border border-slate-700 hover:text-white';
      break;
    case 'danger':
      variantStyle = 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80';
      break;
    case 'ghost':
      variantStyle =
        'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'xs':
      sizeStyle = 'text-[11px] px-2.5 py-1 space-x-1.5';
      break;
    case 'sm':
      sizeStyle = 'text-xs px-3 py-1.5 space-x-2';
      break;
    case 'md':
      sizeStyle = 'text-sm px-4 py-2 space-x-2.5';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
