import React from 'react';
import { Shield, Radio, AlertCircle } from 'lucide-react';

interface HeaderProps {
  isOutageActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isOutageActive }) => {
  return (
    <header className="bg-[#0F172A] border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/30">
          <Shield className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-wider text-slate-100 font-mono">
              SENTINELAI
            </h1>
            <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs px-2 py-0.5 rounded font-mono font-medium">
              v1.0.0-DEMO
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Security Operations Command & Control Console
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {isOutageActive ? (
          <div className="flex items-center space-x-2 bg-red-950/80 border border-red-800 text-red-400 px-3 py-1.5 rounded-lg text-xs font-mono font-medium animate-pulse">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>KAFKA OUTAGE SIMULATED — RING BUFFER BACKPRESSURE ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-mono font-medium">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>PIPELINE HEALTHY — REAL TIME STREAM</span>
          </div>
        )}

        <div className="bg-amber-950/80 border border-amber-800 text-amber-400 text-xs px-3 py-1.5 rounded-lg font-mono font-semibold">
          DEMO MODE
        </div>
      </div>
    </header>
  );
};
