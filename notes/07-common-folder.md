# 07 — The `common/` folder — our custom shared toolkit

**Folder:** `server/src/common/`

---

## 1. What is this?

`common/` means: **shared custom code** used by many parts of the server.

These are **not** Express built-in features.  
**We wrote them** for PARKAR so every feature behaves the same.

Today the folder contains:

| File | Custom system | One-line job |
|------|---------------|--------------|
| `logger.js` | Logging system | Print structured events to the terminal |
| `requestId.js` | Request ID system | Give each call a ticket number |
| `errors.js` | Error system | Standard failure JSON + AppError |
| `response.js` | Success response helpers | Standard success JSON + asyncHandler |
| `index.js` | Barrel / export desk | Re-export everything for easy imports |

---

## 2. Why put them in `common/`?

Because later we will have modules like:

- `auth/`  
- `bookings/`  
- `payments/`  

Those modules should **reuse** the same logger, same error shape, same success shape.

If each module invents its own style, the project becomes chaos.

---

## 3. Is `common` “middleware”?

Partly.

Some exports **are** middleware (functions Express runs per request):

- `requestIdMiddleware`  
- `notFoundHandler`  
- `errorHandler`  

Some are just helpers classes/functions:

- `logger`  
- `AppError`  
- `sendSuccess`  
- `asyncHandler`  

So: **common = shared toolkit**. Some tools are middleware; some are not.

---

## 4. What `index.js` does

`index.js` is a convenience file:

```js
const { logger, sendSuccess, AppError } = require('./common');
```

Instead of requiring each file separately.

Think of it as the **front desk** of the toolkit room.

---

## 5. How `app.js` uses common (the connection)

```text
app.js
  uses requestIdMiddleware     → from common
  uses logger                  → from common
  uses sendSuccess/asyncHandler→ from common
  uses notFoundHandler         → from common
  uses errorHandler            → from common
```

So when you read `app.js`, you are seeing the toolkit **installed on the assembly line**.

---

## 6. Your summary checklist (yes/no)

| Statement | Answer |
|-----------|--------|
| Commons are custom for this project | **Yes** |
| Logger is our logging system | **Yes** |
| Error handler is our error system | **Yes** |
| Request ID labels each request | **Yes** |
| Response helpers standardize success JSON | **Yes** |
| “Response record” means saving every response in DB | **No** — we only format the HTTP response |
| Common stores request history in Postgres | **No** |

---

## 7. Mental picture

> `common/` = shared toolbox in the workshop.  
> `app.js` = the workbench that mounts those tools.  
> Feature folders later = products built using the same toolbox.

---

## 8. What to read next

[08-database.md](08-database.md)
