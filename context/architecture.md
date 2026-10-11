# Architecture — Product Catalog API

## Keputusan Teknologi

| Area | Keputusan |
|---|---|
| Runtime | Node.js LTS |
| HTTP framework | Express.js 5 |
| Database | PostgreSQL 16+ |
| Database access | Prisma ORM + Prisma Migrate |
| Validasi request | Zod |
| Dokumentasi API | OpenAPI 3.1 + Swagger UI (`swagger-jsdoc`, `swagger-ui-express`) |
| Testing | Vitest/Jest + Supertest |
| Local database runtime | Docker Compose + `postgres:16-alpine` |
| API style | REST, JSON, success envelope, RFC 9457 Problem Details untuk error |
| Deployment unit | Stateless Node.js service + managed/self-hosted PostgreSQL |

## 1. Tujuan Arsitektur

Arsitektur ini mendukung API katalog produk: membaca seluruh produk, membaca detail produk, dan membuat produk baru. PostgreSQL menjadi source of truth sehingga data tetap ada setelah aplikasi direstart. Desain memisahkan HTTP concern, business logic, dan akses database agar mudah diuji dan repository dapat diganti tanpa mengubah controller.

Data minimum yang didukung adalah nama, harga, foto, variasi warna/ukuran, jumlah/stok, dan deskripsi.

## Diagram Arsitektur

```text
Client (Frontend / Postman)
          │ HTTPS + JSON
          ▼
Express API ────────────────────► Swagger UI (`/api-docs`)
  routes → middleware → controller → service → repository → Prisma ORM
                                                        │
                                                        ▼
                                                   PostgreSQL
```

| Component | Responsibility |
|---|---|
| Routes | Mendaftarkan method, URL, dan middleware endpoint. |
| Middleware | Parse JSON, validasi input, authentication bila diperlukan nanti, dan error handling. |
| Controller | Menerjemahkan request/response HTTP; tidak berisi query database. |
| Service | Use case, aturan bisnis, dan transaction boundary. |
| Repository | Query data melalui Prisma; tidak mengetahui `req` atau `res`. |
| PostgreSQL | Menyimpan data produk secara persisten dengan foreign key dan index. |

Dependency hanya boleh mengarah ke bawah: `route → controller → service → repository → database`. Repository tidak boleh dipanggil langsung dari route/controller.

## Swagger / OpenAPI Backend

Swagger UI harus tersedia pada `GET /api-docs` untuk eksplorasi dan uji API melalui browser. Dokumen OpenAPI JSON harus tersedia pada `GET /openapi.json` agar dapat diimpor ke Postman atau API client lain. Kedua endpoint dokumentasi tidak memakai prefix bisnis `/api`.

Dependencies:

```bash
npm install swagger-jsdoc swagger-ui-express
```

Konfigurasi minimal di `src/app.js`:

```js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const openapiSpec = swaggerJsdoc({
  definition: {
    openapi: '3.1.0',
    info: { title: 'Product Catalog API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000', description: 'Local development' }]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
});

app.get('/openapi.json', (_req, res) => res.json(openapiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
```

OpenAPI wajib mendefinisikan `GET /api/products`, `GET /api/products/{id}`, dan `POST /api/products`, termasuk request body, response `200`/`201`, Problem Details untuk `400`/`404`/`415`/`500`, dan schema `Product`, `ProductImage`, `ProductVariant`, serta `CreateProductRequest`. Test dokumentasi memastikan `/openapi.json` mengembalikan `openapi: 3.1.0` dan `/api-docs` dapat dibuka.

## 3. Struktur Direktori

```text
api-project/
├── package.json
├── .env.example
├── README.md
├── openapi.yaml
├── prisma/
│   ├── schema.prisma             # Prisma schema dan datasource PostgreSQL
│   ├── migrations/               # migration yang dibuat Prisma Migrate
│   └── seed.js                   # seed Adjustable Chill Pillow
├── src/
│   ├── server.js                 # HTTP listener dan graceful shutdown
│   ├── app.js                    # Express app dan global middleware
│   ├── config/
│   │   └── env.js                # validasi environment variables
│   ├── docs/
│   │   └── openapi.js            # factory swagger-jsdoc (opsional jika di app.js)
│   ├── routes/
│   │   └── product.routes.js
│   ├── controllers/
│   │   └── product.controller.js
│   ├── services/
│   │   └── product.service.js
│   ├── repositories/
│   │   └── product.repository.js
│   ├── validators/
│   │   └── product.validator.js  # Zod schema untuk POST body
│   ├── middlewares/
│   │   ├── validate-request.js
│   │   ├── require-json.js
│   │   ├── not-found.js
│   │   └── error-handler.js      # RFC 9457 Problem Details
│   └── utils/
│       ├── api-response.js
│       └── problem-details.js
└── tests/
    ├── integration/products.api.test.js
    └── unit/product.service.test.js
```

