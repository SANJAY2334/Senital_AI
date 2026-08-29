import { SeededRandom } from '../src/utils/seed-random.util';
import { AwsCloudTrailFactory } from '../src/factories/aws-cloudtrail.factory';
import { CrowdStrikeEdrFactory } from '../src/factories/crowdstrike-edr.factory';
import { OktaIamFactory } from '../src/factories/okta-iam.factory';

describe('Synthetic Log Generator Provider Payload Factories', () => {
  const prng = new SeededRandom(1337);

  describe('1. AWS CloudTrail Factory', () => {
    const awsFactory = new AwsCloudTrailFactory(prng);

    it('should generate valid AWS CloudTrail raw telemetry package', () => {
      const payload = awsFactory.createEvent('tenant-acme-corp');

      expect(payload.provider).toBe('AWS_CLOUDTRAIL');
      expect(payload.tenantId).toBe('tenant-acme-corp');
      expect(payload.eventId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i); // Valid 128-bit RFC 4122 UUID v4
      expect(new Date(payload.timestampUtc).getTime()).not.toBeNaN(); // Valid ISO-8601 UTC timestamp
      expect(payload.correlationId).toContain('corr-aws-');

      const parsedRaw = JSON.parse(payload.rawPayload);
      expect(parsedRaw.eventSource).toBe('ec2.amazonaws.com');
      expect(parsedRaw.eventVersion).toBe('1.08');
      expect(parsedRaw.userIdentity.userName).toBe('secops-admin');
    });
  });

  describe('2. CrowdStrike EDR Factory', () => {
    const csFactory = new CrowdStrikeEdrFactory(prng);

    it('should generate valid CrowdStrike EDR raw telemetry package', () => {
      const payload = csFactory.createEvent('tenant-beta');

      expect(payload.provider).toBe('CROWDSTRIKE_EDR');
      expect(payload.tenantId).toBe('tenant-beta');
      expect(payload.eventId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      expect(new Date(payload.timestampUtc).getTime()).not.toBeNaN();

      const parsedRaw = JSON.parse(payload.rawPayload);
      expect(parsedRaw.event.ImageFileName).toBeDefined();
      expect(parsedRaw.event.ProcessId).toBeGreaterThan(0);
      expect(parsedRaw.event.Severity).toBeGreaterThanOrEqual(1);
    });
  });

  describe('3. Okta IAM Factory', () => {
    const oktaFactory = new OktaIamFactory(prng);

    it('should generate valid Okta IAM raw telemetry package', () => {
      const payload = oktaFactory.createEvent('tenant-gamma');

      expect(payload.provider).toBe('OKTA_IAM');
      expect(payload.tenantId).toBe('tenant-gamma');
      expect(payload.eventId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

      const parsedRaw = JSON.parse(payload.rawPayload);
      expect(parsedRaw.eventType).toBe('user.authentication.auth_via_mfa');
      expect(parsedRaw.actor.alternateId).toBe('alice@acme-corp.com');
      expect(['SUCCESS', 'FAILURE']).toContain(parsedRaw.outcome.result);
    });
  });
});
