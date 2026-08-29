import express from 'express';
import { loadIngestionConfig } from './config/ingestion-config';
import { IngestionMetricsCollector } from './observability/ingestion-metrics';
import { StreamRingBuffer } from './buffer/stream-ring-buffer';
import { MockRawTelemetryProducer } from './kafka/raw-telemetry-producer';
import { createIngestionRouter } from './http/ingestion-router';
import { IngestionGrpcHandler } from './grpc/ingestion-grpc-handler';

export * from './config/ingestion-config';
export * from './observability/ingestion-metrics';
export * from './buffer/stream-ring-buffer';
export * from './kafka/raw-telemetry-producer';
export * from './http/ingestion-router';
export * from './grpc/ingestion-grpc-handler';

export function createIngestionServer(overrideConfig?: Partial<ReturnType<typeof loadIngestionConfig>>) {
  const config = loadIngestionConfig(overrideConfig);
  const metrics = new IngestionMetricsCollector();
  const ringBuffer = new StreamRingBuffer(config.bufferMaxCapacity, metrics);
  const producer = new MockRawTelemetryProducer(config.kafkaTopicRaw, ringBuffer, metrics);
  const grpcHandler = new IngestionGrpcHandler(producer, metrics);

  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use('/api/v1/ingest', createIngestionRouter(producer, metrics));

  return {
    app,
    config,
    metrics,
    ringBuffer,
    producer,
    grpcHandler,
  };
}

if (require.main === module) {
  const { app, config } = createIngestionServer();
  app.listen(config.port, () => {
    console.log(`[SentinelAI Ingestion Collector] Server running on port ${config.port}`);
  });
}
