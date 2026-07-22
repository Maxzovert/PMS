require('dotenv').config();

const { createApp } = require('./app');
const { logger } = require('./common');
const { initDatabase, closeDatabase } = require('./database');

const port = Number(process.env.PORT) || 3000;

async function main() {
  await initDatabase();

  const app = createApp();

  const server = app.listen(port, () => {
    logger.info('PARKAR PMS API listening', {
      port,
      env: process.env.NODE_ENV || 'development',
    });
    logger.info('Leave this terminal open. Press Ctrl+C to stop.');
  });

  server.on('error', (err) => {
    logger.error('HTTP server failed', {
      errMessage: err.message,
      code: err.code,
    });
    process.exit(1);
  });

  const shutdown = async (signal) => {
    logger.info('Shutting down', { signal });
    server.close(async () => {
      try {
        await closeDatabase();
      } catch (err) {
        logger.error('Error closing database during shutdown', {
          errMessage: err instanceof Error ? err.message : String(err),
        });
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

main().catch((err) => {
  logger.error('Failed to start server', {
    errMessage: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  process.exit(1);
});
