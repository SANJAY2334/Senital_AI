import React from 'react';
import { Server, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-1 border-b border-[#1C1C21]">
        <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">
          Architecture specification
        </h1>
        <p className="text-xs text-[#9898A0] mt-0.5">
          Multi-cloud ingestion, partitioning, and OCSF v1.1.0 schematization substrate
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Ingestion Collector */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-[#9898A0]" />
              <CardTitle>Ingestion collector microservice</CardTitle>
            </div>
            <span className="text-xs text-[#62626B]">Port 8080 / 50051</span>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[#9898A0]">
              <li>
                • HTTP Endpoint:{' '}
                <code className="text-[#EDEDEF] font-mono text-[11px]">
                  POST /api/v1/ingest/raw
                </code>
              </li>
              <li>
                • gRPC Contract:{' '}
                <code className="text-[#EDEDEF] font-mono text-[11px]">IngestionService</code>{' '}
                (ingestion.proto)
              </li>
              <li>• Zero-Trust Tenant Validation (ADR-0006, ADR-0011)</li>
              <li>
                • Fallback Ring Buffer:{' '}
                <code className="text-[#EDEDEF] font-mono text-[11px]">StreamRingBuffer</code>{' '}
                (SRS-FR-003)
              </li>
              <li>
                • Kafka Producer: Topic{' '}
                <code className="text-[#EDEDEF] font-mono text-[11px]">telemetry.raw.v1</code>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* OCSF Normalizer */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#9898A0]" />
              <CardTitle>OCSF normalizer microservice</CardTitle>
            </div>
            <span className="text-xs text-[#62626B]">Consumer group</span>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[#9898A0]">
              <li>
                • Consumer Group:{' '}
                <code className="text-[#EDEDEF] font-mono text-[11px]">
                  sentinelai-ocsf-normalizer-group
                </code>
              </li>
              <li>• Class 6001: AWS CloudTrail $\rightarrow$ Cloud Audit</li>
              <li>• Class 1007: CrowdStrike EDR $\rightarrow$ Process Activity</li>
              <li>• Class 3001: Okta IAM $\rightarrow$ Authentication</li>
              <li>• Identifiers: 128-bit RFC 4122 UUID v4 + UTC timestamp</li>
              <li>
                • Kafka Producer: Topic{' '}
                <code className="text-[#EDEDEF] font-mono text-[11px]">telemetry.ocsf.v1</code>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Kafka Topics */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#9898A0]" />
              <CardTitle>Kafka event bus substrate</CardTitle>
            </div>
            <span className="text-xs text-[#62626B]">ADR-0004</span>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[#9898A0]">
              <li>
                • <code className="text-[#EDEDEF] font-mono text-[11px]">telemetry.raw.v1</code>:
                Preserves raw evidence (SRS-FR-001)
              </li>
              <li>
                • <code className="text-[#EDEDEF] font-mono text-[11px]">telemetry.ocsf.v1</code>:
                Normalized OCSF v1.1.0 events
              </li>
              <li>• High-Throughput Partitioning & Partition Key: Tenant ID</li>
            </ul>
          </CardContent>
        </Card>

        {/* Observability */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#9898A0]" />
              <CardTitle>Observability & telemetry</CardTitle>
            </div>
            <span className="text-xs text-[#62626B]">ADR-0013</span>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[#9898A0]">
              <li>
                • Endpoint:{' '}
                <code className="text-[#EDEDEF] font-mono text-[11px]">
                  GET /api/v1/ingest/metrics
                </code>
              </li>
              <li>• Tracks received, accepted, rejected, and normalized counters</li>
              <li>• Tracks Kafka publish failures and ring buffer depth</li>
              <li>• OpenTelemetry Prometheus metrics exporter</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
