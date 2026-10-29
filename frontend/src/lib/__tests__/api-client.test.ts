import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api-error';
import { apiFetch } from '@/lib/api-client';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  vi.stubGlobal('window', {
    location: { pathname: '/jobs', assign: vi.fn() },
  });
});

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: 'HTTP ' + status,
    headers: new Headers(headers),
    json: () => Promise.resolve(body),
  } as Response;
}

describe('apiFetch error mapping (JM-28)', () => {
  it('maps a 422 validation error to a typed ApiError with field errors', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(
        422,
        {
          error: {
            code: 'validation_error',
            message: 'The given data was invalid.',
            errors: { name: ['The name field is required.'] },
          },
        },
        { 'X-Request-Id': 'req-1' },
      ),
    );

    const error = (await apiFetch('/jobs').catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.code).toBe('validation_error');
    expect(error.fieldError('name')).toBe('The name field is required.');
    expect(error.requestId).toBe('req-1');
  });

  it('maps a 429 with Retry-After onto the ApiError', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(
        429,
        { error: { code: 'too_many_requests', message: 'Too many requests.' } },
        { 'Retry-After': '60' },
      ),
    );

    const error = (await apiFetch('/jobs').catch((e: unknown) => e)) as ApiError;

    expect(error.status).toBe(429);
    expect(error.retryAfter).toBe(60);
  });

  it('maps a 403 forbidden error', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(403, { error: { code: 'forbidden', message: 'This action is unauthorized.' } }),
    );

    const error = (await apiFetch('/admin/users').catch((e: unknown) => e)) as ApiError;

    expect(error.status).toBe(403);
    expect(error.isForbidden).toBe(true);
  });

  it('redirects to /login on 401 and throws an ApiError', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse(401, { error: { code: 'unauthenticated', message: 'Unauthenticated.' } }),
    );

    const error = (await apiFetch('/jobs').catch((e: unknown) => e)) as ApiError;

    expect(error.isUnauthenticated).toBe(true);
    expect(window.location.assign).toHaveBeenCalledWith('/login');
  });

  it('refreshes the CSRF cookie once and retries on 419', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockResolvedValueOnce(jsonResponse(419, { error: { code: 'csrf_token_mismatch' } }))
      .mockResolvedValue(jsonResponse(200, { data: [] }));

    const result = await apiFetch('/jobs');

    expect(result).toEqual({ data: [] });
    // Once for the original request + once for the CSRF cookie + once for the retry.
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
