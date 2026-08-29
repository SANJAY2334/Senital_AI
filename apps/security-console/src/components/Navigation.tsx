import React from 'react';
import { ViewTab } from '../types/demo.types';
import { LayoutDashboard, Radio, Cpu, ListFilter, Activity, Network, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: ViewTab; label: string; icon: React.ReactNode; isPlanned?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'telemetry', label: 'Telemetry', icon: <Radio className="w-4 h-4" /> },
    { id: 'pipeline', label: 'Pipeline', icon: <Cpu className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <ListFilter className="w-4 h-4" /> },
    { id: 'health', label: 'System Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'architecture', label: 'Architecture', icon: <Network className="w-4 h-4" /> },
    { id: 'ai-planned', label: 'AI Capabilities', icon: <Sparkles className="w-4 h-4" />, isPlanned: true },
  ];

  return (
    <nav className="bg-[#0F172A] border-r border-slate-800 w-64 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <p className="px-3 text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Console Navigation
        </p>
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {t.icon}
                <span>{t.label}</span>
              </div>
              {t.isPlanned && (
                <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-800 px-1.5 py-0.5 rounded font-mono font-semibold">
                  Sprint 2+
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs space-y-2 font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <span>Sprint Scope:</span>
          <span className="text-cyan-400 font-bold">EPIC-1</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>OCSF Version:</span>
          <span className="text-slate-200">v1.1.0</span>
        </div>
      </div>
    </nav>
  );
};
