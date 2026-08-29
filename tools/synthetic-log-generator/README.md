# @sentinelai/synthetic-log-generator

**High-Throughput Synthetic Streaming Telemetry Generator for SentinelAI**

---

## 1. Executive Overview

The `@sentinelai/synthetic-log-generator` tool produces realistic, high-throughput synthetic telemetry simulating **AWS CloudTrail**, **CrowdStrike EDR**, and **Okta IAM** raw log payloads.

It supports configurable event rates up to 100,000+ Events Per Second (EPS), reproducible PRNG seed testing, tenant/correlation metadata tagging, and raw payload generation aligned with the approved **`T-1.1`** gRPC contracts (`ingestion.proto`) and OCSF v1.1.0 mapping specifications (`contracts/ocsf/*.json`).

---

## 2. Architecture & Design

```
+-----------------------------------------------------------------------------------+
|                        SYNTHETIC GENERATOR ARCHITECTURE                           |
+-----------------------------------------------------------------------------------+
|  [CLI / Test Suite]                                                               |
|         |                                                                         |
|         v                                                                         |
|  [SyntheticTelemetryGenerator]  --> Uses SeededRandom PRNG (Mulberry32)           |
|         |                                                                         |
|         +-----------------+-------------------+-------------------+               |
|         |                 |                   |                   |               |
|         v                 v                   v                   v               |
|  [AwsCloudTrailFactory] [CrowdStrikeEdrFactory] [OktaIamFactory] [MetricsCounter] |
+-----------------------------------------------------------------------------------+
```

- **Seeded Determinism:** Reproducible random generation via Mulberry32 algorithm (`seed: 1337`).
- **Contract Alignment:** Every generated event satisfies `SRS-FR-001..005` (128-bit UUID `event_id`, ISO-8601 UTC timestamp, tenant ID, provider metadata, and raw JSON payload).
- **Throughput Metrics:** Real-time tracking of generated events per provider and achieved EPS.

---

## 3. Usage & CLI Command

```bash
# Run 100,000 EPS synthetic generator benchmark
npx ts-node tools/synthetic-log-generator/src/index.ts 100000 1
```

---

## 4. Operational Distinction Warning

> **CRITICAL ARCHITECTURAL NOTE:**  
> The achieved generation rate of this synthetic log generator (e.g. 100,000+ EPS) measures only the memory creation capacity of the generator tool. It **does NOT** constitute proof of end-to-end SentinelAI platform stream ingestion or processing throughput, which is evaluated separately during microservice load testing (`Task T-1.5`).
