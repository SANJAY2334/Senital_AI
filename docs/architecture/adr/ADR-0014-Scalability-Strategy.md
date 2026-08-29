# ADR-0014: Elastic Ingestion & Processing Scalability Strategy

## Status
`ACCEPTED`

## Context
Enterprise security telemetry volume is highly variable. During normal operations, a customer environment might generate 20,000 EPS. During a widespread active security incident (e.g., ransomware outbreak), log volume can spike 10x to 200,000+ EPS within minutes.

## Problem Statement
How should the platform scale its ingestion, schematization, graph correlation, and AI triage modules to absorb massive data bursts without dropping telemetry or exceeding latency SLA bounds?

## Considered Options
1. **Option A: Static Over-Provisioned Infrastructure** - Maintaining peak-capacity hardware nodes continuously.
2. **Option B: Horizontal Pod Auto-Scaling (HPA) with Partition Rebalancing** - Stateless worker microservices scaling dynamically based on queue lag and CPU/memory metrics, supported by partitioned event buses.
3. **Option C: Vertical Pod Auto-Scaling (VPA)** - Dynamically increasing CPU/RAM allocation on single master instances.

## Decision
We decide to adopt **Option B: Horizontal Pod Auto-Scaling (HPA) with Partition Rebalancing**.
* **Stateless Microservices:** Ingestion collectors, OCSF parsers, and AI triage workers operate completely stateless, enabling rapid horizontal pod creation.
* **Partitioning Strategy:** Event bus partitions scale dynamically by Tenant ID and Entity Hash.
* **Reactive Scaling Rules:** HPA triggers pod scaling based on streaming consumer lag (messages unread) rather than basic CPU utilization alone.

## Rationale
* Elastic horizontal scaling optimizes cloud infrastructure costs during normal operating periods while guaranteeing capacity during major security incidents.
* Consumer-lag scaling ensures pod scaling begins *before* processing bottlenecks breach the 60-second MTTD deadline (`SRS-NFR-001`).

## Consequences
* **Positive:** Cost-efficient resource utilization, elastic burst absorption, guaranteed MTTD SLA.
* **Negative:** Pod startup initialization latency (~10-15 seconds).

## Trade-offs
Warm-pool pod buffering overhead accepted to mitigate cold-start scaling delays during sudden log spikes.

## Risks
Resource exhaustion in cloud region limits during extreme global scaling. Mitigated by multi-zone cluster provisioning and pod priority classes.

## Future Reconsideration Conditions
Reconsider if serverless container execution engines offer instant sub-second cold-start scaling without warm-pool buffering.
