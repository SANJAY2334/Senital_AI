import { SyntheticRawTelemetryPackage } from '@sentinelai/synthetic-log-generator';
import { IngestionMetricsCollector } from '../observability/ingestion-metrics';

export class StreamRingBuffer {
  private buffer: SyntheticRawTelemetryPackage[] = [];
  private maxCapacity: number;
  private metrics: IngestionMetricsCollector;

  constructor(maxCapacity: number = 50000, metrics: IngestionMetricsCollector) {
    this.maxCapacity = maxCapacity;
    this.metrics = metrics;
  }

  public push(event: SyntheticRawTelemetryPackage): boolean {
    if (this.buffer.length >= this.maxCapacity) {
      this.metrics.recordBufferOverflow();
      // Ring buffer drop policy: Drop oldest un-flushed item to preserve backpressure (SRS-FR-003)
      this.buffer.shift();
    }

    this.buffer.push(event);
    this.metrics.setBufferDepth(this.buffer.length);
    return true;
  }

  public pushBatch(events: SyntheticRawTelemetryPackage[]): void {
    for (const evt of events) {
      this.push(evt);
    }
  }

  public popBatch(batchSize: number): SyntheticRawTelemetryPackage[] {
    const popped = this.buffer.splice(0, batchSize);
    this.metrics.setBufferDepth(this.buffer.length);
    return popped;
  }

  public getDepth(): number {
    return this.buffer.length;
  }

  public clear(): void {
    this.buffer = [];
    this.metrics.setBufferDepth(0);
  }
}
