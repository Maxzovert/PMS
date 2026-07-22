# PARKAR PMS Backend

Node.js + Express + JavaScript API (modular monolith).

## Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Health check: http://localhost:3000/health

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with file watch reload |
| `npm start` | Start API |

## Modules

`auth`, `owners`, `parking`, `bookings`, `payments`, `notifications`, `reports`, `common`, `database`

Business logic is not implemented yet — folders are Phase 1 placeholders.
