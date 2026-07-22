const { logger } = require('../common/logger');

/** @type {import('pg').Pool | null} */
let pool = null;
let lastError = null;

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  return typeof url === 'string' && url.trim() ? url.trim() : '';
}

/**
 * Create a PostgreSQL pool when DATABASE_URL is set.
 * Does not throw if URL is missing — Phase 1 allows running without a DB.
 */
async function initDatabase() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    pool = null;
    lastError = null;
    logger.info('Database skipped — DATABASE_URL is not set');
    return getDatabaseStatus();
  }

  const { Pool } = require('pg');

  pool = new Pool({
    connectionString: databaseUrl,
    // Keep MVP pool small until load patterns are known
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  pool.on('error', (err) => {
    lastError = err.message;
    logger.error('Unexpected PostgreSQL pool error', {
      errMessage: err.message,
    });
  });

  try {
    const client = await pool.connect();
    client.release();
    lastError = null;
    logger.info('Database pool connected');
  } catch (err) {
    lastError = err instanceof Error ? err.message : String(err);
    logger.error('Database connection failed', {
      errMessage: lastError,
    });
    // Keep pool for later retries; status reports failure
  }

  return getDatabaseStatus();
}

function getPool() {
  return pool;
}

function getDatabaseStatus() {
  const configured = Boolean(getDatabaseUrl());

  if (!configured) {
    return {
      configured: false,
      connected: false,
      message: 'DATABASE_URL is not set',
    };
  }

  if (!pool) {
    return {
      configured: true,
      connected: false,
      message: 'Database pool not initialized',
    };
  }

  if (lastError) {
    return {
      configured: true,
      connected: false,
      message: 'Database connection failed',
      // Safe operational hint only — never echo credentials
      detail: lastError.includes('password')
        ? 'Authentication or connection rejected'
        : lastError,
    };
  }

  return {
    configured: true,
    connected: true,
    message: 'Database pool ready',
  };
}

async function closeDatabase() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = null;
  lastError = null;
  logger.info('Database pool closed');
}

module.exports = {
  initDatabase,
  getPool,
  getDatabaseStatus,
  closeDatabase,
};
