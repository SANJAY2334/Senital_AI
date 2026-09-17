import React from 'react';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => {
  return <div className={`animate-pulse bg-slate-800/60 rounded ${className}`} {...props} />;
};
