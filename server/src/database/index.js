/**
 * Database connection placeholder.
 * Wire PostgreSQL (or approved driver) in Phase 1 foundation — no credentials in code.
 */
function getDatabaseStatus() {
  return {
    connected: false,
    message: 'Database not configured yet',
  };
}

module.exports = { getDatabaseStatus };
