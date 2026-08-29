import {
  LocalMockSecretProvider,
  AwsKmsSecretProvider,
  AzureKeyVaultSecretProvider,
  GcpKmsSecretProvider,
  SecretResolver,
  KeyRotationManager,
  maskSecret,
  maskConfigObject,
} from '../src';

describe('@sentinelai/secrets Unit Test Suite', () => {
  describe('1. LocalMockSecretProvider', () => {
    const provider = new LocalMockSecretProvider();

    it('should encrypt and decrypt a string payload successfully', async () => {
      const plaintext = 'sensitive-cybersecurity-telemetry-payload';
      const tenantId = 'tenant-acme';

      const envelope = await provider.encryptSecret(plaintext, tenantId);

      expect(envelope.keyId).toContain('mock-cmk-tenant-acme');
      expect(envelope.ciphertext).toBeDefined();
      expect(envelope.iv).toBeDefined();
      expect(envelope.authTag).toBeDefined();
      expect(envelope.metadata.provider).toBe('local-mock');

      const decrypted = await provider.decryptSecret(envelope);
      expect(decrypted.toString('utf-8')).toBe(plaintext);
    });

    it('should return secret value from local mock vault', async () => {
      const secretValue = await provider.getSecretValue('KAFKA_CLIENT_SECRET');
      expect(secretValue).toBe('local-kafka-dev-secret-key-12345');
    });

    it('should report health check as true', async () => {
      const healthy = await provider.healthCheck();
      expect(healthy).toBe(true);
    });
  });

  describe('2. Provider Abstractions (AWS, Azure, GCP)', () => {
    it('should instantiate AWS KMS provider abstraction without cloud SDK dependencies', async () => {
      const awsProvider = new AwsKmsSecretProvider({
        region: 'us-east-1',
        kmsKeyArn: 'arn:aws:kms:us-east-1:123456789012:key/test-key',
      });
      expect(awsProvider.providerName).toBe('aws-kms');

      const envelope = await awsProvider.encryptSecret('aws-payload', 'tenant-aws');
      expect(envelope.keyId).toBe('arn:aws:kms:us-east-1:123456789012:key/test-key');
    });

    it('should instantiate Azure Key Vault provider abstraction', async () => {
      const azureProvider = new AzureKeyVaultSecretProvider({
        vaultUrl: 'https://sentinelai-vault.vault.azure.net',
        keyName: 'cmk-test',
      });
      expect(azureProvider.providerName).toBe('azure-keyvault');
    });

    it('should instantiate GCP KMS provider abstraction', async () => {
      const gcpProvider = new GcpKmsSecretProvider({
        projectId: 'sentinelai-gcp',
        locationId: 'global',
        keyRingId: 'ring',
        cryptoKeyId: 'key',
      });
      expect(gcpProvider.providerName).toBe('gcp-kms');
    });
  });

  describe('3. SecretResolver', () => {
    it('should resolve local-mock provider by default', () => {
      const resolver = new SecretResolver('local-mock');
      expect(resolver.getProvider().providerName).toBe('local-mock');
    });

    it('should resolve aws-kms provider when requested', () => {
      const resolver = new SecretResolver('aws-kms');
      expect(resolver.getProvider().providerName).toBe('aws-kms');
    });
  });

  describe('4. KeyRotationManager', () => {
    const provider = new LocalMockSecretProvider();
    const rotationManager = new KeyRotationManager(provider);

    it('should calculate next rotation schedule for tenant', async () => {
      const schedule = await rotationManager.getRotationSchedule('tenant-beta');
      expect(schedule.tenantId).toBe('tenant-beta');
      expect(schedule.rotationIntervalDays).toBe(90);
    });

    it('should accurately detect when rotation is required based on key age', () => {
      const now = new Date().toISOString();
      const oldDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(); // 100 days old

      expect(rotationManager.isRotationRequired('tenant-beta', now, 90)).toBe(false);
      expect(rotationManager.isRotationRequired('tenant-beta', oldDate, 90)).toBe(true);
    });
  });

  describe('5. Masking Utilities', () => {
    it('should mask sensitive string values correctly', () => {
      const masked = maskSecret('secret-master-key-value-123456');
      expect(masked).toBe('secr***-MASKED');
    });

    it('should mask config objects containing sensitive keys', () => {
      const rawConfig = {
        PORT: 8080,
        KMS_MASTER_KEY_ID: 'arn:aws:kms:us-east-1:123456789012:key/secret',
        LOG_LEVEL: 'info',
      };
      const maskedConfig = maskConfigObject(rawConfig);
      expect(maskedConfig.PORT).toBe(8080);
      expect(maskedConfig.LOG_LEVEL).toBe('info');
      expect(maskedConfig.KMS_MASTER_KEY_ID).toBe('arn:***-MASKED');
    });
  });
});
