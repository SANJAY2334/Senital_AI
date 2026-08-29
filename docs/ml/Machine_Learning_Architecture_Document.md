# SentinelAI: Machine Learning Architecture Document (MLAD)
**AI System Design, Multi-Agent Orchestration & MLOps Specification**

---

| Metadata Field | Value |
| :--- | :--- |
| **Document Version** | `1.0.0-APPROVED` |
| **Document Classification** | Enterprise Technical Specification / AI Architecture Baseline |
| **Target Audience** | Chief AI Architect, Principal ML Engineers, MLOps Engineers, Security Data Scientists, Lead Systems Architects |
| **Author** | Chief AI Architect & Principal Machine Learning Engineer, SentinelAI |
| **Parent Baselines** | • [Product Vision Document (v1.1.0-BOARD-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/product/Product_Vision_Document.md)<br>• [Business Requirements Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/business/Business_Requirements_Specification.md)<br>• [Software Requirements Specification (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/requirements/Software_Requirements_Specification.md)<br>• [Architecture Decision Records (ADR-0001 to ADR-0020)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/adr/README.md)<br>• [High-Level Design (v1.0.0-APPROVED)](file:///c:/Users/Sanjay%20R/Desktop/SenitalAI/docs/architecture/High_Level_Design.md) |
| **Status** | Approved AI Architecture Baseline |
| **Effective Date** | August 2026 |

---

## 1. Executive Summary

The **Machine Learning Architecture Document (MLAD)** defines the complete artificial intelligence, machine learning, explainable AI (XAI), and MLOps architecture for **SentinelAI**.

SentinelAI deploys an ensemble of specialized machine learning models and multi-agent AI orchestrators to transform high-velocity streaming security telemetry into transparent, evidence-grounded threat intelligence. This document specifies the end-to-end ML pipeline, feature engineering frameworks, algorithm selection justifications, Explainable AI (XAI) raw log lineage pipelines, confidence scoring engines, model drift detection, analyst feedback learning loops, adversarial threat mitigations, and MLOps lifecycle governance.

All machine learning designs strictly observe the governing architectural decisions:
* **Multi-Agent Orchestration:** Decoupled specialized subagents coordinated by an AI Supervisor (`ADR-0009`).
* **Explainable AI (XAI):** 100% deterministic raw log evidence lineage validation (`ADR-0010`, `BR-001`).
* **Temporal Graph Analytics:** Property graph entity modeling and temporal attack stitching (`ADR-0008`).
* **Zero-Trust & Privacy:** Cryptographic model memory isolation and zero customer log sharing (`ADR-0006`, `ADR-0011`).

---

## 2. AI Objectives

The AI architecture is engineered to satisfy six quantitative performance objectives:

1. **Sub-5-Second Inference Latency:** Complete multi-agent AI threat triage and story synthesis within `< 5 seconds` per incident (`SRS-NFR-002`, `ADR-0009`).
2. **High Noise Suppression Rate:** Automatically filter benign background anomalies to achieve a `> 80% noise reduction` (`BO-3`, `SRS-FR-010`).
3. **100% Explainable AI Lineage:** Guarantee that 100% of AI-generated narrative statements possess verified cryptographic links back to raw OCSF log lines (`BR-001`, `SRS-FR-014`, `ADR-0010`).
4. **High Classification Accuracy:** Maintain model Precision `> 95%` and Recall `> 98%` across all threat severity tiers (`PVD Section 13.2`).
5. **Zero Hallucination Rate:** Eliminate generative AI hallucinations by validating all assertions against deterministic raw log lines prior to story publication (`ADR-0010`).
6. **Continuous Analyst Learning:** Adaptively tune behavioral baselines based on real-time SOC analyst feedback (`US-008`, `BR-005`).

---

## 3. AI System Overview

The SentinelAI intelligence layer sits between the Dynamic Temporal Causal Graph Engine and the Policy Remediation Engine.

```
+-----------------------------------------------------------------------------------+
|                            AI SYSTEM OVERVIEW MAP                                 |
+-----------------------------------------------------------------------------------+
|  [DYNAMIC TEMPORAL CAUSAL GRAPH]                                                  |
|  (Entities: Hosts, Users, IPs, Processes | Edges: Time-Windowed OCSF Events)     |
|          |                                                                        |
|          v (Active Attack Graph Payload)                                          |
|  +-----------------------------------------------------------------------------+  |
|  | MULTI-AGENT AI TRIAGE ENSEMBLE (ADR-0009)                                  |  |
|  |                                                                             |  |
|  |  +---------------------+   +---------------------+   +-------------------+  |  |
|  |  | Anomaly Detector    |   | Threat Classifier   |   | MITRE ATT&CK      |  |  |
|  |  | (Isolation Forest)  |   | (XGBoost Ensemble)  |   | Mapping Subagent  |  |  |
|  |  +---------------------+   +---------------------+   +-------------------+  |  |
|  |             |                         |                        |            |  |
|  |             +-------------------------+------------------------+            |  |
|  |                                       |                                     |  |
|  |                                       v                                     |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  |  | AI SUPERVISOR COORDINATOR (Confidence & Risk Scoring Engine)          |  |  |
|  |  +-----------------------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
|          |                                                                        |
|          v (Synthesized Story Intent)                                             |
|  +-----------------------------------------------------------------------------+  |
|  | EXPLAINABLE AI (XAI) LINEAGE VALIDATION PIPELINE (ADR-0010)                 |  |
|  | (Deterministic Breadcrumb Verification against Raw OCSF Log Records)        |  |
|  +-----------------------------------------------------------------------------+  |
|          |                                                                        |
|          v (Validated Incident Story & XAI Breadcrumbs)                           |
|  [ANALYST WORKSPACE UI] ----(Analyst Feedback: Confirm / Dismiss)----+            |
|                                                                      |            |
|                                                                      v            |
|                                                   [ANALYST FEEDBACK LEARNING LOOP]|
+-----------------------------------------------------------------------------------+
```

---

## 4. End-to-End ML Pipeline

The end-to-end Machine Learning pipeline processes streaming events continuously from raw ingestion to model inference, explainability verification, and feedback loop retraining.

```
+---------------------------------------------------------------------------------------------------+
|                                  END-TO-END ML PIPELINE WORKFLOW                                  |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [Raw Log Ingestion Stream]                                                                       |
|         |                                                                                         |
|         v                                                                                         |
|  [OCSF Schematization & Normalization]                                                            |
|         |                                                                                         |
|         v                                                                                         |
|  [Feature Extraction & Feature Store Update] (Online/Offline Store)                               |
|         |                                                                                         |
|         v                                                                                         |
|  [Dynamic Temporal Causal Graph Construction]                                                     |
|         |                                                                                         |
|         v                                                                                         |
|  [Multi-Agent Model Inference Execution]                                                          |
|         |-- (Isolation Forest Anomaly Score)                                                      |
|         |-- (XGBoost Threat Classification)                                                       |
|         |-- (Graph Centrality & Community Detection)                                              |
|         |-- (MITRE ATT&CK Pattern Matching)                                                       |
|         v                                                                                         |
|  [Risk Engine & Confidence Score Calculation]                                                     |
|         |                                                                                         |
|         +-----------------------+-----------------------+                                         |
|         | (Confidence >= 80%)                           | (Confidence < 80%)                      |
|         v                                               v                                         |
|  [XAI Lineage Validation]                     [Uncertainty Escalation Flag]                       |
|         |                                               |                                         |
|         v                                               v                                         |
|  [Incident Story Publication]                 [High-Priority Human Triage]                        |
|         |                                               |                                         |
|         +-----------------------+-----------------------+                                         |
|                                 |                                                                 |
|                                 v                                                                 |
|                   [Analyst Action & Feedback Capture]                                             |
|                                 |                                                                 |
|                                 v                                                                 |
|                   [Active Learning & Retraining Pipeline]                                         |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 5. Dataset Sources

SentinelAI trains and operates its ML models on five core enterprise dataset sources:

```
+-----------------------------------------------------------------------------------+
|                             DATASET SOURCES TAXONOMY                              |
+-------------------+------------------------------------+--------------------------+
| Dataset Domain    | Telemetry Data Sources             | Target OCSF Class        |
+-------------------+------------------------------------+--------------------------+
| Cloud Logs        | AWS CloudTrail, Azure Activity Log | `Cloud Audit` (6001)     |
| Endpoint Logs     | CrowdStrike, Defender Process/Host | `Process Activity` (1007)|
| Identity Logs     | Okta, Entra ID Authentication/OAuth| `Authentication` (3001)  |
| Network Telemetry | NetFlow, DNS Resolution, WAF       | `Network Activity` (4001)|
| Threat Intel      | STIX/TAXII, MITRE ATT&CK v14 IoCs  | `Threat Intelligence`    |
+-------------------+------------------------------------+--------------------------+
```

---

## 6. Data Collection Pipeline

1. **Continuous Streaming Collector:** High-throughput streaming bus ingests raw JSON/text log streams (`ADR-0004`).
2. **OCSF Schema Parsing:** Transforms raw vendor attributes into unified OCSF v1.1 event trees (`SRS-FR-004`).
3. **Sliding Time Window Aggregator:** Computes rolling time-window statistics (5-minute, 1-hour, 24-hour windows) per entity hash.
4. **Data Lineage Tagging:** Every collected event is tagged with an immutable `ocsf_event_id`, UTC timestamp, and Tenant ID (`SRS-FR-005`).

---

## 7. Data Cleaning Strategy

* **Schema Validation & Dead-Letter Routing:** Events missing core attributes (`class_uid`, `time`, `actor`) are routed to a dead-letter queue for parser inspection without interrupting stream processing (`VR-001`).
* **Timestamp Standardization:** Converts all vendor timestamps to UTC ISO-8601 microsecond format (`I18N-001`).
* **Categorical Normalization:** Standardizes user IDs, IP addresses (IPv4/IPv6 canonical representation), and host FQDNs.
* **Missing Value Imputation:** Missing categorical fields are imputed with `UNKNOWN_ENTITY`; missing numerical features are assigned domain-safe median values.

---

## 8. Feature Engineering Strategy

Feature engineering converts raw OCSF events into numerical feature vectors across three extraction dimensions:

```
+-----------------------------------------------------------------------------------+
|                        FEATURE ENGINEERING DIMENSIONS                             |
+-----------------------------------------------------------------------------------+
|  1. ENTITY BEHAVIORAL FEATURES                                                    |
|     • Event rate per entity hash (5m, 1h, 24h rolling velocity)                   |
|     • Time-of-day entropy (off-hours activity ratio)                              |
|     • Failed authentication ratio per user account                                |
|     • New process execution rarity score                                          |
|                                                                                   |
|  2. GRAPH TOPOLOGICAL FEATURES                                                    |
|     • Entity node degree centrality (number of connected hosts/IPs)               |
|     • Shortest path distance to critical asset nodes                              |
|     • Graph temporal edge density (clustering coefficient)                         |
|     • Cross-domain entity hop count (User -> Host -> IP -> External Cloud)        |
|                                                                                   |
|  3. THREAT INTEL & ANOMALY FEATURES                                               |
|     • Match distance to STIX/TAXII IoC signatures                                 |
|     • MITRE ATT&CK technique co-occurrence probability                            |
|     • Asset criticality tag weight ($W_{asset}$)                                  |
+-----------------------------------------------------------------------------------+
```

---

## 9. Feature Store Design (Conceptual)

The system maintains a dual-layer Feature Store abstraction (`ADR-0007`):

```
+-----------------------------------------------------------------------------------+
|                            FEATURE STORE ARCHITECTURE                             |
+-----------------------------------------------------------------------------------+
|  [ONLINE FEATURE STORE]                   [OFFLINE FEATURE STORE]                 |
|  (In-Memory Key-Value Store)              (Columnar Lakehouse Storage)            |
|  ---------------------------              ----------------------------            |
|  • Sub-millisecond lookup latency         • Historical time-series features       |
|  • Rolling 24-hour entity feature vectors • Multi-year training datasets          |
|  • Real-time graph node state metrics     • Batch feature extraction pipelines    |
|  • Serves real-time ML inference          • Serves model training & backtesting   |
+-----------------------------------------------------------------------------------+
```

---

## 10. Model Architecture

The core ML architecture uses a **Multi-Agent Collaborative Ensemble Architecture** (`ADR-0009`) containing four specialized subagent models coordinated by an AI Supervisor:

```
+---------------------------------------------------------------------------------------------------+
|                             MULTI-AGENT MODEL ARCHITECTURE MAP                                    |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [Dynamic Temporal Attack Graph Payload]                                                          |
|         |                                                                                         |
|         +-----------------------+-----------------------+-----------------------+                 |
|         |                       |                       |                       |                 |
|         v                       v                       v                       v                 |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+ |
|  | Subagent 1:        |  | Subagent 2:        |  | Subagent 3:        |  | Subagent 4:        | |
|  | Anomaly Detector   |  | Threat Classifier  |  | MITRE ATT&CK       |  | Narrative & XAI    | |
|  | (Isolation Forest) |  | (XGBoost Ensemble) |  | Mapping Engine     |  | Lineage Synthesizer| |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+ |
|            |                       |                       |                       |              |
|            +-----------------------+-----------------------+-----------------------+              |
|                                    |                                                              |
|                                    v                                                              |
|  +---------------------------------------------------------------------------------------------+  |
|  | AI SUPERVISOR AGENT (Confidence & Risk Scoring Engine | Risk Score = W_asset * Severity)    |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                    |                                                              |
|                                    v                                                              |
|  +---------------------------------------------------------------------------------------------+  |
|  | DETERMINISTIC XAI LINEAGE VALIDATOR (Raw Log Event ID Verification | ADR-0010)              |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 11. Algorithms Selection and Justification

### 11.1 Isolation Forest (Unsupervised Anomaly Detection)
* **Role in Pipeline:** Evaluates raw entity behavioral feature vectors to identify novel or unusual anomalies without relying on pre-labeled attack signatures.
* **Selection Justification:** Isolation Forest isolates anomalies by randomly partitioning feature space. It excels on high-dimensional tabular log data, operates with linear time complexity $O(n)$, and requires low memory overhead during real-time streaming inference.

### 11.2 XGBoost / Gradient Boosted Decision Trees (Supervised Threat Classification)
* **Role in Pipeline:** Classifies validated anomaly clusters into threat severity tiers (`Critical`, `High`, `Medium`, `Low`).
* **Selection Justification:** XGBoost provides state-of-the-art classification performance on tabular OCSF features, handles missing values natively, resists overfitting, and delivers sub-millisecond execution times.

### 11.3 SHAP (SHapley Additive exPlanations)
* **Role in Pipeline:** Calculates feature importance attribution weights for every threat classification prediction.
* **Selection Justification:** Based on game-theoretic Shapley values, SHAP provides mathematically consistent local feature attribution, enabling the XAI Lineage Engine to identify which exact log fields drove the model's prediction.

### 11.4 Rule-Based Risk Engine & Asset Guardrails
* **Role in Pipeline:** Enforces deterministic risk boundaries, asset criticality weightings ($W_{asset}$), and hard policy guardrails (`BR-002`, `SRS-FR-019`).
* **Selection Justification:** Machine learning models must not have unconstrained authority over destructive remediation. A deterministic rule engine guarantees compliance boundaries regardless of model output.

### 11.5 MITRE ATT&CK Mapping Algorithm
* **Role in Pipeline:** Maps observed graph event sequences to standard MITRE ATT&CK technique IDs (e.g., T1059.001 PowerShell, T1078 Valid Accounts).
* **Selection Justification:** Combines cosine similarity vector matching across event descriptions with deterministic rule-based pattern templates to achieve high-precision technique mapping.

### 11.6 Graph Correlation Algorithms (Louvain & PageRank)
* **Role in Pipeline:** Performs community detection and node centrality scoring on temporal causal attack graphs (`ADR-0008`).
* **Selection Justification:** Louvain community detection identifies dense clusters of interacting entities (attack stories); PageRank measures entity centrality to identify primary compromised assets.

---

## 12. Training Pipeline

```
+-----------------------------------------------------------------------------------+
|                        OFFLINE TRAINING PIPELINE (ASCII)                          |
+-----------------------------------------------------------------------------------+
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | Historical Data Lake  |---->| Feature Extraction    |---->| Dataset Split   |  |
|  | (Offline Store)       |     | Pipeline              |     | (Train/Val/Test)|  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|                                                                       |           |
|                                                                       v           |
|  +-----------------------+     +-----------------------+     +-----------------+  |
|  | Model Registry        |<----| Cross-Validation &    |<----| Hyperparameter  |  |
|  | Versioning (v1.x)     |     | SHAP Evaluation       |     | Tuning Pipeline |  |
|  +-----------------------+     +-----------------------+     +-----------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 13. Validation Pipeline

* **K-Fold Stratified Cross-Validation:** Validates models across 5 folds to ensure generalization across rare attack classes.
* **Adversarial Red-Team Test Suite:** Evaluates model robustness against log injection, obfuscated PowerShell scripts, and living-off-the-land techniques prior to deployment (`R-003`).
* **Historical Backtesting:** Evaluates retrained model checkpoints against 90 days of historical enterprise threat data to ensure zero regression in detection recall (`Recall > 98%`).

---

## 14. Offline vs. Online Inference

```
+-----------------------------------------------------------------------------------+
|                    OFFLINE VS. ONLINE INFERENCE PARADIGM                          |
+----------------------------------------------------+------------------------------+
| Online Real-Time Stream Inference                  | Offline Batch Inference      |
+----------------------------------------------------+------------------------------+
| • Processes active event streams (< 5s SLA)        | • Processes historical logs  |
| • Uses Online Feature Store key-value lookups      | • Uses Offline Data Lake     |
| • Drives real-time Incident Story generation       | • Drives threat hunting      |
| • Triggers Stage 1 & Stage 2 remediation           | • Recalculates baselines     |
+----------------------------------------------------+------------------------------+
```

---

## 15. Model Serving Architecture

Model serving instances are deployed as stateless microservices scaling horizontally (`ADR-0014`):

```
+-----------------------------------------------------------------------------------+
|                         MODEL SERVING ARCHITECTURE (ASCII)                        |
+-----------------------------------------------------------------------------------+
|  [gRPC Stream Request]                                                            |
|         |                                                                         |
|         v                                                                         |
|  +-----------------------------------------------------------------------------+  |
|  | MODEL SERVING POD POOL (Stateless Microservices | Warm Model Memory)        |  |
|  |                                                                             |  |
|  |  +---------------------+   +---------------------+   +-------------------+  |  |
|  |  | Isolation Forest    |   | XGBoost Model       |   | SHAP Explainer    |  |  |
|  |  | Inference Worker    |   | Inference Worker    |   | Inference Worker  |  |  |
|  |  +---------------------+   +---------------------+   +-------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
|         |                                                                         |
|         v                                                                         |
|  [AI Supervisor Consensus Aggregator] ---> (Returns Payload in < 5 seconds)       |
+-----------------------------------------------------------------------------------+
```

---

## 16. Explainable AI (XAI) Pipeline

The XAI pipeline converts abstract model feature attribution weights into concrete, verifiable raw log breadcrumbs (`ADR-0010`):

```
+-----------------------------------------------------------------------------------+
|                             XAI LINEAGE PIPELINE                                  |
+-----------------------------------------------------------------------------------+
|  [XGBoost Prediction + SHAP Attribution Weights]                                  |
|         |                                                                         |
|         v                                                                         |
|  [Extract Top-3 Feature Drivers (e.g., ProcessName = powershell.exe, Weight = 0.42)]|
|         |                                                                         |
|         v                                                                         |
|  [Lookup Target ocsf_event_id in Causal Attack Graph]                             |
|         |                                                                         |
|         v                                                                         |
|  [Verify Raw OCSF Log Record Exists in Storage Substrate]                         |
|         |                                                                         |
|         +-----------------------+-----------------------+                         |
|         | (Verified Match)                              | (Match Failed)          |
|         v                                               v                         |
|  [Generate Clickable XAI Breadcrumb]            [Suppress Claim / Escalate]       |
+-----------------------------------------------------------------------------------+
```

---

## 17. Confidence Scoring

Model Confidence ($C_{model}$) is calculated as a composite weighted score combining Isolation Forest anomaly score ($A$), XGBoost classifier probability ($P$), and Graph edge density ($G$):

$$C_{model} = (w_1 \cdot A) + (w_2 \cdot P) + (w_3 \cdot G)$$

Where $w_1 = 0.3, w_2 = 0.5, w_3 = 0.2$. If $C_{model} < 0.80$, the incident story is flagged with an **Uncertainty Escalation** tag for mandatory human analyst triage (`BR-005`, `SRS-FR-013`).

---

## 18. Risk Scoring Engine

The Incident Risk Score ($R_{incident}$) determines severity classification and remediation playbook routing:

$$R_{incident} = W_{asset} \times S_{threat} \times C_{model}$$

Where:
* $W_{asset}$: Asset Criticality Weight (1.0 = Standard VM, 2.5 = Core Production Database).
* $S_{threat}$: Threat Severity Score derived from XGBoost classification (1 to 10 scale).
* $C_{model}$: Model Confidence Score (0.0 to 1.0).

---

## 19. Analyst Feedback Learning Loop

```
+-----------------------------------------------------------------------------------+
|                       ANALYST FEEDBACK LEARNING LOOP                              |
+-----------------------------------------------------------------------------------+
|  [Analyst Reviews Incident Story in Workspace UI]                                 |
|         |                                                                         |
|         +-----------------------+-----------------------+                         |
|         | (Confirm True Positive)|                       | (Mark False Positive)   |
|         v                                               v                         |
|  [Label Sample as Positive]                     [Label Sample as Negative]        |
|         |                                               |                         |
|         +-----------------------+-----------------------+                         |
|                                 |                                                 |
|                                 v                                                 |
|                   [Active Learning Sample Pool]                                   |
|                                 |                                                 |
|                                 v                                                 |
|                   [Update Behavioral Baselines & Queue Retraining]                |
+-----------------------------------------------------------------------------------+
```

---

## 20. Model Drift Detection

The system continuously monitors for Model Drift and Data Concept Drift:
* **Feature Drift Monitoring:** Applies Kolmogorov-Smirnov (KS) tests and Population Stability Index (PSI) to input feature distributions every 24 hours.
* **Concept Drift Alert:** If PSI $> 0.25$ or false positive rate increases by $> 5\%$ over baseline, the system triggers an automated drift alert and queues model retraining.

---

## 21. Model Retraining Strategy

* **Scheduled Retraining:** Retrains models weekly using the latest 90-day rolling dataset incorporating confirmed analyst labels.
* **Event-Triggered Retraining:** Triggered automatically when drift detection metrics breach safety thresholds (PSI $> 0.25$).
* **Canary Deployment Evaluation:** Retrained model checkpoints are deployed to canary inference pools and evaluated against live shadow traffic before promoting to primary production serving.

---

## 22. Evaluation Metrics

```
+-----------------------------------------------------------------------------------+
|                            MODEL EVALUATION TARGETS                               |
+------------------------------------+-----------------------------------------------+
| Metric Name                        | Target Baseline                               |
+------------------------------------+-----------------------------------------------+
| **Classification Precision**       | `> 95%` across all severity classes           |
| **Classification Recall**          | `> 98%` for Critical/High severity threats     |
| **F1-Score**                       | `> 0.96` macro-averaged                       |
| **False Positive Suppression**     | `> 80%` noise reduction vs legacy baseline    |
| **AI Inference Latency**           | `< 5 seconds` end-to-end execution            |
| **XAI Lineage Validation Rate**    | `100%` verified breadcrumb grounding          |
+------------------------------------+-----------------------------------------------+
```

---

## 23. Security of ML Models

* **Model Artifact Encryption:** All trained model checkpoints are encrypted at rest using AES-256 with Customer-Managed Keys (`ADR-0006`, `ADR-0011`).
* **Inference Memory Isolation:** Model serving microservices run in unprivileged containers with isolated memory spaces.
* **Model Access Authorization:** Model inference endpoints enforce strict mTLS 1.3 and RBAC token authorization (`SRS-NFR-005`).

---

## 24. Adversarial ML Threats and Mitigations

| Threat ID | Adversarial Threat Description | Impact | Technical Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **AML-001** | **Telemetry Log Poisoning** (Injecting benign patterns to distort baselines) | High | Robust feature scaling, active anomaly filtering, and supervised analyst label verification. |
| **AML-002** | **Adversarial Evasion / Obfuscation** (Polymorphic commands avoiding detection) | High | Multi-modal feature extraction (combining graph topology with command entropy). |
| **AML-003** | **Prompt Injection** (Attacker inserting instructions into log fields) | Medium | Complete segregation of natural language prompts from telemetry data; strict JSON schema parsing. |
| **AML-004** | **Model Extraction / Stealing** | Medium | Rate-limiting API queries and masking internal model raw probability vectors. |

---

## 25. MLOps Lifecycle

```
+-----------------------------------------------------------------------------------+
|                            MLOPS LIFECYCLE TOPOLOGY                               |
+-----------------------------------------------------------------------------------+
|  [Data Pipeline] --> [Feature Store] --> [Model Training] --> [Validation Suite] |
|                                                                        |          |
|                                                                        v          |
|  [Drift Monitor] <-- [Production Inference] <-- [Canary Deployment] <-- [Registry]|
+-----------------------------------------------------------------------------------+
```

---

## 26. AI Governance

* **Board-Level Responsible AI Governance:** Strictly enforces transparency, explainability, fairness, human oversight, and data privacy principles (`PVD Section 15.3`).
* **Zero Public LLM Telemetry Leakage:** Customer security logs are **never** transmitted to external or shared foundation model APIs (`PVD Section 15.3`).
* **Audit-Ready AI Lineage:** Maintains immutable records of all model versions, hyperparameter configurations, and inference outputs for compliance auditing (`UC-012`).

---

## 27. AI Traceability Matrix

Tracing AI/ML Components to SRS Requirements, HLD Microservices, and Governing ADRs:

| AI / ML Component | Mapped SRS Requirements | Mapped HLD Microservice | Governing ADRs |
| :--- | :--- | :--- | :--- |
| **Isolation Forest Subagent** | `SRS-FR-009`, `SRS-FR-010` | `Noise-Suppression-Agent` | `ADR-0009` |
| **XGBoost Classifier** | `SRS-FR-009` | `Triage-Agent-Worker` | `ADR-0009` |
| **SHAP Lineage Explainer** | `SRS-FR-014`, `SRS-FR-015` | `XAI-Lineage-Service` | `ADR-0010` |
| **Rule-Based Risk Engine** | `SRS-FR-019` | `Policy-Guardrail-Service` | `ADR-0012`, `ADR-0017` |
| **MITRE ATT&CK Mapper** | `SRS-FR-012` | `MITRE-Mapper-Agent` | `ADR-0009` |
| **Graph Correlation Engine** | `SRS-FR-006` to `008` | `Causal-Graph-Service` | `ADR-0008` |
| **AI Supervisor Coordinator**| `SRS-FR-009`, `SRS-FR-013` | `AI-Supervisor-Service` | `ADR-0009` |
| **Model Serving Architecture**| `SRS-NFR-002` | `AI-Supervisor-Service` | `ADR-0002`, `ADR-0014` |

---

## 28. Future AI Enhancements

* **Release v2.0:** Graph Neural Networks (GNNs) for direct deep learning on dynamic temporal attack graphs.
* **Release v2.0:** Predictive Attack Path Simulation predicting lateral movement probabilities prior to exploitation.
* **Release v3.0:** Autonomous AI Decoy Network orchestration deploying dynamic honeypots into attack paths.
* **Release v4.0:** Post-Quantum Cryptographic Posture Monitoring AI.

---

## 29. Risks

| Risk ID | Risk Description | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **MLR-001** | **Concept Drift in New Attack Vectors** | High | Automated drift detection (PSI > 0.25) triggering fast-track retraining pipelines. |
| **MLR-002** | **High Inference Latency under Heavy Load** | High | Multi-agent parallel serving pools with automatic fallback to deterministic correlation rules. |
| **MLR-003** | **Adversarial Log Obfuscation** | Medium | Graph topological feature extraction combining structural entity relations with text entropy. |

---

## 30. Sign-Off

This Machine Learning Architecture Document constitutes the official AI design baseline for SentinelAI model engineering, inference service development, and MLOps deployment.

```
+-----------------------------------------------------------------------------------+
|                        ML ARCHITECTURE SIGN-OFF                                   |
+-------------------+------------------------------------+--------------------------+
| Role              | Name / Title                       | Status                   |
+-------------------+------------------------------------+--------------------------+
| AI Architecture   | Chief AI Architect                 | APPROVED - MLAD Baseline |
| Machine Learning  | Principal ML Engineer              | APPROVED - MLAD Baseline |
| MLOps             | Senior MLOps Architect             | APPROVED - MLAD Baseline |
| Security          | Lead Security Architect            | APPROVED - MLAD Baseline |
+-------------------+------------------------------------+--------------------------+
```

---
*End of Machine Learning Architecture Document – SentinelAI*
