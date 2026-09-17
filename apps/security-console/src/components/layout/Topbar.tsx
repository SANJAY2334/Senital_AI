import React from 'react';
import { Shield, Radio, AlertOctagon, SlidersHorizontal, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchInput } from '../ui/SearchInput';

interface TopbarProps {
  isOutageActive: boolean;
  throughputEPS: number;
  onOpenDemoControls: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  isOutageActive,
  throughputEPS,
  onOpenDemoControls,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="h-14 bg-[#0D1424] border-b border-[#1E293B] px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Brand & Environment Identity */}
      <div className="flex items-center space-x-3">
        <div className="bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/30 flex items-center justify-center">
          <Shield className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold tracking-wider text-slate-100 font-mono">
            SENTINEL<span className="text-cyan-400">AI</span>
          </span>
          <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
            SOC CONSOLE
          </span>
          <span className="bg-amber-950/80 text-amber-400 border border-amber-800/80 text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold">
            SIMULATED DEMO
          </span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:block w-80 max-w-sm">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Global search telemetry, hashes, tenants..."
          shortcutHint="⌘K"
        />
      </div>

      {/* Right Controls & Telemetry Heartbeat */}
      <div className="flex items-center space-x-3">
        {isOutageActive ? (
          <div className="flex items-center space-x-1.5 bg-red-950/90 border border-red-800 text-red-400 px-2.5 py-1 rounded text-xs font-mono font-semibold animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">KAFKA OUTAGE ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 px-2.5 py-1 rounded text-xs font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-semibold">{throughputEPS.toLocaleString()} EPS</span>
          </div>
        )}

        {/* Demo Controls Button */}
        <Button
          variant="primary"
          size="xs"
          icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          onClick={onOpenDemoControls}
        >
          <span className="hidden sm:inline">Demo Controls</span>
        </Button>

        {/* User / Session Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1E293B] text-slate-400">
          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left font-mono">
            <div className="text-[11px] font-semibold text-slate-200 leading-tight">
              SecOps Lead
            </div>
            <div className="text-[9px] text-slate-500 leading-tight">Tier-2 Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
};
