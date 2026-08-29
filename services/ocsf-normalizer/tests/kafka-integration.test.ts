import { createNormalizerService } from '../src';

describe('OCSF Normalizer Kafka Consumer & Producer Integration Suite', () => {
  it('should consume raw package from telemetry.raw.v1, normalize, and publish to telemetry.ocsf.v1', async () => {
    const { consumer, producer, metrics } = createNormalizerService();

    const rawPackage = {
      tenantId: 'tenant-test',
      provider: 'AWS_CLOUDTRAIL' as const,
      rawPayload: JSON.stringify({ eventSource: 'ec2.amazonaws.com', eventName: 'RunInstances' }),
      correlationId: 'corr-kafka-integration',
    };

    const ocsfEvent = await consumer.consumeRawPackage(rawPackage);

    expect(ocsfEvent).not.toBeNull();
    expect(ocsfEvent?.tenant_id).toBe('tenant-test');
    expect(producer.getPublishedStore().length).toBe(1);
    expect(producer.getPublishedStore()[0].ocsf_event_id).toBe(ocsfEvent?.ocsf_event_id);
    expect(metrics.getSnapshot().eventsNormalized).toBe(1);
  });

  it('should handle malformed message gracefully in consumer group without throwing', async () => {
    const { consumer, metrics } = createNormalizerService();

    const malformedPackage = {
      tenantId: 'tenant-test',
      provider: 'AWS_CLOUDTRAIL' as const,
      rawPayload: '{malformed-json-payload',
    };

    const result = await consumer.consumeRawPackage(malformedPackage);

    expect(result).toBeNull(); // Consumer catches exception gracefully
    expect(metrics.getSnapshot().normalizationFailures).toBe(1);
  });
});
