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
      className={`flex flex-col items-center justify-center p-10 text-center space-y-3 bg-[#121215] border border-[#222227] rounded-lg ${className}`}
    >
      <div className="p-2.5 rounded-lg bg-[#18181C] border border-[#26262E] text-[#62626B]">
        <Icon className="w-5 h-5 text-[#9898A0]" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm font-medium text-[#EDEDEF]">{title}</h4>
        <p className="text-xs text-[#9898A0] leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="xs" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
