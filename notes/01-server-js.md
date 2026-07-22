# 01 — `server.js` — starting the API

**Code file:** `server/src/server.js`

---

## 1. What is this?

`server.js` is the **first file Node runs** when you start the backend.

It is the **startup script**.  
It does **not** decide “what should `/health` return?” in detail.  
It decides: “turn everything on.”

---

## 2. Why do we need it?

A backend is a program that must:

1. Read settings (port, database URL)
2. Connect to the database (if configured)
3. Build the web app (Express)
4. Start listening for internet/HTTP traffic

Without this file, nothing listens on port 3000.

---

## 3. What it does in this project (step by step)

When you run:

```bash
cd server
npm start
```

Node runs `src/server.js`. Roughly:

### Step A — Load `.env`

```js
require('dotenv').config();
```

This copies values from `server/.env` into `process.env`  
(examples: `PORT`, `DATABASE_URL`, `LOG_LEVEL`).

### Step B — Connect database

```js
await initDatabase();
```

This is in `database/index.js`.  
If `DATABASE_URL` is set, it tries to open a PostgreSQL pool.  
If DB fails, it **logs an error** but (in Phase 1) still continues so you can hit `/health`.

### Step C — Build the Express app

```js
const app = createApp();
```

`createApp()` lives in `app.js`.  
That is where routes and middleware are attached.

### Step D — Listen on a port

```js
app.listen(port, () => {
  logger.info('PARKAR PMS API listening', { port, env });
});
```

Default port is **3000**.

### Step E — If startup crashes

```js
main().catch((err) => {
  logger.error('Failed to start server', ...);
  process.exit(1);
});
```

The process stops with an error code.

---

## 4. What you should see in the terminal

Something like:

1. Database connected (or skipped / failed message)
2. `PARKAR PMS API listening` with port 3000

Those lines are printed by our **logger**, as JSON.

---

## 5. `server.js` vs `app.js` (very important)

| File | Job |
|------|-----|
| `server.js` | Start the process (boot + listen) |
| `app.js` | Define how each HTTP request is handled |

Analogy:

- `server.js` = opening the restaurant for the day  
- `app.js` = the kitchen workflow for each order  

---

## 6. Common beginner confusion

**Q:** Is `server.js` the logger / error handler?  
**A:** No. It *uses* the logger. The logger code is in `common/logger.js`.

**Q:** Does `server.js` store requests in the DB?  
**A:** No. It only initializes the DB connection.

---

## 7. What to read next

[02-app-js.md](02-app-js.md)
