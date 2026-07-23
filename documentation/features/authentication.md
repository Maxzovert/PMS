# Authentication

## Status

Active — Phase 2 first slice (mobile + OTP, mock SMS provider for local/dev).

## Purpose

Allow parking owners (and later staff) to sign up / sign in with **mobile number + OTP**, receive a secure session, and access the PMS dashboard.

## Users and Roles

| User | Access after auth |
|------|-------------------|
| Owner | Full owner portal (expand later) |
| Staff | Later phases — same login mechanism, role-gated |

MVP role stored on user: `owner` (default). RBAC matrix comes later.

## Scope

- Request OTP for a phone number
- Verify OTP and create/load user
- Issue httpOnly session cookie
- `GET /auth/me`, `POST /auth/logout`
- Rate limits and OTP expiry
- Mock OTP delivery in non-production (no SMS vendor yet)

## Out of Scope

- Real SMS / DLT provider
- Refresh-token rotation productization
- Logout-all-devices UI
- Staff invites / fine-grained RBAC
- KYC / bank re-verification OTP

## User Flow

```text
Enter mobile number
        ↓
POST /auth/request-otp
        ↓
Enter OTP
        ↓
POST /auth/verify-otp  → session cookie
        ↓
GET /auth/me → dashboard
```

Logout: `POST /auth/logout` invalidates session and clears cookie.

## Business Rules

| Rule | Value |
|------|--------|
| OTP length | 6 digits |
| OTP expiry | 10 minutes |
| OTP storage | SHA-256 hash only (never plain) |
| Failed verify attempts | Max 5 per challenge |
| Request cooldown | 60 seconds between requests per phone |
| Request hourly cap | 5 requests per phone per hour |
| Latest OTP wins | New request invalidates prior unused challenges for that phone |
| Session lifetime | 7 days |
| Suspended users | Cannot verify / blocked on `/auth/me` |
| Auto-provision | First successful verify creates user with role `owner` |

## UI States

| State | Behavior |
|-------|----------|
| Phone entry | Enabled input + Request OTP |
| OTP entry | After successful request |
| Loading | Disable submit while API in flight |
| Error | Show `error.message` from API envelope |
| Success | Navigate to `/dashboard` |

## API Endpoints

| Method | Path | Auth | Success data |
|--------|------|------|----------------|
| `POST` | `/auth/request-otp` | No | `{ phone, expiresInSeconds }` |
| `POST` | `/auth/verify-otp` | No | `{ user }` + Set-Cookie |
| `POST` | `/auth/logout` | Session | `{}` + clear cookie |
| `GET` | `/auth/me` | Session | `{ user }` |

### Request bodies

`POST /auth/request-otp`

```json
{ "phone": "+919876543210" }
```

`POST /auth/verify-otp`

```json
{ "phone": "+919876543210", "code": "123456" }
```

### Cookies

- Name: `parkar_session`
- Flags: `HttpOnly`, `SameSite=Lax`, `Secure` in production
- Path: `/`

## Database Impact

Schema `pms`:

- `users` — id, phone, display_name, role, status, timestamps
- `otp_challenges` — phone, code_hash, expires_at, attempts, consumed_at
- `sessions` — user_id, token_hash, expires_at, revoked_at

SQL files: `server/sql/002_auth_users.sql`, `server/sql/003_auth_otp_and_sessions.sql`.

## Validation Rules

- Phone: E.164-style, `+` and 10–15 digits (normalized before store)
- OTP code: exactly 6 digits
- Empty/missing fields → `VALIDATION_ERROR` 400

## Authorization Rules

- Public: request-otp, verify-otp
- Authenticated session required: me, logout
- Server is source of truth; client route guards alone are not security

## Security Risks

| Risk | Mitigation |
|------|------------|
| OTP brute force | Attempt cap + expiry |
| OTP spam / cost | Cooldown + hourly cap |
| OTP leakage | Hash at rest; never in API JSON; log plaintext only in non-production mock |
| Session theft | HttpOnly cookie; hash token at rest; logout revokes |
| Enumeration | Same generic success messages where practical |

## Error States

| Code | HTTP | When |
|------|------|------|
| `VALIDATION_ERROR` | 400 | Bad phone/code shape |
| `OTP_RATE_LIMITED` | 429 | Too many requests |
| `OTP_INVALID` | 401 | Wrong code |
| `OTP_EXPIRED` | 401 | Expired or consumed |
| `OTP_ATTEMPTS_EXCEEDED` | 401 | Too many bad tries |
| `UNAUTHORIZED` | 401 | Missing/invalid session |
| `ACCOUNT_SUSPENDED` | 403 | User status suspended |
| `DATABASE_UNAVAILABLE` | 503 | Pool not connected |

## Edge Cases

- Multiple OTP requests → only latest unconsumed challenge valid
- Network retry on request-otp → cooldown may return 429 (safe)
- Verify after logout → 401
- Suspended after session issued → `/auth/me` returns 403

## Audit Events

Log (no secrets): otp_requested, otp_verified, otp_failed, logout, session_rejected.

## Notifications

Mock provider only until SMS vendor chosen. Production must not start without a real provider decision.

## Testing Requirements

- Happy path request → verify → me
- Wrong OTP
- Expired OTP
- Rate limit on request
- Logout clears session

## Rollback Plan

- Stop mounting `/auth` routes
- Do not drop tables without backup; revoke sessions via `revoked_at`

## Analytics

Defer — count successful logins later.

## Open Questions

- Final SMS provider (founder)
- DLT registration (founder)
- Refresh token product rules

## Change History

| Date | Change |
|------|--------|
| 2026-07-23 | Phase 2 first slice: doc + mock OTP + session cookie APIs |
