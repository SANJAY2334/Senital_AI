import { z } from 'zod';

export const OCSFBaseEventSchema = z.object({
  ocsf_event_id: z.string().uuid(),
  category_uid: z.number().int().positive(),
  class_uid: z.number().int().positive(),
  time: z.string().datetime(),
  tenant_id: z.string().min(1),
  provider: z.string().min(1),
  severity_id: z.number().int().min(1).max(4),
  message: z.string().optional(),
});

export const RemediationIntentSchema = z.object({
  intentId: z.string().uuid(),
  storyId: z.string().uuid(),
  tenantId: z.string().min(1),
  actionType: z.enum(['ISOLATE_HOST', 'REVOKE_SESSION', 'BLOCK_IP']),
  targetEntityId: z.string().min(1),
  assetCriticality: z.enum(['CRITICAL_INFRASTRUCTURE', 'STANDARD_WORKSTATION', 'NON_CRITICAL']),
  stageMode: z.enum(['STAGE_1_ASSISTIVE', 'STAGE_2_SUPERVISED']),
  requiresHumanApproval: z.boolean(),
});

export function validateOCSFEvent(payload: unknown) {
  return OCSFBaseEventSchema.safeParse(payload);
}

export function validateRemediationIntent(payload: unknown) {
  return RemediationIntentSchema.safeParse(payload);
}
