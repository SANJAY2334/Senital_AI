# SentinelAI: System Context & Use Case Specification (SCUCS)

**AI-Powered Cybersecurity Threat Detection & Incident Response Platform**

---

| Metadata Field              | Value                                                                                                                                                                                                                                                                                                       |
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Document Version**        | `1.0.0-APPROVED`                                                                                                                                                                                                                                                                                            |
| **Document Classification** | Enterprise Architecture Baseline / Analysis Specification                                                                                                                                                                                                                                                   |
| **Target Audience**         | Executive Leadership, Enterprise Architects, System Analysts, Lead Software Architects, QA Lead, Compliance Auditors                                                                                                                                                                                        |
| **Author**                  | Principal Enterprise Architect & Lead Systems Analyst, SentinelAI                                                                                                                                                                                                                                           |
| **Parent Documents**        | • [Product Vision Document (v1.1.0-BOARD-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/product/Product_Vision_Document.md)<br>• [Business Requirements Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md) |
| **Status**                  | Approved Systems Analysis Baseline                                                                                                                                                                                                                                                                          |
| **Effective Date**          | July 2026                                                                                                                                                                                                                                                                                                   |

---

## 1. Executive Overview

The **System Context & Use Case Specification (SCUCS)** establishes the formal operational baseline for **SentinelAI**, defining how external human actors and external enterprise systems interact with the platform.

Following the approval of the [Product Vision Document (v1.1.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/product/Product_Vision_Document.md) and the [Business Requirements Specification (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md), this document bridges high-level business requirements and downstream technical architectural design (Software Requirements Specification, High-Level Design, and Low-Level Design).

This specification remains **100% implementation-agnostic**. It strictly avoids technical implementation choices (such as specific database models, API frameworks, programming languages, or deployment infrastructure) and focuses exclusively on:

- Defining system context and logical boundaries.
- Characterizing external human actors and system actors.
- Documenting the Enterprise Business Capability Map.
- Providing a comprehensive Use Case Catalogue and detailed specifications (UC-001 to UC-012).
- Defining Business Events and State Transitions for key enterprise entities (Alert, Incident, Investigation).
- Establishing bi-directional requirements traceability back to the Business Requirements Specification (BRS).

---

## 2. Purpose of the Document

The purpose of the SCUCS is to provide a single, authoritative reference model for system behavior, operational boundaries, actor interactions, and functional execution paths.

```
+-----------------------------------------------------------------------------------+
|                        ENGINEERING LIFECYCLE SEQUENCE                             |
+-----------------------------------------------------------------------------------+
|  [Product Vision Document (PVD)]  --> Strategic Intent & Business Goals          |
|           |                                                                       |
|           v                                                                       |
|  [Business Requirements Spec (BRS)]--> Measurable Business Capabilities           |
|           |                                                                       |
|           v                                                                       |
|  ==> [SYSTEM CONTEXT & USE CASE SPEC (SCUCS)] ==> Operational Boundary & Use Cases|
|           |                                                                       |
|           v                                                                       |
|  [Software Requirements Spec (SRS)]--> Detailed Functional System Requirements     |
|           |                                                                       |
|           v                                                                       |
|  [High-Level Design (HLD) / LLD]   --> Technical Architecture & Schemas           |
+-----------------------------------------------------------------------------------+
```

Specifically, this document serves to:

1. Establish rigid system boundaries defining what SentinelAI executes versus what is delegated to external infrastructure.
2. Formalize all functional operational paths into standardized Use Case specifications with complete preconditions, main success scenarios, alternate flows, and postconditions.
3. Model entity state transitions (Alert, Incident, Investigation) to guide state machine implementation during downstream technical design.
4. Provide QA teams with test scenario foundations and ensure complete traceability back to enterprise Business Objectives (`BO-1` to `BO-6`).

---

## 3. System Context

SentinelAI operates as an intelligent threat detection and incident response substrate positioned between heterogeneous enterprise log sources and downstream operational consumers (Security Operations Analysts, SOC Managers, Incident Responders, and ITSM platforms).

```
+-----------------------------------------------------------------------------------+
|                               SYSTEM CONTEXT MODEL                                |
+-----------------------------------------------------------------------------------+
|  EXTERNAL PRODUCERS                                          EXTERNAL CONSUMERS   |
|  ------------------                                          ------------------   |
|  • Cloud Providers (AWS/Azure/GCP)   +--------------------+  • SOC Analysts (T1-T3)|
|  • EDR Systems (CrowdStrike/Defender)|                    |  • SOC Managers       |
|  • Identity Providers (Okta/Entra ID)| ==> SENTINELAI ==> |  • SecOps Architects  |
|  • Network Flow & Firewall Gateways  |   PLATFORM BOUNDARY|  • CISO & Executives  |
|  • Threat Intelligence Feeds         +--------------------+  • ITSM (ServiceNow)  |
|                                                              • Compliance Auditors|
+-----------------------------------------------------------------------------------+
```

The platform ingests raw, high-velocity telemetry streams, converts data into standardized Open Cybersecurity Schema Framework (OCSF) events, constructs dynamic temporal causal attack graphs, applies multi-agent AI triage, and orchestrates policy-governed remediation actions back to external infrastructure connectors.

---

## 4. System Boundary Definition

To prevent scope creep and maintain architectural clarity, the logical boundaries of SentinelAI are explicitly demarcated:

### 4.1 Inside the System Boundary (SentinelAI Core)

- Real-time telemetry ingestion and stream buffering.
- OCSF event schema parsing and normalization.
- Dynamic Temporal Causal Graph construction and entity linking.
- Multi-Agent AI threat triage, noise suppression, and severity scoring.
- Explainable AI (XAI) evidence lineage generation and raw log linking.
- Policy-governed response evaluation engine (Stage 1 Assistive & Stage 2 Supervised).
- Natural Language Copilot conversation engine and evidence grounding.
- Immutable audit logging and executive reporting analytics engines.

### 4.2 Outside the System Boundary (External Ecosystem)

- Physical log collection hardware agents or native EDR kernel driver software.
- Primary identity management and credential authorization issuance (managed by Okta/Entra ID).
- IT Service Management (ITSM) enterprise ticket lifecycle engines (managed by ServiceNow/Jira).
- Physical facility security access systems.
- External enterprise foundation model training infrastructure.

---

## 5. External Actors

External actors are human users who interact directly with SentinelAI to perform operational tasks, manage policies, or consume analytics.

| Actor Name                      | Primary Operational Role      | Core Platform Interactions                                                                                                 | Access Level                              |
| :------------------------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- |
| **Tier-1 Security Analyst**     | Frontline Alert Triage        | Inspects incident stories, verifies XAI lineage, executes Stage 1 Assistive 1-click remediation, asks Copilot queries.     | Operational (Restricted Action Execution) |
| **Tier-2 / Tier-3 Analyst**     | Deep Forensics & Response     | Explores visual causal graphs, validates zero-day threats, executes Stage 1 & 2 actions, performs custom evidence hunting. | Advanced Operational                      |
| **SOC Manager / Director**      | Operations & SLA Governance   | Monitors MTTD/MTTR metrics, manages shift handoffs, tunes escalation policies, reviews team resolution performance.        | Managerial Governance                     |
| **SecOps / Security Architect** | Platform Administration       | Configures ingestion connectors, manages OCSF schemas, defines policy guardrails, sets asset criticality tags.             | System Administrative                     |
| **CISO / Executive**            | Strategic Security Leadership | Reviews executive risk posture dashboards, tracks long-term TCO savings, exports Board brief summaries.                    | Executive Read-Only                       |
| **Compliance Auditor**          | Regulatory Verification       | Inspects immutable audit trails, validates non-repudiation logs, exports compliance packages (SOC 2, ISO 27001).           | Audit Read-Only                           |

---

## 6. External Systems

External systems are automated software platforms that interface bi-directionally with SentinelAI via APIs, Webhooks, or event streaming buses.

| External System                            | System Type                | Directionality       | Interaction Purpose                                                                                    |
| :----------------------------------------- | :------------------------- | :------------------- | :----------------------------------------------------------------------------------------------------- |
| **Cloud Audit Providers (AWS/Azure/GCP)**  | Telemetry Producer         | Inbound Stream       | Pushes cloud control plane audit events (e.g., CloudTrail, Azure Activity).                            |
| **EDR Systems (CrowdStrike, Defender)**    | Producer & Action Executor | Bi-Directional       | Pushes endpoint process/network telemetry; receives host isolation and process termination commands.   |
| **Identity Providers (Okta, Entra ID)**    | Producer & Action Executor | Bi-Directional       | Pushes authentication and OAuth logs; receives user session revocation and password reset commands.    |
| **Network & Firewall Gateways**            | Producer & Action Executor | Bi-Directional       | Pushes network flow logs; receives dynamic IP blocking and firewall rule updates.                      |
| **ITSM Platforms (ServiceNow, Jira)**      | Incident Consumer          | Bi-Directional       | Receives synthesized Incident Stories as ITSM tickets; syncs ticket status updates back to SentinelAI. |
| **Threat Intelligence Feeds (STIX/TAXII)** | Intelligence Data Provider | Inbound Batch/Stream | Supplies IoCs, IP reputation, and adversary TTP signatures for correlation matching.                   |

---

## 7. System Context Diagram (ASCII)

```
+---------------------------------------------------------------------------------------------------+
|                                    SENTINELAI SYSTEM CONTEXT                                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [EXTERNAL TELEMETRY PRODUCERS]                                   [HUMAN OPERATIONAL ACTORS]      |
|  +---------------------------+                                    +------------------------+      |
|  | AWS CloudTrail / Azure    |---+                                | Tier-1 Security Analyst|      |
|  +---------------------------+   |                                +------------------------+      |
|  | CrowdStrike / Defender    |---|                                | Tier-2/3 Threat Hunter |      |
|  +---------------------------+   |                                +------------------------+      |
|  | Okta / Microsoft Entra ID |---|                                | SOC Manager / Director |      |
|  +---------------------------+   |                                +------------------------+      |
|  | Network Flow Gateways     |---+                                | SecOps Architect       |      |
|                                  |                                +------------------------+      |
|                                  v                                | CISO / Executive       |      |
|                       +----------------------+                    +------------------------+      |
|                       | Inbound Telemetry    |                    | Compliance Auditor     |      |
|                       | Stream Bus           |                    +------------------------+      |
|                       +----------------------+                                |                   |
|                                  |                                            |                   |
|                                  v                                            v                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                                  SENTINELAI SYSTEM BOUNDARY                                 |  |
|  |                                                                                             |  |
|  |  +-----------------------+   +-----------------------+   +-------------------------------+  |  |
|  |  | OCSF Normalization    |-->| Dynamic Causal Graph  |-->| Multi-Agent AI Triage         |  |  |
|  |  | Engine                |   | Correlation Engine    |   | & Noise Suppression           |  |  |
|  |  +-----------------------+   +-----------------------+   +-------------------------------+  |  |
|  |                                                                          |                  |  |
|  |  +-----------------------+   +-----------------------+                   v                  |  |
|  |  | Natural Language      |<--| Policy Guardrail      |<--+-------------------------------+  |  |
|  |  | Copilot Engine        |   | Remediation Engine    |   | Explainable AI (XAI) Lineage  |  |  |
|  |  +-----------------------+   +-----------------------+   +-------------------------------+  |  |
|  |                                           |                                                 |  |
|  |  +---------------------------------------------------------------------------------------+  |  |
|  |  | Immutable Audit Logging Engine & Analytics Dashboard Service                          |  |  |
|  |  +---------------------------------------------------------------------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                              |                                                    |
|                                              v                                                    |
|                                 +-------------------------+                                       |
|                                 | Action Execution &      |                                       |
|                                 | External Sync Connectors|                                       |
|                                 +-------------------------+                                       |
|                                              |                                                    |
|       +--------------------------------------+--------------------------------------+             |
|       v                                      v                                      v             |
|  +---------------------------+  +---------------------------+  +--------------------------------+ |
|  | EDR Host Isolation API    |  | Okta Session Revoke API   |  | ServiceNow ITSM Integration   | |
|  +---------------------------+  +---------------------------+  +--------------------------------+ |
|  [EXTERNAL ACTION EXECUTOR]     [EXTERNAL ACTION EXECUTOR]     [EXTERNAL INCIDENT CONSUMER]       |
+---------------------------------------------------------------------------------------------------+
```

---

## 8. Enterprise Business Capability Map

The platform capabilities are categorized into six functional business domains:

```
+-----------------------------------------------------------------------------------+
|                        ENTERPRISE BUSINESS CAPABILITY MAP                         |
+-----------------------------------------------------------------------------------+
| 1. TELEMETRY INGESTION & SCHEMATIZATION                                           |
|    • Stream Buffering • OCSF Normalization • Multi-Cloud Ingestion                |
| 2. CORRELATION & CAUSAL GRAPH ANALYTICS                                           |
|    • Dynamic Graph Construction • Entity Linking • Temporal Attack Stitching       |
| 3. AI TRIAGE & NOISE SUPPRESSION                                                  |
|    • Multi-Agent Severity Scoring • Benign Anomaly Suppression • MITRE Mapping    |
| 4. EXPLAINABLE AI & INVESTIGATION                                                 |
|    • Raw Log Lineage Display • Natural Language Copilot • Visual Graph Explorer   |
| 5. POLICY-GOVERNED RESPONSE ORCHESTRATION                                         |
|    • Stage 1 Assistive Response • Stage 2 Supervised Response • Asset Guardrails  |
| 6. GOVERNANCE, AUDIT & EXECUTIVE ANALYTICS                                        |
|    • Immutable Action Audit • Executive Risk Dashboard • Compliance Export Engine |
+-----------------------------------------------------------------------------------+
```

---

## 9. User Role Interaction Matrix

The matrix defines which human user roles interact with specific business capabilities:

| Business Capability             | Tier-1 Analyst | Tier-2/3 Analyst | SOC Manager | SecOps Architect | CISO / Exec | Auditor   |
| :------------------------------ | :------------- | :--------------- | :---------- | :--------------- | :---------- | :-------- |
| **View Incident Stories**       | Primary        | Primary          | Read-Only   | Read-Only        | Summary     | None      |
| **Inspect XAI Evidence**        | Primary        | Primary          | Read-Only   | Read-Only        | None        | Read-Only |
| **Copilot Investigation**       | Primary        | Primary          | Secondary   | Secondary        | None        | None      |
| **Visual Graph Exploration**    | Secondary      | Primary          | None        | Secondary        | None        | None      |
| **Execute Stage 1 Response**    | Primary        | Primary          | Override    | None             | None        | None      |
| **Execute Stage 2 Response**    | Restricted     | Primary          | Override    | None             | None        | None      |
| **Configure Policy Guardrails** | None           | Read-Only        | Secondary   | Primary          | None        | None      |
| **Manage Telemetry Ingest**     | None           | None             | Read-Only   | Primary          | None        | None      |
| **View Executive Analytics**    | None           | None             | Primary     | Read-Only        | Primary     | Read-Only |
| **Export Audit Packages**       | None           | Read-Only        | Primary     | Read-Only        | Secondary   | Primary   |

---

## 10. Complete Use Case Catalogue

The complete Use Case Catalogue covers all functional requirements and business workflows:

| Use Case ID | Use Case Name                                     | Primary Actor               | Business Requirement Traceability                              |
| :---------- | :------------------------------------------------ | :-------------------------- | :------------------------------------------------------------- |
| **UC-001**  | Ingest & Normalize Multi-Source Telemetry         | External Telemetry Producer | `FR-INGEST-01`, `FR-INGEST-02`, `FR-INGEST-03`, `FR-INGEST-04` |
| **UC-002**  | Correlate Events & Construct Temporal Graph       | System (Graph Engine)       | `FR-ANALYTICS-01`, `FR-ANALYTICS-02`                           |
| **UC-003**  | Triage Threat & Synthesize Incident Story         | System (AI Engine)          | `FR-TRIAGE-01`, `FR-TRIAGE-03`, `FR-ANALYTICS-03`              |
| **UC-004**  | Suppress Benign Alert Noise                       | System (AI Baseline Engine) | `FR-TRIAGE-02`, `BO-3`                                         |
| **UC-005**  | Inspect Incident Story & Verify XAI Lineage       | Tier-1 / Tier-2 Analyst     | `FR-XAI-01`, `FR-XAI-02`, `US-002`                             |
| **UC-006**  | Interrogate Incident via Natural Language Copilot | Tier-1 / Tier-2 Analyst     | `FR-COPILOT-01`, `FR-COPILOT-02`, `US-003`                     |
| **UC-007**  | Explore Visual Temporal Attack Graph              | Tier-3 Threat Hunter        | `FR-ANALYTICS-01`, `US-005`                                    |
| **UC-008**  | Execute Stage 1 Assistive Remediation             | Tier-1 / Tier-2 Analyst     | `FR-RESPONSE-01`, `FR-RESPONSE-02`, `US-004`                   |
| **UC-009**  | Execute Stage 2 Supervised Remediation            | System (Policy Engine)      | `FR-RESPONSE-03`, `FR-RESPONSE-04`, `BR-002`                   |
| **UC-010**  | Configure Automation Guardrails & Asset Tags      | SecOps Architect            | `FR-RESPONSE-04`, `US-007`, `BR-002`                           |
| **UC-011**  | Monitor SOC Operational Performance & Risk        | SOC Manager / CISO          | `FR-REPORTING-01`, `US-009`, `BO-1`, `BO-2`                    |
| **UC-012**  | Export Compliance Audit Package & History         | Compliance Auditor          | `FR-REPORTING-02`, `FR-REPORTING-03`, `US-010`                 |

---

## 11. Use Case Diagram (ASCII)

```
+---------------------------------------------------------------------------------------------------+
|                                    SENTINELAI USE CASE DIAGRAM                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [External Telemetry Producers]                                                                   |
|         |                                                                                         |
|         +---> (UC-001: Ingest & Normalize Multi-Source Telemetry)                                 |
|                     |                                                                             |
|                     v <<includes>>                                                                |
|               (UC-002: Correlate Events & Construct Temporal Graph)                               |
|                     |                                                                             |
|                     v <<includes>>                                                                |
|               (UC-003: Triage Threat & Synthesize Incident Story)                                 |
|                     |                                                                             |
|                     +---> (UC-004: Suppress Benign Alert Noise)                                   |
|                                                                                                   |
|  [Tier-1 / Tier-2 Analyst]                                                                        |
|         |                                                                                         |
|         +---> (UC-005: Inspect Incident Story & Verify XAI Lineage)                               |
|         |           |                                                                             |
|         |           +--- <<extends>> ---> (UC-006: Interrogate Incident via NL Copilot)           |
|         |                                                                                         |
|         +---> (UC-008: Execute Stage 1 Assistive Remediation)                                     |
|                     |                                                                             |
|                     v <<communicates>>                                                            |
|               [External Action Executors (EDR / Okta)]                                            |
|                                                                                                   |
|  [Tier-3 Threat Hunter]                                                                           |
|         |                                                                                         |
|         +---> (UC-007: Explore Visual Temporal Attack Graph)                                      |
|                                                                                                   |
|  [System / Policy Engine]                                                                         |
|         |                                                                                         |
|         +---> (UC-009: Execute Stage 2 Supervised Remediation)                                    |
|                                                                                                   |
|  [SecOps Architect]                                                                               |
|         |                                                                                         |
|         +---> (UC-010: Configure Automation Guardrails & Asset Tags)                              |
|                                                                                                   |
|  [SOC Manager / CISO]                                                                             |
|         |                                                                                         |
|         +---> (UC-011: Monitor SOC Operational Performance & Risk)                                |
|                                                                                                   |
|  [Compliance Auditor]                                                                             |
|         |                                                                                         |
|         +---> (UC-012: Export Compliance Audit Package & History)                                 |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 12. Detailed Use Case Specifications

### UC-001: Ingest & Normalize Multi-Source Telemetry

- **Use Case ID:** `UC-001`
- **Name:** Ingest & Normalize Multi-Source Telemetry
- **Goal:** Continuous streaming ingestion of heterogeneous log streams and automated transformation into OCSF v1.1 events.
- **Primary Actor:** External Telemetry Producers (AWS CloudTrail, CrowdStrike, Okta, Azure).
- **Supporting Actors:** System (Normalization Engine).
- **Preconditions:** Network connectivity established; valid authentication keys configured for target log sources.
- **Trigger:** Continuous arrival of log events from external telemetry producers.
- **Main Success Scenario:**
  1. External telemetry producer streams raw JSON/text log events to the ingestion bus.
  2. System receives events with sub-second ingestion latency.
  3. System parses raw log attributes and maps them to standardized OCSF v1.1 event classes.
  4. System validates schema compliance and assigns a global UUID and timestamp.
  5. System streams normalized OCSF events to the graph correlation bus.
- **Alternate Flows:**
  - _3a. Unrecognized Log Format:_ System routes raw event to fallback parser and flags for SecOps schema review while preserving raw log data.
- **Exception Flows:**
  - _2a. Network Connection Interruption:_ System buffers events in streaming buffer (Kafka) and resumes ingestion upon reconnection without log loss.
- **Postconditions:** Log events normalized to OCSF standard and made available for graph correlation; zero data loss.

---

### UC-002: Correlate Events & Construct Temporal Causal Graph

- **Use Case ID:** `UC-002`
- **Name:** Correlate Events & Construct Temporal Causal Graph
- **Goal:** Automatically stitch related OCSF security events into a single dynamic temporal causal attack graph across infrastructure entities.
- **Primary Actor:** System (Graph Engine).
- **Supporting Actors:** None.
- **Preconditions:** Normalized OCSF events streaming from `UC-001`.
- **Trigger:** Arrival of new OCSF events containing entity identifiers (IP, Host, User, Process).
- **Main Success Scenario:**
  1. System extracts entity identifiers and timestamps from incoming OCSF events.
  2. System queries active temporal graph memory to locate existing correlated entity nodes within configured time windows.
  3. System links new event edges to existing entity nodes or instantiates a new graph cluster.
  4. System updates entity relationship state (e.g., User X authenticated to Host Y, spawned Process Z).
  5. System evaluates graph cluster complexity and forwards active graphs to the AI Triage Engine (`UC-003`).
- **Alternate Flows:**
  - _3a. Event Outside Time Window:_ System creates a new distinct temporal graph cluster.
- **Exception Flows:**
  - _2a. Graph Memory Pressure:_ System offloads cold graph nodes to high-performance storage without interrupting real-time graph assembly.
- **Postconditions:** Dynamic temporal attack graph updated in memory with sub-second latency.

---

### UC-003: Triage Threat & Synthesize Incident Story

- **Use Case ID:** `UC-003`
- **Name:** Triage Threat & Synthesize Incident Story
- **Goal:** Apply multi-agent AI to evaluate attack graphs, suppress benign noise, assign severity scores, map MITRE ATT&CK techniques, and synthesize an English Incident Story.
- **Primary Actor:** System (AI Triage Engine).
- **Supporting Actors:** System (XAI Module).
- **Preconditions:** Active temporal attack graph generated by `UC-002`.
- **Trigger:** Temporal graph cluster reaches threat threshold or suspicious entity behavior pattern.
- **Main Success Scenario:**
  1. System submits temporal attack graph to multi-agent AI triage models.
  2. AI agents analyze attack trajectory, entity relationships, and behavioral baselines.
  3. System calculates threat severity score (Critical, High, Medium, Low) and confidence score (0-100%).
  4. System maps identified technique behaviors to MITRE ATT&CK framework IDs.
  5. System synthesizes a clear English-language summary narrative of the attack story.
  6. System generates 1-click XAI visual breadcrumb links connecting narrative claims directly to raw log lines.
  7. System publishes synthesized Incident Story to the analyst workspace.
- **Alternate Flows:**
  - _2a. Benign Anomaly Identified:_ System routes to `UC-004` (Suppress Benign Alert Noise).
- **Exception Flows:**
  - _3a. AI Confidence < 80%:_ System flags incident story with "Uncertainty Escalation" and assigns high-priority human review tag (`BR-005`).
- **Postconditions:** Incident Story created with complete XAI evidence lineage and published to SOC workspace within <5 seconds.

---

### UC-004: Suppress Benign Alert Noise

- **Use Case ID:** `UC-004`
- **Name:** Suppress Benign Alert Noise
- **Goal:** Automatically filter and suppress benign background anomalies to achieve >80% noise reduction.
- **Primary Actor:** System (AI Baseline Engine).
- **Supporting Actors:** None.
- **Preconditions:** Anomaly detected during graph evaluation (`UC-003`).
- **Trigger:** Anomaly matches historical benign enterprise behavioral baselines.
- **Main Success Scenario:**
  1. System compares incoming anomaly against enterprise historical behavioral baselines.
  2. System classifies anomaly as benign operational activity (e.g., scheduled IT backup script).
  3. System suppresses alert notification from the main analyst workspace queue.
  4. System logs suppressed event to background audit storage for baseline verification.
- **Alternate Flows:**
  - _1a. Baseline Drift Detected:_ System flags activity for background review by SecOps Architect without triggering high-severity alert.
- **Exception Flows:** None.
- **Postconditions:** Benign noise suppressed from analyst view; operational focus retained on critical threats.

---

### UC-005: Inspect Incident Story & Verify XAI Lineage

- **Use Case ID:** `UC-005`
- **Name:** Inspect Incident Story & Verify XAI Lineage
- **Goal:** Enable security analysts to review synthesized incident stories and verify AI assertions against raw log evidence.
- **Primary Actor:** Tier-1 / Tier-2 Security Analyst.
- **Supporting Actors:** System (XAI Module).
- **Preconditions:** Synthesized Incident Story published by `UC-003`.
- **Trigger:** Analyst opens assigned Incident Story ticket in the workspace.
- **Main Success Scenario:**
  1. Analyst opens Incident Story in the workspace console.
  2. System displays English narrative summary, severity score, affected assets, and MITRE ATT&CK mappings.
  3. Analyst selects a specific narrative claim or threat score factor.
  4. System opens side-by-side evidence panel displaying exact raw log lines and OCSF attributes.
  5. Analyst verifies raw log evidence matches AI claims and confirms threat validity.
- **Alternate Flows:**
  - _5a. Evidence Questioned:_ Analyst launches Natural Language Copilot (`UC-006`) to perform deeper evidence queries.
- **Exception Flows:**
  - _4a. Raw Log Storage Delay:_ System displays cached OCSF event attributes while retrieving raw log archive.
- **Postconditions:** Analyst validates incident story with complete evidence transparency.

---

### UC-006: Interrogate Incident via Natural Language Copilot

- **Use Case ID:** `UC-006`
- **Name:** Interrogate Incident via Natural Language Copilot
- **Goal:** Enable analysts to query attack timelines, asset histories, and evidence using natural language.
- **Primary Actor:** Tier-1 / Tier-2 Security Analyst.
- **Supporting Actors:** System (Copilot Engine).
- **Preconditions:** Analyst viewing an active Incident Story (`UC-005`).
- **Trigger:** Analyst types a natural language query into the Copilot chat window.
- **Main Success Scenario:**
  1. Analyst enters natural language prompt (e.g., _"What processes were spawned on Host-04 after user Marcus logged in?"_).
  2. System interprets query intent and queries the underlying temporal causal graph and log repository.
  3. System synthesizes clear conversational response within <3 seconds.
  4. System attaches clickable visual evidence links for every data point in the response.
  5. Analyst clicks evidence links to inspect raw log entries.
- **Alternate Flows:**
  - _2a. Ambiguous Prompt:_ System requests clarification with suggested query options.
- **Exception Flows:**
  - _3a. Data Not Available:_ System informs analyst that telemetry for requested entity/time is unavailable in ingested store.
- **Postconditions:** Analyst receives grounded conversational answers supported by raw log evidence.

---

### UC-007: Explore Visual Temporal Attack Graph

- **Use Case ID:** `UC-007`
- **Name:** Explore Visual Temporal Attack Graph
- **Goal:** Allow threat hunters to visually explore entity nodes, relationships, and temporal sequences in an interactive attack graph.
- **Primary Actor:** Tier-3 Threat Hunter.
- **Supporting Actors:** System (Graph Visualization Engine).
- **Preconditions:** Incident Story or entity graph available in the system.
- **Trigger:** Threat hunter selects "Explore Causal Graph" view.
- **Main Success Scenario:**
  1. System renders interactive visual attack graph showing nodes (Hosts, Users, IPs, Processes) and directional edges (Events).
  2. Threat hunter expands/collapses entity nodes to trace lateral movement and initial compromise vectors.
  3. Threat hunter filters graph view by time window, MITRE technique, or asset criticality.
  4. System updates visual graph canvas with <3 second render latency.
  5. Threat hunter selects graph nodes to inspect underlying OCSF properties and raw logs.
- **Alternate Flows:**
  - _2a. Pivot to New Entity:_ Threat hunter pivots graph focus to an adjacent unlinked entity to discover hidden connections.
- **Exception Flows:** None.
- **Postconditions:** Threat hunter gains complete visual visibility into complex multi-stage attack chains.

---

### UC-008: Execute Stage 1 Assistive Remediation

- **Use Case ID:** `UC-008`
- **Name:** Execute Stage 1 Assistive Remediation
- **Goal:** Enable analysts to execute recommended remediation actions with 1-click approval.
- **Primary Actor:** Tier-1 / Tier-2 Security Analyst.
- **Supporting Actors:** System (Policy Engine), External Action Executors (EDR, Okta).
- **Preconditions:** Incident Story recommends specific remediation actions (e.g., Isolate Host, Revoke Token).
- **Trigger:** Analyst clicks "Approve & Execute Remediation" button.
- **Main Success Scenario:**
  1. Analyst reviews AI-recommended remediation plan attached to Incident Story.
  2. Analyst clicks "Execute Action" button.
  3. System evaluates asset criticality guardrails (`UC-010`).
  4. System dispatches API action command to target External Action Executor (e.g., CrowdStrike Host Isolation API).
  5. External Action Executor confirms successful action execution.
  6. System logs immutable audit record (`UC-012`) and updates Incident Story status to "Contained".
- **Alternate Flows:**
  - _3a. Critical Asset Guardrail Triggered:_ System prompts for required Tier-3 / Manager override code before dispatching command (`BR-002`).
- **Exception Flows:**
  - _5a. Action API Failure:_ System alerts analyst of execution failure and suggests alternative manual containment steps.
- **Postconditions:** Threat contained; action immutably logged; incident status updated.

---

### UC-009: Execute Stage 2 Supervised Remediation

- **Use Case ID:** `UC-009`
- **Name:** Execute Stage 2 Supervised Remediation
- **Goal:** Automatically execute containment actions for high-confidence threats on non-critical assets according to configured guardrails.
- **Primary Actor:** System (Policy Engine).
- **Supporting Actors:** External Action Executors (EDR, Okta).
- **Preconditions:** Incident Story generated with High/Critical severity and AI confidence > 90%; Stage 2 Supervised mode active.
- **Trigger:** Incident story matching Stage 2 policy criteria created (`UC-003`).
- **Main Success Scenario:**
  1. System identifies high-confidence threat matching Stage 2 policy rules.
  2. System verifies target asset is non-critical (e.g., standard workstation VM).
  3. System automatically dispatches containment command to External Action Executor (e.g., Okta Session Revocation API).
  4. External Action Executor confirms successful action execution.
  5. System sends real-time notification to SOC analyst queue with automated action status.
  6. System records immutable audit log entry (`UC-012`).
- **Alternate Flows:** None.
- **Exception Flows:**
  - _2a. Asset Tagged Critical:_ System automatically converts action to Stage 1 Assistive mode, requiring analyst approval (`BR-002`).
- **Postconditions:** Threat automatically contained within seconds; analyst notified; action immutably audited.

---

### UC-010: Configure Automation Guardrails & Asset Tags

- **Use Case ID:** `UC-010`
- **Name:** Configure Automation Guardrails & Asset Tags
- **Goal:** Define asset criticality tags, policy guardrails, and automation stage rules to ensure safe execution.
- **Primary Actor:** SecOps Architect.
- **Supporting Actors:** System (Policy Engine).
- **Preconditions:** Administrative access privileges.
- **Trigger:** SecOps Architect opens Automation Governance console.
- **Main Success Scenario:**
  1. Architect views asset criticality inventory and policy configuration rules.
  2. Architect tags enterprise assets with criticality levels (Critical Infrastructure, Standard Workstation, Test VM).
  3. Architect configures response automation levels per threat class and asset level.
  4. System validates policy logic for conflicts.
  5. System saves updated policy configuration and logs administrative audit entry.
- **Alternate Flows:**
  - _4a. Policy Conflict Detected:_ System highlights conflicting rules and prevents saving until resolved.
- **Exception Flows:** None.
- **Postconditions:** Automation guardrails updated; safety boundaries enforced across all automated actions.

---

### UC-011: Monitor SOC Operational Performance & Risk

- **Use Case ID:** `UC-011`
- **Name:** Monitor SOC Operational Performance & Risk
- **Goal:** Provide executive visibility into real-time MTTD, MTTR, false positive reduction, and threat posture.
- **Primary Actor:** SOC Manager / CISO.
- **Supporting Actors:** System (Analytics Engine).
- **Preconditions:** System actively processing incidents and response actions.
- **Trigger:** Manager or CISO accesses Executive Analytics Dashboard.
- **Main Success Scenario:**
  1. User opens Executive Analytics Dashboard.
  2. System renders real-time KPI metrics (MTTD < 60s, MTTR < 5m, False Positive Suppression %, TCO Savings).
  3. User filters metrics by time period, shift team, infrastructure domain, or severity.
  4. System generates visual trend charts demonstrating operational progress.
  5. User exports summary dashboard report for Board presentation.
- **Alternate Flows:** None.
- **Exception Flows:** None.
- **Postconditions:** Executive leadership gains real-time visibility into security operations performance and ROI.

---

### UC-012: Export Compliance Audit Package & History

- **Use Case ID:** `UC-012`
- **Name:** Export Compliance Audit Package & History
- **Goal:** Generate immutable, audit-ready compliance packages detailing log lineage, AI decisions, and human response history.
- **Primary Actor:** Compliance Auditor / SOC Manager.
- **Supporting Actors:** System (Audit Engine).
- **Preconditions:** Immutable audit logs stored for target time period.
- **Trigger:** User requests compliance audit export for a target time frame or incident ID.
- **Main Success Scenario:**
  1. User selects target audit scope (e.g., SOC 2 Type II Incident Handling Audit for Q2).
  2. System queries immutable audit log store for all related AI decisions, XAI lineages, and human approvals.
  3. System verifies cryptographic non-repudiation hashes across audit entries.
  4. System compiles audit package including raw log evidence links, timestamps, and operator actions.
  5. System exports digital compliance audit package (PDF/CSV).
- **Alternate Flows:** None.
- **Exception Flows:**
  - _3a. Hash Mismatch Error:_ System flags potential audit log tampering and alerts SecOps Architect immediately.
- **Postconditions:** Audit package generated; non-repudiation verified; regulatory compliance satisfied.

---

## 13. Business Event Catalogue

Business events represent significant operational occurrences that trigger state changes or system workflows:

| Event ID    | Business Event Name       | Triggering Source           | Business Impact & System Action                                         |
| :---------- | :------------------------ | :-------------------------- | :---------------------------------------------------------------------- |
| **EVT-001** | `TelemetryIngested`       | External Telemetry Producer | Raw log received; triggers OCSF schema normalization (`UC-001`).        |
| **EVT-002** | `GraphClusterUpdated`     | Graph Engine                | New event linked to entity node; updates attack graph (`UC-002`).       |
| **EVT-003** | `ThreatSynthesized`       | AI Triage Engine            | Incident story created; triggers XAI lineage generation (`UC-003`).     |
| **EVT-004** | `BenignAnomalySuppressed` | AI Baseline Engine          | Alert noise suppressed; logged to background audit store (`UC-004`).    |
| **EVT-005** | `LowConfidenceEscalated`  | AI Triage Engine            | AI triage confidence < 80%; flags for human escalation (`BR-005`).      |
| **EVT-006** | `RemediationApproved`     | Security Analyst            | Analyst approves Stage 1 action; dispatches command (`UC-008`).         |
| **EVT-007** | `RemediationAutoExecuted` | Policy Engine               | Stage 2 action auto-executed on non-critical asset (`UC-009`).          |
| **EVT-008** | `GuardrailTriggered`      | Policy Engine               | Critical asset detected; converts action to manual approval (`BR-002`). |
| **EVT-009** | `CopilotQueried`          | Security Analyst            | Analyst submits NL prompt; triggers evidence search (`UC-006`).         |
| **EVT-010** | `AuditPackageExported`    | Compliance Auditor          | Compliance export generated; verified for audit (`UC-012`).             |

---

## 14. State Transition Descriptions for Major Entities

### 14.1 Alert Entity State Machine

```
+-----------------------------------------------------------------------------------+
|                            ALERT ENTITY STATE TRANSITION                          |
+-----------------------------------------------------------------------------------+
|  [Ingested] --> (Normalization) --> [Normalized] --> (Graph Matching)             |
|                                                            |                      |
|                 +------------------------------------------+                      |
|                 | (Benign Pattern Match)    | (Threat Pattern Match)              |
|                 v                           v                                     |
|           [Suppressed]               [Correlated] --> (Story Synthesis)           |
|                                                             |                     |
|                                                             v                     |
|                                                    [Attached to Incident]         |
+-----------------------------------------------------------------------------------+
```

- **Ingested:** Raw telemetry event captured by stream bus.
- **Normalized:** Event successfully parsed into standardized OCSF schema format.
- **Correlated:** Event mapped to an entity node in a temporal causal graph.
- **Suppressed:** Event identified as benign background noise and hidden from workspace.
- **Attached to Incident:** Event incorporated into a synthesized Incident Story.

---

### 14.2 Incident Entity State Machine

```
+-----------------------------------------------------------------------------------+
|                          INCIDENT ENTITY STATE TRANSITION                         |
+-----------------------------------------------------------------------------------+
|  [Synthesized] --> (Published) --> [Active / Open]                                |
|                                           |                                       |
|                  +------------------------+------------------------+              |
|                  | (Remediation Proposed)  | (Assigned to Analyst) |              |
|                  v                         v                       v              |
|        [Remediation Pending]       [Under Investigation]    [Escalated]       |
|                  |                         |                       |              |
|                  +-------------------------+-----------------------+              |
|                                            | (Remediation Executed)               |
|                                            v                                      |
|                                       [Contained]                                 |
|                                            | (Post-Mortem / Verification)         |
|                                            v                                      |
|                                       [Resolved]                                  |
|                                            | (Archived)                           |
|                                            v                                      |
|                                       [Archived]                                  |
+-----------------------------------------------------------------------------------+
```

- **Synthesized:** Incident Story generated by AI Engine with severity and XAI lineage.
- **Active / Open:** Published to the analyst workspace queue.
- **Under Investigation:** Analyst actively inspecting story, graph, or Copilot.
- **Remediation Pending:** Containment actions proposed and awaiting Stage 1 HITL approval.
- **Contained:** Containment action successfully executed via action connectors.
- **Resolved:** Post-incident validation complete; root cause verified.
- **Archived:** Stored in long-term cold archive for historical reference and compliance.

---

### 14.3 Investigation Entity State Machine

```
+-----------------------------------------------------------------------------------+
|                       INVESTIGATION ENTITY STATE TRANSITION                       |
+-----------------------------------------------------------------------------------+
|  [Initiated] --> (Copilot / Graph Action) --> [In-Progress]                        |
|                                                     |                             |
|                    +--------------------------------+                             |
|                    | (Evidence Verified)    | (Hypothesis Invalidated)            |
|                    v                        v                                     |
|           [Evidence Verified]          [Dismissed as Benign]                      |
|                    |                                                              |
|                    +-------------> [Concluded] <----------------------------------+
+-----------------------------------------------------------------------------------+
```

- **Initiated:** Investigation session launched by analyst or threat hunter.
- **In-Progress:** Active graph exploration or Copilot questioning occurring.
- **Evidence Verified:** Raw log lines inspected and matched to AI assertions.
- **Dismissed as Benign:** Investigation confirms activity was non-malicious.
- **Concluded:** Investigation findings finalized and attached to Incident Story.

---

## 15. Operational Workflow Mapping

Mapping between enterprise Business Workflows (BRS Section 10) and system Use Cases:

| BRS Business Workflow                                                 | Executing Use Cases                    | Key Operational Outcome                                                                      |
| :-------------------------------------------------------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Workflow 1: Telemetry Ingestion & Autonomous AI Triage**            | `UC-001`, `UC-002`, `UC-003`, `UC-004` | Telemetry converted to OCSF; correlated into graph; triaged by AI; noise suppressed.         |
| **Workflow 2: Interactive Incident Investigation & XAI Verification** | `UC-005`, `UC-006`, `UC-007`           | Analyst reviews story narrative; verifies XAI raw logs; asks Copilot; explores visual graph. |
| **Workflow 3: Policy-Governed Remediation Execution**                 | `UC-008`, `UC-009`, `UC-010`, `UC-012` | Policy guardrails checked; Stage 1/2 actions executed; action immutably audited.             |

---

## 16. Interaction Matrix (Actor vs. Capability)

| Platform Capability                 | Tier-1 Analyst | Tier-2/3 Analyst | SOC Manager | SecOps Architect | CISO        | Auditor     | Telemetry Producer | Action Executor |
| :---------------------------------- | :------------- | :--------------- | :---------- | :--------------- | :---------- | :---------- | :----------------- | :-------------- |
| **Push Raw Logs (`UC-001`)**        | -              | -                | -           | -                | -           | -           | **Execute**        | -               |
| **Generate Graph (`UC-002`)**       | -              | -                | -           | -                | -           | -           | -                  | -               |
| **Synthesize Story (`UC-003`)**     | -              | -                | -           | -                | -           | -           | -                  | -               |
| **Suppress Noise (`UC-004`)**       | -              | -                | -           | -                | -           | -           | -                  | -               |
| **Verify XAI (`UC-005`)**           | **Execute**    | **Execute**      | View        | View             | -           | View        | -                  | -               |
| **NL Copilot (`UC-006`)**           | **Execute**    | **Execute**      | View        | View             | -           | -           | -                  | -               |
| **Graph Explorer (`UC-007`)**       | View           | **Execute**      | -           | View             | -           | -           | -                  | -               |
| **Stage 1 Remediation (`UC-008`)**  | **Execute**    | **Execute**      | Override    | -                | -           | -           | -                  | **Receive**     |
| **Stage 2 Remediation (`UC-009`)**  | View           | **Execute**      | Override    | -                | -           | -           | -                  | **Receive**     |
| **Configure Guardrails (`UC-010`)** | -              | View             | View        | **Execute**      | -           | -           | -                  | -               |
| **Executive Dashboards (`UC-011`)** | -              | -                | **Execute** | View             | **Execute** | View        | -                  | -               |
| **Audit Package Export (`UC-012`)** | -              | View             | **Execute** | View             | View        | **Execute** | -                  | -               |

---

## 17. Assumptions

1. External telemetry producers emit logs via stable network streaming protocols with configurable retry mechanisms.
2. Enterprise assets are appropriately tagged with criticality levels (Critical Infrastructure vs. Standard Workstation) by the SecOps Architect prior to enabling automated remediation.
3. External Action Executors (EDR APIs, Identity Provider APIs) provide reliable bi-directional endpoints for containment action commands.
4. Human operational actors operate within established Role-Based Access Control (RBAC) boundaries.

---

## 18. Constraints

1. **Strict Implementation Agnosticism:** The SCUCS must not specify underlying programming languages, database engines, or API protocol implementations (restreserved for SRS/HLD).
2. **Streaming Performance Constraint:** System context boundaries must guarantee sub-second streaming ingestion latency and <5 second AI inference latency (`NFR-PERF-01`, `NFR-PERF-02`).
3. **Data Sovereignty Constraint:** All actor interactions and state transitions must strictly observe tenant geographic data residency boundaries (`BR-004`).
4. **Mandatory Explainability Constraint:** No state transition to "Remediation Pending" or "Contained" may occur without valid XAI evidence lineage (`BR-001`).

---

## 19. Requirements Traceability Matrix (RTM)

Tracing every Business Requirement from the [BRS (v1.0.0)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md) to the Use Cases defined in this specification:

| BRS Functional Requirement ID | BRS Requirement Title                        | Executing Use Case IDs       | Traceability Validation Status |
| :---------------------------- | :------------------------------------------- | :--------------------------- | :----------------------------- |
| **FR-INGEST-01**              | Cloud Telemetry Stream Ingestion             | `UC-001`                     | **Fully Covered**              |
| **FR-INGEST-02**              | EDR Telemetry Ingestion                      | `UC-001`                     | **Fully Covered**              |
| **FR-INGEST-03**              | Identity Telemetry Ingestion                 | `UC-001`                     | **Fully Covered**              |
| **FR-INGEST-04**              | OCSF v1.1 Schema Normalization               | `UC-001`                     | **Fully Covered**              |
| **FR-ANALYTICS-01**           | Dynamic Temporal Causal Graph Construction   | `UC-002`, `UC-007`           | **Fully Covered**              |
| **FR-ANALYTICS-02**           | Multi-Source Alert Story Synthesis           | `UC-002`, `UC-003`           | **Fully Covered**              |
| **FR-ANALYTICS-03**           | Automated MITRE ATT&CK Mapping               | `UC-003`                     | **Fully Covered**              |
| **FR-TRIAGE-01**              | Multi-Agent Severity Scoring                 | `UC-003`                     | **Fully Covered**              |
| **FR-TRIAGE-02**              | Benign Anomaly Suppression (>80% noise cut)  | `UC-004`                     | **Fully Covered**              |
| **FR-TRIAGE-03**              | English Summary Narrative Synthesis          | `UC-003`                     | **Fully Covered**              |
| **FR-XAI-01**                 | 1-Click Visual Raw Log Lineage               | `UC-003`, `UC-005`           | **Fully Covered**              |
| **FR-XAI-02**                 | Confidence Score & Reasoning Factors Display | `UC-003`, `UC-005`           | **Fully Covered**              |
| **FR-RESPONSE-01**            | Context-Specific Remediation Playbooks       | `UC-008`, `UC-009`           | **Fully Covered**              |
| **FR-RESPONSE-02**            | Stage 1 Assistive 1-Click Execution          | `UC-008`                     | **Fully Covered**              |
| **FR-RESPONSE-03**            | Stage 2 Supervised Automated Execution       | `UC-009`                     | **Fully Covered**              |
| **FR-RESPONSE-04**            | Asset Criticality Guardrail Validation       | `UC-008`, `UC-009`, `UC-010` | **Fully Covered**              |
| **FR-COPILOT-01**             | Conversational Natural Language Querying     | `UC-006`                     | **Fully Covered**              |
| **FR-COPILOT-02**             | Evidence-Grounded Copilot Answers            | `UC-006`                     | **Fully Covered**              |
| **FR-REPORTING-01**           | Real-Time Executive MTTD/MTTR Dashboard      | `UC-011`                     | **Fully Covered**              |
| **FR-REPORTING-02**           | Immutable User & Action Audit Logging        | `UC-008`, `UC-009`, `UC-012` | **Fully Covered**              |
| **FR-REPORTING-03**           | Compliance Report Package Export             | `UC-012`                     | **Fully Covered**              |

---

## 20. Glossary

- **Actor:** A person, system, or organization that plays a role in interacting with SentinelAI.
- **Causal Graph Node:** An entity representation (Host, User, IP, Process) within the temporal graph engine.
- **Causal Graph Edge:** A directed relationship representing a security event linking two entity nodes over time.
- **Exception Flow:** A path representing an error condition or unexpected event that disrupts the main success scenario of a use case.
- **External Action Executor:** An external enterprise system (EDR, Identity Provider, Firewall) that receives and executes containment commands.
- **Incident Story:** A synthesized presentation of correlated security events detailing attack timeline, affected assets, and XAI evidence.
- **Main Success Scenario:** The primary error-free path through a use case that achieves the primary actor's goal.
- **System Boundary:** The explicit line separating capabilities executed natively within SentinelAI from external enterprise systems.
- **Use Case:** A set of actions defining interactions between an actor and SentinelAI to achieve an operational goal.
- **XAI Breadcrumb:** An interactive visual link connecting an AI assertion directly to its raw log evidence line.

---

## 21. Document Sign-Off & Governance

This System Context & Use Case Specification constitutes the authoritative operational boundary and use case baseline for downstream engineering phase execution (Software Requirements Specification, HLD, LLD).

```
+-----------------------------------------------------------------------------------+
|                            ANALYSIS PHASE SIGN-OFF                                |
+-------------------+------------------------------------+--------------------------+
| Role              | Name / Title                       | Status                   |
+-------------------+------------------------------------+--------------------------+
| Architecture      | Principal Enterprise Architect     | APPROVED - SCUCS Baseline|
| Analysis          | Lead Systems Analyst               | APPROVED - SCUCS Baseline|
| Product           | Chief Business Analyst & Lead PM   | APPROVED - SCUCS Baseline|
| Software Eng      | Director of Software Engineering   | APPROVED - SCUCS Baseline|
| Quality Assurance | Head of Quality Assurance          | APPROVED - SCUCS Baseline|
| Security          | Chief Information Security Officer | APPROVED - SCUCS Baseline|
+-------------------+------------------------------------+--------------------------+
```

---

_End of System Context & Use Case Specification – SentinelAI_
