import { ApiError } from './api-error';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';
const CSRF_URL = process.env.NEXT_PUBLIC_API_CSRF_URL ?? 'http://localhost:8000/sanctum/csrf-cookie';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(name + '='));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/** Ask Laravel to set the XSRF-TOKEN cookie (Sanctum). */
async function ensureCsrfCookie(): Promise<void> {
  try {
    await fetch(CSRF_URL, { credentials: 'include' });
  } catch {
    // Network errors surface on the actual request — nothing to do here.
  }
}

export interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /** Internal: set to false on the 419 retry so we never loop. */
  retryOnCsrfMismatch?: boolean;
}

/**
 * The one place that talks to the Laravel API (JM-28):
 * - credentials: 'include' so the Sanctum cookie session travels along
 * - X-XSRF-TOKEN header on every unsafe method
 * - 401 → send to /login; 419 → refresh the CSRF cookie once and retry
 * - every failure is thrown as a typed ApiError with field errors attached
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const retryOnCsrfMismatch = options.retryOnCsrfMismatch ?? true;

  let csrfToken = readCookie('XSRF-TOKEN');
  if (!csrfToken && method !== 'GET') {
    await ensureCsrfCookie();
    csrfToken = readCookie('XSRF-TOKEN');
  }

  const headers = new Headers({ Accept: 'application/json', ...options.headers });
  if (csrfToken && method !== 'GET') {
    headers.set('X-XSRF-TOKEN', csrfToken);
  }
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(BASE_URL + path, {
    method,
    headers,
    credentials: 'include',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  // CSRF cookie expired: refresh it once, then retry the request once.
  if (response.status === 419 && retryOnCsrfMismatch) {
    await ensureCsrfCookie();
    return apiFetch<T>(path, { ...options, retryOnCsrfMismatch: false });
  }

  // Unauthenticated: the caller cannot recover here, send to login.
  if (response.status === 401) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
    throw new ApiError(401, 'unauthenticated', 'Unauthenticated.');
  }

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string; errors?: Record<string, string[]> };
    } | null;
    const retryAfterHeader = response.headers.get('Retry-After');
    throw new ApiError(
      response.status,
      data?.error?.code ?? 'http_error',
      data?.error?.message ?? response.statusText,
      data?.error?.errors ?? {},
      retryAfterHeader === null ? null : Number(retryAfterHeader),
      response.headers.get('X-Request-Id'),
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Convenience GET for useQuery. */
export function apiGet<T>(path: string): () => Promise<T> {
  return () => apiFetch<T>(path);
}
