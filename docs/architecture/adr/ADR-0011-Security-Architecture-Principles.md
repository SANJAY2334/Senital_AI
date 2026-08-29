# ADR-0011: Zero-Trust System Security Architecture

## Status
`ACCEPTED`

## Context
As a enterprise security platform, SentinelAI itself is a prime target for sophisticated threat actors. A compromise of SentinelAI could grant adversaries access to enterprise telemetry or unauthorized execution of remediation actions across customer networks.

## Problem Statement
What core security architecture principles must govern all internal platform components, network communications, data stores, and action connectors?

## Considered Options
1. **Option A: Perimeter-Based Castle-and-Moat Security** - Trusting all internal microservices operating behind the cluster edge ingress gateway.
2. **Option B: Zero-Trust System Architecture (ZTA)** - Assuming internal network networks are hostile; requiring explicit identity, mutual authentication, encryption, and least-privilege authorization for every request across all boundaries.
3. **Option C: Basic Token-Based Internal Security** - Using static shared secrets between microservices.

## Decision
We decide to adopt **Option B: Zero-Trust System Architecture (ZTA)**.
* **Mutual Authentication (mTLS):** All internal microservice-to-microservice communication enforces TLS 1.3 mTLS with short-lived X.509 workload certificates.
* **Least-Privilege Action Scopes:** Action connectors operate with minimal scoped permissions (e.g., host isolation API token cannot alter cloud IAM roles).
* **Immutable Audit Trail:** All system invocations and administrative changes are recorded to cryptographically chained audit stores (`BR-003`).

## Rationale
* Prevents lateral movement within the platform if an individual edge microservice pod is compromised.
* Guarantees non-repudiation for all automated and human security actions executed through the platform.

## Consequences
* **Positive:** Maximum platform resilience, protection against internal lateral movement, compliance with FedRAMP and SOC 2 ZTA standards.
* **Negative:** Overhead of managing internal PKI certificate rotation and mTLS handshakes.

## Trade-offs
Certificate rotation and mTLS handshake overhead accepted to guarantee zero-trust security boundaries.

## Risks
Certificate expiration causing internal service outage. Mitigated by automated short-lived certificate rotation daemons.

## Future Reconsideration Conditions
Reconsider if hardware-enclosed Confidential Computing (SGX/SEV) becomes standard for all cloud container runtimes.
