-- =============================================================================
-- 000_create_database.sql
-- Purpose: create the local app database (once)
-- Run against: maintenance database "postgres" (NOT against "parkar")
--
-- psql:
--   psql -U postgres -d postgres -f sql/000_create_database.sql
--
-- npm:
--   npm run db:sql -- sql/000_create_database.sql --admin
--
-- If you see "already exists", the database is already created — that is OK.
-- If your DATABASE_URL uses a different DB name, change "parkar" below to match.
-- =============================================================================

CREATE DATABASE parkar;
