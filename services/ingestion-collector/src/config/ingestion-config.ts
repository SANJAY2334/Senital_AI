import { z } from 'zod';

export const IngestionConfigSchema = z.object({
  serviceName: z.string().default('ingestion-collector'),
  env: z.enum(['local', 'development', 'testing', 'staging', 'production']).default('development'),
  port: z.number().int().min(1024).max(65535).default(8080),
  grpcPort: z.number().int().min(1024).max(65535).default(50051),
  kafkaBrokers: z.array(z.string()).default(['localhost:9092']),
  kafkaTopicRaw: z.string().default('telemetry.raw.v1'),
  bufferMaxCapacity: z.number().int().positive().default(50000), // SRS-FR-003 fallback buffer capacity
  bufferFlushIntervalMs: z.number().int().positive().default(1000),
});

export type IngestionConfig = z.infer<typeof IngestionConfigSchema>;

export function loadIngestionConfig(override?: Partial<IngestionConfig>): IngestionConfig {
  const envBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];
  const rawConfig = {
    serviceName: process.env.SERVICE_NAME || 'ingestion-collector',
    env: (process.env.NODE_ENV as any) || 'development',
    port: parseInt(process.env.PORT || '8080', 10),
    grpcPort: parseInt(process.env.GRPC_PORT || '50051', 10),
    kafkaBrokers: envBrokers,
    kafkaTopicRaw: process.env.KAFKA_TOPIC_RAW || 'telemetry.raw.v1',
    bufferMaxCapacity: parseInt(process.env.BUFFER_MAX_CAPACITY || '50000', 10),
    bufferFlushIntervalMs: parseInt(process.env.BUFFER_FLUSH_INTERVAL_MS || '1000', 10),
    ...override,
  };

  return IngestionConfigSchema.parse(rawConfig);
}
