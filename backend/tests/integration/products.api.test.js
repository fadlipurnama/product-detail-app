import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../../src/app.js';
import { createPrismaClient } from '../../src/config/create-prisma-client.js';
import { createTestDatabase, runMigrations, cleanDatabase } from '../helpers/setup.js';

const request = supertest(app);
let prisma;

// ──────────────── Setup / Teardown ────────────────

beforeAll(async () => {
  await createTestDatabase();
  runMigrations();

  prisma = createPrismaClient(
    process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
  );
  await prisma.$connect();
});

afterAll(async () => {
  await prisma?.$disconnect();
});

beforeEach(async () => {
  await cleanDatabase(prisma);
});

// ──────────────── Seed helper ────────────────

async function seedProduct() {
  return prisma.product.create({
    data: {
      name: 'Adjustable Chill Pillow',
      price: 89,
      currency: 'USD',
      description:
        'Adjustable cooling pillow with removable fill for a personalized loft. Features a cool-touch cover and customizable support layers for the perfect sleep experience.',
      images: {
        create: [
          {
            imageUrl: '/assets/images/leesa-bedding-adjustablechillpillow-01.jpg',
            altText: 'Adjustable Chill Pillow - Main',
            position: 0,
            isPrimary: true,
          },
          {
            imageUrl: '/assets/images/adjustable-chill-hand-press-still-02.jpg',
            altText: 'Adjustable Chill Pillow - Hand Press',
            position: 1,
            isPrimary: false,
          },
          ...['03', '04', '05', '06'].map((number, index) => ({
            imageUrl: `/assets/images/leesa-bedding-adjustablechillpillow-${number}.jpg`,
            altText: `Adjustable Chill Pillow - Image ${number}`,
            position: index + 2,
            isPrimary: false,
          })),
        ],
      },
      variants: {
        create: [
          { color: 'White', size: 'Queen', quantity: 10 },
          { color: 'White', size: 'King', quantity: 8 },
        ],
      },
    },
    include: { images: true, variants: true },
  });
}

const validPayload = {
  name: 'Cloud Support Pillow',
  price: 95,
  currency: 'USD',
  description:
    'Supportive adjustable pillow with a breathable, cool-touch cover for restful sleep.',
  images: [
    {
      imageUrl: 'https://cdn.example.com/products/cloud-support-pillow.jpg',
      altText: 'Cloud Support Pillow - Main',
      position: 0,
      isPrimary: true,
    },
  ],
  variants: [
    { color: 'White', size: 'Standard', quantity: 25 },
    { color: 'White', size: 'King', quantity: 15 },
  ],
};

// ──────────────── Tests ────────────────

describe('GET /health', () => {
  it('responds with 200 and status ok', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/products', () => {
  it('returns 200 with empty array when no products exist', async () => {
    const res = await request.get('/api/products');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta).toEqual({ total: 0 });
    expect(res.body.links).toEqual({ self: '/api/products' });
  });

  it('returns seed product with required fields', async () => {
    const seeded = await seedProduct();
    const res = await request.get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);

    const product = res.body.data[0];
    expect(product.id).toBe(String(seeded.id));
    expect(product.name).toBe('Adjustable Chill Pillow');
    expect(product.price).toBe(89);
    expect(product.currency).toBe('USD');
    expect(product.image).toMatch(/^https?:\/\/.+\/assets\/images\/leesa-bedding-adjustablechillpillow-01\.jpg$/);
    expect(product.variants).toHaveLength(2);
    expect(product.description).toBeDefined();
  });
});

