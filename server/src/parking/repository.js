const { withDb } = require('../auth/db');

async function listByOwner(ownerUserId) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `SELECT *
       FROM pms.parking_locations
       WHERE owner_user_id = $1
       ORDER BY updated_at DESC`,
      [ownerUserId],
    );
    return result.rows;
  });
}

async function findByIdForOwner(id, ownerUserId) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `SELECT *
       FROM pms.parking_locations
       WHERE id = $1 AND owner_user_id = $2`,
      [id, ownerUserId],
    );
    return result.rows[0] || null;
  });
}

async function createDraft(ownerUserId) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `INSERT INTO pms.parking_locations (owner_user_id, status, onboarding_step)
       VALUES ($1, 'draft', 0)
       RETURNING *`,
      [ownerUserId],
    );
    return result.rows[0];
  });
}

async function updateDraft(id, ownerUserId, fields) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `UPDATE pms.parking_locations SET
         name = $3,
         location_type = $4,
         address_line1 = $5,
         landmark = $6,
         latitude = $7,
         longitude = $8,
         capacity = $9,
         covered = $10,
         vehicle_types = $11,
         price_hourly = $12,
         price_daily = $13,
         open_time = $14,
         close_time = $15,
         onboarding_step = $16,
         updated_at = NOW()
       WHERE id = $1 AND owner_user_id = $2 AND status = 'draft'
       RETURNING *`,
      [
        id,
        ownerUserId,
        fields.name,
        fields.locationType,
        fields.addressLine1,
        fields.landmark,
        fields.latitude,
        fields.longitude,
        fields.capacity,
        fields.covered,
        fields.vehicleTypes,
        fields.priceHourly,
        fields.priceDaily,
        fields.openTime,
        fields.closeTime,
        fields.onboardingStep,
      ],
    );
    return result.rows[0] || null;
  });
}

async function submitForReview(id, ownerUserId) {
  return withDb(async (pool) => {
    const result = await pool.query(
      `UPDATE pms.parking_locations SET
         status = 'under_review',
         onboarding_step = 5,
         updated_at = NOW()
       WHERE id = $1 AND owner_user_id = $2 AND status = 'draft'
       RETURNING *`,
      [id, ownerUserId],
    );
    return result.rows[0] || null;
  });
}

function toPublicLocation(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    locationType: row.location_type,
    addressLine1: row.address_line1,
    landmark: row.landmark,
    latitude: row.latitude !== null && row.latitude !== undefined
      ? Number(row.latitude)
      : null,
    longitude: row.longitude !== null && row.longitude !== undefined
      ? Number(row.longitude)
      : null,
    capacity: row.capacity,
    covered: row.covered,
    vehicleTypes: Array.isArray(row.vehicle_types) ? row.vehicle_types : [],
    priceHourly: row.price_hourly !== null && row.price_hourly !== undefined
      ? Number(row.price_hourly)
      : null,
    priceDaily: row.price_daily !== null && row.price_daily !== undefined
      ? Number(row.price_daily)
      : null,
    openTime: row.open_time,
    closeTime: row.close_time,
    status: row.status,
    onboardingStep: row.onboarding_step,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  listByOwner,
  findByIdForOwner,
  createDraft,
  updateDraft,
  submitForReview,
  toPublicLocation,
};