File `docker-compose.yml` berada di root workspace agar infrastruktur lokal dapat dipakai bersama oleh backend dan frontend. Compose ini hanya menjalankan PostgreSQL; Node.js backend dan frontend tetap dijalankan oleh workflow masing-masing.

## PostgreSQL dengan Docker Compose

### File dan environment

Gunakan `../docker-compose.yml` dari root workspace dan salin `../.env.example` menjadi `../.env`. Nilai `POSTGRES_PASSWORD` wajib diganti untuk setiap environment dan file `.env` tidak boleh di-commit.

| Variable | Default / contoh | Kegunaan |
|---|---|---|
| `POSTGRES_DB` | `product_catalog` | Nama database. |
| `POSTGRES_USER` | `app_user` | User aplikasi. |
| `POSTGRES_PASSWORD` | wajib diisi | Password lokal PostgreSQL. |
| `POSTGRES_PORT` | `5432` | Port host yang dipublikasikan Docker. |

Jalankan dari root workspace:

```bash
docker compose up -d postgres
docker compose ps
```

Database siap dipakai ketika health check bernilai `healthy`. Data disimpan pada named volume `product-catalog-postgres-data`, sehingga tetap ada ketika container dihentikan/dibuat ulang. Jangan gunakan `docker compose down -v` kecuali memang ingin menghapus seluruh data database lokal.

### Connection string backend

Backend berjalan di host memakai URL berikut pada `api-project/.env`:

```dotenv
DATABASE_URL="postgresql://app_user:YOUR_POSTGRES_PASSWORD@localhost:5432/product_catalog?schema=public"
```

Apabila backend kelak ikut dijalankan sebagai service Compose, hostname database harus diganti dari `localhost` menjadi `postgres`:

```dotenv
DATABASE_URL="postgresql://app_user:YOUR_POSTGRES_PASSWORD@postgres:5432/product_catalog?schema=public"
```

Setelah database sehat, backend menjalankan `prisma migrate deploy` (atau `prisma migrate dev` di development), lalu `prisma db seed` untuk seed data. Frontend tidak boleh dan tidak perlu membuat koneksi PostgreSQL; frontend hanya memanggil Express API, misalnya `http://localhost:3000/api`.

## Model Data

### Relasi

```text
products 1 ─────< product_images
    │
    └─────< product_variants
```

- **products** menyimpan informasi inti produk.
- **product_images** menyimpan satu atau lebih URL foto; satu gambar ditandai sebagai foto utama.
- **product_variants** menyimpan kombinasi variasi. `color` dan `size` dapat kosong secara individual, tetapi salah satunya wajib ada. `quantity` adalah stok untuk kombinasi tersebut.

Contoh: Queen/White dan King/White merupakan dua row `product_variants` dengan stok masing-masing, bukan satu stok global.

### Tabel Product (`products`)

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | `BIGINT` | PK, identity | ID server-generated. |
| `name` | `VARCHAR(120)` | NOT NULL | Nama produk. |
| `price` | `NUMERIC(12,2)` | `> 0` | Harga, bukan float. |
| `currency` | `CHAR(3)` | ISO uppercase | Default `USD`. |
| `description` | `TEXT` | 10-2.000 karakter | Deskripsi produk. |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | NOT NULL | Audit waktu UTC. |

### Tabel product_variants

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | `BIGINT` | PK, identity | ID varian. |
| `product_id` | `BIGINT` | FK ke `products.id` | Pemilik varian. |
| `color` | `VARCHAR(50)` | Nullable | Warna varian. |
| `size` | `VARCHAR(50)` | Nullable | Ukuran varian. |
| `quantity` | `INTEGER` | 0-10.000 | Stok kombinasi varian. |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | NOT NULL | Audit waktu UTC. |

Minimal salah satu `color` atau `size` wajib terisi. Kombinasi warna dan ukuran untuk produk yang sama tidak boleh duplikat.

