// Open Cybersecurity Schema Framework (OCSF v1.1.0) Base Event Definitions
// Satisfies SRS-FR-004, HLD Section 10, ADR-0005

export enum OCSFCategoryUid {
  SYSTEM_ACTIVITY = 1,
  FINDINGS = 2,
  IDENTITY_MANAGEMENT = 3,
  NETWORK_ACTIVITY = 4,
  DISCOVERY = 5,
  APPLICATION_ACTIVITY = 6,
}

export enum OCSFClassUid {
  PROCESS_ACTIVITY = 1007,
  AUTHENTICATION = 3001,
  NETWORK_ACTIVITY = 4001,
  CLOUD_AUDIT = 6001,
}

export interface OCSFBaseEvent {
  ocsf_event_id: string; // 128-bit UUID (SRS-FR-005)
  category_uid: OCSFCategoryUid;
  class_uid: OCSFClassUid;
  time: string; // UTC ISO-8601 (SRS-I18N-001)
  tenant_id: string;
  provider: string; // AWS, CrowdStrike, Okta, Azure
  severity_id: number; // 1: Low, 2: Medium, 3: High, 4: Critical
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface OCSFProcessActivityEvent extends OCSFBaseEvent {
  class_uid: OCSFClassUid.PROCESS_ACTIVITY;
  process: {
    name: string;
    pid: number;
    cmd_line?: string;
    parent_process_name?: string;
    parent_pid?: number;
  };
  actor: {
    user: {
      name: string;
      uid?: string;
    };
  };
  device: {
    hostname: string;
    ip?: string;
  };
}

export interface OCSFAuthenticationEvent extends OCSFBaseEvent {
  class_uid: OCSFClassUid.AUTHENTICATION;
  actor: {
    user: {
      name: string;
      email?: string;
    };
  };
  src_endpoint?: {
    ip: string;
    user_agent?: string;
  };
  status_id: number; // 1: Success, 2: Failure
}
