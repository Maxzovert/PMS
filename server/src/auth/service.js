const { AppError } = require('../common/errors');
const { logger } = require('../common/logger');
const { normalizePhone, assertOtpCode } = require('./phone');
const {
  hashValue,
  generateOtpCode,
  generateSessionToken,
  deliverOtp,
} = require('./otpProvider');
const repo = require('./repository');

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const OTP_HOURLY_LIMIT = 5;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const COOKIE_NAME = 'parkar_session';

function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: SESSION_TTL_MS,
  };
}

async function requestOtp(rawPhone) {
  const phone = normalizePhone(rawPhone);

  const latest = await repo.getLatestOtpCreatedAt(phone);
  if (latest) {
    const elapsed = Date.now() - new Date(latest).getTime();
    if (elapsed < OTP_COOLDOWN_MS) {
      throw new AppError(
        'OTP_RATE_LIMITED',
        'Please wait a minute before requesting another code.',
        429,
      );
    }
  }

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const hourlyCount = await repo.countRecentOtpRequests(phone, hourAgo);
  if (hourlyCount >= OTP_HOURLY_LIMIT) {
    throw new AppError(
      'OTP_RATE_LIMITED',
      'Too many OTP requests. Try again later.',
      429,
    );
  }

  const code = generateOtpCode();
  const codeHash = hashValue(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await repo.invalidateOpenChallenges(phone);
  await repo.insertOtpChallenge({ phone, codeHash, expiresAt });
  await deliverOtp(phone, code);

  logger.info('OTP requested', { phone });

  return {
    phone,
    expiresInSeconds: Math.floor(OTP_TTL_MS / 1000),
  };
}

async function verifyOtp(rawPhone, rawCode, meta = {}) {
  const phone = normalizePhone(rawPhone);
  const code = assertOtpCode(rawCode);

  const challenge = await repo.findActiveChallenge(phone);
  if (!challenge) {
    throw new AppError(
      'OTP_EXPIRED',
      'The verification code has expired. Request a new one.',
      401,
    );
  }

  if (challenge.attempts >= challenge.max_attempts) {
    throw new AppError(
      'OTP_ATTEMPTS_EXCEEDED',
      'Too many incorrect attempts. Request a new code.',
      401,
    );
  }

  const incomingHash = hashValue(code);
  if (incomingHash !== challenge.code_hash) {
    const updated = await repo.incrementChallengeAttempts(challenge.id);
    if (updated.attempts >= updated.max_attempts) {
      throw new AppError(
        'OTP_ATTEMPTS_EXCEEDED',
        'Too many incorrect attempts. Request a new code.',
        401,
      );
    }
    logger.info('OTP verify failed', { phone });
    throw new AppError(
      'OTP_INVALID',
      'That verification code is incorrect.',
      401,
    );
  }

  await repo.consumeChallenge(challenge.id);

  let user = await repo.findUserByPhone(phone);
  if (!user) {
    user = await repo.createUser(phone);
  }

  if (user.status === 'suspended') {
    throw new AppError(
      'ACCOUNT_SUSPENDED',
      'This account is suspended. Contact support.',
      403,
    );
  }

  const rawToken = generateSessionToken();
  const tokenHash = hashValue(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await repo.insertSession({
    userId: user.id,
    tokenHash,
    expiresAt,
    userAgent: meta.userAgent,
    ip: meta.ip,
  });

  logger.info('OTP verified; session created', {
    phone,
    userId: user.id,
  });

  return {
    token: rawToken,
    user: repo.publicUser(user),
  };
}

async function getUserForToken(rawToken) {
  if (!rawToken) {
    throw new AppError('UNAUTHORIZED', 'Please sign in to continue.', 401);
  }

  const row = await repo.findSessionByToken(rawToken);
  if (!row || row.revoked_at) {
    throw new AppError('UNAUTHORIZED', 'Please sign in to continue.', 401);
  }

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    throw new AppError('UNAUTHORIZED', 'Your session has expired. Sign in again.', 401);
  }

  if (row.status === 'suspended') {
    throw new AppError(
      'ACCOUNT_SUSPENDED',
      'This account is suspended. Contact support.',
      403,
    );
  }

  return repo.publicUser(row);
}

async function logout(rawToken) {
  if (rawToken) {
    await repo.revokeSessionByToken(rawToken);
    logger.info('Session revoked');
  }
}

module.exports = {
  COOKIE_NAME,
  cookieOptions,
  requestOtp,
  verifyOtp,
  getUserForToken,
  logout,
};
