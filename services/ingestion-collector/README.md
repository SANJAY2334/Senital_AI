# @sentinelai/ingestion-collector

**Multi-Cloud Telemetry Ingestion Collector Microservice**

---

## 1. Executive Summary

The `ingestion-collector` microservice is the primary edge component of the **SentinelAI** platform. It ingests high-velocity multi-cloud, EDR, and IAM streaming raw log telemetry feeds (AWS CloudTrail, CrowdStrike EDR, Okta IAM) over HTTP POST and gRPC stream interfaces (`SRS-FR-001`, `SRS-FR-002`, `AC-001.1`).

It implements zero-trust tenant validation (`ADR-0006`, `ADR-0011`), in-memory ring-buffer backpressure fallbacks (`SRS-FR-003`, `AC-001.5`), and publishes raw telemetry events to the `telemetry.raw.v1` Kafka topic (`ADR-0004`).

---

## 2. Service Architecture

```
+-----------------------------------------------------------------------------------+
|                     INGESTION COLLECTOR MICROSERVICE ARCHITECTURE                 |
+-----------------------------------------------------------------------------------+
|  HTTP Ingestion (/api/v1/ingest/raw)   gRPC Streaming (IngestionService)          |
|                 \                                 /                               |
|                  v                               v                                |
|             [Zero-Trust Tenant & Schema Validation] (`@sentinelai/security`)      |
|                                  |                                                |
|                                  v                                                |
|                      [RawTelemetryProducer]                                       |
|                         /             \                                           |
|       (Kafka Healthy)  /               \ (Kafka Outage / Downstream Spike)        |
|                       v                 v                                         |
|      [Kafka Topic: telemetry.raw.v1]  [StreamRingBuffer] (SRS-FR-003 Fallback)   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Supported Interfaces

- **HTTP REST Endpoint:** `POST /api/v1/ingest/raw`
- **gRPC Interface:** `IngestionService` (`IngestRawTelemetry`, `BatchIngestRawTelemetry`, `StreamRawTelemetry`)
- **Metrics Endpoint:** `GET /api/v1/ingest/metrics`
- **Health Endpoint:** `GET /health`
