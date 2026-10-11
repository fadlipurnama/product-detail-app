import 'dotenv/config';
import { defineConfig } from 'vitest/config';

const testDatabaseUrl = new URL(
  process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
);
testDatabaseUrl.pathname = '/product_catalog_test';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 30_000,
    env: {
      DATABASE_URL: testDatabaseUrl.toString(),
      NODE_ENV: 'test',
    },
  },
});
