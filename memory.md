# PARKAR Project Memory

> Concise source of current project truth.
> Never store secrets or customer personal data here.

## Project Summary

PARKAR PMS is the parking-owner / operator web portal for the PARKAR marketplace. Owners register locations, set capacity and pricing, manage bookings and walk-ins, run check-in/checkout, and view earnings. Driver App and Admin share one backend, database, booking engine and availability engine.

## Current Phase

Phase 1 — Foundation (folder scaffold complete; features not implemented).

## Active Task

None — Phase 1 app scaffolds ready. Next: wire fonts/assets, logging, DB placeholder.

## Current Architecture

- Target: modular monolith (MVP), not microservices.
- **Frontend:** `frontend/` — React + Vite + TypeScript (port 5173).
- **Backend:** `backend/` — Node.js + Express + TypeScript (port 3000, `GET /health`).
- Interfaces: Driver App, PARKAR PMS, Admin Dashboard — shared backend.
- Source of product truth today: `Docs/prd.md`, `Docs/architecture.md`, `Docs/phases.md`.
- Canonical AI/docs layout: `documentation/` (see handbook). Existing `Docs/` remains until migrated.
- Human entry: root `README.md` — **keep updated** with structure/stack/ports/scripts in the same change set as this file.

## Completed Work

- 2026-07-22: Added AI Engineering Handbook as project AI rules (`AGENTS.md`, `memory.md`, `.cursor/rules/*`, `documentation/ai-engineering-handbook.md`).
- 2026-07-22: Initial UI design system doc (`documentation/ui/design.md`); palette locked; Satoshi + Plus Jakarta Sans fonts staged under `Fonts/`; pre-assets under `Assets/`.
- 2026-07-22: Marketing/promotional composition rules added to `design.md` §5.1 (explicitly not whole-app).
- 2026-07-22: Scaffolded `frontend/` (React/Vite) and `backend/` (Express); root `README.md` added.

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication / OTP | Documented only |
| Owner profile | Documented only |
| Parking registration | Documented only |
| Availability / capacity | Documented only |
| Booking management | Documented only |
| Walk-in timer | Documented only |
| Check-in / checkout | Documented only |
| Payments and payouts | Documented only |
| Reports | Documented only |

## API Changes

- `GET /health` — backend liveness (scaffold only).

## Database Changes

None yet (placeholder module only).

## Security Decisions

- Server-side validation and authorization required for all protected actions.
- No secrets in repo; commit `.env.example` only.
- OTP, passwords, tokens, card and KYC data must never be logged or stored in plain form.
- Approval required for auth, payment and destructive schema changes.

## UI Decisions

- Design source of truth: `documentation/ui/design.md`.
- Primary `#34B17F`; secondary `#0E3B35`; full palette documented in design.md.
- Brand font: Satoshi (`Fonts/Satoshi_Complete/`); UI/body: Plus Jakarta Sans (`Fonts/Plus_Jakarta_Sans/`).
- Staging assets in `Assets/`; runtime path is `frontend/src/assets` (migrate next).
- Support loading, empty, error, offline and success states.
- Marketing/hero composition rules live in `design.md` §5.1 only — do not apply to operational PMS screens.

## Known Bugs

None tracked yet.

## Technical Debt

- Product docs live in `Docs/`; AI handbook expects `documentation/`. Prefer updating both until a single tree is approved.
- Fonts/assets still in staging folders; not yet copied into `frontend/src/assets`.

## Pending Founder Decisions

- Final SMS provider.
- DLT registration.
- See also open questions in `Docs/architecture.md` (Founder Decisions Still Required).

## Next Tasks

1. Migrate staging `Assets/` / `Fonts/` into `frontend/src/assets` and wire design tokens.
2. Add backend logging / consistent error format; prepare DB connection.
3. Migrate or mirror `Docs/` content into `documentation/` feature/architecture files.
4. Implement authentication feature with docs + tests per handbook.

## Important Documentation Links

- `README.md` — project overview and quick start (keep updated)
- `documentation/ai-engineering-handbook.md` — AI operating manual
- `documentation/ui/design.md` — UI design system (palette, type, assets)
- `Docs/architecture.md` — technical design
- `Docs/prd.md` — product requirements
- `Docs/phases.md` — phased build plan

## Last Updated

2026-07-22 (design.md §5.1 marketing scope)
