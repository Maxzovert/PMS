-- =============================================================================
-- 002_auth_users.sql
-- Purpose: users for mobile OTP authentication
-- Run against: app database (e.g. parkar)
-- =============================================================================

CREATE TABLE IF NOT EXISTS pms.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'owner',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_phone_unique UNIQUE (phone),
  CONSTRAINT users_role_check CHECK (role IN ('owner', 'manager', 'attendant', 'accountant')),
  CONSTRAINT users_status_check CHECK (status IN ('active', 'suspended'))
);

CREATE INDEX IF NOT EXISTS users_phone_idx ON pms.users (phone);

COMMENT ON TABLE pms.users IS 'PARKAR PMS authenticated users (owners/staff)';
COMMENT ON COLUMN pms.users.phone IS 'E.164-normalized mobile number';
