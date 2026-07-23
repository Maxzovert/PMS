# PARKAR Project Memory

> Concise source of current project truth.
> Never store secrets or customer personal data here.

## Project Summary

PARKAR PMS is the parking-owner / operator web portal for the PARKAR marketplace. Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings. Driver App and Admin share one backend, database, booking engine and availability engine.

## Current Phase

Phase 2.3 — Owner profile first slice (personal + business). Auth OTP mock remains for local login.

## Active Task

None — owner profile slice done. Next: Parking registration (Phase 3), or KYC/bank when ready.

## Current Architecture

- **Frontend:** `client/` — React + Vite + JSX; OTP login; `/profile` page.
- **Backend:** `server/` — Express; `/auth/*`, `/owners/me/profile`; SQL in `server/sql/`.
- Product docs currently under `documentation/Docs/` (root `Docs/` may be absent).
- Deferred checklist: `documentation/Docs/missed-during-development.md`.

## Completed Work

- Phase 1 foundation (tokens, logging, errors, DB pool, API layer, routing).
- Phase 2 auth OTP first slice (mock SMS).
- 2026-07-23: Owner profile — `004_owner_profiles.sql`, `GET/PATCH /owners/me/profile`, `/profile` UI.

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication / OTP | First slice (mock SMS) |
| Owner profile | First slice (personal/business; KYC/bank deferred) |
| Parking registration | Documented only |
| Availability / capacity | Documented only |
| Booking management | Documented only |
| Walk-in timer | Documented only |
| Check-in / checkout | Documented only |
| Payments and payouts | Documented only |
| Reports | Documented only |

## API Changes

- Auth: `/auth/request-otp`, `/auth/verify-otp`, `/auth/me`, `/auth/logout`
- Owners: `GET /owners/me/profile`, `PATCH /owners/me/profile`

## Database Changes

- `pms.users`, `otp_challenges`, `sessions`
- `pms.owner_profiles` (`004_owner_profiles.sql`)

## Security Decisions

- Profile scoped to `req.user.id` only.
- Owners cannot self-set `verified` / `suspended` profile status.
- OTP still mocked until SMS provider chosen.

## Next Tasks

1. Run `npm run db:sql` (apply `004`) with Postgres up.
2. Parking registration (Phase 3).
3. KYC/bank profile sub-slice when ready (see missed checklist).

## Important Documentation Links

- `documentation/features/owner-profile.md`
- `documentation/features/authentication.md`
- `documentation/Docs/missed-during-development.md`
- `notes/16-owner-profile.md`

## Last Updated

2026-07-23 (owner profile Phase 2.3 first slice)
