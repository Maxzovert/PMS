# 00 — Big picture (start here)

## What is this project?

**PARKAR PMS** is a website for **parking owners / staff**.

With it (later), they will:

- register parking locations  
- set prices and capacity  
- manage bookings and walk-ins  
- check drivers in/out  
- see earnings  

Right now we are still in **Phase 1 — Foundation**.  
That means we build the **base** (logging, errors, DB connection, design) **before** real login/bookings.

---

## Two apps, not one

In the repo you have two folders:

| Folder | Nickname | Job | Local address |
|--------|----------|-----|---------------|
| `client/` | Frontend | What the user sees in the browser | http://localhost:5173 |
| `server/` | Backend / API | Receives requests, talks to DB, returns JSON | http://localhost:3000 |

### Simple analogy

- **Client** = restaurant dining room (menus, screens, buttons)  
- **Server** = kitchen (does the real work, uses the fridge/database)  
- **Database** = fridge / storage for lasting data  

Today the dining room and kitchen both exist, but the waiters (**API calls from client → server**) are **not fully hired yet**. That is the next step (client API layer).

---

## What we already built

### On the client

- Brand colors and fonts loaded (Satoshi, Plus Jakarta Sans)
- Logo and decorative images under `client/src/assets/`
- A simple starter page saying “PARKAR PMS”

### On the server

- Express API that can start and listen on port 3000
- A `/health` URL to check “is the API alive?”
- Custom shared tools in `server/src/common/`:
  - logger  
  - request ID  
  - error format  
  - success format  
- Optional connection to PostgreSQL database named `parkar`

---

## How a request will work later (and partly now)

```text
Browser
  → Client (React)
  → HTTP call to Server (Express)     ← not wired from UI yet
  → Server middleware (ID, log, …)
  → Route (example: /health)
  → JSON response back
```

You can already test the server alone in a browser or with curl:

```text
http://localhost:3000/health
```

---

## Words you will see again and again

| Word | Easy meaning |
|------|----------------|
| **API** | Server URLs that return data (usually JSON) |
| **JSON** | Text data format computers exchange, like `{ "success": true }` |
| **Middleware** | A step that runs for many requests (stamp ID, parse JSON, log, …) |
| **Route** | One URL + method, e.g. `GET /health` |
| **Envelope** | Standard wrapper around every success/error response |
| **`.env`** | Local config file (ports, DB password) — not for git |
| **Pool** | Reused database connections |

---

## What to read next

Go to [01-server-js.md](01-server-js.md).
