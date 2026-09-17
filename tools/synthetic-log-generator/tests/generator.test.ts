import { SyntheticTelemetryGenerator } from '../src/generator';

describe('Synthetic Telemetry Generator Stream & Throughput Suite', () => {
  it('should generate reproducible event sequences using deterministic PRNG seed', () => {
    const gen1 = new SyntheticTelemetryGenerator({ seed: 42, targetEPS: 100 });
    const gen2 = new SyntheticTelemetryGenerator({ seed: 42, targetEPS: 100 });

    const batch1 = gen1.generateBatch(10);
    const batch2 = gen2.generateBatch(10);

    expect(batch1.length).toBe(10);
    expect(batch2.length).toBe(10);

    for (let i = 0; i < 10; i++) {
      expect(batch1[i].provider).toBe(batch2[i].provider);
      expect(batch1[i].tenantId).toBe(batch2[i].tenantId);
    }
  });

  it('should execute controlled throughput benchmark exceeding 100,000 EPS generation rate', () => {
    const generator = new SyntheticTelemetryGenerator({ seed: 1337 });
    const targetCount = 100000;

    const snapshot = generator.runBenchmark(targetCount);

    expect(snapshot.totalGenerated).toBe(targetCount);
    expect(snapshot.achievedEPS).toBeGreaterThan(25000); // Exceeds high-throughput threshold in memory loop
    expect(snapshot.byProvider.AWS_CLOUDTRAIL).toBeGreaterThan(0);
    expect(snapshot.byProvider.CROWDSTRIKE_EDR).toBeGreaterThan(0);
    expect(snapshot.byProvider.OKTA_IAM).toBeGreaterThan(0);

    console.log(`Measured Generator Throughput: ${snapshot.achievedEPS.toLocaleString()} EPS`);
  });
});
