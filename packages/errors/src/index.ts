export abstract class SentinelBaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends SentinelBaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

export class AuthenticationError extends SentinelBaseError {
  readonly code = 'AUTHENTICATION_ERROR';
  readonly statusCode = 401;
}

export class AuthorizationError extends SentinelBaseError {
  readonly code = 'AUTHORIZATION_ERROR';
  readonly statusCode = 403;
}

export class PolicyGuardrailViolationError extends SentinelBaseError {
  readonly code = 'POLICY_GUARDRAIL_VIOLATION';
  readonly statusCode = 409; // BR-002 asset tag violation
}

export class XAILineageNotFoundError extends SentinelBaseError {
  readonly code = 'XAI_LINEAGE_NOT_FOUND';
  readonly statusCode = 422; // BR-001 evidence verification failure
}

export class DownstreamAPIError extends SentinelBaseError {
  readonly code = 'DOWNSTREAM_API_ERROR';
  readonly statusCode = 502; // External EDR/IAM action failure
}
