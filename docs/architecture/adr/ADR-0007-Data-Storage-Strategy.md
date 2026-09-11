# ADR-0007: Polyglot Data Persistence Architecture

## Status

`ACCEPTED`

## Context

SentinelAI manages diverse data workloads with vastly different access patterns:

- Streaming high-velocity log events (100,000+ EPS).
- Low-latency in-memory temporal causal graph queries.
- Transactional policy configurations, user accounts, and guardrails.
- Long-term analytical data lake storage for raw logs and audit trails (petabyte scale).

## Problem Statement

What storage persistence strategy should SentinelAI adopt to satisfy these conflicting access patterns without compromising performance or storage unit economics?

## Considered Options

1. **Option A: Monolithic Relational Database System** - Storing all logs, graphs, configs, and audit trails in a single RDBMS.
2. **Option B: Single NoSQL Document Database** - Storing all system data in a document store.
3. **Option C: Polyglot Persistence Architecture** - Utilizing specialized storage engines matched strictly to domain access patterns:
   - **Columnar Data Lake (Apache Parquet / Iceberg):** High-compression, low-cost long-term telemetry storage.
   - **In-Memory Graph Memory / Key-Value Cache:** Sub-second temporal causal graph updates.
   - **Transactional Relational / Document Store:** Policies, user accounts, RBAC, and incident story state.
   - **Immutable Append-Only Audit Store:** Cryptographically chained audit logs.

## Decision

We decide to adopt **Option C: Polyglot Persistence Architecture**. Data storage engines are selected based on the specialized requirements of each DDD Bounded Context.

## Rationale

- Columnar data lake storage decouples storage from compute, achieving a 50% TCO reduction over legacy SIEM volume storage (`BO-4`).
- In-memory graph memory ensures sub-second entity node linking during active attack graph assembly (`SRS-FR-007`).
- Transactional stores preserve ACID guarantees for policy guardrail edits and user authorization.

## Consequences

- **Positive:** Optimal performance per domain workload, predictable storage unit economics, petabyte scale.
- **Negative:** Managing operational lifecycle across multiple specialized storage subsystems.

## Trade-offs

Operational multi-store management overhead accepted to meet performance (<60s MTTD) and TCO (50% savings) targets.

## Risks

Event eventual consistency across polyglot stores. Mitigated by using event offsets as the single source of truth for state synchronization.

## Future Reconsideration Conditions

Reconsider if unified lakehouse engines achieve sub-millisecond in-memory graph latency directly on open table formats.
