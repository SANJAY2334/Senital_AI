import { SyntheticTelemetryGenerator, SyntheticRawTelemetryPackage } from '@sentinelai/synthetic-log-generator';
import { OCSFNormalizerEngine, NormalizerMetricsCollector } from '@sentinelai/ocsf-normalizer';
import { UIProcessedEvent, ExecutiveMetrics, ProviderDistribution, SystemHealthState } from '../types/demo.types';

export class DemoPipelineAdapter {
  private generator: SyntheticTelemetryGenerator;
  private normalizerEngine: OCSFNormalizerEngine;
  private normalizerMetrics: NormalizerMetricsCollector;
  
  private eventsStore: UIProcessedEvent[] = [];
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

  public generateAndProcessEvents(count: number, tenantOverride?: string, providerFilter?: string): UIProcessedEvent[] {
    const newEvents: UIProcessedEvent[] = [];
    const startTime = Date.now();

    for (let i = 0; i < count; i++) {
      this.totalReceived++;
      const rawPkg = this.generator.generateNextPayload();
      
      if (tenantOverride) {
        rawPkg.tenantId = tenantOverride;
      }
      if (providerFilter && providerFilter !== 'ALL') {
        rawPkg.provider = providerFilter as any;
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
          provider: rawPkg.provider as any,
          ocsfClassUid: 0,
          ocsfClassName: 'Raw Buffer (Outage)',
          severityId: 2,
          severityLabel: 'MEDIUM',
          timestampUtc: rawPkg.timestampUtc,
          correlationId: rawPkg.correlationId,
          rawPayload: rawPkg.rawPayload,
          ocsfNormalizedEvent: {} as any,
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

        const processedUIEvent: UIProcessedEvent = {
          eventId: ocsfEvent.ocsf_event_id,
          tenantId: ocsfEvent.tenant_id,
          provider: rawPkg.provider as any,
          ocsfClassUid: ocsfEvent.class_uid,
          ocsfClassName,
          severityId: ocsfEvent.severity_id,
          severityLabel,
          timestampUtc: ocsfEvent.time,
          correlationId: (ocsfEvent.metadata as any)?.correlation_id || rawPkg.correlationId,
          rawPayload: rawPkg.rawPayload,
          ocsfNormalizedEvent: ocsfEvent,
          processingStatus: 'NORMALIZED',
        };

        this.eventsStore.unshift(processedUIEvent);
        newEvents.push(processedUIEvent);
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
        
        const uiEvent: UIProcessedEvent = {
          eventId: ocsfEvent.ocsf_event_id,
          tenantId: ocsfEvent.tenant_id,
          provider: rawPkg.provider as any,
          ocsfClassUid: ocsfEvent.class_uid,
          ocsfClassName: ocsfEvent.class_uid === 1007 ? '1007 Process Activity' : ocsfEvent.class_uid === 3001 ? '3001 Authentication' : '6001 Cloud Audit',
          severityId: ocsfEvent.severity_id,
          severityLabel: ocsfEvent.severity_id === 4 ? 'CRITICAL' : ocsfEvent.severity_id === 3 ? 'HIGH' : 'MEDIUM',
          timestampUtc: ocsfEvent.time,
          correlationId: (ocsfEvent.metadata as any)?.correlation_id || rawPkg.correlationId,
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

  public getExecutiveMetrics(): ExecutiveMetrics {
    const avgLatency = this.totalReceived > 0 ? parseFloat((this.totalLatencySum / Math.max(this.totalReceived / 100, 1)).toFixed(2)) : 0.08;
    return {
      eventsReceived: this.totalReceived,
      eventsAccepted: this.totalAccepted,
      eventsNormalized: this.totalNormalized,
      eventsRejected: this.totalRejected,
      pipelineLatencyMs: avgLatency,
      currentThroughputEPS: this.isOutageSimulated ? 0 : 14500,
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
