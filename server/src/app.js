const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {
  requestIdMiddleware,
  notFoundHandler,
  errorHandler,
  sendSuccess,
  asyncHandler,
  logger,
} = require('./common');
const { getDatabaseStatus } = require('./database');
const { createAuthRouter } = require('./auth');
const { createOwnersRouter } = require('./owners');

function createApp() {
  const app = express();

  const clientOrigin =
    process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  app.use(requestIdMiddleware);
  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

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
    asyncHandler(async (_req, res) => {
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

  app.use('/auth', createAuthRouter());
  app.use('/owners', createOwnersRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
