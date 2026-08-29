# ADR-0012: Unified Authentication & Fine-Grained RBAC/ABAC Strategy

## Status
`ACCEPTED`

## Context
SentinelAI users range from Tier-1 analysts (executing 1-click low-risk actions) to SecOps Architects (configuring global policy guardrails) and CISOs (viewing executive dashboards). Access control must enforce strict least privilege across API and UI capabilities (`SRS-NFR-005`).

## Problem Statement
How should authentication and authorization be architected to support enterprise Identity Provider integration (Okta, Entra ID) and fine-grained access control across resources and actions?

## Considered Options
1. **Option A: Static Role-Based Access Control (RBAC)** - Fixed user roles (Admin, User, Viewer) without context attributes.
2. **Option B: Attribute-Based Access Control (ABAC) Only** - Dynamic rule evaluation based entirely on runtime context attributes.
3. **Option C: Unified RBAC + ABAC Hybrid Strategy** - OpenID Connect (OIDC) / SAML 2.0 authentication federated with enterprise IdPs, combined with RBAC for baseline role permissions and ABAC for contextual action evaluation (asset criticality, environment, shift status).

## Decision
We decide to adopt **Option C: Unified RBAC + ABAC Hybrid Strategy**.
* **Authentication:** Enterprise Single Sign-On (SSO) via OIDC and SAML 2.0 supporting mandatory Multi-Factor Authentication (MFA).
* **Role-Based Access Control (RBAC):** Baseline role permissions mapped to standard platform personas (`Tier-1`, `Tier-2/3`, `SOC Manager`, `SecOps Architect`, `CISO`, `Auditor`).
* **Attribute-Based Access Control (ABAC):** Contextual policy evaluation for remediation execution (e.g., *Is User Tier-2? Is Target Asset Critical Infrastructure? Is Action Destructive?*).

## Rationale
* Seamless enterprise SSO integration allows instant onboarding without managing separate credentials.
* ABAC guardrails prevent unauthorized execution of destructive actions on critical infrastructure (`BR-002`).

## Consequences
* **Positive:** Enterprise SSO integration, granular least-privilege control, policy-enforced action safety.
* **Negative:** Requires managing policy rule evaluation overhead during remediation execution.

## Trade-offs
ABAC policy evaluation latency (~10ms) accepted to guarantee action guardrail enforcement.

## Risks
IdP outage blocking user login. Mitigated by supporting fallback emergency break-glass administrative accounts with hardware MFA keys.

## Future Reconsideration Conditions
Reconsider if continuous adaptive trust evaluation protocols (CAEP/RISC) replace standard OIDC token sessions.
