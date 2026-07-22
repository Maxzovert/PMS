# PARKAR · AI Engineering Handbook

**OPERATING MANUAL FOR AI CODING ASSISTANTS**

A security-first, documentation-first and context-aware operating guide for Cursor, ChatGPT, Claude Code, GitHub Copilot and future AI engineering tools.

| Meta | Value |
|------|--------|
| **Version** | 1.0 |
| **Edition** | Founder & Developer Edition |
| **Classification** | Confidential |
| **Control files** | `AGENTS.md`, `memory.md`, `.cursor/rules/` |

**Golden rule:** No AI may change the codebase before understanding the project state, relevant documentation, architecture and security impact.

**Loop:** READ RULES → READ MEMORY → READ DOCS → READ CODE → PLAN → CODE → TEST → UPDATE MEMORY

---

## 1. Purpose

This handbook defines how every AI assistant must behave while working on PARKAR. It is the project’s engineering constitution.

**Primary objective:** Make AI-assisted development predictable, secure, reviewable and maintainable.

**Who must follow it**

- Cursor Agent and Cursor Inline Edit
- ChatGPT, Claude Code, GitHub Copilot and Codex
- Human developers using AI-generated code
- Contractors, interns and future team members

**What it prevents**

- Random architecture changes
- Duplicate code and components
- Security mistakes from generated code
- Loss of context between sessions
- Undocumented APIs, migrations and business rules

---

## 2. Authority and rule priority

When rules conflict, higher priority wins:

| Priority | Source | Meaning |
|----------|--------|---------|
| 1 | Approved human requirement | Exact task approved for implementation |
| 2 | Security and legal requirements | Security cannot be bypassed to save time |
| 3 | `AGENTS.md` and Cursor rules | Persistent repository instructions |
| 4 | `memory.md` | Current state, decisions and active context |
| 5 | `documentation/` | Feature, API, database and architecture truth |
| 6 | Existing codebase | Current patterns and constraints |
| 7 | AI assumptions | Only when no higher source answers |

**Never:** Invent a new standard when a project standard already exists.

---

## 3. Mandatory context order

Before any code change:

1. Read `AGENTS.md` and relevant `.cursor/rules`
2. Read `memory.md`
3. Read relevant files in `documentation/` (and `Docs/` until migrated)
4. Inspect only relevant code modules
5. Create a plan and security-impact note
6. Implement the smallest safe change
7. Test, document and update memory

---

## 4. Required repository structure

```
/
├── AGENTS.md
├── memory.md
├── .cursor/rules/
│   ├── 00-core.mdc
│   ├── 10-architecture.mdc
│   ├── 20-security.mdc
│   ├── 30-frontend.mdc
│   ├── 40-backend.mdc
│   ├── 50-database.mdc
│   ├── 60-testing.mdc
│   └── 70-documentation.mdc
├── documentation/
│   ├── architecture/
│   ├── features/
│   ├── api/
│   ├── database/
│   ├── security/
│   ├── ui/
│   ├── testing/
│   ├── deployment/
│   ├── operations/
│   ├── decisions/
│   └── archive/
└── src/
    ├── assets/
    ├── components/
    ├── modules/
    ├── pages/
    ├── services/
    ├── hooks/
    ├── utils/
    └── types/
```

**Rule:** Never create a new top-level folder without approval.

---

## 5. AGENTS.md

Keep `AGENTS.md` short, universal and readable. Do not put full feature specifications there.

See root `AGENTS.md` for the live checklist (memory, docs, architecture, assets, secrets, migrations, APIs, tests, approval).

---

## 6. Cursor project rules

| Rule | Purpose |
|------|---------|
| `00-core.mdc` | Always-on behavior and task workflow |
| `10-architecture.mdc` | Layering and module boundaries |
| `20-security.mdc` | Auth, validation, secrets and logging |
| `30-frontend.mdc` | React, JavaScript, UI and accessibility |
| `40-backend.mdc` | API, services and business logic |
| `50-database.mdc` | Schema, migration and transactions |
| `60-testing.mdc` | Unit, integration and regression tests |
| `70-documentation.mdc` | Documentation and memory updates |

