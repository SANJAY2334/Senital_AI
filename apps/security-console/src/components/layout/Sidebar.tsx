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
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, alertCount = 0 }) => {
  const operationsGroup: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: alertCount > 0 ? alertCount : undefined,
      badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    },
    {
      id: 'events',
      label: 'Events',
      icon: <ListFilter className="w-4 h-4" />,
    },
  ];

  const platformGroup: NavItem[] = [
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: 'telemetry',
      label: 'Telemetry',
      icon: <Radio className="w-4 h-4" />,
    },
    {
      id: 'health',
      label: 'System health',
      icon: <Activity className="w-4 h-4" />,
    },
  ];

  const referenceGroup: NavItem[] = [
    {
      id: 'architecture',
      label: 'Architecture',
      icon: <Network className="w-4 h-4" />,
    },
    {
      id: 'ai-planned',
      label: 'Roadmap',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const renderGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-0.5 mb-5">
      <div className="px-2.5 py-1 text-[11px] font-medium text-[#62626B]">{title}</div>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all duration-150 ${
              isActive
                ? 'bg-[#18181C] text-[#EDEDEF] font-medium shadow-xs'
                : 'text-[#9898A0] hover:bg-[#141418] hover:text-[#EDEDEF]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <span className={isActive ? 'text-[#EDEDEF]' : 'text-[#62626B]'}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span
                className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                  item.badgeColor || 'bg-[#222227] text-[#9898A0]'
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
    <nav className="w-56 bg-[#0A0A0C] border-r border-[#1E1E24] p-3 flex flex-col justify-between shrink-0 h-full select-none overflow-y-auto">
      <div>
        {renderGroup('Operations', operationsGroup)}
        {renderGroup('Platform', platformGroup)}
        {renderGroup('Reference', referenceGroup)}
      </div>

      {/* Footer metadata */}
      <div className="pt-3 border-t border-[#1C1C21] px-2.5 text-[11px] text-[#62626B] flex items-center justify-between">
        <span>SentinelAI v1.1</span>
        <span>OCSF v1.1.0</span>
      </div>
    </nav>
  );
};
