import { SeededRandom } from '../utils/seed-random.util';
import { SyntheticRawTelemetryPackage } from './aws-cloudtrail.factory';

export class OktaIamFactory {
  private prng: SeededRandom;

  constructor(prng: SeededRandom) {
    this.prng = prng;
  }

  public createEvent(tenantId: string = 'tenant-acme-corp'): SyntheticRawTelemetryPackage {
    const eventId = crypto.randomUUID();
    const correlationId = `corr-okta-${this.prng.nextInt(100000, 999999)}`;
    const timestampUtc = new Date().toISOString();

    const outcomes = ['SUCCESS', 'FAILURE'];
    const result = this.prng.pickOne(outcomes);

    const rawObject = {
      uuid: eventId,
      published: timestampUtc,
      eventType: 'user.authentication.auth_via_mfa',
      displayMessage: 'User authentication via MFA',
      severity: result === 'SUCCESS' ? 'INFO' : 'WARN',
      actor: {
        id: '00u1234567890abcdef',
        type: 'User',
        alternateId: 'alice@acme-corp.com',
        displayName: 'Alice Smith',
      },
      client: {
        ipAddress: '203.0.113.45',
        userAgent: { rawUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      },
      outcome: {
        result,
        reason: result === 'SUCCESS' ? 'SUCCESS' : 'INVALID_CREDENTIALS',
      },
    };

    return {
      eventId,
      tenantId,
      provider: 'OKTA_IAM',
      timestampUtc,
      correlationId,
      rawPayload: JSON.stringify(rawObject),
      metadata: {
        'x-sentinelai-source': 'synthetic-generator',
        'x-okta-org': 'acme-corp.okta.com',
      },
    };
  }
}
