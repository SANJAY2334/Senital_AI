import {
  SyntheticTelemetryGenerator,
  SyntheticRawTelemetryPackage,
} from '@sentinelai/synthetic-log-generator';
import {
  OCSFNormalizerEngine,
  NormalizerMetricsCollector,
} from '@sentinelai/ocsf-normalizer/browser';
import { OCSFBaseEvent } from '@sentinelai/ocsf-types';
import {
  UIProcessedEvent,
  ExecutiveMetrics,
  ProviderDistribution,
  SystemHealthState,
  SOCAlert,
  AlertStatus,
  TimelineDataPoint,
} from '../types/demo.types';

export type TelemetryProvider = 'AWS_CLOUDTRAIL' | 'CROWDSTRIKE_EDR' | 'OKTA_IAM';

export class DemoPipelineAdapter {
  private generator: SyntheticTelemetryGenerator;
  private normalizerEngine: OCSFNormalizerEngine;
  private normalizerMetrics: NormalizerMetricsCollector;

  private eventsStore: UIProcessedEvent[] = [];
  private alertsStore: SOCAlert[] = [];
  private isOutageSimulated: boolean = false;
  private ringBufferStore: SyntheticRawTelemetryPackage[] = [];
  private maxRingBufferCapacity: number = 5000;

  private totalReceived = 0;
  private totalAccepted = 0;
  private totalNormalized = 0;
  private totalRejected = 0;
  private totalLatencySum = 0;

  constructor() {
    this.generator = new SyntheticTelemetryGenerator({ seed: Date.now() });
    this.normalizerMetrics = new NormalizerMetricsCollector();
    this.normalizerEngine = new OCSFNormalizerEngine(this.normalizerMetrics);
  }

  public setOutageSimulation(outage: boolean): void {
    this.isOutageSimulated = outage;
  }

  public isOutageActive(): boolean {
    return this.isOutageSimulated;
  }

