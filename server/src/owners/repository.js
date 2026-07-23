const { withDb } = require('../auth/db');

async function findProfileByUserId(userId) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `SELECT p.*, u.phone
       FROM pms.owner_profiles p
       INNER JOIN pms.users u ON u.id = p.user_id
       WHERE p.user_id = $1`,
      [userId],
    );
    return result.rows[0] || null;
  });
}

async function createEmptyProfile(userId) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `INSERT INTO pms.owner_profiles (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING *`,
      [userId],
    );
    if (result.rows[0]) {
      return result.rows[0];
    }
    const existing = await pool.query(
      `SELECT p.*, u.phone
       FROM pms.owner_profiles p
       INNER JOIN pms.users u ON u.id = p.user_id
       WHERE p.user_id = $1`,
      [userId],
    );
    return existing.rows[0];
  });
}

async function updateProfile(userId, fields) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `UPDATE pms.owner_profiles SET
         full_name = $2,
         email = $3,
         business_name = $4,
         business_type = $5,
         address_line1 = $6,
         address_line2 = $7,
         city = $8,
         state = $9,
         pincode = $10,
         profile_status = COALESCE($11, profile_status),
         updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
      [
        userId,
        fields.fullName,
        fields.email,
        fields.businessName,
        fields.businessType,
        fields.addressLine1,
        fields.addressLine2,
        fields.city,
        fields.state,
        fields.pincode,
        fields.profileStatus,
      ],
    );
    return result.rows[0] || null;
  });
}

async function syncUserDisplayName(userId, fullName) {
  return withDb(async (pool) => {
    await pool.query(
      `UPDATE pms.users
       SET display_name = $2, updated_at = NOW()
       WHERE id = $1`,
      [userId, fullName],
    );
  });
}

function toPublicProfile(row, phone) {
  if (!row) {
    return null;
  }
  return {
    userId: row.user_id,
    phone: phone || row.phone || null,
    fullName: row.full_name,
    email: row.email,
    businessName: row.business_name,
    businessType: row.business_type,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    profileStatus: row.profile_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  findProfileByUserId,
  createEmptyProfile,
  updateProfile,
  syncUserDisplayName,
  toPublicProfile,
};
