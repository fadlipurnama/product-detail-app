import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/prisma/client.ts';

export function createPrismaClient(
  connectionString = process.env.DATABASE_URL,
  options = {},
) {
  if (!connectionString) {
    throw new Error('DATABASE_URL must be set to connect to PostgreSQL.');
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    ...options,
  });
}
