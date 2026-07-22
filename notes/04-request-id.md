# 04 — Request ID — ticket number for one API call

**Code file:** `server/src/common/requestId.js`  
**Wired in:** `server/src/app.js` (near the top of the pipeline)

---

## 1. What is this?

A **request ID** is a unique string for **one** HTTP call.

Example:

```text
req_67f91cda-755e-45dd-b138-072ec64534bd
```

It is like a **courier tracking number** for that single request.

---

## 2. Why do we need it?

Imagine:

- User says: “Login failed”
- Server logs show many requests

If every response and every log line includes the same `requestId`, you can match:

- what the browser received  
- what the server logged  

Support becomes possible: “Send us the request id from the error.”

---

## 3. What it is NOT

| People sometimes think… | Reality in this project |
|-------------------------|-------------------------|
| We save every request into DB | **No** |
| Request ID is a user account id | **No** |
| Request ID lasts forever | **No** — it is for that call (and appears in logs while logs exist) |

Request ID is a **label**, not a database record.

---

## 4. How it is implemented here

Middleware runs on every request:

1. Look for incoming header `X-Request-Id`
2. If present and valid → reuse it (trimmed, max 128 chars)
3. If missing → create `req_` + a UUID
4. Save on `req.requestId`
5. Also set response header `X-Request-Id`
6. Call `next()` to continue the pipeline

Later:

- `sendSuccess` puts it in JSON as `requestId`
- `errorHandler` puts it in error JSON
- request logger puts it in terminal logs

---

## 5. What you see in practice

Call `/health`. Response includes something like:

```json
{
  "success": true,
  "data": { ... },
  "message": "Service healthy",
  "requestId": "req_...."
}
```

Response headers also include:

```text
X-Request-Id: req_....
```

Terminal log for that call includes the same id.

---

## 6. Mental picture

> Request ID = tracking sticker stuck on the package (request), the receipt (JSON), and the warehouse note (log line).  
> We do **not** put every package into a museum (database) just because it has a sticker.

---

## 7. What to read next

[05-errors.md](05-errors.md)
