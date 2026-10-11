import express from 'express';
import { fileURLToPath } from 'node:url';
import swaggerUi from 'swagger-ui-express';
import openapiSpec from './docs/swagger.js';
import productRoutes from './routes/product.routes.js';
import { notFound } from './middlewares/not-found.js';
import { errorHandler } from './middlewares/error-handler.js';

const app = express();

// ──────────────── Global middleware ────────────────
app.use(express.json({ limit: '100kb' }));
app.use('/assets', express.static(fileURLToPath(new URL('../assets', import.meta.url))));

// ──────────────── Health check ────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ──────────────── Swagger / OpenAPI docs ────────────────
app.get('/openapi.json', (_req, res) => res.json(openapiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// ──────────────── API routes ────────────────
app.use('/api/products', productRoutes);

// ──────────────── Error handling ────────────────
// Unknown API routes → 404 Problem Details (instead of HTML)
app.use('/api', notFound);

// JSON parse errors + unexpected errors → Problem Details
app.use(errorHandler);

export default app;
