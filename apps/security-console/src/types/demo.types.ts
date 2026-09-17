import { OCSFBaseEvent } from '@sentinelai/ocsf-types';

export type ViewTab =
  | 'overview'
  | 'alerts'
  | 'telemetry'
  | 'pipeline'
  | 'events'
  | 'health'
  | 'architecture'
  | 'ai-planned';

export interface UIProcessedEvent {
  eventId: string;
  tenantId: string;
  provider: 'AWS_CLOUDTRAIL' | 'CROWDSTRIKE_EDR' | 'OKTA_IAM';
  ocsfClassUid: number;
  ocsfClassName: string;
  severityId: number;
  severityLabel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestampUtc: string;
  correlationId: string;
  rawPayload: string;
  ocsfNormalizedEvent: OCSFBaseEvent;
  processingStatus: 'ACCEPTED' | 'NORMALIZED' | 'BUFFERED_BACKPRESSURE' | 'REJECTED';
}

export type AlertStatus = 'NEW' | 'TRIAGED' | 'INVESTIGATING' | 'RESOLVED';

export interface SOCAlert {
  alertId: string;
  title: string;
  severityLabel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: AlertStatus;
  provider: 'AWS_CLOUDTRAIL' | 'CROWDSTRIKE_EDR' | 'OKTA_IAM';
  tenantId: string;
  detectedAt: string;
  correlationId: string;
  eventCount: number;
  triggerEvent: UIProcessedEvent;
  investigationSummary: string;
  mitreAttack?: {
    tactic: string;
    technique: string;
    techniqueId: string;
  };
  affectedEntity: {
    type: 'HOST' | 'USER' | 'CLOUD_ACCOUNT' | 'SERVICE';
    identifier: string;
  };
}

export interface TimelineDataPoint {
  timeLabel: string;
  timestamp: number;
  eventCount: number;
  alertCount: number;
}

export interface ExecutiveMetrics {
  eventsReceived: number;
  eventsAccepted: number;
  eventsNormalized: number;
  eventsRejected: number;
  pipelineLatencyMs: number;
  currentThroughputEPS: number;
}

export interface ProviderDistribution {
  awsCount: number;
  awsPercent: number;
  csCount: number;
  csPercent: number;
  oktaCount: number;
  oktaPercent: number;
}

export interface SystemHealthState {
  ingestionCollectorStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  ocsfNormalizerStatus: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  kafkaRawTopicStatus: 'HEALTHY' | 'DEGRADED' | 'OUTAGE';
  kafkaOcsfTopicStatus: 'HEALTHY' | 'DEGRADED' | 'OUTAGE';
  ringBufferState: 'NORMAL' | 'BACKPRESSURE_ACTIVE';
  ringBufferDepth: number;
  isOutageSimulated: boolean;
}
