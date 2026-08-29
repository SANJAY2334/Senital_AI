# ADR-0019: Continuous Automated Testing & Validation Philosophy

## Status
`ACCEPTED`

## Context
SentinelAI operates in high-risk enterprise security environments where software bugs could cause false negatives (missing critical threats), false positives (alert noise), or accidental collateral damage (isolating critical production infrastructure). The platform requires a rigorous, automated quality assurance strategy.

## Problem Statement
What automated testing philosophy and verification framework should be enforced across software build pipelines to guarantee software correctness, performance, and security compliance?

## Considered Options
1. **Option A: Manual QA Testing & Periodic Regression Runs** - Relying on manual tester validation before releases.
2. **Option B: Multi-Layered Automated Testing Pyramid + Chaos Engineering** - Comprehensive automated test suite combining unit tests, integration tests, contract tests, synthetic log stream performance tests, end-to-end acceptance tests, and chaos testing.
3. **Option C: Unit Test Only Requirement** - Enforcing high code coverage with unit tests only.

## Decision
We decide to adopt **Option B: Multi-Layered Automated Testing Pyramid + Chaos Engineering**.
* **Unit Tests (80%+ Coverage):** Validates isolated domain logic, OCSF parsers, and policy rule evaluations.
* **Integration & Contract Tests:** Verifies gRPC Proto contracts and event bus serialization across microservice boundaries.
* **Synthetic Stream Performance Tests:** Automated load tests subjecting stream pipelines to 150,000 EPS to verify MTTD < 60s latency SLAs (`SRS-NFR-PERF-001`).
* **End-to-End Acceptance Tests:** Automated Gherkin test execution matching BRS Acceptance Criteria (`AC-001` through `AC-005`).
* **Chaos Engineering:** Automated fault injection (simulating pod crashes, network latency, API timeouts) to verify self-healing stream resilience.

## Rationale
* Ensures every code commit is automatically verified against functional correctness, performance latency SLAs, and security guardrails before production deployment.
* Chaos testing validates fault isolation guarantees (`AVAIL-002`), ensuring component failures do not cascade.

## Consequences
* **Positive:** High release confidence, automated regression prevention, verified latency SLA performance.
* **Negative:** CI build pipeline execution time (~10-15 minutes) and synthetic test environment maintenance.

## Trade-offs
CI execution time accepted to guarantee high platform stability and zero critical production defects.

## Risks
Flaky end-to-end integration tests slowing developer velocity. Mitigated by strict test isolation and automated quarantine pipelines for unreliable tests.

## Future Reconsideration Conditions
Reconsider if AI-generated formal verification engines achieve mathematical proof-of-correctness for stream transformation pipelines.
