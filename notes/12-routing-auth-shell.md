# 12 — Coming next: routing and auth placeholder

**Status:** Not built yet.

---

## 1. What is routing?

Routing means: **which screen shows for which URL**.

Examples later:

- `/login` → login page  
- `/dashboard` → owner home  

Today there is basically one screen in `App.jsx`.

---

## 2. What is an auth placeholder?

Phase 1 does **not** mean full OTP login yet.

It means empty frames:

- a login route/page shell  
- maybe a “must be logged in” wrapper that will check a session later  

Real OTP / SMS comes in the Authentication feature phase, with docs and tests.

---

## 3. Why placeholder first?

So when auth work starts, we already have:

- places to put screens  
- API helper ready  
- shared layout patterns  

---

## 4. Mental picture

> Routes = rooms.  
> Auth placeholder = door frame.  
> OTP = real lock installed later.
