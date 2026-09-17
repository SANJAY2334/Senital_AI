import React, { useState } from 'react';
import { X, Play, RefreshCw, AlertOctagon, SlidersHorizontal, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

interface DemoControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (count: number, tenant?: string, provider?: string) => void;
  onToggleOutage: (outage: boolean) => void;
  onRecover: () => void;
  isOutageActive: boolean;
}

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  onToggleOutage,
  onRecover,
  isOutageActive,
}) => {
  const [selectedTenant, setSelectedTenant] = useState<string>('tenant-acme');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0D1424] border border-[#1E293B] shadow-2xl rounded-xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-slate-100">
                TELEMETRY SIMULATION CONTROLS
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Controlled synthetic workload & pipeline failure injection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs font-mono">
          {/* Target Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-medium">
                Tenant Identity
              </label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="w-full bg-[#090E1A] border border-[#1E293B] text-slate-200 p-2 rounded-lg text-xs outline-none focus:border-cyan-500"
              >
                <option value="tenant-acme">tenant-acme (Acme Corp)</option>
                <option value="tenant-beta">tenant-beta (Beta Financial)</option>
                <option value="tenant-gamma">tenant-gamma (Gamma Healthcare)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-medium">
                Telemetry Provider Filter
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full bg-[#090E1A] border border-[#1E293B] text-slate-200 p-2 rounded-lg text-xs outline-none focus:border-cyan-500"
              >
                <option value="ALL">ALL Providers (Mixed Stream)</option>
                <option value="AWS_CLOUDTRAIL">AWS CloudTrail Only</option>
                <option value="CROWDSTRIKE_EDR">CrowdStrike EDR Only</option>
                <option value="OKTA_IAM">Okta IAM Only</option>
              </select>
            </div>
          </div>

          {/* Event Generation Presets */}
          <div className="space-y-2">
            <span className="block text-slate-400 text-[11px] font-medium">
              Synthetic Event Generation Batches
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                icon={<Play className="w-3 h-3 text-cyan-400" />}
                onClick={() => {
                  onGenerate(10, selectedTenant, selectedProvider);
                  onClose();
                }}
              >
                +10 Events
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={<Play className="w-3 h-3 text-cyan-400" />}
                onClick={() => {
                  onGenerate(100, selectedTenant, selectedProvider);
                  onClose();
                }}
              >
                +100 Events
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<Zap className="w-3 h-3" />}
                onClick={() => {
                  onGenerate(1000, selectedTenant, selectedProvider);
                  onClose();
                }}
              >
                +1,000 Burst
              </Button>
            </div>
          </div>

          {/* Outage Failure Injection (SRS-FR-003) */}
          <div className="p-3.5 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-semibold block text-xs">
                  Kafka Raw Topic Failure Injection
                </span>
                <span className="text-slate-400 text-[10px] block">
                  Tests fallback ring buffer backpressure (SRS-FR-003)
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isOutageActive
                    ? 'bg-red-950 text-red-400 border-red-800'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}
              >
                {isOutageActive ? 'OUTAGE ACTIVE' : 'HEALTHY'}
              </span>
            </div>

            {isOutageActive ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"
                icon={<RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                onClick={() => {
                  onRecover();
                  onClose();
                }}
              >
                Recover Broker & Flush Ring Buffer
              </Button>
            ) : (
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                icon={<AlertOctagon className="w-3.5 h-3.5" />}
                onClick={() => {
                  onToggleOutage(true);
                  onClose();
                }}
              >
                Simulate Broker Outage
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1E293B] bg-[#090E1A] flex justify-end">
          <Button variant="ghost" size="xs" onClick={onClose}>
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};
