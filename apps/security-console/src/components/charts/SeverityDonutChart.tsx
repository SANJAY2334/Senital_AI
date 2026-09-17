import React from 'react';

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

export const SeverityDonutChart: React.FC<SeverityDonutChartProps> = ({ counts, size = 140 }) => {
  const total = counts.critical + counts.high + counts.medium + counts.low;
  const radius = 54;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentages and stroke-dash segments
  const segments = [
    { label: 'Critical', count: counts.critical, color: '#F43F5E' },
    { label: 'High', count: counts.high, color: '#FB923C' },
    { label: 'Medium', count: counts.medium, color: '#FBBF24' },
    { label: 'Low', count: counts.low, color: '#94A3B8' },
  ];

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
      {/* SVG Donut */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90 transform">
          {/* Background track circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#1C1C22"
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
          <span className="text-2xl font-semibold text-[#EDEDEF] tracking-tight tabular-nums">
            {total}
          </span>
          <span className="text-[11px] text-[#62626B] font-normal">Alerts</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs w-full max-w-[200px]">
        {segments.map((seg, i) => {
          const percent = total > 0 ? Math.round((seg.count / total) * 100) : 0;
          return (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-[#9898A0]">{seg.label}</span>
              </div>
              <div className="flex items-center space-x-1.5 tabular-nums">
                <span className="text-[#EDEDEF] font-medium">{seg.count}</span>
                <span className="text-[#62626B] text-[11px]">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
