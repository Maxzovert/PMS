# 06 — Response helpers — success JSON + async safety

**Code file:** `server/src/common/response.js`

---

## 1. What is this?

Two small helpers:

| Helper | Purpose |
|--------|---------|
| `sendSuccess(...)` | Send a **standard success** JSON response |
| `asyncHandler(fn)` | Wrap async route functions so failures reach the error handler |

This is **not** “response recording” into a database.  
It only formats the HTTP reply for this one call.

---

## 2. Why `sendSuccess`?

Architecture wants every happy response to look similar:

```json
{
  "success": true,
  "data": { },
  "message": "Service healthy",
  "requestId": "req_..."
}
```

| Field | Meaning |
|-------|---------|
| `success: true` | Call worked |
| `data` | The actual payload (health info, booking, …) |
| `message` | Short human message |
| `requestId` | Same ticket as logs/header |

If every developer invents a different shape, the React app becomes painful.

---

## 3. How `sendSuccess` is used here

In `/health`:

```js
sendSuccess(
  res,
  {
    status: 'ok',
    service: 'parkar-pms-backend',
    timestamp: ...,
    database: getDatabaseStatus(),
  },
  'Service healthy',
);
```

Browser receives one consistent success envelope.

---

## 4. Why `asyncHandler`?

Express does not always catch errors inside `async` functions automatically.

Without a wrapper, a failed `await` might become an **unhandled rejection** instead of a nice JSON error.

So we write:

```js
app.get('/health', asyncHandler(async (req, res) => {
  // if this throws, errorHandler still runs
}));
```

`asyncHandler` does the idea of:

```text
run the async function
if it fails → next(err) → errorHandler
```

---

## 5. Success vs error (side by side)

**Success**

```json
{ "success": true, "data": {}, "message": "...", "requestId": "..." }
```

**Error**

```json
{ "success": false, "error": { "code": "...", "message": "...", "requestId": "..." } }
```

Frontend rule later:

- if `success` → use `data`  
- else → show `error.message`, maybe special-case `error.code`

---

## 6. Mental picture

> `sendSuccess` = packing a gift in the company gift-wrap (standard box).  
> `asyncHandler` = safety net under the packing table.  
> Neither one is a warehouse inventory system (DB).

---

## 7. What to read next

[07-common-folder.md](07-common-folder.md)
