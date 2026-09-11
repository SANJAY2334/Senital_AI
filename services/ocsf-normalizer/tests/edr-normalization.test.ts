import { createNormalizerService } from '../src';
import { OCSFClassUid, OCSFCategoryUid, OCSFProcessActivityEvent } from '@sentinelai/ocsf-types';

describe('OCSF Normalizer: CrowdStrike EDR -> OCSF Process Activity Suite', () => {
  const { engine } = createNormalizerService();

  it('should normalize valid CrowdStrike EDR payload into OCSF Class 1007 Process Activity event', () => {
    const rawPayload = JSON.stringify({
      event: {
        id: 'cs-evt-999',
        ProcessStartTime: '2026-08-10T12:05:00.000Z',
        ProcessId: 4096,
        ImageFileName: 'powershell.exe',
        CommandLine: 'powershell.exe -ExecutionPolicy Bypass',
        ParentBaseFileName: 'explorer.exe',
        ParentProcessId: 1048,
        UserName: 'SYSTEM',
        UserSid: 'S-1-5-18',
        ComputerName: 'WORKSTATION-084',
        LocalIP: '10.0.4.12',
        Severity: 3,
      },
    });

    const ocsfEvent = engine.normalizeRawTelemetry({
      tenantId: 'tenant-beta',
      provider: 'CROWDSTRIKE_EDR',
      rawPayload,
      correlationId: 'corr-cs-200',
    }) as OCSFProcessActivityEvent;

    expect(ocsfEvent.category_uid).toBe(OCSFCategoryUid.SYSTEM_ACTIVITY);
    expect(ocsfEvent.class_uid).toBe(OCSFClassUid.PROCESS_ACTIVITY);
    expect(ocsfEvent.provider).toBe('CrowdStrike');
    expect(ocsfEvent.tenant_id).toBe('tenant-beta');
    expect(ocsfEvent.ocsf_event_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(ocsfEvent.process.name).toBe('powershell.exe');
    expect(ocsfEvent.process.pid).toBe(4096);
    expect(ocsfEvent.device.hostname).toBe('WORKSTATION-084');
  });
});
