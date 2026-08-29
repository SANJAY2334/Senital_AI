# ADR-0020: Platform Extensibility & Category Expansion Strategy

## Status
`ACCEPTED`

## Context
SentinelAI's product vision defines a multi-horizon expansion roadmap (`PVD Section 17`):
* **Horizon 1 (MVP v1.0 / v1.1):** Core TDIR platform, AI Copilot, and SOC transformation.
* **Horizon 2 (Release v2.0):** Stage 3 Policy-Governed Autonomous Response & Predictive Attack Path Simulation.
* **Horizon 3 (Release v3.0):** Autonomous AI Decoy Network & Deception Orchestration.
* **Horizon 4 (Release v4.0+):** Privacy-Preserving Federated Threat Sharing & Post-Quantum Cryptographic Posture Monitoring.

## Problem Statement
How should the core platform architecture be designed today to ensure seamless integration of future category expansion capabilities without requiring architectural rewrites or breaking core ingestion/graphing engines?

## Considered Options
1. **Option A: Monolithic Feature Addition** - Modifying core engine source code directly for every future feature addition.
2. **Option B: Open Plugin & Event Extension Architecture** - Designing an event-driven plugin extension architecture where future capabilities plug into established extension points:
   - **Custom Agent Extension Points:** Plugin interface allowing specialized AI subagents (Decoy agent, Predictive path agent) to register with the AI Supervisor.
   - **Event Bus Hook Extensions:** Allowing external analytical modules to subscribe to core temporal causal graph updates without altering graph engines.
   - **Policy Engine Extension Hooks:** Allowing new remediation action types to register with the policy guardrail evaluator.
3. **Option C: Separate Standalone Micro-Applications** - Building future capabilities as completely independent, unlinked software applications.

## Decision
We decide to adopt **Option B: Open Plugin & Event Extension Architecture**. The platform core is designed as an extensible substrate exposing explicit extension hooks for future subagents, telemetry handlers, and action playbooks.

## Rationale
* Allows future expansion capabilities (e.g., AI Decoy Network orchestration or Predictive Attack Path Simulation) to be added as decoupled modules without risking destabilization of core TDIR stream processing.
* Enables third-party developers and enterprise SecOps teams to build custom analytical extensions via the planned Developer Platform (`PVD Section 7.2`).

## Consequences
* **Positive:** High future extensibility, zero architectural rewrites for post-MVP horizons, open developer ecosystem readiness.
* **Negative:** Requires designing and maintaining formal extension point interface abstractions (`SPIs`) from MVP v1.0 onwards.

## Trade-offs
Interface abstraction overhead accepted to guarantee long-term platform evolution and category expansion.

## Risks
Plugin extensions introducing performance degradation to core stream processing. Mitigated by isolating plugin execution to separate worker pools with strict resource quotas.

## Future Reconsideration Conditions
Reconsider if WebAssembly (Wasm) sandbox runtimes become standard for safe, isolated third-party security plugin execution inside high-performance stream pipelines.
