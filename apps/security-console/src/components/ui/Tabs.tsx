import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center space-x-1 border-b border-[#1E1E24] ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium transition-all duration-150 relative -mb-px border-b-2 ${
              isActive
                ? 'border-[#EDEDEF] text-[#EDEDEF]'
                : 'border-transparent text-[#9898A0] hover:text-[#EDEDEF]'
            }`}
          >
            {tab.icon && <span className="w-3.5 h-3.5 shrink-0 opacity-80">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  isActive ? 'bg-[#26262E] text-[#EDEDEF]' : 'bg-[#18181C] text-[#62626B]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
