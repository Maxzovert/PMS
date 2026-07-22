require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(databaseUrl);
  const dbName = url.pathname.replace(/^\//, '');
  if (!dbName || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dbName)) {
    throw new Error(`Refusing to create unsafe database name: ${dbName}`);
  }

  url.pathname = '/postgres';
  const client = new Client({ connectionString: url.toString() });

  await client.connect();

  const existing = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName],
  );

  if (existing.rowCount === 0) {
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Created database: ${dbName}`);
  } else {
    console.log(`Database already exists: ${dbName}`);
  }

  await client.end();
}

main().catch((err) => {
  console.error('FAIL:', err.message);
  process.exit(1);
});
