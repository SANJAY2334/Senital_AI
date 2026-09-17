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
  placeholder = 'Search...',
  className = '',
  shortcutHint,
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-3.5 h-3.5 text-[#62626B] absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#141418] border border-[#222227] hover:border-[#2C2C34] focus:border-[#38BDF8]/60 text-[#EDEDEF] placeholder-[#62626B] text-xs pl-8 pr-8 py-1.5 rounded-md outline-none transition-all duration-150"
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 text-[#62626B] hover:text-[#EDEDEF] transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : shortcutHint ? (
        <span className="absolute right-2.5 text-[10px] bg-[#1C1C22] border border-[#2A2A32] text-[#62626B] px-1.5 py-0.5 rounded font-sans pointer-events-none">
          {shortcutHint}
        </span>
      ) : null}
    </div>
  );
};
