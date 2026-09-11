import { loadNormalizerConfig } from './config/normalizer-config';
import { NormalizerMetricsCollector } from './observability/normalizer-metrics';
import { OCSFNormalizerEngine } from './engine/ocsf-normalizer-engine';
import { MockOCSFTelemetryProducer } from './kafka/ocsf-telemetry-producer';
import { MockRawTelemetryConsumer } from './kafka/raw-telemetry-consumer';

export * from './config/normalizer-config';
export * from './observability/normalizer-metrics';
export * from './engine/mapper-registry';
export * from './engine/ocsf-normalizer-engine';
export * from './kafka/ocsf-telemetry-producer';
export * from './kafka/raw-telemetry-consumer';

export function createNormalizerService(
  overrideConfig?: Partial<ReturnType<typeof loadNormalizerConfig>>,
) {
  const config = loadNormalizerConfig(overrideConfig);
  const metrics = new NormalizerMetricsCollector();
  const engine = new OCSFNormalizerEngine(metrics);
  const producer = new MockOCSFTelemetryProducer(config.kafkaTopicOcsf, metrics);
  const consumer = new MockRawTelemetryConsumer(engine, producer, metrics);

  return {
    config,
    metrics,
    engine,
    producer,
    consumer,
  };
}

if (require.main === module) {
  const { config } = createNormalizerService();
  console.log(
    `[SentinelAI OCSF Normalizer] Running consumer group '${config.consumerGroupId}' on topic '${config.kafkaTopicRaw}'`,
  );
}
