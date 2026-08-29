import { OCSFBaseEvent } from '@sentinelai/ocsf-types';
import { OCSFNormalizerEngine, RawTelemetryPackageInput } from '../engine/ocsf-normalizer-engine';
import { NormalizerMetricsCollector } from '../observability/normalizer-metrics';
import { IOCSFTelemetryProducer } from './ocsf-telemetry-producer';

export interface IRawTelemetryConsumer {
  consumeRawPackage(pkg: RawTelemetryPackageInput): Promise<OCSFBaseEvent | null>;
  consumeBatch(pkgs: RawTelemetryPackageInput[]): Promise<{ processed: number; normalized: number; failed: number }>;
}

export class MockRawTelemetryConsumer implements IRawTelemetryConsumer {
  private engine: OCSFNormalizerEngine;
  private producer: IOCSFTelemetryProducer;
  private metrics: NormalizerMetricsCollector;

  constructor(
    engine: OCSFNormalizerEngine,
    producer: IOCSFTelemetryProducer,
    metrics: NormalizerMetricsCollector,
  ) {
    this.engine = engine;
    this.producer = producer;
    this.metrics = metrics;
  }

  async consumeRawPackage(pkg: RawTelemetryPackageInput): Promise<OCSFBaseEvent | null> {
    try {
      const ocsfEvent = this.engine.normalizeRawTelemetry(pkg);
      await this.producer.publishOCSFEvent(ocsfEvent);
      return ocsfEvent;
    } catch (err) {
      // Graceful exception handling for malformed messages (does not crash consumer group)
      return null;
    }
  }

  async consumeBatch(pkgs: RawTelemetryPackageInput[]): Promise<{ processed: number; normalized: number; failed: number }> {
    let normalized = 0;
    let failed = 0;

    for (const pkg of pkgs) {
      const result = await this.consumeRawPackage(pkg);
      if (result) {
        normalized++;
      } else {
        failed++;
      }
    }

    return {
      processed: pkgs.length,
      normalized,
      failed,
    };
  }
}
