# PARKAR PMS Frontend

React + Vite + JavaScript (JSX) app for the parking owner portal.

## Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

App: http://localhost:5173  

API base URL must point at the running server (`VITE_API_BASE_URL`, default `http://localhost:3000`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Routes

| Path | Page |
|------|------|
| `/` | Redirect to login or dashboard |
| `/login` | Mobile + OTP sign-in |
| `/dashboard` | Protected home + API health |
| `/profile` | Owner personal/business profile |
| `*` | Not found |

Auth uses httpOnly session cookie from the API (`credentials: 'include'`). In local/dev, OTP is mocked — use `DEV_OTP_FIXED` on the server or read the code from server logs.

## API layer

Shared helpers live in `src/api/`:

- `apiGet` / `apiPost` / … — envelope-aware fetch with cookies
- `requestOtp` / `verifyOtp` / `getMe` / `logout`
- `getHealth()` — `GET /health`
- `ApiError` — failed calls

## Structure

See Phase 1 layout in `Docs/phases.md` and root `README.md`.
