# SQL scripts (run in PostgreSQL)

All database SQL for PARKAR PMS lives **here as `.sql` files**.

Do **not** put schema/query SQL strings inside application code (`src/`).  
The Node app only opens a connection pool; you (or a thin runner) apply these files to the database.

## How to run

### Option A — psql (recommended when installed)

```bash
# Create the database (connect to maintenance DB "postgres")
psql -U postgres -d postgres -f server/sql/000_create_database.sql

# Apply scripts to the app database
psql -U postgres -d parkar -f server/sql/001_init_notes.sql
```

Or from `server/`:

```bash
psql "$DATABASE_URL" -f sql/001_init_notes.sql
```

### Option B — npm helper (reads the file, does not embed SQL)

From `server/`:

```bash
# Create DB (uses admin connection to database "postgres")
npm run db:sql -- sql/000_create_database.sql --admin

# Run one file against DATABASE_URL
npm run db:sql -- sql/001_init_notes.sql

# Run all numbered scripts except 000_ (against DATABASE_URL)
npm run db:sql
```

## File naming

| Pattern | Meaning |
|---------|---------|
| `000_*.sql` | Admin / create-database (run against `postgres`) |
| `001_*.sql`, `002_*.sql`, … | App database scripts, in order |

Add a **new file** for each change. Prefer not editing old applied scripts once shared with the team.

## What belongs here later

- Tables, indexes, constraints  
- Migrations for feature work  
- Seed data for local/dev (optional, clearly named)

## What does not belong here

- Passwords or production secrets  
- Application business logic  

## Related

- Connection code: `server/src/database/index.js` (pool only — no schema SQL)
- Learning note: `notes/08-database.md`
