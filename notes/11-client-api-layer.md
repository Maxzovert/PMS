# 11 — Coming next: client API layer

**Status:** Not built yet.

---

## 1. What will this be?

A small helper in the **client** that calls the **server** using `fetch` (or similar).

Today:

- client runs on 5173  
- server runs on 3000  
- they do not talk from the UI yet  

Next:

- client helper uses `VITE_API_BASE_URL`  
- calls endpoints like `/health`  
- understands success/error JSON envelopes  

---

## 2. Why do we need it?

Without one shared helper, every screen would invent its own fetch code and error handling.

With one helper:

- same base URL  
- same headers (`X-Request-Id` later)  
- same way to read `success` / `error`  

---

## 3. How it will likely work (planned)

```text
React screen
  → api.get('/health')
  → http://localhost:3000/health
  → parse JSON
  → if success: return data
  → if failure: throw/show error.message
```

---

## 4. What it is not

- Not direct database access from the browser  
- Not authentication yet  
- Not storing responses in DB  

---

## 5. Mental picture

> API layer = waiter between dining room (React) and kitchen (Express).
