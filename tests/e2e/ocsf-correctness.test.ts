import { SyntheticTelemetryGenerator } from '@sentinelai/synthetic-log-generator';
import { createNormalizerService } from '@sentinelai/ocsf-normalizer';
import {
  OCSFClassUid,
  OCSFCategoryUid,
  OCSFProcessActivityEvent,
  OCSFAuthenticationEvent,
} from '@sentinelai/ocsf-types';
import { OCSFCloudAuditEvent } from '../../services/ocsf-normalizer/src/engine/mapper-registry';

describe('T-1.5 E2E Integration Suite: OCSF Schema Correctness Verification', () => {
  const normalizer = createNormalizerService();

  it('should correctly normalize AWS CloudTrail to OCSF Class 6001 Cloud Audit', async () => {
    const generator = new SyntheticTelemetryGenerator({
      seed: 10,
      providers: ['AWS_CLOUDTRAIL'],
    });
    const rawPkg = generator.generateNextPayload();

    const ocsfEvent = (await normalizer.consumer.consumeRawPackage(rawPkg)) as OCSFCloudAuditEvent;

    expect(ocsfEvent).not.toBeNull();
    expect(ocsfEvent.category_uid).toBe(OCSFCategoryUid.APPLICATION_ACTIVITY);
    expect(ocsfEvent.class_uid).toBe(OCSFClassUid.CLOUD_AUDIT);
    expect(ocsfEvent.provider).toBe('AWS');
    expect(ocsfEvent.ocsf_event_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(new Date(ocsfEvent.time).getTime()).not.toBeNaN();
    expect(ocsfEvent.cloud.provider).toBe('AWS');
    expect(ocsfEvent.api.operation).toBeDefined();
  });

  it('should correctly normalize CrowdStrike EDR to OCSF Class 1007 Process Activity', async () => {
    const generator = new SyntheticTelemetryGenerator({
      seed: 20,
      providers: ['CROWDSTRIKE_EDR'],
    });
    const rawPkg = generator.generateNextPayload();

    const ocsfEvent = (await normalizer.consumer.consumeRawPackage(
      rawPkg,
    )) as OCSFProcessActivityEvent;

    expect(ocsfEvent).not.toBeNull();
    expect(ocsfEvent.category_uid).toBe(OCSFCategoryUid.SYSTEM_ACTIVITY);
    expect(ocsfEvent.class_uid).toBe(OCSFClassUid.PROCESS_ACTIVITY);
    expect(ocsfEvent.provider).toBe('CrowdStrike');
    expect(ocsfEvent.process.name).toBeDefined();
    expect(ocsfEvent.process.pid).toBeGreaterThan(0);
    expect(ocsfEvent.device.hostname).toBeDefined();
  });

  it('should correctly normalize Okta IAM to OCSF Class 3001 Authentication', async () => {
    const generator = new SyntheticTelemetryGenerator({ seed: 30, providers: ['OKTA_IAM'] });
    const rawPkg = generator.generateNextPayload();

    const ocsfEvent = (await normalizer.consumer.consumeRawPackage(
      rawPkg,
    )) as OCSFAuthenticationEvent;

    expect(ocsfEvent).not.toBeNull();
    expect(ocsfEvent.category_uid).toBe(OCSFCategoryUid.IDENTITY_MANAGEMENT);
    expect(ocsfEvent.class_uid).toBe(OCSFClassUid.AUTHENTICATION);
    expect(ocsfEvent.provider).toBe('Okta');
    expect(ocsfEvent.actor.user.name).toBeDefined();
    expect([1, 2]).toContain(ocsfEvent.status_id);
  });
});
