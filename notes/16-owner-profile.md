# 16 — Owner profile

**Status:** Built — Phase 2.3 first slice  
**Docs:** `documentation/features/owner-profile.md`

---

## What it is

After login, owners open **Profile** and save personal + business details.

KYC and bank details are **not** in this slice (see missed checklist).

## APIs

| Call | Purpose |
|------|---------|
| `GET /owners/me/profile` | Load (creates draft if missing) |
| `PATCH /owners/me/profile` | Save fields |

## UI

- Route: `/profile`
- Nav link in app header

## SQL

`server/sql/004_owner_profiles.sql` — run `npm run db:sql` after pulling.
