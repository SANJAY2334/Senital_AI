# SentinelAI: Software Requirements Specification (SRS)

**IEEE 830 / ISO/IEC/IEEE 29148 Compliant Specification**

---

| Metadata Field              | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Document Version**        | `1.0.0-APPROVED`                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Standard Baseline**       | IEEE 830-1998 / ISO/IEC/IEEE 29148:2018                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Document Classification** | Enterprise Technical Specification / Software Requirements Baseline                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Target Audience**         | Lead Architects, Systems Engineers, Software Engineers, Test Automation Engineers, Security Auditors                                                                                                                                                                                                                                                                                                                                                                                   |
| **Author**                  | Principal Software Architect & Lead Systems Engineer, SentinelAI                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Parent Documents**        | • [Product Vision Document (v1.1.0-BOARD-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/product/Product_Vision_Document.md)<br>• [Business Requirements Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md)<br>• [System Context & Use Case Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/analysis/System_Context_and_Use_Case_Specification.md) |
| **Status**                  | Approved Technical Requirements Baseline                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Effective Date**          | July 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

---

## 1. Document Purpose

This **Software Requirements Specification (SRS)** specifies the complete functional and non-functional software requirements for the **SentinelAI** Threat Detection, Investigation, and Incident Response (TDIR) platform in accordance with **IEEE Std 830-1998** and **ISO/IEC/IEEE 29148:2018** standards.

This document translates the enterprise intent from the [Product Vision Document (v1.1.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/product/Product_Vision_Document.md), the operational goals from the [Business Requirements Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md), and the use case boundaries from the [System Context & Use Case Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/analysis/System_Context_and_Use_Case_Specification.md) into unambiguous, verifiable, and implementation-independent software specifications.

---

## 2. Scope

This SRS applies to the **SentinelAI Core Software Platform (MVP Release v1.0)**. The software boundary encompasses streaming telemetry ingestion, Open Cybersecurity Schema Framework (OCSF) normalization, dynamic temporal causal graph construction, multi-agent AI threat triage, explainable AI (XAI) lineage tracking, policy-governed remediation execution (Stage 1 Assistive & Stage 2 Supervised), conversational natural language copilot, and audit reporting services.

Specific technical implementations (such as selection of specific programming languages, database engines, web frameworks, or infrastructure orchestrators) are explicitly out of scope for this specification and are deferred to the High-Level Design (HLD) and Low-Level Design (LLD) specifications.

---

## 3. Definitions

| Term                          | IEEE 830 / ISO 29148 Software Definition                                                                                                |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Telemetry Pipeline**        | The software subsystem responsible for continuous streaming capture, buffering, and deserialization of external log events.             |
| **OCSF Parser**               | The software module that transforms vendor-specific event payload schemas into normalized OCSF v1.1 attribute trees.                    |
| **Causal Graph Engine**       | The graph processing subsystem that maintains temporal state nodes (entities) and directed edges (events) in memory.                    |
| **Multi-Agent AI Triage**     | An ensemble of specialized analytical software agents that evaluate graph severity, suppress noise, and synthesize incident narratives. |
| **XAI Lineage Breadcrumb**    | A cryptographically verifiable reference link connecting an AI narrative claim to its exact underlying raw log line and OCSF record.    |
| **Stage 1 Assistive Action**  | A remediation execution flow requiring explicit human 1-click UI confirmation before dispatching action commands.                       |
| **Stage 2 Supervised Action** | An automated remediation flow executed by policy rules on non-critical assets with post-execution analyst notification.                 |
| **Policy Guardrail**          | A logical rule evaluator that validates asset criticality tags and automation stage permissions prior to action command execution.      |

---

## 4. References

1. **IEEE Std 830-1998:** _IEEE Recommended Practice for Software Requirements Specifications._
2. **ISO/IEC/IEEE 29148:2018:** _Systems and software engineering — Life cycle processes — Requirements engineering._
3. **Open Cybersecurity Schema Framework (OCSF):** _OCSF v1.1.0 Event Schema Specification._
4. **MITRE ATT&CK Framework:** _ATT&CK Enterprise Matrix v14._
5. **SentinelAI Product Vision Document (PVD):** _Version 1.1.0-BOARD-APPROVED._
6. **SentinelAI Business Requirements Specification (BRS):** _Version 1.0.0-APPROVED._
7. **SentinelAI System Context & Use Case Specification (SCUCS):** _Version 1.0.0-APPROVED._

---

## 5. Overall System Description

SentinelAI is an enterprise software platform that sits logically between external event stream producers (Cloud Audit Logs, EDR, Identity Providers, Network Gateways) and operational security consumers (Analysts, Threat Hunters, SOC Managers, CISO Executives, and ITSM platforms).

```
+-----------------------------------------------------------------------------------+
|                        HIGH-LEVEL SOFTWARE SUBSYSTEM MODEL                        |
+-----------------------------------------------------------------------------------+
|  [INGESTION MODULE]   --> Multi-Cloud, EDR, and IAM Stream Collectors             |
|          |                                                                        |
|          v                                                                        |
|  [SCHEMATIZATION]     --> OCSF v1.1 Normalization & Schema Validation              |
|          |                                                                        |
|          v                                                                        |
|  [GRAPH ANALYTICS]    --> Dynamic Temporal Causal Graph Construction              |
|          |                                                                        |
|          v                                                                        |
|  [AI TRIAGE MODULE]   --> Multi-Agent Triage, Noise Suppression, MITRE Mapping      |
|          |                                                                        |
|          +-----------------------+-----------------------+                        |
|          |                       |                       |                        |
|          v                       v                       v                        |
|  [XAI LINEAGE MODULE]  [REMEDIATION ENGINE]    [COPILOT ENGINE]                   |
|  (Raw Log Lineage)     (Policy Guardrails)     (Natural Language)                 |
|          |                       |                       |                        |
|          +-----------------------+-----------------------+                        |
|                                  |                                                |
|                                  v                                                |
|  [AUDIT & ANALYTICS]  --> Immutable Audit Logging & Executive Dashboards          |
+-----------------------------------------------------------------------------------+
```

---

## 6. Product Perspective

SentinelAI is a self-contained, cloud-native enterprise security platform capable of operating in multi-tenant SaaS, single-tenant private VPC, or hybrid enterprise environments. It interfaces externally with:

- Inbound event stream producers via streaming buses and webhooks.
- Outbound security action APIs (EDR isolate, Identity revoke) via secure REST/gRPC connectors.
- External enterprise ticketing platforms (ServiceNow, Jira) via webhook state synchronizers.

---

## 7. Product Functions

The core software functions of SentinelAI include:

1. **Multi-Source Telemetry Normalization:** Parsing vendor logs into standardized OCSF v1.1 event objects.
2. **Dynamic Temporal Causal Graphing:** Linking entity nodes (Host, User, IP, Process) across time windows into directed attack graphs.
3. **Multi-Agent Threat Triage:** Evaluating attack graphs, calculating severity scores, suppressing benign background noise (>80%), and mapping behaviors to MITRE ATT&CK.
4. **Explainable AI (XAI) Generation:** Creating 1-click visual evidence breadcrumbs connecting narrative claims back to raw log lines.
5. **Policy-Governed Remediation:** Executing Stage 1 (Assistive 1-click) and Stage 2 (Supervised automated) containment commands bounded by asset guardrails.
6. **Conversational Copilot Investigation:** Processing natural language queries and returning evidence-grounded answers within <3 seconds.
7. **Audit & Executive Analytics:** Maintaining immutable action audit trails and rendering real-time MTTD, MTTR, and risk posture dashboards.

---

## 8. User Characteristics

| User Role            | Technical Expertise              | System Access Frequency  | Primary Software Workflows                                                             |
| :------------------- | :------------------------------- | :----------------------- | :------------------------------------------------------------------------------------- |
| **Tier-1 Analyst**   | Moderate (Security Fundamentals) | Continuous (Shift Queue) | Incident story triage, XAI evidence check, Stage 1 1-click response, Copilot queries.  |
| **Tier-2/3 Hunter**  | High (Forensics & Reverse Eng)   | Daily / Investigation    | Visual graph exploration, custom threat hypothesis queries, Stage 1 & 2 action review. |
| **SOC Manager**      | Moderate to High (Ops Focus)     | Daily / Shift Handoff    | SLA tracking (MTTD/MTTR), shift handoff reports, escalation policy tuning.             |
| **SecOps Architect** | Very High (Systems & APIs)       | Weekly / Administrative  | Connector setup, OCSF schema customization, asset criticality tag management.          |
| **CISO / Executive** | Strategic (Business Focus)       | Weekly / Monthly         | Executive risk dashboard review, Board report export, TCO tracking.                    |
| **Auditor**          | Specialized (Compliance Focus)   | Periodic / Audit Cycles  | Immutable audit trail verification, compliance package export (SOC 2, ISO 27001).      |

---

## 9. Operating Environment (Conceptual)

The software shall be designed to operate within containerized, cloud-agnostic execution environments:

- **Runtime Architecture:** Microservices architecture supporting horizontal auto-scaling per service module.
- **Stream Buffer:** High-throughput distributed streaming broker supporting persistent log replay.
- **Storage Abstraction:** Decoupled storage supporting real-time graph memory state and cold columnar data lake storage (OCSF format).
- **Client Interface:** Responsive web client browser workspace complying with modern HTML5/CSS standards.

---

## 10. Assumptions & Dependencies

### 10.1 Assumptions

- Inbound telemetry streams emit valid structured/semi-structured JSON or text log payloads.
- Enterprise assets are tagged with criticality levels (`Critical`, `Standard`, `Non-Critical`) by SecOps Administrators.
- Third-party security APIs (EDR, Identity) enforce standard OAuth2 or API key authentication.

### 10.2 Dependencies

- **OCSF Schema:** Conformance to Open Cybersecurity Schema Framework v1.1.0.
- **MITRE ATT&CK Matrix:** Conformance to MITRE ATT&CK Enterprise Framework v14.
- **API Availability:** Continuous network availability of third-party cloud and EDR action APIs.

---

## 11. Functional Requirements

### 11.1 Telemetry Ingestion & Normalization Subsystem (SRS-FR-INGEST)

- **SRS-FR-001:** The software shall continuously stream and ingest telemetry from AWS CloudTrail, Azure Activity Log, and GCP Audit Logs. _(Traceability: BRS `FR-INGEST-01`, SCUCS `UC-001`)_
- **SRS-FR-002:** The software shall ingest endpoint telemetry events from CrowdStrike Falcon and Microsoft Defender for Endpoint. _(Traceability: BRS `FR-INGEST-02`, SCUCS `UC-001`)_
- **SRS-FR-003:** The software shall ingest identity authentication logs from Okta and Microsoft Entra ID. _(Traceability: BRS `FR-INGEST-03`, SCUCS `UC-001`)_
- **SRS-FR-004:** The software shall parse vendor log attributes and transform them into standardized OCSF v1.1 event records within `< 500 milliseconds` of ingestion buffer arrival. _(Traceability: BRS `FR-INGEST-04`, SCUCS `UC-001`)_
- **SRS-FR-005:** The software shall assign a globally unique 128-bit UUID and UTC timestamp to every ingested OCSF record. _(Traceability: BRS `FR-INGEST-04`, SCUCS `UC-001`)_

### 11.2 Dynamic Temporal Causal Graph Subsystem (SRS-FR-GRAPH)

- **SRS-FR-006:** The software shall construct a Dynamic Temporal Causal Graph by extracting entity identifiers (`Host`, `User`, `IP`, `Process`) and linking events across time windows. _(Traceability: BRS `FR-ANALYTICS-01`, SCUCS `UC-002`)_
- **SRS-FR-007:** The software shall maintain graph entity relationships in memory with sub-second graph update latency. _(Traceability: BRS `FR-ANALYTICS-01`, SCUCS `UC-002`)_
- **SRS-FR-008:** The software shall aggregate multi-source alerts sharing common causal entity nodes into a single unified Incident Story object. _(Traceability: BRS `FR-ANALYTICS-02`, SCUCS `UC-002`)_

```
+-----------------------------------------------------------------------------------+
|              SEQUENCE DIAGRAM: TELEMETRY TO CAUSAL GRAPH (ASCII)                  |
+-----------------------------------------------------------------------------------+
|  Producer         Ingestion Bus        OCSF Parser       Graph Engine             |
|     |                   |                   |                 |                   |
|     |-- 1. Stream Log ->|                   |                 |                   |
|     |                   |-- 2. Buffer Event->|                 |                   |
|     |                   |                   |-- 3. Map OCSF ->|                   |
|     |                   |                   |                 |-- 4. Update Node->|
|     |                   |                   |                 |-- 5. Link Edge -->|
+-----------------------------------------------------------------------------------+
```

### 11.3 Multi-Agent AI Triage & Noise Suppression Subsystem (SRS-FR-TRIAGE)

- **SRS-FR-009:** The software shall evaluate attack graphs using multi-agent AI to calculate threat severity scores (`Critical`, `High`, `Medium`, `Low`) and confidence scores (0-100%). _(Traceability: BRS `FR-TRIAGE-01`, SCUCS `UC-003`)_
- **SRS-FR-010:** The software shall automatically suppress benign background anomalies matching historical enterprise behavioral baselines, achieving a `> 80% reduction` in false positive alert notifications. _(Traceability: BRS `FR-TRIAGE-02`, SCUCS `UC-004`)_
- **SRS-FR-011:** The software shall generate an English narrative summary for every synthesized Incident Story within `< 5 seconds` of graph creation. _(Traceability: BRS `FR-TRIAGE-03`, SCUCS `UC-003`)_
- **SRS-FR-012:** The software shall automatically map identified adversary behaviors to MITRE ATT&CK technique IDs. _(Traceability: BRS `FR-ANALYTICS-03`, SCUCS `UC-003`)_
- **SRS-FR-013:** The software shall flag any incident story with AI triage confidence `< 80%` with an "Uncertainty Escalation" tag for mandatory analyst review. _(Traceability: BRS `BR-005`, SCUCS `UC-003`)_

### 11.4 Explainable AI (XAI) Lineage Subsystem (SRS-FR-XAI)

- **SRS-FR-014:** The software shall generate 1-click visual breadcrumb links connecting every AI narrative claim directly to the underlying raw log line and OCSF attributes. _(Traceability: BRS `FR-XAI-01`, SCUCS `UC-005`)_
- **SRS-FR-015:** The software shall render a side-by-side evidence panel displaying raw log payloads when an analyst clicks an XAI breadcrumb link. _(Traceability: BRS `FR-XAI-02`, SCUCS `UC-005`)_

### 11.5 Policy-Governed Remediation Subsystem (SRS-FR-RESPONSE)

- **SRS-FR-016:** The software shall recommend context-specific remediation playbooks (Host Isolation, Token Revocation, IP Block) for every validated incident story. _(Traceability: BRS `FR-RESPONSE-01`, SCUCS `UC-008`)_
- **SRS-FR-017:** The software shall support Stage 1 (Assistive) remediation execution, dispatching containment commands only after receiving explicit 1-click analyst UI approval. _(Traceability: BRS `FR-RESPONSE-02`, SCUCS `UC-008`)_
- **SRS-FR-018:** The software shall support Stage 2 (Supervised) remediation execution, automatically dispatching containment commands for High/Critical threats on non-critical assets. _(Traceability: BRS `FR-RESPONSE-03`, SCUCS `UC-009`)_
- **SRS-FR-019:** The software shall evaluate asset criticality tags prior to command dispatch, converting Stage 2 actions targeting `Critical Infrastructure` assets to Stage 1 Assistive mode requiring human approval (`BR-002`). _(Traceability: BRS `FR-RESPONSE-04`, SCUCS `UC-009`, `UC-010`)_

```
+-----------------------------------------------------------------------------------+
|               ACTIVITY DIAGRAM: POLICY-GOVERNED REMEDIATION (ASCII)               |
+-----------------------------------------------------------------------------------+
|  [Threat Validated]                                                               |
|          |                                                                        |
|          v                                                                        |
|  < Check Asset Tag >                                                              |
|     |                 |                                                           |
|     +--( Critical )-->+---> [Convert to Stage 1 HITL] --> (Wait 1-Click Approval)  |
|     |                                                                 |           |
|     +--( Non-Critical )---> < Check Stage Mode >                      |           |
|                                |               |                      v           |
|                                +-( Stage 1 )-->+----------------> [Dispatch Command]|
|                                |               |                      ^           |
|                                +-( Stage 2 )-->+-> [Auto-Execute] ----+           |
+-----------------------------------------------------------------------------------+
```

### 11.6 Natural Language Copilot Subsystem (SRS-FR-COPILOT)

- **SRS-FR-020:** The software shall process conversational natural language queries from analysts regarding incident timelines and asset histories. _(Traceability: BRS `FR-COPILOT-01`, SCUCS `UC-006`)_
- **SRS-FR-021:** The software shall return evidence-grounded answers within `< 3 seconds`, attaching clickable raw log evidence links to all assertions. _(Traceability: BRS `FR-COPILOT-02`, SCUCS `UC-006`)_

### 11.7 Audit, Reporting & Governance Subsystem (SRS-FR-REPORTING)

- **SRS-FR-022:** The software shall maintain real-time executive dashboards tracking MTTD, MTTR, false positive suppression %, and TCO metrics. _(Traceability: BRS `FR-REPORTING-01`, SCUCS `UC-011`)_
- **SRS-FR-023:** The software shall record an immutable, non-repudiable audit log entry for every user action, AI decision, and remediation execution. _(Traceability: BRS `FR-REPORTING-02`, SCUCS `UC-012`)_
- **SRS-FR-024:** The software shall export audit-ready compliance packages (PDF/CSV) including cryptographic hash verification for SOC 2 and ISO 27001 audits. _(Traceability: BRS `FR-REPORTING-03`, SCUCS `UC-012`)_

---

## 12. Non-Functional Requirements

### 12.1 Performance Requirements (SRS-NFR-PERF)

- **SRS-NFR-001 (Detection Latency):** The software shall process log streams and generate threat alerts within `< 60 seconds` of event generation (MTTD). _(Traceability: BRS `NFR-PERF-01`, SCUCS `BR-001`)_
- **SRS-NFR-002 (AI Triage Latency):** AI triage narrative synthesis shall complete within `< 5 seconds` per incident. _(Traceability: BRS `NFR-PERF-02`)_
- **SRS-NFR-003 (Ingestion Capacity):** The ingestion pipeline shall scale horizontally to support `> 100,000 Events Per Second (EPS)` per pod. _(Traceability: BRS `NFR-PERF-03`)_
- **SRS-NFR-004 (UI Query Response):** Visual graph renders and Copilot query responses shall display within `< 3 seconds`. _(Traceability: BRS `NFR-PERF-04`)_

### 12.2 Security & Privacy Requirements (SRS-NFR-SEC)

- **SRS-NFR-005 (RBAC/ABAC Enforcement):** The software shall enforce strict Role-Based and Attribute-Based Access Control for all API and UI endpoints. _(Traceability: BRS `NFR-SEC-01`)_
- **SRS-NFR-006 (Encryption at Rest & Transit):** Data at rest shall be encrypted using AES-256 (supporting Customer-Managed Keys), and data in transit shall use TLS 1.3. _(Traceability: BRS `NFR-SEC-02`)_
- **SRS-NFR-007 (Tenant Data Isolation):** The software shall enforce cryptographic tenant data separation in multi-tenant SaaS deployments. _(Traceability: BRS `NFR-SEC-03`)_

---

## 13. Software Module Specification

The software system is logically decomposed into eight core functional modules:

```
+-----------------------------------------------------------------------------------+
|                           SOFTWARE MODULE ARCHITECTURE                            |
+-------------------+------------------------------------+--------------------------+
| Module ID         | Module Name                        | Primary Responsibility   |
+-------------------+------------------------------------+--------------------------+
| MOD-01-INGEST     | Telemetry Ingestion Pipeline       | Stream capture & buffer  |
| MOD-02-OCSF       | OCSF Normalization Engine          | Vendor payload parsing   |
| MOD-03-GRAPH      | Dynamic Temporal Causal Graph      | In-memory entity linking |
| MOD-04-TRIAGE     | Multi-Agent AI Triage Subsystem    | Severity & noise filter  |
| MOD-05-XAI        | Explainable AI Lineage Module      | Raw log breadcrumbs      |
| MOD-06-RESPONSE   | Policy Remediation Engine          | Action guardrails & API  |
| MOD-07-COPILOT    | Natural Language Copilot Service   | Conversational QA        |
| MOD-08-AUDIT      | Audit & Executive Analytics        | Immutable logs & dashboard|
+-------------------+------------------------------------+--------------------------+
```

---

## 14. Logical Component Decomposition

```
+-----------------------------------------------------------------------------------+
|                        LOGICAL COMPONENT DECOMPOSITION                            |
+-----------------------------------------------------------------------------------+
|  +-----------------------------------------------------------------------------+  |
|  | WORKSPACE PRESENTATION LAYER (Web Dashboard / Copilot / Graph Explorer)     |  |
|  +-----------------------------------------------------------------------------+  |
|                                       |                                           |
|                                       v                                           |
|  +-----------------------------------------------------------------------------+  |
|  | API & INTEGRATION GATEWAY (RBAC / ABAC / Tenant Isolation / Rate Limiter)   |  |
|  +-----------------------------------------------------------------------------+  |
|                                       |                                           |
|         +-----------------------------+-----------------------------+             |
|         v                             v                             v             |
|  +-------------------+     +-------------------+     +-------------------------+  |
|  | STREAM & SCHEMATIZ|     | CAUSAL GRAPH      |     | MULTI-AGENT AI TRIAGE   |  |
|  | LOGIC COMPONENT   |     | ANALYTICS COMPONENT     | REASONING COMPONENT     |  |
|  +-------------------+     +-------------------+     +-------------------------+  |
|         |                             |                             |             |
|         +-----------------------------+-----------------------------+             |
|                                       |                                           |
|                                       v                                           |
|  +-----------------------------------------------------------------------------+  |
|  | POLICY REMEDIATION & ACTION ORCHESTRATION COMPONENT                         |  |
|  +-----------------------------------------------------------------------------+  |
|                                       |                                           |
|                                       v                                           |
|  +-----------------------------------------------------------------------------+  |
|  | IMMUTABLE AUDIT LOG & COMPLIANCE PERSISTENCE COMPONENT                      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 15. External Interface Requirements

The software shall expose standardized abstract interfaces for external communication:

- **Telemetry Streaming Interface:** Inbound asynchronous stream interface supporting binary/JSON event batches.
- **Security Action Connector Interface:** Outbound synchronous action execution interface for EDR host isolation and Identity session revocation commands.
- **ITSM Webhook Interface:** Bi-directional JSON webhook interface for ServiceNow and Jira ticket state synchronization.

---

## 16. User Interface Requirements (Conceptual)

- **SRS-UI-001 (Incident Story Workspace):** The web interface shall display Incident Stories organized by severity, featuring an English narrative summary, affected entity tags, and MITRE ATT&CK visual badges.
- **SRS-UI-002 (XAI Evidence Drawer):** Selecting an XAI breadcrumb link shall open a slide-out drawer displaying the raw log line, timestamp, and OCSF JSON payload side-by-side with the AI claim.
- **SRS-UI-003 (Interactive Causal Graph Viewer):** The graph canvas shall render entity nodes (Hosts, Users, IPs, Processes) and directional event edges, allowing zoom, pan, node expansion, and filtering by time window.
- **SRS-UI-004 (Conversational Copilot Drawer):** A persistent chat drawer shall allow analysts to submit natural language queries and view evidence-backed answers with clickable log links.

---

## 17. Software Interface Requirements

The software shall define abstract software interfaces between internal modules:

- `ISchemaNormalizer`: Interface converting raw payloads into `OCSFEvent` objects.
- `ICausalGraphService`: Interface for updating entity nodes and retrieving temporal attack graphs.
- `IAITriageService`: Interface executing multi-agent triage and returning `IncidentStory` objects.
- `IPolicyEngine`: Interface evaluating asset criticality and returning `ActionPermission` decisions.

---

## 18. Data Interface Requirements

- **OCSF Schema Standard:** All internal event data objects shall strictly implement the Open Cybersecurity Schema Framework (OCSF v1.1) specification.
- **Incident Story Object Data Interface:** `IncidentStory` objects shall contain `StoryID`, `Severity`, `ConfidenceScore`, `NarrativeSummary`, `MITREMappings`, `EntityNodes`, `XAIBreadcrumbs`, and `Status`.

---

## 19. Communication Requirements

- All network communication across software services shall enforce **TLS 1.3** encryption with mutual certificate verification (mTLS).
- External API integrations shall enforce **OAuth 2.0 / OIDC** or TLS client certificate authentication.

---

## 20. Validation Rules

- **VR-001 (Schema Validation):** Incoming events missing required OCSF core attributes (`class_uid`, `category_uid`, `time`) shall be routed to a fallback parsing queue.
- **VR-002 (Evidence Validation):** An AI Incident Story shall not be published unless 100% of narrative claims possess verified XAI breadcrumb links back to raw log records (`BR-001`).
- **VR-003 (Action Policy Validation):** Remediation commands targeting assets tagged `Critical` shall fail validation if executed via Stage 2 Supervised mode, requiring Stage 1 HITL approval (`BR-002`).

---

## 21. Error Handling Requirements

- **EH-001 (Stream Ingestion Backpressure):** Upon ingestion broker backpressure, the software shall buffer events locally without dropping data up to configured storage thresholds.
- **EH-002 (API Connector Failure):** If an external action API call fails or times out, the software shall retry with exponential backoff (3 attempts), notify the analyst, and record a failed execution log.
- **EH-003 (AI Model Inference Fallback):** If AI triage inference fails or times out (>5s), the software shall fall back to deterministic correlation rules and flag the incident for human review.

---

## 22. Logging & Audit Requirements

- **LOG-001 (System Operational Logging):** Software microservices shall emit structured JSON operational logs containing correlation IDs and log levels (INFO, WARN, ERROR).
- **LOG-002 (Immutable Audit Logging):** All user logins, XAI evidence views, Stage 1/2 remediation approvals, and administrative policy edits shall be recorded to immutable audit storage with cryptographic hash chaining (`BR-003`).

---

## 23. Security Requirements

- **SEC-001 (Zero-Trust Architecture):** Every inter-service request shall require cryptographically signed identity tokens.
- **SEC-002 (Least-Privilege Enforcement):** Action connector credentials shall operate under least-privilege scopes (e.g., host isolate scope only).

---

## 24. Authorization Requirements

- **AUTH-001 (Role-Based Access Control):** The software shall enforce RBAC permissions according to the User Role Interaction Matrix defined in SCUCS Section 9.
- **AUTH-002 (Attribute-Based Access Control):** The software shall validate asset tags and tenant IDs before granting action execution permissions.

---

## 25. Privacy Requirements

- **PRIV-001 (Data Residency Compliance):** Customer telemetry shall remain strictly within designated geographic storage regions (e.g., EU data within EU region under GDPR).
- **PRIV-002 (PII Masking Option):** The software shall provide configurable PII masking for user email addresses and IP logs in visual analyst screens.

---

## 26. Performance Requirements

_(Refer to Section 12.1 for `SRS-NFR-001` through `SRS-NFR-004` detailing MTTD <60s, AI latency <5s, >100k EPS throughput, and UI latency <3s)._

---

## 27. Availability Requirements

- **AVAIL-001 (Platform SLA):** The software shall maintain `99.99% Operational Uptime` (unplanned downtime < 52.6 minutes/year).
- **AVAIL-002 (Fault Isolation):** Ingestion service failures shall not impact active visual workspace querying or audit logging.

---

## 28. Reliability Requirements

- **REL-001 (Zero Telemetry Loss):** Streaming ingestion buffers shall guarantee `99.999999999% data durability`.
- **REL-002 (Mean Time Between Failures):** Core graph analytics modules shall maintain a MTBF of `> 2,160 hours` (90 days continuous operation).

---

## 29. Scalability Requirements

- **SCALE-001 (Horizontal Scale):** Ingestion and graph processing services shall scale horizontally by adding execution nodes without service disruption.
- **SCALE-002 (Data Lake Scale):** Storage architecture shall support petabyte-scale historical log retention without degrading query response times.

---

## 30. Maintainability Requirements

- **MAIN-001 (Modular Decoupling):** Microservice modules shall communicate exclusively via public APIs/interfaces, enabling independent deployment.
- **MAIN-002 (Schema Extensibility):** Adding custom OCSF extensions shall require zero changes to core graph correlation logic.

---

## 31. Portability Requirements

- **PORT-001 (Cloud-Agnostic Execution):** All software components shall deploy seamlessly across AWS, Azure, GCP, or private enterprise clouds.

---

## 32. Internationalization & Localization Requirements

- **I18N-001 (UTC Time Standard):** All internal logs, graph timestamps, and XAI breadcrumbs shall store and process timestamps in UTC ISO-8601 format.
- **I18N-002 (UI Localization Support):** Analyst interface text strings shall be externalized to support multi-language localization.

---

## 33. Accessibility Requirements

- **ACC-001 (WCAG 2.1 AA Conformance):** The web user workspace shall comply with WCAG 2.1 Level AA accessibility standards, supporting screen readers and keyboard navigation.

---

## 34. Data Retention Requirements

- **RET-001 (Hot Log Retention):** Real-time graph and OCSF event data shall remain in high-performance storage for configurable windows (default 30 days).
- **RET-002 (Cold Audit Archive):** Immutable audit logs and raw log archives shall be retained for a minimum of 365 days (`BR-003`).

---

## 35. Backup & Recovery Requirements

- **BAK-001 (Point-in-Time Recovery):** Policy configurations and graph state snapshots shall undergo automated daily backups supporting point-in-time recovery.
- **BAK-002 (RTO & RPO Targets):** System Recovery Time Objective (RTO) shall be `< 1 hour`, and Recovery Point Objective (RPO) shall be `< 5 seconds`.

---

## 36. Monitoring Requirements

- **MON-001 (APM Telemetry):** Software modules shall emit Prometheus-compatible metrics for memory, CPU, EPS throughput, and queue depth.
- **MON-002 (Synthetic Health Probes):** Synthetic health probes shall continuously validate end-to-end ingestion, graph processing, and AI triage latency.

---

## 37. Requirement Traceability Matrix (RTM)

The matrix below traces every **Software Functional Requirement (SRS-FR)** back to the **Business Requirements Specification (BRS)** and **System Context & Use Case Specification (SCUCS)**:

| SRS Requirement ID | Requirement Title                        | Parent BRS Requirement ID   | Parent SCUCS Use Case ID     |
| :----------------- | :--------------------------------------- | :-------------------------- | :--------------------------- |
| **SRS-FR-001**     | Cloud Telemetry Ingestion                | `FR-INGEST-01`              | `UC-001`                     |
| **SRS-FR-002**     | EDR Telemetry Ingestion                  | `FR-INGEST-02`              | `UC-001`                     |
| **SRS-FR-003**     | Identity Telemetry Ingestion             | `FR-INGEST-03`              | `UC-001`                     |
| **SRS-FR-004**     | OCSF Schema Normalization                | `FR-INGEST-04`              | `UC-001`                     |
| **SRS-FR-005**     | UUID & UTC Timestamp Assignment          | `FR-INGEST-04`              | `UC-001`                     |
| **SRS-FR-006**     | Temporal Causal Graph Construction       | `FR-ANALYTICS-01`           | `UC-002`, `UC-007`           |
| **SRS-FR-007**     | Sub-Second In-Memory Graph Updates       | `FR-ANALYTICS-01`           | `UC-002`                     |
| **SRS-FR-008**     | Multi-Source Incident Story Aggregation  | `FR-ANALYTICS-02`           | `UC-002`, `UC-003`           |
| **SRS-FR-009**     | Multi-Agent Threat Triage & Scoring      | `FR-TRIAGE-01`              | `UC-003`                     |
| **SRS-FR-010**     | Benign Anomaly Suppression (>80%)        | `FR-TRIAGE-02`, `BO-3`      | `UC-004`                     |
| **SRS-FR-011**     | English Narrative Synthesis (<5s)        | `FR-TRIAGE-03`              | `UC-003`                     |
| **SRS-FR-012**     | Automated MITRE ATT&CK Mapping           | `FR-ANALYTICS-03`           | `UC-003`                     |
| **SRS-FR-013**     | Uncertainty Escalation Tagging (<80%)    | `BR-005`                    | `UC-003`                     |
| **SRS-FR-014**     | 1-Click Visual XAI Breadcrumb Lineage    | `FR-XAI-01`                 | `UC-003`, `UC-005`           |
| **SRS-FR-015**     | Side-by-Side Raw Log Evidence Panel      | `FR-XAI-02`                 | `UC-005`                     |
| **SRS-FR-016**     | Context-Specific Remediation Playbooks   | `FR-RESPONSE-01`            | `UC-008`, `UC-009`           |
| **SRS-FR-017**     | Stage 1 Assistive 1-Click Response       | `FR-RESPONSE-02`            | `UC-008`                     |
| **SRS-FR-018**     | Stage 2 Supervised Automated Response    | `FR-RESPONSE-03`            | `UC-009`                     |
| **SRS-FR-019**     | Asset Criticality Guardrail Validation   | `FR-RESPONSE-04`, `BR-002`  | `UC-009`, `UC-010`           |
| **SRS-FR-020**     | Conversational Natural Language Querying | `FR-COPILOT-01`             | `UC-006`                     |
| **SRS-FR-021**     | Evidence-Grounded Copilot Answers (<3s)  | `FR-COPILOT-02`             | `UC-006`                     |
| **SRS-FR-022**     | Real-Time Executive Risk Dashboard       | `FR-REPORTING-01`           | `UC-011`                     |
| **SRS-FR-023**     | Immutable User & Action Audit Logging    | `FR-REPORTING-02`, `BR-003` | `UC-008`, `UC-009`, `UC-012` |
| **SRS-FR-024**     | Audit-Ready Compliance Package Export    | `FR-REPORTING-03`           | `UC-012`                     |

---

## 38. Open Issues

- **ISSUE-01:** Evaluation of maximum temporal graph window size under memory pressure during extreme log burst events (>500k EPS). _(To be resolved in HLD performance modeling)_.
- **ISSUE-02:** Standardization of custom OCSF extensions for legacy proprietary firewall event logs. _(To be resolved in Data Architecture Specification)_.

---

## 39. Future Requirements (Post-MVP v1.0)

- **SRS-FUT-001 (Stage 3 Autonomous Response):** Software execution of fully autonomous remediation without human approval for verified critical threat classes bounded by policy rules. _(Planned for Release v2.0)_.
- **SRS-FUT-002 (Predictive Attack Path Simulation):** Real-time simulation of lateral movement paths based on identity posture and asset vulnerability metrics. _(Planned for Release v2.0)_.
- **SRS-FUT-003 (Deception Network Orchestration):** Dynamic deployment of synthetic honeypot assets into detected attack paths. _(Planned for Release v3.0)_.

---

## 40. Approval & Sign-Off

This Software Requirements Specification constitutes the official IEEE 830 technical baseline for High-Level Design (HLD), Low-Level Design (LLD), and software engineering execution.

```
+-----------------------------------------------------------------------------------+
|                        TECHNICAL REQUIREMENT SIGN-OFF                             |
+-------------------+------------------------------------+--------------------------+
| Role              | Name / Title                       | Status                   |
+-------------------+------------------------------------+--------------------------+
| Software Arch     | Principal Software Architect       | APPROVED - SRS Baseline  |
| Systems Eng       | Lead Systems Engineer              | APPROVED - SRS Baseline  |
| Product           | Chief Business Analyst & Lead PM   | APPROVED - SRS Baseline  |
| Quality Assurance | Head of Quality Assurance          | APPROVED - SRS Baseline  |
| Security          | Chief Information Security Officer | APPROVED - SRS Baseline  |
+-------------------+------------------------------------+--------------------------+
```

---

_End of Software Requirements Specification – SentinelAI_
