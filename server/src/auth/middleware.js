const { AppError } = require('../common/errors');
const { COOKIE_NAME, getUserForToken } = require('./service');

function readSessionToken(req) {
  const fromCookie = req.cookies?.[COOKIE_NAME];
  if (typeof fromCookie === 'string' && fromCookie.trim()) {
    return fromCookie.trim();
  }

  const header = req.headers.authorization;
  if (typeof header === 'string' && header.toLowerCase().startsWith('bearer ')) {
    return header.slice(7).trim();
  }

  return null;
}

function requireAuth(req, _res, next) {
  Promise.resolve()
    .then(async () => {
      const token = readSessionToken(req);
      const user = await getUserForToken(token);
      req.user = user;
      req.sessionToken = token;
      next();
    })
    .catch(next);
}

function optionalAuth(req, _res, next) {
  Promise.resolve()
    .then(async () => {
      const token = readSessionToken(req);
      if (!token) {
        next();
        return;
      }
      try {
        req.user = await getUserForToken(token);
        req.sessionToken = token;
      } catch (err) {
        if (!(err instanceof AppError && err.code === 'UNAUTHORIZED')) {
          throw err;
        }
      }
      next();
    })
    .catch(next);
}

module.exports = {
  readSessionToken,
  requireAuth,
  optionalAuth,
};
