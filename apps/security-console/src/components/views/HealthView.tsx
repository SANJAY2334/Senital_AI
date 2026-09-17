import React from 'react';
import { SystemHealthState } from '../../types/demo.types';
import {
  Activity,
  Server,
  Cpu,
  Layers,
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface HealthViewProps {
  health: SystemHealthState;
  onOpenDemoControls: () => void;
  onRecover: () => void;
  onToggleOutage: (outage: boolean) => void;
}

export const HealthView: React.FC<HealthViewProps> = ({
  health,
  onOpenDemoControls,
  onRecover,
  onToggleOutage,
}) => {
  const subsystems = [
    {
      name: 'Ingestion Collector Microservice',
      serviceId: '@sentinelai/ingestion-collector',
      protocol: 'HTTP REST / gRPC IngestionService',
      port: '8080 / 50051',
      status: health.ingestionCollectorStatus,
      icon: Server,
      details: 'Express REST and Protobuf gRPC ingress endpoint',
    },
    {
      name: 'OCSF Normalizer Microservice',
      serviceId: '@sentinelai/ocsf-normalizer',
      protocol: 'Event Consumer & Schematizer',
      port: 'Embedded / Kafka Consumer Group',
      status: health.ocsfNormalizerStatus,
      icon: Cpu,
      details: 'OCSF v1.1.0 engine (Classes 1007, 3001, 6001)',
    },
    {
      name: 'Kafka Raw Telemetry Bus',
      serviceId: 'telemetry.raw.v1',
      protocol: 'Apache Kafka 3.6',
      port: '9092 (PLAINTEXT)',
      status: health.kafkaRawTopicStatus,
      icon: Layers,
      details: 'Preserves raw evidence payload with tenant partition key',
    },
    {
      name: 'Kafka OCSF Normalized Bus',
      serviceId: 'telemetry.ocsf.v1',
      protocol: 'Apache Kafka 3.6',
      port: '9092 (PLAINTEXT)',
      status: health.kafkaOcsfTopicStatus,
      icon: ShieldCheck,
      details: 'Normalized RFC 4122 UUID v4 event stream',
    },
    {
      name: 'Stream Ring Buffer Backpressure',
      serviceId: 'StreamRingBuffer',
      protocol: 'In-Memory Circular Buffer',
      port: `Depth: ${health.ringBufferDepth} / 5,000`,
      status: health.ringBufferState === 'BACKPRESSURE_ACTIVE' ? 'DEGRADED' : 'HEALTHY',
      icon: AlertOctagon,
      details: 'SRS-FR-003 fault tolerance fallback during broker outages',
    },
    {
      name: 'Security Operations Console UI',
      serviceId: '@sentinelai/security-console',
      protocol: 'Vite / React 18 ESM',
      port: '3000 (HTTP)',
      status: 'ONLINE',
      icon: Activity,
      details: 'Production-grade enterprise SOC command console',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header with quick status summary & actions */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>System Health & Subsystem Telemetry</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Continuous heartbeat monitoring across all SentinelAI services
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {health.isOutageSimulated ? (
              <Button
                variant="primary"
                size="xs"
                className="bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white"
                icon={<RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                onClick={onRecover}
              >
                Recover Pipeline
              </Button>
            ) : (
              <Button
                variant="danger"
                size="xs"
                icon={<AlertOctagon className="w-3.5 h-3.5" />}
                onClick={() => onToggleOutage(true)}
              >
                Simulate Kafka Outage
              </Button>
            )}

            <Button
              variant="outline"
              size="xs"
              icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              onClick={onOpenDemoControls}
            >
              Simulation Settings
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Subsystem Health Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#090E1A] text-slate-400 border-b border-[#1E293B]">
              <tr>
                <th className="p-3">Subsystem Name</th>
                <th className="p-3">Package / Topic ID</th>
                <th className="p-3">Protocol / Interface</th>
                <th className="p-3">Port / Depth</th>
                <th className="p-3">Operational Status</th>
                <th className="p-3">Architecture Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/70">
              {subsystems.map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <tr key={idx} className="hover:bg-[#1B2640]/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{sub.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-cyan-300">{sub.serviceId}</td>
                    <td className="p-3 text-slate-300">{sub.protocol}</td>
                    <td className="p-3 text-slate-400">{sub.port}</td>
                    <td className="p-3">
                      <StatusBadge status={sub.status} pulse={sub.status === 'OUTAGE'} />
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">{sub.details}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
