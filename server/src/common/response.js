/**
 * Send a success payload matching Docs/architecture.md API response rules.
 */
function sendSuccess(res, data, message = 'OK', statusCode = 200) {
  const requestId = res.req?.requestId;

  res.status(statusCode).json({
    success: true,
    data,
    message,
    requestId,
  });
}

/**
 * Wrap async route handlers so rejections reach the error middleware.
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { sendSuccess, asyncHandler };
