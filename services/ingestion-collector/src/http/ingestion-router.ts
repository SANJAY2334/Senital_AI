import { Router, Request, Response } from 'express';
import { IRawTelemetryProducer } from '../kafka/raw-telemetry-producer';
import { IngestionMetricsCollector } from '../observability/ingestion-metrics';
import { ValidationError } from '@sentinelai/errors';

export function createIngestionRouter(
  producer: IRawTelemetryProducer,
  metrics: IngestionMetricsCollector,
): Router {
  const router = Router();

  // POST /api/v1/ingest/raw (SRS-FR-001, SRS-FR-002, AC-001.1)
  router.post('/raw', async (req: Request, res: Response) => {
    const startTime = Date.now();
    metrics.recordReceived();

    const { eventId, tenantId, provider, timestampUtc, correlationId, rawPayload, metadata } = req.body;

    // Zero-Trust Tenant & Schema Validation (ADR-0006, ADR-0011)
    if (!tenantId || typeof tenantId !== 'string') {
      metrics.recordRejected();
      const err = new ValidationError('Missing required header/property: tenantId');
      return res.status(err.statusCode).json({ error: err.message, code: err.code });
    }

    if (!provider || !['AWS_CLOUDTRAIL', 'CROWDSTRIKE_EDR', 'OKTA_IAM'].includes(provider)) {
      metrics.recordRejected();
      const err = new ValidationError(`Unsupported provider source: ${provider}`);
      return res.status(err.statusCode).json({ error: err.message, code: err.code });
    }

    if (!rawPayload) {
      metrics.recordRejected();
      const err = new ValidationError('Missing required property: rawPayload');
      return res.status(err.statusCode).json({ error: err.message, code: err.code });
    }

    const telemetryPackage = {
      eventId: eventId || crypto.randomUUID(),
      tenantId,
      provider,
      timestampUtc: timestampUtc || new Date().toISOString(),
      correlationId: correlationId || `corr-${Math.random().toString(36).substring(2, 9)}`,
      rawPayload: typeof rawPayload === 'string' ? rawPayload : JSON.stringify(rawPayload),
      metadata: metadata || {},
    };

    const published = await producer.publishRawTelemetry(telemetryPackage);
    const durationMs = Date.now() - startTime;
    metrics.recordLatency(durationMs);

    return res.status(202).json({
      eventId: telemetryPackage.eventId,
      acknowledged: true,
      bufferedLocally: !published,
      ingestedAt: telemetryPackage.timestampUtc,
    });
  });

  // GET /api/v1/ingest/metrics (Observability Endpoint - ADR-0013)
  router.get('/metrics', (_req: Request, res: Response) => {
    return res.status(200).json(metrics.getSnapshot());
  });

  // GET /health (Health Check Endpoint)
  router.get('/health', async (_req: Request, res: Response) => {
    const isProducerHealthy = await producer.healthCheck();
    return res.status(isProducerHealthy ? 200 : 503).json({
      status: isProducerHealthy ? 'HEALTHY' : 'DEGRADED',
      kafka: isProducerHealthy ? 'CONNECTED' : 'DISCONNECTED_BUFFERING',
    });
  });

  return router;
}
