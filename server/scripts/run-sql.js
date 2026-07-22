/**
 * Runs .sql files from disk against PostgreSQL.
 * SQL text lives in server/sql/*.sql — not embedded as query strings here.
 *
 * Usage:
 *   node scripts/run-sql.js                         # all sql/0xx except 000_
 *   node scripts/run-sql.js sql/001_init_notes.sql
 *   node scripts/run-sql.js sql/000_create_database.sql --admin
 */
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const serverRoot = path.join(__dirname, '..');
const sqlRoot = path.join(serverRoot, 'sql');

function resolveSqlPath(inputPath) {
  if (!inputPath) {
    return null;
  }
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  const fromCwd = path.resolve(process.cwd(), inputPath);
  if (fs.existsSync(fromCwd)) {
    return fromCwd;
  }
  return path.join(serverRoot, inputPath);
}

function listDefaultScripts() {
  return fs
    .readdirSync(sqlRoot)
    .filter((name) => /^\d{3}_.+\.sql$/i.test(name))
    .filter((name) => !name.startsWith('000_'))
    .sort()
    .map((name) => path.join(sqlRoot, name));
}

function buildAdminUrl(databaseUrl) {
  const url = new URL(databaseUrl);
  url.pathname = '/postgres';
  return url.toString();
}

async function runFile(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  if (!sql.trim()) {
    console.log(`Skip empty: ${path.relative(serverRoot, filePath)}`);
    return;
  }

  console.log(`Running: ${path.relative(serverRoot, filePath)}`);
  await client.query(sql);
  console.log(`OK: ${path.basename(filePath)}`);
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--admin');
  const isAdmin = process.argv.includes('--admin');
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !databaseUrl.trim()) {
    throw new Error('DATABASE_URL is not set in server/.env');
  }

  const files = args.length > 0
    ? args.map(resolveSqlPath)
    : listDefaultScripts();

  if (files.length === 0) {
    console.log('No SQL files to run.');
    return;
  }

  for (const filePath of files) {
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`SQL file not found: ${filePath || '(empty)'}`);
    }
    if (!filePath.toLowerCase().endsWith('.sql')) {
      throw new Error(`Not a .sql file: ${filePath}`);
    }
  }

  const connectionString = isAdmin
    ? buildAdminUrl(databaseUrl)
    : databaseUrl.trim();

  const client = new Client({ connectionString });
  await client.connect();

  try {
    for (const filePath of files) {
      await runFile(client, filePath);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('FAIL:', err.message);
  process.exit(1);
});
