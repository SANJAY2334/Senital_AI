# SentinelAI First Functional Demo Runbook (3–5 Minute Sequence)

---

## Demo Overview

This runbook guides a presenter step-by-step through demonstrating the operational **Sprint 1 Multi-Cloud Telemetry & Ingestion Subsystem** using the SentinelAI Security Operations Demo Console (`apps/security-console/`).

---

## 15-Step Demonstration Script

|  Step  | Time | Action / Target Screen                                  | Verbal Narrative & Key Technical Points                                                                                                                                                                        |
| :----: | :--: | :------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**  | 0:00 | Open `http://localhost:3000` (**Overview** view).       | _"Welcome to the SentinelAI Security Operations Console. This console visually demonstrates the Sprint 1 multi-cloud telemetry and schematization substrate."_                                                 |
| **2**  | 0:20 | Highlight **Executive Metrics** cards.                  | _"Here we observe real-time metrics for Events Received, Accepted, Normalized, Rejected, Latency, and Test-Harness EPS."_                                                                                      |
| **3**  | 0:40 | Highlight **Pipeline Visualizer**.                      | _"This diagram shows our architecture: Raw logs flow from AWS, CrowdStrike, and Okta into our Ingestion Collector, onto Kafka `telemetry.raw.v1`, through our OCSF Normalizer, and onto `telemetry.ocsf.v1`."_ |
| **4**  | 1:00 | Click **[Generate 100 Events]** on Demo Control Panel.  | _"Let's generate 100 multi-cloud security events using our synthetic telemetry engine."_                                                                                                                       |
| **5**  | 1:20 | Observe counter updates & provider distribution.        | _"Notice how events are dynamically categorized across AWS CloudTrail (Class 6001), CrowdStrike EDR (Class 1007), and Okta IAM (Class 3001)."_                                                                 |
| **6**  | 1:40 | Scroll to **Live Event Stream** table.                  | _"Each ingested log is assigned a 128-bit RFC 4122 UUID v4 event identity and ISO-8601 UTC timestamp."_                                                                                                        |
| **7**  | 2:00 | Click an event row to open **Event Inspection Drawer**. | _"Opening an event reveals the normalized OCSF v1.1 payload alongside the preserved raw evidence payload (SRS-FR-001)."_                                                                                       |
| **8**  | 2:30 | Close drawer and select **[Simulate Kafka Outage]**.    | _"Now we demonstrate backpressure resilience (SRS-FR-003). We simulate a downstream Kafka broker outage."_                                                                                                     |
| **9**  | 2:50 | Observe **Stream Ring Buffer** depth & health badge.    | _"Notice the status changes to BACKPRESSURE ACTIVE. Events are safely buffered in memory without service crash or data loss."_                                                                                 |
| **10** | 3:10 | Click **[Recover Pipeline]**.                           | _"We restore broker connectivity. The ring buffer automatically flushes buffered events to Kafka, returning to a healthy state."_                                                                              |
| **11** | 3:30 | Navigate to **System Health** tab.                      | _"Here we inspect sub-system health statuses, Kafka topic connectivity, and ring buffer metrics."_                                                                                                             |
| **12** | 3:50 | Navigate to **Architecture** tab.                       | _"This view details our architectural compliance with ADR-0003, ADR-0004, ADR-0006 (Tenant Isolation), and ADR-0011 (Zero-Trust)."_                                                                            |
| **13** | 4:10 | Navigate to **AI Capabilities** tab.                    | _"We visually reserve space for future AI subagents, XGBoost threat scoring, and SHAP explainability coming in Sprints 2–6."_                                                                                  |
| **14** | 4:40 | Point out **`PLANNED — Sprint 2+`** badge.              | _"Notice all future AI capabilities are explicitly marked as PLANNED to preserve strict technical credibility."_                                                                                               |
| **15** | 5:00 | Conclude demonstration.                                 | _"This concludes the 3-5 minute demonstration of the Sprint 1 baseline. Thank you."_                                                                                                                           |
