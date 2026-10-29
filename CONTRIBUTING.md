# Contributing

## Branching

- Branch from `main`: `feature/JM-123-short-name` (e.g. `feature/JM-35-age-verification`).
- Use the Notion ticket key so GitHub branches/PRs and the Notion backlog stay linked.
- Keep one ticket per branch; small PRs are preferred.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add age verification upload screen (JM-35)
fix: correct CSRF retry on 419 responses (JM-28)
chore: pin PHP 8.3 in CI (JM-26)
docs: expand backend README run instructions
```

- Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`.
- Subject line in English, imperative mood, no trailing period; add the ticket key in parentheses.
- Keep commit messages clean and factual — no generated attribution trailers.

## Pull requests

- `main` is protected: a PR is required, at least one approving review, and status checks must pass.
- Fill in the PR template (what changed, how to test, screenshots, permission impact, migration impact).
- Reference the ticket key in the PR title, e.g. `feat: age verification flow (JM-35)`.
- Self-review your diff before requesting review.

## Review expectations

- Reviewers check: correctness, tests, security (permissions, data exposure), PRS compliance.
- Reviews should land within one business day; small PRs get faster reviews.
- Do not merge with failing checks or unresolved conversations.

## Local development

- Format and lint before pushing; pre-commit hooks are provided to keep style issues out of CI.
- Never commit `.env` files or secrets; update `.env.example` instead.
