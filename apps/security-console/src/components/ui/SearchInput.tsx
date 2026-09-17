import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  shortcutHint?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search telemetry, correlation IDs, classes...',
  className = '',
  shortcutHint,
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#090E1A] border border-[#1E293B] hover:border-slate-700 focus:border-cyan-500 text-slate-200 text-xs font-mono pl-9 pr-8 py-1.5 rounded-lg outline-none transition-colors"
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : shortcutHint ? (
        <span className="absolute right-2.5 text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono pointer-events-none">
          {shortcutHint}
        </span>
      ) : null}
    </div>
  );
};
