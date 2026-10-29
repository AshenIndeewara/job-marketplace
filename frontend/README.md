# Frontend — Next.js app

Job seeker and employer web interface, including the protected `/admin` dashboard (staff permission + mandatory 2FA, code-split from the public bundle — see ADR JM-22).

Stack: Next.js (App Router) · TypeScript (strict) · Tailwind CSS · TanStack Query.

> The app skeleton is created in ticket **JM-28**. The steps below describe the final setup; until that ticket lands, this folder holds conventions and configuration only.

## Prerequisites

- Node.js (version pinned via `.nvmrc`, created with the skeleton)
- A package manager (chosen and locked with the skeleton)

## Run locally

```bash
cp .env.example .env   # then edit values
npm install
npm run dev            # http://localhost:3000
```

The app expects the Laravel API from `backend/` running (see [../backend/README.md](../backend/README.md)).

## Environment variables

See [.env.example](.env.example). Never commit a real `.env`; keep the example file in sync.

## Tests

- Unit tests: `npm run test`
- E2E smoke (Playwright): `npm run test:e2e`

Commands are wired with the JM-28 skeleton.

## Conventions

- Server components for public, SEO-relevant pages (job list and detail); client components for interactive forms.
- Session lives in an HttpOnly cookie; never store tokens in `localStorage`.
- Admin screens live under the `/admin` route group with the staff middleware guard.
