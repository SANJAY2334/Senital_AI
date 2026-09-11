export interface IngestionMetricsSnapshot {
  receivedEvents: number;
  acceptedEvents: number;
  rejectedEvents: number;
  kafkaPublishFailures: number;
  bufferDepth: number;
  bufferOverflows: number;
  avgLatencyMs: number;
}

export class IngestionMetricsCollector {
  private received = 0;
  private accepted = 0;
  private rejected = 0;
  private kafkaFailures = 0;
  private bufferDepth = 0;
  private bufferOverflows = 0;
  private totalLatencyMs = 0;
  private latencySampleCount = 0;

  public recordReceived(count: number = 1): void {
    this.received += count;
  }

  public recordAccepted(count: number = 1): void {
    this.accepted += count;
  }

  public recordRejected(count: number = 1): void {
    this.rejected += count;
  }

  public recordKafkaFailure(count: number = 1): void {
    this.kafkaFailures += count;
  }

  public setBufferDepth(depth: number): void {
    this.bufferDepth = depth;
  }

  public recordBufferOverflow(count: number = 1): void {
    this.bufferOverflows += count;
  }

  public recordLatency(durationMs: number): void {
    this.totalLatencyMs += durationMs;
    this.latencySampleCount++;
  }

  public getSnapshot(): IngestionMetricsSnapshot {
    const avgLatencyMs =
      this.latencySampleCount > 0
        ? parseFloat((this.totalLatencyMs / this.latencySampleCount).toFixed(2))
        : 0;

    return {
      receivedEvents: this.received,
      acceptedEvents: this.accepted,
      rejectedEvents: this.rejected,
      kafkaPublishFailures: this.kafkaFailures,
      bufferDepth: this.bufferDepth,
      bufferOverflows: this.bufferOverflows,
      avgLatencyMs,
    };
  }

  public reset(): void {
    this.received = 0;
    this.accepted = 0;
    this.rejected = 0;
    this.kafkaFailures = 0;
    this.bufferDepth = 0;
    this.bufferOverflows = 0;
    this.totalLatencyMs = 0;
    this.latencySampleCount = 0;
  }
}
