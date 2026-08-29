# services/
Contains decoupled reactive microservice backends (HLD Section 7, ADR-0002).

## Microservices Breakdown
- `ingestion-collector/`: Multi-cloud, EDR, and IAM streaming log receiver (SRS-FR-001..003, HLD 7).
- `ocsf-normalizer/`: OCSF v1.1 schema translation & UUID assignment service (SRS-FR-004..005, HLD 7).
- `causal-graph/`: In-memory dynamic temporal causal graph construction service (SRS-FR-006..007, HLD 7, ADR-0008).
- `story-aggregator/`: Multi-alert causal graph cluster aggregation service (SRS-FR-008, HLD 7).
- `ai-supervisor/`: Multi-agent AI triage coordinator & risk scoring service (SRS-FR-009, HLD 7, ADR-0009).
- `xai-lineage/`: Raw log evidence breadcrumbs verification service (SRS-FR-014..015, HLD 7, ADR-0010).
- `policy-guardrail/`: Asset criticality & Stage 1/2 policy evaluator service (SRS-FR-019, HLD 7, ADR-0012).
- `action-orchestrator/`: External EDR/IAM action execution connector service (SRS-FR-016..018, HLD 7).
- `copilot-service/`: Natural language conversation & evidence query service (SRS-FR-020..021, HLD 7).
- `audit-governance/`: Immutable audit logging & compliance package generator service (SRS-FR-023..024, HLD 7, ADR-0011).
- `executive-analytics/`: Real-time MTTD, MTTR, false positive, and TCO metrics service (SRS-FR-022, HLD 7).
