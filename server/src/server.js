require('dotenv').config();

const { createApp } = require('./app');
const { logger } = require('./common');
const { initDatabase } = require('./database');

const port = Number(process.env.PORT) || 3000;

async function main() {
  await initDatabase();

  const app = createApp();

  app.listen(port, () => {
    logger.info('PARKAR PMS API listening', {
      port,
      env: process.env.NODE_ENV || 'development',
    });
  });
}

main().catch((err) => {
  logger.error('Failed to start server', {
    errMessage: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  process.exit(1);
});
