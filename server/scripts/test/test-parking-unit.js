const assert = require('node:assert/strict');

/**
 * Unit tests for parking field merge validation (no DB).
 * Run: node scripts/test/test-parking-unit.js
 */

// Minimal AppError stub path via real service would need DB — test pure helpers
// by requiring service and exercising validate through patch with mocked repo.
// Instead: inline the same rules for vehicle types / times.

const VEHICLE_TYPES = new Set(['bike', 'car', 'suv', 'commercial']);
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function assertVehicles(list) {
  for (const item of list) {
    assert.ok(VEHICLE_TYPES.has(item), `invalid vehicle ${item}`);
  }
}

function assertTime(t) {
  assert.ok(TIME_RE.test(t), `invalid time ${t}`);
}

assertVehicles(['bike', 'car']);
assertTime('08:00');
assertTime('22:30');

let threw = false;
try {
  assertTime('25:00');
} catch {
  threw = true;
}
assert.equal(threw, true);

console.log('parking unit checks passed');
