# PARKAR learning notes (simple version)

These notes explain the project in **everyday language**.

You do **not** need to be an expert. Each note answers:

1. **What is this?**
2. **Why do we need it?**
3. **How does PARKAR use it?**
4. **What does a beginner see / try?**

Official rules for the product still live in `documentation/` and `Docs/`.  
This folder is only to help **you** understand.

---

## Start here

1. Read [00-big-picture.md](00-big-picture.md) first (5–10 minutes).
2. Then read server notes in order: `01` → `08`.
3. Then client + “coming next”.

---

## Full list

### Already built in this project

| # | File | Topic in one sentence |
|---|------|------------------------|
| 00 | [00-big-picture.md](00-big-picture.md) | Client and server are two apps that will talk later |
| 01 | [01-server-js.md](01-server-js.md) | `server.js` starts the API process |
| 02 | [02-app-js.md](02-app-js.md) | `app.js` is the assembly line for every HTTP request |
| 03 | [03-logger.md](03-logger.md) | Logger prints what happened into the terminal |
| 04 | [04-request-id.md](04-request-id.md) | Request ID is a ticket number for one API call |
| 05 | [05-errors.md](05-errors.md) | How we return failures in a standard JSON shape |
| 06 | [06-response.md](06-response.md) | How we return success JSON + async safety |
| 07 | [07-common-folder.md](07-common-folder.md) | `common/` = our shared custom toolkit |
| 08 | [08-database.md](08-database.md) | How we connect to PostgreSQL (not storing every request) |
| 09 | [09-env-secrets.md](09-env-secrets.md) | `.env` holds local secrets; don’t commit them |
| 10 | [10-client-fonts-tokens.md](10-client-fonts-tokens.md) | Colors, fonts, and images for the UI |

### Coming next

| # | File | Topic |
|---|------|--------|
| 11 | [11-client-api-layer.md](11-client-api-layer.md) | How the React app will call the API |
| 12 | [12-routing-auth-shell.md](12-routing-auth-shell.md) | React Router + login/dashboard stub (built) |
| 14 | [14-sql-files.md](14-sql-files.md) | SQL lives in `server/sql/*.sql`, not in app code |
| 15 | [15-authentication.md](15-authentication.md) | Mobile OTP login (Phase 2 first slice) |
| 16 | [16-owner-profile.md](16-owner-profile.md) | Owner profile personal/business (2.3) |

---

## Important reminder (people ask this a lot)

**Are we saving every request in the database?**  
**No.**  

- Request logs go to the **terminal** (for now).  
- The **database** is connected and ready for **product data** later (owners, bookings, etc.).  
- Request ID is only a **label** for that one call, not a DB row.
