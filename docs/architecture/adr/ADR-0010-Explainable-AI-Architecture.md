# ADR-0010: Explainable AI (XAI) Grounding & Lineage Architecture

## Status

`ACCEPTED`

## Context

Black-box AI models generate distrust among security analysts and fail strict enterprise regulatory audit standards (`R-001`, `BR-001`). The platform vision mandates that **every AI-generated narrative claim, score, or recommendation must be completely transparent and verifiable** back to underlying raw log lines (`PVD Section 10`).

## Problem Statement

What architecture must be enforced to guarantee 100% evidence lineage and prevent AI hallucinations from reaching analyst workspaces?

## Considered Options

1. **Option A: Post-Hoc LLM Explanation** - Asking the LLM after generation to "explain why it gave that answer."
2. **Option B: Deterministic XAI Evidence Lineage Pipeline** - Architecture enforcing mandatory cryptographic breadcrumb linking:
   - Every AI assertion must specify exact target `ocsf_event_id` keys.
   - A deterministic validation layer verifies that cited event IDs exist in the underlying graph payload before publishing the story.
   - Unverified claims trigger fallback to manual analyst review (`BR-005`).
3. **Option C: Trust-Based AI Output (No Lineage Enforcement)** - Presenting AI text summaries without log links.

## Decision

We decide to adopt **Option B: Deterministic XAI Evidence Lineage Pipeline**. The platform enforces a zero-trust policy toward AI outputs: **if an AI assertion cannot be mathematically linked to a verified log line, the Incident Story will not be published** (`Tenet 1`, `BR-001`).

## Rationale

- Prevents AI hallucinations from reaching SOC analysts, building complete user trust.
- Provides auditors with 1-click evidence trails required for SOC 2 Type II and ISO 27001 compliance verification (`UC-012`).

## Consequences

- **Positive:** Zero hallucination impact, high analyst trust, audit-ready compliance evidence.
- **Negative:** Additional validation layer processing step during incident story synthesis.

## Trade-offs

Minor validation processing latency (~100ms) accepted to guarantee 100% evidence explainability.

## Risks

LLM failing to attach valid `ocsf_event_id` tokens. Mitigated by structured JSON schema output enforcement (JSON mode / function calling APIs).

## Future Reconsideration Conditions

Reconsider if foundation model architectures provide native mathematical proof-of-lineage guarantees at the token layer.
