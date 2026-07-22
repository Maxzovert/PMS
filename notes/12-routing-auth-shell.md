# 12 — Routing and auth placeholder shell

**Status:** Built (Phase 1 foundation)  
**Code:** `client/src/routes/`, `client/src/pages/`, `client/src/layouts/`, `client/src/auth/`

---

## 1. What is routing?

Routing picks **which screen** shows for a URL.

| Path | Screen |
|------|--------|
| `/` | Redirect to `/dashboard` or `/login` |
| `/login` | Login placeholder |
| `/dashboard` | Dashboard placeholder (protected) |
| anything else | Not found |

Library: `react-router-dom`.

---

## 2. What is the auth placeholder?

**Not** real OTP/SMS/JWT.

It is a door frame:

- `AuthContext` — `isAuthenticated` stub (sessionStorage flag for this tab only)
- `ProtectedRoute` — sends you to `/login` if the stub says “not signed in”
- Login page — disabled phone/OTP fields + **Continue to dashboard (dev stub)** button
- Sign out clears the stub and returns you to login

Real Authentication is a later phase with docs + server APIs.

---

## 3. How to try it

1. Open http://localhost:5173 → should land on `/login`
2. Click **Continue to dashboard (dev stub)**
3. See dashboard + API health
4. Click **Sign out** → back to login
5. Visit `/dashboard` while signed out → redirected to `/login`

---

## 4. Mental picture

> Routes = rooms.  
> Auth placeholder = door frame.  
> OTP = real lock installed later.
