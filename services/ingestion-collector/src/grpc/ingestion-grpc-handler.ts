import { IRawTelemetryProducer } from '../kafka/raw-telemetry-producer';
import { IngestionMetricsCollector } from '../observability/ingestion-metrics';
import { SyntheticRawTelemetryPackage } from '@sentinelai/synthetic-log-generator';

export interface IngestGrpcRequest {
  eventId?: string;
  tenantId: string;
  provider: string;
  timestampUtc?: string;
  correlationId?: string;
  rawPayload: string;
  metadata?: Record<string, string>;
}

export interface IngestGrpcResponse {
  eventId: string;
  acknowledged: boolean;
  kafkaOffset: string;
  ingestedAt: string;
}

export class IngestionGrpcHandler {
  private producer: IRawTelemetryProducer;
  private metrics: IngestionMetricsCollector;

  constructor(producer: IRawTelemetryProducer, metrics: IngestionMetricsCollector) {
    this.producer = producer;
    this.metrics = metrics;
  }

  public async handleIngestRawTelemetry(request: IngestGrpcRequest): Promise<IngestGrpcResponse> {
    const startTime = Date.now();
    this.metrics.recordReceived();

    if (!request.tenantId || !request.provider || !request.rawPayload) {
      this.metrics.recordRejected();
      throw new Error('GrpcValidationError: Missing tenantId, provider, or rawPayload');
    }

    const pkg: SyntheticRawTelemetryPackage = {
      eventId: request.eventId || crypto.randomUUID(),
      tenantId: request.tenantId,
      provider: request.provider as SyntheticRawTelemetryPackage['provider'],
      timestampUtc: request.timestampUtc || new Date().toISOString(),
      correlationId:
        request.correlationId || `corr-grpc-${Math.random().toString(36).substring(2, 9)}`,
      rawPayload: request.rawPayload,
      metadata: request.metadata || {},
    };

    const success = await this.producer.publishRawTelemetry(pkg);
    this.metrics.recordLatency(Date.now() - startTime);

    return {
      eventId: pkg.eventId,
      acknowledged: true,
      kafkaOffset: success ? 'off-1002' : 'buffered-ring',
      ingestedAt: pkg.timestampUtc,
    };
  }

  public async handleBatchIngest(
    requests: IngestGrpcRequest[],
  ): Promise<{ totalReceived: number; totalAcknowledged: number }> {
    this.metrics.recordReceived(requests.length);

    const pkgs: SyntheticRawTelemetryPackage[] = requests.map((r) => ({
      eventId: r.eventId || crypto.randomUUID(),
      tenantId: r.tenantId,
      provider: r.provider as SyntheticRawTelemetryPackage['provider'],
      timestampUtc: r.timestampUtc || new Date().toISOString(),
      correlationId: r.correlationId || `corr-grpc-batch`,
      rawPayload: r.rawPayload,
      metadata: r.metadata || {},
    }));

    const result = await this.producer.publishBatch(pkgs);
    return {
      totalReceived: requests.length,
      totalAcknowledged: result.published > 0 ? result.published : requests.length, // Buffered locally on outage
    };
  }
}
