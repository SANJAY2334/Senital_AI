# tests/
Enterprise test suites and validation frameworks (ADR-0019, Roadmap Section 11).

- `e2e/`: Automated End-to-End acceptance tests matching BRS Acceptance Criteria (`AC-001`..`AC-005`).
- `contract/`: gRPC Protocol Buffer contract compatibility test suites (`ADR-0018`).
- `chaos/`: Chaos engineering fault injection tests (pod crashes, network latency spikes) (`ADR-0019`).
