# ADR-0018: API Lifecycle, Schema Evolution & Backward Compatibility

## Status
`ACCEPTED`

## Context
SentinelAI exposes APIs for ingestion webhooks, ITSM integrations (ServiceNow/Jira), external action execution, and executive reporting. As the platform evolves across MVP v1.0, v1.1, and v2.0, API contracts must evolve without breaking existing customer integrations.

## Problem Statement
What API versioning, schema evolution, and deprecation strategy should SentinelAI enforce across all external and internal API surfaces?

## Considered Options
1. **Option A: Unversioned Evolving APIs** - Modifying existing API endpoints directly and expecting consumers to adapt.
2. **Option B: Strict Semantic Versioning (SemVer) with Deprecation Windows** - Explicit URL path versioning (`/api/v1/`, `/api/v2/`) with mandatory backwards compatibility policies and 12-month deprecation grace periods.
3. **Option C: Header-Based Date Versioning** - Versioning APIs via HTTP request headers (e.g., `X-API-Version: 2026-07-31`).

## Decision
We decide to adopt **Option B: Strict Semantic Versioning (SemVer) with Deprecation Windows**.
* **External APIs (REST/JSON):** Explicit URL version prefixes (e.g., `/api/v1/incidents`). Non-breaking additions (new fields) retain the current version; breaking changes trigger a major version increment (`v2`).
* **Internal APIs (gRPC/Proto):** Field numbering evolution following strict Protocol Buffer backward compatibility rules (never renumber fields; use `reserved` for deleted fields).
* **Deprecation Policy:** Major API versions carry a minimum **12-month supported deprecation window** prior to sunsetting.

## Rationale
* Protects enterprise customers from unexpected integration breakage when upgrading SentinelAI releases.
* Proto field numbering rules guarantee internal gRPC services can be upgraded independently without breaking adjacent microservices.

## Consequences
* **Positive:** Guaranteed backward compatibility, predictable integration lifecycle, seamless enterprise customer upgrades.
* **Negative:** Maintaining legacy API version translation adapters during deprecation grace periods.

## Trade-offs
Adapter maintenance overhead accepted to preserve customer trust and integration stability.

## Risks
Accumulation of technical debt across multiple legacy API major versions. Mitigated by strict maximum limit of 2 active major versions concurrently.

## Future Reconsideration Conditions
Reconsider if GraphQL federated schema evolution replaces REST/gRPC interfaces for external customer developer APIs.
