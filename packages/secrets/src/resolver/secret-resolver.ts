import { ISecretProvider } from '../interfaces/secret-provider.interface';
import { LocalMockSecretProvider } from '../providers/local-mock.provider';
import { AwsKmsSecretProvider } from '../providers/aws-kms.provider';
import { AzureKeyVaultSecretProvider } from '../providers/azure-keyvault.provider';
import { GcpKmsSecretProvider } from '../providers/gcp-kms.provider';

export class SecretResolver {
  private activeProvider: ISecretProvider;

  constructor(providerType?: string) {
    const selectedProvider = providerType || process.env.KMS_PROVIDER || 'local-mock';

    switch (selectedProvider) {
      case 'aws-kms':
        this.activeProvider = new AwsKmsSecretProvider({
          region: process.env.AWS_REGION || 'us-east-1',
          kmsKeyArn: process.env.KMS_MASTER_KEY_ID || 'arn:aws:kms:us-east-1:123456789012:key/mock',
        });
        break;
      case 'azure-keyvault':
        this.activeProvider = new AzureKeyVaultSecretProvider({
          vaultUrl: process.env.AZURE_VAULT_URL || 'https://sentinelai-vault.vault.azure.net',
          keyName: process.env.KMS_MASTER_KEY_ID || 'cmk-master-key',
        });
        break;
      case 'gcp-kms':
        this.activeProvider = new GcpKmsSecretProvider({
          projectId: process.env.GCP_PROJECT_ID || 'sentinelai-prod',
          locationId: process.env.GCP_LOCATION || 'global',
          keyRingId: 'sentinelai-ring',
          cryptoKeyId: process.env.KMS_MASTER_KEY_ID || 'master-key',
        });
        break;
      case 'local-mock':
      default:
        this.activeProvider = new LocalMockSecretProvider();
        break;
    }
  }

  public getProvider(): ISecretProvider {
    return this.activeProvider;
  }
}
