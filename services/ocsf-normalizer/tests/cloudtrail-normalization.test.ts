import { createNormalizerService } from '../src';
import { OCSFClassUid, OCSFCategoryUid } from '@sentinelai/ocsf-types';

describe('OCSF Normalizer: AWS CloudTrail -> OCSF Cloud Audit Suite', () => {
  const { engine } = createNormalizerService();

  it('should normalize valid raw AWS CloudTrail payload into OCSF Class 6001 Cloud Audit event', () => {
    const rawPayload = JSON.stringify({
      eventVersion: '1.08',
      userIdentity: {
        type: 'IAMUser',
        principalId: 'AIDAEXAMPLEPRINCIPAL',
        arn: 'arn:aws:iam::123456789012:user/secops-admin',
        userName: 'secops-admin',
      },
      eventTime: '2026-08-10T12:00:00.000Z',
      eventSource: 'ec2.amazonaws.com',
      eventName: 'RunInstances',
      awsRegion: 'us-east-1',
      sourceIPAddress: '192.168.1.150',
      eventID: 'aws-evt-12345',
      recipientAccountId: '123456789012',
    });

    const ocsfEvent = engine.normalizeRawTelemetry({
      tenantId: 'tenant-acme',
      provider: 'AWS_CLOUDTRAIL',
      rawPayload,
      correlationId: 'corr-aws-100',
    }) as any;

    expect(ocsfEvent.category_uid).toBe(OCSFCategoryUid.APPLICATION_ACTIVITY);
    expect(ocsfEvent.class_uid).toBe(OCSFClassUid.CLOUD_AUDIT);
    expect(ocsfEvent.provider).toBe('AWS');
    expect(ocsfEvent.tenant_id).toBe('tenant-acme');
    expect(ocsfEvent.ocsf_event_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(ocsfEvent.actor.user.name).toBe('secops-admin');
    expect(ocsfEvent.cloud.provider).toBe('AWS');
    expect(ocsfEvent.api.operation).toBe('RunInstances');
  });
});
