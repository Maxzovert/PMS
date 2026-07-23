# Database documentation

Schema and SQL scripts for PARKAR PMS.

## Runnable SQL

All queries/schema scripts live as files under:

[`server/sql/`](../../server/sql/README.md)

| Rule | Detail |
|------|--------|
| Put SQL in `.sql` files | Not inside `server/src/` application code |
| One change ≈ one new numbered file | `002_...`, `003_...` |
| Document tables here as features add them | Columns, constraints, indexes |

## Current scripts

| File | Purpose |
|------|---------|
| `000_create_database.sql` | Create local DB `parkar` (run with `--admin`) |
| `001_init_notes.sql` | Create `pms` schema placeholder |
| `002_auth_users.sql` | `pms.users` |
| `003_auth_otp_and_sessions.sql` | `pms.otp_challenges`, `pms.sessions` |

## Connection

Runtime pool only (no schema SQL in JS): `server/src/database/index.js`
