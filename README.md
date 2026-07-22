# PARKAR PMS

Parking owner / operator web portal for the **PARKAR** marketplace.

Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings.

**Brand promise:** Never search for parking again.

---

## Status

**Phase 1 — Foundation** (scaffold + design tokens; features not yet)

| Area | State |
|------|--------|
| Frontend | React + Vite + JavaScript (JSX); fonts/tokens + API layer (`client/`) |
| Backend | Express + JS; logger, error envelope, optional `pg` pool, `GET /health` (`server/`) |
| Auth / bookings / payments | Documented only — not implemented |

---

## Stack

| Layer | Choice |
|-------|--------|
| Frontend | React, Vite, JavaScript (JSX) |
| Backend | Node.js, Express, JavaScript |
| Architecture | Modular monolith (shared backend with Driver App / Admin later) |
| Database | PostgreSQL via `pg` when `DATABASE_URL` is set (no schema/migrations yet) |

---

## Repository map

```text
PMS/
├── client/             # React owner portal (JavaScript / JSX)
│   └── src/assets/     # Runtime fonts, logo, decor (import only from here)
├── server/             # Express API (JavaScript)
├── notes/              # Easy learning notes for foundation concepts
├── Docs/               # Product PRD, architecture, phases (legacy location)
├── documentation/      # AI handbook, UI design, feature docs
├── Assets/             # Staging archive (do not import in app)
├── Fonts/              # Staging archive (do not import in app)
├── AGENTS.md           # Short AI instructions
├── memory.md           # Current project truth for AI
└── README.md           # This file — keep updated
```

---

## Quick start

### Prerequisites

- Node.js 20+ recommended
- npm

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

→ http://localhost:5173

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

→ http://localhost:3000  
→ Health: http://localhost:3000/health

---

## Design system

- Palette, typography, and assets: [`documentation/ui/design.md`](documentation/ui/design.md)
- Primary `#34B17F` · Secondary `#0E3B35`
- Brand font: Satoshi · UI font: Plus Jakarta Sans (self-hosted in `client/src/assets/fonts/`)
- Runtime UI assets: `client/src/assets/` only (`Assets/` / `Fonts/` are staging archives)

---

## Product & engineering docs

| Doc | Purpose |
|-----|---------|
| [`Docs/prd.md`](Docs/prd.md) | Product requirements |
| [`Docs/architecture.md`](Docs/architecture.md) | Technical design |
| [`Docs/phases.md`](Docs/phases.md) | Phased build plan |
| [`documentation/ai-engineering-handbook.md`](documentation/ai-engineering-handbook.md) | AI / contributor operating manual |
| [`notes/`](notes/README.md) | Easy concept notes (logger, app.js, DB, …) |
| [`AGENTS.md`](AGENTS.md) | Always-on AI rules |
| [`memory.md`](memory.md) | Concise current project truth |

---

## Security

- Never commit secrets. Use `.env` locally; only `.env.example` in git.
- Frontend must not talk to the database directly — all writes go through the backend.
- OTP, tokens, and payment data must never be logged in plain form.

---

## Keep this README updated

When you change **structure, stack, ports, scripts, or major docs links**, update this `README.md` in the **same change set** as `memory.md`. Do not leave the root README stale after scaffolding or architectural moves.

---

## License / credentials

No production credentials belong in this repository. Contact the founding team for environment access.
