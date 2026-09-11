# ADR-0008: Dynamic Temporal Causal Graph Data Modeling Strategy

## Status

`ACCEPTED`

## Context

Traditional SIEM tools evaluate alerts as isolated text events. SentinelAI's primary core differentiator is transforming multi-source security alerts into a **Dynamic Temporal Causal Graph** (`PVD Section 10`). The system must link entity nodes (`Host`, `User`, `IP`, `Process`, `File`, `OAuth Token`) across rolling time windows.

## Problem Statement

How should the platform model and query temporal attack graphs to ensure sub-second graph updating and intuitive threat path visualization?

## Considered Options

1. **Option A: Relational SQL Foreign Key Joins** - Modeling graph relationships using standard SQL join tables.
2. **Option B: Property Graph Model with Temporal Indexing** - Directed property graph model where nodes represent infrastructure entities and edges represent time-windowed OCSF security events.
3. **Option C: Triplestore RDF Graph Model** - Semantic web RDF triples with SPARQL querying.

## Decision

We decide to adopt **Option B: Property Graph Model with Temporal Indexing**.

- **Nodes:** Represent core infrastructure entities (`Host`, `User`, `IP`, `Process`, `Service Account`).
- **Edges:** Represent directed OCSF security events (`Authenticated_To`, `Spawned_Process`, `Opened_Network_Connection`, `Modified_Registry`).
- **Temporal Attributes:** Every edge carries `start_time`, `end_time`, `sequence_id`, and `ocsf_event_id`.

## Rationale

- Property graph traversal allows constant-time entity hop lookups (e.g., finding lateral movement paths from User A to Host B to IP C) without expensive SQL joins.
- Temporal indexing allows instantaneous slicing of attack graphs across specific investigation time windows (e.g., "Show graph state 10 minutes prior to ransomware detection").

## Consequences

- **Positive:** Sub-second multi-hop attack traversal, visual attack chain reconstruction, intuitive analyst exploration (`UC-007`).
- **Negative:** Graph memory growth during large-scale network scan events.

## Trade-offs

Memory consumption overhead accepted; graph pruning algorithms will automatically archive inactive graph clusters past rolling time windows.

## Risks

Graph combinatorial explosion during port-scan attacks. Mitigated by aggregate node representation for high-frequency scan events.

## Future Reconsideration Conditions

Reconsider if specialized graph neural network (GNN) hardware accelerators alter graph memory representation formats.
