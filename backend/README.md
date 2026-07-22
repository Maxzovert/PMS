# PARKAR PMS Backend

Node.js + Express + TypeScript API (modular monolith).

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Health check: http://localhost:3000/health

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/server.js` |

## Modules

`auth`, `owners`, `parking`, `bookings`, `payments`, `notifications`, `reports`, `common`, `database`

Business logic is not implemented yet — folders are Phase 1 placeholders.
