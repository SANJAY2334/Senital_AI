# SentinelAI: CI/CD Pipeline & Branch Protection Architecture
**Automated Quality, Security Scanning & Branch Protection Specification**

---

| Metadata Field | Value |
| :--- | :--- |
| **Document Version** | `1.0.0-APPROVED` |
| **Document Classification** | Enterprise Technical Specification / CI/CD Architecture |
| **Target Audience** | Enterprise Architects, DevOps Engineers, Security Engineers, Lead Software Engineers |
| **Author** | Senior Software Architect & Principal Engineer, SentinelAI |
| **Parent Baselines** | • [Software Requirements Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/requirements/Software_Requirements_Specification.md)<br>• [ADR-0018 (API Versioning & SemVer)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0018-API-Versioning-and-Lifecycle-Strategy.md)<br>• [ADR-0019 (Testing & Quality Philosophy)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0019-Multi-Layered-Automated-Testing-and-Chaos-Engineering.md)<br>• [Engineering Implementation Roadmap (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/implementation/Engineering_Implementation_Roadmap.md) |
| **Status** | Approved Baseline |
| **Effective Date** | August 2026 |

---

## 1. Executive Overview & Purpose

The **Continuous Integration & Continuous Delivery (CI/CD) Pipeline Architecture** defines the automated quality, security, contract verification, and artifact publishing gates for the **SentinelAI** enterprise monorepo.

To satisfy **`ADR-0018`**, **`ADR-0019`**, and **`Roadmap Section 12`**, every pull request submitted to `main` or `develop` must pass through strict, deterministic automated workflows before code can be merged into production.

---

## 2. GitHub Actions Workflows Inventory

### 2.1 Workflow Summary Matrix

| Workflow File | Trigger Events | Primary Responsibilities | Failure Conditions | Mapped ADR / SRS Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **[`.github/workflows/ci.yml`](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/.github/workflows/ci.yml)** | `push` to `main`/`develop`, `pull_request` | ESLint check, Prettier formatting check, Protocol Buffer codegen, strict TypeScript compilation, Jest unit tests with code coverage upload, gRPC contract tests. | Any lint error, formatting mismatch, type error, broken unit test, or breaking gRPC contract modification. | **`ADR-0018`**, **`ADR-0019`**, **`SRS-NFR-SEC-001`** |
| **[`.github/workflows/security.yml`](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/.github/workflows/security.yml)** | `push`, `pull_request`, Nightly Cron (`0 2 * * *`) | PNPM dependency audit (`HIGH`/`CRITICAL` CVE check), Gitleaks static secret scanning across git commit history. | Detection of high/critical CVE dependencies or committed credentials/private keys. | **`ADR-0011`**, **`SRS-NFR-SEC-002`**, **`BR-001`** |
| **[`.github/workflows/docker-build.yml`](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/.github/workflows/docker-build.yml)** | `push` to `main`, git tags (`v*.*.*`) | Multi-stage Docker builds across all 11 microservices (`deploy/docker/Dockerfile.service`), Trivy container image CVE scanning, OCI registry publishing to GHCR. | Docker build error or detection of `HIGH`/`CRITICAL` unpatched vulnerabilities in base images. | **`ADR-0016`**, **`Roadmap Section 12`** |

---

## 3. Workflow Execution Flow (ASCII Diagram)

```
+---------------------------------------------------------------------------------------------------+
|                                 CONTINUOUS INTEGRATION PIPELINE FLOW                               |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|   Developer Push / Pull Request Event                                                             |
|           |                                                                                       |
|           +-------------------------------+-------------------------------+                       |
|           |                               |                               |                       |
|           v                               v                               v                       |
|   [1. Job: lint]                  [2. Job: typecheck]            [Job: sast-secret-scan]          |
|   • ESLint verification           • Proto Codegen                • Gitleaks secret scan           |
|   • Prettier check                • Strict `tsc` check           • Dependency CVE Audit           |
|           |                               |                               |                       |
|           +---------------+---------------+                               |                       |
|                           |                                               |                       |
|                           v                                               v                       |
|                   [3. Job: unit-tests]                           [Security Status: PASS]          |
|                   • Jest test suite                                       |                       |
|                   • Upload Coverage (80%+)                                |                       |
|                           |                                               |                       |
|                           v                                               |                       |
|                   [4. Job: contract-tests]                                |                       |
|                   • gRPC backward compat                                  |                       |
|                           |                                               |                       |
|                           +-----------------------+-----------------------+                       |
|                                                   |                                               |
|                                                   v                                               |
|                                       [ALL CI CHECKS PASSED]                                      |
|                                                   |                                               |
|                                                   v                                               |
|                                   [5. Job: docker-build & publish]                                |
|                                   • Multi-stage Docker build                                      |
|                                   • Trivy Container Scan                                          |
|                                   • Push OCI Image to GHCR                                        |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Artifact Publishing & Versioning Strategy

1. **OCI Container Registry (GHCR):** Docker images built from `main` branch pushes are tagged with git commit SHAs (`ghcr.io/sentinelai/ingestion-collector:a1b2c3d4`). Release tags produce semantic version images (`ghcr.io/sentinelai/ingestion-collector:1.0.0`) in compliance with **`ADR-0018`**.
2. **Code Coverage Artifacts:** HTML code coverage reports generated by `pnpm run test:cov` are archived as zip artifacts (`code-coverage-report`) for 30 days.

---

## 5. Recommended Branch Protection Rules (`main` & `develop`)

To guarantee codebase integrity and prevent unreviewed code from bypassing automated CI checks, the following GitHub Branch Protection rules **must be enforced** on `main` and `develop` branches:

```
+-----------------------------------------------------------------------------------+
|                      RECOMMENDED BRANCH PROTECTION RULES                          |
+-----------------------------------------------------------------------------------+
|  1. Require a Pull Request Before Merging                                         |
|     • Require minimum 2 approving reviews from Senior Engineers               |
|     • Require review from Code Owners (`.github/CODEOWNERS`)                      |
|     • Dismiss stale pull request approvals when new commits are pushed            |
|                                                                                   |
|  2. Require Status Checks to Pass Before Merging                                  |
|     • `Lint & Code Style Verification`                                            |
|     • `Proto Codegen & Strict TypeScript Compilation`                             |
|     • `Unit Tests & Code Coverage`                                                |
|     • `Node.js Dependency Audit (CVE Check)`                                      |
|     • `Secret Scanning & SAST Code Security`                                      |
|                                                                                   |
|  3. Strict Branch Hygiene                                                         |
|     • Require linear commit history (Squash and Merge preferred)                  |
|     • Include Administrator enforce settings (Admins cannot bypass rules)         |
|     • Restrict direct pushes to `main` and `develop` (PR only)                    |
+-----------------------------------------------------------------------------------+
```

---

## 6. Document Sign-Off

This CI/CD Pipeline & Branch Protection Architecture constitutes the authoritative specification for all automated CI workflows, secret scanning, and container registry publishing.

```
+-----------------------------------------------------------------------------------+
|                         CI/CD PIPELINE SIGN-OFF                                   |
+-------------------+------------------------------------+--------------------------+
| Role              | Name / Title                       | Status                   |
+-------------------+------------------------------------+--------------------------+
| Architecture      | Senior Software Architect          | APPROVED - Baseline v1.0 |
| DevOps Lead       | Principal Technical Program Manager| APPROVED - Baseline v1.0 |
| Security Lead     | Lead Security Architect            | APPROVED - Baseline v1.0 |
+-------------------+------------------------------------+--------------------------+
```

---
*End of CI/CD Pipeline & Branch Protection Specification – SentinelAI*
