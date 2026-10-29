# Backend — Laravel API

REST API for the job marketplace: the single source of truth for authorization, verification, job status and application transitions (PRS section 7).

Stack: Laravel 12 (PHP 8.3) · MySQL · Redis.

## Prerequisites

- PHP 8.3+ with the usual Laravel extensions (mbstring, xml, curl, pdo_mysql)
- Composer
- MySQL and Redis — easiest via Docker Compose:

```bash
docker compose up -d   # starts MySQL (3306) and Redis (6379)
```

## Run locally

```bash
cp .env.example .env   # then edit values
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve      # http://localhost:8000
```

Smoke test: `curl http://localhost:8000/api/v1/health` — returns 200 only when the database and cache respond.

## Environment variables

See [.env.example](.env.example). Never commit a real `.env`; keep the example file in sync — every new variable must be added here with no real secrets.

## Tests

```bash
php artisan test        # feature tests, in-memory sqlite, no services needed
```

## API conventions (JM-27)

- **Versioned routes** under `/api/v1` (`routes/api.php`)
- **One JSON error format** for every failure:

```json
{
  "error": {
    "code": "validation_error",
    "message": "The given data was invalid.",
    "errors": { "name": ["The name field is required."] }
  }
}
```

  Codes: `validation_error` (422), `unauthenticated` (401), `forbidden` (403), `not_found` (404), `method_not_allowed` (405), `csrf_token_mismatch` (419), `too_many_requests` (429), `server_error` (500). See `bootstrap/app.php`.
- **API Resource classes** for all responses (`app/Http/Resources`) — internal columns never leak. Money is always a string with two decimals plus a currency code, never a float. Paginators emit `current_page` / `per_page` / `total` (PRS 5.3).
- **Form Requests** validate (`app/Http/Requests/BaseFormRequest.php`); Policies authorize; services hold transactional workflows (`app/Services`).
- **Locale middleware** resolves `en` / `si` / `ta` from the user's `preferred_locale` or `Accept-Language`; validation messages follow it.
- **Request ID**: every response carries `X-Request-Id` for support traceability.
- **Timezones**: database stores UTC; the app displays `Asia/Colombo` (`config/app.php`, `config/database.php`).
- **OpenAPI**: generated from code and served only in non-production (to be wired with the first business endpoints).
