# SentinelAI T-1.5 End-to-End Integration & Load Benchmark Suite

---

## 1. Test Topology & Architecture

```
Synthetic Log Generator (T-1.2)
        ↓
Ingestion Collector (T-1.3)
        ↓
Kafka: telemetry.raw.v1
        ↓
OCSF Normalizer (T-1.4)
        ↓
Kafka: telemetry.ocsf.v1
```

---

## 2. Test Suite Inventory

- **`e2e-pipeline.test.ts`:** Verifies 100% event accounting (generated $\rightarrow$ submitted $\rightarrow$ accepted $\rightarrow$ normalized $\rightarrow$ published) with zero data loss across multi-cloud streams.
- **`tenant-isolation.test.ts`:** Verifies strict multi-tenant isolation with zero cross-tenant misattribution between `tenant-ALPHA` and `tenant-BETA`.
- **`ocsf-correctness.test.ts`:** Validates OCSF v1.1 Class 6001 (`Cloud Audit`), Class 1007 (`Process Activity`), and Class 3001 (`Authentication`) schema correctness, RFC 4122 UUID v4 formatting, and UTC timestamps.
- **`latency-throughput.test.ts`:** Measures end-to-end latency distribution (Min, Avg, p50, p95, p99, Max) and throughput load profiles.
- **`resilience-failure.test.ts`:** Validates Kafka outage simulation, ring-buffer backpressure fallback (`SRS-FR-003`), automatic recovery flushing, and failure injection behavior.
