# ADR-0017: Dynamic Centralized Configuration & Guardrail Management

## Status
`ACCEPTED`

## Context
SentinelAI relies on dynamic operational parameters: OCSF schema mapping rules, AI confidence thresholds, asset criticality tags, and response policy guardrails (`SRS-FR-019`). Updating these parameters must not require redeploying or restarting core microservice pods.

## Problem Statement
How should platform configurations, policy guardrails, and feature flags be managed and dynamically propagated across running microservice instances?

## Considered Options
1. **Option A: Static Environment Variables / Local Config Files** - Storing configuration in pod environment variables requiring pod restarts upon change.
2. **Option B: Dynamic Centralized Configuration & Guardrail Engine** - Distributed configuration management storing policy rules and feature flags in a centralized key-value store with real-time change subscription channels.
3. **Option C: Database Polling** - Microservices polling a central relational database table every few seconds for configuration updates.

## Decision
We decide to adopt **Option B: Dynamic Centralized Configuration & Guardrail Engine**.
* **Dynamic Updates:** Configuration changes (e.g., updating asset criticality tags or automation stage levels) publish real-time change events to subscribing microservice pods.
* **Validation & Schema Guardrails:** All configuration updates undergo strict JSON schema validation before activation (`VR-003`).
* **Audit Logging:** Every configuration change records a timestamped administrative audit entry detailing user ID, prior value, and new value.

## Rationale
* Allows SOC managers and SecOps architects to update response guardrails or AI thresholds instantly without causing service downtime or pod restarts.
* Prevents invalid configuration updates through mandatory pre-activation schema validation.

## Consequences
* **Positive:** Zero-downtime configuration updates, instant guardrail propagation, dynamic feature flag control.
* **Negative:** Microservice memory state management complexity during dynamic configuration reload.

## Trade-offs
Microservice config reload subscription logic accepted to enable real-time policy guardrail updates.

## Risks
Invalid configuration breaking stream ingestion logic. Mitigated by automated dry-run validation and atomic rollback capabilities.

## Future Reconsideration Conditions
Reconsider if policy configuration logic shifts entirely to compiled WebAssembly policy modules deployed dynamically at runtime.
