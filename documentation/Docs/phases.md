# PARKAR PMS — Development Roadmap & Technical Specification

**Version:** 1.0 (Founder & Developer Edition)

A phased plan for building a secure, stable and scalable Parking Management System.

---

## About This Document

This handbook explains how PARKAR PMS should be developed phase by phase. It is designed to keep the product secure, working and testable at every stage.

| Audience | How to use this doc |
| --- | --- |
| Founder | Understand why every phase exists and what should be delivered |
| Frontend developer | Understand screens, flows and validations |
| Backend developer | Understand business logic, APIs and database impact |
| UI/UX designer | Understand user journeys and states |
| QA engineer | Understand test cases and edge conditions |
| Future team members | Understand the system without starting from zero |

**Golden rule:** A phase is not complete until it is stable, tested, documented and deployable.

---

## About PARKAR PMS

PARKAR PMS is a responsive web application used by parking owners, parking managers and attendants to operate parking locations connected to the PARKAR marketplace.

| Interface | Primary user | Purpose |
| --- | --- | --- |
| Driver App | Drivers | Search, book, pay and navigate |
| PARKAR PMS | Parking owners and staff | Manage parking, bookings, occupancy and earnings |
| Admin Dashboard | PARKAR team | Approve, monitor, support and govern |

All interfaces should share the same backend, database, booking engine and availability engine.

---

## Development Principles

Rules for every phase:

1. Build one stable phase before starting the next.
2. Keep frontend, backend and database changes aligned.
3. Write business rules before coding.
4. Do not trust frontend validation alone.
5. Use role-based permissions from the beginning.
6. Store important status changes in audit logs.
7. Use staging before production.
8. Create backups before major releases.
9. Document every major decision.

---

## Phase 1 — Foundation

**Objective:** Create a production-ready foundation that every later feature can safely use.

**Why this phase matters:** Weak foundations create repeated code, security gaps, inconsistent design and expensive rewrites.

### Main deliverables

- Frontend and backend project setup
- Folder structure
- Routing
- Shared design system
- API communication layer
- Environment configuration
- Logging and error handling
- Base database connection
- Authentication placeholder
- Development, staging and production environments

### Phase 1.1 — Technical Foundation

**Recommended approach:** Modular monolith (not microservices) for MVP.

#### Frontend structure

```text
src/
├── api/
├── assets/
├── components/
├── layouts/
├── modules/
├── pages/
├── routes/
├── services/
├── store/
├── types/
└── utils/
```

#### Backend structure

```text
src/
├── auth/
├── owners/
├── parking/
├── bookings/
├── payments/
├── notifications/
├── reports/
├── common/
└── database/
```

### Phase 1.2 — Quality & Security Setup

| Area | Requirement |
| --- | --- |
| Code quality | Linting, formatting, naming rules and code review |
| Environment | Separate development, staging and production variables |
| Security | HTTPS, secret management and input validation |
| Errors | Consistent API error format |
| Monitoring | Basic API and application error tracking |
| Backups | Managed database backups |
| Testing | Unit and integration test setup |
| Documentation | README, setup guide and changelog |

### Definition of Done

- [ ] Frontend and backend run locally
- [ ] Database connection works
- [ ] Staging environment is available
- [ ] Base layout and routing work
- [ ] Error and loading states exist
- [ ] CI or repeatable deployment process exists

---

## Phase 2 — Authentication

**Objective:** Allow owners and staff to sign up, log in and maintain secure sessions.

**Recommended login method (MVP):** Mobile number + OTP.

```text
Enter mobile number
        ↓
Request OTP
        ↓
Verify OTP
        ↓
Create or load account
        ↓
Issue secure session
        ↓
Open PMS dashboard
```

### Phase 2.1 — Authentication Rules

| Feature | Rule |
| --- | --- |
| OTP expiry | 5–10 minutes |
| Retry limit | Limit failed attempts |
| Request limit | Rate-limit repeated OTP requests |
| Session | Use secure token/session strategy |
| Logout | Invalidate active session |
| Device security | Allow logout from all devices |
| Sensitive actions | Require re-verification for bank changes |
| Suspended account | Block login or restrict access |

#### APIs

| Method | Endpoint |
| --- | --- |
| `POST` | `/auth/request-otp` |
| `POST` | `/auth/verify-otp` |
| `POST` | `/auth/refresh` |
| `POST` | `/auth/logout` |
| `GET` | `/auth/me` |

