import React, { useState } from 'react';
import { X, Play, RefreshCw, AlertOctagon, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-[#121215] border border-[#222227] shadow-2xl rounded-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1C1C21] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#EDEDEF]">Simulation controls</h3>
            <p className="text-xs text-[#9898A0] mt-0.5">
              Generate synthetic workloads and test backpressure recovery
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#9898A0] hover:text-[#EDEDEF] hover:bg-[#18181C] rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 text-xs">
          {/* Target Parameters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#9898A0] text-xs mb-1 font-medium">Tenant scope</label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className="w-full bg-[#18181C] border border-[#26262E] text-[#EDEDEF] px-2.5 py-1.5 rounded-md text-xs outline-none focus:border-[#38BDF8]"
              >
                <option value="tenant-acme">Acme Corp</option>
                <option value="tenant-beta">Beta Financial</option>
                <option value="tenant-gamma">Gamma Healthcare</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9898A0] text-xs mb-1 font-medium">
                Provider filter
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full bg-[#18181C] border border-[#26262E] text-[#EDEDEF] px-2.5 py-1.5 rounded-md text-xs outline-none focus:border-[#38BDF8]"
              >
                <option value="ALL">All providers</option>
                <option value="AWS_CLOUDTRAIL">AWS CloudTrail</option>
                <option value="CROWDSTRIKE_EDR">CrowdStrike EDR</option>
                <option value="OKTA_IAM">Okta IAM</option>
              </select>
            </div>
          </div>

          {/* Event Generation Presets */}
          <div className="space-y-2">
            <span className="block text-[#9898A0] text-xs font-medium">
              Synthetic event generation
            </span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Play className="w-3 h-3 text-[#9898A0]" />}
                onClick={() => {
                  onGenerate(10, selectedTenant, selectedProvider);
                  onClose();
                }}
              >
                +10 events
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={<Play className="w-3 h-3 text-[#9898A0]" />}
                onClick={() => {
                  onGenerate(100, selectedTenant, selectedProvider);
                  onClose();
                }}
              >
                +100 events
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<Zap className="w-3 h-3 text-[#0A0A0C]" />}
                onClick={() => {
                  onGenerate(1000, selectedTenant, selectedProvider);
                  onClose();
                }}
              >
                +1,000 burst
              </Button>
            </div>
          </div>

          {/* Outage Failure Injection (SRS-FR-003) */}
          <div className="p-3.5 bg-[#18181C] border border-[#26262E] rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[#EDEDEF] font-medium block">Broker outage simulation</span>
                <span className="text-[#9898A0] text-[11px] block mt-0.5">
                  Tests fallback circular buffer backpressure (SRS-FR-003)
                </span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  isOutageActive
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {isOutageActive ? 'Outage active' : 'Operational'}
              </span>
            </div>

            {isOutageActive ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                icon={<RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0A0A0C]" />}
                onClick={() => {
                  onRecover();
                  onClose();
                }}
              >
                Recover broker & flush buffer
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
                Simulate Kafka broker outage
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1C1C21] bg-[#0E0E11] flex justify-end">
          <Button variant="ghost" size="xs" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
