# ADR: Repository structure and admin dashboard placement (JM-22)

- **Date:** 2026-10-29
- **Status:** Accepted
- **Ticket:** JM-22 (Phase 0 - R&D), recorded in the Notion backlog

## Context

The PRS (section 10) left two architecture questions open: two repositories (Next.js and Laravel) or one monorepo; admin dashboard inside the Next.js app or a separate admin frontend. Decision criteria: simplicity for a small team first, then safe separation of admin code, then deployment flexibility.

## Decision

1. **One monorepo** with `frontend/` (Next.js app) and `backend/` (Laravel API) directories.
2. **Admin dashboard inside the Next.js app** as a separate protected route group (`/admin`).

## Rationale

- Small team, full-stack tickets: one pull request covers both sides of a feature.
- One place for issues, docs, tooling and conventions; one clone for a new developer.
- CI uses path filters (`frontend/**`, `backend/**`); each app still deploys independently.
- Admin area is isolated by a route group with its own layout and middleware guard: server-side staff-permission check plus mandatory staff 2FA; admin code is code-split out of the public bundle.
- A separate admin app would duplicate auth, components, CI and hosting for no extra protection; the route group can be extracted later if isolation needs grow.

## Consequences

- JM-26 (create repositories) implements this layout.
- Revisit the repo split only if the team grows or the apps need different release cadences.
