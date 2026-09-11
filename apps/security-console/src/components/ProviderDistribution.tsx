import React from 'react';
import { ProviderDistribution } from '../types/demo.types';
import { Cloud, ShieldAlert, KeyRound } from 'lucide-react';

interface ProviderDistributionProps {
  distribution: ProviderDistribution;
}

export const ProviderDistributionComponent: React.FC<ProviderDistributionProps> = ({
  distribution,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
      <h2 className="text-sm font-semibold font-mono text-slate-300 flex items-center justify-between">
        <span>TELEMETRY PROVIDER DISTRIBUTION</span>
        <span className="text-xs text-slate-500 font-normal">SRS-FR-002 Compliant</span>
      </h2>

      <div className="space-y-3">
        {/* AWS CloudTrail */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span className="flex items-center space-x-2 text-amber-400">
              <Cloud className="w-3.5 h-3.5" />
              <span>AWS CloudTrail (OCSF 6001 Cloud Audit)</span>
            </span>
            <span className="text-slate-300">
              {distribution.awsCount.toLocaleString()} ({distribution.awsPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${distribution.awsPercent}%` }}
            />
          </div>
        </div>

        {/* CrowdStrike EDR */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span className="flex items-center space-x-2 text-red-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CrowdStrike EDR (OCSF 1007 Process Activity)</span>
            </span>
            <span className="text-slate-300">
              {distribution.csCount.toLocaleString()} ({distribution.csPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-500"
              style={{ width: `${distribution.csPercent}%` }}
            />
          </div>
        </div>

        {/* Okta IAM */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span className="flex items-center space-x-2 text-cyan-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Okta IAM (OCSF 3001 Authentication)</span>
            </span>
            <span className="text-slate-300">
              {distribution.oktaCount.toLocaleString()} ({distribution.oktaPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all duration-500"
              style={{ width: `${distribution.oktaPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
