# Job Marketplace

Sri Lankan part-time job marketplace. One monorepo, two applications (decision JM-22, 2026-10-29):

| Folder | Application | Stack |
| --- | --- | --- |
| `frontend/` | Job seeker and employer web app, incl. the protected `/admin` dashboard (staff + 2FA) | Next.js (App Router, TypeScript, Tailwind, TanStack Query) |
| `backend/` | REST API — single source of truth for auth, verification, jobs and applications | Laravel (PHP), MySQL, Redis |

## Repository layout

```
job-marketplace/
├── frontend/          # Next.js app
├── backend/           # Laravel API
├── docs/
│   └── decisions/     # Architecture decision records (ADR)
├── .github/           # PR template, CODEOWNERS, workflows
├── CONTRIBUTING.md    # Branching, commits, review rules
└── .editorconfig
```

## Getting started

See the per-app guides:

- Frontend: [frontend/README.md](frontend/README.md)
- Backend: [backend/README.md](backend/README.md)

## Conventions (summary)

- Branches: `feature/JM-123-short-name` (ticket key from the Notion backlog)
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`)
- Pull requests: required for `main`, at least one review, PR template must be filled in
- Full details: [CONTRIBUTING.md](CONTRIBUTING.md)

## Decisions

Architecture decisions are recorded in [docs/decisions](docs/decisions/):

- [JM-22 — Repository structure and admin dashboard placement](docs/decisions/JM-22-repository-structure.md)
