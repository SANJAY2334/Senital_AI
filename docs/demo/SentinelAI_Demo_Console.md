# SentinelAI Security Operations Demo Console Documentation

---

## 1. Executive Purpose

The **SentinelAI Security Operations Demo Console** (`apps/security-console/`) visually demonstrates the multi-cloud ingestion and OCSF schematization telemetry pipeline built during **Sprint 1 (EPIC-1)**.

---

## 2. Telemetry Pipeline Architecture

```
Synthetic Telemetry (T-1.2)
        ↓
Ingestion Collector (T-1.3: POST /api/v1/ingest/raw)
        ↓
Kafka: telemetry.raw.v1 (ADR-0004)
        ↓
OCSF Normalizer (T-1.4: Classes 1007, 3001, 6001)
        ↓
Kafka: telemetry.ocsf.v1
        ↓
Normalized Security Events & Analyst Dashboard (apps/security-console/)
```

---

## 3. Key UI Views & Navigation

- **Overview:** Executive metrics (Events Received, Accepted, Normalized, Rejected, Latency, EPS), animated pipeline flow diagram, provider distribution percentages, system health status, and live event stream.
- **Telemetry:** In-depth provider stream distribution for AWS CloudTrail, CrowdStrike EDR, and Okta IAM.
- **Pipeline:** Visual node layout of ingestion endpoints, Kafka stream channels (`telemetry.raw.v1` & `telemetry.ocsf.v1`), and schematization mappers.
- **Events:** Dense telemetry stream table displaying 128-bit RFC 4122 UUIDs, OCSF classes, timestamps, and severity tags. Clicking any row opens the **Event Inspection Drawer** showing side-by-side OCSF normalized JSON vs. preserved raw evidence payload (`SRS-FR-001`).
- **System Health:** Component status indicators for Ingestion Collector, OCSF Normalizer, Kafka topics, and Stream Ring Buffer backpressure depth (`SRS-FR-003`).
- **Architecture:** Architectural compliance documentation mapping implemented microservices to `ADR-0003`, `ADR-0004`, `ADR-0006`, `ADR-0011`, and `ADR-0013`.
- **AI Capabilities:** Visually reserved roadmap panel for future AI features (Incident Stories, Dynamic Temporal Causal Graph, XGBoost Risk Classifier, SHAP Lineage) tagged **`PLANNED — Sprint 2+`**.

---

## 4. How to Launch the Demo Console

```bash
# Launch frontend development server
pnpm --filter=@sentinelai/security-console dev
```

The console will be accessible at `http://localhost:3000`.
