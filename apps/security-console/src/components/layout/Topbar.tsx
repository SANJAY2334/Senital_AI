import React from 'react';
import { Shield, SlidersHorizontal, User } from 'lucide-react';
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
    <header className="h-13 bg-[#0A0A0C] border-b border-[#1E1E24] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Brand & Environment Identity */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-[#18181C] border border-[#26262E] flex items-center justify-center text-[#EDEDEF]">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-semibold tracking-tight text-[#EDEDEF]">SentinelAI</span>
            <span className="text-[11px] font-normal text-[#62626B]">Console</span>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-normal bg-[#18181C] text-[#9898A0] border border-[#26262E]">
          Demo environment
        </span>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:block w-72 lg:w-96">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search telemetry, events, alerts..."
          shortcutHint="⌘K"
        />
      </div>

      {/* Right Controls & Telemetry Status */}
      <div className="flex items-center space-x-3">
        {isOutageActive ? (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="font-medium">Broker outage active</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs text-[#9898A0]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-normal tabular-nums">{throughputEPS.toLocaleString()} EPS</span>
          </div>
        )}

        {/* Demo Controls Button */}
        <Button
          variant="secondary"
          size="xs"
          icon={<SlidersHorizontal className="w-3.5 h-3.5 text-[#9898A0]" />}
          onClick={onOpenDemoControls}
        >
          <span className="hidden sm:inline">Simulation</span>
        </Button>

        {/* User Session Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#1E1E24] text-[#9898A0]">
          <div className="w-7 h-7 rounded-full bg-[#18181C] border border-[#26262E] flex items-center justify-center text-[#9898A0]">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-medium text-[#EDEDEF] leading-tight">SecOps Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
