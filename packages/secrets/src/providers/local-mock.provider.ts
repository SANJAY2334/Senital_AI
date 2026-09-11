import * as crypto from 'crypto';
import { ISecretProvider, EncryptedSecretPayload } from '../interfaces/secret-provider.interface';

export class LocalMockSecretProvider implements ISecretProvider {
  readonly providerName = 'local-mock';
  private masterKey: Buffer;
  private mockVault: Map<string, string> = new Map();

  constructor(masterKeyHex?: string) {
    const key = masterKeyHex || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    this.masterKey = Buffer.from(key.substring(0, 64), 'hex');

    // Default development secrets seed
    this.mockVault.set('KAFKA_CLIENT_SECRET', 'local-kafka-dev-secret-key-12345');
    this.mockVault.set('DATABASE_PASSWORD', 'local-pg-dev-password-secure');
  }

  async encryptSecret(
    plaintext: string | Buffer,
    tenantId?: string,
  ): Promise<EncryptedSecretPayload> {
    const iv = crypto.randomBytes(12);
    const dataBuffer = typeof plaintext === 'string' ? Buffer.from(plaintext, 'utf-8') : plaintext;

    const cipher = crypto.createCipheriv('aes-256-gcm', this.masterKey, iv);
    const ciphertext = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const effectiveTenant = tenantId || 'tenant-default';
    return {
      keyId: `mock-cmk-${effectiveTenant}-v1`,
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
      metadata: {
        keyId: `mock-cmk-${effectiveTenant}-v1`,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        provider: 'local-mock',
        tenantId: effectiveTenant,
      },
    };
  }

  async decryptSecret(payload: EncryptedSecretPayload): Promise<Buffer> {
    if (!payload.iv || !payload.authTag) {
      throw new Error('SecretError: Missing IV or AuthTag in local mock encrypted payload');
    }
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.masterKey,
      Buffer.from(payload.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));

    return Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64')),
      decipher.final(),
    ]);
  }

  async getSecretValue(secretName: string, _tenantId?: string): Promise<string> {
    const value = this.mockVault.get(secretName);
    if (!value) {
      return `mock-secret-value-for-${secretName}`;
    }
    return value;
  }

  async healthCheck(): Promise<boolean> {
    return true; // Local provider is always healthy
  }
}
