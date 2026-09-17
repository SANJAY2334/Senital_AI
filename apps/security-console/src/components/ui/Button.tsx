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
    'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 soc-focus-ring disabled:opacity-40 disabled:cursor-not-allowed select-none';

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-[#EDEDEF] hover:bg-white text-[#0A0A0C] font-medium shadow-xs';
      break;
    case 'secondary':
      variantStyle =
        'bg-[#18181C] hover:bg-[#202026] text-[#EDEDEF] border border-[#26262E] hover:border-[#32323C] shadow-xs';
      break;
    case 'outline':
      variantStyle =
        'bg-transparent hover:bg-[#18181C] text-[#9898A0] hover:text-[#EDEDEF] border border-[#26262E]';
      break;
    case 'danger':
      variantStyle = 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25';
      break;
    case 'ghost':
      variantStyle = 'bg-transparent hover:bg-[#18181C] text-[#9898A0] hover:text-[#EDEDEF]';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'xs':
      sizeStyle = 'text-xs px-2.5 py-1 space-x-1.5 h-7';
      break;
    case 'sm':
      sizeStyle = 'text-xs px-3 py-1.5 space-x-1.5 h-8';
      break;
    case 'md':
      sizeStyle = 'text-sm px-3.5 py-2 space-x-2 h-9';
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
