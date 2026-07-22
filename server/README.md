# PARKAR PMS Backend

Node.js + Express + JavaScript API (modular monolith).

## Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Health check: http://localhost:3000/health

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with file watch reload |
| `npm start` | Start API |
| `npm run db:sql` | Run numbered `sql/*.sql` files (except `000_`) against `DATABASE_URL` |
| `npm run db:sql -- sql/000_create_database.sql --admin` | Create DB via SQL file (connects to `postgres`) |

## SQL scripts

Schema and DB setup SQL live in [`sql/`](sql/README.md) as `.sql` files — **not** inside `src/` application code.

See also [`documentation/database/`](../documentation/database/README.md).


## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `PORT` | No (default 3000) | Listen port |
| `NODE_ENV` | No | `development` / `production` |
| `LOG_LEVEL` | No | `debug` / `info` / `warn` / `error` |
| `DATABASE_URL` | No for scaffold | PostgreSQL URL; if empty, DB is skipped |

Never commit real credentials. Use `.env` locally; only `.env.example` in git.

## Foundation behavior

- **Logging:** JSON lines to stdout via `src/common/logger.js` (no secrets/PII).
- **Request IDs:** `X-Request-Id` header (accepted or generated as `req_<uuid>`).
- **Success envelope:** `{ success, data, message, requestId }`
- **Error envelope:** `{ success: false, error: { code, message, requestId } }`
- **Database:** `pg` pool when `DATABASE_URL` is set; schema/SQL files in `sql/`

## Modules

`auth`, `owners`, `parking`, `bookings`, `payments`, `notifications`, `reports`, `common`, `database`

Business features are not implemented yet — folders are Phase 1 placeholders.
