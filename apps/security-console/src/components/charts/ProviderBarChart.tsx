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
      ocsf: 'Cloud Audit (6001)',
      count: distribution.awsCount,
      percent: distribution.awsPercent,
      color: '#FB923C',
      icon: Cloud,
    },
    {
      name: 'CrowdStrike EDR',
      ocsf: 'Process Activity (1007)',
      count: distribution.csCount,
      percent: distribution.csPercent,
      color: '#F43F5E',
      icon: ShieldAlert,
    },
    {
      name: 'Okta IAM',
      ocsf: 'Authentication (3001)',
      count: distribution.oktaCount,
      percent: distribution.oktaPercent,
      color: '#38BDF8',
      icon: KeyRound,
    },
  ];

  return (
    <div className="space-y-4">
      {providers.map((p, idx) => {
        const Icon = p.icon;
        return (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: p.color }} />
                <span className="text-[#EDEDEF] font-medium">{p.name}</span>
                <span className="text-[11px] text-[#62626B] hidden sm:inline">{p.ocsf}</span>
              </div>
              <div className="flex items-center space-x-2 tabular-nums">
                <span className="text-[#EDEDEF] font-medium">{p.count.toLocaleString()}</span>
                <span className="text-[#62626B] text-[11px]">({p.percent}%)</span>
              </div>
            </div>

            {/* Quiet progress bar */}
            <div className="w-full bg-[#1A1A20] h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(p.percent, 2)}%`,
                  backgroundColor: p.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
