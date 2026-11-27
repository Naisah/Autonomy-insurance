// Error model (decision C8). Copied per service (Q11); no shared package.
export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'CONFLICT'
  | 'ACCOUNT_BLOCKED'
  | 'RATE_LIMITED'
  | 'AI_UNAVAILABLE'
  | 'NO_AGENT_ASSIGNED'
  | 'INVALID_STATE';

export const STATUS_BY_CODE: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 400,
  CONFLICT: 409,
  ACCOUNT_BLOCKED: 403,
  RATE_LIMITED: 429,
  AI_UNAVAILABLE: 503,
  NO_AGENT_ASSIGNED: 409,
  INVALID_STATE: 409,
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: unknown;
  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = STATUS_BY_CODE[code];
    this.details = details;
  }
}

export interface ErrorBody {
  error: { code: ErrorCode; message: string; requestId: string; details?: unknown };
}

export function errorBody(code: ErrorCode, message: string, requestId: string, details?: unknown): ErrorBody {
  return { error: { code, message, requestId, ...(details === undefined ? {} : { details }) } };
}
