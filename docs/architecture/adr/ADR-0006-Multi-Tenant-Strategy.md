# ADR-0006: Multi-Tenant Isolation & Cryptographic Sovereignty

## Status

`ACCEPTED`

## Context

SentinelAI serves enterprise customers operating in highly regulated sectors (Financial Services, Healthcare, Government) under strict regulatory mandates (GDPR, HIPAA, SOC 2, FedRAMP). Multi-tenant SaaS deployments must guarantee zero cross-tenant data leakage (`R-005`, `NFR-SEC-03`).

## Problem Statement

What multi-tenancy and data isolation strategy should SentinelAI enforce to guarantee tenant data privacy, data sovereignty, and prevention of cross-tenant data leaks?

## Considered Options

1. **Option A: Soft Multi-Tenancy (Row-Level Tenant ID Column)** - Single shared database with `tenant_id` filtering in application queries.
2. **Option B: Hard Multi-Tenancy (Isolated Single-Tenant Infrastructure)** - Complete physically separate cloud deployments per customer.
3. **Option C: Hybrid Cryptographic Multi-Tenancy (Pooled Compute + Cryptographic Storage Isolation)** - Pooled auto-scaling microservices with mandatory tenant envelope encryption using Customer-Managed Keys (CMK) and tenant-scoped memory boundaries.

## Decision

We decide to adopt **Option C: Hybrid Cryptographic Multi-Tenancy**.

- **Storage Isolation:** Every customer tenant receives an isolated cryptographic envelope encrypted using distinct Customer-Managed Encryption Keys (CMK) via cloud KMS.
- **Compute Isolation:** Inter-service requests carry cryptographically signed Tenant Context tokens. Microservice memory spaces enforce strict tenant boundary checks.
- **Data Sovereignty:** Tenant deployment pods are pinned to designated geographic regions (e.g., EU-only pods for GDPR compliance).

## Rationale

- Envelope encryption ensures that even if underlying storage is compromised, raw customer logs remain unreadable across tenant boundaries.
- Pooled elastic compute preserves platform SaaS cost economics while meeting enterprise security compliance mandates.

## Consequences

- **Positive:** Cryptographic data isolation, GDPR data residency compliance, protection against SQL/query injection leaks.
- **Negative:** Key management complexity and minor cryptographic overhead on storage I/O.

## Trade-offs

KMS latency and key management overhead accepted to achieve enterprise security approval and zero tenant data leakage guarantees.

## Risks

KMS availability outage preventing log decryption. Mitigated by secure local key caching with strict TTL enforcement.

## Future Reconsideration Conditions

Reconsider if specific government/defense contracts mandate physically air-gapped single-tenant dedicated deployments.