### Phase 2.2 — Authentication Testing

| Case | Expected behaviour |
| --- | --- |
| Wrong OTP | Show clear error and reduce attempts |
| Expired OTP | Ask user to request a new code |
| Multiple OTP requests | Only latest valid OTP should work |
| Suspended owner | Block access and show support message |
| Network failure | Allow safe retry without duplicate account |
| Token expiry | Refresh session or return to login |
| Stolen session | Allow logout from all devices |

### Definition of Done

- [ ] Owner can sign up and log in
- [ ] Sessions remain secure
- [ ] OTP abuse is rate-limited
- [ ] Logout and token expiry work
- [ ] Authentication events are logged

### Phase 2.3 — Owner Profile

**Objective:** Create a complete owner profile that can later hold multiple parking locations.

| Section | Fields |
| --- | --- |
| Personal | Name, phone, email, photo |
| Business | Business name, type, address |
| KYC | Identity proof and verification status |
| Bank | Account holder, account number, IFSC |
| Tax | GST/PAN where applicable |
| Status | Draft, under review, verified, rejected, suspended |

### Phase 2.4 — Verification & Security

- KYC files must be private.
- Bank-detail changes require OTP or stronger verification.
- Owners cannot manually mark themselves verified.
- Every status change must be logged.
- Rejected documents must include a clear reason.
- Owners should be able to resubmit documents.
- Sensitive fields should be masked in the UI.

### Definition of Done (Owner Profile)

- [ ] Owner can complete and edit profile
- [ ] KYC can be submitted and reviewed
- [ ] Bank details can be securely stored
- [ ] Verification status is visible
- [ ] Sensitive changes are logged

---

## Phase 3 — Parking Registration

**Objective:** Allow an owner to register one or more parking locations with complete information.

```text
Basic details
        ↓
Address and map pin
        ↓
Capacity and dimensions
        ↓
Vehicle types
        ↓
Photos
        ↓
Amenities
        ↓
Pricing
        ↓
Timings
        ↓
Rules
        ↓
Review and submit
```

### Phase 3.1 — Registration Fields

| Category | Fields |
| --- | --- |
| Identity | Parking name, location type |
| Address | Address, landmark, latitude, longitude |
| Space | Capacity, dimensions, covered/uncovered |
| Vehicles | Bike, car, SUV, commercial vehicle |
| Photos | Entry, outside, inside and supporting images |
| Amenities | CCTV, guard, EV charging, valet, car wash |
| Pricing | Hourly, daily, overnight, special rates |
| Operations | Opening hours, holidays, temporary closures |
| Rules | Height, access instructions, restrictions |

### Phase 3.2 — Maps and Location

- Allow manual address entry.
- Allow map-based pin selection.
- Store latitude and longitude.
- Show a confirmation map before submission.
- Allow landmark and entry-gate instructions.
- Validate that coordinates are within a supported service area.
- Do not expose exact private-home entry details before confirmed booking.

### Phase 3.3 — Registration Validation

| Field | Validation |
| --- | --- |
| Parking name | Required and length limited |
| Location pin | Required |
| Capacity | Positive integer |
| Dimensions | Must support selected vehicle types |
| Photos | Minimum required image set |
| Pricing | Cannot be negative |
| Opening hours | Valid time range |
| Ownership proof | Required based on location type |
| Rules | No illegal or unsafe conditions |

### Phase 3.4 — Approval Flow

```text
Owner saves draft
        ↓
Owner submits listing
        ↓
Status becomes Under Review
        ↓
Admin checks KYC, photos and location
        ↓
Admin approves or rejects
        ↓
Approved parking becomes Active
        ↓
Rejected parking returns for correction
```

### Definition of Done

- [ ] Owner can create multiple parking locations
- [ ] Draft save and resume work
- [ ] All validations work
- [ ] Admin approval connection works
- [ ] Approved listing becomes available to the marketplace

---

## Phase 4 — Parking Management

**Objective:** Give owners daily control over capacity, pricing, hours, holidays and temporary closures.

Capabilities:

- View all locations
- Switch between locations
- Update capacity
- Block spaces temporarily
- Add maintenance periods
- Set holidays
- Change future pricing
- Temporarily pause new bookings
- View live occupancy

### Phase 4.1 — Capacity & Availability

