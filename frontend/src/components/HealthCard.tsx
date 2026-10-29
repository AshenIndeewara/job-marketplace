'use client';

import { useQuery } from '@tanstack/react-query';

import { apiGet } from '@/lib/api-client';
import type { Health } from '@/types/api';

/**
 * Sample page fetches from the Laravel health endpoint through the typed
 * API client (JM-28 acceptance criterion) — proves base URL, credentials
 * and error mapping are wired end to end.
 */
export function HealthCard() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: apiGet<Health>('/health'),
  });

  if (isPending) {
    return <div className="rounded-lg border p-4 text-sm">Checking API health…</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-[--color-danger] p-4 text-sm">
        API unreachable: {error.message}
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 text-sm space-y-1">
      <p>
        API status:{' '}
        <span
          className={
            data.status === 'ok' ? 'text-[--color-success]' : 'text-[--color-danger]'
          }
        >
          {data.status}
        </span>
      </p>
      <p className="text-[--color-foreground-muted]">
        database: {String(data.database)} · cache: {String(data.cache)}
      </p>
    </div>
  );
}
