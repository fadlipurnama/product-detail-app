# Product Catalog REST API

REST API untuk katalog produk — mendukung listing, detail, dan pembuatan produk dengan gambar dan varian. Dibangun dengan Node.js, Express, Prisma ORM, dan PostgreSQL (Docker).

## Teknologi

| Area | Stack |
|------|-------|
| Runtime | Node.js LTS (ESM) |
| HTTP Framework | Express.js |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma |
| Validasi | Zod |
| Dokumentasi API | OpenAPI 3.1 + Swagger UI |
| Testing | Vitest + Supertest |

## Setup

### 1. Prerequisites

- Node.js >= 20.19
- Docker & Docker Compose

### 2. Environment

```bash
# Salin dan sesuaikan environment variables
cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD
```

### 3. Start PostgreSQL

```bash
docker compose up -d postgres
docker compose ps   # pastikan status "healthy"
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Database Migration & Seed

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

`prisma.config.ts` loads `DATABASE_URL` for Prisma CLI operations. The Prisma Client
uses the PostgreSQL driver adapter (`@prisma/adapter-pg`) and the generated client
under `prisma/generated/`.

### 6. Run Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server berjalan di `http://localhost:3000` (default).

## API Endpoints

| Method | Path | Deskripsi |
|--------|------|-----------|
| `GET` | `/health` | Health check |
| `GET` | `/api/products` | List semua produk |
| `GET` | `/api/products/:id` | Detail produk |
| `POST` | `/api/products` | Buat produk baru |
| `GET` | `/assets/images/:filename` | File gambar produk lokal |
| `GET` | `/api-docs` | Swagger UI |
| `GET` | `/openapi.json` | OpenAPI spec JSON |

Gambar produk seed disimpan di `assets/images/` dan diakses melalui `/assets/images/...`.
Setelah memperbarui seed, jalankan `npm run prisma:seed` agar URL dan urutan gambar produk
di database diperbarui. Saat development, Vite meneruskan request `/assets` ke backend API.

## Testing

Test menggunakan database terpisah (`product_catalog_test`).

```bash
npm test
```

## Arsitektur

Layered MVC: `Route → Controller → Service → Repository → Prisma → PostgreSQL`

```
src/
├── app.js                    # Express app + middleware
├── server.js                 # HTTP listener + graceful shutdown
├── config/
│   ├── env.js                # Environment config
│   └── prisma.js             # Prisma client singleton
├── routes/                   # Endpoint definitions + OpenAPI JSDoc
├── controllers/              # HTTP translation (status, headers)
├── services/                 # Use cases + business logic
├── repositories/             # Prisma queries
├── validators/               # Zod schemas
├── middlewares/               # require-json, validate-id, error-handler, etc.
├── docs/                     # OpenAPI/Swagger config
└── utils/                    # Response helpers + mapper
```

## Batasan Database

- Data disimpan di PostgreSQL via Docker. Named volume `product-catalog-postgres-data` memastikan data persisten.
- **Jangan** gunakan `docker compose down -v` kecuali ingin menghapus semua data.
- Foreign key dengan `ON DELETE CASCADE` — menghapus produk otomatis menghapus gambar dan varian terkait.
- `quantity` di varian adalah stok per kombinasi warna/ukuran, bukan jumlah pembelian UI.

## Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Development server dengan auto-reload |
| `npm start` | Production server |
| `npm test` | Jalankan semua test |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Jalankan migration |
| `npm run prisma:seed` | Seed data awal |
