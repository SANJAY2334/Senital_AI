import { z } from 'zod';

export const NormalizerConfigSchema = z.object({
  serviceName: z.string().default('ocsf-normalizer'),
  env: z.enum(['local', 'development', 'testing', 'staging', 'production']).default('development'),
  kafkaBrokers: z.array(z.string()).default(['localhost:9092']),
  kafkaTopicRaw: z.string().default('telemetry.raw.v1'),
  kafkaTopicOcsf: z.string().default('telemetry.ocsf.v1'),
  consumerGroupId: z.string().default('sentinelai-ocsf-normalizer-group'),
});

export type NormalizerConfig = z.infer<typeof NormalizerConfigSchema>;

export function loadNormalizerConfig(override?: Partial<NormalizerConfig>): NormalizerConfig {
  const envBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];
  const rawConfig = {
    serviceName: process.env.SERVICE_NAME || 'ocsf-normalizer',
    env: (process.env.NODE_ENV as any) || 'development',
    kafkaBrokers: envBrokers,
    kafkaTopicRaw: process.env.KAFKA_TOPIC_RAW || 'telemetry.raw.v1',
    kafkaTopicOcsf: process.env.KAFKA_TOPIC_OCSF || 'telemetry.ocsf.v1',
    consumerGroupId: process.env.CONSUMER_GROUP_ID || 'sentinelai-ocsf-normalizer-group',
    ...override,
  };

  return NormalizerConfigSchema.parse(rawConfig);
}
