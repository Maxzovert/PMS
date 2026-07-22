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
| `npm run db:ensure` | Create the `DATABASE_URL` database if missing (local) |

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
- **Database:** `pg` pool created only when `DATABASE_URL` is set; `/health` reports `database` status.

## Modules

`auth`, `owners`, `parking`, `bookings`, `payments`, `notifications`, `reports`, `common`, `database`

Business features are not implemented yet — folders are Phase 1 placeholders.
