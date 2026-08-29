import { SyntheticRawTelemetryPackage } from '@sentinelai/synthetic-log-generator';
import { IngestionMetricsCollector } from '../observability/ingestion-metrics';
import { StreamRingBuffer } from '../buffer/stream-ring-buffer';

export interface IRawTelemetryProducer {
  publishRawTelemetry(event: SyntheticRawTelemetryPackage): Promise<boolean>;
  publishBatch(events: SyntheticRawTelemetryPackage[]): Promise<{ published: number; failed: number }>;
  flushRingBuffer(): Promise<number>;
  healthCheck(): Promise<boolean>;
}

export class MockRawTelemetryProducer implements IRawTelemetryProducer {
  private targetTopic: string;
  private ringBuffer: StreamRingBuffer;
  private metrics: IngestionMetricsCollector;
  private isSimulatingOutage: boolean = false;

  constructor(targetTopic: string, ringBuffer: StreamRingBuffer, metrics: IngestionMetricsCollector) {
    this.targetTopic = targetTopic;
    this.ringBuffer = ringBuffer;
    this.metrics = metrics;
  }

  public setOutageSimulation(outage: boolean): void {
    this.isSimulatingOutage = outage;
  }

  async publishRawTelemetry(event: SyntheticRawTelemetryPackage): Promise<boolean> {
    if (this.isSimulatingOutage) {
      this.metrics.recordKafkaFailure();
      // Downstream outage fallback: Buffer locally in Ring Buffer (SRS-FR-003, AC-001.5)
      this.ringBuffer.push(event);
      return false;
    }

    this.metrics.recordAccepted();
    return true;
  }

  async publishBatch(events: SyntheticRawTelemetryPackage[]): Promise<{ published: number; failed: number }> {
    if (this.isSimulatingOutage) {
      this.metrics.recordKafkaFailure(events.length);
      this.ringBuffer.pushBatch(events);
      return { published: 0, failed: events.length };
    }

    this.metrics.recordAccepted(events.length);
    return { published: events.length, failed: 0 };
  }

  async flushRingBuffer(): Promise<number> {
    if (this.isSimulatingOutage || this.ringBuffer.getDepth() === 0) {
      return 0;
    }

    const bufferedEvents = this.ringBuffer.popBatch(1000);
    this.metrics.recordAccepted(bufferedEvents.length);
    return bufferedEvents.length;
  }

  async healthCheck(): Promise<boolean> {
    return !this.isSimulatingOutage;
  }
}
