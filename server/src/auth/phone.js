const { AppError } = require('../common/errors');

/**
 * Normalize to E.164-ish: leading +, digits only after.
 * Accepts "9876543210" (assumes +91) or "+919876543210".
 */
function normalizePhone(input) {
  if (typeof input !== 'string') {
    throw new AppError('VALIDATION_ERROR', 'Phone number is required.', 400);
  }

  const trimmed = input.trim();
  if (!trimmed) {
    throw new AppError('VALIDATION_ERROR', 'Phone number is required.', 400);
  }

  let digits = trimmed.replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) {
    digits = `+${digits.slice(2)}`;
  }

  if (!digits.startsWith('+')) {
    const only = digits.replace(/\D/g, '');
    if (only.length === 10) {
      digits = `+91${only}`;
    } else if (only.length >= 10 && only.length <= 15) {
      digits = `+${only}`;
    } else {
      throw new AppError(
        'VALIDATION_ERROR',
        'Enter a valid mobile number with country code.',
        400,
      );
    }
  }

  const body = digits.slice(1).replace(/\D/g, '');
  if (body.length < 10 || body.length > 15) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Enter a valid mobile number with country code.',
      400,
    );
  }

  return `+${body}`;
}

function assertOtpCode(code) {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Enter the 6-digit verification code.',
      400,
    );
  }
  return code.trim();
}

module.exports = { normalizePhone, assertOtpCode };