### Tabel `product_images`

| Kolom | Tipe | Aturan | Keterangan |
|---|---|---|---|
| `id` | `BIGINT` | PK, identity | ID foto. |
| `product_id` | `BIGINT` | FK ke `products.id` | Pemilik foto. |
| `image_url` | `TEXT` | URL HTTP(S) | URL foto produk. |
| `alt_text` | `VARCHAR(255)` | Optional | Teks alternatif gambar. |
| `position` | `SMALLINT` | `>= 0`, unique per produk | Urutan galeri. |
| `is_primary` | `BOOLEAN` | Satu per produk | Menentukan foto utama API. |

## Schema SQL Awal

```sql
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
  currency CHAR(3) NOT NULL DEFAULT 'USD'
    CHECK (currency ~ '^[A-Z]{3}$'),
  description TEXT NOT NULL CHECK (char_length(trim(description)) BETWEEN 10 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_images (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL CHECK (image_url ~ '^https?://'),
  alt_text VARCHAR(255),
  position SMALLINT NOT NULL DEFAULT 0 CHECK (position >= 0),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, position)
);

CREATE UNIQUE INDEX product_images_one_primary_per_product
  ON product_images (product_id)
  WHERE is_primary = TRUE;

CREATE TABLE product_variants (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color VARCHAR(50),
  size VARCHAR(50),
  quantity INTEGER NOT NULL CHECK (quantity >= 0 AND quantity <= 10000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (color IS NOT NULL OR size IS NOT NULL),
  UNIQUE NULLS NOT DISTINCT (product_id, color, size)
);

CREATE INDEX product_images_product_id_idx ON product_images(product_id);
CREATE INDEX product_variants_product_id_idx ON product_variants(product_id);
CREATE INDEX products_name_idx ON products(name);
```

`UNIQUE NULLS NOT DISTINCT` tersedia di PostgreSQL 15+. Jika menggunakan PostgreSQL 14 atau lebih lama, gunakan expression unique index dengan `COALESCE(color, '')` dan `COALESCE(size, '')` untuk mencegah kombinasi variasi yang sama.

### Prisma schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          BigInt           @id @default(autoincrement())
  name        String           @db.VarChar(120)
  price       Decimal          @db.Decimal(12, 2)
  currency    String           @default("USD") @db.Char(3)
  description String           @db.Text
  images      ProductImage[]
  variants    ProductVariant[]
  createdAt   DateTime         @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime         @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@map("products")
  @@index([name], map: "products_name_idx")
}

model ProductImage {
  id        BigInt   @id @default(autoincrement())
  productId BigInt   @map("product_id")
  imageUrl  String   @map("image_url") @db.Text
  altText   String?  @map("alt_text") @db.VarChar(255)
  position  Int      @default(0) @db.SmallInt
  isPrimary Boolean  @default(false) @map("is_primary")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, position])
  @@index([productId], map: "product_images_product_id_idx")
  @@map("product_images")
}

model ProductVariant {
  id        BigInt   @id @default(autoincrement())
  productId BigInt   @map("product_id")
  color     String?  @db.VarChar(50)
  size      String?  @db.VarChar(50)
  quantity  Int
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId], map: "product_variants_product_id_idx")
  @@map("product_variants")
}
```

Catatan: constraint `CHECK`, partial unique index gambar utama, dan unique combination yang memperlakukan `NULL` secara sama perlu ditambahkan melalui migration SQL kustom Prisma karena tidak seluruhnya diekspresikan oleh Prisma schema.

## Pemetaan Database ke Response API

| Field API | Tabel / Kolom |
|---|---|
| `id`, `name`, `price`, `currency`, `description` | `products` |
| `image` | `product_images.image_url` dengan `is_primary = true` |
| `images` | Semua `product_images`, diurutkan `position ASC` |
| `variants[].color`, `variants[].size`, `variants[].quantity` | `product_variants` |

Untuk PostgreSQL, detail produk sebaiknya dikembalikan sebagai satu Product dengan array `images` dan array `variants`. Repository menggunakan Prisma `include` dan menentukan pengurutan `images` berdasarkan `position`.

Contoh hasil pemetaan response detail:

```json
{
  "data": {
    "id": "1",
    "name": "Adjustable Chill Pillow",
    "price": 89.0,
    "currency": "USD",
    "description": "Adjustable cooling pillow with removable fill.",
    "image": "https://cdn.example.com/pillow-main.jpg",
    "images": [
      { "url": "https://cdn.example.com/pillow-main.jpg", "alt": "Adjustable Chill Pillow", "position": 0 }
    ],
    "variants": [
      { "id": "1", "color": "White", "size": "Queen", "quantity": 10 },
      { "id": "2", "color": "White", "size": "King", "quantity": 8 }
    ],
    "createdAt": "2026-10-08T00:00:00.000Z",
    "updatedAt": "2026-10-08T00:00:00.000Z"
  },
  "links": { "self": "/api/products/1" }
}
```

Prisma `BigInt` harus dikonversi ke string sebelum dikirim sebagai JSON. Nilai `Decimal` harga harus dikonversi secara eksplisit ke JSON number (setelah memastikan presisi dua desimal) atau string decimal; kontrak API ini memilih JSON number.

## Alur Setiap Operasi

### GET `/api/products`

```text
Route -> Controller -> Service -> Repository
  -> Prisma membaca products + primary image + variants
  -> mapper membentuk response collection
  -> 200 { data, meta, links }
