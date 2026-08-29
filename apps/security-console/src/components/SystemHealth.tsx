import React from 'react';
import { SystemHealthState } from '../types/demo.types';
import { Server, Layers, Cpu, ShieldCheck, AlertOctagon } from 'lucide-react';

interface SystemHealthProps {
  health: SystemHealthState;
}

export const SystemHealthComponent: React.FC<SystemHealthProps> = ({ health }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
      <h2 className="text-sm font-semibold font-mono text-slate-300 flex items-center justify-between">
        <span>SYSTEM HEALTH & SUBSYSTEM STATUS</span>
        <span className="text-xs text-slate-500 font-normal">SRS-FR-003 Compliance</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 font-mono text-xs">
        {/* Ingestion Collector */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Ingestion Collector</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{health.ingestionCollectorStatus}</span>
          </div>
          <p className="text-[10px] text-slate-500">Express REST / gRPC Ingress</p>
        </div>

        {/* OCSF Normalizer */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>OCSF Normalizer</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{health.ocsfNormalizerStatus}</span>
          </div>
          <p className="text-[10px] text-slate-500">Class 1007/3001/6001 Mappers</p>
        </div>

        {/* Kafka Raw Topic */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>telemetry.raw.v1</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`font-bold flex items-center space-x-1.5 ${health.kafkaRawTopicStatus === 'OUTAGE' ? 'text-red-400' : 'text-emerald-400'}`}>
            <span className={`w-2 h-2 rounded-full ${health.kafkaRawTopicStatus === 'OUTAGE' ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span>{health.kafkaRawTopicStatus}</span>
          </div>
          <p className="text-[10px] text-slate-500">Raw Vendor Stream</p>
        </div>

        {/* Kafka OCSF Topic */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>telemetry.ocsf.v1</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className={`font-bold flex items-center space-x-1.5 ${health.kafkaOcsfTopicStatus === 'OUTAGE' ? 'text-red-400' : 'text-emerald-400'}`}>
            <span className={`w-2 h-2 rounded-full ${health.kafkaOcsfTopicStatus === 'OUTAGE' ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
            <span>{health.kafkaOcsfTopicStatus}</span>
          </div>
          <p className="text-[10px] text-slate-500">Normalized Event Stream</p>
        </div>

        {/* Stream Ring Buffer */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Stream Ring Buffer</span>
            <AlertOctagon className="w-4 h-4 text-orange-400" />
          </div>
          <div className={`font-bold flex items-center space-x-1.5 ${health.ringBufferState === 'BACKPRESSURE_ACTIVE' ? 'text-amber-400' : 'text-slate-300'}`}>
            <span>{health.ringBufferState}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold">
            Depth: {health.ringBufferDepth} / 5,000
          </p>
        </div>
      </div>
    </div>
  );
};
