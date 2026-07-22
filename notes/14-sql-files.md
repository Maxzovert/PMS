# 14 — SQL files folder (no SQL in app code)

**Folder:** `server/sql/`  
**Runner:** `server/scripts/run-sql.js` (only reads files; does not hardcode schema SQL)

---

## 1. What is this?

A rule for this project:

> Database queries and schema changes live in **`.sql` files**, not inside Express/JavaScript feature code.

You open those files in a SQL tool (or run them with `psql` / `npm run db:sql`) and apply them to PostgreSQL.

---

## 2. Why?

| SQL inside JS strings | SQL in files |
|-----------------------|--------------|
| Hard to review | Easy to read in Git |
| Easy to scatter randomly | Ordered (`001_`, `002_`) |
| Hard for DBAs / founders to run | Clear “run this file” |

Application code (`src/database/index.js`) only manages the **connection pool**.

---

## 3. How this project does it

```text
server/sql/
  000_create_database.sql   → create DB "parkar" (admin)
  001_init_notes.sql        → create schema "pms" (app DB)
  README.md                 → how to run
```

Commands from `server/`:

```bash
# Create database (once) — connects to "postgres"
npm run db:sql -- sql/000_create_database.sql --admin

# Apply app scripts
npm run db:sql -- sql/001_init_notes.sql

# Or run all non-000 scripts in order
npm run db:sql
```

Also documented in `documentation/database/README.md`.

---

## 4. What you should do when adding tables later

1. Add a new file, e.g. `002_owners.sql`  
2. Put `CREATE TABLE ...` only in that file  
3. Document columns in `documentation/database/`  
4. Run the file against the DB  
5. Do **not** paste that SQL into `src/` route handlers  

(Repositories later may use parameterized queries for runtime reads/writes — that is different from schema scripts. Schema/migrations stay in `sql/`.)

---

## 5. Mental picture

> `server/sql/` = recipe cards for the fridge layout.  
> `src/database` = the door to the fridge.  
> Don’t carve recipes into the door.
