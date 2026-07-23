# PARKAR Project Memory

> Concise source of current project truth.
> Never store secrets or customer personal data here.

## Project Summary

PARKAR PMS is the parking-owner / operator portal for the PARKAR marketplace. Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings. Driver App and Admin share one backend, database, booking engine and availability engine.

## Current Phase

Phase 2.3 complete. Web + mobile UI polish done. Next product: Parking registration (Phase 3).

## Active Task

None — mobile splash + cleaned login/dashboard/profile UI.

## Current Architecture

- **Web:** `client/` — React + Vite + JSX; Tailwind v4; GSAP; decor.
- **Mobile:** `mobile/` — Expo SDK 54; NativeWind + Reanimated; branded splash; cleaned login; decor used sparingly.
- **Backend:** `server/` — Express; `/auth/*`, `/owners/me/profile`.

## Completed Work

- Phase 1 foundation; Phase 2 auth OTP; owner profile.
- 2026-07-23: Expo companion (SDK 54) + Bearer `sessionToken`.
- 2026-07-23: Web UI — Tailwind v4 + GSAP + decor.
- 2026-07-23: Mobile UI — NativeWind + Reanimated + decor (parity pass).
- 2026-07-23: Mobile splash screen + cleaned login/dashboard/profile (less decor clutter).

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication / OTP | First slice (mock SMS); web cookie + mobile Bearer |
| Owner profile | First slice (web + mobile; KYC/bank deferred) |
| Web UI polish | Done (Tailwind + GSAP + decor) |
| Mobile UI polish | Done (NativeWind + Reanimated + decor) |
| Parking registration | Documented only |

## Next Tasks

1. Parking registration (Phase 3).
2. KYC/bank profile sub-slice when ready.
3. Real SMS/OTP provider when founder chooses vendor.

## Important Documentation Links

- `documentation/ui/design.md`
- `mobile/README.md`
- `documentation/features/mobile-companion.md`
- `documentation/features/authentication.md`
- `documentation/features/owner-profile.md`

## Last Updated

2026-07-23 (mobile splash + cleaned auth UI)
