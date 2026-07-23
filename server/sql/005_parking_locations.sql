-- =============================================================================
-- 005_parking_locations.sql
-- Purpose: owner parking locations + onboarding progress (Phase 3 first slice)
-- Depends on: 002_auth_users.sql
-- Photos / map / admin approval intentionally deferred
-- =============================================================================

CREATE TABLE IF NOT EXISTS pms.parking_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES pms.users (id) ON DELETE CASCADE,
  name TEXT,
  location_type TEXT,
  address_line1 TEXT,
  landmark TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  capacity INTEGER,
  covered BOOLEAN,
  vehicle_types TEXT[] NOT NULL DEFAULT '{}',
  price_hourly NUMERIC(12, 2),
  price_daily NUMERIC(12, 2),
  open_time TEXT,
  close_time TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  onboarding_step INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT parking_locations_status_check CHECK (
    status IN ('draft', 'under_review', 'approved', 'rejected', 'active')
  ),
  CONSTRAINT parking_locations_location_type_check CHECK (
    location_type IS NULL
    OR location_type IN ('commercial', 'residential', 'mixed', 'other')
  ),
  CONSTRAINT parking_locations_onboarding_step_check CHECK (
    onboarding_step >= 0 AND onboarding_step <= 5
  ),
  CONSTRAINT parking_locations_capacity_check CHECK (
    capacity IS NULL OR capacity >= 1
  ),
  CONSTRAINT parking_locations_price_hourly_check CHECK (
    price_hourly IS NULL OR price_hourly >= 0
  ),
  CONSTRAINT parking_locations_price_daily_check CHECK (
    price_daily IS NULL OR price_daily >= 0
  )
);

CREATE INDEX IF NOT EXISTS parking_locations_owner_idx
  ON pms.parking_locations (owner_user_id);

CREATE INDEX IF NOT EXISTS parking_locations_owner_status_idx
  ON pms.parking_locations (owner_user_id, status);

COMMENT ON TABLE pms.parking_locations IS
  'Owner parking locations; onboarding wizard first slice; photos/maps deferred';
