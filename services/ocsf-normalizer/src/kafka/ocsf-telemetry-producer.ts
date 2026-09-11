import { OCSFBaseEvent } from '@sentinelai/ocsf-types';
import { NormalizerMetricsCollector } from '../observability/normalizer-metrics';

export interface IOCSFTelemetryProducer {
  publishOCSFEvent(event: OCSFBaseEvent): Promise<boolean>;
  publishBatch(events: OCSFBaseEvent[]): Promise<{ published: number; failed: number }>;
  healthCheck(): Promise<boolean>;
}

export class MockOCSFTelemetryProducer implements IOCSFTelemetryProducer {
  private targetTopic: string;
  private metrics: NormalizerMetricsCollector;
  private isSimulatingOutage: boolean = false;
  private publishedStore: OCSFBaseEvent[] = [];

  constructor(targetTopic: string, metrics: NormalizerMetricsCollector) {
    this.targetTopic = targetTopic;
    this.metrics = metrics;
  }

  public getTargetTopic(): string {
    return this.targetTopic;
  }

  public setOutageSimulation(outage: boolean): void {
    this.isSimulatingOutage = outage;
  }

  public getPublishedStore(): OCSFBaseEvent[] {
    return [...this.publishedStore];
  }

  public clearStore(): void {
    this.publishedStore = [];
  }

  async publishOCSFEvent(event: OCSFBaseEvent): Promise<boolean> {
    if (this.isSimulatingOutage) {
      this.metrics.recordKafkaFailure();
      return false;
    }

    this.publishedStore.push(event);
    return true;
  }

  async publishBatch(events: OCSFBaseEvent[]): Promise<{ published: number; failed: number }> {
    if (this.isSimulatingOutage) {
      this.metrics.recordKafkaFailure(events.length);
      return { published: 0, failed: events.length };
    }

    this.publishedStore.push(...events);
    return { published: events.length, failed: 0 };
  }

  async healthCheck(): Promise<boolean> {
    return !this.isSimulatingOutage;
  }
}
