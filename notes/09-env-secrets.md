# 09 — `.env` and secrets

**Files:**

- `server/.env` (your machine only — gitignored)
- `server/.env.example` (safe template — committed)
- `client/.env` / `client/.env.example`

---

## 1. What is this?

`.env` is a local settings file.  
It stores values that change between computers and must stay private.

Examples:

- database password  
- port number  
- API base URL for the frontend  

---

## 2. Why not hardcode in source code?

If you write the DB password inside `database/index.js` and push to GitHub, the secret is leaked forever in history.

So:

- code reads `process.env.DATABASE_URL`  
- real value lives in `.env` locally  

---

## 3. How this project uses it

### Server (`dotenv`)

`server.js` starts with:

```js
require('dotenv').config();
```

Then code can read:

- `process.env.PORT`  
- `process.env.DATABASE_URL`  
- `process.env.LOG_LEVEL`  
- `process.env.NODE_ENV`  

### Client (Vite)

Only variables starting with `VITE_` are available to frontend code.

Example:

```text
VITE_API_BASE_URL=http://localhost:3000
```

(Used when we build the client API layer.)

---

## 4. Rules you must remember

1. Never commit real `.env`  
2. Never put real secrets in `notes/` or `memory.md`  
3. Never log passwords/OTP/tokens  
4. Frontend must not connect to Postgres directly  

---

## 5. Mistake you already saw

Wrong value shape:

```text
DATABASE_URL="DATABASE_URL=postgresql://..."
```

Correct:

```text
DATABASE_URL=postgresql://...
```

---

## 6. Mental picture

> `.env` = locked drawer in your house.  
> `.env.example` = empty drawer diagram you can share with the team.

---

## 7. What to read next

[10-client-fonts-tokens.md](10-client-fonts-tokens.md)