```text
Available = Total Capacity − Confirmed Bookings − Walk-ins − Blocks − Maintenance
```

| Inventory type | Meaning |
| --- | --- |
| Total Capacity | Maximum safe vehicle count |
| Confirmed Booking | Capacity reserved through PARKAR |
| Walk-in | Offline customer added through PMS |
| Block | Temporary manual reduction |
| Maintenance | Space unavailable due to repair |
| Available | Capacity that can still be sold |

### Phase 4.2 — Availability Rules

- Capacity can never become negative.
- Every update must be validated on the server.
- A capacity reduction cannot affect active bookings.
- Pricing changes should not modify confirmed bookings.
- Suspended locations cannot accept new bookings.
- Closures should warn owners about future bookings.
- All manual capacity changes should be logged.

### Definition of Done

- [ ] Owner can manage active locations
- [ ] Availability calculations are accurate
- [ ] Temporary blocks work
- [ ] Future bookings are protected
- [ ] Capacity changes are audited

---

## Phase 5 — Booking Management

**Objective:** Allow owners to view and manage upcoming, active, completed, cancelled and disputed bookings.

```text
Pending
        ↓
Payment in Progress
        ↓
Confirmed
        ↓
Checked In
        ↓
Parking Active
        ↓
Checked Out
        ↓
Completed
```

### Phase 5.1 — Booking States

| State | Owner actions |
| --- | --- |
| Pending | View, accept or reject if approval mode is enabled |
| Confirmed | Prepare, contact support, cancel with reason |
| Checked In | View vehicle, add evidence, monitor duration |
| Parking Active | Extend or prepare checkout |
| Checked Out | Review charges and complete |
| Completed | View only, dispute if needed |
| Cancelled | View reason and refund status |
| No-show | Mark after allowed waiting period |

### Phase 5.2 — Booking Security

- Availability must be rechecked before confirmation.
- Use database transactions.
- Use a temporary capacity lock during payment.
- Only one booking should win the final available space.
- Payment webhooks must be idempotent.
- Every booking state change must be recorded.
- Bookings should never be permanently deleted.

### Phase 5.3 — Booking Edge Cases

| Case | Expected behaviour |
| --- | --- |
| Owner cancels | Refund driver and reduce owner reliability |
| Driver arrives early | Apply early-arrival policy |
| Driver arrives late | Apply grace period or no-show rule |
| Payment succeeds but app fails | Webhook reconciles booking |
| Parking closes unexpectedly | Support, refund and alternative location |
| Two users book final space | Only one confirmation succeeds |

### Definition of Done

- [ ] All booking states work
- [ ] Double booking is prevented
- [ ] Owner can manage relevant actions
- [ ] Booking history is complete
- [ ] Failed payments and cancellations recover correctly

---

## Phase 6 — Walk-ins & Timer Engine

**Objective:** Allow owners to record customers who arrive without using PARKAR and automatically protect capacity.

```text
Walk-in arrives
        ↓
Add vehicle
        ↓
Select expected duration
        ↓
Capacity reduces
        ↓
Timer starts
        ↓
Reminder appears
        ↓
Extend or checkout
        ↓
Capacity returns
```

### Phase 6.1 — Timer Rules

| Event | System behaviour |
| --- | --- |
| Start | Save expected end time and reduce capacity |
| Reminder | Notify owner before expiry |
| Extend | Check future availability first |
| Manual checkout | End timer and restore capacity |
| Expiry | Auto-release or request confirmation |
| No response | Follow location policy and log action |

> **Important:** Auto-release should be configurable because a vehicle may still be physically present.

### Phase 6.2 — Walk-in Testing

Cases that must be tested:

- Timer ends while browser is closed
- Server restarts during active timer
- Owner extends beyond a future booking
- Multiple attendants update the same walk-in
- Vehicle leaves early
- Owner forgets to check out
- Network fails while creating the walk-in

### Definition of Done

- [ ] Walk-ins reduce capacity
- [ ] Timers survive refresh and restart
- [ ] Extensions validate availability
- [ ] Checkout restores capacity
- [ ] Every action is logged

---

## Phase 7 — Check-In & Checkout

**Objective:** Control actual parking usage with verified entry and exit.

### Check-in flow

```text
Driver arrives
        ↓
Verify OTP or booking code
        ↓
Confirm vehicle
        ↓
Capture entry photos
        ↓
Tap Check In
        ↓
Store actual entry time
        ↓
Booking becomes active
```