  public generateAndProcessEvents(
    count: number,
    tenantOverride?: string,
    providerFilter?: string,
  ): UIProcessedEvent[] {
    const newEvents: UIProcessedEvent[] = [];
    const startTime = Date.now();

    for (let i = 0; i < count; i++) {
      this.totalReceived++;
      const rawPkg = this.generator.generateNextPayload();

      if (tenantOverride) {
        rawPkg.tenantId = tenantOverride;
      }
      if (providerFilter && providerFilter !== 'ALL') {
        rawPkg.provider = providerFilter as TelemetryProvider;
      }

      if (this.isOutageSimulated) {
        // Outage Backpressure Fallback (SRS-FR-003)
        if (this.ringBufferStore.length < this.maxRingBufferCapacity) {
          this.ringBufferStore.push(rawPkg);
        } else {
          this.ringBufferStore.shift(); // Drop oldest on overflow
          this.ringBufferStore.push(rawPkg);
        }
        this.totalAccepted++;

        const bufferedUIEvent: UIProcessedEvent = {
          eventId: rawPkg.eventId,
          tenantId: rawPkg.tenantId,
          provider: rawPkg.provider as TelemetryProvider,
          ocsfClassUid: 0,
          ocsfClassName: 'Raw Buffer (Outage)',
          severityId: 2,
          severityLabel: 'MEDIUM',
          timestampUtc: rawPkg.timestampUtc,
          correlationId: rawPkg.correlationId,
          rawPayload: rawPkg.rawPayload,
          ocsfNormalizedEvent: {} as OCSFBaseEvent,
          processingStatus: 'BUFFERED_BACKPRESSURE',
        };
        this.eventsStore.unshift(bufferedUIEvent);
        newEvents.push(bufferedUIEvent);
        continue;
      }

      // Live Normalization Pipeline Execution
      try {
        const ocsfEvent = this.normalizerEngine.normalizeRawTelemetry({
          eventId: rawPkg.eventId,
          tenantId: rawPkg.tenantId,
          provider: rawPkg.provider,
          timestampUtc: rawPkg.timestampUtc,
          correlationId: rawPkg.correlationId,
          rawPayload: rawPkg.rawPayload,
        });

        this.totalAccepted++;
        this.totalNormalized++;

        let ocsfClassName = 'Unknown Class';
        let severityLabel: UIProcessedEvent['severityLabel'] = 'LOW';

        if (ocsfEvent.class_uid === 1007) ocsfClassName = '1007 Process Activity';
        else if (ocsfEvent.class_uid === 3001) ocsfClassName = '3001 Authentication';
        else if (ocsfEvent.class_uid === 6001) ocsfClassName = '6001 Cloud Audit';

        if (ocsfEvent.severity_id === 4) severityLabel = 'CRITICAL';
        else if (ocsfEvent.severity_id === 3) severityLabel = 'HIGH';
        else if (ocsfEvent.severity_id === 2) severityLabel = 'MEDIUM';

        const correlationId =
          (ocsfEvent.metadata as { correlation_id?: string })?.correlation_id ||
          rawPkg.correlationId;

        const processedUIEvent: UIProcessedEvent = {
          eventId: ocsfEvent.ocsf_event_id,
          tenantId: ocsfEvent.tenant_id,
          provider: rawPkg.provider as TelemetryProvider,
          ocsfClassUid: ocsfEvent.class_uid,
          ocsfClassName,
          severityId: ocsfEvent.severity_id,
          severityLabel,
          timestampUtc: ocsfEvent.time,
          correlationId,
          rawPayload: rawPkg.rawPayload,
          ocsfNormalizedEvent: ocsfEvent,
          processingStatus: 'NORMALIZED',
        };

        this.eventsStore.unshift(processedUIEvent);
        newEvents.push(processedUIEvent);

        // Derive SOC Alerts for High/Critical correlated events
        if (severityLabel === 'CRITICAL' || severityLabel === 'HIGH') {
          let title = 'Potential Threat Activity Detected';
          let tactic = 'Initial Access';
          let technique = 'Valid Accounts';
          let techniqueId = 'T1078';
          let entityType: SOCAlert['affectedEntity']['type'] = 'HOST';
          let entityId = 'srv-prod-01.internal';

          if (rawPkg.provider === 'CROWDSTRIKE_EDR') {
            title =
              severityLabel === 'CRITICAL'
                ? 'High-Risk Process Code Injection (EDR)'
                : 'Suspicious Child Process Execution';
            tactic = 'Execution';
            technique = 'Command and Scripting Interpreter';
            techniqueId = 'T1059';
            entityType = 'HOST';
            entityId = `endpoint-${processedUIEvent.tenantId.replace('tenant-', '')}-01.internal`;
          } else if (rawPkg.provider === 'OKTA_IAM') {
            title =
              severityLabel === 'CRITICAL'
                ? 'Credential Access / Anomaly Login Spike'
                : 'Multiple Failed MFA Challenges';
            tactic = 'Credential Access';
            technique = 'Brute Force';
            techniqueId = 'T1110';
            entityType = 'USER';
            entityId = `secops-lead@${processedUIEvent.tenantId.replace('tenant-', '')}.com`;
          } else if (rawPkg.provider === 'AWS_CLOUDTRAIL') {
            title =
              severityLabel === 'CRITICAL'
                ? 'Unauthorized Security Group Bypass / Root API'
                : 'IAM Role Policy Modification';
            tactic = 'Persistence';
            technique = 'Account Manipulation';
            techniqueId = 'T1098';
            entityType = 'CLOUD_ACCOUNT';
            entityId = `arn:aws:iam::${processedUIEvent.tenantId.replace('tenant-', '')}:root`;
          }

          const alert: SOCAlert = {
            alertId: `ALT-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`,
            title,
            severityLabel,
            status: 'NEW',
            provider: rawPkg.provider as TelemetryProvider,
            tenantId: processedUIEvent.tenantId,
            detectedAt: processedUIEvent.timestampUtc,
            correlationId: processedUIEvent.correlationId,
            eventCount: Math.floor(Math.random() * 3) + 1,
            triggerEvent: processedUIEvent,
            investigationSummary: `Correlated telemetry signal from ${rawPkg.provider} indicates ${title.toLowerCase()} targeting ${entityId}. Telemetry normalized to OCSF Class ${ocsfClassName}.`,
            mitreAttack: {
              tactic,
              technique,
              techniqueId,
            },
            affectedEntity: {
              type: entityType,
              identifier: entityId,
            },
          };

          this.alertsStore.unshift(alert);
          if (this.alertsStore.length > 500) {
            this.alertsStore = this.alertsStore.slice(0, 500);
          }
        }
      } catch (err) {
        this.totalRejected++;
      }
    }

    const durationMs = Date.now() - startTime;
    this.totalLatencySum += durationMs;

    // Keep UI events store capped at 2,000 items
    if (this.eventsStore.length > 2000) {
      this.eventsStore = this.eventsStore.slice(0, 2000);
    }

    return newEvents;
  }

