/**
 * Unit checks that do not need PostgreSQL.
 * Run: node scripts/test-auth-unit.js
 */
const assert = require('assert');
const { normalizePhone, assertOtpCode } = require('../../src/auth/phone');
const { hashValue } = require('../../src/auth/otpProvider');

function throwsAppError(fn, code) {
  try {
    fn();
    assert.fail('expected throw');
  } catch (err) {
    assert.strictEqual(err.code, code);
  }
}

normalizePhone('9876543210');
assert.strictEqual(normalizePhone('9876543210'), '+919876543210');
assert.strictEqual(normalizePhone('+919876543210'), '+919876543210');
throwsAppError(() => normalizePhone('123'), 'VALIDATION_ERROR');
assert.strictEqual(assertOtpCode('123456'), '123456');
throwsAppError(() => assertOtpCode('12'), 'VALIDATION_ERROR');
assert.strictEqual(hashValue('000000').length, 64);

console.log('PASS auth unit checks');
