# PARKAR Project Memory

> Concise source of current project truth.
> Never store secrets or customer personal data here.

## Project Summary

PARKAR PMS is the parking-owner / operator web portal for the PARKAR marketplace. Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings. Driver App and Admin share one backend, database, booking engine and availability engine.

## Current Phase

Phase 2 — Authentication (first slice: mobile OTP + session cookie; mock SMS in development).

## Active Task

None — OTP auth slice implemented. Next: real SMS provider when chosen, or owner profile / docs migration.

## Current Architecture

- Target: modular monolith (MVP), not microservices.
- **Frontend:** `client/` — React + Vite + JSX; API layer with cookies; React Router; OTP login.
- **Backend:** `server/` — Express + JS; `/auth/*`; `pg` pool; SQL in `server/sql/`.
- Interfaces: Driver App, PARKAR PMS, Admin Dashboard — shared backend.
- Source of product truth today: `Docs/prd.md`, `Docs/architecture.md`, `Docs/phases.md`.
- Canonical AI/docs layout: `documentation/` (see handbook). Existing `Docs/` remains until migrated.
- Human entry: root `README.md` — **keep updated** with structure/stack/ports/scripts in the same change set as this file.

## Completed Work

- 2026-07-22: AI handbook, design system, initial scaffolds.
- 2026-07-23: `client/` + `server/` JS stack; fonts/tokens; server logging/errors/DB pool; SQL folder; client API layer; routing shell.
- 2026-07-23: Phase 2 auth first slice — feature doc, `002`/`003` SQL, `/auth/request-otp|verify-otp|me|logout`, mock OTP, httpOnly `parkar_session`, client login wired.

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication / OTP | First slice implemented (mock SMS in dev) |
| Owner profile | Documented only |
| Parking registration | Documented only |
| Availability / capacity | Documented only |
| Booking management | Documented only |
| Walk-in timer | Documented only |
| Check-in / checkout | Documented only |
| Payments and payouts | Documented only |
| Reports | Documented only |

## API Changes

- `GET /health` — liveness + database status.
- `POST /auth/request-otp` — start OTP challenge.
- `POST /auth/verify-otp` — verify + set session cookie.
- `GET /auth/me` — current user (auth required).
- `POST /auth/logout` — revoke session.
- Envelopes: see `documentation/features/api-response-foundation.md`.

## Database Changes

- `pms.users` (`002_auth_users.sql`)
- `pms.otp_challenges`, `pms.sessions` (`003_auth_otp_and_sessions.sql`)

## Security Decisions

- Server-side validation and authorization required for all protected actions.
- OTP stored hashed only; plaintext OTP never in API JSON; mock log only when `NODE_ENV !== production`.
- Session token httpOnly cookie; DB stores token hash.
- No secrets in repo; commit `.env.example` only.
- Approval required for auth/payment/destructive schema changes and real SMS provider wiring.

## UI Decisions

- Design source of truth: `documentation/ui/design.md`.
- Operational PMS screens (not marketing hero rules).

## Known Bugs

None tracked yet.

## Technical Debt

- Product docs still partly in `Docs/` vs `documentation/`.
- Staging `Assets/` / `Fonts/` archives remain.
- Auth integration tests need running PostgreSQL (`npm test` skips API suite if DB down).
- Real SMS provider not wired.

## Pending Founder Decisions

- Final SMS provider.
- DLT registration.
- See also open questions in `Docs/architecture.md`.

## Next Tasks

1. Start PostgreSQL locally, run `npm run db:sql`, verify auth E2E + `npm test`.
2. Wire real SMS provider when chosen (replace mock).
3. Owner profile feature (Phase 2.3) or migrate `Docs/` → `documentation/`.

## Important Documentation Links

- `README.md` — project overview and quick start
- `notes/15-authentication.md` — easy auth guide
- `documentation/features/authentication.md` — auth feature spec
- `documentation/database/` — DB docs; SQL in `server/sql/`
- `documentation/ai-engineering-handbook.md` — AI operating manual
- `Docs/phases.md` — phased build plan

## Last Updated

2026-07-23 (Phase 2 auth OTP first slice)
