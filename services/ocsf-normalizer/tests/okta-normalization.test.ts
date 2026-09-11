import { createNormalizerService } from '../src';
import { OCSFClassUid, OCSFCategoryUid, OCSFAuthenticationEvent } from '@sentinelai/ocsf-types';

describe('OCSF Normalizer: Okta IAM -> OCSF Authentication Suite', () => {
  const { engine } = createNormalizerService();

  it('should normalize valid Okta IAM payload into OCSF Class 3001 Authentication event', () => {
    const rawPayload = JSON.stringify({
      uuid: 'okta-evt-777',
      published: '2026-08-10T12:10:00.000Z',
      eventType: 'user.authentication.auth_via_mfa',
      displayMessage: 'User authentication via MFA',
      actor: {
        id: '00u123',
        displayName: 'Alice Smith',
        alternateId: 'alice@acme.com',
      },
      client: {
        ipAddress: '203.0.113.45',
        userAgent: { rawUserAgent: 'Mozilla/5.0' },
      },
      outcome: {
        result: 'SUCCESS',
      },
    });

    const ocsfEvent = engine.normalizeRawTelemetry({
      tenantId: 'tenant-gamma',
      provider: 'OKTA_IAM',
      rawPayload,
      correlationId: 'corr-okta-300',
    }) as OCSFAuthenticationEvent;

    expect(ocsfEvent.category_uid).toBe(OCSFCategoryUid.IDENTITY_MANAGEMENT);
    expect(ocsfEvent.class_uid).toBe(OCSFClassUid.AUTHENTICATION);
    expect(ocsfEvent.provider).toBe('Okta');
    expect(ocsfEvent.tenant_id).toBe('tenant-gamma');
    expect(ocsfEvent.ocsf_event_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(ocsfEvent.actor.user.name).toBe('Alice Smith');
    expect(ocsfEvent.status_id).toBe(1); // Success
  });
});
