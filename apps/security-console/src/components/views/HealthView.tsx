import React from 'react';
import { SystemHealthState } from '../../types/demo.types';
import {
  Server,
  Cpu,
  Layers,
  ShieldCheck,
  AlertOctagon,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { Card } from '../ui/Card';
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
      protocol: 'REST / gRPC',
      port: '8080 / 50051',
      status: health.ingestionCollectorStatus,
      icon: Server,
      details: 'Express REST and Protobuf gRPC ingress endpoint',
    },
    {
      name: 'OCSF Normalizer Microservice',
      serviceId: '@sentinelai/ocsf-normalizer',
      protocol: 'Consumer Group',
      port: 'Embedded / Kafka',
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
      protocol: 'In-Memory Buffer',
      port: `${health.ringBufferDepth} / 5,000 frames`,
      status: health.ringBufferState === 'BACKPRESSURE_ACTIVE' ? 'DEGRADED' : 'HEALTHY',
      icon: AlertOctagon,
      details: 'Fault tolerance circular fallback during broker outages (SRS-FR-003)',
    },
    {
      name: 'Security Operations Console UI',
      serviceId: '@sentinelai/security-console',
      protocol: 'React 18 / Vite ESM',
      port: '3000 (HTTP)',
      status: 'ONLINE',
      icon: ShieldCheck,
      details: 'Enterprise SOC operational interface',
    },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-[#1C1C21]">
        <div>
          <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">System health</h1>
          <p className="text-xs text-[#9898A0] mt-0.5">
            Continuous availability and heartbeat monitoring across SentinelAI services
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {health.isOutageSimulated ? (
            <Button
              variant="primary"
              size="xs"
              icon={<RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0A0A0C]" />}
              onClick={onRecover}
            >
              Recover broker
            </Button>
          ) : (
            <Button
              variant="danger"
              size="xs"
              icon={<AlertOctagon className="w-3.5 h-3.5" />}
              onClick={() => onToggleOutage(true)}
            >
              Simulate outage
            </Button>
          )}

          <Button
            variant="secondary"
            size="xs"
            icon={<SlidersHorizontal className="w-3.5 h-3.5 text-[#9898A0]" />}
            onClick={onOpenDemoControls}
          >
            Simulation controls
          </Button>
        </div>
      </div>

      {/* Subsystem Health Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E0E11] text-[#62626B] border-b border-[#1C1C21]">
              <tr>
                <th className="px-4 py-2.5 font-medium">Subsystem</th>
                <th className="px-4 py-2.5 font-medium">Package / topic</th>
                <th className="px-4 py-2.5 font-medium">Interface</th>
                <th className="px-4 py-2.5 font-medium">Port / buffer</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C21]">
              {subsystems.map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <tr key={idx} className="hover:bg-[#18181C] transition-colors">
                    <td className="px-4 py-3 text-[#EDEDEF] font-medium">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-3.5 h-3.5 text-[#9898A0] shrink-0" />
                        <span>{sub.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#9898A0] font-mono text-[11px]">
                      {sub.serviceId}
                    </td>
                    <td className="px-4 py-3 text-[#9898A0]">{sub.protocol}</td>
                    <td className="px-4 py-3 text-[#62626B] font-mono text-[11px]">{sub.port}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={sub.status} pulse={sub.status === 'OUTAGE'} />
                    </td>
                    <td className="px-4 py-3 text-[#9898A0] text-xs">{sub.details}</td>
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
