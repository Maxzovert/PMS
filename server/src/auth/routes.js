const express = require('express');
const { sendSuccess, asyncHandler } = require('../common');
const {
  COOKIE_NAME,
  cookieOptions,
  requestOtp,
  verifyOtp,
  logout,
} = require('./service');
const { requireAuth, readSessionToken } = require('./middleware');

function createAuthRouter() {
  const router = express.Router();

  router.post(
    '/request-otp',
    asyncHandler(async (req, res) => {
      const data = await requestOtp(req.body?.phone);
      sendSuccess(res, data, 'Verification code sent');
    }),
  );

  router.post(
    '/verify-otp',
    asyncHandler(async (req, res) => {
      const result = await verifyOtp(req.body?.phone, req.body?.code, {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      });

      res.cookie(COOKIE_NAME, result.token, cookieOptions());
      // sessionToken included for native clients (Bearer); web keeps using cookie
      sendSuccess(
        res,
        { user: result.user, sessionToken: result.token },
        'Signed in',
      );
    }),
  );

  router.post(
    '/logout',
    requireAuth,
    asyncHandler(async (req, res) => {
      await logout(req.sessionToken || readSessionToken(req));
      res.clearCookie(COOKIE_NAME, { path: '/' });
      sendSuccess(res, {}, 'Signed out');
    }),
  );

  router.get(
    '/me',
    requireAuth,
    asyncHandler(async (req, res) => {
      sendSuccess(res, { user: req.user }, 'OK');
    }),
  );

  return router;
}

module.exports = { createAuthRouter };
