import React from 'react';

export type SeverityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

interface SeverityBadgeProps {
  severity: SeverityType | string;
  size?: 'sm' | 'md';
  variant?: 'dot' | 'subtle';
}

const severityConfig: Record<
  string,
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  CRITICAL: {
    label: 'Critical',
    dot: 'bg-[#F43F5E]',
    text: 'text-[#F43F5E]',
    bg: 'bg-[#F43F5E]/10',
    border: 'border-[#F43F5E]/20',
  },
  HIGH: {
    label: 'High',
    dot: 'bg-[#FB923C]',
    text: 'text-[#FB923C]',
    bg: 'bg-[#FB923C]/10',
    border: 'border-[#FB923C]/20',
  },
  MEDIUM: {
    label: 'Medium',
    dot: 'bg-[#FBBF24]',
    text: 'text-[#FBBF24]',
    bg: 'bg-[#FBBF24]/10',
    border: 'border-[#FBBF24]/20',
  },
  LOW: {
    label: 'Low',
    dot: 'bg-[#94A3B8]',
    text: 'text-[#94A3B8]',
    bg: 'bg-[#94A3B8]/10',
    border: 'border-[#94A3B8]/20',
  },
  INFO: {
    label: 'Info',
    dot: 'bg-[#38BDF8]',
    text: 'text-[#38BDF8]',
    bg: 'bg-[#38BDF8]/10',
    border: 'border-[#38BDF8]/20',
  },
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'sm',
  variant = 'subtle',
}) => {
  const key = (severity || 'INFO').toUpperCase();
  const cfg = severityConfig[key] || severityConfig.INFO;

  const sizeCls = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  if (variant === 'dot') {
    return (
      <span className="inline-flex items-center space-x-1.5 text-xs text-neutral-300">
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
        <span>{cfg.label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-medium rounded-md border ${cfg.bg} ${cfg.border} ${cfg.text} ${sizeCls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      <span>{cfg.label}</span>
    </span>
  );
};

export type StatusType =
  | 'ONLINE'
  | 'HEALTHY'
  | 'DEGRADED'
  | 'OUTAGE'
  | 'NORMALIZED'
  | 'BUFFERED_BACKPRESSURE'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'NEW'
  | 'TRIAGED'
  | 'INVESTIGATING'
  | 'RESOLVED';

interface StatusBadgeProps {
  status: StatusType | string;
  pulse?: boolean;
}

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  ONLINE: {
    label: 'Online',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  HEALTHY: {
    label: 'Healthy',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  NORMALIZED: {
    label: 'Normalized',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  RESOLVED: {
    label: 'Resolved',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  ACCEPTED: {
    label: 'Accepted',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  DEGRADED: {
    label: 'Degraded',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  BUFFERED_BACKPRESSURE: {
    label: 'Backpressure',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  TRIAGED: { label: 'Triaged', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  NEW: { label: 'New', dot: 'bg-sky-400', text: 'text-sky-400', bg: 'bg-sky-500/10' },
  INVESTIGATING: {
    label: 'Investigating',
    dot: 'bg-sky-400',
    text: 'text-sky-400',
    bg: 'bg-sky-500/10',
  },
  OUTAGE: { label: 'Outage', dot: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  REJECTED: { label: 'Rejected', dot: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, pulse }) => {
  const key = (status || 'UNKNOWN').toUpperCase();
  const cfg = statusConfig[key] || {
    label: key.toLowerCase().replace(/_/g, ' '),
    dot: 'bg-neutral-500',
    text: 'text-neutral-400',
    bg: 'bg-neutral-500/10',
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 text-xs font-normal px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0 ${pulse ? 'opacity-80' : ''}`}
      />
      <span>{cfg.label}</span>
    </span>
  );
};
