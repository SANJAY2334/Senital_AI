import React from 'react';
import { ExecutiveMetrics } from '../types/demo.types';
import { Layers, CheckCircle2, ShieldCheck, AlertOctagon, Clock, Zap } from 'lucide-react';

interface ExecutiveMetricsProps {
  metrics: ExecutiveMetrics;
}

export const ExecutiveMetricsComponent: React.FC<ExecutiveMetricsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Events Received',
      value: metrics.eventsReceived.toLocaleString(),
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-800',
    },
    {
      title: 'Events Accepted',
      value: metrics.eventsAccepted.toLocaleString(),
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-800',
    },
    {
      title: 'Events Normalized',
      value: metrics.eventsNormalized.toLocaleString(),
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-800',
    },
    {
      title: 'Events Rejected',
      value: metrics.eventsRejected.toLocaleString(),
      icon: <AlertOctagon className="w-5 h-5 text-red-400" />,
      color: 'border-red-800',
    },
    {
      title: 'Test-Harness Latency',
      value: `${metrics.pipelineLatencyMs} ms`,
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-800',
    },
    {
      title: 'Test-Harness EPS',
      value: `${metrics.currentThroughputEPS.toLocaleString()} EPS`,
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`bg-slate-900 border ${c.color} p-4 rounded-xl flex flex-col justify-between space-y-2`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">{c.title}</span>
            {c.icon}
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">{c.value}</div>
        </div>
      ))}
    </div>
  );
};
