# PARKAR Project Memory

> Concise source of current project truth.
> Never store secrets or customer personal data here.

## Project Summary

PARKAR PMS is the parking-owner / operator portal for the PARKAR marketplace. Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings. Driver App and Admin share one backend, database, booking engine and availability engine.

## Current Phase

Phase 3 first slice complete — parking onboarding wizard (draft → under_review). Photos, map SDK, admin approval deferred.

## Active Task

None — parking onboarding first slice shipped (web + mobile + API).

## Current Architecture

- **Web:** `client/` — React + Vite + JSX; Tailwind v4; GSAP; parking list + onboarding wizard.
- **Mobile:** `mobile/` — Expo SDK 54; parking list + onboarding (TouchableOpacity CTAs).
- **Backend:** `server/` — Express; `/auth/*`, `/owners/me/profile`, `/parking/*`.

## Completed Work

- Phase 1 foundation; Phase 2 auth OTP; owner profile.
- 2026-07-23: Expo companion (SDK 54) + Bearer `sessionToken`.
- 2026-07-23: Web + mobile UI polish.
- 2026-07-23: Phase 3 parking onboarding — SQL `005`, `/parking` APIs, web/mobile wizards.

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication / OTP | First slice (mock SMS); web cookie + mobile Bearer |
| Owner profile | First slice (web + mobile; KYC/bank deferred) |
| Web UI polish | Done |
| Mobile UI polish | Done |
| Parking registration | First slice (onboarding wizard; draft → under_review) |

## Next Tasks

1. Admin parking approval (`under_review` → `active`).
2. Map SDK / photo uploads (deferred Phase 3 items).
3. KYC/bank profile sub-slice when ready.
4. Real SMS/OTP provider when founder chooses vendor.

## Important Documentation Links

- `documentation/features/parking-registration.md`
- `documentation/ui/design.md`
- `mobile/README.md`
- `documentation/features/authentication.md`
- `documentation/features/owner-profile.md`
- `documentation/Docs/missed-during-development.md`

## Last Updated

2026-07-23 (Phase 3 parking onboarding first slice)
