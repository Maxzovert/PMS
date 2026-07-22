-- =============================================================================
-- 001_init_notes.sql
-- Purpose: Phase 1 marker — confirms scripts run on the app database.
-- Run against: database from DATABASE_URL (e.g. "parkar")
--
-- No business tables yet. Feature tables will be added as new numbered files
-- (002_..., 003_...) with documentation in documentation/database/.
-- =============================================================================

-- Simple no-op style check: create a schema for future PMS objects.
CREATE SCHEMA IF NOT EXISTS pms;

COMMENT ON SCHEMA pms IS 'PARKAR PMS application objects (tables added in later SQL files)';
