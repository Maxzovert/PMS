-- =============================================================================
-- 004_owner_profiles.sql
-- Purpose: owner personal + business profile (Phase 2.3 first slice)
-- Depends on: 002_auth_users.sql
-- KYC / bank columns intentionally omitted (see missed-during-development)
-- =============================================================================

CREATE TABLE IF NOT EXISTS pms.owner_profiles (
  user_id UUID PRIMARY KEY REFERENCES pms.users (id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  business_name TEXT,
  business_type TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  profile_status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT owner_profiles_status_check CHECK (
    profile_status IN ('draft', 'under_review', 'verified', 'rejected', 'suspended')
  )
);

COMMENT ON TABLE pms.owner_profiles IS 'Owner personal/business profile; KYC/bank deferred';
