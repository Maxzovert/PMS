# PARKAR Project Memory

> Concise source of current project truth.
> Never store secrets or customer personal data here.

## Project Summary

PARKAR PMS is the parking-owner / operator portal for the PARKAR marketplace. Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings. Driver App and Admin share one backend, database, booking engine and availability engine.

## Current Phase

Phase 2.3 — Owner profile first slice done. Expo mobile companion scaffolded (auth + profile). Next product: Parking registration (Phase 3).

## Active Task

None — Expo `mobile/` first slice done. Web `client/` unchanged.

## Current Architecture

- **Web:** `client/` — React + Vite + JSX; OTP login (cookie); `/profile`.
- **Mobile:** `mobile/` — Expo SDK 54; OTP login (Bearer + SecureStore); dashboard + profile.
- **Backend:** `server/` — Express; `/auth/*`, `/owners/me/profile`; SQL in `server/sql/`.
- Product docs under `documentation/Docs/`.
- Deferred checklist: `documentation/Docs/missed-during-development.md`.

## Completed Work

- Phase 1 foundation (tokens, logging, errors, DB pool, API layer, routing).
- Phase 2 auth OTP first slice (mock SMS).
- 2026-07-23: Owner profile — `004_owner_profiles.sql`, `GET/PATCH /owners/me/profile`, `/profile` UI.
- 2026-07-23: Expo `mobile/` companion — same API; `sessionToken` on verify for Bearer auth; locked to **Expo SDK 54**.

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication / OTP | First slice (mock SMS); web cookie + mobile Bearer |
| Owner profile | First slice (web + mobile; KYC/bank deferred) |
| Parking registration | Documented only |
| Availability / capacity | Documented only |
| Booking management | Documented only |
| Walk-in timer | Documented only |
| Check-in / checkout | Documented only |
| Payments and payouts | Documented only |
| Reports | Documented only |

## API Changes

- Auth: `/auth/request-otp`, `/auth/verify-otp` (`user` + `sessionToken`), `/auth/me`, `/auth/logout`
- Owners: `GET /owners/me/profile`, `PATCH /owners/me/profile`
- Session: cookie `parkar_session` and/or `Authorization: Bearer`

## Database Changes

- `pms.users`, `otp_challenges`, `sessions`
- `pms.owner_profiles` (`004_owner_profiles.sql`)

## Security Decisions

- Profile scoped to `req.user.id` only.
- Owners cannot self-set `verified` / `suspended` profile status.
- OTP still mocked until SMS provider chosen.
- Native stores session token in SecureStore (not plain AsyncStorage).

## Next Tasks

1. Parking registration (Phase 3).
2. KYC/bank profile sub-slice when ready (see missed checklist).
3. Real SMS/OTP provider when founder chooses vendor.

## Important Documentation Links

- `mobile/README.md`
- `documentation/features/mobile-companion.md`
- `documentation/features/owner-profile.md`
- `documentation/features/authentication.md`
- `documentation/Docs/missed-during-development.md`
- `notes/16-owner-profile.md`

## Last Updated

2026-07-23 (Expo mobile companion first slice; web client kept as-is)
