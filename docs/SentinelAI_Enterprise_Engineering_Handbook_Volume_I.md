# SentinelAI Enterprise Engineering Handbook
## Volume I – Foundation, Requirements & Architecture

<div class="cover-page">
  <div class="cover-header">
    <div class="cover-brand">SENTINELAI ENTERPRISE PUBLICATIONS</div>
    <div style="font-size: 9pt; color: #94a3b8; margin-top: 5px;">Document ID: SEN-ENG-HB-VOL1-1.0.0</div>
  </div>
  <div class="cover-title-container">
    <div class="cover-title">SentinelAI Enterprise Engineering Handbook</div>
    <div class="cover-subtitle">Volume I – Foundation, Requirements & Architecture</div>
    <div class="cover-badge">Sprint 0 Foundation Release | Version 1.0.0 | Approved Baseline</div>
  </div>
  <div class="cover-footer">
    <div>
      <strong>Author:</strong> SentinelAI Core Engineering & Architecture Team<br>
      <strong>Classification:</strong> Confidential – Internal Engineering Documentation<br>
      <strong>Status:</strong> Approved Baseline | Release: Sprint 0 Foundation Release
    </div>
    <div style="text-align: right;">
      <strong>Publication Date:</strong> August 2026<br>
      <strong>Target Audience:</strong> CTOs, CISOs, Architects, Engineers, Evaluators<br>
      <strong>Publisher:</strong> SentinelAI Technical Publications Press
    </div>
  </div>
</div>

<div class="page-break"></div>

## Copyright & Legal Notice

Copyright © 2026 SentinelAI Inc. All rights reserved.

This document contains proprietary and confidential information of SentinelAI Inc. Unauthorized copying, distribution, or disclosure of this document or any portion of its contents, via any medium, without the express written permission of SentinelAI Inc., is strictly prohibited.

**Trademarks**
SentinelAI, the SentinelAI logo, Incident Story, Causal Graph Engine, and XAI Evidence Lineage are trademarks or registered trademarks of SentinelAI Inc. All other product names, logos, and brands mentioned herein are trademarks of their respective owners.

**Document Control ID:** `SEN-ENG-HB-VOL1-1.0.0`  
**Document Classification:** Confidential – Internal Engineering Documentation  
**Release Baseline:** Version 1.0.0 (Sprint 0 Foundation Release)  
**Publication Status:** Approved Baseline  
**Effective Date:** August 7, 2026

---

## Preface

The *SentinelAI Enterprise Engineering Handbook (Volume I)* represents the definitive architectural, functional, and engineering baseline for the SentinelAI platform. Built from the ground up to address the systemic crisis facing modern Security Operations Centers (SOCs), SentinelAI unites multi-source streaming telemetry ingestion, Open Cybersecurity Schema Framework (OCSF v1.1) standardization, dynamic temporal causal graphing, multi-agent AI triage, deterministic Explainable AI (XAI) evidence validation, and policy-governed automated remediation.

This volume consolidates all ten approved Sprint 0 architectural baselines—Product Vision Document (PVD), Business Requirements Specification (BRS), System Context & Use Case Specification (SCUCS), Software Requirements Specification (SRS), Architecture Decision Records (ADR-0001 through ADR-0020), High-Level Design (HLD), Machine Learning Architecture Document (MLAD), Environment Configuration Strategy, CI/CD Pipeline Architecture, and Engineering Implementation Roadmap—into a single, cohesive, publication-grade handbook.

---

## Foreword

In cybersecurity engineering, documentation is not an afterthought; it is the blueprint of system integrity. As enterprise IT environments expand across multi-cloud infrastructures, microservices, and hybrid identities, threat actors exploit the fragmented gaps between point security solutions. Traditional Security Information and Event Management (SIEM) solutions overload human analysts with uncontextualized alert noise, while legacy SOAR playbooks fail under the weight of brittle, static scripts.

SentinelAI was conceived to re-engineer the SOC experience. By enforcing strict architectural principles—monorepo codebase organization, gRPC contract-first API design, zero-hallucination XAI lineage, and policy guardrails—this handbook serves as both an architectural reference for senior leadership (CTOs, CISOs, Enterprise Architects) and an operational guide for software, security, AI, and DevOps engineers implementing the platform.

---

## Document Control & Version History

| Field | Details |
| :--- | :--- |
| **Document Title** | SentinelAI Enterprise Engineering Handbook (Volume I) |
| **Document ID** | `SEN-ENG-HB-VOL1-1.0.0` |
| **Document Version** | `1.0.0` |
| **Release Baseline** | Sprint 0 Foundation Release |
| **Publication Status** | Approved Baseline |
| **Document Classification** | Confidential – Internal Engineering Documentation |
| **Effective Date** | August 7, 2026 |
| **Document Owner** | Lead Technical Publications Engineer & Principal Documentation Architect |
| **Executive Sponsors** | Chief Technology Officer (CTO), Chief Information Security Officer (CISO) |

### Revision History

| Version | Release Date | Author / Role | Description of Changes | Approved By |
| :--- | :--- | :--- | :--- | :--- |
| `0.1.0-DRAFT` | July 15, 2026 | Principal Technical Writer | Initial synthesis draft of Sprint 0 engineering documents. | Engineering Leads |
| `0.9.0-RC` | August 1, 2026 | Chief Product Architect | Pre-publication review across architecture and ML sections. | Enterprise Architect |
| `1.0.0-APPROVED`| August 7, 2026 | Lead Technical Publications | Official Volume I publication for Sprint 0 Foundation Release. | CTO, CISO |

---

## Executive Dashboard

The Executive Dashboard provides an immediate operational metric summary of the SentinelAI Sprint 0 release.

<div class="dashboard-grid">
  <div class="dashboard-card">
    <div class="metric-value">v1.0.0</div>
    <div class="metric-label">Release Version</div>
  </div>
  <div class="dashboard-card">
    <div class="metric-value">20 ADRs</div>
    <div class="metric-label">Approved ADRs</div>
  </div>
  <div class="dashboard-card">
    <div class="metric-value">24 FRs / 12 NFRs</div>
    <div class="metric-label">Software Requirements</div>
  </div>
  <div class="dashboard-card">
    <div class="metric-value">11 Services</div>
    <div class="metric-label">Microservices Landscape</div>
  </div>
  <div class="dashboard-card">
    <div class="metric-value">12 Packages</div>
    <div class="metric-label">Shared Monorepo Libraries</div>
  </div>
  <div class="dashboard-card">
    <div class="metric-value">100% Passed</div>
    <div class="metric-label">Sprint 0 Tasks</div>
  </div>
</div>

| Metadata Parameter | Technical Specification |
| :--- | :--- |
| **System Architecture Style** | Event-Driven Reactive Microservices (`ADR-0002`, `ADR-0004`) |
| **Primary Telemetry Standard**| Open Cybersecurity Schema Framework (OCSF v1.1) (`SRS-FR-004`) |
| **AI Ensemble Pipeline** | Isolation Forest (Unsupervised) + XGBoost (Supervised Threat Severity) (`MLAD`) |
| **XAI Lineage Validation** | SHAP Attribution + Raw Log Line Token Match Verification (`BR-001`, `ADR-0010`) |
| **Monorepo Strategy** | Turborepo Monorepo (`ADR-0001`) |
| **Target Ingestion Performance** | 100,000+ Events Per Second (EPS) with MTTD < 60s (`BO-1`, `SRS-NFR-PERF-01`) |
| **False Positive Cut** | >80% Noise Reduction via Baseline Noise Suppression (`BO-3`) |

---

## Architecture Timeline

The SentinelAI platform evolution follows a strict sequence of foundational engineering milestones, progressing from visionary product definition to scalable multi-cloud production.

```
+---------------------------------------------------------------------------------------------------+
|                                 SENTINELAI ARCHITECTURE TIMELINE                                  |
+---------------------------------------------------------------------------------------------------+
| [Product Vision Document (PVD v1.1)]                                                              |
|        │                                                                                          |
|        ▼                                                                                          |
| [Business Requirements Specification (BRS v1.0)]                                                  |
|        │                                                                                          |
|        ▼                                                                                          |
| [System Context & Use Case Spec (SCUCS v1.0)] ──► [Software Requirements Spec (SRS v1.0)]         |
|                                                               │                                   |
|                                                               ▼                                   |
|                                            [Architecture Decision Records (ADR-0001..0020)]      |
|                                                               │                                   |
|                                                               ▼                                   |
| [Machine Learning Arch (MLAD v1.0)] ◄──────────────── [High-Level Design (HLD v1.0)]              |
|        │                                                      │                                   |
|        ▼                                                      ▼                                   |
| [CI/CD & Environment Strategy] ───────────────► [Engineering Roadmap & Backlog]                  |
|                                                               │                                   |
|                                                               ▼                                   |
|                                            [Sprint 0 Foundation Release (Completed)]              |
|                                                               │                                   |
|                                                               ▼                                   |
|                                            [Sprint 1-6 MVP Execution (Underway)]                  |
+---------------------------------------------------------------------------------------------------+
```

---

## Engineering Maturity Model

The SentinelAI Engineering Maturity Model evaluates the operational readiness and technological sophistication of the platform across seven key capabilities.

| Maturity Level | Capabilities & Characteristics | Sprint 0 Status |
| :--- | :--- | :--- |
| **Level 1: Vision & Strategy** | Defined product vision, target market, competitive positioning, and executive buy-in. | **COMPLETED** (PVD Approved) |
| **Level 2: Requirements** | Complete functional/non-functional requirements, use cases, business rules, and traceability. | **COMPLETED** (BRS, SCUCS, SRS Approved) |
| **Level 3: Architecture** | Approved system design, 20 ADRs, C4 models, DDD boundaries, and ML architecture. | **COMPLETED** (HLD, ADRs, MLAD Approved) |
| **Level 4: Infrastructure** | Monorepo setup, gRPC proto contracts, shared packages, CI/CD pipelines, Docker Compose. | **COMPLETED** (Sprint 0 Deliverables) |
| **Level 5: Implementation** | Microservice engine development, stream ingestion, causal graph, AI triage, UI workspace. | *IN PROGRESS* (Sprints 1–5) |
| **Level 6: Testing & Audit** | End-to-end load testing (150k EPS), mTLS security audit, chaos engineering, SOC 2 prep. | *PLANNED* (Sprint 6) |
| **Level 7: Production Pilot**| Multi-region cloud pilot deployment, live partner customer onboarding, continuous MLOps. | *PLANNED* (Post-MVP Release) |

---

## Table of Contents

- **Front Matter**
  - Cover Page
  - Copyright & Legal Notice
  - Preface
  - Foreword
  - Document Control & Version History
  - Executive Dashboard
  - Architecture Timeline
  - Engineering Maturity Model
  - Table of Contents
  - List of Figures
  - List of Tables
  - List of Diagrams
  - Abbreviations
  - Glossary Overview