```

### GET `/api/products/:id`

```text
Route -> validate-id -> Controller -> Service -> Repository
  -> Prisma mencari product, images (urut position), dan variants
  -> ditemukan: 200 { data, links }
  -> tidak ditemukan: 404 application/problem+json
```

### POST `/api/products`

```text
POST /api/products
  → require-json
  → validate-request (Zod)
  → ProductController.create
  → ProductService.create
  → prisma.$transaction(
       product create,
       product_images createMany,
       product_variants createMany
    )
  → 201 Created + Location header
```

Pembuatan produk, foto, dan varian wajib berada dalam satu database transaction. Bila satu foto atau variasi gagal, seluruh produk harus di-rollback sehingga tidak ada data parsial.

## Aturan Validasi dan Pertahanan Data

- `name`: wajib, setelah trim 2–120 karakter.
- `price`: wajib, decimal positif dengan maksimal dua desimal; gunakan `Decimal`, bukan JavaScript `float`, saat menyimpan harga.
- `description`: wajib, setelah trim 10–2.000 karakter.
- Foto: minimal satu `imageUrl` absolut dengan skema `https://` atau `http://`; tepat satu foto utama.
- Varian: minimal satu row; setiap row memiliki `size` atau `color`; `quantity` integer 0–10.000.
- Kombinasi `(productId, color, size)` harus unik agar stok tidak ambigu.
- Validasi request dilakukan oleh Zod, lalu database constraints menjadi pertahanan kedua.
- Input URL hanya disimpan sebagai URL; API belum menerima upload file.

## 8. Konfigurasi dan Keamanan

`.env` tidak boleh masuk repository. Sediakan `.env.example` berikut:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://app_user:change-me@localhost:5432/product_catalog?schema=public"
```

- Gunakan user PostgreSQL khusus aplikasi dengan privilege minimum, bukan superuser.
- Pada production, gunakan koneksi TLS dan secret manager untuk `DATABASE_URL`.
- Batasi body JSON (misalnya 100 KB), aktifkan rate limit sebelum production, dan jangan kirim detail error database ke client.
- Jalankan migration melalui pipeline/deployment (`prisma migrate deploy`), bukan otomatis setiap aplikasi start.

## 9. Operasional dan Testing

- `prisma migrate dev --name init_product_catalog` untuk development migration awal.
- `prisma db seed` untuk membuat data Adjustable Chill Pillow.
- Gunakan database test terpisah; test tidak boleh memakai database development/production.
- Integration test harus mencakup sukses create, rollback jika nested data invalid, detail dengan foto/varian, ID tidak ditemukan, dan validasi request.
- Tambahkan health check `GET /health` yang hanya memverifikasi aplikasi hidup; readiness check dapat memverifikasi koneksi database bila dibutuhkan deployment platform.

## 10. Batasan Saat Ini dan Evolusi

Desain ini belum mencakup kategori, diskon, user/admin, order, upload binary, atau reservasi stok ketika checkout. Saat katalog bertambah, pagination dan search dapat ditambahkan pada endpoint collection. Saat checkout dibangun, pengurangan stok harus memakai transaction dan concurrency control; jangan cukup melakukan read lalu write biasa.
