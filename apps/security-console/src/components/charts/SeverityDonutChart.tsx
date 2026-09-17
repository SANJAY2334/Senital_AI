import React from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

interface SeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface SeverityDonutChartProps {
  counts: SeverityCounts;
  size?: number;
}

export const SeverityDonutChart: React.FC<SeverityDonutChartProps> = ({ counts, size = 150 }) => {
  const total = counts.critical + counts.high + counts.medium + counts.low;
  const radius = 55;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages and stroke-dash segments
  const segments = [
    { label: 'CRITICAL', count: counts.critical, color: '#EF4444', icon: AlertCircle },
    { label: 'HIGH', count: counts.high, color: '#F97316', icon: AlertTriangle },
    { label: 'MEDIUM', count: counts.medium, color: '#F59E0B', icon: ShieldAlert },
    { label: 'LOW', count: counts.low, color: '#3B82F6', icon: Info },
  ];

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
      {/* SVG Donut */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90 transform">
          {/* Background track circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
          />

          {total > 0 &&
            segments.map((seg, i) => {
              if (seg.count === 0) return null;
              const percent = seg.count / total;
              const dashArray = `${percent * circumference} ${circumference}`;
              const dashOffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={i}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-300"
                />
              );
            })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold font-mono text-slate-100">{total}</span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Total
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs font-mono w-full max-w-[200px]">
        {segments.map((seg, i) => {
          const percent = total > 0 ? Math.round((seg.count / total) * 100) : 0;
          const Icon = seg.icon;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon className="w-3.5 h-3.5" style={{ color: seg.color }} />
                <span className="text-slate-300 font-medium">{seg.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-100 font-semibold">{seg.count}</span>
                <span className="text-[10px] text-slate-500">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