### Checkout flow

```text
Driver requests exit
        ↓
Verify OTP
        ↓
Capture exit photos
        ↓
Calculate overstay
        ↓
Tap Check Out
        ↓
Complete booking
        ↓
Restore capacity
```

### Phase 7.1 — Evidence and Charges

| Item | Purpose |
| --- | --- |
| Entry photo | Shows condition before parking |
| Exit photo | Shows condition at departure |
| Damage photo | Supports dispute handling |
| Actual entry time | Measures real usage |
| Actual exit time | Measures overstay |
| Extra charge | Applied according to policy |

### Definition of Done

- [ ] OTP check-in works
- [ ] Entry and exit photos upload securely
- [ ] Actual times are stored
- [ ] Overstay is calculated
- [ ] Checkout restores capacity

---

## Phase 8 — Payments & Earnings

**Objective:** Give owners a transparent view of gross booking amounts, commissions, refunds, deductions and net payout.

| Amount | Meaning |
| --- | --- |
| Gross Amount | Total paid by driver |
| Commission | PARKAR platform fee |
| Gateway/Tax | Applicable deductions |
| Refund | Amount returned to driver |
| Net Earning | Amount payable to owner |
| Pending | Not yet settled |
| Settled | Transferred to bank |

### Phase 8.1 — Settlement Flow

```text
Driver pays
        ↓
Payment confirmed
        ↓
Booking completed
        ↓
Deductions calculated
        ↓
Owner amount becomes eligible
        ↓
Settlement created
        ↓
Provider confirms transfer
        ↓
Payout marked successful
```

> **Important:** Do not mark payout successful until confirmed by the payment provider or reconciliation.

### Phase 8.2 — Financial Security

- Bank-detail changes require re-verification.
- Payment webhooks must be verified.
- All calculations must happen on the backend.
- Never store raw card details.
- Refunds and payouts need unique transaction references.
- Financial records should never be deleted.
- Failed payouts must support retry and reconciliation.

### Definition of Done

- [ ] Owner can view earnings and deductions
- [ ] Payout statuses are accurate
- [ ] Refunds affect owner earnings correctly
- [ ] Financial actions are auditable
- [ ] Bank changes are protected

---

## Phase 9 — Reports & Analytics

**Objective:** Help owners understand performance.

| Report | What it shows |
| --- | --- |
| Revenue | Gross, deductions and net earnings |
| Occupancy | Capacity usage by time period |
| Bookings | Confirmed, completed, cancelled and no-show |
| Peak Hours | Highest-demand time windows |
| Walk-ins | Offline customer activity |
| Payouts | Pending, processing and completed settlements |
| Staff Activity | Actions performed by attendants |
| Reliability | Cancellations and availability errors |

### Export options

- CSV for raw data
- Excel for analysis
- PDF for sharing and accounting

### Definition of Done

- [ ] Reports match transactional data
- [ ] Filters work by date and location
- [ ] Exports are accurate
- [ ] Sensitive reports respect permissions

---

## Phase 10 — Settings & Staff

**Objective:** Allow controlled customization of business, parking, notifications, bank, tax, staff and security settings.

| Setting | Examples |
| --- | --- |
| Business | Name, contact and support details |
| Parking | Hours, rules and defaults |
| Notifications | Push, email and SMS preferences |
| Bank | Settlement account |
| Tax | GST and invoice information |
| Staff | Invite, remove and assign roles |
| Security | Sessions and device logout |
| Appearance | Theme and language (later) |

### Phase 10.1 — Role Permissions

| Permission | Owner | Manager | Attendant | Accountant |
| --- | --- | --- | --- | --- |
| Edit profile | Yes | Limited | No | No |
| Change pricing | Yes | Optional | No | No |
| Check in/out | Yes | Yes | Yes | No |
| Add walk-in | Yes | Yes | Yes | No |
| View earnings | Yes | Optional | No | Yes |
| Change bank details | Yes | No | No | No |
| Invite staff | Yes | Optional | No | No |

### Definition of Done

- [ ] Owners can manage settings
- [ ] Staff can be invited
- [ ] Permissions are enforced by backend
- [ ] Sensitive actions are restricted
- [ ] Role changes are logged

---

## Phase 11 — Advanced Features

Build only after the core PMS is stable.

