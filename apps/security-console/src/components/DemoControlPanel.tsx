import React, { useState } from 'react';
import { Play, AlertOctagon, RefreshCw, Settings2 } from 'lucide-react';

interface DemoControlPanelProps {
  onGenerate: (count: number, tenant?: string, provider?: string) => void;
  onToggleOutage: (outage: boolean) => void;
  onRecover: () => void;
  isOutageActive: boolean;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  onGenerate,
  onToggleOutage,
  onRecover,
  isOutageActive,
}) => {
  const [selectedTenant, setSelectedTenant] = useState<string>('tenant-acme');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold font-mono text-slate-200">DEMO CONTROL PANEL</h2>
        </div>
        <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono font-semibold">
          LIVE DEMO ADAPTER
        </span>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => onGenerate(10, selectedTenant, selectedProvider)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Generate 10 Events</span>
        </button>

        <button
          onClick={() => onGenerate(100, selectedTenant, selectedProvider)}
          className="bg-cyan-700 hover:bg-cyan-600 text-white font-mono text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Generate 100 Events</span>
        </button>

        <button
          onClick={() => onGenerate(1000, selectedTenant, selectedProvider)}
          className="bg-cyan-800 hover:bg-cyan-700 text-white font-mono text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Generate 1,000 Events</span>
        </button>

        {isOutageActive ? (
          <button
            onClick={onRecover}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Recover Pipeline</span>
          </button>
        ) : (
          <button
            onClick={() => onToggleOutage(true)}
            className="bg-red-700 hover:bg-red-600 text-white font-mono text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Simulate Kafka Outage</span>
          </button>
        )}
      </div>

      {/* Tenant & Provider Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Target Tenant Identity:</label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="tenant-acme">tenant-acme (Acme Corp)</option>
            <option value="tenant-beta">tenant-beta (Beta Financial)</option>
            <option value="tenant-gamma">tenant-gamma (Gamma Healthcare)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Provider Filter Override:</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">ALL Providers (Mixed Stream)</option>
            <option value="AWS_CLOUDTRAIL">AWS CloudTrail Only</option>
            <option value="CROWDSTRIKE_EDR">CrowdStrike EDR Only</option>
            <option value="OKTA_IAM">Okta IAM Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};
