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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Topology Overview & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-[#1C1C21]">
        <div>
          <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">Pipeline topology</h1>
          <p className="text-xs text-[#9898A0] mt-0.5">
            Streaming ingestion, ring-buffer backpressure, and OCSF normalization flow
          </p>
        </div>

        <Button
          variant="secondary"
          size="xs"
          icon={<SlidersHorizontal className="w-3.5 h-3.5 text-[#9898A0]" />}
          onClick={onOpenDemoControls}
        >
          Failure injection
        </Button>
      </div>

      {/* Sequential Flow Pipeline Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
        {/* Node 1: Sources */}
        <div className="bg-[#121215] border border-[#222227] p-4 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#62626B] font-medium">1. Sources</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <div className="font-medium text-[#EDEDEF] text-xs">Ingress feeds</div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-1.5 text-[#9898A0]">
                <Cloud className="w-3.5 h-3.5 text-[#FB923C]" />
                <span>AWS CloudTrail</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#9898A0]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F43F5E]" />
                <span>CrowdStrike EDR</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#9898A0]">
                <KeyRound className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Okta IAM</span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1C1C21] text-[11px] text-[#62626B]">
            {metrics.eventsReceived.toLocaleString()} received
          </div>
        </div>

        {/* Node 2: Ingestion Collector */}
        <div className="bg-[#121215] border border-[#222227] p-4 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#62626B] font-medium">2. Ingestion</span>
              <Server className="w-3.5 h-3.5 text-[#9898A0]" />
            </div>

            <div>
              <div className="text-[#EDEDEF] font-medium text-xs">Collector</div>
              <div className="text-[11px] text-[#62626B]">REST / gRPC (Port 8080)</div>
            </div>

            <div className="space-y-1 text-[11px] text-[#9898A0]">
              <div>Zero-trust HMAC</div>
              <div className="text-emerald-400">
                Status: {health.ingestionCollectorStatus.toLowerCase()}
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1C1C21] text-[11px] text-[#62626B]">
            {metrics.eventsAccepted.toLocaleString()} accepted
          </div>
        </div>

        {/* Node 3: Kafka Raw Broker */}
        <div
          className={`bg-[#121215] border ${
            isOutage ? 'border-rose-500/40 bg-rose-500/5' : 'border-[#222227]'
          } p-4 rounded-lg space-y-3 flex flex-col justify-between`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-medium ${
                  isOutage ? 'text-rose-400' : 'text-[#62626B]'
                }`}
              >
                3. Raw bus
              </span>
              <Layers className={`w-3.5 h-3.5 ${isOutage ? 'text-rose-400' : 'text-[#9898A0]'}`} />
            </div>

            <div>
              <div className="text-[#EDEDEF] font-medium text-xs">telemetry.raw.v1</div>
              <div className="text-[11px] text-[#62626B]">Tenant key partition</div>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className={isOutage ? 'text-rose-400 font-medium' : 'text-emerald-400'}>
                {isOutage ? 'Broker outage' : 'Healthy'}
              </div>
              {isOutage && (
                <div className="text-amber-400 text-[11px] flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Buffer: {health.ringBufferDepth} frames</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1C1C21] text-[11px] text-[#62626B]">
            {isOutage ? 'Backpressure active' : 'Partitions synced'}
          </div>
        </div>

        {/* Node 4: OCSF Normalizer Engine */}
        <div className="bg-[#121215] border border-[#222227] p-4 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#62626B] font-medium">4. Normalizer</span>
              <Cpu className="w-3.5 h-3.5 text-[#9898A0]" />
            </div>

            <div>
              <div className="text-[#EDEDEF] font-medium text-xs">OCSF engine</div>
              <div className="text-[11px] text-[#62626B]">Classes 1007, 3001, 6001</div>
            </div>

            <div className="space-y-1 text-[11px] text-[#9898A0]">
              <div>RFC 4122 v4 UUID</div>
              <div className="text-emerald-400 font-medium">
                {metrics.currentThroughputEPS.toLocaleString()} EPS
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1C1C21] text-[11px] text-[#62626B]">
            {metrics.eventsNormalized.toLocaleString()} normalized
          </div>
        </div>

        {/* Node 5: Kafka OCSF Output */}
        <div className="bg-[#121215] border border-[#222227] p-4 rounded-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#62626B] font-medium">5. OCSF bus</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div>
              <div className="text-[#EDEDEF] font-medium text-xs">telemetry.ocsf.v1</div>
              <div className="text-[11px] text-[#62626B]">Standard v1.1.0</div>
            </div>

            <div className="space-y-1 text-[11px] text-[#9898A0]">
              <div className="text-emerald-400">Egress active</div>
              <div>SOC consumer group</div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#1C1C21] text-[11px] text-[#62626B]">
            Latency: {metrics.pipelineLatencyMs} ms
          </div>
        </div>
      </div>

      {/* 3. Architecture & Compliance Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture & compliance guarantees</CardTitle>
          <span className="text-xs text-[#62626B]">ADR-0003 · ADR-0004 · SRS-FR-003</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1.5">
              <span className="text-[#EDEDEF] font-medium block">Raw evidence immutability</span>
              <p className="text-[#9898A0] leading-relaxed">
                Raw payloads are preserved untouched within the Kafka raw topic and normalizer
                envelope to satisfy forensic chain-of-custody requirements (SRS-FR-001).
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[#EDEDEF] font-medium block">Zero-trust multi-tenancy</span>
              <p className="text-[#9898A0] leading-relaxed">
                Every record is partitioned by tenant ID key; normalization rules execute in
                isolated contexts preventing cross-tenant data leakage (ADR-0006).
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[#EDEDEF] font-medium block">Backpressure ring buffer</span>
              <p className="text-[#9898A0] leading-relaxed">
                In the event of downstream Kafka broker latency or partition failure, an in-memory
                circular buffer holds up to 5,000 raw frames before dropping the oldest
                (SRS-FR-003).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
