import { SecretMetadata } from './secret-provider.interface';

export interface KeyRotationSchedule {
  keyId: string;
  tenantId: string;
  lastRotatedAt: string;
  nextRotationDue: string;
  rotationIntervalDays: number;
}

export interface IKeyRotationManager {
  /**
   * Triggers re-encryption of payload under the newest customer master key version.
   */
  rotateTenantKey(tenantId: string, currentKeyId: string): Promise<SecretMetadata>;

  /**
   * Checks whether a tenant CMK key has exceeded its maximum rotation interval.
   */
  isRotationRequired(tenantId: string, lastRotatedAt: string, maxAgeDays?: number): boolean;

  /**
   * Retrieves rotation schedule metadata for audit compliance reporting (ADR-0006).
   */
  getRotationSchedule(tenantId: string): Promise<KeyRotationSchedule>;
}
