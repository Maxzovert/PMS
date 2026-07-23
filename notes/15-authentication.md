# 15 — Authentication (OTP)

**Status:** Built — Phase 2 first slice  
**Docs:** `documentation/features/authentication.md`

---

## 1. What it is

Owners sign in with **mobile number + 6-digit OTP**.  
The server stores a **hashed** OTP and creates a **session cookie** after verify.

SMS is **mocked** in development (OTP appears in server logs, or use `DEV_OTP_FIXED=000000`).

---

## 2. APIs

| Call | Purpose |
|------|---------|
| `POST /auth/request-otp` | Send/create OTP challenge |
| `POST /auth/verify-otp` | Check code, set `parkar_session` cookie |
| `GET /auth/me` | Current user |
| `POST /auth/logout` | Revoke session |

---

## 3. How to try locally

1. Start PostgreSQL  
2. `cd server && npm run db:sql` (applies `002` + `003`)  
3. `npm run dev` in server (leave terminal open)  
4. `npm run dev` in client  
5. Open `/login`, enter phone like `9876543210`  
6. Use OTP `000000` if `DEV_OTP_FIXED` is set, else read mock OTP from server log  
7. Dashboard should show your phone; Sign out clears session  

---

## 4. SQL files

- `server/sql/002_auth_users.sql`  
- `server/sql/003_auth_otp_and_sessions.sql`  

No schema SQL inside `src/` — only parameterized queries at runtime.
