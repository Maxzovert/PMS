const express = require('express');
const { sendSuccess, asyncHandler } = require('../common');
const { requireAuth } = require('../auth/middleware');
const {
  listLocations,
  createLocation,
  getLocation,
  patchLocation,
  submitLocation,
} = require('./service');

function createParkingRouter() {
  const router = express.Router();

  router.get(
    '/locations',
    requireAuth,
    asyncHandler(async (req, res) => {
      const locations = await listLocations(req.user);
      sendSuccess(res, { locations }, 'OK');
    }),
  );

  router.post(
    '/locations',
    requireAuth,
    asyncHandler(async (req, res) => {
      const location = await createLocation(req.user);
      sendSuccess(res, { location }, 'Draft created', 201);
    }),
  );

  router.get(
    '/locations/:id',
    requireAuth,
    asyncHandler(async (req, res) => {
      const location = await getLocation(req.user, req.params.id);
      sendSuccess(res, { location }, 'OK');
    }),
  );

  router.patch(
    '/locations/:id',
    requireAuth,
    asyncHandler(async (req, res) => {
      const location = await patchLocation(
        req.user,
        req.params.id,
        req.body || {},
      );
      sendSuccess(res, { location }, 'Draft saved');
    }),
  );

  router.post(
    '/locations/:id/submit',
    requireAuth,
    asyncHandler(async (req, res) => {
      const location = await submitLocation(req.user, req.params.id);
      sendSuccess(res, { location }, 'Submitted for review');
    }),
  );

  return router;
}

module.exports = { createParkingRouter };
