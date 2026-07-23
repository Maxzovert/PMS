# Mobile companion (Expo)

## Status

Active — first slice (OTP login, dashboard shell, owner profile). Web `client/` unchanged.

## Purpose

Provide a React Native (Expo) owner app that uses the **same** PARKAR Express API as the web PMS portal.

## Users

Parking owners (same accounts as web).

## Scope

- Expo app under `mobile/`
- OTP request/verify via `/auth/*`
- Session via Bearer token in SecureStore (`sessionToken` from verify)
- Dashboard placeholder
- Owner profile GET/PATCH
- NativeWind + Reanimated UI polish (brand tokens, decor SVGs, staggered motion)

## Out of Scope

- Replacing or rewriting `client/`
- Push notifications
- Native maps / parking registration UI
- Real SMS (still mock on server)
- GSAP on native (use Reanimated instead)

## Flows

Same as web authentication and owner profile; see `authentication.md` and `owner-profile.md`.

## Auth difference

| Client | Session transport |
|--------|-------------------|
| Web `client/` | httpOnly cookie |
| Mobile `mobile/` | `Authorization: Bearer` + SecureStore |

## Config

`EXPO_PUBLIC_API_BASE_URL` — see `mobile/.env.example` and `mobile/README.md`.

## Change History

| Date | Change |
|------|--------|
| 2026-07-23 | First slice: Expo scaffold, auth, dashboard, profile |
| 2026-07-23 | Locked to Expo SDK 54 |
| 2026-07-23 | NativeWind + Reanimated + decor assets (web UI parity) |
| 2026-07-23 | Splash screen; cleaned login/dashboard/profile layout |