---

## 7. memory.md

`memory.md` records what is done, why, what is in progress and what remains unresolved.

**Update rule:** Every completed task updates `memory.md` in the same change set.

**Discipline**

- Write facts, not speculation
- Record decisions with date and reason
- Link to relevant documentation
- Record migrations, API changes and security decisions
- Move outdated details to `documentation/archive/`
- Never store passwords, tokens, OTPs or customer personal data
- Keep the active summary concise enough for AI context

---

## 8. Documentation-first development

Each major feature gets a file in `documentation/features/`. Small changes update an existing feature document.

**Never:** Keep critical business logic only inside code.

### Feature documentation template

```markdown
# Feature Name

## Status
## Purpose
## Users and Roles
## Scope
## Out of Scope
## User Flow
## Business Rules
## UI States
## API Endpoints
## Database Impact
## Validation Rules
## Authorization Rules
## Security Risks
## Error States
## Edge Cases
## Audit Events
## Notifications
## Testing Requirements
## Rollback Plan
## Analytics
## Open Questions
## Change History
```

Expected feature files (create as work starts):

- `authentication.md`
- `owner-profile.md`
- `parking-registration.md`
- `parking-availability.md`
- `booking-management.md`
- `walk-in-timer.md`
- `check-in-checkout.md`
- `payments-and-payouts.md`
- `reports.md`

### Architecture Decision Records

Create ADRs in `documentation/decisions/` for changes affecting architecture, security, data models or long-term maintenance.

```markdown
# ADR-0001: Use Modular Monolith

## Status
## Context
## Decision
## Alternatives Considered
## Security Impact
## Performance Impact
## Operational Impact
## Consequences
## Rollback / Migration Path
## Date
## Approved By
```

Examples: authentication strategy, Redis, payment provider, database replacement, microservices.

---

## 9. AI planning standard

Before implementation, produce:

1. Task restated in technical terms
2. Files likely to change
3. Docs and memory entries to update
4. Data flow and affected users
5. Security risks
6. Migrations or API changes
7. Required tests
8. Whether approval is required

**Approval is mandatory for:** destructive changes, schema deletion, breaking APIs, authentication, payments, permissions, production configuration and dependency replacements.

---

## 10. AI do / do-not lists

### Do

- Reuse components and utilities
- Follow current architecture
- Use strict JavaScript
- Validate external input
- Enforce server authorization
- Write clear error states
- Add or update tests
- Update documentation and `memory.md`
- Explain changed files
- Minimize scope; preserve compatibility
- Use project assets from `src/assets`
- Log critical transitions (without secrets)
- Use transactions where needed
- Keep secrets outside code

### Do not (without explicit approval)

- Delete files because they look unused
- Replace architecture to simplify a task
- Rewrite whole modules for small changes
- Invent API fields
- Create duplicate components
- Hardcode credentials
- Bypass authorization
- Trust client validation alone
- Use random external assets
- Silently change schema
- Hide type errors with unsafe casts
- Finish without tests

---

## 11. Asset usage

- Use only project-owned assets from `src/assets`
- Search the asset directory before creating new files
- Never use Desktop, Downloads, temporary or absolute local paths
- Do not embed remote production images without approval
- Do not alter official logos unless requested
- Use descriptive names; optimize large files; provide meaningful alt text

```javascript
import pmsLogo from "@/assets/brand/pms-logo.png";
import parkingEmpty from "@/assets/illustrations/parking-empty.svg";
```

---

## 12. Frontend coding standard

| Area | Rule |
|------|------|
| Language | JavaScript for all new frontend files |
| Components | Small functional components with clear responsibility |
| State | Separate server, form and local UI state |
| API calls | Use the service layer |
| Forms | Schema validation and field errors |
| States | Loading, empty, success and error |
| Accessibility | Semantic HTML, labels, keyboard and focus |
| Styling | Existing tokens and component system |

