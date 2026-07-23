# Owner Profile

## Status

Active — Phase 2.3 first slice (personal + business fields). KYC and bank deferred.

## Purpose

Let a signed-in owner complete and update a profile that can later hold parking locations, KYC, and payout details.

## Users and Roles

| User | Access |
|------|--------|
| Owner (authenticated) | Read/update own profile only |
| Staff | Out of scope this slice |

## Scope

- Create profile row on first access (draft)
- `GET` / `PATCH` own profile
- Fields: full name, email, business name/type, address, city, state, pincode
- Profile status: `draft` | `under_review` | `verified` | `rejected` | `suspended` (owners may not self-set `verified`)

## Out of Scope

- KYC document upload / review
- Bank / IFSC / payout details
- Photo upload
- Admin verification workflows
- GST/PAN tax fields (follow-up)

Tracked in `documentation/Docs/missed-during-development.md`.

## User Flow

```text
Sign in
  → Open Profile
  → GET /owners/me/profile (auto-create if missing)
  → Edit fields
  → PATCH /owners/me/profile
  → See saved values + status
```

## Business Rules

- One profile per user (`user_id` PK)
- Phone comes from `users.phone` (not editable here)
- Owner cannot set status to `verified` (admin later)
- Saving non-empty personal+business basics may move `draft` → keep `draft` until review process exists (MVP: stay `draft` unless already under_review+)
- Empty strings stored as NULL

## UI States

| State | Behavior |
|-------|----------|
| Loading | Fetch profile |
| Form | Editable fields |
| Saving | Disable submit |
| Success | Show confirmation |
| Error | Show API error message |

## API Endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| `GET` | `/owners/me/profile` | Session | Returns profile (+ phone from user) |
| `PATCH` | `/owners/me/profile` | Session | Partial update |

### Profile JSON shape

```json
{
  "userId": "...",
  "phone": "+91...",
  "fullName": "...",
  "email": "...",
  "businessName": "...",
  "businessType": "...",
  "addressLine1": "...",
  "addressLine2": "...",
  "city": "...",
  "state": "...",
  "pincode": "...",
  "profileStatus": "draft",
  "updatedAt": "..."
}
```

## Database Impact

`pms.owner_profiles` — see `server/sql/004_owner_profiles.sql`.

## Validation Rules

- Email: basic format if provided
- Pincode: 4–10 alphanumeric if provided
- String fields max lengths enforced server-side
- Unknown PATCH keys ignored

## Authorization Rules

- Must be authenticated
- Can only read/write own `user_id` profile

## Security Risks

| Risk | Mitigation |
|------|------------|
| Profile IDOR | Always scope by `req.user.id` |
| Status privilege | Reject client `verified` / `suspended` |

## Error States

| Code | HTTP | When |
|------|------|------|
| `UNAUTHORIZED` | 401 | No session |
| `VALIDATION_ERROR` | 400 | Bad email/pincode/length |
| `DATABASE_UNAVAILABLE` | 503 | DB down |

## Edge Cases

- First GET creates empty draft profile
- Concurrent PATCH — last write wins (MVP)

## Audit Events

Log profile_updated (userId only, no PII dump).

## Notifications

None this slice.

## Testing Requirements

- GET creates profile
- PATCH updates fields
- Unauthenticated → 401

## Rollback Plan

- Unmount `/owners` routes
- Keep table (non-destructive)

## Open Questions

- Mandatory fields before parking registration
- Admin verification workflow

## Change History

| Date | Change |
|------|--------|
| 2026-07-23 | First slice: personal + business profile API/UI |
