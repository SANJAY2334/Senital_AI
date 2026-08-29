import { createIngestionServer } from '../src';

describe('Ingestion Collector gRPC Handler Suite', () => {
  const { grpcHandler, metrics } = createIngestionServer();

  beforeEach(() => {
    metrics.reset();
  });

  it('should process single raw event gRPC request successfully', async () => {
    const grpcRequest = {
      tenantId: 'tenant-beta',
      provider: 'CROWDSTRIKE_EDR',
      rawPayload: JSON.stringify({ ImageFileName: 'powershell.exe' }),
    };

    const res = await grpcHandler.handleIngestRawTelemetry(grpcRequest);

    expect(res.acknowledged).toBe(true);
    expect(res.eventId).toBeDefined();
    expect(metrics.getSnapshot().acceptedEvents).toBe(1);
  });

  it('should process batch raw telemetry gRPC request', async () => {
    const batchRequests = [
      { tenantId: 'tenant-beta', provider: 'OKTA_IAM', rawPayload: '{"eventType":"auth"}' },
      { tenantId: 'tenant-beta', provider: 'AWS_CLOUDTRAIL', rawPayload: '{"eventSource":"s3"}' },
    ];

    const res = await grpcHandler.handleBatchIngest(batchRequests);
    expect(res.totalReceived).toBe(2);
    expect(res.totalAcknowledged).toBe(2);
    expect(metrics.getSnapshot().acceptedEvents).toBe(2);
  });
});
