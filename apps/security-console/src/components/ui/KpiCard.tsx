import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatusBadge } from './Badge';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  statusText?: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  isSimulated?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  unit,
  icon,
  statusText,
  trendText,
  trendDirection = 'neutral',
}) => {
  return (
    <div className="bg-[#121215] border border-[#222227] hover:border-[#2C2C34] transition-colors p-4 sm:p-5 rounded-lg flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-normal text-[#9898A0]">{label}</span>
        {icon && (
          <div className="text-[#62626B] w-4 h-4 flex items-center justify-center">{icon}</div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-semibold text-[#EDEDEF] tracking-tight tabular-nums">
            {value}
          </span>
          {unit && <span className="text-xs text-[#62626B] font-normal">{unit}</span>}
        </div>

        {/* Secondary context: Trend and Status */}
        <div className="flex items-center justify-between pt-1">
          {trendText ? (
            <div className="flex items-center space-x-1.5 text-xs">
              {trendDirection === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
              {trendDirection === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
              {trendDirection === 'neutral' && <Minus className="w-3 h-3 text-[#62626B]" />}
              <span
                className={
                  trendDirection === 'up'
                    ? 'text-emerald-400 font-medium'
                    : trendDirection === 'down'
                      ? 'text-rose-400 font-medium'
                      : 'text-[#9898A0]'
                }
              >
                {trendText}
              </span>
            </div>
          ) : (
            <div />
          )}

          {statusText && <StatusBadge status={statusText} />}
        </div>
      </div>
    </div>
  );
};
