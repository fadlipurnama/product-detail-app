# Backend Task List — Product Catalog API

Referensi: `api-prd.md` dan `architecture.md`.

## 1. Setup Proyek

- [ ] Inisialisasi Node.js project di `api-project`.
- [ ] Tetapkan Node.js LTS dan gunakan ESM atau CommonJS secara konsisten.
- [ ] Instal dependencies runtime: `express`, `@prisma/client`, `zod`, `swagger-jsdoc`, dan `swagger-ui-express`.
- [ ] Instal dependencies development: `prisma`, test runner (Vitest/Jest), `supertest`, dan linter/formatter bila digunakan.
- [ ] Buat struktur Layered MVC sesuai `architecture.md`.
- [ ] Buat `.env.example` berisi `NODE_ENV`, `PORT`, dan `DATABASE_URL`; jangan commit `.env`.
- [ ] Tambahkan script minimal: `dev`, `start`, `test`, `prisma:generate`, `prisma:migrate`, dan `prisma:seed`.

## 2. Database PostgreSQL dan Prisma

- [ ] Salin `.env.example` di root menjadi `.env`, isi `POSTGRES_PASSWORD` lokal, lalu jalankan `docker compose up -d postgres` dari root workspace.
- [ ] Pastikan `docker compose ps` menunjukkan PostgreSQL `healthy` sebelum menjalankan Prisma.
- [ ] Set `DATABASE_URL` backend ke `localhost` bila Node.js berjalan di host, atau ke hostname `postgres` bila backend berjalan dalam Compose.
- [ ] Siapkan database PostgreSQL khusus development.
- [ ] Buat `prisma/schema.prisma` dengan model `Product`, `ProductImage`, dan `ProductVariant`.
- [ ] Buat migration awal untuk tabel `products`, `product_images`, dan `product_variants`.
- [ ] Tambahkan foreign key `product_images.product_id` dan `product_variants.product_id` ke `products.id` dengan `ON DELETE CASCADE`.
- [ ] Tambahkan check constraint harga positif dan quantity integer 0–10.000.
- [ ] Tambahkan check constraint agar `color` atau `size` varian minimal salah satu terisi.
- [ ] Tambahkan unique constraint kombinasi product, color, dan size agar stok tidak ambigu.
- [ ] Tambahkan unique partial index agar maksimal satu gambar utama per produk.
- [ ] Tambahkan index pada foreign key dan `products.name`.
- [ ] Buat seed data Adjustable Chill Pillow dengan minimal satu foto utama serta varian Queen dan King.
- [ ] Uji migration pada database kosong dan jalankan seed data.
- [ ] Pastikan named volume PostgreSQL tidak dihapus saat pembersihan environment biasa.

## 3. Fondasi Aplikasi

- [ ] Pisahkan `src/app.js` (Express app) dari `src/server.js` (HTTP listener).
- [ ] Konfigurasikan `express.json({ limit: '100kb' })`.
- [ ] Tambahkan endpoint `GET /health`.
- [ ] Buat util response sukses untuk envelope `data`, `meta`, dan `links`.
- [ ] Buat util RFC 9457 Problem Details dengan `Content-Type: application/problem+json`.
- [ ] Implementasikan JSON parse error handler dan global error handler tanpa stack trace ke client.
- [ ] Implementasikan API route-not-found handler dalam format Problem Details.
- [ ] Tambahkan graceful shutdown: tutup HTTP server dan Prisma connection.

## 4. Repository, Service, dan Controller

- [ ] Buat `product.repository` untuk query Prisma tanpa `req`/`res`.
- [ ] Repository list: ambil produk, primary image, dan varian secara efisien.
- [ ] Repository detail: ambil satu produk dengan seluruh foto berurutan dan seluruh varian.
- [ ] Repository create: terima payload tervalidasi dan membuat product, images, dan variants.
- [ ] Buat `product.service` untuk use case list, detail, dan create.
- [ ] Bungkus create product dalam `prisma.$transaction`.
- [ ] Buat mapper database-to-response, termasuk serialisasi `BigInt` dan `Decimal` yang aman untuk JSON.
- [ ] Buat `product.controller` untuk menentukan status, header `Location`, dan envelope response.

## 5. Validasi dan Endpoint

- [ ] Buat Zod schema `CreateProductRequest` dengan whitelist field.
- [ ] Validasi `name`: trim, 2–120 karakter.
- [ ] Validasi `price`: angka positif dengan maksimal dua desimal.
- [ ] Validasi `description`: trim, 10–2.000 karakter.
- [ ] Validasi minimal satu foto HTTP(S), urutan foto unik, dan tepat satu foto utama.
- [ ] Validasi minimal satu varian; `color` atau `size` wajib; `quantity` integer 0–10.000.
- [ ] Validasi kombinasi color/size tidak duplikat pada payload.
- [ ] Buat middleware `require-json` untuk `POST /api/products` dan kembalikan `415` bila media type salah.
- [ ] Buat middleware validasi `:id` sebagai integer positif.
- [ ] Implementasikan `GET /api/products` dengan respons `200`.
- [ ] Implementasikan `GET /api/products/:id` dengan respons `200`, `400`, atau `404`.
- [ ] Implementasikan `POST /api/products` dengan respons `201` dan header `Location`.
- [ ] Pastikan GET tidak memakai atau memvalidasi request body.

## 6. Swagger / OpenAPI

- [ ] Konfigurasikan OpenAPI 3.1 dengan `swagger-jsdoc`.
- [ ] Sediakan Swagger UI pada `GET /api-docs`.
- [ ] Sediakan spesifikasi JSON pada `GET /openapi.json`.
- [ ] Dokumentasikan schema Product, ProductImage, ProductVariant, CreateProductRequest, success envelope, dan Problem Details.
- [ ] Dokumentasikan seluruh endpoint, parameter, request body, status response, dan contoh payload.
- [ ] Pastikan dokumentasi menyebut perbedaan `quantity` stok per varian dan quantity pembelian UI.

## 7. Testing dan Quality Gate

- [ ] Gunakan database test terpisah.
- [ ] Test `GET /health`.
- [ ] Test collection dan detail produk seed.
- [ ] Test ID invalid (`400`) dan product tidak ditemukan (`404`).
- [ ] Test POST valid menghasilkan `201`, `Location`, dan data yang dapat diambil kembali.
- [ ] Test setiap field wajib dan aturan nested images/variants.
- [ ] Test JSON malformed, content type salah (`415`), dan unknown field.
- [ ] Test transaction rollback: data nested invalid tidak boleh menciptakan product parsial.
- [ ] Test `application/problem+json` untuk error.
- [ ] Test `/openapi.json` dan `/api-docs` dapat diakses.
- [ ] Jalankan linter/formatter dan seluruh test sebelum handoff.

## Definition of Done

- [ ] Semua migration dan seed berjalan dari project kosong.
- [ ] Semua endpoint sesuai kontrak pada `api-prd.md`.
- [ ] Swagger mendokumentasikan API aktual.
- [ ] Semua test lulus dan tidak ada stack trace pada response error.
- [ ] README menjelaskan setup, environment, migration, seed, test, dan batasan database.
