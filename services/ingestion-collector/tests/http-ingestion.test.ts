import request from 'supertest';
import { createIngestionServer } from '../src';

describe('Ingestion Collector HTTP REST Endpoint Suite', () => {
  const { app, metrics } = createIngestionServer({ port: 8080 });

  beforeEach(() => {
    metrics.reset();
  });

  it('should accept valid raw AWS CloudTrail telemetry package with 202 Accepted', async () => {
    const payload = {
      tenantId: 'tenant-acme-corp',
      provider: 'AWS_CLOUDTRAIL',
      timestampUtc: new Date().toISOString(),
      rawPayload: JSON.stringify({ eventSource: 'ec2.amazonaws.com', eventName: 'RunInstances' }),
    };

    const res = await request(app).post('/api/v1/ingest/raw').send(payload);

    expect(res.status).toBe(202);
    expect(res.body.acknowledged).toBe(true);
    expect(res.body.eventId).toBeDefined();

    const snapshot = metrics.getSnapshot();
    expect(snapshot.receivedEvents).toBe(1);
    expect(snapshot.acceptedEvents).toBe(1);
    expect(snapshot.rejectedEvents).toBe(0);
  });

  it('should reject payload missing tenantId with 400 Bad Request', async () => {
    const invalidPayload = {
      provider: 'AWS_CLOUDTRAIL',
      rawPayload: '{"eventSource":"ec2.amazonaws.com"}',
    };

    const res = await request(app).post('/api/v1/ingest/raw').send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('VALIDATION_ERROR');
    expect(res.body.error).toContain('tenantId');

    const snapshot = metrics.getSnapshot();
    expect(snapshot.rejectedEvents).toBe(1);
  });

  it('should reject payload with unsupported provider source', async () => {
    const invalidPayload = {
      tenantId: 'tenant-acme',
      provider: 'UNSUPPORTED_VENDOR_X',
      rawPayload: '{"data":"test"}',
    };

    const res = await request(app).post('/api/v1/ingest/raw').send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Unsupported provider source');
  });

  it('should return service metrics from GET /api/v1/ingest/metrics', async () => {
    const res = await request(app).get('/api/v1/ingest/metrics');
    expect(res.status).toBe(200);
    expect(res.body.receivedEvents).toBeDefined();
  });
});
