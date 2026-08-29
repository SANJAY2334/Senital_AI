import { SyntheticTelemetryGenerator } from '@sentinelai/synthetic-log-generator';
import { createIngestionServer } from '@sentinelai/ingestion-collector';
import { createNormalizerService } from '@sentinelai/ocsf-normalizer';

describe('T-1.5 E2E Integration Suite: Multi-Tenant Isolation Verification', () => {
  it('should enforce strict multi-tenant isolation with zero cross-tenant misattribution across the pipeline', async () => {
    const genTenantA = new SyntheticTelemetryGenerator({ seed: 101, tenantId: 'tenant-ALPHA' });
    const genTenantB = new SyntheticTelemetryGenerator({ seed: 202, tenantId: 'tenant-BETA' });

    const normalizer = createNormalizerService();

    const batchA = genTenantA.generateBatch(50);
    const batchB = genTenantB.generateBatch(50);

    const storeA: string[] = [];
    const storeB: string[] = [];

    // Process Batch A
    for (const pkg of batchA) {
      const ocsfEvent = await normalizer.consumer.consumeRawPackage(pkg);
      if (ocsfEvent) {
        storeA.push(ocsfEvent.tenant_id);
      }
    }

    // Process Batch B
    for (const pkg of batchB) {
      const ocsfEvent = await normalizer.consumer.consumeRawPackage(pkg);
      if (ocsfEvent) {
        storeB.push(ocsfEvent.tenant_id);
      }
    }

    // Assertions: 100% tenant attribution accuracy
    expect(storeA.length).toBe(50);
    expect(storeB.length).toBe(50);

    expect(storeA.every((id) => id === 'tenant-ALPHA')).toBe(true);
    expect(storeB.every((id) => id === 'tenant-BETA')).toBe(true);
    expect(storeA.some((id) => id === 'tenant-BETA')).toBe(false);
  });
});
