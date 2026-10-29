/**
 * Single error type for every API failure (JM-28).
 * Shape mirrors the backend JSON error format (JM-27):
 * { "error": { "code": "...", "message": "...", "errors": { field: string[] } } }
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors: Record<string, string[]>;
  readonly retryAfter: number | null;
  readonly requestId: string | null;

  constructor(
    status: number,
    code: string,
    message: string,
    errors: Record<string, string[]> = {},
    retryAfter: number | null = null,
    requestId: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.retryAfter = retryAfter;
    this.requestId = requestId;
  }

  /** First message for a form field, if any — forms read this to show inline errors. */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0];
  }

  get isUnauthenticated(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}
