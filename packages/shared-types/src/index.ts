export type { OCSFBaseEvent } from '@sentinelai/ocsf-types';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface XAIBreadcrumb {
  claimId: string;
  narrativeClaim: string;
  targetOcsfEventId: string; // Cryptographic link (BR-001, ADR-0010)
  featureWeight: number; // SHAP attribution score
  verified: boolean;
}

export interface CausalGraphNode {
  nodeId: string;
  entityType: 'HOST' | 'USER' | 'IP' | 'PROCESS' | 'OAUTH_TOKEN';
  entityValue: string;
  criticalityTag: 'CRITICAL_INFRASTRUCTURE' | 'STANDARD_WORKSTATION' | 'NON_CRITICAL';
}

export interface CausalGraphEdge {
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  ocsfEventId: string;
  timestamp: string;
  eventType: string;
}

export interface TemporalCausalGraph {
  graphId: string;
  tenantId: string;
  nodes: CausalGraphNode[];
  edges: CausalGraphEdge[];
  startTime: string;
  endTime: string;
}

export interface IncidentStory {
  storyId: string;
  tenantId: string;
  severity: IncidentSeverity;
  confidenceScore: number; // 0.0 - 1.0 (SRS-FR-009)
  riskScore: number; // 0 - 100 (MLAD Section 18)
  narrativeSummary: string;
  mitreTechniques: string[];
  affectedEntityIds: string[];
  breadcrumbs: XAIBreadcrumb[];
  status:
    'SYNTHESIZED' | 'OPEN' | 'INVESTIGATING' | 'REMEDIATION_PENDING' | 'CONTAINED' | 'RESOLVED';
  uncertaintyEscalation: boolean; // True if confidence < 80% (BR-005)
  createdAt: string;
}

export interface RemediationIntent {
  intentId: string;
  storyId: string;
  tenantId: string;
  actionType: 'ISOLATE_HOST' | 'REVOKE_SESSION' | 'BLOCK_IP';
  targetEntityId: string;
  assetCriticality: 'CRITICAL_INFRASTRUCTURE' | 'STANDARD_WORKSTATION' | 'NON_CRITICAL';
  stageMode: 'STAGE_1_ASSISTIVE' | 'STAGE_2_SUPERVISED';
  requiresHumanApproval: boolean; // Enforced by BR-002
}
