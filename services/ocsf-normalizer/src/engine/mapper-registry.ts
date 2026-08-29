import { OCSFClassUid, OCSFCategoryUid, OCSFBaseEvent, OCSFProcessActivityEvent, OCSFAuthenticationEvent } from '@sentinelai/ocsf-types';
import { generateUUID } from '@sentinelai/utils';

export interface OCSFCloudAuditEvent extends OCSFBaseEvent {
  class_uid: OCSFClassUid.CLOUD_AUDIT;
  actor: {
    user: {
      name: string;
      uid?: string;
    };
  };
  src_endpoint?: {
    ip: string;
    user_agent?: string;
  };
  cloud: {
    provider: string;
    region?: string;
    account_id?: string;
  };
  api: {
    service_name: string;
    operation: string;
  };
}

export function mapAWSCloudTrailToOCSF(raw: any, tenantId: string, correlationId: string): OCSFCloudAuditEvent {
  const eventTime = raw.eventTime ? new Date(raw.eventTime).toISOString() : new Date().toISOString();
  return {
    ocsf_event_id: generateUUID(),
    category_uid: OCSFCategoryUid.APPLICATION_ACTIVITY,
    class_uid: OCSFClassUid.CLOUD_AUDIT,
    time: eventTime,
    tenant_id: tenantId,
    provider: 'AWS',
    severity_id: raw.errorCode ? 3 : 1, // 3: High (Error), 1: Low (Info)
    message: `AWS CloudTrail API Call: ${raw.eventSource || 'ec2.amazonaws.com'}:${raw.eventName || 'Unknown'}`,
    actor: {
      user: {
        name: raw.userIdentity?.userName || raw.userIdentity?.principalId || 'UnknownUser',
        uid: raw.userIdentity?.arn,
      },
    },
    src_endpoint: {
      ip: raw.sourceIPAddress || '0.0.0.0',
      user_agent: raw.userAgent,
    },
    cloud: {
      provider: 'AWS',
      region: raw.awsRegion,
      account_id: raw.recipientAccountId,
    },
    api: {
      service_name: raw.eventSource || 'aws.service',
      operation: raw.eventName || 'api.operation',
    },
    metadata: {
      correlation_id: correlationId,
      original_raw_event_id: raw.eventID,
    },
  };
}

export function mapCrowdStrikeEDRToOCSF(raw: any, tenantId: string, correlationId: string): OCSFProcessActivityEvent {
  const evt = raw.event || raw;
  const time = evt.ProcessStartTime ? new Date(evt.ProcessStartTime).toISOString() : new Date().toISOString();
  return {
    ocsf_event_id: generateUUID(),
    category_uid: OCSFCategoryUid.SYSTEM_ACTIVITY,
    class_uid: OCSFClassUid.PROCESS_ACTIVITY,
    time,
    tenant_id: tenantId,
    provider: 'CrowdStrike',
    severity_id: typeof evt.Severity === 'number' ? Math.min(Math.max(evt.Severity, 1), 4) : 2,
    message: `CrowdStrike Process Execution: ${evt.ImageFileName || 'process.exe'}`,
    process: {
      name: evt.ImageFileName || 'process.exe',
      pid: typeof evt.ProcessId === 'number' ? evt.ProcessId : 1000,
      cmd_line: evt.CommandLine,
      parent_process_name: evt.ParentBaseFileName,
      parent_pid: evt.ParentProcessId,
    },
    actor: {
      user: {
        name: evt.UserName || 'SYSTEM',
        uid: evt.UserSid,
      },
    },
    device: {
      hostname: evt.ComputerName || 'localhost',
      ip: evt.LocalIP,
    },
    metadata: {
      correlation_id: correlationId,
      original_raw_event_id: evt.id,
    },
  };
}

export function mapOktaIAMToOCSF(raw: any, tenantId: string, correlationId: string): OCSFAuthenticationEvent {
  const time = raw.published ? new Date(raw.published).toISOString() : new Date().toISOString();
  const isSuccess = raw.outcome?.result === 'SUCCESS';
  return {
    ocsf_event_id: generateUUID(),
    category_uid: OCSFCategoryUid.IDENTITY_MANAGEMENT,
    class_uid: OCSFClassUid.AUTHENTICATION,
    time,
    tenant_id: tenantId,
    provider: 'Okta',
    severity_id: isSuccess ? 1 : 3,
    message: `Okta Authentication: ${raw.displayMessage || 'MFA Login'} (${raw.outcome?.result || 'UNKNOWN'})`,
    actor: {
      user: {
        name: raw.actor?.displayName || raw.actor?.alternateId || 'UnknownUser',
        email: raw.actor?.alternateId,
      },
    },
    src_endpoint: {
      ip: raw.client?.ipAddress || '0.0.0.0',
      user_agent: raw.client?.userAgent?.rawUserAgent,
    },
    status_id: isSuccess ? 1 : 2, // 1: Success, 2: Failure
    metadata: {
      correlation_id: correlationId,
      original_raw_event_id: raw.uuid,
    },
  };
}
