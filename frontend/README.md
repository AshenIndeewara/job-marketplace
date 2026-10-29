# Frontend — Next.js app

Job seeker and employer web interface, including the protected `/admin` dashboard (staff permission + mandatory 2FA, code-split from the public bundle — see ADR JM-22).

Stack: Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS 4 · TanStack Query 5.

## Prerequisites

- Node.js 22 (see `.nvmrc`)
- npm (lockfile committed)

## Run locally

```bash
cp .env.example .env   # then edit values
npm install
npm run dev            # http://localhost:3000
```

The home page shows a health card that calls the Laravel API (`/api/v1/health`) through the typed client — start the backend too (see [../backend/README.md](../backend/README.md)).

## Environment variables

See [.env.example](.env.example). Never commit a real `.env`; keep the example file in sync.

## Tests

```bash
npm run test           # unit tests (vitest) — API client error mapping
npm run test:e2e       # Playwright smoke (starts dev server automatically)
npm run typecheck      # strict TypeScript check
npm run lint           # ESLint
```

## Architecture notes (JM-28)

- **One place talks to the API**: `src/lib/api-client.ts`. It sends `credentials: 'include'` for the Sanctum cookie session, attaches the `X-XSRF-TOKEN` header on unsafe methods, and maps every failure to a typed `ApiError`:
  - 401 → redirect to `/login`
  - 403 → forbidden page/callers render an explanation
  - 419 → CSRF cookie refreshed once, request retried once
  - 422 → field errors attached for forms
  - 429 → `retryAfter` seconds available for the UI
- **TanStack Query** (`src/providers/QueryProvider.tsx`): 60s stale time; 4xx errors never retry.
- **Server components** for public, SEO-relevant pages (job list and detail); client components for interactive forms.
- **Session**: HttpOnly cookie only — never store tokens in `localStorage`.
- **Admin screens** live under the `/admin` route group with the staff middleware guard (added with the admin tickets).
- **API types** live in `src/types/` — later generated from the backend OpenAPI document.
