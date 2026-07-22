# 05 — Errors — how failures are returned

**Code file:** `server/src/common/errors.js`  
**Wired in:** end of `server/src/app.js`

---

## 1. What is this?

This is our **custom error system** for the API.

It has three parts:

| Part | Job |
|------|-----|
| `AppError` | A special error we create on purpose |
| `notFoundHandler` | When the URL does not exist |
| `errorHandler` | Last step: turn any error into standard JSON |

---

## 2. Why do we need it?

Without a standard:

- one route might return `{ error: "oops" }`
- another might return plain text
- another might leak a scary stack trace to the browser

That is bad for the UI and unsafe.

With a standard, the frontend always knows where to read:

- `error.code`  
- `error.message`  
- `error.requestId`  

---

## 3. The standard error JSON (remember this)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Route GET /missing-route was not found.",
    "requestId": "req_..."
  }
}
```

| Field | Meaning for humans |
|-------|--------------------|
| `success: false` | This call failed |
| `code` | Machine-friendly name (UI or code can switch on it) |
| `message` | Safe sentence for people |
| `requestId` | Ticket number to find logs |

---

## 4. What is `AppError`?

A normal JavaScript `Error` plus extra fields we care about:

```js
new AppError('NOT_FOUND', 'Booking was not found.', 404)
```

| Piece | Meaning |
|-------|---------|
| `'NOT_FOUND'` | code |
| `'Booking was not found.'` | message shown to client |
| `404` | HTTP status |
| `isOperational = true` | “this failure was expected / controlled” |

Later feature code will do:

```js
throw new AppError('OTP_EXPIRED', 'The verification code has expired.', 400)
```

---

## 5. Operational vs unexpected (simple)

| Type | Example | What client should see |
|------|---------|-------------------------|
| Operational | Wrong URL, validation fail | Clear code + message |
| Unexpected | Bug / crash / null pointer | Generic `INTERNAL_ERROR` message |

We **do not** show raw stack traces to users in production.  
We may log stacks on the server for developers.

---

## 6. How it runs in this project

### Unknown URL

1. No route matched  
2. `notFoundHandler` creates `AppError` with code `NOT_FOUND`  
3. Calls `next(err)`  
4. `errorHandler` sends the JSON above  

### Real route throws / rejects

1. `asyncHandler` catches it  
2. Forwards to `errorHandler`  
3. Same JSON style  

### Logging

- Client mistakes (like 404) → `logger.warn`  
- Serious failures → `logger.error`  

Again: logs go to **terminal**, not DB.

---

## 7. Try it

Visit:

```text
http://localhost:3000/this-does-not-exist
```

You should get `success: false` and `code: "NOT_FOUND"`.

---

## 8. Mental picture

> `AppError` = a polite, labeled “no”.  
> `errorHandler` = the translator that always answers in the same JSON language.  
> It is **not** a history table of errors in Postgres.

---

## 9. What to read next

[06-response.md](06-response.md)
