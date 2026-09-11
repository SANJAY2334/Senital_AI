# ADR-0004: Event-Driven Streaming Architecture

## Status

`ACCEPTED`

## Context

Enterprise security telemetry arrives in continuous, unpredictable volumes (>100,000 EPS per pod with 10x burst spikes during ransomware incidents). The platform must guarantee zero log loss (`99.999999999% durability`) and sub-second ingestion processing (`NFR-PERF-01`).

## Problem Statement

What messaging and streaming architecture should be used for log ingestion, schematization, and event fan-out across SentinelAI processing modules?

## Considered Options

1. **Option A: Traditional Enterprise Service Bus (ESB / AMQP)** - RabbitMQ/ActiveMQ queue-based architecture.
2. **Option B: Distributed Log Partition Streaming Bus** - Distributed commit-log topic architecture (e.g., Apache Kafka / Apache Pulsar pattern).
3. **Option C: In-Memory Redis Pub/Sub** - Non-persistent memory messaging.

## Decision

We decide to adopt **Option B: Distributed Log Partition Streaming Bus**. Telemetry data streams will be partitioned by Tenant ID and Entity Hash across distributed, multi-replica commit log topics.

## Rationale

- Distributed commit logs provide durable, offset-based message replay, allowing graph engines and AI triage workers to re-process historical telemetry during investigation or recovery.
- High partition concurrency supports horizontal scaling past 100,000 EPS with guaranteed message order per entity hash.

## Consequences

- **Positive:** Guaranteed zero log loss, replayability, high throughput, horizontal partition scaling.
- **Negative:** Operational overhead of partition rebalancing and cluster storage management.

## Trade-offs

Storage footprint overhead accepted to guarantee durability, replayability, and burst buffer capacity.

## Risks

Consumer group lag during massive log volume bursts. Mitigated by auto-scaling consumer worker pods based on streaming lag metrics (`MON-001`).

## Future Reconsideration Conditions

Reconsider if serverless managed streaming abstractions eliminate partition management overhead while preserving throughput guarantees.
