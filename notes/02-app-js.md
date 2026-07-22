# 02 — `app.js` — the request assembly line

**Code file:** `server/src/app.js`

---

## 1. What is this?

`app.js` creates the **Express application**.

Express is a Node library for handling HTTP:

- “When someone visits this URL…”
- “…run these steps…”
- “…send a response.”

`createApp()` builds that machine and returns it.  
`server.js` then turns it on with `listen`.

---

## 2. Why do we need it?

Without `app.js`, the server would start but would not know:

- how to read JSON bodies  
- how to add a request ID  
- what `/health` should return  
- how to format errors  

This file is the **center** of HTTP behavior today.

---

## 3. The pipeline (order matters)

Imagine a conveyor belt. Every request goes through stations:

```text
1) Request ID middleware     → stamp a ticket number
2) CORS                      → allow browser from another port to call us
3) express.json()            → turn JSON body into req.body
4) Request logger hook       → after response ends, write a log line
5) Routes (only /health now) → do the actual work
6) notFoundHandler           → if URL unknown → create 404 error
7) errorHandler              → turn errors into standard JSON
```

### Why order matters

- Request ID must be early, so logs and responses can include it.  
- Error handler must be **last**, or it won’t catch later failures correctly.

---

## 4. How PARKAR implements each part

### Request ID

Uses `requestIdMiddleware` from `common/requestId.js`.  
See [04-request-id.md](04-request-id.md).

### CORS

```js
app.use(cors());
```

Your React app runs on port **5173**, API on **3000**.  
Browsers block that unless the API says it’s OK. CORS does that.

### JSON body parser

```js
app.use(express.json());
```

Needed later for `POST` login/booking bodies. Harmless for `GET /health`.

### Request logging

When the response finishes, we log:

- method (`GET`)
- path (`/health`)
- status code (`200`)
- duration in ms  
- requestId  

This goes to the **terminal**, not the database.

### The only route today: `GET /health`

```js
app.get('/health', asyncHandler(async (req, res) => {
  const database = getDatabaseStatus();
  sendSuccess(res, { status: 'ok', database, ... }, 'Service healthy');
}));
```

Purpose of `/health`:

- Is the API process alive?  
- Is the DB configured/connected?  

Useful for you, and later for hosting monitors.

### 404 + errors

Unknown URLs hit `notFoundHandler`, then `errorHandler`.  
See [05-errors.md](05-errors.md).

---

## 5. Try it yourself

With server running:

1. Open http://localhost:3000/health  
   → success JSON  

2. Open http://localhost:3000/no-such-page  
   → error JSON with code `NOT_FOUND`  

3. Watch the server terminal  
   → JSON log lines appear  

---

## 6. Common beginner confusion

**Q:** Is `app.js` “common”?  
**A:** No. `app.js` **uses** common tools. Common tools live in `server/src/common/`.

**Q:** Does `app.js` save each request to Postgres?  
**A:** No. It only logs to the terminal and may *read* DB status for `/health`.

---

## 7. What to read next

[03-logger.md](03-logger.md)
