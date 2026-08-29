# ADR-0013: Enterprise Telemetry & Distributed Observability Strategy

## Status
`ACCEPTED`

## Context
SentinelAI operates high-velocity stream pipelines across microservices processing over 100,000 EPS. Debugging ingestion latency, tracing graph correlation hops, and monitoring AI inference times require unified distributed observability.

## Problem Statement
How should SentinelAI capture, correlate, and visualize internal platform metrics, application traces, operational logs, and audit trails?

## Considered Options
1. **Option A: Fragmented Logging Libraries** - Ad-hoc log files written to local pod disk.
2. **Option B: OpenTelemetry Standard Substrate** - Vendor-neutral OpenTelemetry instrumentation for distributed tracing, metrics, and structured JSON logging across all microservices.
3. **Option C: Proprietary APM Vendor Agent Lock-In** - Embedding proprietary vendor APM agents directly into application containers.

## Decision
We decide to adopt **Option B: OpenTelemetry Standard Substrate**.
* **Metrics:** Prometheus-compatible metrics endpoint exposed by every service (`MON-001`).
* **Tracing:** OpenTelemetry distributed context propagation across gRPC and event stream headers to trace a log event from ingestion to story synthesis.
* **Structured Logging:** Structured JSON logging emitting global `correlation_id`, `tenant_id`, `trace_id`, and `span_id`.

## Rationale
* OpenTelemetry provides vendor-neutral instrumentation, preventing lock-in to commercial APM providers.
* Distributed tracing allows instant identification of performance bottlenecks (e.g., pinpointing whether latency occurred in stream parsing or graph memory insertion).

## Consequences
* **Positive:** Complete distributed tracing, instant bottleneck discovery, vendor-neutral APM integration.
* **Negative:** Minor CPU and network overhead for trace context propagation.

## Trade-offs
Trace sampling overhead (~2% CPU) accepted to gain complete system observability and diagnostic velocity.

## Risks
High trace volume during 100,000 EPS log bursts. Mitigated by dynamic head/tail trace sampling policies.

## Future Reconsideration Conditions
Reconsider if eBPF kernel-level tracing eliminates the need for user-space application instrumentation libraries.
