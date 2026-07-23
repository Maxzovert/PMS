/**
 * Auth API smoke tests. Requires PostgreSQL + applied sql/002 + sql/003.
 * Uses DEV_OTP_FIXED from env (default 000000 for this script).
 *
 * Run: npm test
 */
require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (!process.env.DEV_OTP_FIXED) {
  process.env.DEV_OTP_FIXED = '000000';
}

const { createApp } = require('../../src/app');
const { initDatabase, closeDatabase, getDatabaseStatus } = require('../../src/database');

function extractSessionCookie(response) {
  const cookies =
    typeof response.headers.getSetCookie === 'function'
      ? response.headers.getSetCookie()
      : [];
  const line = cookies.find((c) => c.startsWith('parkar_session='));
  if (!line) {
    return null;
  }
  return line.split(';')[0];
}

async function jsonFetch(base, path, { method = 'GET', body, cookie } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json();
  return { response, payload, cookie: extractSessionCookie(response) };
}

async function main() {
  await initDatabase();
  const status = getDatabaseStatus();
  if (!status.connected) {
    console.error('SKIP: database not connected — start Postgres and run npm run db:sql');
    process.exit(0);
  }

  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  const phone = `+9198${String(Date.now()).slice(-8)}`;
  const code = process.env.DEV_OTP_FIXED;

  let failed = 0;

  function assert(name, condition) {
    if (condition) {
      console.log(`PASS ${name}`);
    } else {
      console.error(`FAIL ${name}`);
      failed += 1;
    }
  }

  try {
    const wrong = await jsonFetch(base, '/auth/verify-otp', {
      method: 'POST',
      body: { phone, code: '111111' },
    });
    assert(
      'verify without request fails',
      wrong.payload.success === false &&
        (wrong.payload.error?.code === 'OTP_EXPIRED' ||
          wrong.payload.error?.code === 'OTP_INVALID'),
    );

    const requested = await jsonFetch(base, '/auth/request-otp', {
      method: 'POST',
      body: { phone },
    });
    assert('request-otp succeeds', requested.payload.success === true);

    const badCode = await jsonFetch(base, '/auth/verify-otp', {
      method: 'POST',
      body: { phone, code: '111111' },
    });
    assert(
      'wrong OTP rejected',
      badCode.payload.success === false &&
        badCode.payload.error?.code === 'OTP_INVALID',
    );

    const verified = await jsonFetch(base, '/auth/verify-otp', {
      method: 'POST',
      body: { phone, code },
    });
    assert('verify-otp succeeds', verified.payload.success === true);
    assert('session cookie set', Boolean(verified.cookie));

    const me = await jsonFetch(base, '/auth/me', { cookie: verified.cookie });
    assert('GET /auth/me succeeds', me.payload.success === true);
    assert('me returns phone', me.payload.data?.user?.phone === phone);

    const loggedOut = await jsonFetch(base, '/auth/logout', {
      method: 'POST',
      body: {},
      cookie: verified.cookie,
    });
    assert('logout succeeds', loggedOut.payload.success === true);

    const meAfter = await jsonFetch(base, '/auth/me', {
      cookie: verified.cookie,
    });
    assert(
      'me after logout unauthorized',
      meAfter.payload.success === false &&
        meAfter.payload.error?.code === 'UNAUTHORIZED',
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await closeDatabase();
  }

  if (failed > 0) {
    process.exit(1);
  }

  console.log('All auth tests passed');
}

main().catch((err) => {
  console.error('FAIL:', err.message || err);
  process.exit(1);
});