describe('GET /api/products/:id', () => {
  it('returns 200 with product detail for valid ID', async () => {
    const seeded = await seedProduct();
    const res = await request.get(`/api/products/${seeded.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(String(seeded.id));
    expect(res.body.data.name).toBe('Adjustable Chill Pillow');
    expect(res.body.data.price).toBe(89);
    expect(res.body.data.images).toHaveLength(6);
    expect(res.body.data.images.map((image) => image.position)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(res.body.data.images.map((image) => image.url)).toEqual([
      expect.stringMatching(/\/assets\/images\/leesa-bedding-adjustablechillpillow-01\.jpg$/),
      expect.stringMatching(/\/assets\/images\/adjustable-chill-hand-press-still-02\.jpg$/),
      ...['03', '04', '05', '06'].map((number) =>
        expect.stringMatching(new RegExp(`/assets/images/leesa-bedding-adjustablechillpillow-${number}\\.jpg$`))),
    ]);
    expect(res.body.data.variants).toHaveLength(2);
    expect(res.body.links.self).toBe(`/api/products/${seeded.id}`);

    // Variants have Queen and King sizes
    const sizes = res.body.data.variants.map((v) => v.size);
    expect(sizes).toContain('Queen');
    expect(sizes).toContain('King');
  });

  it('returns 400 for non-integer ID', async () => {
    const res = await request.get('/api/products/abc');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.type).toContain('invalid-product-id');
  });

  it('returns 400 for negative ID', async () => {
    const res = await request.get('/api/products/-1');
    expect(res.status).toBe(400);
    expect(res.body.type).toContain('invalid-product-id');
  });

  it('returns 400 for zero ID', async () => {
    const res = await request.get('/api/products/0');
    expect(res.status).toBe(400);
    expect(res.body.type).toContain('invalid-product-id');
  });

  it('returns 400 for decimal ID', async () => {
    const res = await request.get('/api/products/1.5');
    expect(res.status).toBe(400);
    expect(res.body.type).toContain('invalid-product-id');
  });

  it('returns 404 for valid but non-existent ID', async () => {
    const res = await request.get('/api/products/999999');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.type).toContain('product-not-found');
  });
});

describe('POST /api/products', () => {
  it('creates a product and returns 201 with Location header', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.headers.location).toMatch(/^\/api\/products\/\d+$/);
    expect(res.body.data.name).toBe('Cloud Support Pillow');
    expect(res.body.data.price).toBe(95);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.variants).toHaveLength(2);
    expect(res.body.data.images).toHaveLength(1);
    expect(res.body.data.createdAt).toBeDefined();
  });

  it('created product can be retrieved via GET detail', async () => {
    const createRes = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(validPayload);

    const location = createRes.headers.location;
    const getRes = await request.get(location);

    expect(getRes.status).toBe(200);
    expect(getRes.body.data.name).toBe(validPayload.name);
    expect(getRes.body.data.price).toBe(validPayload.price);
  });

  // ── Required field validation ──

  it('rejects missing name', async () => {
    const { name, ...payload } = validPayload;
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('rejects missing price', async () => {
    const { price, ...payload } = validPayload;
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'price')).toBe(true);
  });

  it('rejects missing description', async () => {
    const { description, ...payload } = validPayload;
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'description')).toBe(true);
  });

  it('rejects missing images', async () => {
    const { images, ...payload } = validPayload;
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'images')).toBe(true);
  });

  it('rejects missing variants', async () => {
    const { variants, ...payload } = validPayload;
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'variants')).toBe(true);
  });

  // ── Field-level validation ──

  it('rejects zero price', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({ ...validPayload, price: 0 });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'price')).toBe(true);
  });

  it('rejects negative price', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({ ...validPayload, price: -10 });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'price')).toBe(true);
  });

  it('rejects price with more than 2 decimals', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({ ...validPayload, price: 10.999 });

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'price')).toBe(true);
  });

  it('rejects negative quantity', async () => {
    const payload = {
      ...validPayload,
      variants: [{ color: 'White', size: 'Queen', quantity: -1 }],
    };
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
  });

  it('rejects fractional quantity', async () => {
    const payload = {
      ...validPayload,
      variants: [{ color: 'White', size: 'Queen', quantity: 5.5 }],
    };
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
  });

  it('rejects non-HTTP(S) image URL', async () => {
    const payload = {
      ...validPayload,
      images: [
        { imageUrl: 'ftp://bad.example.com/img.jpg', position: 0, isPrimary: true },
      ],
    };
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
  });

  it('rejects description shorter than 10 chars', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({ ...validPayload, description: 'Too short' });

    expect(res.status).toBe(400);
  });

  // ── Nested rules ──

  it('rejects images with no primary', async () => {
    const payload = {
      ...validPayload,
      images: [
        { imageUrl: 'https://cdn.example.com/img.jpg', position: 0, isPrimary: false },
      ],
    };
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.message.includes('isPrimary'))).toBe(true);
  });

  it('rejects images with duplicate positions', async () => {
    const payload = {
      ...validPayload,
      images: [
        { imageUrl: 'https://cdn.example.com/a.jpg', position: 0, isPrimary: true },
        { imageUrl: 'https://cdn.example.com/b.jpg', position: 0, isPrimary: false },
      ],
    };
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
  });

  it('rejects variants with neither color nor size', async () => {
    const payload = {
      ...validPayload,
      variants: [{ quantity: 10 }],
    };
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
  });

  it('rejects duplicate variant combinations', async () => {
    const payload = {
      ...validPayload,
      variants: [
        { color: 'White', size: 'Queen', quantity: 10 },
        { color: 'White', size: 'Queen', quantity: 5 },
      ],
    };
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send(payload);

    expect(res.status).toBe(400);
  });

  // ── Content-Type and malformed JSON ──

  it('returns 415 when Content-Type is not JSON', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'text/plain')
      .send('not json');

    expect(res.status).toBe(415);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
  });

  it('returns 400 for malformed JSON body', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send('{invalid json}');

    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.type).toContain('invalid-json');
  });

  it('rejects unknown fields', async () => {
    const res = await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({ ...validPayload, foo: 'bar' });

    expect(res.status).toBe(400);
  });

  // ── Transaction rollback ──

  it('does not create partial product when variants are invalid at DB level', async () => {
    // Get initial count
    const beforeCount = await prisma.product.count();

    // Send invalid payload (missing required fields)
    await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({ ...validPayload, variants: [] });

    // Count should not change
    const afterCount = await prisma.product.count();
    expect(afterCount).toBe(beforeCount);
  });

  it('failed validation does not create any products', async () => {
    const beforeCount = await prisma.product.count();

    await request
      .post('/api/products')
      .set('Content-Type', 'application/json')
      .send({ name: 'x' });

    const afterCount = await prisma.product.count();
    expect(afterCount).toBe(beforeCount);
  });
});

describe('RFC 9457 Problem Details format', () => {
  it('error responses include all required Problem Details fields', async () => {
    const res = await request.get('/api/products/abc');
    expect(res.body).toHaveProperty('type');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('detail');
    expect(res.body).toHaveProperty('instance');
    expect(typeof res.body.status).toBe('number');
  });

  it('does not expose stack traces', async () => {
    const res = await request.get('/api/products/abc');
    expect(res.body).not.toHaveProperty('stack');
    expect(JSON.stringify(res.body)).not.toMatch(/at\s+\w+\s+\(/);
  });
});

describe('API documentation', () => {
  it('GET /openapi.json returns OpenAPI 3.1 spec', async () => {
    const res = await request.get('/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.1.0');
    expect(res.body.info.title).toBeDefined();
  });

  it('GET /api-docs returns HTML', async () => {
    const res = await request.get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });
});

describe('Route not found', () => {
  it('returns 404 Problem Details for unknown API routes', async () => {
    const res = await request.get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
    expect(res.body.type).toContain('route-not-found');
  });
});
