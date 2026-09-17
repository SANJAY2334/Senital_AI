import React from 'react';
import { ProviderDistribution } from '../../types/demo.types';
import { Cloud, ShieldAlert, KeyRound } from 'lucide-react';

interface ProviderBarChartProps {
  distribution: ProviderDistribution;
}

export const ProviderBarChart: React.FC<ProviderBarChartProps> = ({ distribution }) => {
  const providers = [
    {
      name: 'AWS CloudTrail',
      ocsf: 'Class 6001 Cloud Audit',
      count: distribution.awsCount,
      percent: distribution.awsPercent,
      color: '#F59E0B',
      barColor: 'bg-amber-500',
      icon: Cloud,
    },
    {
      name: 'CrowdStrike EDR',
      ocsf: 'Class 1007 Process Activity',
      count: distribution.csCount,
      percent: distribution.csPercent,
      color: '#EF4444',
      barColor: 'bg-red-500',
      icon: ShieldAlert,
    },
    {
      name: 'Okta IAM',
      ocsf: 'Class 3001 Authentication',
      count: distribution.oktaCount,
      percent: distribution.oktaPercent,
      color: '#06B6D4',
      barColor: 'bg-cyan-500',
      icon: KeyRound,
    },
  ];

  return (
    <div className="space-y-3.5">
      {providers.map((p, idx) => {
        const Icon = p.icon;
        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <Icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                <span className="text-slate-200 font-semibold">{p.name}</span>
                <span className="text-[10px] text-slate-500 hidden sm:inline">({p.ocsf})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-100 font-bold">{p.count.toLocaleString()}</span>
                <span className="text-slate-500 text-[11px]">({p.percent}%)</span>
              </div>
            </div>

            {/* High density progress bar */}
            <div className="w-full bg-[#090E1A] h-2 rounded-full overflow-hidden border border-[#1E293B]">
              <div
                className={`h-full ${p.barColor} transition-all duration-500 rounded-full`}
                style={{ width: `${Math.max(p.percent, 2)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
