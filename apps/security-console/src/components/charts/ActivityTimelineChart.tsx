import React, { useState } from 'react';
import { TimelineDataPoint } from '../../types/demo.types';

interface ActivityTimelineChartProps {
  data: TimelineDataPoint[];
  height?: number;
}

export const ActivityTimelineChart: React.FC<ActivityTimelineChartProps> = ({
  data,
  height = 180,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-44 text-xs text-[#62626B]">
        No telemetry activity recorded in current window.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.eventCount), 10);
  const width = 600;
  const padding = { top: 15, right: 15, bottom: 25, left: 35 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute points
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.eventCount / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: height }}
      >
        <defs>
          <linearGradient id="eventAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Faint Gridlines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = padding.top + chartHeight * (1 - ratio);
          const val = Math.round(maxVal * ratio);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#1C1C22"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                fill="#62626B"
                fontSize="10"
                fontFamily="Inter, sans-serif"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Filled Area */}
        <path d={areaD} fill="url(#eventAreaGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & Interactive Hover Rects */}
        {points.map((p, i) => {
          const isHovered = hoverIndex === i;
          return (
            <g key={i}>
              {/* Vertical guideline on hover */}
              {isHovered && (
                <line
                  x1={p.x}
                  y1={padding.top}
                  x2={p.x}
                  y2={padding.top + chartHeight}
                  stroke="#38BDF8"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
              )}

              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 4 : 2}
                fill="#0A0A0C"
                stroke="#38BDF8"
                strokeWidth={isHovered ? 2 : 1.25}
                className="transition-all duration-150"
              />

              {/* Alert indicator if alerts > 0 */}
              {p.alertCount > 0 && <circle cx={p.x} cy={p.y - 5} r="2" fill="#F43F5E" />}

              {/* X Axis label (sparse) */}
              {(i % 2 === 0 || i === data.length - 1) && (
                <text
                  x={p.x}
                  y={height - 6}
                  fill="#62626B"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  textAnchor="middle"
                >
                  {p.timeLabel}
                </text>
              )}

              {/* Hover trigger zone */}
              <rect
                x={p.x - chartWidth / data.length / 2}
                y={padding.top}
                width={chartWidth / data.length}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-crosshair"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip Overlay */}
      {hoverIndex !== null && points[hoverIndex] && (
        <div
          className="absolute pointer-events-none bg-[#18181C] border border-[#26262E] shadow-xl px-2.5 py-1.5 rounded-md text-xs z-20 space-y-0.5"
          style={{
            left: `${(points[hoverIndex].x / width) * 100}%`,
            top: `${(points[hoverIndex].y / height) * 60}%`,
            transform: 'translate(-50%, -110%)',
          }}
        >
          <div className="text-[#9898A0] text-[11px]">{points[hoverIndex].timeLabel} UTC</div>
          <div className="text-[#EDEDEF] font-medium">
            {points[hoverIndex].eventCount.toLocaleString()} events
          </div>
          {points[hoverIndex].alertCount > 0 && (
            <div className="text-rose-400 text-[11px]">
              {points[hoverIndex].alertCount} correlated alerts
            </div>
          )}
        </div>
      )}
    </div>
  );
};
