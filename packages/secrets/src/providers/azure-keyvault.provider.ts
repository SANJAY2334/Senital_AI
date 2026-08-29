import { ISecretProvider, EncryptedSecretPayload } from '../interfaces/secret-provider.interface';

export interface AzureKeyVaultConfig {
  vaultUrl: string;
  keyName: string;
}

export class AzureKeyVaultSecretProvider implements ISecretProvider {
  readonly providerName = 'azure-keyvault';
  private config: AzureKeyVaultConfig;

  constructor(config: AzureKeyVaultConfig) {
    this.config = config;
  }

  async encryptSecret(plaintext: string | Buffer, tenantId?: string): Promise<EncryptedSecretPayload> {
    const effectiveTenant = tenantId || 'tenant-default';
    const payloadBuffer = typeof plaintext === 'string' ? Buffer.from(plaintext, 'utf-8') : plaintext;

    return {
      keyId: `${this.config.vaultUrl}/keys/${this.config.keyName}`,
      ciphertext: payloadBuffer.toString('base64'),
      metadata: {
        keyId: `${this.config.vaultUrl}/keys/${this.config.keyName}`,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        provider: 'azure-keyvault',
        tenantId: effectiveTenant,
      },
    };
  }

  async decryptSecret(payload: EncryptedSecretPayload): Promise<Buffer> {
    return Buffer.from(payload.ciphertext, 'base64');
  }

  async getSecretValue(secretName: string, _tenantId?: string): Promise<string> {
    return `azure-keyvault-secret-value-for-${secretName}`;
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}
