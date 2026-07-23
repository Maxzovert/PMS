# Missed / deferred during development

**Purpose:** Track work we intentionally skipped, postponed, or could not finish while building PARKAR PMS — so nothing important is forgotten.

**How to use:** Add a row when you defer something. Mark **Done** and date when completed. Do not store secrets or real phone numbers here.

| Field | Value |
|-------|-------|
| **Status** | Living checklist |
| **Last updated** | 2026-07-23 |
| **Path** | `documentation/Docs/missed-during-development.md` (keep in sync if a root `Docs/` copy exists) |

---

## 1. Blocked on founder / external decisions

| Item | Why deferred | Needed for | Owner | Status |
|------|--------------|------------|-------|--------|
| Real **SMS / OTP provider** | Not chosen yet; local mock used instead | Production login | Founder | Open |
| **DLT registration** (India SMS) | Depends on SMS vendor + compliance | Production OTP delivery | Founder | Open |
| Other open product questions | See architecture founder decisions | Later phases | Founder | Open |

**Current workaround:** `DEV_OTP_FIXED` and/or mock OTP logged in non-production only. Must **not** ship production without a real provider.

---

## 2. Deferred from Phase 1 — Foundation

| Item | Notes | Status |
|------|-------|--------|
| Staging / production environments | Local only so far | Open |
| CI / repeatable deployment | Not set up | Open |
| Automated lint/format pipeline | Not set up | Open |
| Full test harness in CI | Local scripts only | Open |
| Migrate product docs into single tree | `documentation/Docs/` in use | Open |
| Remove or archive staging `Assets/` / `Fonts/` | Runtime under `client/src/assets/` | Open |
| Request/HTTP log shipping | Terminal stdout only | Open |
| Audit log tables | Stdout for now | Open |

---

## 3. Deferred from Phase 2 — Authentication

| Item | Notes | Status |
|------|-------|--------|
| Real SMS send on `request-otp` | Mock / fixed OTP in development | Open |
| `POST /auth/refresh` | Not in first slice | Open |
| Logout from **all devices** | Single-session revoke only | Open |
| Staff invite / multi-role RBAC UI | Roles on user row only | Open |
| Account suspension admin flows | Status field exists | Open |

---

## 4. Deferred from Phase 2.3 — Owner profile

| Item | Notes | Status |
|------|-------|--------|
| KYC document upload / review | Not in first profile slice | Open |
| Bank / IFSC / payout details | Not in first profile slice | Open |
| Profile photo | Not in first profile slice | Open |
| GST / PAN tax fields | Follow-up | Open |
| Admin verification of profile | Owners cannot self-verify | Open |

**Shipped in first slice:** personal + business fields via `GET/PATCH /owners/me/profile` and `/profile` UI.

---

## 5. Deferred from Phase 3 — Parking registration

| Item | Notes | Status |
|------|-------|--------|
| Map pin picker / Maps SDK | Manual lat/lng only in first slice | Open |
| Photo uploads | Not in first onboarding slice | Open |
| Full amenities set | Deferred | Open |
| Ownership proof | Deferred | Open |
| Admin approve → active | Submit stops at under_review | Open |
| Overnight / special rates | Hourly + daily only | Open |
| Holidays / temp closures | Simple open/close only | Open |

**Shipped in first slice:** guided onboarding wizard (web + mobile), draft save, submit to `under_review`.

---

## 6. Local ops reminders

| Item | Notes | Status |
|------|-------|--------|
| PostgreSQL running before SQL/auth/profile | Windows service may be Stopped | Recurring |
| `cd server && npm run db:sql` after new SQL | Includes `005_parking_locations.sql` | Recurring |
| Keep API terminal open | Ctrl+C stops server | Recurring |

---

## 7. Next recommended product work

1. Apply SQL `005` (`npm run db:sql`) with Postgres up.
2. Admin parking approval (after onboarding submit).
3. When SMS vendor is chosen: replace mock OTP.

---

## 8. Change history

| Date | Change |
|------|--------|
| 2026-07-23 | Created — SMS/DLT + foundation/auth gaps |
| 2026-07-23 | Owner profile first slice shipped; KYC/bank listed as deferred |
| 2026-07-23 | Parking onboarding first slice; Phase 3 deferrals listed |
