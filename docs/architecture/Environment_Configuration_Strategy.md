# SentinelAI: Environment Configuration Strategy

**Enterprise Configuration Governance, Hierarchy, Validation & Security Specification**

---

| Metadata Field              | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Document Version**        | `1.0.0-APPROVED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Document Classification** | Enterprise Technical Specification / Configuration Architecture                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Target Audience**         | Enterprise Architects, DevOps Engineers, Security Engineers, Lead Software Engineers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Author**                  | Senior Software Architect & Principal Engineer, SentinelAI                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Parent Baselines**        | • [Software Requirements Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/requirements/Software_Requirements_Specification.md)<br>• [ADR-0006 (Multi-Tenant Strategy)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0006-Multi-Tenant-Strategy.md)<br>• [ADR-0011 (Security Architecture)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0011-Security-Architecture-Principles.md)<br>• [ADR-0017 (Configuration Management)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0017-Configuration-Management.md) |
| **Status**                  | Approved Baseline                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Effective Date**          | August 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

---

## 1. Executive Overview & Purpose

The **Environment Configuration Strategy** defines the formal architecture for managing environment parameters, secrets, dynamic operational guardrails, and feature flags across the **SentinelAI** platform.

Configuration management in a high-throughput, multi-tenant cybersecurity system carries critical operational and security risks. An invalid configuration could cause stream processing downtime, false negative threat omissions, or security boundary breaches. This specification establishes a deterministic 5-tier environment hierarchy, strict startup validation schema design, dynamic hot-reload policies, zero-trust secret isolation, and tenant-scoped configuration boundaries in compliance with **`ADR-0006`**, **`ADR-0011`**, and **`ADR-0017`**.

---

## 2. Environment Hierarchy

SentinelAI enforces five discrete environment tiers to isolate development, testing, staging, and production workloads:

```
+-----------------------------------------------------------------------------------+
|                           5-TIER ENVIRONMENT HIERARCHY                            |
+-----------------------------------------------------------------------------------+
|  1. LOCAL        --> Developer workstations, Docker Compose, mock KMS/Auth        |
|  2. DEVELOPMENT  --> Shared Cloud Dev K8s cluster, synthetic telemetry streams    |
|  3. TESTING      --> CI/CD ephemeral test clusters, automated load/chaos suites   |
|  4. STAGING      --> Pre-prod multi-region cluster, production scale, real KMS    |
|  5. PRODUCTION   --> Multi-Tenant SaaS / Private VPC, CMK isolation, mTLS 1.3 ZTA |
+-----------------------------------------------------------------------------------+
```

### 2.1 Tier Specifications

| Environment Tier  | Target Infrastructure         | Data Baseline                    | KMS & Security Context                   | Compliance & SLA Target          |
| :---------------- | :---------------------------- | :------------------------------- | :--------------------------------------- | :------------------------------- |
| **`local`**       | Workstation / Docker Compose  | Synthetic generated logs         | Local mock KMS key; mTLS disabled        | N/A (Local Dev)                  |
| **`development`** | Dev Kubernetes Cluster        | Synthetic streaming feeds        | Dev KMS key; mock IdP tokens             | 99.0% Uptime                     |
| **`testing`**     | CI/CD Ephemeral Pods          | Fixture data & synthetic streams | Ephemeral mock keys; automated teardown  | N/A (Automated CI)               |
| **`staging`**     | Multi-Region Pre-Prod         | Anonymized production-scale data | Production-like KMS CMK; mTLS 1.3 active | 99.9% SLA (Pre-prod)             |
| **`production`**  | Production SaaS / Private VPC | Live enterprise telemetry        | Dedicated Customer CMK; mTLS 1.3 ZTA     | **99.99% SLA** (`SRS-AVAIL-001`) |

---

## 3. Configuration Loading Order & Precedence

To eliminate ambiguity across microservice boot sequences, configuration values are resolved using a strict 5-level precedence hierarchy:

```
+-----------------------------------------------------------------------------------+
|                        CONFIGURATION PRECEDENCE HIERARCHY                         |
+-----------------------------------------------------------------------------------+
|  [LEVEL 1: CLI Flags / Pod Env Vars]     (HIGHEST PRECEDENCE - Overrides all)     |
|         |                                                                         |
|         v                                                                         |
|  [LEVEL 2: Dynamic Centralized K/V Store] (Hot-reloaded operational guardrails)   |
|         |                                                                         |
|         v                                                                         |
|  [LEVEL 3: External Secret Store / KMS]  (KMS Keys, TLS certs, database creds)     |
|         |                                                                         |
|         v                                                                         |
|  [LEVEL 4: Local .env File]               (Development / Local overrides only)    |
|         |                                                                         |
|         v                                                                         |
|  [LEVEL 5: Hardcoded Code Defaults]       (LOWEST PRECEDENCE - Safe fallback only)  |
+-----------------------------------------------------------------------------------+
```

### Resolution Rules

1. **Command Line & Pod Environment Variables (Level 1)** always override all lower levels.
2. **Dynamic Key-Value Store (Level 2)** supplies operational parameters that can be updated at runtime without pod restarts (`ADR-0017`).
3. **External Secret Store (Level 3)** provides sensitive cryptographic keys and credentials injected securely into pod memory.
4. **Local `.env` File (Level 4)** is restricted to `local` and `testing` environments; it is **strictly prohibited** in `production`.
5. **Hardcoded Code Defaults (Level 5)** are limited to safe non-sensitive defaults (e.g., default timeout integers). **Hardcoding production credentials, encryption keys, or tenant IDs is strictly forbidden.**

---

## 4. Environment Variables Inventory

### 4.1 Required Environment Variables (Must be explicitly defined; no defaults in Production)

| Variable Name       | Type    | Allowed Values / Format                                    | Description                                           | Risk if Missing                     |
| :------------------ | :------ | :--------------------------------------------------------- | :---------------------------------------------------- | :---------------------------------- |
| `NODE_ENV`          | Enum    | `local`, `development`, `testing`, `staging`, `production` | Execution mode environment tier.                      | Fatal Startup Failure               |
| `SERVICE_NAME`      | String  | Standard service identifier (e.g., `causal-graph`)         | Microservice identifier for tracing/logging.          | Loss of observability trace context |
| `PORT`              | Integer | `1024` - `65535`                                           | Microservice HTTP/gRPC listening port.                | Port conflict / bind failure        |
| `KAFKA_BROKERS`     | String  | Comma-separated `host:port` pairs                          | Distributed event bus brokers (`ADR-0004`).           | Complete stream ingestion failure   |
| `KMS_PROVIDER`      | Enum    | `local-mock`, `aws-kms`, `azure-keyvault`, `gcp-kms`       | Cryptographic Key Management provider (`ADR-0006`).   | Failure of tenant data encryption   |
| `KMS_MASTER_KEY_ID` | String  | Valid KMS Key ARN / URI                                    | Master Customer-Managed Key ID (`ADR-0006`).          | Cryptographic envelope failure      |
| `MTLS_ENABLED`      | Boolean | `true`, `false`                                            | Enables mTLS 1.3 inter-service security (`ADR-0011`). | Compliance violation in production  |

### 4.2 Optional Environment Variables (Safe defaults applied if omitted)

| Variable Name                 | Type    | Default Value             | Description                                                           |
| :---------------------------- | :------ | :------------------------ | :-------------------------------------------------------------------- |
| `LOG_LEVEL`                   | Enum    | `info` (`debug` in local) | Structured JSON logging threshold (`debug`, `info`, `warn`, `error`). |
| `REDIS_GRAPH_ENDPOINT`        | String  | `localhost:6379`          | In-memory causal graph store endpoint (`ADR-0007`).                   |
| `LAKEHOUSE_ENDPOINT`          | String  | `http://localhost:9000`   | Columnar lakehouse storage S3/MinIO endpoint.                         |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | String  | `http://localhost:4317`   | OpenTelemetry collector gRPC endpoint (`ADR-0013`).                   |
| `MAX_STREAM_RETRIES`          | Integer | `3`                       | Maximum exponential backoff retry attempts for API calls.             |
| `CIRCUIT_BREAKER_TIMEOUT_MS`  | Integer | `5000`                    | Latency threshold triggering circuit breaker trip.                    |

