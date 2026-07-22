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

## API layer

Shared helpers live in `src/api/`:

- `apiGet` / `apiPost` / … — envelope-aware fetch
- `getHealth()` — `GET /health` smoke check
- `ApiError` — failed calls

The scaffold page shows API status using `getHealth()`.

## Structure

See Phase 1 layout in `Docs/phases.md` and root `README.md`.
