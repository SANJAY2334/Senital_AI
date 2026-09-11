import { SyntheticGeneratorConfig, DEFAULT_GENERATOR_CONFIG } from './config';
import { SeededRandom } from './utils/seed-random.util';
import { MetricsCounter, GeneratorMetricsSnapshot } from './utils/metrics-counter.util';
import {
  AwsCloudTrailFactory,
  SyntheticRawTelemetryPackage,
} from './factories/aws-cloudtrail.factory';
import { CrowdStrikeEdrFactory } from './factories/crowdstrike-edr.factory';
import { OktaIamFactory } from './factories/okta-iam.factory';

export class SyntheticTelemetryGenerator {
  private config: SyntheticGeneratorConfig;
  private prng: SeededRandom;
  private metrics: MetricsCounter;
  private awsFactory: AwsCloudTrailFactory;
  private crowdStrikeFactory: CrowdStrikeEdrFactory;
  private oktaFactory: OktaIamFactory;

  constructor(overrideConfig?: Partial<SyntheticGeneratorConfig>) {
    this.config = { ...DEFAULT_GENERATOR_CONFIG, ...overrideConfig };
    this.prng = new SeededRandom(this.config.seed);
    this.metrics = new MetricsCounter();

    this.awsFactory = new AwsCloudTrailFactory(this.prng);
    this.crowdStrikeFactory = new CrowdStrikeEdrFactory(this.prng);
    this.oktaFactory = new OktaIamFactory(this.prng);
  }

  public generateNextPayload(): SyntheticRawTelemetryPackage {
    const providers = this.config.providers || ['AWS_CLOUDTRAIL', 'CROWDSTRIKE_EDR', 'OKTA_IAM'];
    const chosenProvider = this.prng.pickOne(providers);

    let payload: SyntheticRawTelemetryPackage;
    switch (chosenProvider) {
      case 'CROWDSTRIKE_EDR':
        payload = this.crowdStrikeFactory.createEvent(this.config.tenantId);
        break;
      case 'OKTA_IAM':
        payload = this.oktaFactory.createEvent(this.config.tenantId);
        break;
      case 'AWS_CLOUDTRAIL':
      default:
        payload = this.awsFactory.createEvent(this.config.tenantId);
        break;
    }

    this.metrics.increment(chosenProvider);
    return payload;
  }

  public generateBatch(batchSize: number): SyntheticRawTelemetryPackage[] {
    const batch: SyntheticRawTelemetryPackage[] = [];
    for (let i = 0; i < batchSize; i++) {
      try {
        batch.push(this.generateNextPayload());
      } catch (err) {
        this.metrics.incrementError();
      }
    }
    return batch;
  }

  /**
   * High-Throughput Burst Benchmark Engine
   * Generates events in tight memory loops to measure maximum synthetic generation rate (EPS).
   */
  public runBenchmark(targetCount: number = 100000): GeneratorMetricsSnapshot {
    this.metrics.reset();
    const batchSize = 10000;
    let remaining = targetCount;

    while (remaining > 0) {
      const currentBatchSize = Math.min(batchSize, remaining);
      this.generateBatch(currentBatchSize);
      remaining -= currentBatchSize;
    }

    return this.metrics.getSnapshot();
  }

  public getMetrics(): GeneratorMetricsSnapshot {
    return this.metrics.getSnapshot();
  }
}