---

## 5. Configuration Validation Strategy

Every SentinelAI microservice must validate its environment configuration on startup using a **strict runtime Zod schema** before opening network ports or subscribing to event streams (`SRS-VR-001`).

```
+-----------------------------------------------------------------------------------+
|                        STARTUP CONFIGURATION VALIDATION FLOW                      |
+-----------------------------------------------------------------------------------+
|  [Microservice Boot Sequence Initiated]                                           |
|         |                                                                         |
|         v                                                                         |
|  [Load Precedence Pipeline: Env Vars + KMS + Dynamic Store]                      |
|         |                                                                         |
|         v                                                                         |
|  [Execute Zod Schema Validation (@sentinelai/config)]                             |
|         |                                                                         |
|         +-----------------------+-----------------------+                         |
|         | (Validation PASS)                             | (Validation FAIL)       |
|         v                                               v                         |
|  [Log Validated Config (Mask Secrets)]         [Emit FATAL Log & Stack Trace]     |
|         |                                               |                         |
|         v                                               v                         |
|  [Complete Service Boot & Listen]              [TERMINATE POD IMMEDIATELY (Exit 1)]|
+-----------------------------------------------------------------------------------+
```

### 5.1 Validation Rules & Guardrails

1. **Strict Type Coercion:** String environment variables representing integers (e.g., `PORT="8080"`) must be coerced and validated as positive integers within allowed ranges (`1024-65535`).
2. **Production Security Guardrails:** If `NODE_ENV === 'production'`, the schema **fails immediately** if `MTLS_ENABLED === false` or `KMS_PROVIDER === 'local-mock'`.
3. **Secret Masking:** In-memory configuration objects mask sensitive key strings (e.g., `KMS_MASTER_KEY_ID: "arn:aws:kms:***-MASKED"`) prior to emitting operational startup logs.

