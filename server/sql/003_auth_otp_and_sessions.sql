-- =============================================================================
-- 003_auth_otp_and_sessions.sql
-- Purpose: OTP challenges (hashed) and server sessions
-- Run against: app database (e.g. parkar)
-- Depends on: 002_auth_users.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS pms.otp_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS otp_challenges_phone_created_idx
  ON pms.otp_challenges (phone, created_at DESC);

CREATE TABLE IF NOT EXISTS pms.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES pms.users (id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sessions_token_hash_unique UNIQUE (token_hash)
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON pms.sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON pms.sessions (expires_at);

COMMENT ON TABLE pms.otp_challenges IS 'Hashed OTP challenges; plaintext never stored';
COMMENT ON TABLE pms.sessions IS 'Server-side sessions; cookie holds raw token, DB stores hash';
