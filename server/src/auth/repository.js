const { withDb } = require('./db');
const { hashValue } = require('./otpProvider');

async function countRecentOtpRequests(phone, since) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM pms.otp_challenges
       WHERE phone = $1 AND created_at >= $2`,
      [phone, since],
    );
    return result.rows[0].count;
  });
}

async function getLatestOtpCreatedAt(phone) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `SELECT created_at
       FROM pms.otp_challenges
       WHERE phone = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone],
    );
    return result.rows[0]?.created_at || null;
  });
}

async function invalidateOpenChallenges(phone) {
  return withDb(async (pool) => {
    await pool.query(
      `UPDATE pms.otp_challenges
       SET consumed_at = NOW()
       WHERE phone = $1 AND consumed_at IS NULL`,
      [phone],
    );
  });
}

async function insertOtpChallenge({ phone, codeHash, expiresAt }) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `INSERT INTO pms.otp_challenges (phone, code_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id, expires_at, created_at`,
      [phone, codeHash, expiresAt],
    );
    return result.rows[0];
  });
}

async function findActiveChallenge(phone) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `SELECT *
       FROM pms.otp_challenges
       WHERE phone = $1
         AND consumed_at IS NULL
         AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone],
    );
    return result.rows[0] || null;
  });
}

async function incrementChallengeAttempts(id) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `UPDATE pms.otp_challenges
       SET attempts = attempts + 1
       WHERE id = $1
       RETURNING attempts, max_attempts`,
      [id],
    );
    return result.rows[0];
  });
}

async function consumeChallenge(id) {
  return withDb(async (pool) => {
    await pool.query(
      `UPDATE pms.otp_challenges
       SET consumed_at = NOW()
       WHERE id = $1`,
      [id],
    );
  });
}

async function findUserByPhone(phone) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `SELECT id, phone, display_name, role, status, created_at
       FROM pms.users
       WHERE phone = $1`,
      [phone],
    );
    return result.rows[0] || null;
  });
}

async function createUser(phone) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `INSERT INTO pms.users (phone, role, status)
       VALUES ($1, 'owner', 'active')
       RETURNING id, phone, display_name, role, status, created_at`,
      [phone],
    );
    return result.rows[0];
  });
}

async function insertSession({ userId, tokenHash, expiresAt, userAgent, ip }) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `INSERT INTO pms.sessions (user_id, token_hash, expires_at, user_agent, ip)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, expires_at`,
      [userId, tokenHash, expiresAt, userAgent || null, ip || null],
    );
    return result.rows[0];
  });
}

async function findSessionByToken(rawToken) {
  return withDb(async (pool) => {
    const tokenHash = hashValue(rawToken);
    const result = await pool.query(
      `SELECT s.id AS session_id, s.expires_at, s.revoked_at,
              u.id, u.phone, u.display_name, u.role, u.status, u.created_at
       FROM pms.sessions s
       INNER JOIN pms.users u ON u.id = s.user_id
       WHERE s.token_hash = $1`,
      [tokenHash],
    );
    return result.rows[0] || null;
  });
}

async function revokeSessionByToken(rawToken) {
  return withDb(async (pool) => {
    const tokenHash = hashValue(rawToken);
    await pool.query(
      `UPDATE pms.sessions
       SET revoked_at = NOW()
       WHERE token_hash = $1 AND revoked_at IS NULL`,
      [tokenHash],
    );
  });
}

function publicUser(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    phone: row.phone,
    displayName: row.display_name,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
  };
}

module.exports = {
  countRecentOtpRequests,
  getLatestOtpCreatedAt,
  invalidateOpenChallenges,
  insertOtpChallenge,
  findActiveChallenge,
  incrementChallengeAttempts,
  consumeChallenge,
  findUserByPhone,
  createUser,
  insertSession,
  findSessionByToken,
  revokeSessionByToken,
  publicUser,
};
