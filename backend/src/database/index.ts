/**
 * Database connection placeholder.
 * Wire PostgreSQL (or approved driver) in Phase 1 foundation — no credentials in code.
 */
export function getDatabaseStatus(): { connected: boolean; message: string } {
  return {
    connected: false,
    message: 'Database not configured yet',
  };
}
