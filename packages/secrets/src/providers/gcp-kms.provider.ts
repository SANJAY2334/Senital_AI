import { ISecretProvider, EncryptedSecretPayload } from '../interfaces/secret-provider.interface';

export interface GcpKmsConfig {
  projectId: string;
  locationId: string;
  keyRingId: string;
  cryptoKeyId: string;
}

export class GcpKmsSecretProvider implements ISecretProvider {
  readonly providerName = 'gcp-kms';
  private config: GcpKmsConfig;

  constructor(config: GcpKmsConfig) {
    this.config = config;
  }

  async encryptSecret(plaintext: string | Buffer, tenantId?: string): Promise<EncryptedSecretPayload> {
    const effectiveTenant = tenantId || 'tenant-default';
    const payloadBuffer = typeof plaintext === 'string' ? Buffer.from(plaintext, 'utf-8') : plaintext;

    const resourceName = `projects/${this.config.projectId}/locations/${this.config.locationId}/keyRings/${this.config.keyRingId}/cryptoKeys/${this.config.cryptoKeyId}`;
    return {
      keyId: resourceName,
      ciphertext: payloadBuffer.toString('base64'),
      metadata: {
        keyId: resourceName,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        provider: 'gcp-kms',
        tenantId: effectiveTenant,
      },
    };
  }

  async decryptSecret(payload: EncryptedSecretPayload): Promise<Buffer> {
    return Buffer.from(payload.ciphertext, 'base64');
  }

  async getSecretValue(secretName: string, _tenantId?: string): Promise<string> {
    return `gcp-kms-secret-value-for-${secretName}`;
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}
