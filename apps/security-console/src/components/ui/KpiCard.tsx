import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatusBadge } from './Badge';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
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
  isSimulated = true,
}) => {
  return (
    <div className="bg-[#0D1424] border border-[#1E293B] hover:border-slate-700 transition-colors p-4 rounded-xl flex flex-col justify-between space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold font-mono text-slate-100 tracking-tight">
            {value}
          </span>
          {unit && <span className="text-xs font-mono text-slate-400 font-normal">{unit}</span>}
        </div>

        {/* Secondary context: Trend and Status */}
        <div className="flex items-center justify-between pt-1">
          {trendText ? (
            <div className="flex items-center space-x-1 text-[11px] font-mono">
              {trendDirection === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
              {trendDirection === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
              {trendDirection === 'neutral' && <Minus className="w-3 h-3 text-slate-500" />}
              <span
                className={
                  trendDirection === 'up'
                    ? 'text-emerald-400'
                    : trendDirection === 'down'
                      ? 'text-red-400'
                      : 'text-slate-400'
                }
              >
                {trendText}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">
              {isSimulated ? 'SIMULATED STREAM' : 'LIVE'}
            </span>
          )}

          {statusText && <StatusBadge status={statusText} />}
        </div>
      </div>
    </div>
  );
};
