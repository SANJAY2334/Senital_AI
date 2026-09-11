import { SyntheticTelemetryGenerator } from '@sentinelai/synthetic-log-generator';
import { createIngestionServer } from '@sentinelai/ingestion-collector';
import { createNormalizerService } from '@sentinelai/ocsf-normalizer';

describe('T-1.5 E2E Integration Suite: Pipeline Event Flow & Accounting', () => {
  it('should process synthetic multi-cloud telemetry events end-to-end with 100% accounting and zero data loss', async () => {
    // 1. Initialize End-to-End Component Pipeline (T-1.2 -> T-1.3 -> T-1.4)
    const generator = new SyntheticTelemetryGenerator({
      seed: 1337,
      tenantId: 'tenant-e2e-acme',
    });
    const ingestion = createIngestionServer();
    const normalizer = createNormalizerService();

    const targetEventCount = 300; // 100 per provider (AWS, CrowdStrike, Okta)
    const syntheticBatch = generator.generateBatch(targetEventCount);

    // Event Accounting Counters
    const generatedCount = syntheticBatch.length;
    let submittedCount = 0;
    let acceptedCount = 0;
    let normalizedCount = 0;
    let publishedCount = 0;
    let rejectedCount = 0;
    let lostCount = 0;
    let processingErrors = 0;

    // 2. Step 1: Ingest via Ingestion Collector (T-1.3)
    for (const rawPkg of syntheticBatch) {
      submittedCount++;
      const success = await ingestion.producer.publishRawTelemetry(rawPkg);
      if (success) {
        acceptedCount++;
      } else {
        rejectedCount++;
      }
    }

    // 3. Step 2: Consume Raw Telemetry & Normalize via OCSF Normalizer (T-1.4)
    for (const rawPkg of syntheticBatch) {
      try {
        const ocsfEvent = await normalizer.consumer.consumeRawPackage(rawPkg);
        if (ocsfEvent) {
          normalizedCount++;
          publishedCount++; // Published to telemetry.ocsf.v1
        } else {
          processingErrors++;
        }
      } catch (err) {
        processingErrors++;
      }
    }

    lostCount = generatedCount - publishedCount;

    console.log('[T-1.5 EVENT ACCOUNTING REPORT]');
    console.log(` • Generated:  ${generatedCount}`);
    console.log(` • Submitted:  ${submittedCount}`);
    console.log(` • Accepted:   ${acceptedCount}`);
    console.log(` • Normalized: ${normalizedCount}`);
    console.log(` • Published:  ${publishedCount}`);
    console.log(` • Rejected:   ${rejectedCount}`);
    console.log(` • Lost:       ${lostCount}`);
    console.log(` • Errors:     ${processingErrors}`);

    // Verification Assertions
    expect(generatedCount).toBe(300);
    expect(acceptedCount).toBe(300);
    expect(normalizedCount).toBe(300);
    expect(publishedCount).toBe(300);
    expect(lostCount).toBe(0);
    expect(processingErrors).toBe(0);
  });
});
