'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4 p-6 rounded-lg border">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-[--color-foreground-muted]">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="rounded bg-[--color-primary] text-[--color-primary-foreground] px-4 py-2 text-sm"
      >
        Try again
      </button>
    </div>
  );
}
