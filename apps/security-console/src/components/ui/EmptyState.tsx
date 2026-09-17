import React from 'react';
import { Shield, LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Shield,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center space-y-3 bg-[#0D1424] border border-[#1E293B] rounded-xl ${className}`}
    >
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-semibold font-mono text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
