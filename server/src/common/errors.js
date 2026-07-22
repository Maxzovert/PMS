class AppError extends Error {
  /**
   * @param {string} code Stable machine-readable error code
   * @param {string} message Safe user-facing message (no secrets/stack)
   * @param {number} [statusCode=500]
   * @param {{ details?: unknown }} [options]
   */
  constructor(code, message, statusCode = 500, options = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = options.details;
    this.isOperational = true;
  }
}

function notFoundHandler(req, _res, next) {
  next(
    new AppError(
      'NOT_FOUND',
      `Route ${req.method} ${req.path} was not found.`,
      404,
    ),
  );
}

function errorHandler(err, req, res, _next) {
  const { logger } = require('./logger');
  const requestId = req.requestId || 'unknown';

  const statusCode =
    typeof err.statusCode === 'number' ? err.statusCode : 500;
  const isOperational = err instanceof AppError || err.isOperational === true;

  const code = isOperational && err.code ? err.code : 'INTERNAL_ERROR';
  const message = isOperational
    ? err.message
    : 'An unexpected error occurred. Please try again.';

  if (!isOperational || statusCode >= 500) {
    logger.error('Request failed', {
      requestId,
      code,
      statusCode,
      errMessage: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  } else {
    logger.warn('Request rejected', {
      requestId,
      code,
      statusCode,
    });
  }

  const body = {
    success: false,
    error: {
      code,
      message,
      requestId,
    },
  };

  if (
    process.env.NODE_ENV !== 'production' &&
    isOperational &&
    err.details !== undefined
  ) {
    body.error.details = err.details;
  }

  res.status(statusCode).json(body);
}

module.exports = {
  AppError,
  notFoundHandler,
  errorHandler,
};
