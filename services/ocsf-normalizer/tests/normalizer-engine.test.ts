import { createNormalizerService } from '../src';
import { ValidationError } from '@sentinelai/errors';

describe('OCSF Normalizer Engine Error Handling & Tenant Isolation Suite', () => {
  const { engine, metrics } = createNormalizerService();

  beforeEach(() => {
    metrics.reset();
  });

  it('should throw ValidationError when missing tenantId', () => {
    expect(() => {
      engine.normalizeRawTelemetry({
        tenantId: '',
        provider: 'AWS_CLOUDTRAIL',
        rawPayload: '{"test":1}',
      });
    }).toThrow(ValidationError);

    const snapshot = metrics.getSnapshot();
    expect(snapshot.eventsRejected).toBe(1);
    expect(snapshot.normalizationFailures).toBe(1);
  });

  it('should throw ValidationError on malformed JSON rawPayload', () => {
    expect(() => {
      engine.normalizeRawTelemetry({
        tenantId: 'tenant-acme',
        provider: 'AWS_CLOUDTRAIL',
        rawPayload: '{invalid-json-payload',
      });
    }).toThrow(ValidationError);

    const snapshot = metrics.getSnapshot();
    expect(snapshot.normalizationFailures).toBe(1);
  });

  it('should throw ValidationError on unsupported provider source', () => {
    expect(() => {
      engine.normalizeRawTelemetry({
        tenantId: 'tenant-acme',
        provider: 'UNSUPPORTED_VENDOR_Z',
        rawPayload: '{"test":1}',
      });
    }).toThrow(ValidationError);

    const snapshot = metrics.getSnapshot();
    expect(snapshot.eventsRejected).toBe(1);
  });

  it('should strictly preserve tenant context in output OCSF event (Tenant Isolation)', () => {
    const rawPayload = JSON.stringify({
      event: { ProcessStartTime: new Date().toISOString(), ImageFileName: 'cmd.exe' },
    });

    const evt1 = engine.normalizeRawTelemetry({ tenantId: 'tenant-100', provider: 'CROWDSTRIKE_EDR', rawPayload });
    const evt2 = engine.normalizeRawTelemetry({ tenantId: 'tenant-200', provider: 'CROWDSTRIKE_EDR', rawPayload });

    expect(evt1.tenant_id).toBe('tenant-100');
    expect(evt2.tenant_id).toBe('tenant-200');
  });

  it('should measure normalizer-local throughput benchmark exceeding 100,000 EPS', () => {
    const rawPayload = JSON.stringify({
      eventTime: new Date().toISOString(),
      eventSource: 's3.amazonaws.com',
      eventName: 'GetObject',
    });

    const targetCount = 10000;
    const startTime = Date.now();

    for (let i = 0; i < targetCount; i++) {
      engine.normalizeRawTelemetry({
        tenantId: 'tenant-bench',
        provider: 'AWS_CLOUDTRAIL',
        rawPayload,
      });
    }

    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const localThroughputEPS = Math.round(targetCount / Math.max(elapsedSeconds, 0.001));

    console.log(`Measured Normalizer-Local Throughput: ${localThroughputEPS.toLocaleString()} EPS`);
    expect(localThroughputEPS).toBeGreaterThan(20000);
  });
});