  public recoverPipelineAndFlush(): number {
    this.isOutageSimulated = false;
    const flushedCount = this.ringBufferStore.length;

    // Process buffered events upon recovery
    const bufferedCopy = [...this.ringBufferStore];
    this.ringBufferStore = [];

    for (const rawPkg of bufferedCopy) {
      try {
        const ocsfEvent = this.normalizerEngine.normalizeRawTelemetry(rawPkg);
        this.totalNormalized++;

        const correlationId =
          (ocsfEvent.metadata as { correlation_id?: string })?.correlation_id ||
          rawPkg.correlationId;

        const uiEvent: UIProcessedEvent = {
          eventId: ocsfEvent.ocsf_event_id,
          tenantId: ocsfEvent.tenant_id,
          provider: rawPkg.provider as TelemetryProvider,
          ocsfClassUid: ocsfEvent.class_uid,
          ocsfClassName:
            ocsfEvent.class_uid === 1007
              ? '1007 Process Activity'
              : ocsfEvent.class_uid === 3001
                ? '3001 Authentication'
                : '6001 Cloud Audit',
          severityId: ocsfEvent.severity_id,
          severityLabel:
            ocsfEvent.severity_id === 4
              ? 'CRITICAL'
              : ocsfEvent.severity_id === 3
                ? 'HIGH'
                : 'MEDIUM',
          timestampUtc: ocsfEvent.time,
          correlationId,
          rawPayload: rawPkg.rawPayload,
          ocsfNormalizedEvent: ocsfEvent,
          processingStatus: 'NORMALIZED',
        };
        this.eventsStore.unshift(uiEvent);
      } catch (err) {
        this.totalRejected++;
      }
    }

    return flushedCount;
  }

  public getEventsStore(): UIProcessedEvent[] {
    return this.eventsStore;
  }

  public getAlertsStore(): SOCAlert[] {
    return this.alertsStore;
  }

  public updateAlertStatus(alertId: string, status: AlertStatus): void {
    const alert = this.alertsStore.find((a) => a.alertId === alertId);
    if (alert) {
      alert.status = status;
    }
  }

  public getTimelineData(): TimelineDataPoint[] {
    const now = Date.now();
    const points: TimelineDataPoint[] = [];
    const stepMs = 5 * 60 * 1000; // 5 minute intervals

    const totalEvents = this.eventsStore.length;
    const totalAlerts = this.alertsStore.length;

    for (let i = 11; i >= 0; i--) {
      const bucketTime = now - i * stepMs;
      const date = new Date(bucketTime);
      const timeLabel = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      // Distribute event & alert volume across intervals
      const weight = 0.5 + 0.5 * Math.sin((12 - i) * 0.8) + (i === 0 ? 0.3 : 0);
      const eventSlice = Math.round((totalEvents / 12) * weight);
      const alertSlice = Math.round((totalAlerts / 12) * weight);

      points.push({
        timeLabel,
        timestamp: bucketTime,
        eventCount: Math.max(eventSlice, 1),
        alertCount: alertSlice,
      });
    }

    return points;
  }

  public getExecutiveMetrics(): ExecutiveMetrics {
    const avgLatency =
      this.totalReceived > 0
        ? parseFloat((this.totalLatencySum / Math.max(this.totalReceived / 100, 1)).toFixed(2))
        : 0.08;
    return {
      eventsReceived: this.totalReceived,
      eventsAccepted: this.totalAccepted,
      eventsNormalized: this.totalNormalized,
      eventsRejected: this.totalRejected,
      pipelineLatencyMs: avgLatency,
      currentThroughputEPS: this.isOutageSimulated ? 0 : 54300,
    };
  }

  public getProviderDistribution(): ProviderDistribution {
    let aws = 0;
    let cs = 0;
    let okta = 0;

    for (const e of this.eventsStore) {
      if (e.provider === 'AWS_CLOUDTRAIL') aws++;
      else if (e.provider === 'CROWDSTRIKE_EDR') cs++;
      else if (e.provider === 'OKTA_IAM') okta++;
    }

    const total = Math.max(this.eventsStore.length, 1);
    return {
      awsCount: aws,
      awsPercent: Math.round((aws / total) * 100),
      csCount: cs,
      csPercent: Math.round((cs / total) * 100),
      oktaCount: okta,
      oktaPercent: Math.round((okta / total) * 100),
    };
  }

  public getSystemHealth(): SystemHealthState {
    return {
      ingestionCollectorStatus: 'ONLINE',
      ocsfNormalizerStatus: 'ONLINE',
      kafkaRawTopicStatus: this.isOutageSimulated ? 'OUTAGE' : 'HEALTHY',
      kafkaOcsfTopicStatus: this.isOutageSimulated ? 'OUTAGE' : 'HEALTHY',
      ringBufferState: this.isOutageSimulated ? 'BACKPRESSURE_ACTIVE' : 'NORMAL',
      ringBufferDepth: this.ringBufferStore.length,
      isOutageSimulated: this.isOutageSimulated,
    };
  }
}

export const globalDemoAdapter = new DemoPipelineAdapter();
