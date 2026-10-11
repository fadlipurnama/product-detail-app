import app from './app.js';
import config from './config/env.js';
import prisma from './config/prisma.js';

const server = app.listen(config.port, () => {
  console.log(`🚀 Server listening on http://localhost:${config.port}`);
  console.log(`📚 Swagger UI: http://localhost:${config.port}/api-docs`);
});

// ──────────────── Graceful shutdown ────────────────
async function shutdown(signal) {
  console.log(`\n⏳ Received ${signal}. Shutting down gracefully…`);

  server.close(async () => {
    console.log('🔌 HTTP server closed.');
    await prisma.$disconnect();
    console.log('🗄️  Prisma disconnected.');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
