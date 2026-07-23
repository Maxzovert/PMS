const { AppError } = require('../common/errors');
const { logger } = require('../common/logger');
const repo = require('./repository');

const MAX_LEN = {
  fullName: 120,
  email: 254,
  businessName: 160,
  businessType: 80,
  addressLine1: 200,
  addressLine2: 200,
  city: 80,
  state: 80,
  pincode: 10,
};

const ALLOWED_OWNER_STATUSES = new Set(['draft', 'under_review']);

function emptyToNull(value) {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new AppError('VALIDATION_ERROR', 'Profile fields must be text.', 400);
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function assertMax(field, value, max) {
  if (value && value.length > max) {
    throw new AppError(
      'VALIDATION_ERROR',
      `${field} is too long (max ${max} characters).`,
      400,
    );
  }
}

function validateEmail(email) {
  if (!email) {
    return;
  }
  // Simple practical check — not full RFC
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError('VALIDATION_ERROR', 'Enter a valid email address.', 400);
  }
}

function validatePincode(pincode) {
  if (!pincode) {
    return;
  }
  if (!/^[A-Za-z0-9-]{4,10}$/.test(pincode)) {
    throw new AppError('VALIDATION_ERROR', 'Enter a valid pincode.', 400);
  }
}

async function getOrCreateProfile(user) {
  let row = await repo.findProfileByUserId(user.id);
  if (!row) {
    await repo.createEmptyProfile(user.id);
    row = await repo.findProfileByUserId(user.id);
  }
  return repo.toPublicProfile(row, user.phone);
}

async function patchProfile(user, body = {}) {
  const current = await getOrCreateProfile(user);

  const next = {
    fullName:
      body.fullName !== undefined
        ? emptyToNull(body.fullName)
        : current.fullName,
    email: body.email !== undefined ? emptyToNull(body.email) : current.email,
    businessName:
      body.businessName !== undefined
        ? emptyToNull(body.businessName)
        : current.businessName,
    businessType:
      body.businessType !== undefined
        ? emptyToNull(body.businessType)
        : current.businessType,
    addressLine1:
      body.addressLine1 !== undefined
        ? emptyToNull(body.addressLine1)
        : current.addressLine1,
    addressLine2:
      body.addressLine2 !== undefined
        ? emptyToNull(body.addressLine2)
        : current.addressLine2,
    city: body.city !== undefined ? emptyToNull(body.city) : current.city,
    state: body.state !== undefined ? emptyToNull(body.state) : current.state,
    pincode:
      body.pincode !== undefined ? emptyToNull(body.pincode) : current.pincode,
    profileStatus: current.profileStatus,
  };

  assertMax('fullName', next.fullName, MAX_LEN.fullName);
  assertMax('email', next.email, MAX_LEN.email);
  assertMax('businessName', next.businessName, MAX_LEN.businessName);
  assertMax('businessType', next.businessType, MAX_LEN.businessType);
  assertMax('addressLine1', next.addressLine1, MAX_LEN.addressLine1);
  assertMax('addressLine2', next.addressLine2, MAX_LEN.addressLine2);
  assertMax('city', next.city, MAX_LEN.city);
  assertMax('state', next.state, MAX_LEN.state);
  assertMax('pincode', next.pincode, MAX_LEN.pincode);
  validateEmail(next.email);
  validatePincode(next.pincode);

  if (body.profileStatus !== undefined) {
    const status = emptyToNull(body.profileStatus);
    if (status === 'verified' || status === 'suspended') {
      throw new AppError(
        'VALIDATION_ERROR',
        'You cannot set that profile status.',
        400,
      );
    }
    if (status && !ALLOWED_OWNER_STATUSES.has(status)) {
      throw new AppError('VALIDATION_ERROR', 'Invalid profile status.', 400);
    }
    if (status) {
      next.profileStatus = status;
    }
  }

  const updated = await repo.updateProfile(user.id, next);
  if (!updated) {
    throw new AppError(
      'INTERNAL_ERROR',
      'Could not update profile. Please try again.',
      500,
    );
  }

  if (next.fullName) {
    await repo.syncUserDisplayName(user.id, next.fullName);
  }

  logger.info('Owner profile updated', { userId: user.id });

  const withPhone = await repo.findProfileByUserId(user.id);
  return repo.toPublicProfile(withPhone, user.phone);
}

module.exports = {
  getOrCreateProfile,
  patchProfile,
};
