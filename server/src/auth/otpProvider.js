const crypto = require('crypto');
const { logger } = require('../common/logger');

function hashValue(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

function generateOtpCode() {
  const fixed = process.env.DEV_OTP_FIXED;
  if (
    fixed &&
    /^\d{6}$/.test(fixed) &&
    process.env.NODE_ENV !== 'production'
  ) {
    return fixed;
  }

  const n = crypto.randomInt(0, 1_000_000);
  return String(n).padStart(6, '0');
}

function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Mock OTP "delivery" — never used in production SMS.
 * Logs plaintext OTP only when NODE_ENV is not production.
 */
async function deliverOtp(phone, code) {
  if (process.env.NODE_ENV === 'production') {
    logger.error('Mock OTP provider must not run in production', { phone });
    throw new Error('OTP provider not configured for production');
  }

  logger.info('Mock OTP issued (development only)', {
    phone,
    // Intentional for local/dev mock only — never enable in production
    otp: code,
  });
}

module.exports = {
  hashValue,
  generateOtpCode,
  generateSessionToken,
  deliverOtp,
};
