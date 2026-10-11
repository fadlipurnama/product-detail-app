import { createPrismaClient } from './create-prisma-client.js';

const prisma = createPrismaClient(undefined, {
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
