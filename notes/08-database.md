# 08 — Database — PostgreSQL connection

**Code files:**

- `server/src/database/index.js`  
- `server/scripts/ensure-db.js`  
- npm package: `pg`

---

## 1. What is this?

The database is **PostgreSQL** — a place to store **lasting product data**.

Examples of data we will store **later**:

- owners and staff  
- parking locations  
- bookings  
- payments metadata  
- audit events for important actions  

Right now we only built the **connection**.  
We have **not** created business tables yet.

---

## 2. Why connect now, before features?

Phase 1 foundation says:

- make sure DB connection works  
- fail clearly if misconfigured  
- expose status on `/health`  

So when Authentication starts, we are not inventing DB setup at the same time.

---

## 3. How it is implemented in this project

### Config

`.env` contains:

```text
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/parkar
```

### On startup (`initDatabase`)

1. If `DATABASE_URL` empty → skip DB, log “skipped”  
2. If set → create a `pg` **Pool** (small set of reusable connections)  
3. Try one test connection  
4. Log success or failure  
5. Server still starts even if DB failed (Phase 1 choice)

### Status helper

`getDatabaseStatus()` returns safe info (no password), used by `/health`:

```json
"database": {
  "configured": true,
  "connected": true,
  "message": "Database pool ready"
}
```

### Helper script

```bash
npm run db:ensure
```

Creates the database name from the URL if it does not exist  
(example problem you hit: database `"parkar"` did not exist).

---

## 4. Pool in plain language

Opening a brand-new DB connection for every tiny query is slow.

A **pool** keeps a few connections ready (we set `max: 5` for now).  
Feature code later will borrow a connection, run SQL, give it back.

---

## 5. What is NOT stored in DB today

| Thing | Stored in DB now? |
|-------|-------------------|
| Every HTTP request | **No** |
| Every log line | **No** |
| Request IDs history | **No** |
| Owners / bookings tables | **No** (not created yet) |

DB is connected and waiting. Product tables come with feature work + migrations.

---

## 6. Mental picture

> Database = fridge for lasting ingredients (business data).  
> Logger = sticky notes on the counter (temporary visibility).  
> Request ID = order number written on the sticky note.  

We do not put every sticky note into the fridge.

---

## 7. What to read next

[09-env-secrets.md](09-env-secrets.md)
