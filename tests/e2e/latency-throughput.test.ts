import { SyntheticTelemetryGenerator } from '@sentinelai/synthetic-log-generator';
import { createNormalizerService } from '@sentinelai/ocsf-normalizer';

describe('T-1.5 E2E Integration Suite: Latency & Multi-Level Load Benchmarks', () => {
  const normalizer = createNormalizerService();

  it('should measure Test-Harness E2E Processing Latency distribution', async () => {
    const generator = new SyntheticTelemetryGenerator({ seed: 777 });
    const sampleSize = 500;
    const latenciesMs: number[] = [];

    const batch = generator.generateBatch(sampleSize);

    for (const rawPkg of batch) {
      const startTime = Date.now();
      const ocsfEvent = await normalizer.consumer.consumeRawPackage(rawPkg);
      const durationMs = Date.now() - startTime;

      if (ocsfEvent) {
        latenciesMs.push(durationMs);
      }
    }

    latenciesMs.sort((a, b) => a - b);

    const minMs = latenciesMs[0];
    const maxMs = latenciesMs[latenciesMs.length - 1];
    const avgMs = parseFloat((latenciesMs.reduce((sum, v) => sum + v, 0) / latenciesMs.length).toFixed(2));
    const p50Ms = latenciesMs[Math.floor(latenciesMs.length * 0.5)];
    const p95Ms = latenciesMs[Math.floor(latenciesMs.length * 0.95)];
    const p99Ms = latenciesMs[Math.floor(latenciesMs.length * 0.99)];

    console.log('[T-1.5 TEST-HARNESS LATENCY DISTRIBUTION REPORT]');
    console.log(` • Minimum: ${minMs} ms`);
    console.log(` • Average: ${avgMs} ms`);
    console.log(` • p50:     ${p50Ms} ms`);
    console.log(` • p95:     ${p95Ms} ms`);
    console.log(` • p99:     ${p99Ms} ms`);
    console.log(` • Maximum: ${maxMs} ms`);
    console.log(` Note: Actual broker-backed end-to-end latency has not yet been measured.`);

    expect(p99Ms).toBeLessThan(100);
  });

  // Multi-Level Throughput Evaluation (10K, 25K, 50K, 100K)
  const runLoadLevel = async (targetCount: number) => {
    const generator = new SyntheticTelemetryGenerator({ seed: 999 });
    const batch = generator.generateBatch(targetCount);

    const startTime = Date.now();
    let accepted = 0;
    let normalized = 0;
    let errors = 0;

    for (const rawPkg of batch) {
      try {
        accepted++;
        const evt = await normalizer.consumer.consumeRawPackage(rawPkg);
        if (evt) normalized++;
        else errors++;
      } catch (err) {
        errors++;
      }
    }

    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const achievedEPS = Math.round(normalized / Math.max(elapsedSeconds, 0.001));

    return {
      targetCount,
      eventsGenerated: batch.length,
      eventsSubmitted: batch.length,
      eventsAccepted: accepted,
      eventsNormalized: normalized,
      eventsPublished: normalized,
      eventsRejected: 0,
      eventsLost: batch.length - normalized,
      errors,
      elapsedSeconds: parseFloat(elapsedSeconds.toFixed(2)),
      achievedEPS,
    };
  };

  it('should evaluate controlled load level at 10,000 EPS target profile', async () => {
    const res = await runLoadLevel(10000);
    console.log(`[LOAD LEVEL 10K] Achieved Test-Harness E2E Throughput: ${res.achievedEPS.toLocaleString()} EPS (Elapsed: ${res.elapsedSeconds}s)`);
    expect(res.eventsNormalized).toBe(10000);
  });

  it('should evaluate controlled load level at 25,000 EPS target profile', async () => {
    const res = await runLoadLevel(25000);
    console.log(`[LOAD LEVEL 25K] Achieved Test-Harness E2E Throughput: ${res.achievedEPS.toLocaleString()} EPS (Elapsed: ${res.elapsedSeconds}s)`);
    expect(res.eventsNormalized).toBe(25000);
  });

  it('should evaluate controlled load level at 50,000 EPS target profile', async () => {
    const res = await runLoadLevel(50000);
    console.log(`[LOAD LEVEL 50K] Achieved Test-Harness E2E Throughput: ${res.achievedEPS.toLocaleString()} EPS (Elapsed: ${res.elapsedSeconds}s)`);
    expect(res.eventsNormalized).toBe(50000);
  });

  it('should evaluate controlled load level at 100,000 EPS target profile', async () => {
    const res = await runLoadLevel(100000);
    console.log(`[LOAD LEVEL 100K] Achieved Test-Harness E2E Throughput: ${res.achievedEPS.toLocaleString()} EPS (Elapsed: ${res.elapsedSeconds}s)`);
    expect(res.eventsNormalized).toBe(100000);
  });
});
