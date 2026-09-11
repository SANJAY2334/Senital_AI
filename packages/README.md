# packages/

Shared internal libraries across microservices and applications (ADR-0001, ADR-0013).

- `logger/`: Structured JSON logger with automatic `correlation_id` and `trace_id` injection.
- `telemetry/`: OpenTelemetry metrics and distributed tracing instrumentation wrapper.
- `security/`: Zero-Trust mTLS certificate validation and KMS CMK envelope encryption helpers.
- `config/`: Centralized dynamic key-value configuration subscriber package.
- `ocsf-types/`: Strongly typed OCSF event bindings generated from contracts.
