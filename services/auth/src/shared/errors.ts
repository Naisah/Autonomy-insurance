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
  | 'INVALID_STATE'
  | 'INTERNAL';

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
  INTERNAL: 500,
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly fields?: Record<string, string>;
  constructor(code: ErrorCode, message: string, fields?: Record<string, string>) {
    super(message);
    this.code = code;
    this.statusCode = STATUS_BY_CODE[code];
    this.fields = fields;
  }
}

export interface ErrorBody {
  error: { code: ErrorCode; message: string; requestId: string; fields?: Record<string, string> };
}

export function errorBody(code: ErrorCode, message: string, requestId: string, fields?: Record<string, string>): ErrorBody {
  return { error: { code, message, requestId, ...(fields === undefined ? {} : { fields }) } };
}
