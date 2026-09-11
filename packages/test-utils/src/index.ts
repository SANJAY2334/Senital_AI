import { OCSFClassUid, OCSFCategoryUid, OCSFProcessActivityEvent } from '@sentinelai/ocsf-types';
import { IncidentStory } from '@sentinelai/shared-types';

export function createMockOCSFProcessEvent(
  overrides?: Partial<OCSFProcessActivityEvent>,
): OCSFProcessActivityEvent {
  return {
    ocsf_event_id: '123e4567-e89b-12d3-a456-426614174000',
    category_uid: OCSFCategoryUid.SYSTEM_ACTIVITY,
    class_uid: OCSFClassUid.PROCESS_ACTIVITY,
    time: new Date().toISOString(),
    tenant_id: 'tenant-test-01',
    provider: 'CrowdStrike',
    severity_id: 3,
    process: {
      name: 'powershell.exe',
      pid: 4096,
      cmd_line: 'powershell.exe -ExecutionPolicy Bypass -Command EncodedCommand...',
    },
    actor: {
      user: {
        name: 'test-user',
      },
    },
    device: {
      hostname: 'host-test-01',
      ip: '192.168.1.100',
    },
    ...overrides,
  };
}

export function createMockIncidentStory(overrides?: Partial<IncidentStory>): IncidentStory {
  return {
    storyId: 'story-test-100',
    tenantId: 'tenant-test-01',
    severity: 'HIGH',
    confidenceScore: 0.92,
    riskScore: 85,
    narrativeSummary:
      'Suspicious execution of encoded PowerShell command on workstation host-test-01.',
    mitreTechniques: ['T1059.001'],
    affectedEntityIds: ['host-test-01', 'test-user'],
    breadcrumbs: [
      {
        claimId: 'claim-1',
        narrativeClaim: 'Executed powershell.exe with bypass policy',
        targetOcsfEventId: '123e4567-e89b-12d3-a456-426614174000',
        featureWeight: 0.88,
        verified: true,
      },
    ],
    status: 'SYNTHESIZED',
    uncertaintyEscalation: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
