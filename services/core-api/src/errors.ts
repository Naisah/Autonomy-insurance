export type ErrorCode =
  | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION' | 'CONFLICT'
  | 'ACCOUNT_BLOCKED' | 'RATE_LIMITED' | 'AI_UNAVAILABLE' | 'NO_AGENT_ASSIGNED'
  | 'INVALID_STATE' | 'INTERNAL';

const STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401, FORBIDDEN: 403, NOT_FOUND: 404, VALIDATION: 400, CONFLICT: 409,
  ACCOUNT_BLOCKED: 403, RATE_LIMITED: 429, AI_UNAVAILABLE: 503, NO_AGENT_ASSIGNED: 409,
  INVALID_STATE: 409, INTERNAL: 500,
};

export class AppError extends Error {
  readonly statusCode: number;
  constructor(readonly code: ErrorCode, message: string) {
    super(message);
    this.statusCode = STATUS[code];
  }
}

export function errorBody(code: ErrorCode, message: string, requestId: string) {
  return { error: { code, message, requestId } };
}
