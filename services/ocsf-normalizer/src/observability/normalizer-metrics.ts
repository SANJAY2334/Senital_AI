export interface NormalizerMetricsSnapshot {
  eventsConsumed: number;
  eventsNormalized: number;
  eventsRejected: number;
  normalizationFailures: number;
  byProvider: Record<string, number>;
  byOcsfClass: Record<string, number>;
  kafkaPublishFailures: number;
  avgLatencyMs: number;
}

export class NormalizerMetricsCollector {
  private consumed = 0;
  private normalized = 0;
  private rejected = 0;
  private failures = 0;
  private kafkaFailures = 0;
  private totalLatencyMs = 0;
  private latencySampleCount = 0;
  private byProvider: Record<string, number> = {};
  private byOcsfClass: Record<string, number> = {};

  public recordConsumed(count: number = 1): void {
    this.consumed += count;
  }

  public recordNormalized(provider: string, ocsfClassUid: number, durationMs: number): void {
    this.normalized++;
    this.byProvider[provider] = (this.byProvider[provider] || 0) + 1;
    this.byOcsfClass[ocsfClassUid] = (this.byOcsfClass[ocsfClassUid] || 0) + 1;
    this.totalLatencyMs += durationMs;
    this.latencySampleCount++;
  }

  public recordRejected(count: number = 1): void {
    this.rejected += count;
  }

  public recordFailure(count: number = 1): void {
    this.failures += count;
  }

  public recordKafkaFailure(count: number = 1): void {
    this.kafkaFailures += count;
  }

  public getSnapshot(): NormalizerMetricsSnapshot {
    const avgLatencyMs = this.latencySampleCount > 0 
      ? parseFloat((this.totalLatencyMs / this.latencySampleCount).toFixed(2))
      : 0;

    return {
      eventsConsumed: this.consumed,
      eventsNormalized: this.normalized,
      eventsRejected: this.rejected,
      normalizationFailures: this.failures,
      byProvider: { ...this.byProvider },
      byOcsfClass: { ...this.byOcsfClass },
      kafkaPublishFailures: this.kafkaFailures,
      avgLatencyMs,
    };
  }

  public reset(): void {
    this.consumed = 0;
    this.normalized = 0;
    this.rejected = 0;
    this.failures = 0;
    this.kafkaFailures = 0;
    this.totalLatencyMs = 0;
    this.latencySampleCount = 0;
    this.byProvider = {};
    this.byOcsfClass = {};
  }
}
