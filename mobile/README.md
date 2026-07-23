# PARKAR PMS — Mobile (Expo)

Owner companion app that talks to the same `server/` API as the web portal (`client/`).

The web app in `client/` stays as-is. This folder is a separate React Native (Expo) client.

## Stack

| Item | Choice |
|------|--------|
| Runtime | Expo SDK 54 |
| Language | JavaScript |
| Auth | Same OTP APIs; session via `Authorization: Bearer` + SecureStore |
| API | `EXPO_PUBLIC_API_BASE_URL` → shared Express backend |

## Quick start

1. Start the API (`server/`) on port 3000 with Postgres up.
2. In this folder:

```bash
cd mobile
cp .env.example .env
npm install
npm start
```

3. Open in Expo Go (scan QR) or press `a` / `i` for emulator/simulator.

### API URL tips

| Where you run the app | `EXPO_PUBLIC_API_BASE_URL` |
|-----------------------|---------------------------|
| iOS Simulator | `http://localhost:3000` |
| Android Emulator | `http://10.0.2.2:3000` |
| Physical device | `http://<your-PC-LAN-IP>:3000` |

Restart Expo after changing `.env`.

### Dev OTP

Same as web: mock OTP in server logs, or `DEV_OTP_FIXED=000000` in `server/.env`.

## Screens (first slice)

- Login (phone → OTP)
- Dashboard (placeholder)
- Owner profile (GET/PATCH `/owners/me/profile`)

## Auth difference vs web

| Client | Session |
|--------|---------|
| `client/` (web) | httpOnly cookie `parkar_session` |
| `mobile/` (native) | `sessionToken` from verify response → SecureStore → `Authorization: Bearer` |

Both use the same `/auth/*` and `/owners/*` routes.