**Frontend security:** Hidden buttons are not authorization; safely render UGC; no untrusted HTML; do not log tokens/OTPs/documents; mask bank/identity data; validate uploads; prevent duplicate submissions; avoid long-lived sensitive tokens in `localStorage` unless approved.

---

## 13. Backend and API standards

```
Request → Route/Controller → Validation → Authorization → Service → Repository → Audit/Events → Response
```

- Controllers thin; business rules in services; DB in repositories
- Validate all external input; authorize server-side
- Typed errors and consistent responses; no production stack traces
- Paginate unbounded lists; version breaking changes
- Stable error codes, e.g. `OTP_EXPIRED`
- Idempotency for retry-sensitive actions

```json
{
  "success": false,
  "error": {
    "code": "OTP_EXPIRED",
    "message": "The verification code has expired.",
    "requestId": "req_..."
  }
}
```

---

## 14. Database standards

- Migrations for every schema change; never edit production schema manually
- Foreign keys, constraints, transactions for multi-step state changes
- Index from real access patterns; preserve financial and booking records
- Timestamps in UTC; document tables and fields
- Never store plain OTPs, passwords or card data
- Before migration: forward path, rollback, backfill, deployment order

---

## 15. Authentication, authorization and input defense

- Authentication proves identity; authorization checks permission
- Every protected endpoint verifies both
- RBAC: owner, manager, attendant, accountant, admin
- Re-verify for sensitive changes; rate-limit OTP/login; expire/rotate sessions
- Logout from all devices; audit security-relevant events
- **Never** trust a role or owner ID from the client

| Source | Protection |
|--------|------------|
| Forms | Type, length, format and business validation |
| URL params | Strict parsing and authorization |
| JSON body | Schema validation |
| Database | Parameterized queries or trusted ORM |
| Uploads | Size, MIME, extension and storage controls |
| Webhooks | Signature, replay defense and idempotency |

Server validation remains mandatory even when frontend validation exists.

---

## 16. Secrets, logging, privacy and uploads

**Secrets:** `.env` locally; managed secrets in production; commit `.env.example` only; never paste production secrets into AI prompts; never print secrets in logs; rotate if exposed; least privilege.

Example keys (names only): `DATABASE_URL`, `JWT_SECRET`, `OTP_HMAC_SECRET`, `SMS_PROVIDER_API_KEY`, `PAYMENT_WEBHOOK_SECRET`.

**Logs:** request ID, route, latency, result, sanitized error.

**Audit:** actor, action, target, old/new state, time, request ID.

**Never log:** passwords, OTP values, tokens, card info, full bank data, private KYC or unnecessary PII.

**Uploads:** allowlists; server-side names; private buckets; signed expiring URLs; do not trust browser MIME alone; separate public parking images from private KYC.

---

## 17. Testing strategy

| Test | Required for |
|------|----------------|
| Unit | Business rules, calculations, validators |
| Integration | Database, API, storage, SMS, payment |
| End-to-end | Critical owner and booking flows |
| Security | Authorization and abuse controls |
| Concurrency | Capacity, booking and payment races |
| Regression | Existing affected flows |

AI must report: tests run, passed, skipped and remaining risk.

---

## 18. Code review checklist

- [ ] Scope matches the approved task
- [ ] Architecture is preserved
- [ ] No duplicate component was introduced
- [ ] Inputs validated server-side
- [ ] Authorization enforced server-side
- [ ] Secrets and sensitive data protected
- [ ] Migrations safe and documented
- [ ] API changes compatible or versioned
- [ ] Tests cover success, failure and edge cases
- [ ] Logs do not expose sensitive data
- [ ] Documentation updated
- [ ] `memory.md` updated

---

## 19. Git, commits and dependencies