---

## 6. Dynamic Configuration & Hot-Reload Policy

To satisfy **`ADR-0017`**, configurations are strictly separated into **Static Bootstrap Parameters** and **Dynamic Operational Guardrails**:

```
+------------------------------------------------------------------------------------+
|                   STATIC BOOTSTRAP VS. DYNAMIC HOT-RELOAD                          |
+----------------------------------------------------+-------------------------------+
| Static Bootstrap Parameters (Requires Pod Restart) | Dynamic Operational Guardrails|
|                                                    | (Hot-Reloaded Without Restart)|
+----------------------------------------------------+-------------------------------+
| • `NODE_ENV` / `SERVICE_NAME`                      | • Asset Criticality Tags      |
| • `PORT` listening bindings                        | • AI Confidence Thresholds    |
| • `KAFKA_BROKERS` connection strings               | • Automation Stage Modes      |
| • TLS X.509 Certificate File Paths                 | • Suppressed Anomaly Rules    |
+----------------------------------------------------+-------------------------------+
```

### Hot-Reload Execution Protocol

1. SecOps Architect modifies operational guardrails via the Admin API (`UC-010`).
2. Centralized Config Engine validates new parameters against the Zod schema (`SRS-VR-003`).
3. Validated changes publish a real-time `config.updated.v1` event to subscribing microservice pods (`ADR-0017`).
4. Microservice pods reload in-memory policy rules atomically without dropping active connection streams.
5. Invalid dynamic updates trigger an immediate atomic rollback to the prior valid configuration state (`SRS-EH-001`).

---

## 7. Multi-Tenant Configuration Boundaries

Customer tenant configurations must remain cryptographically and logically isolated (`ADR-0006`):

```
+-----------------------------------------------------------------------------------+
|                     MULTI-TENANT CONFIGURATION BOUNDARIES                         |
+-----------------------------------------------------------------------------------+
|  [GLOBAL SYSTEM CONFIG]        --> Shared across all tenant worker pods           |
|  (Ports, Event Bus Brokers,       (Read-only for customer operations)             |
|   Telemetry Endpoints)                                                            |
|                                                                                   |
|  [TENANT SCOPED CONFIG]        --> Cryptographically isolated per Tenant ID       |
|  (Customer KMS Key ARNs,          (Stored encrypted with tenant envelope key)     |
|   Custom Asset Criticality Tags,                                                  |
|   Regional Pod Pinning)                                                           |
+-----------------------------------------------------------------------------------+
```

- **Global System Config:** Governs cluster infrastructure and system performance bounds. Managed exclusively by System Administrators.
- **Tenant-Scoped Config:** Governs customer-specific encryption keys, asset criticality tags, and compliance regional boundaries. Stored encrypted under the customer's CMK (`ADR-0006`). Cross-tenant modification is physically impossible.

---

## 8. Configuration Loading Sequence (ASCII Diagram)

```
+---------------------------------------------------------------------------------------------------+
|                               CONFIGURATION LOADING SEQUENCE DIAGRAM                              |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  Pod OS           Secret Store         Config Package         Zod Validator       Service Runtime |
|    |                   |                     |                      |                    |        |
|    |-- 1. Read Env --->|                     |                      |                    |        |
|    |                   |-- 2. Inject Keys -->|                      |                    |        |
|    |                   |                     |-- 3. Parse Config -->|                    |        |
|    |                   |                     |                      |-- 4. Validate ---->|        |
|    |                   |                     |                      |    (Check Schema)  |        |
|    |                   |                     |                      |<-- 5. Validated ---|        |
|    |                   |                     |                      |                    |        |
|    |                   |                     |<-- 6. Return Config -+                    |        |
|    |                   |                     |                                           |        |
|    |                   |                     |------------------ 7. Initialize Service ->|        |
|    |                   |                     |                                           |        |
+---------------------------------------------------------------------------------------------------+
```

---

## 9. Document Sign-Off

This Environment Configuration Strategy constitutes the authoritative baseline for all environment configurations, secret handling, and dynamic guardrail implementations across SentinelAI.

```
+-----------------------------------------------------------------------------------+
|                       CONFIGURATION STRATEGY SIGN-OFF                             |
+-------------------+------------------------------------+--------------------------+
| Role              | Name / Title                       | Status                   |
+-------------------+------------------------------------+--------------------------+
| Architecture      | Senior Software Architect          | APPROVED - Baseline v1.0 |
| DevOps / Infra    | Principal Infrastructure Engineer  | APPROVED - Baseline v1.0 |
| Security          | Lead Security Architect            | APPROVED - Baseline v1.0 |
| Engineering       | VP of Software Engineering         | APPROVED - Baseline v1.0 |
+-------------------+------------------------------------+--------------------------+
```

---

_End of Environment Configuration Strategy – SentinelAI_
