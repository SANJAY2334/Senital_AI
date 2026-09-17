import React from 'react';
import { SystemHealthState, ExecutiveMetrics } from '../../types/demo.types';
import {
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  SlidersHorizontal,
  Cloud,
  ShieldAlert,
  KeyRound,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface PipelineViewProps {
  health: SystemHealthState;
  metrics: ExecutiveMetrics;
  onOpenDemoControls: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  health,
  metrics,
  onOpenDemoControls,
}) => {
  const isOutage = health.isOutageSimulated;

  return (
    <div className="space-y-5">
      {/* 1. Header with Topology Overview & Action */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>End-to-End Telemetry Pipeline Topology</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Multi-cloud streaming ingestion, partitioning, and OCSF normalization flow
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="xs"
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            onClick={onOpenDemoControls}
          >
            Pipeline Failure Injection
          </Button>
        </CardHeader>
      </Card>

      {/* 2. Interactive Flow Pipeline Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
        {/* Node 1: Sources */}
        <div className="bg-[#0D1424] border border-[#1E293B] p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              1. Ingress Sources
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center space-x-1.5 text-amber-400">
              <Cloud className="w-3.5 h-3.5" />
              <span>AWS CloudTrail</span>
            </div>
            <div className="flex items-center space-x-1.5 text-red-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CrowdStrike EDR</span>
            </div>
            <div className="flex items-center space-x-1.5 text-cyan-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Okta IAM</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E293B] text-[10px] text-slate-400">
            Total: {metrics.eventsReceived.toLocaleString()} received
          </div>
        </div>

        {/* Node 2: Ingestion Collector */}
        <div className="bg-[#0D1424] border border-cyan-900/50 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-cyan-500 uppercase font-bold">2. Collector</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>

          <div>
            <div className="text-slate-100 font-bold text-xs">Ingestion Collector</div>
            <div className="text-[10px] text-slate-400">Port 8080 REST / gRPC</div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div>Auth: Zero-Trust HMAC</div>
            <div className="text-emerald-400">Status: {health.ingestionCollectorStatus}</div>
          </div>

          <div className="pt-2 border-t border-[#1E293B] text-[10px] text-slate-400">
            Accepted: {metrics.eventsAccepted.toLocaleString()}
          </div>
        </div>

        {/* Node 3: Kafka Raw Broker */}
        <div
          className={`bg-[#0D1424] border ${
            isOutage ? 'border-red-600 bg-red-950/20' : 'border-[#1E293B]'
          } p-4 rounded-xl space-y-3`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] uppercase font-bold ${
                isOutage ? 'text-red-400' : 'text-slate-500'
              }`}
            >
              3. Kafka Raw Bus
            </span>
            <Layers className={`w-4 h-4 ${isOutage ? 'text-red-400' : 'text-amber-400'}`} />
          </div>

          <div>
            <div className="text-slate-100 font-bold text-xs">telemetry.raw.v1</div>
            <div className="text-[10px] text-slate-400">SRS-FR-001 Preserved</div>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className={isOutage ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              Broker: {health.kafkaRawTopicStatus}
            </div>
            {isOutage && (
              <div className="text-amber-400 text-[10px] flex items-center space-x-1 font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>Buffer Depth: {health.ringBufferDepth}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#1E293B] text-[10px] text-slate-400">
            Partitions: Tenant Key
          </div>
        </div>

        {/* Node 4: OCSF Normalizer Engine */}
        <div className="bg-[#0D1424] border border-purple-900/50 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-400 uppercase font-bold">4. Schematizer</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>

          <div>
            <div className="text-slate-100 font-bold text-xs">OCSF Normalizer</div>
            <div className="text-[10px] text-slate-400">Class 1007 / 3001 / 6001</div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div>UUID: RFC 4122 v4</div>
            <div className="text-emerald-400 font-bold">
              Rate: {metrics.currentThroughputEPS.toLocaleString()} EPS
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E293B] text-[10px] text-slate-400">
            Normalized: {metrics.eventsNormalized.toLocaleString()}
          </div>
        </div>

        {/* Node 5: Kafka OCSF Output */}
        <div className="bg-[#0D1424] border border-emerald-900/50 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 uppercase font-bold">5. OCSF Bus</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <div className="text-slate-100 font-bold text-xs">telemetry.ocsf.v1</div>
            <div className="text-[10px] text-slate-400">Unified Schema v1.1.0</div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300">
            <div className="text-emerald-400">Egress: Healthy</div>
            <div>Consumer: SOC Engine</div>
          </div>

          <div className="pt-2 border-t border-[#1E293B] text-[10px] text-slate-400">
            Latency: {metrics.pipelineLatencyMs} ms
          </div>
        </div>
      </div>

      {/* 3. Pipeline Specifications Card */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture & Compliance Guarantees</CardTitle>
          <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-mono">
            ADR-0003 / ADR-0004 / SRS-FR-003
          </span>
        </CardHeader>
        <CardContent className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                Raw Evidence Immutability (SRS-FR-001)
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Raw payloads are stored untouched within the Kafka raw topic and normalizer envelope
                to satisfy forensic chain-of-custody compliance.
              </p>
            </div>

            <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                Zero-Trust Multi-Tenancy (ADR-0006)
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Every record is partitioned by tenant ID key; normalization rules execute in
                isolated context preventing multi-tenant data leakage.
              </p>
            </div>

            <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-1">
              <span className="text-slate-400 font-semibold block text-[11px]">
                Backpressure Ring Buffer (SRS-FR-003)
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                In the event of downstream Kafka broker latency or partition failure, an in-memory
                circular buffer holds up to 5,000 raw frames before dropping oldest.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
