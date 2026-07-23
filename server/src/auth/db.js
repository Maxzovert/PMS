const { AppError } = require('../common/errors');
const { getPool, getDatabaseStatus } = require('../database');

function requirePool() {
  const status = getDatabaseStatus();
  if (!status.connected) {
    throw new AppError(
      'DATABASE_UNAVAILABLE',
      'Database is not available. Check DATABASE_URL and that PostgreSQL is running.',
      503,
    );
  }
  return getPool();
}

async function withDb(fn) {
  try {
    return await fn(requirePool());
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    const code = err && err.code;
    if (
      code === 'ECONNREFUSED' ||
      code === 'ENOTFOUND' ||
      code === 'ETIMEDOUT' ||
      (err && err.name === 'AggregateError')
    ) {
      throw new AppError(
        'DATABASE_UNAVAILABLE',
        'Database is not available. Check DATABASE_URL and that PostgreSQL is running.',
        503,
      );
    }
    throw err;
  }
}

module.exports = { requirePool, withDb };
