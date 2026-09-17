import React from 'react';
import { ViewTab } from '../../types/demo.types';
import {
  LayoutDashboard,
  ShieldAlert,
  ListFilter,
  Radio,
  Cpu,
  Activity,
  Network,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  alertCount?: number;
  eventCount?: number;
}

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
  isPlanned?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  alertCount = 0,
  eventCount = 0,
}) => {
  const operationsGroup: NavItem[] = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'alerts',
      label: 'Alerts Triage',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: alertCount > 0 ? alertCount : undefined,
      badgeColor: 'bg-red-950 text-red-400 border-red-800',
    },
    {
      id: 'events',
      label: 'Event Stream',
      icon: <ListFilter className="w-4 h-4" />,
      badge: eventCount > 0 ? eventCount : undefined,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
  ];

  const infrastructureGroup: NavItem[] = [
    {
      id: 'telemetry',
      label: 'Telemetry Stats',
      icon: <Radio className="w-4 h-4" />,
    },
    {
      id: 'pipeline',
      label: 'Pipeline Flow',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: 'health',
      label: 'System Health',
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  const engineeringGroup: NavItem[] = [
    {
      id: 'architecture',
      label: 'Architecture',
      icon: <Network className="w-4 h-4" />,
    },
    {
      id: 'ai-planned',
      label: 'AI Capabilities',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'Sprint 2+',
      badgeColor: 'bg-indigo-950 text-indigo-400 border-indigo-800',
      isPlanned: true,
    },
  ];

  const renderGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1 mb-4">
      <div className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-1">
        {title}
      </div>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all soc-focus-ring ${
              isActive
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                  item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className="w-60 bg-[#0D1424] border-r border-[#1E293B] p-3 flex flex-col justify-between shrink-0 h-full select-none overflow-y-auto">
      <div>
        {renderGroup('Operations', operationsGroup)}
        {renderGroup('Infrastructure', infrastructureGroup)}
        {renderGroup('Engineering', engineeringGroup)}
      </div>

      {/* Footer metadata */}
      <div className="bg-[#090E1A] border border-[#1E293B] p-3 rounded-lg text-[11px] font-mono space-y-1.5 text-slate-400">
        <div className="flex items-center justify-between">
          <span>Sprint Milestone:</span>
          <span className="text-cyan-400 font-bold">EPIC-1</span>
        </div>
        <div className="flex items-center justify-between">
          <span>OCSF Schematizer:</span>
          <span className="text-slate-200">v1.1.0</span>
        </div>
      </div>
    </nav>
  );
};
