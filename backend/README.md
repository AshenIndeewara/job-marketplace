# Backend — Laravel API

REST API for the job marketplace: the single source of truth for authorization, verification, job status and application transitions (PRS section 7).

Stack: Laravel (PHP) · MySQL · Redis.

> The API skeleton is created in ticket **JM-27**. The steps below describe the final setup; until that ticket lands, this folder holds conventions and configuration only.

## Prerequisites

- PHP (version pinned in `composer.json` with the skeleton)
- Composer
- MySQL and Redis — via Docker Compose or Laravel Sail (added with the skeleton)

## Run locally

```bash
cp .env.example .env   # then edit values
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve      # http://localhost:8000
```

## Environment variables

See [.env.example](.env.example). Never commit a real `.env`; keep the example file in sync — every new variable must be added here with no real secrets.

## Tests

```bash
php artisan test
```

## API conventions (from JM-27)

- Versioned routes under `/api/v1`
- One JSON error format for 422/401/403/404/419/429/500
- API Resource classes for responses; money as strings with two decimals plus currency code
- Timezone: database UTC, display `Asia/Colombo`
