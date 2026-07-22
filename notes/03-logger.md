# 03 — Logger — our logging system

**Code file:** `server/src/common/logger.js`  
**Also used from:** `server.js`, `app.js`, `errors.js`, `database/index.js`

---

## 1. What is this?

The **logger** is a small custom helper that prints messages about what the server is doing.

Instead of:

```js
console.log('something happened')
```

we use:

```js
logger.info('PARKAR PMS API listening', { port: 3000 })
```

Each message becomes **one JSON line** in the terminal.

---

## 2. Why do we need it?

When something breaks, you need answers like:

- Did the database connect?  
- Did `/health` return 200?  
- Which request failed (`requestId`)?  

A consistent logger makes that easier than random print statements.

Also: later, hosting platforms can collect these JSON lines as logs.

---

## 3. Important: where do logs go?

| Place | Do we store logs there now? |
|-------|-----------------------------|
| Terminal / stdout | **Yes** (this is what you see) |
| PostgreSQL database | **No** |
| Log files on disk | **No** (not yet) |
| Cloud log service | **No** (not yet) |

So logs are **temporary to see while the server runs**, unless your terminal/host keeps history.

---

## 4. Log levels (how serious is the message?)

| Level | Meaning | Example |
|-------|---------|---------|
| `debug` | Extra detail for developers | noisy details |
| `info` | Normal healthy events | server started, request finished |
| `warn` | Expected problem | 404 not found |
| `error` | Real failure | DB connection failed, crash |

You can set minimum level in `.env`:

```text
LOG_LEVEL=debug
```

If level is `info`, `debug` messages are skipped.

---

## 5. How it is implemented in this project

Inside `logger.js`:

1. Decide minimum level from `LOG_LEVEL` / `NODE_ENV`
2. Build an object: `{ level, time, message, service, meta? }`
3. `JSON.stringify` it
4. Print with `console.log` / `console.warn` / `console.error`

Example output:

```json
{"level":"info","time":"...","message":"HTTP request","service":"parkar-pms-backend","meta":{"method":"GET","path":"/health","statusCode":200,"requestId":"req_..."}}
```

---

## 6. Safety rule

**Never log secrets**, for example:

- OTP codes  
- passwords  
- access tokens  
- full card numbers  
- raw database passwords  

Our project rules forbid that.

---

## 7. Mental picture

> Logger = CCTV monitor screen in the kitchen.  
> You can watch what happened.  
> It is **not** the fridge (database).

---

## 8. What to read next

[04-request-id.md](04-request-id.md)
