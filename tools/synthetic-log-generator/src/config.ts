export interface SyntheticGeneratorConfig {
  targetEPS: number;          // Target Events Per Second (e.g. 100,000)
  durationSeconds: number;    // Run duration in seconds (0 for infinite)
  tenantId: string;           // Target tenant ID
  seed?: number;              // PRNG seed for reproducible test mode
  providers?: ('AWS_CLOUDTRAIL' | 'CROWDSTRIKE_EDR' | 'OKTA_IAM')[];
}

export const DEFAULT_GENERATOR_CONFIG: SyntheticGeneratorConfig = {
  targetEPS: 1000,
  durationSeconds: 10,
  tenantId: 'tenant-acme-corp',
  seed: 1337,
  providers: ['AWS_CLOUDTRAIL', 'CROWDSTRIKE_EDR', 'OKTA_IAM'],
};
