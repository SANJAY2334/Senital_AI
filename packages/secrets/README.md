# @sentinelai/secrets

**Enterprise Cloud-Agnostic Secrets Management & Customer KMS Envelope Encryption Package**

---

## 1. Executive Summary

The `@sentinelai/secrets` library provides a cloud-agnostic abstraction layer for managing tenant Customer-Managed Keys (CMK), envelope encryption, and secret rotation across **AWS KMS**, **Azure Key Vault**, **GCP KMS**, and local development mock vaults.

This package satisfies **`ADR-0006 (Multi-Tenant CMK Isolation)`** and **`ADR-0011 (Zero-Trust Security Architecture)`**.

---

## 2. Architecture & Design Principles

```
+-----------------------------------------------------------------------------------+
|                        SECRETS MANAGEMENT ARCHITECTURE                            |
+-----------------------------------------------------------------------------------+
|  [Microservice Application Layer]                                                 |
|         |                                                                         |
|         v                                                                         |
|  [SecretResolver]  --> Instantiates target provider via KMS_PROVIDER env var      |
|         |                                                                         |
|         +-----------------+-------------------+-------------------+               |
|         |                 |                   |                   |               |
|         v                 v                   v                   v               |
|  [LocalMockProvider] [AwsKmsProvider] [AzureVaultProvider] [GcpKmsProvider]       |
+-----------------------------------------------------------------------------------+
```

1. **Dependency Inversion Principle:** Application code consumes the `ISecretProvider` interface rather than vendor-specific SDK classes.
2. **Cloud Agnosticism:** Switching between local development, AWS, Azure, or GCP requires changing only the `KMS_PROVIDER` environment variable.
3. **Envelope Encryption:** Customer data is encrypted locally using dynamic data encryption keys (DEK), which are in turn encrypted under the Customer Master Key (CMK) (`ADR-0006`).
4. **Secret Masking:** In-memory configuration logging automatically sanitizes sensitive values using `maskSecret()`.

---

## 3. Supported Providers

| Provider Identifier | Provider Class | Target Environment | Key Features |
| :--- | :--- | :--- | :--- |
| `local-mock` | `LocalMockSecretProvider` | `local`, `testing` | In-memory AES-256-GCM encryption with default dev keys. |
| `aws-kms` | `AwsKmsSecretProvider` | AWS Cloud VPC / EKS | AWS KMS `GenerateDataKey` & `Decrypt` envelope integration. |
| `azure-keyvault` | `AzureKeyVaultSecretProvider` | Azure Cloud / AKS | Azure Key Vault envelope encryption integration. |
| `gcp-kms` | `GcpKmsSecretProvider` | GCP / GKE | GCP Cloud KMS key ring & crypto key integration. |

---

## 4. Usage Example

```typescript
import { SecretResolver, maskSecret, KeyRotationManager } from '@sentinelai/secrets';

// 1. Resolve active provider based on environment configuration
const resolver = new SecretResolver(); // Reads process.env.KMS_PROVIDER
const secretProvider = resolver.getProvider();

// 2. Encrypt tenant-sensitive payload
const envelope = await secretProvider.encryptSecret('sensitive-customer-log-data', 'tenant-acme-corp');
console.log('Encrypted Key ID:', envelope.keyId);

// 3. Decrypt tenant payload
const decryptedBuffer = await secretProvider.decryptSecret(envelope);
console.log('Decrypted Payload:', decryptedBuffer.toString('utf-8'));

// 4. Secret Masking Utility
const rawKey = 'arn:aws:kms:us-east-1:123456789012:key/550e8400-e29b-41d4-a716-446655440000';
console.log('Log Safe Key:', maskSecret(rawKey)); // "arn:***-MASKED"
```

---

## 5. Testing

Run unit tests via Jest:
```bash
npm run test --filter=@sentinelai/secrets
```
