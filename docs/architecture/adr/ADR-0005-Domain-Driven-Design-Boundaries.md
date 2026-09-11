# ADR-0005: Domain-Driven Design (DDD) Bounded Contexts

## Status

`ACCEPTED`

## Context

SentinelAI handles complex enterprise security domains (log ingestion, OCSF schemas, temporal graphing, AI triage, XAI lineage, remediation guardrails, analytics). Without clean domain boundaries, software modules risk becoming tightly coupled, making maintenance and evolution difficult.

## Problem Statement

How should domain logic and entity boundaries be partitioned across the SentinelAI platform using Domain-Driven Design (DDD)?

## Considered Options

1. **Option A: Single Shared Data Model** - Unified database schema and enterprise data objects shared across all components.
2. **Option B: Technical Layer Partitioning** - Partitioning code strictly by technical layers (Controllers, Services, Repositories).
3. **Option C: Domain-Driven Bounded Contexts** - Decomposing the system into explicit, self-contained DDD Bounded Contexts with clear Ubiquitous Vocabularies and Context Maps.

## Decision

We decide to adopt **Option C: Domain-Driven Bounded Contexts**. The system is partitioned into six core Bounded Contexts:

1. **Telemetry & Schematization Context:** Manages log streams, vendor parsers, and OCSF event aggregates.
2. **Temporal Causal Graph Context:** Manages entity nodes, directional event edges, and temporal graph aggregates.
3. **AI Threat Triage Context:** Manages threat severity scoring, noise suppression rules, and incident story aggregates.
4. **Explainable AI (XAI) Context:** Manages narrative breadcrumb lineage and raw evidence links.
5. **Policy & Remediation Context:** Manages asset criticality tags, automation stage rules, and execution guardrails.
6. **Audit & Governance Context:** Manages immutable audit logs, compliance packages, and executive metrics.

## Rationale

- Bounded Contexts prevent model contamination (e.g., an `Event` object in Telemetry Ingestion contains distinct domain behavior from an `Event Edge` in Causal Graphing).
- Enables specialized software teams to own independent domain boundaries without breaking adjacent modules.

## Consequences

- **Positive:** Clean modular decoupling, independent data models, high maintainability (`MAIN-001`).
- **Negative:** Requires explicit anti-corruption layers (ACLs) and mapping objects between bounded context boundaries.

## Trade-offs

Mapping translation overhead between contexts accepted to maintain domain isolation and prevent architectural decay.

## Risks

Developers bypassing bounded context boundaries for quick integration. Mitigated by architecture code linters enforcing import rules across bounded context packages.

## Future Reconsideration Conditions

Reconsider if new security domains (e.g., Autonomous Deception Network) require introducing new top-level Bounded Contexts.
