# PARKAR — Product Requirements Documentation

**PMS Portal / Parking Owner Mode Flow Document**

A detailed functional document for the Parking Management System section of PARKAR, covering onboarding, amenities, plans, booking acceptance, OTP parking sessions, payments, settlements, verification tools, and technology integrations.

| Meta | Value |
|------|--------|
| **Version** | 1.0 |
| **Module** | PMS / Parking Owner Portal |
| **Audience** | Founders, Designers, Developers, QA |
| **Brand Promise** | Never search for parking again |

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [User Roles](#2-user-roles-in-pms-module)
3. [Complete PMS Master Flow](#3-complete-pms-master-flow)
4. [Phase 1: Registration & Location Setup](#phase-1-registration--location-setup)
5. [Phase 2: Amenities & Parking Quality](#phase-2-amenities--parking-quality)
6. [Phase 3: Plan Selection](#phase-3-plan-selection)
7. [Phase 4: Profile Completion & Listing Live](#phase-4-profile-completion--listing-live)
8. [Phase 5: Booking Acceptance Flow](#phase-5-booking-acceptance-flow)
9. [OTP Session Flow](#9-otp-parking-session-flow)
10. [Payment & Settlement Flow](#10-payment--settlement-flow)
11. [Verification Tools & APIs](#11-verification-tools--technology-stack)
12. [Suggested Database Structure](#12-suggested-database-structure)
13. [Notifications](#13-notifications)
14. [Edge Cases](#14-edge-cases--business-rules)
15. [Admin Review Requirements](#15-admin-review-requirements)
16. [Final Recommended MVP Flow](#16-final-recommended-mvp-flow)

---

## 1. Executive Overview

The **PMS Portal**, also called **Parking Owner Mode**, is the section of PARKAR where a parking space owner lists, manages, accepts, and earns from their parking space. The system is designed to convert empty or underused parking spaces into bookable parking inventory for drivers.

**Core idea:** Parking owners register their space, add location and amenities, select a plan, go live, accept bookings, verify driver OTP at entry and exit, and receive settlement based on their plan.

### Primary Goals

- Make parking owner onboarding simple and structured.
- Capture exact parking location using Google Maps and draggable pin selection.
- Collect space details, dimensions, photos, amenities, and verification documents.
- Offer three trust-based plans: **Park Basic**, **Park Plus**, and **Park Elite**.
- Enable owner to accept or reject incoming booking requests.
- Use OTP to start and end the parking session.
- Settle owner earnings through Razorpay and RazorpayX based on plan rules.

---

## 2. User Roles in PMS Module

| Role | Description | Main Actions |
|------|-------------|--------------|
| **Parking Owner / PMS User** | Person or business listing parking space on PARKAR. | Register, add parking, select amenities, choose plan, accept bookings, manage payout. |
| **Driver** | Customer who books parking through PARKAR driver app. | Book slot, arrive with OTP, park vehicle, checkout with OTP, rate parking. |
| **Admin** | PARKAR internal operations team. | Review documents, approve/reject owners, resolve disputes, monitor settlements. |

---

## 3. Complete PMS Master Flow

1. **Install / Open PMS Mode** — Parking owner opens app or PMS portal and starts registration.
2. **Enter Basic Space Details** — Number, address, geolocation, space dimensions, images, location type.
3. **Verify Mobile OTP** — OTP goes to the owner’s number. After verification, user moves to phase two.
4. **Select Amenities** — CCTV, EV charging, valet, car wash, tyre pressure, services, parking condition, level.
5. **Plan Suggestion** — System suggests Park Basic, Park Plus, or Park Elite based on details and amenities.
6. **Plan Selection / Skip Plan** — Owner may select a plan or continue without selecting. Skipping means limited trust and no verified benefits.
7. **Complete Profile** — Owner edits details, uploads up to 10 parking images, and submits listing.
8. **Go Live** — After required checks, parking listing becomes live and can receive bookings.
9. **Accept / Reject Booking** — Booking request appears with driver and vehicle information.
10. **OTP Entry** — Driver arrives. Owner enters start OTP. Session starts.
11. **Parking Session Completion** — At checkout, owner enters exit OTP. Session ends.
12. **Settlement** — Payment is settled to owner based on selected plan and settlement cycle.

---

## Phase 1: Registration & Location Setup

This is the first step after the parking owner installs the app or opens PMS mode. The system captures basic identity and parking space information.

### Inputs Required

| Field | Purpose | Input Type | Required? |
|-------|---------|------------|-----------|
| Mobile Number | Owner login and OTP verification | Phone input | Yes |
| Address | Readable parking address | Manual address + Google Maps search | Yes |
| Geolocation | Exact latitude and longitude | Google Maps pin selection | Yes |
| Space Dimensions | Size of parking space | Length, width, height if applicable | Yes |
| Space Images | Proof and user trust | Image upload | Yes |
| Location Type | Category of parking place | Dropdown / chips | Yes |

### Location Types

- Home
- Mall
- Commercial
- Apartment
- Local Parking
- Office
- Society
- Open Ground

### Google Maps Address Flow

1. **Owner enters address manually** — User can type full address, landmark, pincode, city and state.
2. **Google Places suggestion appears** — User selects the nearest suggested address.
3. **Map opens with pin** — System places pin on selected address.
4. **Owner adjusts exact pin** — Owner drags the pin to the exact parking gate or entrance.
5. **Owner confirms location** — System stores latitude, longitude, address, landmark and entry note.

> **Important:** The exact parking pin should be placed at the parking entrance, not at the center of the building.

### OTP Verification

After entering details, an OTP is sent to the owner’s mobile number. Once the OTP is successfully verified, the user is redirected to **Phase 2: Amenities & Parking Quality**.

---

## Phase 2: Amenities & Parking Quality

In this phase, the parking owner selects the amenities and service quality available at the parking location.

### Amenities List

| Amenity | Description | Can be Paid Add-on? |
|---------|-------------|---------------------|
| CCTV | Security camera coverage at parking space. | No / Trust feature |
| EV Charging | Charging facility for electric vehicles. | Yes |
| Valet | Owner/staff can park vehicle for driver. | Yes |
| Car Wash | Vehicle wash service during parking session. | Yes |
| Tyre Pressure Check | Basic vehicle support service. | Yes |
| Other Services | Custom services like cleaning, security guard, covered parking. | Yes |

### Parking Condition / Level

| Level | Description | Driver Expectation |
|-------|-------------|-------------------|
| Basic | Simple parking space with minimum facilities. | Affordable, functional parking. |
| Local | Standard local parking, may include guard or basic monitoring. | Good for daily usage. |
| Premium | Better location, clean space, security, CCTV, covered parking or premium services. | Higher trust and better experience. |

### Plan Suggestion Logic

Based on amenities, parking condition, owner verification, images, and location quality, PARKAR can suggest a suitable plan.

```
IF owner has low amenities + unverified documents
  Suggest Park Basic

IF owner completes Aadhaar/PAN + has good images + standard amenities
  Suggest Park Plus

IF owner is verified + has CCTV/EV/Valet/Premium location + high quality images
  Suggest Park Elite
```

---

## Phase 3: Plan Selection

The third onboarding phase is plan selection. The owner can select one of three plans or move ahead without selecting a plan. If the owner skips plan selection, the listing will receive fewer benefits and no verified-customer or verified-vehicle preference.

### Plan Names

| Plan | Description |
|------|-------------|
| **Park Basic** | Entry-level plan for new or unverified parking owners. |
| **Park Plus** | Trust-based plan with owner verification and better ranking. |
| **Park Elite** | Premium plan for highly trusted, high-quality parking operators. |

### Plan Comparison Table

| Feature | Park Basic | Park Plus | Park Elite |
|---------|------------|-----------|------------|
| Owner Verification | No mandatory verified badge | Aadhaar + PAN verification | Aadhaar + PAN verification |
| Verified Owner Badge | No | Yes | Yes |
| Driver Type | Any driver can book | Verified drivers supported | Verified drivers supported with higher trust |
| Vehicle Type | No verified vehicle preference | Verified vehicles supported | Verified vehicles supported |
| Listing Visibility | Standard listing | Better ranking | High ranking; first 10 results in up to 5 nearest places |
| Analytics | Basic analytics | Better dashboard and driver ratings | Advanced dashboard and priority insights |
| Support | Email support | Priority customer support | Fast customer support |
| Driver Ratings | Basic | Driver can rate parking | Driver can rate parking; rating helps ranking |
| Commission | 20% | 15% | 8% |
| Settlement | Monthly | Monthly + Weekly | Monthly + Weekly + Daily |
| Booking Priority | Normal | Better | Higher booking priority |

> **Recommended business logic:** Higher plans should have lower commission and faster settlement. This motivates owners to become verified and improve parking quality.

### Skip Plan Behavior

| Condition | System Behavior |
|-----------|-----------------|
| Owner skips plan | Listing may continue with limited benefits. |
| No verification completed | No verified badge is shown. |
| Security responsibility | PARKAR does not provide additional security assurance for skipped/unverified listing. |
| Search ranking | Low or normal ranking only. |
| Customer type | No verified driver/vehicle preference. |

---

## Phase 4: Profile Completion & Listing Live

After choosing or skipping a plan, the owner completes their profile and listing information.

### Profile Completion Features

- Edit all details entered during onboarding.
- Upload up to 10 images of parking space.
- Update amenities and parking condition.
- Update location pin if required.
- Add landmark and entry instructions.
- Add availability timings.
- Add pricing per hour, daily slot, or fixed session.

### Image Upload Requirements

| Image Type | Purpose | Required? |
|------------|---------|-----------|
| Entrance / Gate | Helps driver identify exact entry point. | Yes |
| Parking Slot | Shows actual parking area. | Yes |
| Wide Area Photo | Shows space quality and vehicle fit. | Recommended |
| Nearby Landmark | Helps navigation. | Recommended |
| Security / CCTV photo | Trust proof. | Optional |

### Go Live Rules

Minimum requirements to go live:

- Mobile OTP verified
- Address and map pin selected
- Space dimensions added
- At least 3 parking images uploaded
- Availability timing added
- Pricing added
- Owner accepts platform terms

---

## Phase 5: Booking Acceptance Flow

Once the listing is live, the parking owner can receive booking requests from drivers.

### Incoming Booking Popup

When a booking request arrives, the owner receives a notification and popup with Accept/Reject actions.

| Information Shown | Description |
|-------------------|-------------|
| Driver Name | Name of driver booking the parking. |
| Driver Photo | Profile photo if available. |
| Driver Verification Status | Verified / Unverified driver. |
| Vehicle Verification Status | Verified / Unverified vehicle. |
| Vehicle Details | Vehicle number, type, model if available. |
| Time Slot | Start time and end time selected by driver. |
| Total Hours | Duration of parking session. |
| Estimated Amount | Amount to be paid for parking and add-ons. |
| Accept Button | Owner accepts booking. |
| Reject Button | Owner rejects booking. |

### Accept / Reject Logic

1. **Booking request appears** — Owner receives app notification and in-app popup.
2. **Owner reviews details** — Checks driver, vehicle, verification status, time slot and amount.
3. **If accepted** — Driver receives confirmation and OTP is generated for check-in.
4. **If rejected** — Booking request is redirected to another nearby parking owner.

### Booking Redirect Rule

If the first owner rejects or does not respond within the allowed time, the system should redirect the booking to another suitable parking listing near the driver’s selected location.

```
IF owner rejects booking
  Find next available parking nearby
  Notify next parking owner
  Keep driver informed

IF owner does not respond within X seconds/minutes
  Auto-expire request
  Redirect to next owner
```

---

## 9. OTP Parking Session Flow

OTP is used to securely start and end the parking session. This protects the driver, owner, and PARKAR from false claims.

### Check-in OTP Flow

1. **Driver reaches parking location** — Driver opens booking and shows OTP.
2. **Owner asks for OTP** — Owner enters OTP in PMS portal.
3. **OTP verified** — System validates booking, driver, time slot and location.
4. **Session starts** — Parking timer starts and booking status changes to Active.

### Checkout OTP Flow

1. **Driver returns** — Driver requests checkout.
2. **Owner enters checkout OTP** — Second OTP confirms vehicle exit.
3. **Session ends** — Final duration and charges are calculated.
4. **Payment finalized** — Base parking fee and selected amenities are finalized.

### Amenity Payment Logic

If the driver selects extra amenities such as EV charging, valet, car wash, tyre pressure check, or other services, the owner provides those amenities during the session and receives payment according to the final invoice.

---

## 10. Payment & Settlement Flow

PARKAR collects payment from the driver and settles the owner’s earnings based on the selected plan, commission, refund/dispute hold, and settlement cycle.

### Payment Collection

- Driver pays through Razorpay.
- Payment success is confirmed through Razorpay webhook.
- Booking becomes confirmed after successful payment.
- PARKAR stores the transaction ID, booking ID, payment amount, and payment status.

### Settlement Calculation

| Plan | Commission | Settlement Cycle |
|------|------------|------------------|
| Park Basic | 20% | Monthly |
| Park Plus | 15% | Monthly + Weekly |
| Park Elite | 8% | Monthly + Weekly + Daily |

### Example Calculation

```
Driver pays: ₹500
Plan: Park Plus
Commission: 15%

PARKAR commission = ₹75
Owner earning = ₹425

Owner wallet:
Pending: ₹425
Available after hold: ₹425
Settlement: Weekly / Monthly based on selected cycle
```

### Settlement Flow

1. **Driver pays via Razorpay** — Payment is collected by PARKAR.
2. **Booking completed** — Checkout OTP confirms session end.
3. **Amount moves to pending wallet** — Owner earnings are calculated after commission deduction.
4. **Dispute/refund hold** — Recommended hold period: 24 hours.
5. **Available wallet** — If no issue occurs, pending amount becomes available.
6. **Settlement cycle runs** — Monthly, weekly or daily based on plan.
7. **RazorpayX payout** — Payout is created to owner’s verified bank account.

### Owner Wallet States

| State | Meaning |
|-------|---------|
| Pending | Booking completed but hold period/dispute window is still active. |
| Available | Amount cleared for payout. |
| Processing | Payout request has been sent to RazorpayX. |
| Settled | Money has been transferred to owner bank account. |
| On Hold | Payment is blocked due to dispute, refund, or admin review. |

---

## 11. Verification Tools & Technology Stack

The PMS module uses third-party services for identity verification, address/map handling, bank verification, and payment processing.

### Verification Tools

| Purpose | Suggested Tools | Use Case |
|---------|-----------------|----------|
| Aadhaar Verification | DigiO, Surepass, IDcentro | Verify owner identity. |
| PAN Verification | DigiO, Surepass, IDcentro | Verify tax/legal identity. |
| Facial Verification | HyperVerge, Surepass | Selfie, face match, liveness detection. |
| Bank Verification | RazorpayX, Cashfree | Verify account holder and payout account. |
| Payments | Razorpay | Collect driver payment and process refunds. |
| Payouts | RazorpayX | Settle owner earnings to bank account. |
| Maps & Address | Google Maps Platform | Address search, draggable pin, geocoding, navigation. |

### Recommended Technical Stack

| Layer | Recommended Technology |
|-------|------------------------|
| Mobile App | React Native or Flutter |
| PMS Web Portal | React / Next.js |
| Backend | Node.js with NestJS or Express |
| Database | PostgreSQL + PostGIS |
| File Storage | AWS S3 or Google Cloud Storage |
| Authentication | OTP with Firebase Auth, MSG91, Twilio, or custom OTP |
| Payments | Razorpay |
| Payouts | RazorpayX |
| KYC | DigiO / Surepass / IDcentro / HyperVerge |

> **Privacy note:** Aadhaar, PAN, face data, and bank information are sensitive. Store only what is necessary, encrypt sensitive data, and restrict access to authorized admins.

---

## 12. Suggested Database Structure

This is a simplified database model for the PMS module. Developers can expand it during technical architecture.

### Main Entities

#### ParkingOwner

- `id`
- `name`
- `mobile`
- `email`
- `otpVerified`
- `kycStatus`
- `selectedPlan`
- `createdAt`

#### ParkingSpace

- `id`
- `ownerId`
- `address`
- `latitude`
- `longitude`
- `landmark`
- `entryNote`
- `dimensions`
- `locationType`
- `parkingCondition`
- `status`

#### ParkingImage

- `id`
- `parkingSpaceId`
- `imageUrl`
- `imageType`

#### Amenity

- `id`
- `name`
- `price`
- `isPaid`

#### ParkingSpaceAmenity

- `parkingSpaceId`
- `amenityId`
- `available`
- `priceOverride`

#### Plan

- `id`
- `name`
- `commissionRate`
- `settlementCycle`
- `benefits`

#### Booking

- `id`
- `driverId`
- `parkingSpaceId`
- `ownerId`
- `startTime`
- `endTime`
- `status`
- `amount`
- `paymentStatus`
- `checkinOtp`
- `checkoutOtp`

#### WalletLedger

- `id`
- `ownerId`
- `bookingId`
- `grossAmount`
- `commissionAmount`
- `ownerAmount`
- `status`
- `payoutId`

#### Payout

- `id`
- `ownerId`
- `amount`
- `status`
- `razorpayPayoutId`
- `createdAt`

#### Verification

- `id`
- `ownerId`
- `aadhaarStatus`
- `panStatus`
- `faceStatus`
- `bankStatus`
- `providerResponse`

---

## 13. Notifications

| Event | Owner Notification | Driver Notification |
|-------|--------------------|---------------------|
| OTP verified | Registration successful | N/A |
| Listing live | Your parking is now live | N/A |
| Booking request | New booking request with accept/reject | Waiting for owner confirmation |
| Booking accepted | Booking confirmed | Parking confirmed with OTP |
| Booking rejected | Request rejected | Finding another parking |
| Session started | Parking session started | Your parking session has started |
| Session completed | Parking session completed | Checkout successful |
| Amount available | Earnings available for payout | N/A |
| Payout processed | Settlement transferred | N/A |

---

## 14. Edge Cases & Business Rules

| Case | Expected System Behavior |
|------|--------------------------|
| Owner enters wrong OTP | Show error and allow limited retries. |
| Owner rejects booking | Redirect driver to another available parking. |
| Owner does not respond | Auto-expire request and redirect driver. |
| Driver arrives late | Apply grace period or late policy. |
| Driver overstays | Charge extra based on pricing rules. |
| Checkout OTP not entered | Allow admin/manual close with proof. |
| Payment failed | Booking should not be confirmed. |
| Refund requested | Hold owner payout until dispute is resolved. |
| Owner bank verification failed | Block payout until correct bank details are added. |
| Fake or unclear parking images | Send listing to admin review. |
| Location pin mismatch | Ask owner to correct map pin or submit proof. |

---

## 15. Admin Review Requirements

The admin dashboard is required to monitor owner onboarding, verification, listings, bookings, disputes, and settlement.

### Admin Should Be Able To

- View all parking owner applications.
- Approve, reject, or request more documents.
- Review Aadhaar, PAN, face verification and bank status.
- View parking photos, videos, address, and map pin.
- Manually disable suspicious listings.
- Monitor booking acceptance/rejection rate.
- Resolve driver-owner disputes.
- Hold or release settlement.
- Export settlement reports.

### Admin Decision States

| State |
|-------|
| Approved |
| Pending |
| Review |
| Need More Documents |
| Rejected |
| Suspended |

---

## 16. Final Recommended MVP Flow

**MVP Recommendation:** Start with simple onboarding, Google Maps pin confirmation, amenities selection, plan selection, accept/reject booking, OTP check-in/out, Razorpay payment collection, internal owner wallet, and weekly settlement through RazorpayX.

```
Owner registers
↓
Mobile OTP verification
↓
Adds address + exact Google Maps pin
↓
Adds space dimensions + images + location type
↓
Selects amenities + parking level
↓
Chooses Park Basic / Park Plus / Park Elite / Skip
↓
Completes profile
↓
Listing goes live
↓
Receives booking request
↓
Accepts or rejects
↓
Driver arrives with OTP
↓
Owner enters OTP and starts session
↓
Driver checkout OTP ends session
↓
Payment moves to pending wallet
↓
Hold period passes
↓
Amount becomes available
↓
RazorpayX settles amount based on plan
```
