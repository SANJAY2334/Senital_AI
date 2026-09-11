# ADR-0009: Multi-Agent AI Orchestration Architecture

## Status

`ACCEPTED`

## Context

Automating security threat triage requires evaluating diverse attack dimensions: severity scoring, behavioral anomaly baseline comparison, MITRE ATT&CK technique mapping, and narrative summary synthesis. A single monolithic LLM prompt fails to handle these tasks reliably and suffers from high latency and hallucination risks (`R-001`).

## Problem Statement

How should AI intelligence be structured to ensure reliable, high-speed, and low-hallucination threat triage across incoming temporal attack graphs?

## Considered Options

1. **Option A: Single Large Monolithic Prompt** - Sending the entire attack graph to a single LLM with a comprehensive system prompt.
2. **Option B: Multi-Agent Collaborative Ensemble Architecture** - Deploying an ensemble of specialized, narrow-purpose AI subagents orchestrated by a master coordinator agent:
   - **Triage Agent:** Analyzes graph structure and calculates severity/confidence.
   - **Noise Suppression Agent:** Compares events against historical behavioral baselines.
   - **MITRE Mapping Agent:** Maps entity behaviors to ATT&CK technique IDs.
   - **Narrative Synthesis Agent:** Generates English incident summaries and XAI breadcrumbs.
3. **Option C: Pure Rule-Based Heuristic System** - Using static scoring rules with zero AI models.

## Decision

We decide to adopt **Option B: Multi-Agent Collaborative Ensemble Architecture**. AI triage will be executed by specialized, decoupled subagents running in parallel pipelines coordinated by an AI Supervisor Agent.

## Rationale

- Specialized subagents use smaller, focused prompts and domain-tailored models, reducing inference latency (`< 5 seconds`, `SRS-NFR-002`) and significantly lowering hallucination probability.
- Subagents execute in parallel, accelerating overall triage performance.

## Consequences

- **Positive:** Sub-5-second inference latency, high accuracy, low hallucination risk, independent subagent tuning.
- **Negative:** Requires managing multi-agent message routing and consensus evaluation.

## Trade-offs

Multi-agent orchestration complexity accepted to guarantee precision, speed, and evidence grounding.

## Risks

Subagent disagreement on severity. Mitigated by explicit confidence weighted voting algorithms in the AI Supervisor Agent.

## Future Reconsideration Conditions

Reconsider if unified multimodal frontier models achieve sub-second execution with zero hallucination guarantees.