```
main
  └── develop
       ├── feature/PMS-123-owner-otp
       ├── fix/PMS-245-capacity-race
       └── docs/PMS-310-ai-handbook
```

- One focused change per branch; PRs; protect main; require checks; CODEOWNERS for security/payments/infra
- Never force-push protected shared branches

**Commit style**

```
feat(auth): add OTP challenge verification
fix(booking): prevent final-space race condition
docs(ai): add Cursor security workflow
test(payments): cover duplicate webhook delivery
refactor(ui): reuse parking status badge
chore(deps): update validation library
```

**Dependencies:** check existing equivalent, maintenance, license, advisories, bundle/ops impact; document reason. Approval required for auth, payment, database, encryption, infrastructure and native-binary packages.

---

## 20. Performance, accessibility and Cursor method

- Measure before optimizing; paginate; avoid N+1; index real filters; cache with clear invalidation
- Do not introduce microservices without an ADR
- Semantic HTML, keyboard, focus, contrast; PARKAR theme; mobile/tablet/desktop
- Assets from `src/assets`; loading/empty/error/offline/success states

**Cursor routine:** open repo root → confirm rules → reference `@AGENTS.md`, `@memory.md` and docs → add only relevant source context → plan before edits → small batches → review diffs → approve terminal commands → test → update docs/memory. Migrations, deletion and production actions require review.

### Good prompt pattern

```
Context:
- PARKAR PMS
- Feature doc: documentation/features/authentication.md
- Current state: memory.md

Task:
Add resend OTP cooldown.

Constraints:
- Follow existing auth architecture
- Use current validation library
- No new dependency
- Do not change public response format
- Add tests
- Update docs and memory.md

Before coding:
1. List affected files
2. Explain security risks
3. Ask for approval if schema changes are needed
```

---

## 21. Task boundaries

| Task | AI may do | Approval required |
|------|-----------|-------------------|
| Documentation | Draft and restructure | Final business rules |
| UI | Build from approved design | Major UX changes |
| Bug fix | Patch isolated defect | Behavior-changing workaround |
| Refactor | Small internal cleanup | Large rewrite |
| Database | Draft migration | Destructive change |
| Security | Implement approved controls | Auth model changes |
| Payments | Implement documented flow | Fees and settlement rules |
| Deployment | Prepare checklist | Production execution |

### Security review questions (every feature)

- Who can access this?
- How is identity verified?
- How is authorization enforced?
- What input is untrusted?
- What sensitive data is processed?
- What can be abused repeatedly?
- Is rate limiting needed?
- Is a transaction needed?
- What needs an audit log?
- What data must never be logged?

---

## 22. Release and definition of done

**Release checklist**

- Requirements approved; code review complete; automated tests pass
- Security-sensitive paths reviewed; migrations tested in staging
- Environment variables verified; docs and memory updated
- Rollback confirmed; staging smoke test complete
- Production deployment human-approved; post-deployment monitoring active

**Definition of done**

- Feature meets approved requirements
- Security controls implemented; relevant tests pass
- Failure and edge states handled; architecture respected
- No secrets introduced
- Feature / API / database docs updated; `memory.md` updated
- Changed files and remaining risks reported

---

## 23. Final operating workflow

1. Understand task  
2. Read rules and memory  
3. Read feature docs  
4. Inspect relevant code  
5. Plan and assess security  
6. Get approval if required  
7. Implement minimal safe change  
8. Test and review  
9. Update documentation  
10. Update `memory.md`  
11. Report changes and risk  
12. Merge after review  

**Final rule:** AI accelerates engineering. It does not replace engineering judgment, security review or founder approval.

---

## References

- Cursor Documentation — Project Rules, AGENTS.md
- NIST SP 800-218 — Secure Software Development Framework Version 1.1
- GitHub Documentation — Pull request reviews and CODEOWNERS
- OWASP secure software and application security guidance

This handbook adapts those practices to PARKAR’s architecture, PMS workflow and current stage.
