import React from 'react';
import { Network, Server, Layers, Cpu, ShieldCheck } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Network className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-100">
            SENTINELAI SPRINT 1 ARCHITECTURE OVERVIEW
          </h2>
        </div>
        <p className="text-slate-400">
          Demonstrates the multi-cloud ingestion and schematization substrate built during Sprint 1
          (EPIC-1, Tasks T-1.1 through T-1.5).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingestion Collector */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Server className="w-4 h-4" />
            <span>Ingestion Collector Microservice (T-1.3)</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            <li>
              • Endpoint: <code className="text-cyan-300">POST /api/v1/ingest/raw</code>
            </li>
            <li>
              • gRPC Contract: <code className="text-purple-300">IngestionService</code>{' '}
              (ingestion.proto)
            </li>
            <li>
              • Zero-Trust Tenant Validation (<code className="text-amber-300">ADR-0006</code>,{' '}
              <code className="text-amber-300">ADR-0011</code>)
            </li>
            <li>
              • Fallback Ring Buffer: <code className="text-emerald-300">StreamRingBuffer</code> (
              <code className="text-amber-300">SRS-FR-003</code>)
            </li>
            <li>
              • Kafka Producer: Topic <code className="text-cyan-300">telemetry.raw.v1</code>
            </li>
          </ul>
        </div>

        {/* OCSF Normalizer */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>OCSF Normalizer Microservice (T-1.4)</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            <li>
              • Consumer Group:{' '}
              <code className="text-cyan-300">sentinelai-ocsf-normalizer-group</code>
            </li>
            <li>• Class 6001: AWS CloudTrail $\rightarrow$ Cloud Audit</li>
            <li>• Class 1007: CrowdStrike EDR $\rightarrow$ Process Activity</li>
            <li>• Class 3001: Okta IAM $\rightarrow$ Authentication</li>
            <li>• Identifiers: 128-bit RFC 4122 UUID v4 + UTC timestamp</li>
            <li>
              • Kafka Producer: Topic <code className="text-emerald-300">telemetry.ocsf.v1</code>
            </li>
          </ul>
        </div>

        {/* Kafka Topics */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>Kafka Event Bus Substrate (ADR-0004)</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            <li>
              • <code className="text-amber-300">telemetry.raw.v1</code>: Preserves raw evidence (
              <code className="text-amber-300">SRS-FR-001</code>)
            </li>
            <li>
              • <code className="text-emerald-300">telemetry.ocsf.v1</code>: Normalized OCSF v1.1
              events
            </li>
            <li>• High-Throughput Partitioning & Partition Key: Tenant ID</li>
          </ul>
        </div>

        {/* Observability */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Observability & Metrics (ADR-0013)</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            <li>
              • <code className="text-cyan-300">GET /api/v1/ingest/metrics</code>
            </li>
            <li>• Tracks received, accepted, rejected, normalized counters</li>
            <li>• Tracks Kafka publish failures & ring buffer depth</li>
            <li>• OpenTelemetry Prometheus metrics exporter</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
