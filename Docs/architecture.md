# PARKAR PMS — Technical Design & Architecture Handbook

A clear, founder-friendly and developer-ready specification for the Parking Management System.

| Meta | Value |
|------|--------|
| **Version** | 1.0 |
| **Module** | MVP Architecture — Parking Owner Web App |
| **Audience** | Founders, developers, designers, PMs, operations, technical advisors |
| **Scope** | What every major PMS feature does, why it exists, how it behaves, rules developers must follow, and what can be added later |

---

## How to Read This Handbook

| Section type | Use it to |
|--------------|-----------|
| **Product** | Understand what owners and staff will do |
| **Architecture** | Understand how the system should be built |
| **Business Rules** | Avoid inconsistent behaviour |
| **Edge Cases** | Plan for failures before they happen |
| **Open Questions** | Track founder decisions that are still pending |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision](#2-product-vision)
3. [Scope of the PMS](#3-scope-of-the-pms)
4. [User Roles](#4-user-roles)
5. [High-Level Architecture](#5-high-level-architecture)
6. [Recommended MVP Technology](#6-recommended-mvp-technology)
7. [Owner Onboarding Flow](#7-owner-onboarding-flow)
8. [Owner Profile](#8-owner-profile)
9. [Parking Registration](#9-parking-registration)
10. [Parking Location Types](#10-parking-location-types)
11. [Multi-Location Support](#11-multi-location-support)
12. [Capacity Model](#12-capacity-model)
13. [Availability Engine](#13-availability-engine)
14. [Booking Lifecycle](#14-booking-lifecycle)
15. [Walk-In Management & Timer Engine](#15-walk-in-management--timer-engine)
16. [Recurring Reservations](#16-recurring-reservations)
17. [Check-In & Checkout Flows](#17-check-in--checkout-flows)
18. [Vehicle Photos and Evidence](#18-vehicle-photos-and-evidence)
19. [Pricing Architecture](#19-pricing-architecture)
20. [Plans and Trust Levels](#20-plans-and-trust-levels)
21. [Dashboard & Booking Management](#21-dashboard--booking-management)
22. [Reports, Earnings & Settlements](#22-reports-earnings--settlements)
23. [Cancellation and Refunds](#23-cancellation-and-refunds)
24. [Notifications](#24-notifications)
25. [Database Architecture](#25-database-architecture)
26. [API Architecture](#26-api-architecture)
27. [Authentication, Security & RBAC](#27-authentication-security--rbac)
28. [File Storage & External Integrations](#28-file-storage--external-integrations)
29. [Error Handling, Audit Logs & Monitoring](#29-error-handling-audit-logs--monitoring)
30. [Deployment & Scalability](#30-deployment--scalability)
31. [Business Rules](#31-business-rules)
32. [Critical Edge Cases](#32-critical-edge-cases)
33. [Legal and Privacy Notes](#33-legal-and-privacy-notes)
34. [Testing Strategy](#34-testing-strategy)
35. [MVP Build Order & Definition of Done](#35-mvp-build-order--definition-of-done)
36. [Founder Decisions Still Required](#36-founder-decisions-still-required)
37. [Glossary](#37-glossary)

---

## 1. Executive Summary

PARKAR PMS is the web-based operational system for people and businesses that register parking spaces on the PARKAR platform.

It allows parking owners to register locations, set capacity, define pricing, manage bookings, track walk-ins, control availability, view earnings, operate check-in and checkout, and manage staff.

| Product | Primary User | Purpose |
|---------|--------------|---------|
| **Driver App** | People looking for parking | Search, reserve, pay, navigate and manage bookings |
| **PARKAR PMS** | Parking owners and operators | Manage supply, operations, capacity, bookings and earnings |
| **Admin Dashboard** | PARKAR internal team | Approve, monitor, support and govern the marketplace |

**Core principle:** PARKAR has three interfaces, but they should use one shared backend, one shared database, one booking engine and one availability engine.

---

## 2. Product Vision

The purpose of PARKAR PMS is to make parking spaces digitally manageable and commercially useful.

- Help owners earn from empty or underused parking.
- Reduce manual parking management.
- Keep live availability accurate.
- Support both online bookings and walk-in vehicles.
- Give owners clear visibility into revenue and occupancy.
- Build a reliable parking supply network for the driver app.
- Create a future standalone parking-management SaaS product.
- Make every valid parking space visible, manageable and bookable.

---

## 3. Scope of the PMS

| Included in PMS | Not controlled directly by PMS |
|-----------------|--------------------------------|
| Owner onboarding | Driver search interface |
| Parking registration | Platform-wide admin approvals |
| Capacity and availability | Global fraud investigation |
| Booking operations | Driver wallet |
| Walk-in management | Marketing website |
| Pricing and timings | Investor dashboards |
| Earnings and payout visibility | Smart sensors in MVP |
| Staff permissions | Government portal integrations in MVP |

The PMS can display data created by other parts of the platform—for example booking details or verification status—but it should not expose internal admin-only controls.

---

## 4. User Roles

| Role | Who they are | Typical Access |
|------|--------------|----------------|
| **Parking Owner** | The legal owner or main operator | Full control, pricing, payouts, staff |
| **Parking Manager** | Runs one or more locations | Bookings, inventory, reports, limited settings |
| **Parking Attendant** | Works at entry or parking area | Check-in, checkout, walk-ins, timer, photos |
| **Accountant** | Handles financial records | Earnings, invoices, payout history |
| **Viewer** | Senior staff or auditor | Read-only reports |

**MVP recommendation:** Start with Owner and Attendant. Add more granular roles after real usage proves the need.

---

## 5. High-Level Architecture

```
PMS Web App (React / Next.js)
        ↓
Backend API (Business Logic)
        ↓
PostgreSQL (Main Database)
        +
Cloud Storage · Maps · Payments · Notifications
```

The web app must never directly change the database. All changes must go through the backend so the system can validate permissions, capacity, pricing and booking rules.

---

## 6. Recommended MVP Technology

| Layer | Recommended Option | Why |
|-------|--------------------|-----|
| Frontend | React or Next.js | Responsive web app, reusable components, strong ecosystem |
| Backend | Node.js with NestJS or Express | Fast development and good TypeScript support |
| Database | PostgreSQL | Reliable for bookings, payments and relationships |
| Authentication | OTP with secure session/JWT | Simple for owners and staff |
| Storage | AWS S3 or Cloudinary | Parking photos, KYC and documents |
| Payments | Razorpay | Useful for Indian payments and settlements |
| Maps | Google Maps Platform | Address search and map location picking |
| Notifications | Firebase plus SMS/email provider | Push, alerts and OTP |
| Hosting | Managed cloud platform | Faster MVP deployment and maintenance |

---

## 7. Owner Onboarding Flow

```
Enter mobile number
        ↓
Verify OTP
        ↓
Create owner profile
        ↓
Add address and map location
        ↓
Enter space dimensions and capacity
        ↓
Upload space photos
        ↓
Choose location type
        ↓
Select amenities and parking condition
        ↓
Choose or skip plan
        ↓
Submit KYC and ownership proof
        ↓
Admin review
        ↓
Parking becomes active
```

Each step should save progress. An owner must be able to close the browser and continue later.

---

## 8. Owner Profile

| Field | Purpose | Important Rule |
|-------|---------|----------------|
| Full name | Identity | Must match KYC document |
| Mobile number | Login and communication | Unique and OTP verified |
| Email | Statements and alerts | Optional in MVP but recommended |
| Business type | Individual, hotel, mall, society, etc. | Used for verification rules |
| KYC status | Shows verification stage | Cannot be edited manually by owner |
| Bank details | Payout destination | Changes require re-verification |
| Tax details | Invoices and compliance | Optional until legally required |
| Account status | Active, suspended or closed | Admin controlled |

---

## 9. Parking Registration

| Category | Fields |
|----------|--------|
| Identity | Parking name, owner, location type |
| Address | Manual address, map pin, latitude, longitude, landmark |
| Space | Total capacity, dimensions, supported vehicle types |
| Media | Entrance photo, inside photos, outside photos |
| Operations | Opening hours, closing hours, holidays |
| Pricing | Hourly, daily, overnight and special rates |
| Amenities | CCTV, guard, EV charging, valet, car wash, covered |
| Rules | Height limit, vehicle restrictions, entry instructions |
| Verification | KYC, ownership proof, approval status |

---

## 10. Parking Location Types

| Type | Examples | Operational Difference |
|------|----------|------------------------|
| Home | Driveway or residential house | May require owner approval |
| Apartment | Society or residential complex | Guard and access rules |
| Commercial | Office or private building | Fixed operating hours |
| Mall | Large structured parking | High capacity and possible integrations |
| Hotel | Guest and public parking | Supports long-duration bookings |
| Local Parking | Independent lot | May rely on attendant operations |
| Event Venue | Wedding hall or stadium | Temporary or event-based pricing |

---

## 11. Multi-Location Support

One owner can manage multiple parking locations.

```
Owner Account
    ├── Location A
    ├── Location B
    └── Location C
```

- Each location has separate capacity, pricing and operating hours.
- Staff access may be limited to selected locations.
- Bookings and earnings must be filterable by location.
- Reports should support both location-level and combined totals.
- Suspending one location must not suspend every location.

---

## 12. Capacity Model

For the MVP, capacity should be managed as a number. Owners do not need to create every physical slot unless a future use case requires named slots.

```
Available Capacity =
  Total Capacity
  − App Bookings
  − Walk-ins
  − Blocked Spaces
  − Maintenance
```

| Inventory Type | Meaning |
|----------------|---------|
| Total Capacity | Maximum vehicles that can be safely parked |
| App Bookings | Confirmed PARKAR reservations |
| Walk-ins | Offline customers entered through PMS |
| Blocked Spaces | Temporarily unavailable capacity |
| Maintenance | Spaces unavailable due to repair or operational issues |
| Available Capacity | Remaining capacity that may be sold |

---

## 13. Availability Engine

The availability engine decides whether the driver app can show and sell a parking space for a specific date and time range.

### Inputs

- Parking location ID
- Requested date
- Start time
- End time
- Vehicle type
- Requested quantity
- Booking mode

### Checks

```
Is the parking approved and active?
        ↓
Is the requested time within operating hours?
        ↓
Is the parking closed for a holiday?
        ↓
Is any capacity blocked?
        ↓
How many confirmed bookings overlap?
        ↓
How many walk-ins overlap?
        ↓
How many recurring reservations overlap?
        ↓
Is capacity still available?
```

### Availability Overlap Logic

Two bookings overlap when one booking starts before the other booking ends, and ends after the other booking starts.

**Simple rule:** Booking A overlaps Booking B when `A.start < B.end` and `A.end > B.start`.

| Example | Result |
|---------|--------|
| Booking A: 10:00–11:00, Booking B: 11:00–12:00 | No overlap |
| Booking A: 10:00–11:30, Booking B: 11:00–12:00 | Overlap |
| Booking A: 10:00–12:00, Booking B: 10:30–11:00 | Overlap |
| Booking A: 10:00–12:00, Booking B: 09:00–10:00 | No overlap |

**Developer note:** Timezone handling must be consistent. Store timestamps in UTC and display them in the location's timezone.

### Availability Concurrency

Two drivers may try to reserve the last available space at the same moment. The backend must prevent both from receiving confirmation.

- Recheck availability immediately before payment confirmation.
- Use a short capacity lock while payment is in progress.
- Use database transactions.
- Use row-level locking or an equivalent safe concurrency method.
- Release the lock when payment fails or expires.
- Never rely only on the availability shown on the frontend.

**Critical rule:** Capacity must never become negative.

---

## 14. Booking Lifecycle

```
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

**Alternative states:** Payment Failed, Cancelled, No-show, Disputed and Refunded.

### Booking State Rules

| Current State | Allowed Next State | Not Allowed |
|---------------|--------------------|-------------|
| Pending | Payment in Progress or Cancelled | Checked In |
| Payment in Progress | Confirmed, Payment Failed or Cancelled | Completed |
| Confirmed | Checked In, Cancelled or No-show | Refunded without cancellation |
| Checked In | Parking Active or Checked Out | Pending |
| Parking Active | Checked Out or Disputed | Cancelled |
| Checked Out | Completed or Disputed | Checked In again |
| Completed | Disputed or Refunded | Active |

### Booking Approval Modes

| Mode | How it works | Best for |
|------|--------------|----------|
| Instant Booking | Confirmed after payment and availability check | Commercial lots and predictable supply |
| Owner Approval | Owner must accept before final confirmation | Private homes or sensitive spaces |
| Hybrid | Instant during selected hours, approval at other times | Mixed-use locations |

PARKAR should decide which modes are available based on owner verification, cancellation history and operational reliability.

---

## 15. Walk-In Management & Timer Engine

### Walk-In Flow

```
Walk-in arrives
        ↓
Attendant taps Add Walk-in
        ↓
Select vehicle type
        ↓
Enter vehicle number if required
        ↓
Choose expected duration
        ↓
Capacity reduces
        ↓
Timer starts
        ↓
Customer leaves
        ↓
Attendant checks out
        ↓
Capacity returns
```

### Timer Engine

The timer feature reduces the risk that owners forget to reopen capacity.

| Event | System Behaviour |
|-------|------------------|
| Timer starts | Capacity is reduced and expected end time is saved |
| Reminder before expiry | Owner or attendant receives an alert |
| Timer expires | System follows the configured release policy |
| Owner extends | End time updates after availability validation |
| Manual checkout | Timer ends immediately and capacity returns |
| No response | Auto-release or escalation based on location policy |

**Recommended policy:** Auto-release should be configurable because the vehicle may still be physically present.

---

## 16. Recurring Reservations

Owners may reserve capacity for a customer or business on a repeating schedule.

- Every weekday from 9:00 AM to 6:00 PM
- Every Saturday from 10:00 AM to 2:00 PM
- One reserved space for an entire month
- Multiple spaces reserved for a company

Recurring reservations must be included in availability calculations and should generate individual usage records where needed.

---

## 17. Check-In & Checkout Flows

### Check-In Flow

```
Driver arrives
        ↓
Owner verifies booking or OTP
        ↓
Vehicle details are checked
        ↓
Entry photos may be captured
        ↓
Owner taps Check In
        ↓
Actual arrival time is stored
        ↓
Booking becomes active
```

The system may allow a small early-arrival window. The exact window should be configurable.

### Checkout Flow

```
Driver requests exit
        ↓
Owner verifies booking or OTP
        ↓
Exit photos may be captured
        ↓
Owner taps Check Out
        ↓
Actual end time is stored
        ↓
Overstay charges are calculated
        ↓
Booking becomes completed
        ↓
Capacity returns
```

---

## 18. Vehicle Photos and Evidence

| Photo Type | Purpose |
|------------|---------|
| Entry Exterior | Shows condition before parking |
| Entry Interior | Optional evidence where relevant |
| Parking Position | Proof that the vehicle was parked correctly |
| Exit Exterior | Shows condition at departure |
| Damage Evidence | Used during dispute review |
| Parking Site | Supports operational or safety investigation |

Images should be compressed, timestamped and stored in cloud storage. The database should store the file URL and metadata, not the entire image.

---

## 19. Pricing Architecture

| Pricing Type | Example |
|--------------|---------|
| Hourly | ₹50 per hour |
| Daily | ₹500 per day |
| Overnight | ₹700 from 8 PM to 8 AM |
| Weekend | Different rate on Saturday and Sunday |
| Event | Special price during festivals or events |
| Vehicle-Based | Bike, car and SUV have different rates |
| Subscription | Monthly reserved parking |
| Add-on | Car wash, valet or EV charging |

**Important:** Confirmed bookings must preserve the price that was accepted at booking time, even if the owner changes rates later.

---

## 20. Plans and Trust Levels

| Plan Concept | Customer Type | Possible Benefit |
|--------------|---------------|------------------|
| Basic | May include unverified users and vehicles | Lower entry barrier |
| Moderate | Verified customers | Improved trust |
| Premium | Verified customers and vehicles | Highest trust level |
| No Plan | Owner skips plan selection | Limited access to trust benefits |

Final plan names, percentages, commissions and legal wording must be reviewed before launch.

---

## 21. Dashboard & Booking Management

### Dashboard Design

What the owner sees first:

- Current available capacity
- Active bookings
- Walk-ins currently parked
- Bookings arriving soon
- Timers expiring soon
- Today's gross earnings
- Today's net owner earnings
- Pending issues or alerts
- Quick actions: Add Walk-in, Block Capacity, Check In, Check Out
- Location selector for multi-location owners

### Booking Management Screen

| Tab | What it contains |
|-----|------------------|
| Upcoming | Confirmed future bookings |
| Arriving Soon | Bookings close to start time |
| Active | Checked-in vehicles |
| Completed | Finished bookings |
| Cancelled | Cancelled by user or owner |
| No-show | User did not arrive |
| Disputed | Bookings under review |

---

## 22. Reports, Earnings & Settlements

### Reports and Analytics

| Report | Purpose |
|--------|---------|
| Occupancy | Shows how much capacity was used |
| Revenue | Gross, fees, refunds and net earnings |
| Bookings | Confirmed, cancelled, no-show and completed |
| Peak Hours | Shows the busiest times |
| Customer | Repeat users and average duration |
| Staff Activity | Actions performed by attendants |
| Payout | Pending, processing, completed and failed settlements |
| Reliability | Owner cancellations and availability mistakes |

### Earnings Model

| Amount | Meaning |
|--------|---------|
| Gross Booking Amount | Total amount paid by the driver |
| Platform Commission | PARKAR fee |
| Taxes and Gateway Fees | Applicable deductions |
| Refund Deduction | Amount returned to the driver |
| Net Owner Earning | Amount payable to the owner |
| Settled Amount | Already transferred |
| Pending Amount | Waiting for settlement |

The PMS should show an earnings ledger. It should not present itself as an unregulated bank wallet.

### Settlement Flow

```
Driver pays
        ↓
Payment provider confirms
        ↓
Booking becomes confirmed
        ↓
Parking service is completed
        ↓
Commission and deductions are calculated
        ↓
Owner amount becomes eligible
        ↓
Settlement is created
        ↓
Money reaches owner bank account
        ↓
Payout status updates
```

A payout should be marked successful only after confirmation from the payment provider or reconciliation process.

---

## 23. Cancellation and Refunds

| Scenario | Recommended Handling |
|----------|----------------------|
| Driver cancels early | Apply policy and refund eligible amount |
| Driver cancels late | Partial or no refund |
| Owner cancels | Full refund plus reliability penalty |
| Parking unavailable on arrival | Refund and offer alternative parking |
| Payment captured but booking failed | Automatic reconciliation and refund |
| Disputed service | Hold payout if required |

---

## 24. Notifications

| Event | Recommended Channel |
|-------|---------------------|
| New booking | Push, in-app and optional SMS |
| Booking cancelled | Push and in-app |
| Customer arriving soon | Push |
| Timer expiring | Push and in-app |
| Overstay | Push |
| Payout completed | Push and email |
| KYC rejected | In-app and email |
| Parking suspended | In-app, email and SMS |
| Support response | In-app and email |

---

## 25. Database Architecture

### Main Data Entities

| Entity | Purpose |
|--------|---------|
| `owners` | Identity, phone, KYC status |
| `owner_staff` | Role, permissions, location access |
| `parking_locations` | Address, capacity, status |
| `bookings` | User, location, time, status |
| `walk_ins` | Vehicle, timer, location |
| `payments` | Booking, amount, status |
| `payouts` | Owner, amount, status |
| `audit_logs` | Actor, action, timestamp |

Use foreign keys, transactions and database constraints to protect booking and payment integrity.

### Recommended Core Tables

| Table | Purpose |
|-------|---------|
| `users` | Driver accounts |
| `owners` | Parking owner identities |
| `owner_staff` | Managers and attendants |
| `parking_locations` | Registered parking properties |
| `parking_media` | Photos and documents |
| `pricing_rules` | Time and vehicle-based pricing |
| `bookings` | Reservation lifecycle |
| `booking_status_history` | Every booking state change |
| `walk_ins` | Offline occupancy |
| `availability_blocks` | Maintenance or blocked capacity |
| `payments` | Driver payments |
| `refunds` | Refund lifecycle |
| `payouts` | Owner settlements |
| `notifications` | Delivery and read status |
| `audit_logs` | Security and operational history |

---

## 26. API Architecture

### Example Endpoints

| Domain | Example Endpoint |
|--------|------------------|
| Authentication | `POST /v1/auth/request-otp` |
| Authentication | `POST /v1/auth/verify-otp` |
| Parking | `POST /v1/pms/locations` |
| Parking | `PATCH /v1/pms/locations/:id` |
| Availability | `GET /v1/pms/availability` |
| Bookings | `GET /v1/pms/bookings` |
| Check-In | `POST /v1/pms/bookings/:id/check-in` |
| Walk-Ins | `POST /v1/pms/walk-ins` |
| Checkout | `PATCH /v1/pms/walk-ins/:id/checkout` |
| Earnings | `GET /v1/pms/earnings` |
| Reports | `GET /v1/pms/reports/occupancy` |

### API Response Rules

Every API should return a predictable structure.

```json
{
  "success": true,
  "data": {},
  "message": "Parking updated successfully",
  "requestId": "req_123"
}
```

Error responses should contain a clear user message, a developer error code and a request ID for support.

---

## 27. Authentication, Security & RBAC

### Authentication and Session Security

- Use OTP or secure passwordless login.
- Rate-limit OTP requests and verification attempts.
- Use short-lived access tokens and secure refresh sessions.
- Support logout from all devices.
- Require stronger verification for payout and bank-detail changes.
- Use HTTPS everywhere.
- Never store raw OTPs or passwords.
- Expire suspicious or old sessions.

### Role-Based Access Control

| Permission | Owner | Manager | Attendant | Accountant |
|------------|-------|---------|-----------|------------|
| Edit parking profile | Yes | Limited | No | No |
| Change pricing | Yes | Optional | No | No |
| Check in/out | Yes | Yes | Yes | No |
| Add walk-in | Yes | Yes | Yes | No |
| View earnings | Yes | Optional | No | Yes |
| Change bank details | Yes | No | No | No |
| Invite staff | Yes | Optional | No | No |

---

## 28. File Storage & External Integrations

### File Storage

- Store files in object storage, not PostgreSQL.
- Validate file type and size.
- Compress images for faster loading.
- Use private access for KYC files.
- Use signed URLs for sensitive documents.
- Store metadata and upload status in the database.
- Scan uploaded files for malware where possible.
- Define retention rules for old or rejected documents.

### External Integrations

| Service | Purpose | Failure Handling |
|---------|---------|------------------|
| Google Maps | Address, map pin and geocoding | Retry and allow manual address |
| Razorpay | Payment and payout | Webhook retry and reconciliation |
| Firebase | Push notifications | Keep in-app notification |
| SMS Provider | OTP and alerts | Add fallback provider later |
| Email Provider | Statements and alerts | Queue and retry |
| Cloud Storage | Images and documents | Retry upload and show status |

---

## 29. Error Handling, Audit Logs & Monitoring

### Error Handling

| User Message | Internal Meaning |
|--------------|------------------|
| We could not update capacity. Please try again. | Database or concurrency error |
| This booking is already checked in. | Invalid state transition |
| Payment status is being verified. | Webhook delay |
| You do not have permission. | Role or ownership mismatch |
| This time range is unavailable. | Overlap or blocked capacity |

Never show users: database queries, stack traces, secret keys or server paths.

### Audit Logs

Important actions that must be traceable:

- Owner login and failed attempts
- Parking profile changes
- Capacity updates
- Pricing updates
- Booking approvals and cancellations
- Check-in and checkout
- Timer start, extension and release
- Bank-detail changes
- Payout changes
- Staff permission changes
- Admin actions affecting owner accounts

### Monitoring

| Metric | Why it matters |
|--------|----------------|
| API error rate | Detect application failures |
| Database response time | Detect slow queries |
| Booking failure rate | Protect revenue and trust |
| Payment webhook delay | Prevent booking-payment mismatch |
| Notification failure rate | Ensure owners receive alerts |
| Timer job failures | Prevent incorrect capacity |
| File upload failures | Protect onboarding and evidence |
| Login abuse | Detect attacks |

---

## 30. Deployment & Scalability

### Deployment Architecture

```
Frontend Hosting / CDN
        ↓
Backend Application
        ↓
Managed PostgreSQL
        +
Object Storage · Background Jobs · Monitoring · Backups
```

Use separate development, staging and production environments.

### Scalability Roadmap

| Stage | Recommended Architecture |
|-------|--------------------------|
| MVP | One backend service and one PostgreSQL database |
| Early Growth | Redis cache and background job queue |
| Multi-City | Load balancer and multiple backend instances |
| Large Scale | Separate high-load domains such as analytics |
| Smart Parking | ANPR, sensors, boom barriers and device integrations |

Do not start with microservices. Use a clean modular monolith until real scale or team size creates a need.

---

## 31. Business Rules

Rules that should never be inconsistent:

1. Capacity can never become negative.
2. A booking cannot be confirmed without availability.
3. A completed booking cannot be edited like an active booking.
4. Cancelled bookings cannot return to active state.
5. Owner payout cannot be released before the booking is eligible.
6. Pricing changes do not affect already confirmed bookings.
7. A suspended location must not accept new bookings.
8. Every payment and payout status change must be stored.
9. Sensitive changes require stronger verification.
10. Every operational action must be linked to the user who performed it.

---

## 32. Critical Edge Cases

| Edge Case | Expected Behaviour |
|-----------|--------------------|
| Owner closes parking while future bookings exist | Block closure until bookings are resolved or migrated |
| Two users book last slot together | Only one confirmation succeeds |
| Payment succeeds but response fails | Webhook reconciles booking |
| Timer expires but vehicle remains | Use configured release/confirmation policy |
| Owner forgets to check out | Send reminders and allow manual correction with audit log |
| Driver arrives early | Apply configurable early-arrival rule |
| Driver overstays | Calculate extra charge and alert owner |
| Network fails during check-in | Retry safely without duplicate action |
| Admin suspends parking during active booking | Allow active booking resolution but block new ones |
| Vehicle is larger than supported | Owner may reject according to policy |

---

## 33. Legal and Privacy Notes

Architecture-related responsibilities:

- Collect only data required for the service.
- Obtain consent for KYC and location data.
- Protect personal and financial information.
- Limit staff access to sensitive documents.
- Create data-retention and deletion rules.
- Provide terms, privacy policy, cancellation and refund policies.
- Use payment providers instead of storing card details.
- Define liability for damage, theft and unavailable parking.
- Review applicable Indian data protection requirements.
- Consult a lawyer and chartered accountant before launch.

> **Note:** This is a technical planning document, not legal advice.

---

## 34. Testing Strategy

| Test Type | What to Test |
|-----------|--------------|
| Unit Testing | Pricing, availability, booking state changes |
| Integration Testing | Payments, notifications, maps and storage |
| Concurrency Testing | Multiple users booking the same capacity |
| Security Testing | Permissions, OTP abuse and data access |
| User Acceptance Testing | Real owner and attendant workflows |
| Load Testing | Search and booking under expected pilot traffic |
| Recovery Testing | Database backup and failed payment recovery |

---

## 35. MVP Build Order & Definition of Done

### MVP Build Order

```
Database and backend foundation
        ↓
Owner authentication
        ↓
Parking onboarding
        ↓
Admin approval connection
        ↓
Capacity and availability
        ↓
Bookings
        ↓
Walk-ins and timers
        ↓
Check-in and checkout
        ↓
Earnings and payouts
        ↓
Notifications
        ↓
Reports and audit logs
        ↓
Pilot testing
```

### Definition of Done

The PMS MVP is ready for a pilot when:

- An owner can register and submit parking.
- Admin can approve the parking.
- Approved parking becomes available to the driver system.
- Capacity cannot be oversold.
- Bookings update availability automatically.
- Walk-ins can be managed with timers.
- Check-in and checkout are traceable.
- Owner earnings match completed bookings.
- Critical actions are logged.
- Errors are understandable and recoverable.
- Backups and monitoring are enabled.
- A pilot can run with 5–10 parking partners.

---

## 36. Founder Decisions Still Required

| # | Open Question |
|---|---------------|
| 1 | Will all owners require admin approval? |
| 2 | Which KYC and ownership documents are mandatory? |
| 3 | Will owners approve every booking or support instant booking? |
| 4 | How long should capacity remain locked during payment? |
| 5 | What is the cancellation policy? |
| 6 | What happens when a driver overstays? |
| 7 | Should timer expiry auto-release capacity? |
| 8 | When are owner payouts released? |
| 9 | How will damage disputes be handled? |
| 10 | Will PARKAR provide insurance or only platform support? |
| 11 | What commission applies to each plan? |
| 12 | Which city and location type will be used for the first pilot? |

---

## 37. Glossary

| Term | Meaning |
|------|---------|
| API | A controlled way for frontend and backend to communicate |
| Backend | Server-side code containing business rules |
| Database | Structured storage for owners, parking, bookings and payments |
| Webhook | Automatic message sent by an external service |
| RBAC | Role-based access control |
| Concurrency | Multiple actions happening at the same time |
| Transaction | Database actions that succeed or fail together |
| Cache | Temporary fast storage |
| Queue | System for reliable background tasks |
| Audit Log | Permanent record of important actions |
| ANPR | Automatic number plate recognition |
| Modular Monolith | One backend application organised into clear modules |
