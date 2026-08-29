# ADR-0015: High Availability & Multi-Region Disaster Recovery Strategy

## Status
`ACCEPTED`

## Context
As a mission-critical enterprise security platform, SentinelAI must maintain `99.99% operational availability` (`SRS-NFR-AVAIL-01`). In the event of a catastrophic cloud region failure, the platform must resume processing with a Recovery Time Objective (RTO) of `< 1 hour` and a Recovery Point Objective (RPO) of `< 5 seconds` (`SRS-BAK-002`).

## Problem Statement
What architecture strategy should SentinelAI enforce for high availability (HA) and disaster recovery (DR) across primary and secondary infrastructure regions?

## Considered Options
1. **Option A: Cold Standby Disaster Recovery** - Backup region infrastructure provisioned from templates upon failure.
2. **Option B: Warm Standby (Active-Passive) Multi-Region Architecture** - Primary active cluster continuously replicating streaming state to a secondary standby region.
3. **Option C: Active-Active Multi-Region Mesh Architecture** - Simultaneous active processing in two cloud regions with dynamic multi-region traffic routing.

## Decision
We decide to adopt **Option B: Warm Standby (Active-Passive) Multi-Region Architecture**.
* **Active Region:** Handles live telemetry ingestion, graph correlation, AI triage, and analyst workspace queries.
* **Passive Region:** Provisioned with baseline warm infrastructure pods; continuously receives cross-region async replication of log stream offsets, policy configurations, and graph snapshots.
* **Failover Mechanism:** Automated health checks trigger DNS failover to the secondary region if the primary region experiences unrecoverable outages (>3 minutes).

## Rationale
* Guarantees RPO < 5 seconds and RTO < 1 hour without the extreme data synchronization complexity of multi-region active-active graph correlation.
* Maintains high availability SLA (99.99%) while preserving predictable cloud operating costs.

## Consequences
* **Positive:** High operational availability, guaranteed RPO/RTO bounds, protection against total cloud region failure.
* **Negative:** Multi-region data egress replication costs.

## Trade-offs
Cross-region egress costs accepted to satisfy enterprise business continuity mandates.

## Risks
Split-brain scenario during transient inter-region network splits. Mitigated by quorum-based lease locking in cloud object stores.

## Future Reconsideration Conditions
Reconsider active-active multi-region deployment if global latency demands sub-second analyst response across all continents simultaneously.
