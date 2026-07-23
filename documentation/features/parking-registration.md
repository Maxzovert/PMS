# Parking registration (onboarding)

## Status

Active — Phase 3 first slice (guided onboarding wizard). Photos, map SDK, admin approval deferred.

## Purpose

Let a signed-in owner register one or more parking locations through a **multi-step onboarding** experience, save drafts, and submit for review.

## Users and Roles

| User | Access |
|------|--------|
| Owner (authenticated) | Create/list/update own drafts; submit for review |
| Admin | Out of scope this slice (approve/reject later) |

## Scope

- Guided steps: Welcome → Basics → Location → Space → Pricing → Review
- Persist draft on each Continue (`onboarding_step` + fields)
- List locations; resume incomplete onboarding
- Submit: `draft` → `under_review`
- Web animated wizard + mobile wizard (same API)

## Out of Scope

- Map pin picker / Maps SDK
- Photo uploads
- Full amenities / ownership proof
- Admin approve → `active`
- Availability engine (Phase 4)

Tracked in `documentation/Docs/missed-during-development.md`.

## User Flow

```text
Dashboard / Parking list
  → Start onboarding (POST draft)
  → Step through wizard (PATCH each Continue)
  → Review → Submit (POST .../submit)
  → Status under_review
```

Resume: open `/parking/:id/onboarding` (web) or equivalent mobile route; jump to saved `onboardingStep`.

## Business Rules

| Rule | Value |
|------|--------|
| Ownership | `owner_user_id` = authenticated user only |
| Status create | Always `draft` |
| Editable when | `draft` only (MVP) |
| Submit | Requires name + capacity ≥ 1; then `under_review` |
| Owner cannot set | `approved`, `active`, `rejected` |
| Vehicle types | Subset of bike, car, suv, commercial |
| Prices | ≥ 0 when set |
| Lat/lng | Optional; if set, valid ranges |

## Onboarding steps

| Step | Key | Fields |
|------|-----|--------|
| 0 | welcome | (UI only) |
| 1 | basics | name, locationType |
| 2 | location | addressLine1, landmark, latitude, longitude |
| 3 | space | capacity, covered, vehicleTypes |
| 4 | pricing | priceHourly, priceDaily, openTime, closeTime |
| 5 | review | submit |

## UI States

| State | Behavior |
|-------|----------|
| Welcome | Brand + CTA |
| Step form | Progress + fields + Back/Continue |
| Saving | Disable Continue |
| Review | Summary + Submit |
| List | Drafts + under_review rows; empty → start onboarding |
| Error | API envelope message |

## API Endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `GET` | `/parking/locations` | Session | List mine |
| `POST` | `/parking/locations` | Session | Create draft |
| `GET` | `/parking/locations/:id` | Session | Get mine |
| `PATCH` | `/parking/locations/:id` | Session | Update draft + `onboardingStep` |
| `POST` | `/parking/locations/:id/submit` | Session | draft → under_review |

### Location JSON shape

```json
{
  "id": "...",
  "name": "...",
  "locationType": "commercial",
  "addressLine1": "...",
  "landmark": "...",
  "latitude": 28.61,
  "longitude": 77.20,
  "capacity": 10,
  "covered": true,
  "vehicleTypes": ["car", "bike"],
  "priceHourly": 40,
  "priceDaily": 250,
  "openTime": "08:00",
  "closeTime": "22:00",
  "status": "draft",
  "onboardingStep": 2,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Database Impact

`pms.parking_locations` — `server/sql/005_parking_locations.sql`.

## Validation Rules

- name: required on submit; max 120
- locationType: `commercial` \| `residential` \| `mixed` \| `other` \| null
- capacity: integer ≥ 1 when set; required on submit
- prices: number ≥ 0
- latitude −90..90; longitude −180..180
- openTime/closeTime: `HH:MM` or null
- vehicleTypes: array of allowed tokens

## Authorization Rules

- Authenticated session required
- All queries scoped by `owner_user_id = req.user.id`

## Security Risks

| Risk | Mitigation |
|------|------------|
| IDOR | Owner filter on every query |
| Status privilege | Reject client-set approved/active/rejected |

## Error States

| Code | HTTP | When |
|------|------|------|
| `UNAUTHORIZED` | 401 | No session |
| `NOT_FOUND` | 404 | Unknown or not owned |
| `VALIDATION_ERROR` | 400 | Bad fields / cannot submit |
| `CONFLICT` | 409 | Submit when not draft |
| `DATABASE_UNAVAILABLE` | 503 | DB down |

## Testing Requirements

- Create → patch steps → submit
- Cannot read another owner’s location
- Submit without name/capacity → 400

## Rollback Plan

- Unmount `/parking` routes
- Keep table (non-destructive)

## Change History

| Date | Change |
|------|--------|
| 2026-07-23 | First slice: onboarding wizard API + web/mobile UI |
