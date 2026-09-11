# ADR-0003: Inter-Service Communication Model (Hybrid gRPC / Event Bus)

## Status

`ACCEPTED`

## Context

SentinelAI microservices require both high-throughput event broadcasting (telemetry streams, graph updates, incident notifications) and low-latency point-to-point queries (XAI breadcrumb lookups, policy guardrail evaluations, Copilot queries).

## Problem Statement

How should internal SentinelAI microservices communicate to balance streaming throughput, low-latency synchronous calls, and strict payload contract enforcement?

## Considered Options

1. **Option A: Pure REST/JSON Web APIs** - HTTP 1.1 REST interfaces for all internal service communications.
2. **Option B: Pure Event-Driven Messaging** - Asynchronous message queues for all inter-service operations.
3. **Option C: Hybrid Model (gRPC Synchronous + Streaming Event Bus)** - Binary gRPC for point-to-point internal IPC and a high-performance event bus for streaming event publish-subscribe workflows.

## Decision

We decide to adopt **Option C: Hybrid Model (gRPC Synchronous + Streaming Event Bus)**.

- **Asynchronous Data Flow:** Telemetry ingestion, OCSF events, graph node updates, and audit trails use event-driven publish-subscribe topics.
- **Synchronous Point-to-Point IPC:** Internal RPC calls (policy evaluation, XAI lineage lookup, graph query) use gRPC over HTTP/2 with Protocol Buffers.

## Rationale

- gRPC provides multiplexed HTTP/2 transport, strict strongly-typed Proto contracts, and binary serialization yielding 5x speedups over REST/JSON.
- Event-driven streaming decouples telemetry producers from analytics consumers, handling backpressure spikes without blocking.

## Consequences

- **Positive:** Sub-millisecond internal RPC latency, strongly typed contracts, resilient stream buffering.
- **Negative:** Requires managing Protocol Buffer schemas and gRPC client connection pooling.

## Trade-offs

Dual communication paradigm complexity accepted to meet both stream volume and low-latency IPC deadlines.

## Risks

Schema mismatch between gRPC service versions. Mitigated by strict Proto backwards compatibility rules and automated CI breaking-change detectors.

## Future Reconsideration Conditions

Reconsider if WebAssembly or shared-memory IPC within unified pods becomes necessary for sub-millisecond edge graph processing.
