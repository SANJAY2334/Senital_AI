import { createIngestionServer } from '../src';

describe('Ingestion Collector Kafka Producer Suite', () => {
  it('should publish raw telemetry batch to Kafka topic telemetry.raw.v1', async () => {
    const { producer, metrics } = createIngestionServer();

    const batch = [
      { eventId: 'b1', tenantId: 't1', provider: 'AWS_CLOUDTRAIL' as const, timestampUtc: '', correlationId: '', rawPayload: '{"op":"1"}', metadata: {} },
      { eventId: 'b2', tenantId: 't1', provider: 'CROWDSTRIKE_EDR' as const, timestampUtc: '', correlationId: '', rawPayload: '{"op":"2"}', metadata: {} },
    ];

    const result = await producer.publishBatch(batch);

    expect(result.published).toBe(2);
    expect(result.failed).toBe(0);
    expect(metrics.getSnapshot().acceptedEvents).toBe(2);
  });
});
