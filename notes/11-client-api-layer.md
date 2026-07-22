# 11 — Client API layer

**Status:** Built (Phase 1 foundation)  
**Code:** `client/src/api/`

---

## 1. What is this?

A small helper so React screens call the Express API in **one consistent way**.

```text
React screen
  → getHealth() / apiGet('/health')
  → http://localhost:3000/health
  → reads { success, data, message, requestId }
  → or throws ApiError from { success: false, error: {...} }
```

---

## 2. Why?

Without this, every page would invent its own `fetch`, URL, and error handling.

With it:

- one base URL from `VITE_API_BASE_URL`
- sends `X-Request-Id`
- understands success/error envelopes from the server

---

## 3. Files in this project

| File | Job |
|------|-----|
| `api/client.js` | `apiRequest`, `apiGet`, `apiPost`, … |
| `api/errors.js` | `ApiError` |
| `api/health.js` | `getHealth()` for `GET /health` |
| `api/index.js` | re-exports |

`App.jsx` uses `getHealth()` on load to show API status (smoke test).

---

## 4. Config

`client/.env`:

```text
VITE_API_BASE_URL=http://localhost:3000
```

Restart Vite after changing `.env`.

---

## 5. How to call later features

```js
import { apiPost, ApiError } from '@/api';

try {
  const { data } = await apiPost('/v1/pms/something', { foo: 1 });
} catch (err) {
  if (err instanceof ApiError) {
    // err.message, err.code, err.requestId
  }
}
```

---

## 6. What it is not

- Not database access from the browser  
- Not login/OTP yet  
- Not saving responses in DB  

---

## 7. Mental picture

> API layer = waiter between dining room (React) and kitchen (Express).