- **PART I: PROJECT FOUNDATION**
  - [Chapter 1: Executive Summary](#chapter-1-executive-summary)
  - [Chapter 2: Cyber Security Industry Background](#chapter-2-cyber-security-industry-background)
  - [Chapter 3: Problem Statement](#chapter-3-problem-statement)
  - [Chapter 4: Vision, Mission & Product Philosophy](#chapter-4-vision-mission--product-philosophy)
  - [Chapter 5: Business Objectives](#chapter-5-business-objectives)
  - [Chapter 6: Business Scope](#chapter-6-business-scope)
  - [Chapter 7: Stakeholders](#chapter-7-stakeholders)
- **PART II: REQUIREMENTS ENGINEERING**
  - [Chapter 8: Business Requirements](#chapter-8-business-requirements)
  - [Chapter 9: System Context](#chapter-9-system-context)
  - [Chapter 10: Use Cases](#chapter-10-use-cases)
  - [Chapter 11: Business Rules](#chapter-11-business-rules)
  - [Chapter 12: Software Requirements](#chapter-12-software-requirements)
- **PART III: ENTERPRISE ARCHITECTURE**
  - [Chapter 13: Architecture Overview](#chapter-13-architecture-overview)
  - [Chapter 14: Architecture Decision Records](#chapter-14-architecture-decision-records)
  - [Chapter 15: High-Level Design](#chapter-15-high-level-design)
- **PART IV: ARTIFICIAL INTELLIGENCE**
  - [Chapter 16: Machine Learning Architecture](#chapter-16-machine-learning-architecture)
- **PART V: ENGINEERING FOUNDATION**
  - [Chapter 17: Repository Structure](#chapter-17-repository-structure)
  - [Chapter 18: Development Standards](#chapter-18-development-standards)
  - [Chapter 19: Environment Configuration](#chapter-19-environment-configuration)
  - [Chapter 20: Containerization Strategy](#chapter-20-containerization-strategy)
  - [Chapter 21: Shared Engineering Libraries](#chapter-21-shared-engineering-libraries)
  - [Chapter 22: CI/CD Pipeline](#chapter-22-cicd-pipeline)
- **PART VI: IMPLEMENTATION**
  - [Chapter 23: Engineering Roadmap](#chapter-23-engineering-roadmap)
  - [Chapter 24: Sprint 0 Foundation Release Retrospective](#chapter-24-sprint-0-foundation-release-retrospective)
- **PART VII: APPENDICES**
  - [Appendix A: Complete Glossary](#appendix-a-complete-glossary)
  - [Appendix B: References](#appendix-b-references)
  - [Appendix C: Architecture Traceability Matrix](#appendix-c-architecture-traceability-matrix)
  - [Appendix D: Technology Decision Summary](#appendix-d-technology-decision-summary)
  - [Appendix E: Engineering Metrics](#appendix-e-engineering-metrics)
  - [Appendix F: Risk Register](#appendix-f-risk-register)
  - [Appendix G: Future Roadmap](#appendix-g-future-roadmap)
  - [Appendix H: Executive Sign-Off](#appendix-h-executive-sign-off)

---

## List of Figures

- `Figure 1.1`: SentinelAI Platform Conceptual Architecture (`Chapter 1`)
- `Figure 2.1`: Legacy Fragmented Telemetry Landscape vs. Unified Ingestion (`Chapter 2`)
- `Figure 3.1`: The Human Capacity Breakdown in Legacy SOC Operations (`Chapter 3`)
- `Figure 4.1`: The Four Pillars of SentinelAI Design Philosophy (`Chapter 4`)
- `Figure 5.1`: Target Metrics: MTTD < 60s, MTTR < 5m, Noise Cut > 80% (`Chapter 5`)
- `Figure 6.1`: System Scope Boundary: Core Platform vs. External Integrations (`Chapter 6`)
- `Figure 7.1`: Stakeholder Ecosystem Map (`Chapter 7`)
- `Figure 8.1`: Strategic Release Roadmap (MVP v1.0 through v3.0) (`Chapter 8`)
- `Figure 9.1`: Detailed System Boundary Model (`Chapter 9`)
- `Figure 10.1`: Use Case Dependency Topology (`Chapter 10`)
- `Figure 11.1`: Asset Criticality Policy Guardrail Decision Tree (`Chapter 11`)
- `Figure 12.1`: Logical Component Decomposition Architecture (`Chapter 12`)
- `Figure 13.1`: Decoupled Reactive Microservices Substrate Diagram (`Chapter 13`)
- `Figure 15.1`: C4 Level 1 System Context Diagram (`Chapter 15`)
- `Figure 15.2`: C4 Level 2 Container Architecture Diagram (`Chapter 15`)
- `Figure 15.3`: C4 Level 3 Component Diagram for Ingestion & Graph Subsystems (`Chapter 15`)
- `Figure 15.4`: DDD Bounded Context Map Diagram (`Chapter 15`)
- `Figure 15.5`: Zero-Trust Security & Trust Boundary Topology (`Chapter 15`)
- `Figure 15.6`: Cloud Deployment Topology Diagram (`Chapter 15`)
- `Figure 16.1`: End-to-End Multi-Agent ML Inference Pipeline Diagram (`Chapter 16`)
- `Figure 16.2`: Feature Store Dual-Layer Architecture Diagram (`Chapter 16`)
- `Figure 17.1`: Turborepo Monorepo Codebase Tree Architecture (`Chapter 17`)
- `Figure 20.1`: Multi-Stage Security-Hardened Docker Build Pipeline (`Chapter 20`)
- `Figure 21.1`: Shared Engineering Packages Dependency Graph (`Chapter 21`)
- `Figure 22.1`: GitHub Actions CI/CD Quality Gate Pipeline (`Chapter 22`)

---

## List of Tables

- `Table 1.1`: SentinelAI Strategic Platform Summary (`Chapter 1`)
- `Table 2.1`: Evolutionary Phases of Security Incident Response Systems (`Chapter 2`)
- `Table 3.1`: Comparative Matrix: Legacy SIEM/SOAR vs. SentinelAI Architecture (`Chapter 3`)
- `Table 4.1`: Product Philosophy Core Principles & Operational Mandates (`Chapter 4`)
- `Table 5.1`: Quantified Business Objectives & Target Performance Key Performance Indicators (`Chapter 5`)
- `Table 6.1`: Comprehensive Functional & Technical Scope Boundary Matrix (`Chapter 6`)
- `Table 7.1`: Stakeholder Roles, Perspectives, and Governance Responsibilities (`Chapter 7`)
- `Table 7.2`: RACI Responsibility Matrix for Engineering & Operational Workstreams (`Chapter 7`)
- `Table 8.1`: Strategic Business Objectives & Operational KPI Targets (`Chapter 8`)
- `Table 8.2`: Comprehensive User Persona Summary (`Chapter 8`)
- `Table 9.1`: Inside vs. Outside System Boundary Definition (`Chapter 9`)
- `Table 9.2`: Human External Actor Classification & Access Levels (`Chapter 9`)
- `Table 9.3`: Automated External System Interfaces (`Chapter 9`)
- `Table 10.1`: Complete System Use Case Catalogue (UC-001 to UC-012) (`Chapter 10`)
- `Table 11.1`: Formal Business Rules Specification Matrix (BR-001 to BR-006) (`Chapter 11`)
- `Table 12.1`: Functional Requirements Summary Matrix (SRS-FR-001 to 024) (`Chapter 12`)
- `Table 12.2`: Non-Functional Requirements Performance & Security Summary (`Chapter 12`)
- `Table 12.3`: Software Module Architecture Breakdown (`Chapter 12`)
- `Table 13.1`: Architectural Principles & Governing ADR References (`Chapter 13`)
- `Table 14.1`: Architecture Decision Records (ADR-0001 to ADR-0020) Summary Index (`Chapter 14`)
- `Table 15.1`: Microservice Landscape Decomposition (11 Microservices) (`Chapter 15`)
- `Table 15.2`: Observability Telemetry Matrix (`Chapter 15`)
- `Table 15.3`: Master Architecture Traceability Matrix (`Chapter 15`)
- `Table 16.1`: ML Algorithm Selection & Design Rationale Comparison (`Chapter 16`)
- `Table 16.2`: Adversarial ML Threat Matrix & Mitigation Strategies (`Chapter 16`)
- `Table 16.3`: AI Architecture Traceability Matrix (`Chapter 16`)
- `Table 17.1`: Monorepo Directory Boundary Matrix (`Chapter 17`)
- `Table 18.1`: Development & Coding Standards Summary (`Chapter 18`)
- `Table 19.1`: Dotenv Configuration Hierarchy & Environment Profiles (`Chapter 19`)
- `Table 21.1`: Shared Engineering Packages Specifications (12 Packages) (`Chapter 21`)
- `Table 22.1`: CI/CD Pipeline Automation Workflows (`Chapter 22`)

---

## List of Diagrams

- `Diagram 1.1`: High-Level Data Ingestion to Action Flow (`Chapter 1`)
- `Diagram 2.1`: Fragmented Telemetry Silos Flow Diagram (`Chapter 2`)
- `Diagram 3.1`: Alert Explosion Bottleneck Flowchart (`Chapter 3`)
- `Diagram 4.1`: Deterministic XAI Validation Loop (`Chapter 4`)
- `Diagram 6.1`: System In-Scope vs Out-of-Scope Architecture Boundary Diagram (`Chapter 6`)
- `Diagram 8.1`: Current Painful State vs. SentinelAI Desired State Flow (`Chapter 8`)
- `Diagram 9.1`: ASCII System Context Model Diagram (`Chapter 9`)
- `Diagram 11.1`: Policy-Governed Action Evaluation Sequence (`Chapter 11`)
- `Diagram 12.1`: High-Level Software Subsystem Sequence Model (`Chapter 12`)
- `Diagram 13.1`: Hybrid Communication Model Sequence Flow (`Chapter 13`)
- `Diagram 15.1`: End-to-End Event Stream to Remediation Sequence Flow (`Chapter 15`)
- `Diagram 16.1`: Offline vs. Online Inference Feature Flow (`Chapter 16`)
- `Diagram 16.2`: Analyst Feedback Active Learning Loop Flow (`Chapter 16`)

---

## Abbreviations

| Abbreviation | Full Term / Meaning |
| :--- | :--- |
| **ABAC** | Attribute-Based Access Control |
| **ADR** | Architecture Decision Record |
| **API** | Application Programming Interface |
| **AWS** | Amazon Web Services |
| **BRS** | Business Requirements Specification |
| **CISO** | Chief Information Security Officer |
| **CTO** | Chief Technology Officer |
| **DDD** | Domain-Driven Design |
| **EDR** | Endpoint Detection and Response |
| **EPS** | Events Per Second |
| **gRPC** | gRPC Remote Procedure Call |
| **HLD** | High-Level Design |
| **KMS** | Key Management Service |
| **MITRE** | MITRE ATT&CK Framework |
| **MLAD** | Machine Learning Architecture Document |
| **mTLS** | Mutual Transport Layer Security |
| **MTTD** | Mean Time to Detect |
| **MTTR** | Mean Time to Respond |
| **OCSF** | Open Cybersecurity Schema Framework |
| **PVD** | Product Vision Document |
| **RACI** | Responsible, Accountable, Consulted, Informed |
| **RBAC** | Role-Based Access Control |
| **SHAP** | SHapley Additive exPlanations |
| **SIEM** | Security Information and Event Management |
| **SOAR** | Security Orchestration, Automation, and Response |
| **SOC** | Security Operations Center |
| **SRS** | Software Requirements Specification |
| **TDIR** | Threat Detection, Investigation, and Incident Response |
| **XAI** | Explainable Artificial Intelligence |

---

## Glossary Overview

- **Causal Graph Engine**: The core in-memory temporal graph module that correlates security events into directional entity attack chains across time.
- **Incident Story**: A unified, contextual security incident output aggregating multiple related alerts into a single actionable narrative.
- **Noise Suppression**: Algorithmic filtering of benign, routine enterprise activity baselines to eliminate alert fatigue.
- **Stage 1 Assistive Mode**: Operator-in-the-loop response mode requiring one-click human confirmation before action execution.
- **Stage 2 Automated Mode**: Autonomous execution of verified remediation actions on non-critical assets based on strict policy rules.
- **XAI Lineage Validation**: Cryptographic and token-level verification proving that every AI claim is backed by raw log line evidence.

<div class="page-break"></div>

<h1 class="part-header">PART I: PROJECT FOUNDATION</h1>

---

# Chapter 1: Executive Summary

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Provide an executive-level introduction to SentinelAI, outlining the market rationale, high-level platform architecture, key operational goals, and strategic impact for enterprise SOC operations.</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Establish the strategic rationale for the SentinelAI platform.</li>
    <li>Detail the high-level platform architecture and operational throughput parameters.</li>
    <li>Summarize the core target performance metrics (MTTD, MTTR, Noise Reduction).</li>
</ul>

<h4>Chapter Overview</h4>
<p>SentinelAI is an Autonomous AI-Powered Threat Detection, Investigation, and Incident Response (TDIR) Platform engineered to resolve alert fatigue and response delays in modern enterprise SOCs.</p>
</div>

## 1.1 Platform Rationale

Modern Security Operations Centers (SOCs) are overwhelmed by thousands of disconnected security alerts per day across endpoint, cloud, identity, and network telemetry sources. SentinelAI unifies these siloed streams into a dynamic temporal causal graph, triages incidents using specialized AI subagents, grounds all generated narrative assertions in raw log evidence, and executes automated remediation playbooks under strict policy guardrails.

```
+-----------------------------------------------------------------------------------+
|         FIGURE 1.1: SENTINELAI PLATFORM CONCEPTUAL ARCHITECTURE                   |
+-----------------------------------------------------------------------------------+
|  [ Multi-Source Telemetry Ingestion ] (100k+ EPS, OCSF v1.1 Normalization)        |
|                                   │                                               |
|                                   ▼                                               |
|  [ Dynamic Temporal Causal Graph Engine ] (In-Memory Entity & Edge Graph)         |
|                                   │                                               |
|                                   ▼                                               |
|  [ Multi-Agent AI Supervisor ] (Isolation Forest + XGBoost + MITRE Mapping)       |
|                                   │                                               |
|                                   ▼                                               |
|  [ Explainable AI (XAI) Lineage Engine ] (100% Deterministic Evidence Validation) |
|                                   │                                               |
|                                   ▼                                               |
|  [ Policy Guardrail & Action Orchestrator ] (Stage 1 Assistive / Stage 2 Automated) |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 1.1: SentinelAI Platform Conceptual Architecture</div>

## 1.2 Operational Performance Metrics

Table 1.1 details the strategic platform parameters established for the SentinelAI platform baseline.

| Pillar / Metric Parameter | Approved Baseline Value | Governing Reference |
| :--- | :--- | :--- |
| **Mean Time to Detect (MTTD)** | `< 60 seconds` end-to-end execution | `BO-1`, `PVD Section 4.1` |
| **Mean Time to Respond (MTTR)** | `< 5 minutes` automated remediation | `BO-2`, `PVD Section 4.2` |
| **Noise Suppression Rate** | `> 80%` false positive alert reduction | `BO-3`, `PVD Section 4.3` |
| **XAI Grounding Guarantee** | `100%` verified token lineage to raw logs | `BR-001`, `ADR-0010` |
| **Ingestion Target Velocity**| `100,000+ EPS` per cluster node | `SRS-NFR-PERF-01` |

<div class="table-caption">Table 1.1: SentinelAI Strategic Platform Summary</div>

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>SentinelAI solves alert fatigue by synthesizing thousands of raw alerts into actionable Incident Stories.</li>
    <li>Strict target SLA: MTTD < 60s, MTTR < 5m, Noise Cut > 80%, 100% XAI lineage.</li>
    <li>Decoupled, event-driven reactive microservices architecture.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-2-cyber-security-industry-background">Chapter 2</a> for Cyber Security Industry Background and <a href="#chapter-4-vision-mission--product-philosophy">Chapter 4</a> for Product Philosophy.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 2 explores the evolution of TDIR systems from Gen 1 legacy SIEMs to Gen 4 Autonomous AI platforms.</p>
</div>

<div class="page-break"></div>

# Chapter 2: Cyber Security Industry Background

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Examine the evolutionary history of Threat Detection, Investigation, and Response (TDIR) systems and document the industry tailwinds driving the need for autonomous AI architecture.</p>
</div>

## 2.1 Evolution of TDIR Systems

Table 2.1 traces the four generational phases of security incident response systems.

| Generation | Era | Primary Architecture | Key Deficiencies |
| :--- | :--- | :--- | :--- |
| **Gen 1: SIEM** | 2000s | Centralized SQL/Log Storage | Static threshold rules; massive false positive alert noise. |
| **Gen 2: SOAR** | 2010s | Scripted Workflow Automation | Brittle Python playbooks; high maintenance overhead. |
| **Gen 3: XDR** | 2020s | Proprietary Vendor Ecosystems | Vendor lock-in; fragmented across non-native telemetry. |
| **Gen 4: SentinelAI**| 2026+ | Dynamic Causal Graph + Multi-Agent AI | Vendor-agnostic OCSF, XAI evidence lineage, policy guardrails. |

<div class="table-caption">Table 2.1: Evolutionary Phases of Security Incident Response Systems</div>

<div class="page-break"></div>

# Chapter 3: Problem Statement

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Define the core systemic bottlenecks in modern SOC operations, detailing the alert explosion crisis, context fragmentation, and human analyst burnout.</p>
</div>

## 3.1 The Alert Explosion Crisis

Modern enterprises log over 100,000 security events per second across multi-cloud infrastructure. Legacy SIEM systems generate thousands of alerts daily, 85%+ of which are false positives or routine noise, leading to analyst burnout and missed critical breaches.

```
+-----------------------------------------------------------------------------------+
|      DIAGRAM 3.1: ALERT EXPLOSION BOTTLENECK FLOWCHART                            |
+-----------------------------------------------------------------------------------+
|  [ 100,000+ Raw Log Events / sec ]                                                |
|                   │                                                               |
|                   ▼                                                               |
|  [ Legacy SIEM Rules Engine ] ──► Generates 5,000+ Alerts / day                   |
|                   │                                                               |
|                   ▼                                                               |
|  [ Human Analyst Team ] ──► Capacity: ~150 Alerts / day (Fatigue & Burnout)       |
|                   │                                                               |
|                   ▼                                                               |
|  [ 4,850+ Unexamined Alerts ] ──► Critical Attack Vectors Missed                  |
+-----------------------------------------------------------------------------------+
```
<div class="diagram-caption">Diagram 3.1: Alert Explosion Bottleneck Flowchart</div>

<div class="page-break"></div>

# Chapter 4: Vision, Mission & Product Philosophy

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Articulate the core vision, mission, and strategic engineering philosophy guiding SentinelAI platform design.</p>
</div>

## 4.1 Four Pillars of Product Philosophy

```
+-----------------------------------------------------------------------------------+
|      FIGURE 4.1: THE FOUR PILLARS OF SENTINELAI DESIGN PHILOSOPHY                 |
+-----------------------------------------------------------------------------------+
|   Pillar 1: Evidence-Grounded XAI  │  Pillar 2: Dynamic Temporal Graph            |
|  (Zero Hallucinations, Raw Logs)   │  (Entity Chains, Cross-Domain Context)       |
|  ──────────────────────────────────┼───────────────────────────────────────────── |
|   Pillar 3: Multi-Agent Triage     │  Pillar 4: Policy-Governed Remediation      |
|  (Isolation Forest + XGBoost)      │  (Stage 1 Assistive / Stage 2 Guardrails)   |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 4.1: The Four Pillars of SentinelAI Design Philosophy</div>

<div class="page-break"></div>

# Chapter 5: Business Objectives

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Detail the six quantified business objectives (`BO-1` through `BO-6`) driving platform metrics.</p>
</div>

## 5.1 Quantified Business Objectives Matrix

Table 5.1 lists the governing business objectives and baseline targets.

| ID | Objective Description | Target Metric Baseline |
| :--- | :--- | :--- |
| **BO-1** | Rapid Threat Detection SLA | MTTD < 60 seconds end-to-end |
| **BO-2** | Autonomous Incident Remediation | MTTR < 5 minutes for Stage 2 actions |
| **BO-3** | False Positive Reduction | > 80% reduction in alert volume |
| **BO-4** | Zero Hallucination Lineage | 100% verified breadcrumb linkage |
| **BO-5** | Open Standard Native Ingestion | OCSF v1.1 native schema normalization |
| **BO-6** | Policy-Governed Action Control | 100% ABAC asset guardrail enforcement |

<div class="table-caption">Table 5.1: Quantified Business Objectives & Target Performance Key Performance Indicators</div>

<div class="page-break"></div>

# Chapter 6: Business Scope

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Define the functional and technical scope boundaries of the SentinelAI platform baseline.</p>
</div>

## 6.1 Scope Boundary Definition

```
+-----------------------------------------------------------------------------------+
|      DIAGRAM 6.1: SYSTEM IN-SCOPE VS OUT-OF-SCOPE ARCHITECTURE BOUNDARY           |
+-----------------------------------------------------------------------------------+
|  IN-SCOPE (SentinelAI Core Platform Boundary)                                     |
|  • OCSF Normalization • Temporal Causal Graph • Multi-Agent AI • XAI Lineage      |
|  ───────────────────────────────────────────────────────────────────────────────  |
|  OUT-OF-SCOPE (External Enterprise Ecosystem)                                     |
|  • Raw Log Storage Data Lakes • Proprietary EDR Agents • Identity Providers      |
+-----------------------------------------------------------------------------------+
```
<div class="diagram-caption">Diagram 6.1: System In-Scope vs Out-of-Scope Architecture Boundary Diagram</div>

<div class="page-break"></div>

# Chapter 7: Stakeholders

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Map the organizational stakeholder ecosystem and RACI responsibilities governing the platform.</p>
</div>

## 7.1 RACI Responsibility Matrix

Table 7.2 details the RACI responsibility allocations across key workstreams.

| Workstream Domain | CTO | CISO | Lead Arch | ML Lead | Sec Ops Lead |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Core Platform Architecture** | **A** | C | **R** | C | C |
| **Multi-Agent AI Design** | A | C | C | **R** | C |
| **Policy Guardrails & Security** | A | **A** | C | C | **R** |
| **Incident Response Operations**| I | A | C | I | **R** |

<div class="table-caption">Table 7.2: RACI Responsibility Matrix for Engineering & Operational Workstreams</div>

<div class="page-break"></div>

<h1 class="part-header">PART II: REQUIREMENTS ENGINEERING</h1>

---

# Chapter 8: Business Requirements

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Document the formal business requirements, operational KPIs, user personas, and strategic release roadmap.</p>
</div>

## 8.1 User Personas Summary

Table 8.2 summarizes the primary operational personas interacting with SentinelAI.

| Persona ID | Role Title | Key Operational Goals | Primary Pain Points |
| :--- | :--- | :--- | :--- |
| **PERS-01** | Tier-1 SOC Analyst | Fast incident triage, clear context. | Alert fatigue, fragmented tools. |
| **PERS-02** | Lead Threat Hunter | Deep root cause analysis, timeline graph. | Lack of cross-domain visibility. |
| **PERS-03** | CISO / Security Director| Compliance, lower MTTR, risk metrics. | Uncontrolled automated actions. |

<div class="table-caption">Table 8.2: Comprehensive User Persona Summary</div>

<div class="page-break"></div>

# Chapter 9: System Context

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Define the external human actors, automated system interfaces, and environment boundaries (`SCUCS`).</p>
</div>

## 9.1 External System Interfaces

Table 9.3 defines the external API interfaces integrated with SentinelAI.

| Interface ID | Target System Category | Integration Standard | Data Flow Direction |
| :--- | :--- | :--- | :--- |
| **INT-01** | Cloud Telemetry (AWS/Azure) | REST / Webhook Stream | Inbound Telemetry |
| **INT-02** | EDR Agents (CrowdStrike/Defender)| REST / gRPC API | Inbound Telemetry & Outbound Remediation |
| **INT-03** | Identity Providers (Okta/Entra ID)| OAuth 2.0 / OIDC | Outbound Account Lockout Actions |

<div class="table-caption">Table 9.3: Automated External System Interfaces</div>

<div class="page-break"></div>

# Chapter 10: Use Cases

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Specify the complete system use case catalogue (`UC-001` through `UC-012`).</p>
</div>

## 10.1 Use Case Catalogue Summary

Table 10.1 details the system use cases governing platform interactions.

| Use Case ID | Use Case Title | Primary Actor | Trigger Event |
| :--- | :--- | :--- | :--- |
| **UC-001** | Ingest Multi-Source Telemetry | Stream Ingestion Engine | Raw log stream arrival |
| **UC-002** | Normalize Log Stream to OCSF | Normalizer Microservice | Ingested JSON event stream |
| **UC-003** | Construct Temporal Causal Graph | Graph Engine | Normalized OCSF event |
| **UC-004** | Execute Multi-Agent AI Triage | AI Supervisor | Graph entity cluster detection |
| **UC-005** | Validate XAI Lineage Evidence | XAI Lineage Engine | Model narrative prediction |
| **UC-006** | Synthesize Unified Incident Story| Story Aggregator | Validated XAI evidence bundle |
| **UC-007** | Execute Stage 1 Assistive Action | Tier-1 SOC Analyst | Analyst click confirmation |
| **UC-008** | Execute Stage 2 Automated Remediation| Policy Guardrail Engine| High-confidence policy match |
| **UC-009** | Process Analyst Active Feedback | Analyst Workspace | Analyst confirm/dismiss input |
| **UC-010** | Perform Natural Language Copilot QA| Analyst / Threat Hunter| User conversational query |
| **UC-011** | Enforce Asset Guardrail Rules | Policy Guardrail Engine| Remediation request |
| **UC-012** | Log Immutable Compliance Audit | Audit Governance Service| Any state change / action |

<div class="table-caption">Table 10.1: Complete System Use Case Catalogue (UC-001 to UC-012)</div>

<div class="page-break"></div>

# Chapter 11: Business Rules

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Document the formal business rules (`BR-001` through `BR-006`) dictating core operational logic.</p>
</div>

## 11.1 Business Rules Matrix

Table 11.1 details the formal business rules enforced across the system.

| Rule ID | Rule Category | Technical Rule Mandate |
| :--- | :--- | :--- |
| **BR-001** | XAI Lineage Validation | 100% of AI narrative claims must map to verified raw log line IDs (`ocsf_event_id`). |
| **BR-002** | Asset Criticality Guardrail | Stage 2 automated action is strictly forbidden on `Critical` assets ($W_{asset} \ge 2.0$). |
| **BR-003** | Immutable Audit Logging | All response actions and state transitions must be appended to hash-chained log stores. |
| **BR-004** | Noise Suppression Filter | Events matching baseline routine patterns must be suppressed from primary incident feeds. |
| **BR-005** | Uncertainty Escalation | Models with confidence $C_{model} < 0.80$ must escalate to human analysts. |
| **BR-006** | KMS CMK Isolation | Tenant encryption keys must remain cryptographically isolated in cloud KMS. |

<div class="table-caption">Table 11.1: Formal Business Rules Specification Matrix (BR-001 to BR-006)</div>

<div class="page-break"></div>

# Chapter 12: Software Requirements

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Specify the IEEE 830 / ISO 29148 Software Requirements Specification (SRS), detailing 24 Functional Requirements and 12 Non-Functional Requirements.</p>
</div>

## 12.1 Functional Requirements Summary

Table 12.1 details the functional requirements across seven core platform subsystems.

| Subsystem | Requirement ID | Functional Specification Summary |
| :--- | :--- | :--- |
| **Ingestion** | `SRS-FR-001..005` | High-throughput Kafka/gRPC stream ingestion, OCSF v1.1 mapping, metadata tagging. |
| **Causal Graph** | `SRS-FR-006..008` | In-memory temporal graph entity creation, sliding time windows, edge correlation. |
| **AI Subsystem** | `SRS-FR-009..013` | Isolation Forest anomaly score, XGBoost threat tiering, uncertainty escalation. |
| **XAI Subsystem** | `SRS-FR-014..015` | SHAP attribution weighting, token-level raw log evidence validation. |
| **Story Engine** | `SRS-FR-016..018` | Story synthesis, deduplication, real-time workspace pushes. |
| **Policy Engine** | `SRS-FR-019..021` | Stage 1/2 remediation, ABAC asset guardrail evaluation. |
| **Audit Engine** | `SRS-FR-022..024` | Cryptographic audit logging, compliance export, analytics reporting. |

<div class="table-caption">Table 12.1: Functional Requirements Summary Matrix (SRS-FR-001 to 024)</div>

<div class="page-break"></div>

<h1 class="part-header">PART III: ENTERPRISE ARCHITECTURE</h1>

---

# Chapter 13: Architecture Overview

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Provide an overview of the event-driven reactive microservices architecture, communication models, and governing architectural principles.</p>
</div>

## 13.1 Decoupled Reactive Substrate

```
+-----------------------------------------------------------------------------------+
|      FIGURE 13.1: DECOUPLED REACTIVE MICROSERVICES SUBSTRATE DIAGRAM              |
+-----------------------------------------------------------------------------------+
|  [ Ingestion Service ] ──► Stream Bus ──► [ OCSF Normalizer ] ──► Stream Bus     |
|                                                                       │           |
|                                                                       ▼           |
|  [ AI Supervisor ] ◄── Stream Bus ◄── [ Temporal Causal Graph Engine ]           |
|         │                                                                         |
|         ▼                                                                         |
|  [ XAI Lineage ] ──► [ Story Aggregator ] ──► [ Policy Guardrail & Action Exec ]  |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 13.1: Decoupled Reactive Microservices Substrate Diagram</div>

<div class="page-break"></div>

# Chapter 14: Architecture Decision Records

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Present the complete set of twenty Architecture Decision Records (ADR-0001 through ADR-0020) in formal MADR format.</p>
</div>

## 14.1 ADR Summary Index

Table 14.1 lists all twenty approved Architecture Decision Records.

| ADR ID | Title | Architectural Decision Summary |
| :--- | :--- | :--- |
| **ADR-0001** | Turborepo Monorepo Strategy | Unified monorepo codebase for all services and packages. |
| **ADR-0002** | Reactive Event-Driven Substrate | Kafka/gRPC streaming substrate for asynchronous microservices. |
| **ADR-0003** | gRPC & ProtoBuf Contract-First | Strict interface definition via Protocol Buffers. |
| **ADR-0004** | High-Velocity Log Ingestion Stream | Decoupled streaming ingestion supporting 100k+ EPS. |
| **ADR-0005** | OCSF v1.1 Schema Standard | Universal log normalization standard across all vendors. |
| **ADR-0006** | Cloud KMS Envelope Encryption | AES-256 GCM encryption with customer-managed keys. |
| **ADR-0007** | Dual-Layer Feature Store | In-memory key-value online store + Lakehouse offline store. |
| **ADR-0008** | Dynamic Temporal Causal Graph | Property graph entity correlation across temporal windows. |
| **ADR-0009** | Multi-Agent AI Architecture | Decoupled specialized ML subagents with AI Supervisor. |
| **ADR-0010** | Explainable AI (XAI) Lineage | Deterministic raw log token validation for AI claims. |
| **ADR-0011** | Zero-Trust Inter-Service Auth | Mutual TLS 1.3 with SPIFFE/SPIRE workload identities. |
| **ADR-0012** | ABAC Asset Guardrails | Attribute-based policy engine for remediation boundaries. |
| **ADR-0013** | OpenTelemetry Observability | Unified metrics, logs, and distributed tracing. |
| **ADR-0014** | Horizontal Pod Autoscaling | Kubernetes HPA based on stream lag and CPU utilization. |
| **ADR-0015** | Relational Audit Governance | Immutable append-only PostgreSQL store for audit logs. |
| **ADR-0016** | Cloud-Agnostic Containerization | OCI-compliant multi-stage Docker builds & Helm charts. |
| **ADR-0017** | Environment Dotenv Hierarchy | Tiered configuration management with boot schema validation. |
| **ADR-0018** | Protobuf Contract Compatibility | Automated breaking change detection via Buf in CI. |
| **ADR-0019** | Automated Test Pyramid | Enforced 80%+ unit test coverage quality gate. |
| **ADR-0020** | Multi-Tenant Data Isolation | Cryptographic tenant key separation in shared storage. |

<div class="table-caption">Table 14.1: Architecture Decision Records (ADR-0001 to ADR-0020) Summary Index</div>

<div class="page-break"></div>

# Chapter 15: High-Level Design

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Provide the High-Level Design (HLD) specification including C4 Models, DDD Bounded Contexts, Microservices Landscape, Security Architecture, and Master Traceability Matrix.</p>
</div>

## 15.1 Microservices Landscape Decomposition

Table 15.1 details the 11 microservices comprising the SentinelAI backend landscape.

| Service Name | Tech Stack | Primary Responsibility | Governing ADR |
| :--- | :--- | :--- | :--- |
| **`Ingestion-Collector`** | Go / Node.js | Multi-source stream capture & webhook receiver | `ADR-0004` |
| **`OCSF-Normalizer`** | Go | Vendor JSON parsing to OCSF v1.1 standard | `ADR-0005` |
| **`Causal-Graph`** | Go / C++ | In-memory temporal entity graph engine | `ADR-0008` |
| **`Story-Aggregator`** | Node.js / TS | Incident story clustering & narrative assembly | `ADR-0002` |
| **`AI-Supervisor`** | Python / FastAPI| Multi-agent triage coordination (Isolation Forest/XGBoost)| `ADR-0009` |
| **`XAI-Lineage`** | Python / Go | SHAP attribution & raw log token validation | `ADR-0010` |
| **`Policy-Guardrail`** | Go / OPA | Asset criticality ABAC rule evaluation | `ADR-0012` |
| **`Action-Orchestrator`** | Go | Outbound EDR/IAM action execution connectors | `ADR-0012` |
| **`Copilot-Service`** | Python / LangChain| Natural language conversational QA engine | `ADR-0009` |
| **`Audit-Governance`** | Go | Hash-chained SHA-256 immutable audit logging | `ADR-0015` |
| **`Executive-Analytics`**| React / Node.js | Real-time MTTD/MTTR analytics dashboard | `ADR-0013` |

<div class="table-caption">Table 15.1: Microservice Landscape Decomposition (11 Microservices)</div>

<div class="page-break"></div>

<h1 class="part-header">PART IV: ARTIFICIAL INTELLIGENCE</h1>

---

# Chapter 16: Machine Learning Architecture

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Provide a comprehensive specification of the Artificial Intelligence and Machine Learning Architecture for SentinelAI, detailing the multi-agent ensemble, algorithm selection rationales, XAI lineage, drift detection, and MLOps lifecycle.</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Detail the Multi-Agent AI architecture and end-to-end ML pipeline (`ADR-0009`).</li>
    <li>Provide explicit algorithmic design rationales comparing Isolation Forest, XGBoost, SHAP, and Graph algorithms against alternative approaches.</li>
    <li>Formulate composite confidence ($C_{model}$) and risk scoring ($R_{incident}$) equations.</li>
    <li>Specify MLOps governance, drift detection (KS-test / PSI), active feedback loops, and adversarial threat defenses.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter documents the intelligence layer converting temporal attack graphs into explainable, policy-governed threat insights.</p>
</div>

## 16.1 AI System Architecture Overview

The SentinelAI intelligence layer decouples raw anomaly detection from supervised threat classification, explainability, and policy enforcement (`ADR-0009`).

```
+-----------------------------------------------------------------------------------+
|     FIGURE 16.1: END-TO-END MULTI-AGENT ML INFERENCE PIPELINE DIAGRAM             |
+-----------------------------------------------------------------------------------+
|  [ Dynamic Temporal Causal Graph Engine ] (Entity Nodes & Time Edges)              |
|                                         │                                         |
|                                         ▼                                         |
|  +-----------------------------------------------------------------------------+  |
|  | MULTI-AGENT AI TRIAGE ENSEMBLE (`AI-Supervisor-Service`)                     |  |
|  |  • Subagent 1: Isolation Forest (Unsupervised Anomaly Score $A$)              |  |
|  |  • Subagent 2: XGBoost Classifier (Supervised Threat Severity Score $S_{XGB}$) |  |
|  |  • Subagent 3: MITRE ATT&CK Mapper (Technique ID Pattern Matching)            |  |
|  |  • Subagent 4: SHAP Explainer (Feature Attribution Weights)                   |  |
|  +-----------------------------------------------------------------------------+  |
|                                         │                                         |
|                                         ▼                                         |
|  [ Risk Engine ] ──► Calculates $C_{model} = 0.3A + 0.5P + 0.2G$ & $R_{incident}$ |
|                                         │                                         |
|                                         ▼                                         |
|  [ XAI Lineage Engine ] ──► Validates 100% Claims to `ocsf_event_id` Tokens       |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 16.1: End-to-End Multi-Agent ML Inference Pipeline Diagram</div>

## 16.2 Feature Engineering & Dual-Layer Feature Store

Feature extraction operates across three dimensions: Entity Behavioral (velocity, entropy), Graph Topological (degree centrality, hop count), and Threat Intel (IoC distance, ATT&CK co-occurrence).

```
+-----------------------------------------------------------------------------------+
|             FIGURE 16.2: FEATURE STORE DUAL-LAYER ARCHITECTURE DIAGRAM            |
+-----------------------------------------------------------------------------------+
|  [ ONLINE FEATURE STORE ]                  [ OFFLINE FEATURE STORE ]              |
|  (In-Memory Key-Value Store)               (Columnar Lakehouse Storage)           |
|  ---------------------------               ----------------------------           |
|  • Sub-millisecond lookup latency          • Historical multi-year time series    |
|  • Serves real-time ML inference (<5s SLA) • Serves model training & backtesting  |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 16.2: Feature Store Dual-Layer Architecture Diagram</div>

## 16.3 Algorithmic Component Analysis & Design Rationales

Table 16.1 details the algorithmic design rationales explaining why SentinelAI selected specific algorithms instead of alternative approaches.

| ML Component | Inputs & Outputs | Primary Function | Why Selected (Design Rationale vs. Alternatives) |
| :--- | :--- | :--- | :--- |
| **Isolation Forest** | **In:** Entity feature vectors<br>**Out:** Anomaly Score $A \in [0, 1]$ | Unsupervised Anomaly Detection | **Why selected:** Isolates anomalies via random partitioning with $O(n)$ time complexity. *Alternative Rejected:* Autoencoders are computationally heavy and lack streaming speed. |
| **XGBoost Classifier** | **In:** OCSF attributes + Graph metrics<br>**Out:** Severity Tier ($S_{XGB}$) | Supervised Threat Classification | **Why selected:** Highest precision on tabular data, handles missing values natively, sub-millisecond execution. *Alternative Rejected:* Deep Neural Nets overfit tabular log data. |
| **SHAP Explainer** | **In:** XGBoost prediction weights<br>**Out:** Local feature attribution $\phi_i$ | Explainable AI Attribution | **Why selected:** Game-theoretic consistency guarantees exact local feature importance. *Alternative Rejected:* LIME is non-deterministic and yields unstable weights across runs. |
| **Louvain & PageRank** | **In:** Causal Property Graph<br>**Out:** Cluster IDs & Node Centrality | Temporal Graph Analytics | **Why selected:** Louvain aggregates dense attack clusters in $O(N \log N)$ time; PageRank identifies primary compromised entry nodes (`ADR-0008`). |

<div class="table-caption">Table 16.1: ML Algorithm Selection & Design Rationale Comparison</div>

## 16.4 Scoring Engines: Confidence & Incident Risk

### Composite Confidence Score ($C_{model}$)
Model confidence combines Isolation Forest anomaly score ($A$), XGBoost probability ($P$), and Graph edge density ($G$):

$$C_{model} = (0.3 \cdot A) + (0.5 \cdot P) + (0.2 \cdot G)$$

If $C_{model} < 0.80$, the Incident Story is automatically tagged with `UNCERTAINTY_ESCALATION` for mandatory human triage (`BR-005`, `SRS-FR-013`).

### Incident Risk Score ($R_{incident}$)
Incident severity is calculated by combining asset criticality weight ($W_{asset}$), threat score ($S_{threat}$), and confidence ($C_{model}$):

$$R_{incident} = W_{asset} 	imes S_{threat} 	imes C_{model}$$

Where $W_{asset} = 2.5$ for `Critical` infrastructure assets and $1.0$ for standard endpoints (`BR-002`).

## 16.5 Model Drift Detection, Active Learning & MLOps

* **Drift Monitoring:** Serves daily Kolmogorov-Smirnov (KS) tests and Population Stability Index (PSI) tracking. If PSI $> 0.25$, an automated retraining trigger is issued.
* **Analyst Active Learning:** Confirmed true positive or false positive labels from analysts update the active learning sample pool, tuning behavioral baselines (`BR-004`).
* **Adversarial Security:** Table 16.2 lists mitigations against adversarial ML attacks.

| Threat ID | Adversarial Threat Description | Impact | Technical Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **AML-001** | Telemetry Log Poisoning | High | Robust feature scaling and supervised analyst label verification. |
| **AML-002** | Adversarial Log Evasion | High | Multi-modal feature extraction combining graph topology with command entropy. |
| **AML-003** | Prompt Injection in Log Fields | Medium | Complete segregation of natural language prompts from telemetry payload schemas. |

<div class="table-caption">Table 16.2: Adversarial ML Threat Matrix & Mitigation Strategies</div>

## 16.6 AI Architecture Traceability Matrix

Table 16.3 maps ML components back to Software Requirements, Microservices, and ADRs.

| AI / ML Component | Software Requirement ID | Implementing Microservice | Governing ADR |
| :--- | :--- | :--- | :--- |
| **Isolation Forest Subagent** | `SRS-FR-009`, `SRS-FR-010` | `AI-Supervisor-Service` | `ADR-0009` |
| **XGBoost Classifier** | `SRS-FR-009` | `AI-Supervisor-Service` | `ADR-0009` |
| **SHAP Lineage Explainer** | `SRS-FR-014`, `SRS-FR-015` | `XAI-Lineage-Service` | `ADR-0010` |
| **AI Supervisor Coordinator** | `SRS-FR-009`, `SRS-FR-013` | `AI-Supervisor-Service` | `ADR-0009` |

<div class="table-caption">Table 16.3: AI Architecture Traceability Matrix</div>

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>The ML architecture combines Isolation Forest (Unsupervised) and XGBoost (Supervised) into a multi-agent ensemble.</li>
    <li>SHAP attribution weights enable `XAI-Lineage-Service` to validate 100% of claims back to raw log tokens (`BR-001`).</li>
    <li>Drift detection (PSI > 0.25) and active analyst feedback loops ensure continuous model optimization.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-15-high-level-design">Chapter 15</a> for HLD Microservices and <a href="#chapter-17-repository-structure">Chapter 17</a> for Repository Structure.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 17 introduces Part V (Engineering Foundation), detailing the Turborepo monorepo codebase structure and directory boundaries.</p>
</div>

<div class="page-break"></div>

<h1 class="part-header">PART V: ENGINEERING FOUNDATION</h1>

---

# Chapter 17: Repository Structure

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Document the Turborepo monorepo codebase structure, package boundaries, directory organization, and governance standards (`ADR-0001`).</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Detail the Turborepo monorepo directory tree (`sentinelai/`).</li>
    <li>Define package boundary rules separating applications, services, shared packages, and contracts.</li>
    <li>Evaluate architectural trade-offs, engineering benefits, and future scalability.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter provides the codebase organization specification governing all software implementation across the monorepo.</p>
</div>

## 17.1 Turborepo Monorepo Architecture

SentinelAI utilizes a single unified Turborepo monorepo codebase (`sentinelai/`), as specified in `ADR-0001` and illustrated in Figure 17.1.

```
+-----------------------------------------------------------------------------------+
|         FIGURE 17.1: TURBOREPO MONOREPO CODEBASE TREE ARCHITECTURE                |
+-----------------------------------------------------------------------------------+
|  sentinelai/                                                                      |
|  ├── .github/workflows/          # CI/CD GitHub Actions pipelines (`ci.yml`)      |
|  ├── contracts/                                                                   |
|  │   ├── proto/                  # gRPC Protocol Buffer service definitions        |
|  │   └── ocsf/                   # OCSF v1.1 event schema definitions             |
|  ├── docs/                       # Architecture & specification baselines         |
|  ├── services/                   # Microservice Backends                          |
|  │   ├── ingestion-collector/    # Stream ingestion service                       |
|  │   ├── ocsf-normalizer/        # Schema parsing & UUID service                  |
|  │   ├── causal-graph/           # In-memory temporal graph engine                |
|  │   ├── story-aggregator/       # Incident story aggregation service             |
|  │   ├── ai-supervisor/          # Multi-agent AI coordinator service             |
|  │   ├── xai-lineage/            # Raw log evidence validation service            |
|  │   ├── policy-guardrail/       # Asset tag & Stage 1/2 policy service           |
|  │   ├── action-orchestrator/    # External EDR/IAM action executor service       |
|  │   ├── copilot-service/        # Natural language conversation service          |
|  │   ├── audit-governance/       # Immutable audit & compliance service           |
|  │   └── executive-analytics/    # Real-time MTTD/MTTR analytics service          |
|  ├── ml/                         # AI Models & Pipelines                          |
|  │   ├── models/                 # Isolation Forest & XGBoost inference workers   |
|  │   ├── feature-store/          # Online/Offline feature store interfaces        |
|  │   └── pipelines/              # Training & drift detection scripts             |
|  ├── apps/                       # Frontend User Workspaces                       |
|  │   └── analyst-workspace/      # Incident UI, Graph Canvas & Copilot Drawer     |
|  ├── packages/                   # 12 Shared Monorepo Engineering Libraries       |
|  ├── deploy/                     # Kubernetes Helm Charts & OpenTofu IaC          |
|  └── tools/                      # Log stream generators & load testing tools     |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 17.1: Turborepo Monorepo Codebase Tree Architecture</div>

## 17.2 Directory Boundary Matrix

Table 17.1 details the engineering boundaries governing top-level monorepo directories.

| Directory Path | Engineering Scope | Governing Standard |
| :--- | :--- | :--- |
| `contracts/` | gRPC ProtoBuf & OCSF JSON schema definitions | Contract-First Development (`ADR-0003`, `ADR-0018`) |
| `services/` | 11 Microservice Backend implementations | Reactive Microservices (`ADR-0002`) |
| `ml/` | AI Subagents, Feature Store interfaces, training pipelines | Multi-Agent AI Architecture (`ADR-0009`, `MLAD`) |
| `apps/` | Frontend Web Analyst Workspace & UI components | Next.js / React Web Standards (`SRS-UI-001`) |
| `packages/` | 12 Shared TypeScript/Python engineering libraries | Code Reuse & Package Boundaries (`Chapter 21`) |
| `deploy/` | Helm Charts & OpenTofu IaC manifests | Cloud-Agnostic IaC (`ADR-0016`) |

<div class="table-caption">Table 17.1: Monorepo Directory Boundary Matrix</div>

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>The monorepo structure guarantees single-commit atomic PRs across contracts, microservices, and UI apps.</li>
    <li>Strict package boundaries prevent circular dependencies between shared packages and services.</li>
    <li>Turborepo build caching ensures fast CI compilation times.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-18-development-standards">Chapter 18</a> for Development Standards and <a href="#chapter-21-shared-engineering-libraries">Chapter 21</a> for Shared Libraries.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 18 specifies coding standards, naming conventions, Git Trunk-Based development strategies, and commit specifications.</p>
</div>

<div class="page-break"></div>

# Chapter 18: Development Standards

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Specify coding standards, naming conventions, Git branch strategies, and conventional commit standards governing software development.</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Establish strict language standards: TypeScript (strict mode) and Python (PEP 8, MyPy, Ruff).</li>
    <li>Detail the Trunk-Based Development Git branch strategy and short-lived feature branch workflow.</li>
    <li>Specify Conventional Commit requirements enforced via Commitlint and Husky git hooks.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter provides the code quality and version control guidelines required for all engineering contributions.</p>
</div>

## 18.1 Coding Standards & Naming Conventions

Table 18.1 details the language standards and naming conventions enforced across the codebase.

| Domain / Language | Standard / Formatter | Naming Convention Rules |
| :--- | :--- | :--- |
| **TypeScript / Node.js** | ESLint + Prettier + Strict `tsconfig` | PascalCase for Classes/Interfaces; camelCase for variables/functions; UPPER_CASE for constants. |
| **Python Services & ML** | PEP 8 + Black + Ruff + MyPy | PascalCase for Classes; snake_case for functions/variables; UPPER_CASE for constants. |
| **Go Microservices** | `gofmt` + `golangci-lint` | PascalCase for exported symbols; camelCase for unexported symbols. |
| **gRPC Protocol Buffers**| `protolint` | PascalCase for Message types; snake_case for field names; lowercase for package IDs. |

<div class="table-caption">Table 18.1: Development & Coding Standards Summary</div>

## 18.2 Git Strategy & Branching Philosophy

SentinelAI enforces **Trunk-Based Development** supplemented by dynamic feature flags (`ADR-0017`):

* **Main Branch (`main`):** Production-ready trunk. Direct pushes are prohibited (`SRS-NFR-SEC-05`).
* **Feature Branches (`feature/FEAT-x.y-description`):** Short-lived branches merged daily to `main`.
* **Commit Specifications:** All commits must comply with the Conventional Commits format:
  `feat(ingestion): add OCSF v1.1 parser for CrowdStrike EDR logs (FEAT-1.2)`
* **Git Hooks:** Pre-commit hooks (Husky) execute linting, type-checking, and commit-msg verification automatically.

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>Trunk-Based Development ensures short branch lifecycles and daily integrations into main behind feature flags.</li>
    <li>Pre-commit hooks validate linting, type safety, and Conventional Commit specifications.</li>
    <li>Strict static analysis (TypeScript strict mode, MyPy, golangci-lint) prevents runtime type errors.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-17-repository-structure">Chapter 17</a> for Repository Structure and <a href="#chapter-22-cicd-pipeline">Chapter 22</a> for CI/CD Pipelines.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 19 documents the Environment Configuration Strategy, Dotenv hierarchy, and secret management guidelines.</p>
</div>

<div class="page-break"></div>

# Chapter 19: Environment Configuration

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Document the environment configuration hierarchy, variable schema validation, and secret management strategy (`ADR-0017`).</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Detail the Dotenv configuration file hierarchy across local, staging, and production profiles.</li>
    <li>Specify runtime configuration schema validation using Zod.</li>
    <li>Document secret management and cloud KMS Customer-Managed Key (CMK) integration (`ADR-0006`).</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter provides the configuration management baseline ensuring zero secret hardcoding and safe multi-environment deployments.</p>
</div>

## 19.1 Dotenv Configuration Hierarchy

Configuration variables are resolved hierarchically as detailed in Table 19.1.

| Profile Level | File Identifier | Purpose & Access Control |
| :--- | :--- | :--- |
| **Template Baseline** | `.env.example` | Checked into Git; documents all required config keys with dummy values. |
| **Local Development** | `.env.local` | Git-ignored; local developer override values for container ports and mock keys. |
| **Staging Profile** | `.env.staging` | Managed via CI/CD secrets; staging cluster database endpoints. |
| **Production Profile** | `.env.production` | Managed via cloud KMS secrets engine; encrypted production environment values. |

<div class="table-caption">Table 19.1: Dotenv Configuration Hierarchy & Environment Profiles</div>

## 19.2 Schema Validation & Secret Management

* **Runtime Schema Validation:** Every microservice validates its environment variables at boot using `@sentinelai/config` (Zod schema parser). If a required variable is missing or invalid, the service aborts boot immediately with an explicit error log (`SRS-EH-001`).
* **Secret Storage Isolation:** API keys, database credentials, and mTLS certificates are stored exclusively in cloud secret managers (HashiCorp Vault / AWS Secrets Manager) and injected at runtime (`ADR-0006`).

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>Services validate configuration schemas at boot using Zod, preventing silent runtime failures.</li>
    <li>Zero secrets are checked into source control; production credentials use cloud KMS engines.</li>
    <li>Multi-environment profiles decouple local container testing from production Kubernetes clusters.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-20-containerization-strategy">Chapter 20</a> for Containerization and <a href="#chapter-21-shared-engineering-libraries">Chapter 21</a> for `@sentinelai/config`.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 20 details the Containerization Strategy, multi-stage Docker builds, and Docker Compose local orchestration.</p>
</div>

<div class="page-break"></div>

# Chapter 20: Containerization Strategy

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Document the containerization standards, multi-stage production Docker build optimization, non-root security contexts, and Docker Compose local emulation setup (`ADR-0016`).</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Detail multi-stage OCI-compliant Dockerfile build strategies.</li>
    <li>Specify non-root container security hardening practices.</li>
    <li>Document local development orchestration via `docker-compose.yml`.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter specifies container packaging rules ensuring fast build times, minimal attack surfaces, and reproducible deployments.</p>
</div>

## 20.1 Multi-Stage Production Build Optimization

All microservices are containerized using multi-stage Dockerfiles, as shown in Figure 20.1.

```
+-----------------------------------------------------------------------------------+
|      FIGURE 20.1: MULTI-STAGE SECURITY-HARDENED DOCKER BUILD PIPELINE             |
+-----------------------------------------------------------------------------------+
|  STAGE 1: BUILDER STAGE (Full SDK, Node/Go compilers, installs dependencies)       |
|            │                                                                      |
|            ▼ (Compiles binary / bundles JS)                                       |
|  STAGE 2: RUNTIME STAGE (Minimal Alpine/Distroless image, non-root user `appuser`)|
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 20.1: Multi-Stage Security-Hardened Docker Build Pipeline</div>

## 20.2 Non-Root Security Context & Local Emulation

* **Non-Root Execution:** All production container images execute as non-root user `appuser` (UID 10001) with read-only root filesystems (`SRS-NFR-SEC-05`).
* **Local Emulation Stack (`docker-compose.yml`):** Local developers launch the complete 11-microservice stack, stream buffer, in-memory graph, and PostgreSQL instance using a single command: `docker-compose up`.

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>Multi-stage Docker builds produce minimal runtime images (<50MB Alpine/Distroless), reducing vulnerability surfaces.</li>
    <li>All containers run as non-root users with read-only filesystems for Zero-Trust compliance.</li>
    <li>`docker-compose.yml` enables full 11-microservice local stack emulation.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-16-machine-learning-architecture">Chapter 16</a> for ML Serving Containers and <a href="#chapter-22-cicd-pipeline">Chapter 22</a> for Container Scanning in CI/CD.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 21 presents the twelve shared monorepo engineering libraries (`packages/`).</p>
</div>

<div class="page-break"></div>

# Chapter 21: Shared Engineering Libraries

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Specify the design, package boundaries, and specifications for the twelve shared monorepo engineering libraries (`packages/`).</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Detail the functional specifications for all 12 shared monorepo packages.</li>
    <li>Render the shared package dependency graph.</li>
    <li>Establish code reuse standards across frontend and backend applications.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter documents the foundational software libraries supporting all microservices and user interfaces.</p>
</div>

## 21.1 Monorepo Shared Packages Topology

SentinelAI organizes reusable logic into twelve shared TypeScript/Python packages within `packages/`, as detailed in Table 21.1 and Figure 21.1.

```
+-----------------------------------------------------------------------------------+
|          FIGURE 21.1: SHARED ENGINEERING PACKAGES DEPENDENCY GRAPH                |
+-----------------------------------------------------------------------------------+
|  [ @sentinelai/shared-types ] ──► [ @sentinelai/ocsf-types ]                      |
|                 │                                │                                |
|                 ▼                                ▼                                |
|  [ @sentinelai/errors ] ────────► [ @sentinelai/validation ]                      |
|                 │                                │                                |
|                 ▼                                ▼                                |
|  [ @sentinelai/logger ] ────────► [ @sentinelai/telemetry ]                       |
|                 │                                │                                |
|                 ▼                                ▼                                |
|  [ @sentinelai/security ] ──────► [ @sentinelai/secrets ]                         |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 21.1: Shared Engineering Packages Dependency Graph</div>

| Package Name | Functional Scope & Primary Modules | Governing Reference |
| :--- | :--- | :--- |
| **`@sentinelai/shared-types`** | Global TypeScript interfaces (`IncidentStory`, `EntityNode`, `UserRole`). | `ADR-0001` |
| **`@sentinelai/ocsf-types`** | OCSF v1.1 event class definitions & enum types. | `SRS-FR-004` |
| **`@sentinelai/logger`** | Structured JSON logging with trace injection (`trace_id`). | `ADR-0013` |
| **`@sentinelai/telemetry`** | OpenTelemetry SDK wrappers for Prometheus metrics & Jaeger tracing. | `ADR-0013` |
| **`@sentinelai/errors`** | Standardized domain exception classes (`ValidationError`, `AuthError`). | `SRS-EH-001` |
| **`@sentinelai/config`** | Centralized Zod environment variable schema parsing. | `ADR-0017` |
| **`@sentinelai/security`** | mTLS certificate validation & JWT token verification helpers. | `ADR-0011` |
| **`@sentinelai/secrets`** | Cloud KMS & Vault secret fetchers with in-memory caching. | `ADR-0006` |
| **`@sentinelai/utils`** | Shared helper utilities (UUID generators, time formatters). | `ADR-0001` |
| **`@sentinelai/validation`**| Data payload validators & sanitizers. | `SRS-FR-004` |
| **`@sentinelai/test-utils`**| Mock OCSF event generators & gRPC test client harnesses. | `ADR-0019` |
| **`@sentinelai/tsconfig`** | Shared strict TypeScript compiler configuration files (`tsconfig.json`). | `ADR-0001` |

<div class="table-caption">Table 21.1: Shared Engineering Packages Specifications (12 Packages)</div>

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>Twelve shared packages standardize logging, errors, types, telemetry, and security across the monorepo.</li>
    <li>Package boundaries prevent code duplication between microservices and frontend workspace applications.</li>
    <li>Shared `@sentinelai/tsconfig` enforces identical strict type-checking across all packages.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-17-repository-structure">Chapter 17</a> for Monorepo Structure and <a href="#chapter-22-cicd-pipeline">Chapter 22</a> for CI/CD Pipelines.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 22 details the CI/CD Pipeline, GitHub Actions workflows, quality gates, and branch protection rules.</p>
</div>

<div class="page-break"></div>

# Chapter 22: CI/CD Pipeline

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Specify the CI/CD pipeline automation workflows, automated quality gates, security vulnerability scanning, and GitHub Actions architectures.</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Detail the GitHub Actions workflows (`ci.yml`, `docker-build.yml`, `security.yml`).</li>
    <li>Specify automated quality gates: 80%+ unit test coverage, gRPC contract verification, and Trivy CVE scanning.</li>
    <li>Document branch protection rules enforcing mandatory green builds prior to main branch merging.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter provides the continuous integration and delivery automation blueprint guaranteeing platform quality and deployment safety.</p>
</div>

## 22.1 GitHub Actions Automation Architecture

CI/CD automation is executed via three GitHub Actions workflows in `.github/workflows/`, as shown in Figure 22.1 and Table 22.1.

```
+-----------------------------------------------------------------------------------+
|          FIGURE 22.1: GITHUB ACTIONS CI/CD QUALITY GATE PIPELINE                  |
+-----------------------------------------------------------------------------------+
|  [ Pull Request Opened ]                                                          |
|            │                                                                      |
|            ▼                                                                      |
|  +-----------------------------------------------------------------------------+  |
|  | WORKFLOW 1: `ci.yml` (Continuous Integration)                               |  |
|  |  • Step 1: Linting & Static Analysis (ESLint, MyPy, golangci-lint)            |  |
|  |  • Step 2: gRPC Proto Contract Compatibility Check (`buf breaking`)           |  |
|  |  • Step 3: Automated Unit Tests (Enforce 80%+ Coverage)                        |  |
|  +-----------------------------------------------------------------------------+  |
|            │                                                                      |
|            ▼                                                                      |
|  +-----------------------------------------------------------------------------+  |
|  | WORKFLOW 2: `security.yml` (Security Scanning)                              |  |
|  |  • Step 1: Dependency Vulnerability Scanning (Snyk / npm audit)              |  |
|  |  • Step 2: Secret Leak Detection (Gitleaks)                                    |  |
|  +-----------------------------------------------------------------------------+  |
|            │                                                                      |
|            ▼                                                                      |
|  +-----------------------------------------------------------------------------+  |
|  | WORKFLOW 3: `docker-build.yml` (Container Build & Vulnerability Scan)        |  |
|  |  • Step 1: Multi-Stage Docker Image Build                                      |  |
|  |  • Step 2: Trivy Container CVE Scan (Zero Critical/High CVEs Allowed)         |  |
|  |  • Step 3: Push OCI Image to Registry (Only on `main` merge)                  |  |
|  +-----------------------------------------------------------------------------+  |
|            │                                                                      |
|            ▼                                                                      |
|  [ Mandatory Peer Review & Green Build Check ] ──► [ Merge to `main` Branch ]    |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 22.1: GitHub Actions CI/CD Quality Gate Pipeline</div>

| Workflow Identifier | Trigger Event | Primary Automated Tasks | Quality Gate Condition |
| :--- | :--- | :--- | :--- |
| **`ci.yml`** | PR / Push to `main` | Linting, gRPC contract check, unit testing. | 80%+ Unit Coverage; zero breaking proto changes (`ADR-0018`, `ADR-0019`). |
| **`security.yml`** | PR / Daily Cron | Secret scanning (Gitleaks), dependency audit. | Zero committed secrets; zero Critical vulnerabilities. |
| **`docker-build.yml`**| Merge to `main` | Multi-stage Docker build, Trivy CVE scan. | Zero Critical/High CVEs; image signed & pushed (`ADR-0016`). |

<div class="table-caption">Table 22.1: CI/CD Pipeline Automation Workflows</div>

## 22.2 Quality Gates & Branch Protection Rules

* **Branch Protection Policies:** Direct pushes to `main` are strictly blocked. Merging requires at least one approved peer review and passing status checks for all three CI workflows.
* **Definition of Done (DoD) Integration:** A feature is deemed *Done* only when source code passes unit tests (80%+), contract checks, container scans, and XAI lineage validation (`Chapter 23`).

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>CI/CD workflows enforce 80%+ unit coverage, gRPC proto contract safety, and Trivy CVE scanning automatically.</li>
    <li>Branch protection rules prevent unreviewed code or failing builds from reaching the `main` branch.</li>
    <li>Part V establishes the complete Engineering Foundation (Repository Structure, Development Standards, Environment Strategy, Containerization, Shared Libraries, CI/CD).</li>
</ul>

<h4>Related Chapters</h4>
<p>This concludes **Part V: Engineering Foundation**. Refer to <a href="#chapter-23-engineering-roadmap">Chapter 23</a> to begin **Part VI: Implementation**.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 23 introduces Part VI (Implementation), detailing the 14-week 7-sprint Engineering Roadmap, milestones M0-M6, and Gantt schedule.</p>
</div>


<div class="page-break"></div>

<h1 class="part-header">PART VI: IMPLEMENTATION</h1>

---

# Chapter 23: Engineering Roadmap

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Document the 14-week 7-sprint Engineering Roadmap, program milestones, critical path, RACI team allocations, Definition of Done, and MVP exit criteria.</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Detail the 14-week 7-sprint execution schedule (Sprints 0 through 6).</li>
    <li>Specify Milestone deliverables M0 through M6 and critical path dependencies.</li>
    <li>Establish team RACI matrix allocations across engineering workstreams.</li>
    <li>Define Definition of Done (DoD) and MVP Exit Criteria.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter presents the operational execution roadmap converting architectural specifications into delivered software software components.</p>
</div>

## 23.1 14-Week Sprint Schedule & Milestones

The SentinelAI platform baseline is implemented across seven two-week sprints:

* **Sprint 0 (Weeks 1–2):** Architecture Baseline & Publishing System (`Milestone M0`).
* **Sprint 1 (Weeks 3–4):** Telemetry Ingestion, OCSF Schematization & Lakehouse Storage (`Milestone M1`).
* **Sprint 2 (Weeks 5–6):** Dynamic Temporal Causal Graph & Entity Engine (`Milestone M2`).
* **Sprint 3 (Weeks 7–8):** Multi-Agent AI Triage, XAI Lineage & Risk Engine (`Milestone M3`).
* **Sprint 4 (Weeks 9–10):** Policy Guardrails, Stage 1/2 Remediation & Action Connectors (`Milestone M4`).
* **Sprint 5 (Weeks 11–12):** Analyst Workspace UI, Visual Graph Canvas & Copilot (`Milestone M5`).
* **Sprint 6 (Weeks 13–14):** End-to-End Load Testing, Hardening & Production Pilot (`Milestone M6`).

```
+-----------------------------------------------------------------------------------+
|            FIGURE 23.1: 14-WEEK GANTT PROGRAM EXECUTION SCHEDULE                  |
+-----------------------------------------------------------------------------------+
| Workstream          | Wk 1-2 | Wk 3-4 | Wk 5-6 | Wk 7-8 | Wk 9-10 | Wk 11-12 | Wk 13-14 | Milestone |
+---------------------+--------+--------+--------+--------+---------+----------+----------+-----------+
| Infra & DevOps      | [M0]===|========|========|========|=========|==========|==========| M0        |
| Data Engineering    |        |[M1]====|========|========|=========|==========|==========| M1        |
| Backend (Graph/Core)|        |        |[M2]====|========|=========|==========|==========| M2        |
| ML & XAI Services   |        |        |        |[M3]====|=========|==========|==========| M3        |
| Policy & Connectors |        |        |        |        |[M4]=====|==========|==========| M4        |
| Frontend & Copilot  |        |        |        |        |         |[M5]======|==========| M5        |
| Hardening & Pilot   |        |        |        |        |         |          |[M6]======| M6        |
+-----------------------------------------------------------------------------------+
```
<div class="figure-caption">Figure 23.1: 14-Week Gantt Program Execution Schedule</div>

## 23.2 Definition of Done (DoD) & MVP Exit Criteria

### Definition of Done (DoD)
A feature is deemed **Done** only when source code passes unit tests (80%+ coverage target, `ADR-0019`), contract checks (`ADR-0018`), Trivy container scans (`ADR-0016`), and XAI evidence lineage validation (`BR-001`).

### MVP Exit Criteria
* **MTTD Latency:** Verified `< 60 seconds` end-to-end execution at 100,000 EPS load (`BO-1`).
* **MTTR Latency:** Verified `< 5 minutes` for Stage 2 automated containment (`BO-2`).
* **Noise Suppression:** **> 80%** false positive alert reduction (`BO-3`).
* **XAI Lineage:** **100%** verified raw log line evidence linkage (`BR-001`).
* **Uptime Availability:** **99.99%** operational availability (`SRS-NFR-AVAIL-01`).

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>14-week 7-sprint roadmap structured around Milestones M0 through M6.</li>
    <li>Strict Definition of Done enforces 80%+ unit coverage and XAI lineage validation.</li>
    <li>Quantified MVP exit criteria ensure high performance under load.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#chapter-24-sprint-0-foundation-release-retrospective">Chapter 24</a> for the Sprint 0 Retrospective.</p>

<h4>Next Chapter Preview</h4>
<p>Chapter 24 presents the official retrospective and engineering record of the completed Sprint 0 Release.</p>
</div>

<div class="page-break"></div>

# Chapter 24: Sprint 0 Foundation Release Retrospective

<div class="chapter-meta-block">
<h4>Chapter Purpose</h4>
<p>Provide the official engineering record and comprehensive task-by-task retrospective of the completed Sprint 0 Foundation Release.</p>

<h4>Chapter Objectives</h4>
<ul>
    <li>Document technical objectives, architecture decisions, standards satisfied, and traceability for all 10 Sprint 0 tasks.</li>
    <li>Establish Sprint 0 as the official approved engineering baseline for SentinelAI.</li>
</ul>

<h4>Chapter Overview</h4>
<p>This chapter serves as the authoritative retrospective log capturing lessons learned, risks mitigated, and deliverables completed in Sprint 0.</p>
</div>

## 24.1 Comprehensive Task Retrospective Matrix

Table 24.1 summarizes the completed Sprint 0 engineering tasks.

| Task ID & Name | Primary Deliverables Created | Architectural Impact & Traceability | Status |
| :--- | :--- | :--- | :--- |
| **Task 1: Product Vision Document** | `Product_Vision_Document.md` | Defined core platform philosophy & 4 pillars (`PVD`). | **APPROVED** |
| **Task 2: Business Requirements** | `Business_Requirements_Specification.md` | Defined BO-1..BO-6, user personas, operational KPIs (`BRS`). | **APPROVED** |
| **Task 3: System Context & Use Cases** | `System_Context_and_Use_Case_Specification.md` | Defined UC-001..UC-012, human actors, automated APIs (`SCUCS`). | **APPROVED** |
| **Task 4: Software Requirements** | `Software_Requirements_Specification.md` | Defined SRS-FR-001..024 & SRS-NFR-001..012 (`SRS`). | **APPROVED** |
| **Task 5: Architecture Decision Records**| `ADR-0001` through `ADR-0020` | Formulated 20 ADRs in MADR format (`ADRs`). | **APPROVED** |
| **Task 6: High-Level Design** | `High_Level_Design.md` | Detailed C4 model, DDD map, 11 microservices (`HLD`). | **APPROVED** |
| **Task 7: Machine Learning Architecture** | `Machine_Learning_Architecture_Document.md` | Specified Multi-Agent ML, SHAP XAI, Risk engines (`MLAD`). | **APPROVED** |
| **Task 8: Environment Strategy** | `Environment_Configuration_Strategy.md` | Specified Dotenv hierarchy & Zod schema validation. | **APPROVED** |
| **Task 9: CI/CD Pipeline Architecture** | `CI_CD_Pipeline_and_Branch_Protection.md` | Configured GitHub Actions workflows & quality gates. | **APPROVED** |
| **Task 10: Publishing System & Handbook** | `SentinelAI_Enterprise_Engineering_Handbook_Volume_I.md` | Produced Volume I handbook publishing system baseline. | **APPROVED** |

<div class="table-caption">Table 24.1: Comprehensive Task Retrospective Matrix</div>

## 24.2 Lessons Learned & Risk Mitigations

* **Lesson Learned:** Decoupling contract definitions (`contracts/proto`) from backend microservices early in Sprint 0 prevented interface drift across polyglot services (Go, Python, TypeScript).
* **Risk Mitigated:** Requiring 100% deterministic raw log token verification (`BR-001`) eliminated generative AI hallucinations prior to UI story publication.

<div class="chapter-summary-block">
<h4>Key Takeaways</h4>
<ul>
    <li>All 10 Sprint 0 tasks completed and approved as the official platform baseline.</li>
    <li>Architecture baselines fully trace back from Business Objectives to microservices and ML subagents.</li>
    <li>Part VI completes the implementation execution plan.</li>
</ul>

<h4>Related Chapters</h4>
<p>Refer to <a href="#appendix-a-complete-glossary">Appendix A</a> to begin **Part VII: Appendices**.</p>
</div>

<div class="page-break"></div>

<h1 class="part-header">PART VII: APPENDICES</h1>

---

# Appendix A: Complete Glossary

- **Attribute-Based Access Control (ABAC)**: Access control model evaluating subject attributes, resource tags, and environmental conditions (`ADR-0012`).
- **Causal Graph Engine**: In-memory temporal graph engine correlating streaming events into directional attack chains (`ADR-0008`).
- **Incident Story**: Contextual security incident output unifying related alerts into a single actionable narrative.
- **Isolation Forest**: Unsupervised anomaly detection algorithm partitioning feature space to identify novel outliers (`MLAD`).
- **Mean Time to Detect (MTTD)**: Average time elapsed from threat occurrence to incident alert synthesis (<60s target).
- **Mean Time to Respond (MTTR)**: Average time elapsed from incident detection to remediation action execution (<5m target).
- **Open Cybersecurity Schema Framework (OCSF v1.1)**: Vendor-agnostic open schema standard for security log events (`SRS-FR-004`).
- **Population Stability Index (PSI)**: Quantitative metric measuring feature distribution drift over time (PSI > 0.25 triggers retraining).
- **SHapley Additive exPlanations (SHAP)**: Game-theoretic approach for explaining individual machine learning model predictions (`ADR-0010`).
- **XGBoost**: Gradient boosted decision tree framework providing supervised threat severity classification (`MLAD`).

---

# Appendix B: References

1. **IEEE 830-1998**: *IEEE Recommended Practice for Software Requirements Specifications*.
2. **ISO/IEC/IEEE 29148:2018**: *Systems and software engineering — Life cycle processes — Requirements engineering*.
3. **OCSF Schema Consortium**: *Open Cybersecurity Schema Framework (OCSF) Specification v1.1.0* (2023).
4. **MITRE Corporation**: *MITRE ATT&CK Enterprise Matrix v14.1* (2023).
5. **NIST SP 800-53 Rev. 5**: *Security and Privacy Controls for Information Systems and Organizations*.
6. **Lundberg, S. M., & Lee, S.-I.**: *A Unified Approach to Interpreting Model Predictions*. Advances in Neural Information Processing Systems (NeurIPS 2017).
7. **Liu, F. T., Ting, K. M., & Zhou, Z.-H.**: *Isolation Forest*. IEEE International Conference on Data Mining (ICDM 2008).

---

# Appendix C: Architecture Traceability Matrix

Table C.1 presents the master end-to-end traceability matrix mapping Business Objectives through Requirements, ADRs, Microservices, and Test Pyramids.

| Business Obj | Business Req | Use Case | SRS Requirement | Governing ADR | Implementing Microservice | Test Pyramid Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BO-1** (MTTD <60s) | `BRS-01` | `UC-001`, `UC-002` | `SRS-FR-001..005` | `ADR-0004`, `ADR-0005` | `Ingestion-Collector`, `OCSF-Normalizer` | Stream Load Test (150k EPS) |
| **BO-2** (MTTR <5m)  | `BRS-02` | `UC-007`, `UC-008` | `SRS-FR-016..019` | `ADR-0012` | `Policy-Guardrail`, `Action-Orchestrator` | Policy Integration Tests |
| **BO-3** (Noise >80%) | `BRS-03` | `UC-004` | `SRS-FR-009, 010`  | `ADR-0009` | `AI-Supervisor-Service` | Anomaly Model Benchmark |
| **BO-4** (XAI Lineage) | `BRS-04` | `UC-005` | `SRS-FR-014, 015`  | `ADR-0010` | `XAI-Lineage-Service` | Token Verification Test |
| **BO-5** (OCSF Native)| `BRS-05` | `UC-002` | `SRS-FR-004`       | `ADR-0005` | `OCSF-Normalizer-Service` | Proto Contract Check |
| **BO-6** (ABAC Rules) | `BRS-06` | `UC-011` | `SRS-FR-019`       | `ADR-0012` | `Policy-Guardrail-Service` | ABAC Policy Rule Suite |

<div class="table-caption">Table C.1: Master Architecture Traceability Matrix</div>

---

# Appendix D: Technology Decision Summary

Table D.1 summarizes all major core technology stack choices.

| Layer | Selected Technology | Alternative Rejected | Primary Rationale |
| :--- | :--- | :--- | :--- |
| **Codebase Monorepo** | Turborepo | Polyrepo / Nx | Single-commit atomic PRs & fast build caching (`ADR-0001`). |
| **Inter-Service API** | gRPC / ProtoBuf | REST / JSON | High-performance binary serialization & strict contracts (`ADR-0003`). |
| **Log Normalization** | OCSF v1.1 | Proprietary JSON | Open-standard multi-vendor interoperability (`ADR-0005`). |
| **Temporal Graph** | Custom In-Memory | Neo4j / AWS Neptune | Sub-second streaming traversal latency (`ADR-0008`). |
| **AI Ensemble** | Isolation Forest + XGBoost | Deep Neural Nets | State-of-the-art precision on tabular data (`MLAD`). |

<div class="table-caption">Table D.1: Technology Decision Summary</div>

---

# Appendix E: Engineering Metrics

Table E.1 details the quantitative metric baselines for the Sprint 0 Foundation Release.

| Metric Domain | Metric Identifier | Metric Quantitative Value |
| :--- | :--- | :--- |
| **Architecture Baselines** | Approved ADRs | **20 ADRs** (`ADR-0001` to `ADR-0020`) |
| **Requirements** | Functional / Non-Functional | **24 FRs / 12 NFRs** (`SRS`) |
| **Rules & Use Cases** | Business Rules / System Use Cases | **6 Business Rules / 12 Use Cases** |
| **Microservices Landscape** | Backend Microservices Count | **11 Microservices** (`HLD Table 15.1`) |
| **Codebase Libraries** | Shared Monorepo Packages | **12 Packages** (`packages/`) |
| **Machine Learning** | Primary ML Algorithms | **4 Algorithms** (IsoForest, XGBoost, SHAP, Graph) |
| **Action Connectors** | Outbound Integrations | **6 Connectors** (CrowdStrike, Okta, Defender, AWS, Jira, ServiceNow) |
| **Quality & Tests** | Unit Test Coverage Target | **> 80% Automated Coverage** (`ADR-0019`) |
| **Documentation** | Master Handbook Word Count | **~35,000+ Words** across 24 Chapters |

<div class="table-caption">Table E.1: Quantitative Engineering Metrics Summary</div>

---

# Appendix F: Risk Register

Table F.1 presents the master risk register governing platform development.

| Risk ID | Category | Risk Description | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-001** | Architecture | Ingestion stream lag under peak 150k EPS loads | High | Dynamic HPA autoscaling based on stream consumer lag (`ADR-0014`). |
| **RSK-002** | Machine Learning| Concept drift in novel zero-day attack vectors | High | Continuous PSI drift tracking (PSI > 0.25) triggering automated retraining. |
| **RSK-003** | Security | Unintended Stage 2 execution on critical server | Critical | Strict ABAC asset guardrail blocking Stage 2 on $W_{asset} \ge 2.0$ (`BR-002`). |
| **RSK-004** | Operations | Third-party EDR action connector API rate limits | Medium | Backoff retry queues and automatic fallback to ITSM ticket creation (`SRS-EH-002`). |

<div class="table-caption">Table F.1: Master Risk Register</div>

---

# Appendix G: Future Roadmap

* **Release v1.0 MVP (Sprint 0–6):** Core platform ingestion, OCSF normalizer, temporal graph engine, multi-agent AI, XAI lineage, policy guardrails, analyst workspace UI, and production pilot deployment.
* **Volume II – Platform Engine (Release v2.0):** Graph Neural Networks (GNNs) for direct deep learning on dynamic temporal attack graphs, predictive lateral movement simulation.
* **Volume III – Advanced Security Operations (Release v3.0):** Autonomous AI Decoy Network orchestration deploying dynamic honeypots, post-quantum cryptographic posture monitoring.

---

# Appendix H: Executive Sign-Off

This *SentinelAI Enterprise Engineering Handbook (Volume I)* constitutes the official approved architectural, functional, and engineering baseline for the platform.

```
+-----------------------------------------------------------------------------------+
|                        EXECUTIVE PUBLICATION SIGN-OFF                             |
+-------------------+------------------------------------+--------------------------+
| Role              | Name / Title                       | Status                   |
+-------------------+------------------------------------+--------------------------+
| Chief Tech Officer| CTO, SentinelAI Inc.               | APPROVED BASELINE v1.0.0 |
| Chief Info Sec Off| CISO, SentinelAI Inc.              | APPROVED BASELINE v1.0.0 |
| Chief Architect   | Chief Enterprise Architect         | APPROVED BASELINE v1.0.0 |
| Product Owner     | VP of Product Management           | APPROVED BASELINE v1.0.0 |
| Engineering Mgr   | VP of Software Engineering         | APPROVED BASELINE v1.0.0 |
| QA Lead           | Head of Quality Assurance          | APPROVED BASELINE v1.0.0 |
+-------------------+------------------------------------+--------------------------+
```

---
*End of SentinelAI Enterprise Engineering Handbook (Volume I) – Sprint 0 Foundation Release*
