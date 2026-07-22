# PARKAR Project Memory

> Concise source of current project truth.
> Never store secrets or customer personal data here.

## Project Summary

PARKAR PMS is the parking-owner / operator web portal for the PARKAR marketplace. Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings. Driver App and Admin share one backend, database, booking engine and availability engine.

## Current Phase

Phase 1 — Foundation (tokens, server foundation, API layer, routing + auth shell; real features not implemented).

## Active Task

None — routing + auth placeholder shell done. Next: Authentication feature (OTP) with docs + tests, or Docs → documentation migration.

## Current Architecture

- Target: modular monolith (MVP), not microservices.
- **Frontend:** `client/` — React + Vite + JSX (5173); `src/api/`; React Router; stub auth shell.
- **Backend:** `server/` — Express + JS (3000, `GET /health`).
- Interfaces: Driver App, PARKAR PMS, Admin Dashboard — shared backend.
- Source of product truth today: `Docs/prd.md`, `Docs/architecture.md`, `Docs/phases.md`.
- Canonical AI/docs layout: `documentation/` (see handbook). Existing `Docs/` remains until migrated.
- Human entry: root `README.md` — **keep updated** with structure/stack/ports/scripts in the same change set as this file.

## Completed Work

- 2026-07-22: Added AI Engineering Handbook as project AI rules (`AGENTS.md`, `memory.md`, `.cursor/rules/*`, `documentation/ai-engineering-handbook.md`).
- 2026-07-22: Initial UI design system doc (`documentation/ui/design.md`); palette locked; Satoshi + Plus Jakarta Sans fonts staged under `Fonts/`; pre-assets under `Assets/`.
- 2026-07-22: Marketing/promotional composition rules added to `design.md` §5.1 (explicitly not whole-app).
- 2026-07-22: Scaffolded `frontend/` (React/Vite) and `backend/` (Express); root `README.md` added.
- 2026-07-23: Renamed apps to `client/` and `server/`; backend converted from TypeScript to plain JavaScript (no build step).
- 2026-07-23: Client converted from TypeScript/TSX to JavaScript/JSX (Vite, no `tsc`).
- 2026-07-23: Migrated fonts/assets into `client/src/assets`; wired CSS design tokens + `@font-face` in `client/src/index.css`; favicon from PMS logo.
- 2026-07-23: Server foundation — JSON logger, request IDs, AppError + error middleware, success envelope, optional `pg` pool from `DATABASE_URL`, `/health` reports DB status.
- 2026-07-23: Client API layer (`client/src/api`) with envelope parsing, `X-Request-Id`, `getHealth()` smoke check on scaffold page.
- 2026-07-23: Routing + auth placeholder (`react-router-dom`, `/login`, `/dashboard`, stub `AuthContext` / `ProtectedRoute`).

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication / OTP | Documented only (UI shell placeholder only) |
| Owner profile | Documented only |
| Parking registration | Documented only |
| Availability / capacity | Documented only |
| Booking management | Documented only |
| Walk-in timer | Documented only |
| Check-in / checkout | Documented only |
| Payments and payouts | Documented only |
| Reports | Documented only |

## API Changes

- `GET /health` — liveness + `data.database` status; success envelope `{ success, data, message, requestId }`.
- Error envelope: `{ success: false, error: { code, message, requestId } }` (see `documentation/features/api-response-foundation.md`).

## Database Changes

None yet for product tables. SQL scripts live in `server/sql/` (not in `src/`). `001_init_notes.sql` creates schema `pms` as a placeholder.

## Security Decisions

- Server-side validation and authorization required for all protected actions.
- No secrets in repo; commit `.env.example` only.
- OTP, passwords, tokens, card and KYC data must never be logged or stored in plain form.
- Approval required for auth, payment and destructive schema changes.
- API errors never return stack traces or secrets to clients in production.
- Phase 1 client auth stub uses tab `sessionStorage` only — not a real session; never treat as production auth.

## UI Decisions

- Design source of truth: `documentation/ui/design.md`.
- Primary `#34B17F`; secondary `#0E3B35`; full palette documented in design.md.
- Brand font: Satoshi; UI/body: Plus Jakarta Sans — self-hosted under `client/src/assets/fonts/`.
- Runtime assets: `client/src/assets/` (logo, decor). Staging `Assets/` / `Fonts/` remain as archive only — do not import from staging in app code.
- Support loading, empty, error, offline and success states.
- Marketing/hero composition rules live in `design.md` §5.1 only — do not apply to operational PMS screens.

## Known Bugs

None tracked yet.

## Technical Debt

- Product docs live in `Docs/`; AI handbook expects `documentation/`. Prefer updating both until a single tree is approved.
- Staging `Assets/` / `Fonts/` still present alongside runtime copies — remove or archive when approved.
- No automated API tests yet for health/error envelope.

## Pending Founder Decisions

- Final SMS provider.
- DLT registration.
- See also open questions in `Docs/architecture.md` (Founder Decisions Still Required).

## Next Tasks

1. Implement authentication feature (OTP) with `documentation/features/authentication.md` + tests per handbook.
2. Migrate or mirror `Docs/` content into `documentation/` feature/architecture files.

## Important Documentation Links

- `README.md` — project overview and quick start (keep updated)
- `notes/` — easy learning notes for foundation concepts (human study aid)
- `documentation/database/` — DB docs; runnable SQL in `server/sql/`
- `documentation/ai-engineering-handbook.md` — AI operating manual
- `documentation/ui/design.md` — UI design system (palette, type, assets)
- `documentation/features/api-response-foundation.md` — API success/error envelope
- `Docs/architecture.md` — technical design
- `Docs/prd.md` — product requirements
- `Docs/phases.md` — phased build plan

## Last Updated

2026-07-23 (routing + auth placeholder shell)
