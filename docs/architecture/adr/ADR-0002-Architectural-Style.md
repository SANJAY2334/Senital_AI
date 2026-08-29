# ADR-0002: Core Architectural Style (Decoupled Reactive Microservices)

## Status
`ACCEPTED`

## Context
SentinelAI must process multi-cloud and endpoint telemetry at extreme scale (>100,000 Events Per Second per pod), construct real-time temporal causal graphs, perform AI triage, and execute policy-governed remediation within strict latency bounds (MTTD < 60 seconds, AI latency < 5 seconds). 

## Problem Statement
What top-level architectural style should govern the SentinelAI core platform to ensure independent scalability, fault isolation, and sub-second stream processing performance?

## Considered Options
1. **Option A: Monolithic Core Architecture** - Single unified codebase handling ingestion, graphing, AI triage, and dashboard serving.
2. **Option B: Decoupled Reactive Microservices Substrate** - Event-driven microservices communicating asynchronously over high-throughput event buses and synchronous binary interfaces.
3. **Option C: Serverless Function Chain Architecture** - Pure cloud-native FaaS execution for every log event.

## Decision
We decide to adopt **Option B: Decoupled Reactive Microservices Substrate**. The system will be decomposed into domain-aligned, stateless microservices operating under reactive stream principles (non-blocking I/O, backpressure control, dynamic horizontal auto-scaling).

## Rationale
* Microservices allow independent scaling of high-throughput stream ingestion from CPU-bound AI triage and memory-intensive graph correlation.
* Fault isolation ensures ingestion processing continues uninterrupted even if an individual AI triage worker pod encounters errors.

## Consequences
* **Positive:** High operational elasticity, isolated failure domains, independent deployment lifecycles.
* **Negative:** Increased distributed system complexity, monitoring overhead, and network hop latency.

## Trade-offs
System operational complexity is accepted to guarantee high-throughput processing and continuous uptime SLAs (99.99%).

## Risks
Network latency between microservices could impact strict detection deadlines. Mitigated by using high-performance gRPC binary protocols for synchronous service hops.

## Future Reconsideration Conditions
Reconsider if ingestion scale or infrastructure overhead favors edge-side pre-aggregation or dedicated bare-metal streaming engines.
