# @sentinelai/ocsf-normalizer

**OCSF v1.1 Telemetry Schematization & Normalization Microservice**

---

## 1. Executive Summary

The `ocsf-normalizer` microservice consumes raw telemetry streams from the `telemetry.raw.v1` Kafka topic, parses vendor payload structures, maps events to Open Cybersecurity Schema Framework (OCSF v1.1.0) event classes, assigns 128-bit RFC 4122 UUIDs and ISO-8601 UTC timestamps (`SRS-FR-005`), and publishes schematized OCSF events to the `telemetry.ocsf.v1` topic (`SRS-FR-004`, `ADR-0004`, `AC-001.2`).

---

## 2. Service Architecture

```
+-----------------------------------------------------------------------------------+
|                       OCSF NORMALIZER MICROSERVICE ARCHITECTURE                   |
+-----------------------------------------------------------------------------------+
|  [Kafka Topic: telemetry.raw.v1]                                                  |
|         |                                                                         |
|         v                                                                         |
|  [RawTelemetryConsumer] (Group ID: `sentinelai-ocsf-normalizer-group`)            |
|         |                                                                         |
|         v                                                                         |
|  [OCSFNormalizerEngine]                                                           |
|         |                                                                         |
|         +-------------------+-------------------+-------------------+             |
|         |                   |                   |                   |             |
|         v                   v                   v                   v             |
|  [AWS CloudTrail]     [CrowdStrike EDR]    [Okta IAM]         [Error Handler]     |
|  (Class 6001: Cloud)  (Class 1007: Proc)  (Class 3001: Auth) (Malformed/Reject) |
|         |                   |                   |                                 |
|         +-------------------+-------------------+                                 |
|                             |                                                     |
|                             v                                                     |
|             [Kafka Topic: telemetry.ocsf.v1]                                      |
+-----------------------------------------------------------------------------------+
```

---

## 3. Supported OCSF Mappings

1. **AWS CloudTrail $\rightarrow$ OCSF Class 6001 (Cloud Audit):** Maps `eventTime`, `userIdentity`, `sourceIPAddress`, `awsRegion`, `eventSource`, and `eventName` (`cloud_audit.json`).
2. **CrowdStrike EDR $\rightarrow$ OCSF Class 1007 (Process Activity):** Maps `ProcessStartTime`, `ImageFileName`, `CommandLine`, `ParentBaseFileName`, `UserName`, and `ComputerName` (`process_activity.json`).
3. **Okta IAM $\rightarrow$ OCSF Class 3001 (Authentication):** Maps `published`, `actor`, `client.ipAddress`, `userAgent`, and `outcome.result` (`authentication.json`).
