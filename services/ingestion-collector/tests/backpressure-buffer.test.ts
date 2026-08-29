import { createIngestionServer } from '../src';

describe('Ingestion Collector Backpressure & Ring Buffer Fallback Suite', () => {
  it('should buffer events locally during simulated Kafka outage without crashing (SRS-FR-003, AC-001.5)', async () => {
    const { producer, ringBuffer, metrics } = createIngestionServer({ bufferMaxCapacity: 100 });

    // Simulate downstream Kafka outage
    producer.setOutageSimulation(true);

    const testEvent = {
      eventId: 'evt-100',
      tenantId: 'tenant-acme',
      provider: 'AWS_CLOUDTRAIL' as const,
      timestampUtc: new Date().toISOString(),
      correlationId: 'corr-outage',
      rawPayload: '{"test":"outage"}',
      metadata: {},
    };

    const published = await producer.publishRawTelemetry(testEvent);

    expect(published).toBe(false); // Kafka publish fails during outage
    expect(ringBuffer.getDepth()).toBe(1); // Buffered locally in ring buffer
    expect(metrics.getSnapshot().kafkaPublishFailures).toBe(1);

    // Restore Kafka outage & flush ring buffer
    producer.setOutageSimulation(false);
    const flushedCount = await producer.flushRingBuffer();

    expect(flushedCount).toBe(1);
    expect(ringBuffer.getDepth()).toBe(0);
  });

  it('should drop oldest items on buffer overflow preserving backpressure limits', () => {
    const { ringBuffer, metrics } = createIngestionServer({ bufferMaxCapacity: 2 });

    ringBuffer.push({ eventId: '1', tenantId: 't', provider: 'AWS_CLOUDTRAIL', timestampUtc: '', correlationId: '', rawPayload: '', metadata: {} });
    ringBuffer.push({ eventId: '2', tenantId: 't', provider: 'AWS_CLOUDTRAIL', timestampUtc: '', correlationId: '', rawPayload: '', metadata: {} });
    ringBuffer.push({ eventId: '3', tenantId: 't', provider: 'AWS_CLOUDTRAIL', timestampUtc: '', correlationId: '', rawPayload: '', metadata: {} });

    expect(ringBuffer.getDepth()).toBe(2);
    expect(metrics.getSnapshot().bufferOverflows).toBe(1);

    const popped = ringBuffer.popBatch(2);
    expect(popped[0].eventId).toBe('2'); // Item '1' dropped on ring buffer overflow
  });
});
