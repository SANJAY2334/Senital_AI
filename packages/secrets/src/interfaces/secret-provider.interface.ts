export interface SecretMetadata {
  keyId: string;
  version: string;
  createdAt: string;
  provider: 'local-mock' | 'aws-kms' | 'azure-keyvault' | 'gcp-kms';
  tenantId?: string;
}

export interface EncryptedSecretPayload {
  keyId: string;
  ciphertext: string; // Base64
  iv?: string; // Base64
  authTag?: string; // Base64
  metadata: SecretMetadata;
}

export interface ISecretProvider {
  readonly providerName: string;

  /**
   * Encrypts plaintext buffer or string into an envelope encrypted secret payload.
   */
  encryptSecret(plaintext: string | Buffer, tenantId?: string): Promise<EncryptedSecretPayload>;

  /**
   * Decrypts an envelope encrypted payload back into plaintext buffer.
   */
  decryptSecret(payload: EncryptedSecretPayload): Promise<Buffer>;

  /**
   * Fetches secret string by key name from cloud/local vault.
   */
  getSecretValue(secretName: string, tenantId?: string): Promise<string>;

  /**
   * Health check verifying connectivity to the KMS / Secret Manager.
   */
  healthCheck(): Promise<boolean>;
}