| Feature | Purpose |
| --- | --- |
| QR Check-in | Faster booking verification |
| ANPR | Automatic number plate recognition |
| Boom Barrier | Automated entry and exit |
| IoT Sensors | Physical occupancy detection |
| Dynamic Pricing | Adjust price based on demand |
| AI Forecasting | Predict occupancy and revenue |
| Multiple Managers | Advanced team operations |
| Public API | Commercial integrations |
| White Label | PMS for external parking businesses |

> **Rule:** Advanced features should not begin until booking, availability, check-in and payments are stable in real pilots.

---

## Cross-Phase Security Checklist

- [ ] HTTPS everywhere
- [ ] Rate limiting
- [ ] Input validation
- [ ] Role-based access
- [ ] Secure sessions
- [ ] Private KYC storage
- [ ] Signed file URLs
- [ ] Webhook verification
- [ ] Database backups
- [ ] Audit logs
- [ ] Secrets outside source code
- [ ] Staging before production
- [ ] Dependency updates
- [ ] Regular permission review

---

## Cross-Phase Testing Strategy

| Test type | Purpose |
| --- | --- |
| Unit | Test pricing, availability and state rules |
| Integration | Test payments, maps, notifications and storage |
| Concurrency | Test simultaneous booking attempts |
| Security | Test permissions and OTP abuse |
| User Acceptance | Test with real owners and attendants |
| Regression | Ensure old features still work |
| Recovery | Test backups and failure handling |
| Performance | Test expected pilot traffic |

---

## Release Process

```text
Requirements approved
        ↓
UI and technical design completed
        ↓
Development completed
        ↓
Code review
        ↓
Automated tests pass
        ↓
QA testing
        ↓
Founder acceptance
        ↓
Staging release
        ↓
Production backup
        ↓
Production deployment
        ↓
Monitoring
        ↓
Release notes
```

---

## Global Definition of Done (Pilot Ready)

- [ ] Owner can sign up and complete profile
- [ ] Parking can be registered and approved
- [ ] Capacity cannot be oversold
- [ ] Online bookings update availability
- [ ] Walk-ins and timers work
- [ ] OTP check-in and checkout work
- [ ] Earnings and payouts are accurate
- [ ] Critical actions are logged
- [ ] Errors are understandable
- [ ] Backups and monitoring are enabled
- [ ] Pilot can run with 5–10 parking partners

---

## Founder Decisions Required

Questions to finalise before implementation:

1. Which owner documents are mandatory?
2. Will all listings require admin approval?
3. Will bookings be instant or owner-approved?
4. How long is the payment capacity lock?
5. What is the cancellation policy?
6. How long is the arrival grace period?
7. What happens during overstay?
8. Should timer expiry auto-release capacity?
9. When are owner payouts released?
10. What commission applies to each plan?
11. How are damage and theft disputes handled?
12. Which city and parking type are used for the first pilot?

---

## Recommended Timeline

Suggested order, not a fixed promise.

| Phase | Suggested duration |
| --- | --- |
| 0 — Foundation | 1–2 weeks |
| 1 — Authentication | 1 week |
| 2 — Owner Profile | 1–2 weeks |
| 3 — Parking Registration | 2–3 weeks |
| 4 — Parking Management | 2 weeks |
| 5 — Booking Management | 2–3 weeks |
| 6 — Walk-ins & Timer | 1–2 weeks |
| 7 — Check-in/Checkout | 1–2 weeks |
| 8 — Payments & Earnings | 2–3 weeks |
| 9 — Reports | 1–2 weeks |
| 10 — Settings & Staff | 1–2 weeks |
| Pilot Stabilisation | 2–4 weeks |

Actual timeline depends on team size, experience, design readiness and external integrations.

---

## Glossary

| Term | Meaning |
| --- | --- |
| API | A controlled way for frontend and backend to communicate |
| Backend | Server-side code that applies business rules |
| Database | Structured storage for product data |
| Webhook | Automatic notification from an external service |
| RBAC | Role-based access control |
| Concurrency | Multiple actions happening at the same time |
| Transaction | Database actions that succeed or fail together |
| Audit Log | Permanent record of important actions |
| Staging | Testing environment before production |
| Modular Monolith | One backend organised into clear modules |
| ANPR | Automatic number plate recognition |
| Idempotency | Safely handling repeated requests without duplication |
