import { SeededRandom } from '../utils/seed-random.util';
import { generateUUID } from '@sentinelai/utils';

export interface SyntheticRawTelemetryPackage {
  eventId: string; // 128-bit UUID (SRS-FR-005)
  tenantId: string; // Tenant ID (ADR-0006)
  provider: 'AWS_CLOUDTRAIL' | 'CROWDSTRIKE_EDR' | 'OKTA_IAM';
  timestampUtc: string; // ISO-8601 UTC
  correlationId: string; // Tracing correlation ID
  rawPayload: string; // JSON string raw payload
  metadata: Record<string, string>;
}

export class AwsCloudTrailFactory {
  private prng: SeededRandom;

  constructor(prng: SeededRandom) {
    this.prng = prng;
  }

  public createEvent(tenantId: string = 'tenant-acme-corp'): SyntheticRawTelemetryPackage {
    const eventId = generateUUID();
    const correlationId = `corr-aws-${this.prng.nextInt(100000, 999999)}`;
    const timestampUtc = new Date().toISOString();

    const awsOperations = [
      'RunInstances',
      'StopInstances',
      'AttachVolume',
      'CreateUser',
      'PutBucketPolicy',
    ];
    const selectedOp = this.prng.pickOne(awsOperations);

    const rawObject = {
      eventVersion: '1.08',
      userIdentity: {
        type: 'IAMUser',
        principalId: 'AIDAEXAMPLEPRINCIPAL',
        arn: `arn:aws:iam::123456789012:user/secops-admin`,
        accountId: '123456789012',
        userName: 'secops-admin',
      },
      eventTime: timestampUtc,
      eventSource: 'ec2.amazonaws.com',
      eventName: selectedOp,
      awsRegion: 'us-east-1',
      sourceIPAddress: '192.168.1.150',
      userAgent: 'aws-cli/2.15.0 Python/3.11.6',
      requestParameters: { instanceId: 'i-0a1b2c3d4e5f6g7h8' },
      responseElements: { reservationId: 'r-11223344556677889' },
      eventID: eventId,
      readOnly: false,
      eventType: 'AwsApiCall',
      recipientAccountId: '123456789012',
    };

    return {
      eventId,
      tenantId,
      provider: 'AWS_CLOUDTRAIL',
      timestampUtc,
      correlationId,
      rawPayload: JSON.stringify(rawObject),
      metadata: {
        'x-sentinelai-source': 'synthetic-generator',
        'x-aws-region': 'us-east-1',
      },
    };
  }
}
