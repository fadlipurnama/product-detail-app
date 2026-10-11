/**
 * Test setup: create the test database if it doesn't exist,
 * run Prisma migrations, and seed initial data.
 */
import { execSync } from 'child_process';
import pg from 'pg';

const TEST_DB = 'product_catalog_test';

function databaseUrl(databaseName) {
  const url = new URL(process.env.DATABASE_URL_TEST || process.env.DATABASE_URL);
  url.pathname = `/${databaseName}`;
  return url.toString();
}

/**
 * Create the test database (idempotent).
 * Connects to the default `product_catalog` database to issue CREATE DATABASE.
 */
export async function createTestDatabase() {
  const admin = new pg.Client({
    connectionString: databaseUrl('product_catalog'),
  });

  try {
    await admin.connect();
    await admin.query(`CREATE DATABASE "${TEST_DB}"`);
    console.log(`✅ Created test database "${TEST_DB}"`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`ℹ️  Test database "${TEST_DB}" already exists`);
    } else {
      throw err;
    }
  } finally {
    await admin.end();
  }
}

/**
 * Run Prisma migrations against the test database.
 */
export function runMigrations() {
  const testUrl = databaseUrl(TEST_DB);

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testUrl },
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}

/**
 * Clean all data from test tables (preserves schema).
 */
export async function cleanDatabase(prisma) {
  await prisma.$transaction([
    prisma.productImage.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.product.deleteMany(),
  ]);
}
