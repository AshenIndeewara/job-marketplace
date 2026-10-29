import type { ApiError } from '@/lib/api-error';

/** Health payload from GET /api/v1/health (JM-27). */
export interface Health {
  status: 'ok' | 'unhealthy';
  database: boolean;
  cache: boolean;
  checked_at: string;
}

/** Re-export for convenience so screens can import types from one place. */
export type { ApiError };
