const { AppError } = require('../common/errors');
const { logger } = require('../common/logger');
const repo = require('./repository');

const LOCATION_TYPES = new Set([
  'commercial',
  'residential',
  'mixed',
  'other',
]);
const VEHICLE_TYPES = new Set(['bike', 'car', 'suv', 'commercial']);
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function emptyToNull(value) {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new AppError('VALIDATION_ERROR', 'Text fields must be strings.', 400);
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function parseOptionalNumber(value, field) {
  if (value === undefined) {
    return undefined;
  }
  if (value === null || value === '') {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new AppError('VALIDATION_ERROR', `${field} must be a number.`, 400);
  }
  return n;
}

function parseOptionalInt(value, field) {
  const n = parseOptionalNumber(value, field);
  if (n === undefined || n === null) {
    return n;
  }
  if (!Number.isInteger(n)) {
    throw new AppError('VALIDATION_ERROR', `${field} must be a whole number.`, 400);
  }
  return n;
}

function parseVehicleTypes(value) {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new AppError('VALIDATION_ERROR', 'vehicleTypes must be an array.', 400);
  }
  const out = [];
  for (const item of value) {
    if (typeof item !== 'string' || !VEHICLE_TYPES.has(item)) {
      throw new AppError(
        'VALIDATION_ERROR',
        'vehicleTypes may only include bike, car, suv, commercial.',
        400,
      );
    }
    if (!out.includes(item)) {
      out.push(item);
    }
  }
  return out;
}

function mergeFields(current, body) {
  const name =
    body.name !== undefined ? emptyToNull(body.name) : current.name;
  if (name && name.length > 120) {
    throw new AppError('VALIDATION_ERROR', 'Name is too long (max 120).', 400);
  }

  let locationType =
    body.locationType !== undefined
      ? emptyToNull(body.locationType)
      : current.locationType;
  if (locationType && !LOCATION_TYPES.has(locationType)) {
    throw new AppError('VALIDATION_ERROR', 'Invalid locationType.', 400);
  }

  const addressLine1 =
    body.addressLine1 !== undefined
      ? emptyToNull(body.addressLine1)
      : current.addressLine1;
  if (addressLine1 && addressLine1.length > 200) {
    throw new AppError('VALIDATION_ERROR', 'Address is too long.', 400);
  }

  const landmark =
    body.landmark !== undefined
      ? emptyToNull(body.landmark)
      : current.landmark;
  if (landmark && landmark.length > 160) {
    throw new AppError('VALIDATION_ERROR', 'Landmark is too long.', 400);
  }

  const latitude = parseOptionalNumber(
    body.latitude !== undefined ? body.latitude : current.latitude,
    'latitude',
  );
  if (latitude !== undefined && latitude !== null && (latitude < -90 || latitude > 90)) {
    throw new AppError('VALIDATION_ERROR', 'latitude must be between -90 and 90.', 400);
  }

  const longitude = parseOptionalNumber(
    body.longitude !== undefined ? body.longitude : current.longitude,
    'longitude',
  );
  if (
    longitude !== undefined &&
    longitude !== null &&
    (longitude < -180 || longitude > 180)
  ) {
    throw new AppError(
      'VALIDATION_ERROR',
      'longitude must be between -180 and 180.',
      400,
    );
  }

  let capacity =
    body.capacity !== undefined
      ? parseOptionalInt(body.capacity, 'capacity')
      : current.capacity;
  if (capacity !== undefined && capacity !== null && capacity < 1) {
    throw new AppError('VALIDATION_ERROR', 'capacity must be at least 1.', 400);
  }

  let covered = current.covered;
  if (body.covered !== undefined) {
    if (body.covered === null) {
      covered = null;
    } else if (typeof body.covered !== 'boolean') {
      throw new AppError('VALIDATION_ERROR', 'covered must be true or false.', 400);
    } else {
      covered = body.covered;
    }
  }

  const vehicleTypes =
    body.vehicleTypes !== undefined
      ? parseVehicleTypes(body.vehicleTypes)
      : current.vehicleTypes;

  let priceHourly =
    body.priceHourly !== undefined
      ? parseOptionalNumber(body.priceHourly, 'priceHourly')
      : current.priceHourly;
  if (priceHourly !== undefined && priceHourly !== null && priceHourly < 0) {
    throw new AppError('VALIDATION_ERROR', 'priceHourly cannot be negative.', 400);
  }

  let priceDaily =
    body.priceDaily !== undefined
      ? parseOptionalNumber(body.priceDaily, 'priceDaily')
      : current.priceDaily;
  if (priceDaily !== undefined && priceDaily !== null && priceDaily < 0) {
    throw new AppError('VALIDATION_ERROR', 'priceDaily cannot be negative.', 400);
  }

  let openTime =
    body.openTime !== undefined ? emptyToNull(body.openTime) : current.openTime;
  if (openTime && !TIME_RE.test(openTime)) {
    throw new AppError('VALIDATION_ERROR', 'openTime must be HH:MM.', 400);
  }

  let closeTime =
    body.closeTime !== undefined
      ? emptyToNull(body.closeTime)
      : current.closeTime;
  if (closeTime && !TIME_RE.test(closeTime)) {
    throw new AppError('VALIDATION_ERROR', 'closeTime must be HH:MM.', 400);
  }

  let onboardingStep = current.onboardingStep;
  if (body.onboardingStep !== undefined) {
    const step = parseOptionalInt(body.onboardingStep, 'onboardingStep');
    if (step === null || step < 0 || step > 5) {
      throw new AppError(
        'VALIDATION_ERROR',
        'onboardingStep must be between 0 and 5.',
        400,
      );
    }
    onboardingStep = step;
  }

  if (body.status !== undefined) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Use submit to change status.',
      400,
    );
  }

  return {
    name: name === undefined ? current.name : name,
    locationType: locationType === undefined ? current.locationType : locationType,
    addressLine1: addressLine1 === undefined ? current.addressLine1 : addressLine1,
    landmark: landmark === undefined ? current.landmark : landmark,
    latitude: latitude === undefined ? current.latitude : latitude,
    longitude: longitude === undefined ? current.longitude : longitude,
    capacity: capacity === undefined ? current.capacity : capacity,
    covered,
    vehicleTypes: vehicleTypes === undefined ? current.vehicleTypes : vehicleTypes,
    priceHourly: priceHourly === undefined ? current.priceHourly : priceHourly,
    priceDaily: priceDaily === undefined ? current.priceDaily : priceDaily,
    openTime: openTime === undefined ? current.openTime : openTime,
    closeTime: closeTime === undefined ? current.closeTime : closeTime,
    onboardingStep,
  };
}

