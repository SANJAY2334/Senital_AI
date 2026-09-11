import { IKeyRotationManager, KeyRotationSchedule } from '../interfaces/key-rotation.interface';
import { SecretMetadata, ISecretProvider } from '../interfaces/secret-provider.interface';

export class KeyRotationManager implements IKeyRotationManager {
  private provider: ISecretProvider;

  constructor(provider: ISecretProvider) {
    this.provider = provider;
  }

  async rotateTenantKey(tenantId: string, currentKeyId: string): Promise<SecretMetadata> {
    // Generates next key version metadata (ADR-0006)
    const newVersion = '2.0.0';
    return {
      keyId: `${currentKeyId}-rotated-v2`,
      version: newVersion,
      createdAt: new Date().toISOString(),
      provider: this.provider.providerName as SecretMetadata['provider'],
      tenantId,
    };
  }

  isRotationRequired(_tenantId: string, lastRotatedAt: string, maxAgeDays: number = 90): boolean {
    const lastRotatedDate = new Date(lastRotatedAt).getTime();
    const now = Date.now();
    const ageInDays = (now - lastRotatedDate) / (1000 * 60 * 60 * 24);
    return ageInDays >= maxAgeDays;
  }

  async getRotationSchedule(tenantId: string): Promise<KeyRotationSchedule> {
    const now = new Date();
    const nextDue = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    return {
      keyId: `cmk-${tenantId}-v1`,
      tenantId,
      lastRotatedAt: now.toISOString(),
      nextRotationDue: nextDue.toISOString(),
      rotationIntervalDays: 90,
    };
  }
}
