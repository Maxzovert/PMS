# API response foundation

| Field | Value |
|-------|-------|
| **Status** | Active — Phase 1 foundation |
| **Last updated** | 2026-07-23 |

## Purpose

Define the shared success/error response envelope and request identity used by the PARKAR PMS API before feature routes land.

## Success

```json
{
  "success": true,
  "data": {},
  "message": "Service healthy",
  "requestId": "req_..."
}
```

Helpers: `sendSuccess` in `server/src/common/response.js`.

## Errors

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Route GET /missing was not found.",
    "requestId": "req_..."
  }
}
```

- Throw `AppError(code, message, statusCode)` for operational failures.
- Unknown errors map to `INTERNAL_ERROR` with a safe user message; stacks are logged server-side only (not in production responses).
- Never put OTP, tokens, passwords, card data, or SQL in responses or logs.

## Request ID

- Middleware reads `X-Request-Id` or generates `req_<uuid>`.
- Echoed on the response header and in the JSON envelope.

## Database status (health)

`GET /health` includes `data.database`:

| Field | Meaning |
|-------|---------|
| `configured` | `DATABASE_URL` is set |
| `connected` | Pool connected successfully |
| `message` | Safe status text |

No schema or migrations in this change.

## Client usage

The React app calls the API through `client/src/api/`:

- Base URL: `VITE_API_BASE_URL`
- Sends `X-Request-Id`
- Success → `{ data, message, requestId }`
- Failure → throws `ApiError` with `code`, `message`, `requestId`

Scaffold smoke check: `getHealth()` from `App.jsx`.

## Change history

| Date | Change |
|------|--------|
| 2026-07-23 | Initial logger, error middleware, request IDs, optional `pg` pool |
| 2026-07-23 | Client API layer (`client/src/api`) + health smoke check |