async function listLocations(user) {
  const rows = await repo.listByOwner(user.id);
  return rows.map(repo.toPublicLocation);
}

async function createLocation(user) {
  const row = await repo.createDraft(user.id);
  logger.info('Parking location created', { userId: user.id, id: row.id });
  return repo.toPublicLocation(row);
}

async function getLocation(user, id) {
  const row = await repo.findByIdForOwner(id, user.id);
  if (!row) {
    throw new AppError('NOT_FOUND', 'Parking location not found.', 404);
  }
  return repo.toPublicLocation(row);
}

async function patchLocation(user, id, body = {}) {
  const currentRow = await repo.findByIdForOwner(id, user.id);
  if (!currentRow) {
    throw new AppError('NOT_FOUND', 'Parking location not found.', 404);
  }
  const current = repo.toPublicLocation(currentRow);
  if (current.status !== 'draft') {
    throw new AppError(
      'CONFLICT',
      'Only draft locations can be edited.',
      409,
    );
  }

  const fields = mergeFields(current, body);
  const updated = await repo.updateDraft(id, user.id, fields);
  if (!updated) {
    throw new AppError('CONFLICT', 'Only draft locations can be edited.', 409);
  }

  logger.info('Parking location updated', { userId: user.id, id });
  return repo.toPublicLocation(updated);
}

async function submitLocation(user, id) {
  const currentRow = await repo.findByIdForOwner(id, user.id);
  if (!currentRow) {
    throw new AppError('NOT_FOUND', 'Parking location not found.', 404);
  }
  const current = repo.toPublicLocation(currentRow);
  if (current.status !== 'draft') {
    throw new AppError(
      'CONFLICT',
      'Only draft locations can be submitted.',
      409,
    );
  }
  if (!current.name) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Add a parking name before submitting.',
      400,
    );
  }
  if (!current.capacity || current.capacity < 1) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Set capacity to at least 1 before submitting.',
      400,
    );
  }

  const updated = await repo.submitForReview(id, user.id);
  if (!updated) {
    throw new AppError('CONFLICT', 'Only draft locations can be submitted.', 409);
  }

  logger.info('Parking location submitted', { userId: user.id, id });
  return repo.toPublicLocation(updated);
}

module.exports = {
  listLocations,
  createLocation,
  getLocation,
  patchLocation,
  submitLocation,
};
