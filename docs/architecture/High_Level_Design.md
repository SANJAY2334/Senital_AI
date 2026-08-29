# SentinelAI: High-Level Design (HLD)
**Enterprise Distributed System Architecture Specification**

---

| Metadata Field | Value |
| :--- | :--- |
| **Document Version** | `1.0.0-APPROVED` |
| **Document Classification** | Enterprise Technical Baseline / Architectural Design |
| **Target Audience** | Executive Leadership, Principal Architects, Lead Software Engineers, DevOps Engineers, Security Architects |
| **Author** | Chief Enterprise Architect & Principal Distributed Systems Architect, SentinelAI |
| **Parent Baselines** | • [Product Vision Document (v1.1.0-BOARD-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/product/Product_Vision_Document.md)<br>• [Business Requirements Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md)<br>• [System Context & Use Case Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/analysis/System_Context_and_Use_Case_Specification.md)<br>• [Software Requirements Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/requirements/Software_Requirements_Specification.md)<br>• [Architecture Decision Records (ADR-0001 to ADR-0020)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/README.md) |
| **Status** | Approved System Architecture Baseline |
| **Effective Date** | August 2026 |

---

## 1. Executive Summary

The **High-Level Design (HLD)** defines the enterprise-grade distributed system architecture for **SentinelAI**, transforming the baseline requirements from the [Product Vision Document (v1.1.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/product/Product_Vision_Document.md), [Business Requirements Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md), [System Context & Use Case Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/analysis/System_Context_and_Use_Case_Specification.md), [Software Requirements Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/requirements/Software_Requirements_Specification.md), and [Architecture Decision Records (ADR-0001 to ADR-0020)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/README.md) into concrete structural designs.

SentinelAI is architected as an **event-driven, reactive microservices substrate** optimized for high-velocity streaming ingestion (>100,000 Events Per Second per pod), dynamic temporal causal graphing, multi-agent AI threat triage, explainable AI (XAI) evidence lineage, and policy-governed remediation execution.

This document establishes the C4 architecture model (Levels 1–3), Domain-Driven Design (DDD) Context Map, data and event flow architectures, trust boundaries, multi-tenant isolation model, container deployment layout, high availability, disaster recovery, and observability frameworks—while remaining strictly implementation-independent of low-level code, database schemas, or specific API payloads.

---

## 2. Architectural Goals

The SentinelAI high-level architecture is engineered to satisfy six core performance and operational goals:

1. **Sub-Second Streaming & Rapid MTTD:** Achieve sub-second ingestion-to-graph processing latency and an end-to-end Mean Time to Detect (MTTD) of `< 60 seconds` (`BO-1`, `SRS-NFR-001`).
2. **High-Throughput Ingestion Scaling:** Scale horizontally past `> 100,000 Events Per Second (EPS)` per pod with automatic 10x burst absorption during major incident spikes (`SRS-NFR-003`, `ADR-0014`).
3. **Zero Log Loss & High Durability:** Guarantee persistent streaming stream buffering with `99.999999999% data durability` (`SRS-REL-001`, `ADR-0004`).
4. **Explainable AI (XAI) Evidence Lineage:** Ensure 100% of AI-synthesized narrative claims possess deterministic cryptographic links back to raw log lines (`BR-001`, `SRS-FR-014`, `ADR-0010`).
5. **Zero-Trust & Cryptographic Isolation:** Enforce tenant cryptographic data separation using Customer-Managed Keys (CMK) and internal mTLS 1.3 zero-trust communications (`SRS-NFR-006`, `ADR-0006`, `ADR-0011`).
6. **High Availability & Business Continuity:** Deliver `99.99% operational uptime` with warm-standby multi-region disaster recovery (RTO < 1 hour, RPO < 5 seconds) (`SRS-AVAIL-001`, `ADR-0015`).

---

## 3. Architecture Principles (Mapped to ADRs)

The structural architecture strictly adheres to the 20 approved Architecture Decision Records:

| Principle Category | Governing Architectural Principle | Mapped ADR Reference |
| :--- | :--- | :--- |
| **Governance** | Version-controlled MADR repository for all architectural decisions. | [ADR-0001](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0001-Repository-Structure-and-Decision-Process.md) |
| **System Style** | Decoupled reactive microservices with non-blocking I/O and auto-scaling. | [ADR-0002](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0002-Architectural-Style.md) |
| **Communication** | Hybrid model: gRPC over HTTP/2 for synchronous IPC + Event Bus for streaming. | [ADR-0003](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0003-Communication-Model.md) |
| **Streaming** | Distributed partition commit-log streaming bus with replay capability. | [ADR-0004](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0004-Event-Driven-Architecture.md) |
| **Domain Partitioning** | 6 explicit DDD Bounded Contexts with Anti-Corruption Layers. | [ADR-0005](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0005-Domain-Driven-Design-Boundaries.md) |
| **Multi-Tenancy** | Hybrid cryptographic tenant isolation with CMK envelope encryption. | [ADR-0006](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0006-Multi-Tenant-Strategy.md) |
| **Storage Substrate** | Polyglot persistence: Columnar Lakehouse + In-Memory Graph + RDBMS. | [ADR-0007](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0007-Data-Storage-Strategy.md) |
| **Graph Modeling** | Property Graph model with temporal indexing linking entity nodes via event edges. | [ADR-0008](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0008-Graph-Data-Modeling-Strategy.md) |
| **AI Orchestration** | Multi-agent collaborative ensemble coordinated by AI Supervisor Agent. | [ADR-0009](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0009-AI-Orchestration-Strategy.md) |
| **AI Trust** | Deterministic XAI lineage pipeline enforcing raw log breadcrumb validation. | [ADR-0010](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0010-Explainable-AI-Architecture.md) |
| **Security Baseline** | Zero-Trust System Architecture with mTLS 1.3 and least-privilege action scopes. | [ADR-0011](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0011-Security-Architecture-Principles.md) |
| **Access Control** | Enterprise SSO (OIDC/SAML) + RBAC user roles + ABAC asset guardrails. | [ADR-0012](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0012-Authentication-and-Authorization-Strategy.md) |
| **Observability** | OpenTelemetry standard emitting Prometheus metrics, traces, and correlation JSON. | [ADR-0013](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0013-Observability-and-Logging-Strategy.md) |
| **Scalability** | Consumer-lag dynamic Horizontal Pod Auto-Scaling (HPA) with partition queues. | [ADR-0014](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0014-Scalability-Strategy.md) |
| **Disaster Recovery** | Active-Passive Warm Standby multi-region failover (RTO < 1h, RPO < 5s). | [ADR-0015](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0015-Disaster-Recovery-Strategy.md) |
| **Deployment** | Cloud-agnostic OCI containers orchestrated via Kubernetes and OpenTofu. | [ADR-0016](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0016-Cloud-Deployment-Philosophy.md) |
| **Configuration** | Dynamic centralized key-value engine with real-time change subscription. | [ADR-0017](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0017-Configuration-Management.md) |
| **API Versioning** | Semantic Versioning (`/api/v1/`) with 12-month deprecation grace periods. | [ADR-0018](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0018-API-Versioning-Philosophy.md) |
| **Testing Standards** | Multi-layered testing pyramid + automated chaos engineering fault injection. | [ADR-0019](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0019-Testing-Philosophy.md) |
| **Future Evolution** | Open plugin & event extension architecture for post-MVP roadmap horizons. | [ADR-0020](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/ADR-0020-Future-Evolution-Strategy.md) |

---

## 4. System Context Architecture

The high-level system context defines the structural boundaries between external telemetry producers, human operators, third-party action executors, and the SentinelAI platform.

```
+---------------------------------------------------------------------------------------------------+
|                                 SYSTEM CONTEXT ARCHITECTURE MAP                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [EXTERNAL TELEMETRY PRODUCERS]                                 [HUMAN OPERATIONAL USERS]         |
|  • AWS CloudTrail / Azure Activity                              • Tier-1 / Tier-2 Analysts        |
|  • CrowdStrike / Defender EDR Logs                              • Tier-3 Threat Hunters           |
|  • Okta / Entra ID Identity Events                              • SOC Managers / Directors        |
|  • Network Flow & Firewall Gateways                             • SecOps Architects / CISO        |
|  • STIX / TAXII Threat Feeds                                    • Compliance Auditors             |
|                |                                                             |                    |
|                | Inbound Streams                                             | HTTPS / WebSockets |
|                v                                                             v                    |
|  +---------------------------------------------------------------------------------------------+  |
|  |                                  SENTINELAI PLATFORM BOUNDARY                               |  |
|  |                                                                                             |  |
|  |  +------------------------+  +------------------------+  +-------------------------------+  |  |
|  |  | Ingestion & OCSF       |->| Dynamic Temporal       |->| Multi-Agent AI Triage         |  |  |
|  |  | Schematization Layer   |  | Causal Graph Substrate |  | & Noise Suppression Subsystem |  |  |
|  |  +------------------------+  +------------------------+  +-------------------------------+  |  |
|  |                                                                          |                  |  |
|  |  +------------------------+  +------------------------+                  v                  |  |
|  |  | Natural Language       |<-| Policy Guardrails      |<-+-------------------------------+  |  |
|  |  | Copilot Engine         |  | Remediation Subsystem  |  | Explainable AI Lineage Engine |  |  |
|  |  +------------------------+  +------------------------+  +-------------------------------+  |  |
|  |                                           |                                                 |  |
|  |  +---------------------------------------------------------------------------------------+  |  |
|  |  | Immutable Audit Persistence & Executive Analytics Dashboard Subsystem                  |  |  |
|  |  +---------------------------------------------------------------------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                              |                                                    |
|                                              | Outbound Action Commands                           |
|                                              v                                                    |
|  [EXTERNAL ACTION EXECUTORS & ITSM CONSUMERS]                                                     |
|  • EDR Host Isolation API (CrowdStrike / Defender)                                                |
|  • Identity Session Revocation API (Okta / Entra ID)                                              |
|  • ServiceNow / Jira ITSM Ticket Synchronizer                                                     |
+---------------------------------------------------------------------------------------------------+
```

---

## 5. C4 Model Architecture

### 5.1 Level 1: System Context Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                C4 LEVEL 1: SYSTEM CONTEXT DIAGRAM                                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  +------------------------+          Pushes Telemetry Logs         +---------------------------+  |
|  | External Data          |--------------------------------------->| SentinelAI TDIR           |  |
|  | Producers              |                                        | Platform                  |  |
|  +------------------------+                                        | (AI-Native Security Core) |  |
|                                                                    +---------------------------+  |
|  +------------------------+          Interacts & Investigates                   |                 |  |
|  | Human Security         |-----------------------------------------------------+                 |  |
|  | Operators (Analysts)   |                                                     |                 |  |
|  +------------------------+                                                     v                 |  |
|                                                                    +---------------------------+  |
|                                                                    | External Action           |  |
|                                                                    | Executors (EDR/IAM/ITSM)  |  |
|                                                                    +---------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

### 5.2 Level 2: Container Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                              C4 LEVEL 2: CONTAINER ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|                                   [INGRESS GATEWAY CONTAINER]                                     |
|                                   (TLS 1.3 / OAuth2 / Rate Limit)                                 |
|                                                 |                                                 |
|        +----------------------------------------+----------------------------------------+        |
|        v                                        v                                        v        |
|  +--------------------+               +--------------------+                   +--------------------+ |
|  | Telemetry Stream   |               | Analyst Workspace  |                   | Copilot Convers-   | |
|  | Ingestion Container|               | UI Container       |                   | ation Container    | |
|  +--------------------+               +--------------------+                   +--------------------+ |
|            |                                    |                                        |        |
|            v                                    v                                        v        |
|  +--------------------+               +--------------------+                   +--------------------+ |
|  | OCSF Normalization |               | Dynamic Temporal   |                   | Multi-Agent AI     | |
|  | Engine Container   |               | Graph Container    |                   | Triage Container   | |
|  +--------------------+               +--------------------+                   +--------------------+ |
|            |                                    |                                        |        |
|            +------------------------------------+----------------------------------------+        |
|                                                 |                                                 |
|                                                 v                                                 |
|        +----------------------------------------+----------------------------------------+        |
|        v                                        v                                        v        |
|  +--------------------+               +--------------------+                   +--------------------+ |
|  | Policy Remediation |               | XAI Lineage        |                   | Audit & Analytics  | |
|  | Engine Container   |               | Engine Container   |                   | Engine Container   | |
|  +--------------------+               +--------------------+                   +--------------------+ |
|            |                                                                             |        |
|            v                                                                             v        |
|  +----------------------------------------------------------------------------------------------+ |
|  | PERSISTENCE SUBSTRATE: Columnar Lakehouse | In-Memory Graph Store | RDBMS Config | Audit Log | |
|  +----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

### 5.3 Level 3: Component Architecture Diagrams

#### 1. Telemetry Ingestion & OCSF Schematization Container (Level 3 Component)

```
+-----------------------------------------------------------------------------------+
|            C4 LEVEL 3: TELEMETRY INGESTION COMPONENT ARCHITECTURE                 |
+-----------------------------------------------------------------------------------+
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | Stream Receiver       |---->| Decoupled Stream      |---->| OCSF Schema     |  |
|  | Component             |     | Buffer Component      |     | Parser Component|  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|                                                                       |           |
|                                                                       v           |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | Ingestion Audit       |<----| Fallback Dead-Letter  |<----| UUID & Timestamp|  |
|  | Logger Component      |     | Queue Component       |     | Assign Component|  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
+-----------------------------------------------------------------------------------+
```

#### 2. Dynamic Temporal Causal Graph Container (Level 3 Component)

```
+-----------------------------------------------------------------------------------+
|              C4 LEVEL 3: CAUSAL GRAPH ENGINE COMPONENT ARCHITECTURE               |
+-----------------------------------------------------------------------------------+
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | OCSF Event Consumer   |---->| Entity Extractor      |---->| Temporal State  |  |
|  | Component             |     | Component             |     | Node Manager    |  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|                                                                       |           |
|                                                                       v           |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | Graph Cluster         |<----| Attack Story          |<----| Event Edge      |  |
|  | Publisher Component   |     | Aggregator Component  |     | Linker Component|  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 6. Domain-Driven Design (DDD) Context Map

The system domain is structured into six bounded contexts with explicit context relationships, Anti-Corruption Layers (ACL), and upstream/downstream integrations (`ADR-0005`).

```
+---------------------------------------------------------------------------------------------------+
|                            DOMAIN-DRIVEN DESIGN CONTEXT MAP                                       |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [Telemetry & Schematization Context]                                                             |
|         |                                                                                         |
|         | (Upstream / Publisher)                                                                  |
|         v [Anti-Corruption Layer - OCSF Event Translation]                                       |
|  [Temporal Causal Graph Context]                                                                  |
|         |                                                                                         |
|         | (Customer / Supplier Context)                                                           |
|         v [Shared Kernel - Graph Node & Edge Aggregates]                                          |
|  [AI Threat Triage Context]                                                                       |
|         |                                                                                         |
|         +-----------------------------------+-----------------------------------+                 |
|         | (Upstream)                        | (Upstream)                        |                 |
|         v [Lineage Translation ACL]         v [Action Intent Payload]           v [Audit Event]   |
|  [Explainable AI (XAI) Context]     [Policy & Remediation Context]      [Audit & Governance]    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

### Context Relationship Specifications
1. **Telemetry & Schematization -> Temporal Causal Graph:** Upstream/Downstream relationship mediated by an **Anti-Corruption Layer (ACL)** that transforms raw vendor logs into immutable OCSF Domain Events.
2. **Temporal Causal Graph -> AI Threat Triage:** **Shared Kernel** relationship sharing temporal graph aggregates (`EntityNode`, `EventEdge`, `AttackCluster`).
3. **AI Threat Triage -> XAI Context:** Upstream publisher providing assertion context to the XAI Lineage Engine.
4. **AI Threat Triage -> Policy & Remediation Context:** Supplier relationship delivering candidate remediation intent payloads to the Policy Engine.
5. **All Contexts -> Audit & Governance Context:** Upstream event emitters streaming immutable audit events to the centralized Audit Store.

---

## 7. Service Decomposition

The platform microservices are decomposed across the six DDD Bounded Contexts:

| Microservice Identifier | Bounded Context Ownership | Core Service Responsibilities | Communication Protocols |
| :--- | :--- | :--- | :--- |
| **Ingestion-Collector-Service** | Telemetry & Schematization | Ingests multi-cloud audit logs, EDR streams, and IAM events. | HTTP/2 Stream, Webhook |
| **OCSF-Normalizer-Service** | Telemetry & Schematization | Transforms vendor logs to OCSF v1.1 events; assigns UUIDs. | Async Streaming Event Bus |
| **Causal-Graph-Service** | Temporal Causal Graph | Constructs in-memory property graph; updates temporal nodes/edges. | gRPC / Event Bus |
| **Story-Aggregator-Service** | Temporal Causal Graph | Aggregates related graph clusters into unified Incident Stories. | Async Streaming Event Bus |
| **AI-Supervisor-Service** | AI Threat Triage | Coordinates multi-agent triage ensemble; evaluates overall confidence. | gRPC Internal IPC |
| **Triage-Agent-Worker** | AI Threat Triage | Evaluates threat graph severity; calculates threat risk scores. | gRPC Internal IPC |
| **Noise-Suppression-Agent** | AI Threat Triage | Compares anomalies to behavioral baselines; auto-suppresses noise. | gRPC Internal IPC |
| **MITRE-Mapper-Agent** | AI Threat Triage | Maps graph event behaviors to MITRE ATT&CK technique IDs. | gRPC Internal IPC |
| **XAI-Lineage-Service** | Explainable AI (XAI) | Generates 1-click raw log breadcrumb links; validates claims. | gRPC / REST Read API |
| **Policy-Guardrail-Service**| Policy & Remediation | Validates asset criticality tags; enforces Stage 1 HITL & Stage 2 auto. | gRPC Synchronous IPC |
| **Action-Orchestrator-Service**| Policy & Remediation | Dispatches API containment commands to external EDR/Okta connectors. | gRPC / Outbound REST |
| **Copilot-Conversation-Service**| Explainable AI / Workspace | Processes NL queries; returns evidence-grounded answers (<3s). | WebSockets / gRPC |
| **Audit-Governance-Service**| Audit & Governance | Logs immutable audit records; generates SOC 2 compliance packages. | Async Streaming Event Bus |
| **Executive-Analytics-Service**| Audit & Governance | Renders real-time MTTD, MTTR, false positive, and TCO dashboards. | REST Read API |

---

## 8. Component Responsibilities

```
+-----------------------------------------------------------------------------------+
|                        COMPONENT RESPONSIBILITY MATRIX                            |
+--------------------------+--------------------------------------------------------+
| System Component         | Primary Architectural Ownership                        |
+--------------------------+--------------------------------------------------------+
| Stream Receiver          | Low-latency network I/O; stream buffer queue management|
| OCSF Schema Parser       | Vendor payload deserialization; OCSF mapping logic     |
| Graph State Manager      | In-memory entity node indexing & edge relationship link|
| AI Agent Coordinator     | Parallel dispatch to triage subagents & voting consensus|
| XAI Lineage Validator    | Cryptographic validation of log evidence claims        |
| Policy Guardrail Evaluator| Asset tag checking & Stage 1/2 automation authorization|
| Action Dispatcher        | External EDR/IAM API command execution & retry handling|
| Audit Chain Logger       | Cryptographic hash chaining for immutable audit logs  |
+--------------------------+--------------------------------------------------------+
```

---

## 9. Data Flow Architecture

```
+---------------------------------------------------------------------------------------------------+
|                                  END-TO-END DATA FLOW PIPELINE                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [External Telemetry] --(Raw Logs)--> [Stream Ingestion Bus]                                      |
|                                                |                                                  |
|                                                v                                                  |
|                                   [OCSF Normalization Engine]                                     |
|                                                |                                                  |
|                                                v (Normalized OCSF Events)                         |
|                                   [Temporal Causal Graph Engine]                                  |
|                                                |                                                  |
|                                                v (Correlated Attack Graphs)                       |
|                                   [Multi-Agent AI Triage Ensemble]                                |
|                                                |                                                  |
|                         +----------------------+----------------------+                           |
|                         | (Valid Threat Story)                        | (Benign Anomaly)          |
|                         v                                             v                           |
|           [XAI Lineage Breadcrumb Engine]                    [Noise Suppression Store]                |
|                         |                                                                         |
|                         v (Validated Story & Recommended Actions)                                 |
|           [Policy Guardrail Evaluator]                                                            |
|                         |                                                                         |
|        +----------------+----------------+                                                        |
|        | (Stage 1 HITL)                  | (Stage 2 Supervised)                                   |
|        v                                 v                                                        |
|  [Analyst Workspace UI]        [Action Orchestrator API]                                          |
|  (1-Click Human Approval)                |                                                        |
|        |                                 |                                                        |
|        +----------------+----------------+                                                        |
|                         |                                                                         |
|                         v                                                                         |
|           [External EDR / Identity Connector]                                                     |
|                         |                                                                         |
|                         v                                                                         |
|           [Immutable Audit & Analytics Engine]                                                    |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 10. Event Flow Architecture

The event-driven messaging topology uses partitioned event streams for asynchronous decouplings (`ADR-0004`):

```
+-----------------------------------------------------------------------------------+
|                            EVENT FLOW TOPOLOGY (ASCII)                            |
+-----------------------------------------------------------------------------------+
|  Topic Name                  Partition Key          Primary Consumer Group        |
+-----------------------------------------------------------------------------------+
|  `telemetry.raw.v1`          `TenantID + Provider`  `OCSF-Normalizer-Group`       |
|  `telemetry.ocsf.v1`         `TenantID + EntityHash``Causal-Graph-Group`          |
|  `graph.attack-story.v1`     `TenantID + StoryID`   `AI-Triage-Supervisor-Group`  |
|  `ai.triage-result.v1`       `TenantID + StoryID`   `XAI-Lineage-Group`           |
|  `remediation.intent.v1`     `TenantID + StoryID`   `Policy-Guardrail-Group`      |
|  `remediation.executed.v1`   `TenantID + ActionID`  `Audit-Logger-Group`          |
|  `audit.events.v1`           `TenantID + AuditID`   `Audit-Persistence-Group`     |
+-----------------------------------------------------------------------------------+
```

---

## 11. Security Architecture

The security architecture enforces a **Zero-Trust System Architecture (ZTA)** across all network, service, and data layers (`ADR-0011`):

```
+-----------------------------------------------------------------------------------+
|                           ZERO-TRUST SECURITY MODEL                               |
+-----------------------------------------------------------------------------------+
|  [EDGE INGRESS]     --> TLS 1.3 Termination, OAuth2 / OIDC Token Verification     |
|         |                                                                         |
|         v                                                                         |
|  [SERVICE MESH]     --> Mutual TLS 1.3 (mTLS) with short-lived X.509 certificates |
|         |                                                                         |
|         v                                                                         |
|  [DATA SUBSTRATE]   --> Customer-Managed Keys (CMK) AES-256 Envelope Encryption  |
|         |                                                                         |
|         v                                                                         |
|  [ACTION EXECUTOR]  --> Least-Privilege Scoped Tokens & Mandatory Audit Logging   |
+-----------------------------------------------------------------------------------+
```

---

## 12. Trust Boundaries

```
+---------------------------------------------------------------------------------------------------+
|                                  TRUST BOUNDARY MAP (ASCII)                                       |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  TRUST BOUNDARY 0 (EXTERNAL UNTRUSTED)                                                            |
|  • Public Internet • External Cloud Telemetry Sources • External Action API Endpoints             |
|  ===============================================================================================  |
|                                  | Ingress TLS 1.3 / OAuth2                                       |
|                                  v                                                                |
|  TRUST BOUNDARY 1 (DMZ / EDGE INGRESS LAYER)                                                      |
|  • Ingress Gateway Pods • API Rate Limiters • Authentication Token Validators                     |
|  ===============================================================================================  |
|                                  | Internal Service Mesh mTLS 1.3                                 |
|                                  v                                                                |
|  TRUST BOUNDARY 2 (INTERNAL MICROSERVICE CORE)                                                    |
|  • Ingestion, Normalization, Graph Engine, AI Triage, XAI, Policy Engine Pods                     |
|  ===============================================================================================  |
|                                  | Storage TLS + CMK Key Authorization                            |
|                                  v                                                                |
|  TRUST BOUNDARY 3 (DATA PERSISTENCE SUBSTRATE)                                                    |
|  • Encrypted Lakehouse Store • Encrypted Graph Memory • Immutable Audit Store                     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 13. Multi-Tenant Architecture

SentinelAI implements **Hybrid Cryptographic Multi-Tenancy** ensuring absolute tenant data isolation (`ADR-0006`):

```
+-----------------------------------------------------------------------------------+
|                      MULTI-TENANT ISOLATION ARCHITECTURE                          |
+-----------------------------------------------------------------------------------+
|  TENANT A REQUEST               TENANT B REQUEST                                  |
|  (Tenant Context Token A)       (Tenant Context Token B)                          |
|         |                                 |                                       |
|         v                                 v                                       |
|  +-----------------------------------------------------------------------------+  |
|  | POOLED MICROSERVICE COMPUTE LAYER (Tenant Memory Check Enforced)          |  |
|  +-----------------------------------------------------------------------------+  |
|         |                                 |                                       |
|         v (Encrypted with CMK Key A)      v (Encrypted with CMK Key B)            |
|  +------------------------------+  +------------------------------+               |
|  | TENANT A ISOLATED STORAGE    |  | TENANT B ISOLATED STORAGE    |               |
|  | (Cryptographic Envelope A)   |  | (Cryptographic Envelope B)   |               |
|  +------------------------------+  +------------------------------+               |
+-----------------------------------------------------------------------------------+
```

---

## 14. Deployment Architecture

The deployment architecture uses cloud-agnostic OCI containers orchestrated via Kubernetes declarative manifests (`ADR-0016`):

```
+---------------------------------------------------------------------------------------------------+
|                              DEPLOYMENT ARCHITECTURE (KUBERNETES)                                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [KUBERNETES CLUSTER POD TOPOLOGY]                                                                |
|                                                                                                   |
|  +----------------------------------+   +----------------------------------+                      |
|  | Ingestion Worker Pod Pool         |   | OCSF Normalizer Worker Pod Pool  |                      |
|  | (Auto-Scales on Queue Lag)       |   | (Auto-Scales on Stream Load)     |                      |
|  +----------------------------------+   +----------------------------------+                      |
|                 |                                      |                                          |
|                 v                                      v                                          |
|  +-------------------------------------------------------------------------+                      |
|  | Distributed Event Bus Pod Cluster (Partitioned Commit Log Topics)        |                      |
|  +-------------------------------------------------------------------------+                      |
|                 |                                      |                                          |
|                 v                                      v                                          |
|  +----------------------------------+   +----------------------------------+                      |
|  | Causal Graph Engine Pod Pool     |   | Multi-Agent AI Triage Pod Pool   |                      |
|  | (In-Memory Graph State Memory)   |   | (Parallel Inference Workers)     |                      |
|  +----------------------------------+   +----------------------------------+                      |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 15. High Availability Architecture

```
+-----------------------------------------------------------------------------------+
|                        HIGH AVAILABILITY POD TOPOLOGY                             |
+-----------------------------------------------------------------------------------+
|  AVAILABILITY ZONE 1                    AVAILABILITY ZONE 2                       |
|  -------------------                    -------------------                       |
|  • Ingestion Pod (Replica 1)            • Ingestion Pod (Replica 2)               |
|  • Normalizer Pod (Replica 1)           • Normalizer Pod (Replica 2)              |
|  • Graph Engine (Primary Node)          • Graph Engine (Replica Node)             |
|  • AI Triage Pod (Worker Pool A)        • AI Triage Pod (Worker Pool B)           |
|  • Event Bus Broker 1                   • Event Bus Broker 2                      |
+-----------------------------------------------------------------------------------+
```

---

## 16. Disaster Recovery Architecture

SentinelAI enforces a **Warm Standby (Active-Passive) Multi-Region Disaster Recovery Architecture** (`ADR-0015`):

```
+---------------------------------------------------------------------------------------------------+
|                           MULTI-REGION DISASTER RECOVERY MAP                              |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  PRIMARY REGION (ACTIVE)                               SECONDARY REGION (WARM STANDBY)            |
|  -----------------------                               -------------------------------            |
|  • Live Ingestion & Processing                         • Baseline Warm Worker Pods                |
|  • Primary Data Storage Stores                         • Async Replicated Lakehouse Store         |
|  • Active DNS Traffic Routing                          • Replicated KMS Configuration Keys        |
|            |                                                         ^                            |
|            +--- (Async Cross-Region Stream & Key Replication) -------+                            |
|                                                                                                   |
|  ===============================================================================================  |
|  FAILOVER SCENARIO (Primary Region Outage > 3 Minutes):                                          |
|  1. Automated Health Probe detects Primary Region failure.                                       |
|  2. Global DNS automatically switches live traffic to Secondary Warm Region.                      |
|  3. Secondary Region scales worker pod pool to full capacity within < 5 minutes.                   |
|  4. RTO achieved < 1 hour; RPO achieved < 5 seconds.                                             |
+---------------------------------------------------------------------------------------------------+
```

---

## 17. Observability Architecture

```
+-----------------------------------------------------------------------------------+
|                         OBSERVABILITY ARCHITECTURE (ASCII)                        |
+-----------------------------------------------------------------------------------+
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | Microservice Pods     |---->| OpenTelemetry         |---->| Prometheus      |  |
|  | (Metrics, Traces, Logs)|     | Collector Agent       |     | Metrics Engine  |  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|                                                                       |           |
|                                                                       v           |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | Distributed Trace     |<----| Correlation ID        |<----| Central APM     |  |
|  | Visualizer            |     | Context Propagator    |     | Dashboard       |  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 18. Scalability Architecture

```
+-----------------------------------------------------------------------------------+
|                       DYNAMIC SCALABILITY MODEL (HPA)                             |
+-----------------------------------------------------------------------------------+
|  [Streaming Ingestion Lag Spikes > 5,000 Messages]                                |
|          |                                                                        |
|          v                                                                        |
|  [HPA Monitor Triggers Metric Threshold]                                          |
|          |                                                                        |
|          v                                                                        |
|  [Kubernetes Auto-Scales Normalizer & AI Triage Worker Pods from 5 to 25 Pods]    |
|          |                                                                        |
|          v                                                                        |
|  [Partition Rebalancer Re-assigns Streaming Partitions to New Worker Pods]        |
|          |                                                                        |
|          v                                                                        |
|  [Processing Latency Restored to < 60 seconds MTTD SLA]                           |
+-----------------------------------------------------------------------------------+
```

---

## 19. Risk Analysis

| Risk ID | Architectural Risk Description | Severity | Impact | Architectural Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **AR-001** | **Ingestion Stream Backpressure Spike** | High | High | Distributed log commit partitioning with HPA dynamic scaling based on consumer lag (`ADR-0014`). |
| **AR-002** | **KMS Service Interruption** | Critical | High | Local short-lived cryptographic key caching with strict TTL safety policies (`ADR-0006`). |
| **AR-003** | **Graph Memory Exhaustion** | High | Medium | Automated rolling time-window graph pruning and node offloading to high-speed storage (`ADR-0008`). |
| **AR-004** | **AI Inference Latency Spike** | Medium | Medium | Multi-agent parallel execution fallback to deterministic correlation rules if > 5s (`ADR-0009`). |

---

## 20. Architecture Traceability Matrix

Tracing Architecture Components to SRS Requirements, SCUCS Use Cases, BRS Objectives, and ADRs:

| Architectural Component | Mapped SRS Requirements | Mapped SCUCS Use Cases | Mapped BRS Objectives | Governing ADRs |
| :--- | :--- | :--- | :--- | :--- |
| **Ingestion-Collector-Service** | `SRS-FR-001` to `003` | `UC-001` | `BO-1`, `BO-4` | `ADR-0004`, `ADR-0016` |
| **OCSF-Normalizer-Service** | `SRS-FR-004`, `005` | `UC-001` | `BO-4` | `ADR-0005`, `ADR-0018` |
| **Causal-Graph-Service** | `SRS-FR-006` to `008` | `UC-002`, `UC-007` | `BO-1` | `ADR-0008` |
| **AI-Supervisor-Service** | `SRS-FR-009` to `013` | `UC-003`, `UC-004` | `BO-1`, `BO-3` | `ADR-0009` |
| **XAI-Lineage-Service** | `SRS-FR-014`, `015` | `UC-005` | `BO-5` | `ADR-0010` |
| **Policy-Guardrail-Service**| `SRS-FR-019` | `UC-009`, `UC-010` | `BO-2` | `ADR-0012`, `ADR-0017` |
| **Action-Orchestrator-Service**| `SRS-FR-016` to `018` | `UC-008`, `UC-009` | `BO-2` | `ADR-0003`, `ADR-0011` |
| **Copilot-Conversation-Service**| `SRS-FR-020`, `021` | `UC-006` | `BO-5` | `ADR-0003` |
| **Audit-Governance-Service**| `SRS-FR-023`, `024` | `UC-012` | `BO-6` | `ADR-0011`, `ADR-0012` |
| **Executive-Analytics-Service**| `SRS-FR-022` | `UC-011` | `BO-1`, `BO-2`, `BO-4` | `ADR-0013` |

---

## 21. Document Sign-Off & Governance

This High-Level Design specification constitutes the official enterprise architecture baseline for downstream Low-Level Design (LLD), database schema design, and implementation execution.

```
+-----------------------------------------------------------------------------------+
|                        HIGH-LEVEL DESIGN SIGN-OFF                                 |
+-------------------+------------------------------------+--------------------------+
| Role              | Name / Title                       | Status                   |
+-------------------+------------------------------------+--------------------------+
| Architecture      | Chief Enterprise Architect         | APPROVED - HLD Baseline  |
| Architecture      | Principal Distributed Systems Arch | APPROVED - HLD Baseline  |
| Security          | Lead Security Architect            | APPROVED - HLD Baseline  |
| Engineering       | VP of Software Engineering         | APPROVED - HLD Baseline  |
+-------------------+------------------------------------+--------------------------+
```

---
*End of High-Level Design – SentinelAI*
