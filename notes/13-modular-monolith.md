# 13 — Modular monolith (simple architecture)

---

## 1. What is this?

PARKAR MVP uses a **modular monolith**:

- **one** backend app (`server/`)  
- **one** database  
- **many folders/modules** inside the same server (`auth`, `bookings`, …)  

Not many tiny separate backend services yet.

---

## 2. Why this choice?

For an early product, one backend is:

- easier to run locally  
- easier to keep booking + capacity updates consistent  
- easier to share logger/error format (`common/`)  

Microservices can wait until there is a strong reason (and an approved architecture decision).

---

## 3. How it shows up in this repo

```text
server/src/
  common/       ← shared tools (already built)
  database/     ← DB connection (already built)
  auth/         ← future
  bookings/     ← future
  payments/     ← future
  ...
```

Frontends (PMS client, later Driver/Admin) can all call the same API.

---

## 4. The layering rule (keep this)

```text
Request
  → Route/Controller (thin)
  → Validation
  → Authorization
  → Service (business rules)
  → Repository (database)
  → Response
```

Business rules should not live only in React.  
Server must enforce them.

---

## 5. Mental picture

> One kitchen building with many stations (modules), one fridge (database).  
> Not a separate restaurant for every dish (yet).
