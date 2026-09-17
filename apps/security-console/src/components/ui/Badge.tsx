import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export type SeverityType = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

interface SeverityBadgeProps {
  severity: SeverityType | string;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'sm' }) => {
  const sev = (severity || 'INFO').toUpperCase();

  let styles = 'bg-cyan-950/80 text-cyan-400 border-cyan-800';
  let icon = <Info className="w-3 h-3 shrink-0" />;

  if (sev === 'CRITICAL') {
    styles = 'bg-red-950/80 text-red-400 border-red-800';
    icon = <AlertCircle className="w-3 h-3 shrink-0 text-red-400" />;
  } else if (sev === 'HIGH') {
    styles = 'bg-orange-950/80 text-orange-400 border-orange-800';
    icon = <AlertTriangle className="w-3 h-3 shrink-0 text-orange-400" />;
  } else if (sev === 'MEDIUM') {
    styles = 'bg-amber-950/80 text-amber-400 border-amber-800';
    icon = <ShieldAlert className="w-3 h-3 shrink-0 text-amber-400" />;
  } else if (sev === 'LOW') {
    styles = 'bg-blue-950/80 text-blue-400 border-blue-800';
    icon = <Info className="w-3 h-3 shrink-0 text-blue-400" />;
  }

  const sizeCls = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-mono font-bold uppercase tracking-wider rounded border ${styles} ${sizeCls}`}
    >
      {icon}
      <span>{sev}</span>
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

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, pulse }) => {
  const st = (status || 'UNKNOWN').toUpperCase();

  let colorCls = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotCls = 'bg-slate-400';

  if (st === 'ONLINE' || st === 'HEALTHY' || st === 'NORMALIZED' || st === 'RESOLVED') {
    colorCls = 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80';
    dotCls = 'bg-emerald-400';
  } else if (st === 'DEGRADED' || st === 'BUFFERED_BACKPRESSURE' || st === 'TRIAGED') {
    colorCls = 'bg-amber-950/70 text-amber-400 border-amber-800/80';
    dotCls = 'bg-amber-400';
  } else if (st === 'OUTAGE' || st === 'REJECTED') {
    colorCls = 'bg-red-950/70 text-red-400 border-red-800/80';
    dotCls = 'bg-red-400';
  } else if (st === 'NEW' || st === 'INVESTIGATING') {
    colorCls = 'bg-cyan-950/70 text-cyan-400 border-cyan-800/80';
    dotCls = 'bg-cyan-400';
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${colorCls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls} ${pulse ? 'animate-ping' : ''}`} />
      <span>{st.replace(/_/g, ' ')}</span>
    </span>
  );
};
