const express = require('express');
const cors = require('cors');
const {
  requestIdMiddleware,
  notFoundHandler,
  errorHandler,
  sendSuccess,
  asyncHandler,
  logger,
} = require('./common');
const { getDatabaseStatus } = require('./database');

function createApp() {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
      logger.info('HTTP request', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: Date.now() - started,
      });
    });
    next();
  });

  app.get(
    '/health',
    asyncHandler(async (req, res) => {
      const database = getDatabaseStatus();

      sendSuccess(
        res,
        {
          status: 'ok',
          service: 'parkar-pms-backend',
          timestamp: new Date().toISOString(),
          database,
        },
        'Service healthy',
      );
    }),
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
