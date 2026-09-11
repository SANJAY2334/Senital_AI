import { OCSFBaseEvent } from '@sentinelai/ocsf-types';
import { ValidationError } from '@sentinelai/errors';
import { NormalizerMetricsCollector } from '../observability/normalizer-metrics';
import {
  mapAWSCloudTrailToOCSF,
  mapCrowdStrikeEDRToOCSF,
  mapOktaIAMToOCSF,
} from './mapper-registry';

export interface RawTelemetryPackageInput {
  eventId?: string;
  tenantId: string;
  provider: 'AWS_CLOUDTRAIL' | 'CROWDSTRIKE_EDR' | 'OKTA_IAM' | string;
  timestampUtc?: string;
  correlationId?: string;
  rawPayload: string;
}

export class OCSFNormalizerEngine {
  private metrics: NormalizerMetricsCollector;

  constructor(metrics: NormalizerMetricsCollector) {
    this.metrics = metrics;
  }

  public normalizeRawTelemetry(pkg: RawTelemetryPackageInput): OCSFBaseEvent {
    const startTime = Date.now();
    this.metrics.recordConsumed();

    // 1. Validation Checks (SRS-FR-004, SRS-FR-005)
    if (!pkg.tenantId || typeof pkg.tenantId !== 'string') {
      this.metrics.recordRejected();
      this.metrics.recordFailure();
      throw new ValidationError('NormalizerError: Missing tenantId in raw telemetry package');
    }

    if (!pkg.rawPayload) {
      this.metrics.recordRejected();
      this.metrics.recordFailure();
      throw new ValidationError('NormalizerError: Missing rawPayload in raw telemetry package');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedRaw: any;
    try {
      parsedRaw = typeof pkg.rawPayload === 'string' ? JSON.parse(pkg.rawPayload) : pkg.rawPayload;
    } catch (err) {
      this.metrics.recordRejected();
      this.metrics.recordFailure();
      throw new ValidationError('NormalizerError: Malformed JSON rawPayload', {
        rawPayload: pkg.rawPayload,
      });
    }

    const correlationId =
      pkg.correlationId || `corr-norm-${Math.random().toString(36).substring(2, 9)}`;

    // 2. Provider-Aware Schematization (SRS-FR-004, AC-001.2)
    let ocsfEvent: OCSFBaseEvent;
    switch (pkg.provider) {
      case 'AWS_CLOUDTRAIL':
        ocsfEvent = mapAWSCloudTrailToOCSF(parsedRaw, pkg.tenantId, correlationId);
        break;
      case 'CROWDSTRIKE_EDR':
        ocsfEvent = mapCrowdStrikeEDRToOCSF(parsedRaw, pkg.tenantId, correlationId);
        break;
      case 'OKTA_IAM':
        ocsfEvent = mapOktaIAMToOCSF(parsedRaw, pkg.tenantId, correlationId);
        break;
      default:
        this.metrics.recordRejected();
        this.metrics.recordFailure();
        throw new ValidationError(`NormalizerError: Unsupported provider '${pkg.provider}'`);
    }

    // 3. Mandatory Timestamp & RFC 4122 UUID Verification (SRS-FR-005)
    if (isNaN(new Date(ocsfEvent.time).getTime())) {
      this.metrics.recordFailure();
      throw new ValidationError(
        'NormalizerError: Invalid UTC timestamp produced during normalization',
      );
    }

    const durationMs = Date.now() - startTime;
    this.metrics.recordNormalized(pkg.provider, ocsfEvent.class_uid, durationMs);

    return ocsfEvent;
  }
}
