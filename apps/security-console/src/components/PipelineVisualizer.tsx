import React from 'react';
import { ArrowRight, Cpu, Layers, Server, AlertTriangle } from 'lucide-react';

interface PipelineVisualizerProps {
  isOutageActive: boolean;
  ringBufferDepth: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  isOutageActive,
  ringBufferDepth,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
      <h2 className="text-sm font-semibold font-mono text-slate-300 flex items-center justify-between">
        <span>EPIC-1 TELEMETRY PIPELINE FLOW</span>
        <span className="text-xs text-cyan-400 font-normal">ADR-0003 / ADR-0004 Architecture</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-xs font-mono">
        {/* Step 1: Providers */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg space-y-2">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Sources</div>
          <div className="text-amber-400 font-medium">AWS CloudTrail</div>
          <div className="text-red-400 font-medium">CrowdStrike EDR</div>
          <div className="text-cyan-400 font-medium">Okta IAM</div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </div>

        {/* Step 2: Ingestion Collector */}
        <div className="bg-slate-950 border border-cyan-900/50 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-cyan-500 font-bold uppercase">Ingestion</span>
            <Server className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-slate-200 font-bold">Ingestion Collector</div>
          <div className="text-[10px] text-slate-400">HTTP POST / raw gRPC</div>
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </div>

        {/* Step 3: Kafka Raw Topic */}
        <div
          className={`bg-slate-950 border ${isOutageActive ? 'border-red-600 bg-red-950/30' : 'border-slate-800'} p-3 rounded-lg space-y-2`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] ${isOutageActive ? 'text-red-400' : 'text-slate-500'} font-bold uppercase`}
            >
              Kafka Stream
            </span>
            <Layers
              className={`w-3.5 h-3.5 ${isOutageActive ? 'text-red-400' : 'text-slate-400'}`}
            />
          </div>
          <div className="text-slate-200 font-bold">telemetry.raw.v1</div>
          {isOutageActive ? (
            <div className="text-[10px] text-red-400 font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Buffer: {ringBufferDepth}</span>
            </div>
          ) : (
            <div className="text-[10px] text-emerald-400 font-medium">Active Broker</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-xs font-mono pt-2 border-t border-slate-800/60">
        <div className="col-span-2 text-slate-500 text-[10px] italic">
          Preserves raw payload & assigns correlation metadata (SRS-FR-001)
        </div>

        <div className="flex justify-center text-slate-600">
          <ArrowRight className="w-5 h-5 animate-pulse" />
        </div>

        {/* Step 4: OCSF Normalizer */}
        <div className="bg-slate-950 border border-purple-900/50 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-400 font-bold uppercase">Schematizer</span>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-slate-200 font-bold">OCSF Normalizer</div>
          <div className="text-[10px] text-slate-400">Class 1007/3001/6001</div>
        </div>

        <div className="bg-slate-950 border border-emerald-900/50 p-3 rounded-lg space-y-2">
          <div className="text-[10px] text-emerald-400 font-bold uppercase">Output Stream</div>
          <div className="text-slate-200 font-bold">telemetry.ocsf.v1</div>
          <div className="text-[10px] text-emerald-400">RFC 4122 UUID v4</div>
        </div>
      </div>
    </div>
  );
};
