const express = require('express');
const { sendSuccess, asyncHandler } = require('../common');
const { requireAuth } = require('../auth/middleware');
const { getOrCreateProfile, patchProfile } = require('./service');

function createOwnersRouter() {
  const router = express.Router();

  router.get(
    '/me/profile',
    requireAuth,
    asyncHandler(async (req, res) => {
      const profile = await getOrCreateProfile(req.user);
      sendSuccess(res, { profile }, 'OK');
    }),
  );

  router.patch(
    '/me/profile',
    requireAuth,
    asyncHandler(async (req, res) => {
      const profile = await patchProfile(req.user, req.body || {});
      sendSuccess(res, { profile }, 'Profile saved');
    }),
  );

  return router;
}

module.exports = { createOwnersRouter };
