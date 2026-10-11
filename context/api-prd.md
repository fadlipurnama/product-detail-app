# Product Requirements Document — Product Catalog REST API

| Field | Detail |
|---|---|
| Product | API katalog dan detail produk untuk halaman **Adjustable Chill Pillow** |
| Version | 1.0 |
| Date | 8 Oktober 2026 |
| Technology | Node.js, Express.js, JSON in-memory |
| Base URL | `/api` |

## 1. Ringkasan

Frontend saat ini menyimpan seluruh informasi produk di `project-AI/data.js`. API ini menyediakan sumber data HTTP yang terstruktur agar halaman detail produk dapat mengambil daftar produk, detail satu produk, dan agar admin/developer dapat menambahkan produk baru. Pada tahap exercise ini data disimpan di memori server (hard-coded seed data); database dan autentikasi tidak termasuk ruang lingkup.

Produk seed pertama merepresentasikan **Leesa Adjustable Chill Pillow**: harga promo USD 89, pilihan ukuran Queen dan King, gambar, deskripsi, serta stok/kuantitas yang tersedia.

## 2. Latar Belakang dan Problem Statement

Data lokal bekerja untuk prototipe satu halaman, tetapi tidak dapat dipakai ulang oleh halaman katalog atau dikelola melalui antarmuka HTTP. Konsumen API membutuhkan cara yang konsisten untuk:

- mengambil daftar produk untuk katalog;
- mengambil detail produk dari ID untuk halaman detail;
- menambah produk dengan data lengkap dan aman divalidasi sebelum tersimpan.

**Pernyataan masalah:** bagaimana menyediakan REST API Express yang sederhana, dapat diprediksi, dan tervalidasi sehingga data produk yang saat ini ada di frontend dapat dikonsumsi melalui HTTP tanpa menerima payload produk yang tidak valid?

## 3. Goals dan Non-goals

### Goals

- Menyediakan endpoint `GET` untuk seluruh produk dan sebuah produk berdasarkan ID.
- Menyediakan endpoint `POST` untuk menambahkan produk baru.
- Memvalidasi dan menormalisasi setiap field request body pada `POST` sebelum mutasi data.
- Mengembalikan respons JSON, status HTTP, dan struktur error yang konsisten.
- Menggunakan format respons sukses yang konsisten dan RFC 9457 Problem Details untuk error.
- Memenuhi field minimum pedoman exercise: nama, harga, foto, variasi ukuran/warna, kuantitas, dan deskripsi.
- Menjadikan kontrak API cukup jelas untuk diintegrasikan ke halaman detail produk pada fase berikutnya.

### Non-goals

- Database, persistensi setelah server restart, upload file gambar, dan pagination.
- Autentikasi/otorisasi, keranjang, checkout, pembayaran, atau manajemen inventori transaksional.
- Endpoint `PUT`, `PATCH`, dan `DELETE`.
- Mengubah `project-AI` dari data lokal ke API pada deliverable ini.
- Meniru seluruh objek UI frontend (navigasi, footer, FAQ, dan social proof) sebagai kontrak wajib API.

## 4. Pengguna dan User Stories

| ID | User story |
|---|---|
| US-01 | Sebagai pengunjung katalog, saya ingin mengambil semua produk agar dapat melihat pilihan produk yang tersedia. |
| US-02 | Sebagai calon pembeli, saya ingin mengambil detail produk dari ID agar halaman detail menampilkan nama, harga, foto, variasi, stok, dan deskripsi yang tepat. |
| US-03 | Sebagai admin/developer, saya ingin menambahkan produk melalui API agar katalog dapat diperluas tanpa mengubah kode frontend. |
| US-04 | Sebagai consumer API, saya ingin menerima pesan error per field agar dapat memperbaiki payload yang ditolak. |
| US-05 | Sebagai developer frontend, saya ingin kontrak respons yang stabil agar data API dapat dipetakan ke UI secara aman. |

## 5. Ruang Lingkup Fungsional

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Server Express mengekspos JSON API pada prefix `/api`. | Must |
| FR-02 | `GET /api/products` mengembalikan seluruh produk yang tersedia. | Must |
| FR-03 | `GET /api/products/:id` mengembalikan satu produk dari ID numerik positif. | Must |
| FR-04 | `POST /api/products` menambahkan satu produk baru ke koleksi in-memory. | Must |
| FR-05 | Middleware JSON dan middleware validasi berjalan sebelum handler `POST`. | Must |
| FR-06 | Respons berhasil dan gagal menggunakan format yang terdokumentasi. | Must |
| FR-07 | Data awal mencakup Adjustable Chill Pillow beserta ukuran Queen dan King. | Must |

## 6. Kontrak Data / Schema

### 6.0 Standar format API

API memakai JSON melalui `Content-Type: application/json; charset=utf-8`, URL berbasis resource (`/api/products`), HTTP status code yang semantik, serta timestamp ISO-8601 dalam UTC. Kontrak harus didokumentasikan dalam OpenAPI 3.1 setelah implementasi agar dapat diuji dan dikonsumsi secara konsisten.

**Respons sukses** memakai envelope berikut. `meta` dan `links` wajib untuk collection, opsional untuk single resource.

```json
{
  "data": {},
  "meta": {},
  "links": {}
}
```

**Respons error** mengikuti [RFC 9457 Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457), dengan `Content-Type: application/problem+json`. `errors` memperluas format standar untuk menyampaikan error per field validasi.

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Request validation failed",
  "status": 400,
  "detail": "One or more fields are invalid.",
  "instance": "/api/products",
  "errors": [
    { "field": "price", "message": "must be a positive number with at most 2 decimal places" }
  ]
}
```

Aturan tambahan:

- Key JSON menggunakan `camelCase`; angka dikirim sebagai JSON number, bukan string.
- Jangan mengirim field `null` jika nilai belum tersedia; omit field opsional tersebut.
- Tidak mengembalikan stack trace, detail database, atau pesan error internal ke client.
- Endpoint collection saat ini belum dipaginasi. Ketika pagination ditambahkan, gunakan query `page` dan `limit`, lalu isi `meta.page`, `meta.limit`, `meta.total`, dan `links.self/next/prev`; perubahan tersebut harus ditulis sebagai versi kontrak baru.

### 6.1 Product resource

```json
{
  "id": 1,
  "name": "Adjustable Chill Pillow",
  "price": 89,
  "currency": "USD",
  "image": "https://images.contentstack.io/.../leesa-bedding-adjustablechillpillow-01.jpg",
  "images": ["https://images.contentstack.io/.../leesa-bedding-adjustablechillpillow-01.jpg"],
  "variants": {
    "size": ["Queen", "King"],
    "color": [],
    "quantity": 10
  },
  "description": "Adjustable cooling pillow with removable fill for a personalized loft.",
  "originalPrice": 119,
  "promo": { "badge": "25% OFF", "save": 30 },
  "createdAt": "2026-10-08T00:00:00.000Z"
}
```

| Field | Type | POST rule | Notes |
|---|---|---|---|
| `id` | integer | Server-generated; client must not send it | Positive and unique. |
| `name` | string | Required, trimmed, 2–120 chars | Product display name. |
| `price` | number | Required, finite, `> 0`, max 2 decimals | Selling price. |
| `currency` | string | Optional; default `USD`; uppercase ISO-4217-like 3 letters | Example: `USD`. |
| `image` | string | Required, valid absolute `http`/`https` URL, max 2,048 chars | Primary product image. |
| `images` | string[] | Optional; each item must be valid absolute HTTP(S) URL; max 10 | Defaults to `[image]`. |
| `variants.size` | string[] | Required; 1–10 unique non-empty values, each max 50 chars | At least one variation dimension must be populated. |
| `variants.color` | string[] | Optional; 0–20 unique non-empty values, each max 50 chars | Defaults to `[]`. |
| `variants.quantity` | integer | Required, 0–10,000 | Available inventory; zero is valid (out of stock). |
| `description` | string | Required, trimmed, 10–2,000 chars | Short product description. |
| `originalPrice` | number | Optional, finite, `>= price`, max 2 decimals | Reference price. |
| `promo.badge` | string | Optional, max 40 chars | Example: `25% OFF`. |
| `promo.save` | number | Optional, finite, `>= 0`, max 2 decimals | Discount amount. |
| `createdAt` | ISO-8601 string | Server-generated | Creation timestamp. |

Additional schema rules:

- Body wajib berupa JSON object biasa; `null`, array, dan primitive ditolak.
- Properti yang tidak didokumentasikan ditolak agar typo tidak diam-diam tersimpan.
- `variants` wajib berupa object; `size`, `color`, dan `quantity` harus mengikuti tipe di atas.
- Jika `promo.save` diberikan, nilainya tidak boleh lebih besar dari `originalPrice - price` ketika `originalPrice` juga diberikan.
- Middleware melakukan trim string, mengubah `currency` menjadi huruf kapital, dan menghapus duplikasi variasi secara case-insensitive **atau** menolak duplikasi. Implementasi yang dipilih harus konsisten; rekomendasi: tolak duplikasi dengan error field.

### 6.2 Mapping ke data frontend saat ini

| API | Sumber referensi frontend |
|---|---|
| `name`, `price`, `originalPrice`, `promo` | `productData.name`, `sizes`, `promo` |
| `image`, `images` | `productData.images` |
| `variants.size` | `productData.sizes[].name` |
| `variants.quantity` | Nilai stok API; bukan pilihan pembelian UI `qty` 1–10 |
| `description` | Ringkasan dari konten/features produk |

## 7. Endpoint API

### 7.1 `GET /api/products`

Mengambil seluruh produk. Endpoint tidak menerima atau memvalidasi request body; sesuai semantik HTTP, request `GET` tidak memproses body.

**200 OK**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Adjustable Chill Pillow",
      "price": 89,
      "currency": "USD",
      "image": "https://images.contentstack.io/.../leesa-bedding-adjustablechillpillow-01.jpg",
      "variants": { "size": ["Queen", "King"], "color": [], "quantity": 10 },
      "description": "Adjustable cooling pillow with removable fill for a personalized loft."
    }
  ],
  "meta": { "total": 1 },
  "links": { "self": "/api/products" }
}
```

### 7.2 `GET /api/products/:id`

Mengambil produk berdasarkan ID numerik.

| Condition | Status | Response |
|---|---:|---|
| ID ditemukan | 200 | `{ "data": Product, "links": { "self": "/api/products/:id" } }` |
| `:id` bukan integer positif | 400 | Problem Details `invalid-product-id` |
| ID valid namun tidak ditemukan | 404 | Problem Details `product-not-found` |

**Contoh:** `GET /api/products/1`

### 7.3 `POST /api/products`

Menambah produk. Header wajib `Content-Type: application/json`. Middleware validasi harus berjalan sebelum produk dimasukkan ke array data.

**Request contoh**

```json
{
  "name": "Cloud Support Pillow",
  "price": 95,
  "currency": "USD",
  "image": "https://cdn.example.com/products/cloud-support-pillow.jpg",
  "images": ["https://cdn.example.com/products/cloud-support-pillow.jpg"],
  "variants": {
    "size": ["Standard", "King"],
    "color": ["White"],
    "quantity": 25
  },
  "description": "Supportive adjustable pillow with a breathable, cool-touch cover.",
  "originalPrice": 120,
  "promo": { "badge": "20% OFF", "save": 25 }
}
```

**201 Created**

```json
{
  "data": {
    "id": 2,
    "name": "Cloud Support Pillow",
    "price": 95,
    "currency": "USD",
    "image": "https://cdn.example.com/products/cloud-support-pillow.jpg",
    "images": ["https://cdn.example.com/products/cloud-support-pillow.jpg"],
    "variants": { "size": ["Standard", "King"], "color": ["White"], "quantity": 25 },
    "description": "Supportive adjustable pillow with a breathable, cool-touch cover.",
    "originalPrice": 120,
    "promo": { "badge": "20% OFF", "save": 25 },
    "createdAt": "2026-10-08T10:00:00.000Z"
  }
}
```

Respons harus menyertakan header `Location: /api/products/2`.

### 7.4 Schema Konseptual JSON
```json
{
  "succes": true,
  "data": {},
  "message": "message success",
  "responseCode": 200
}
```

## 8. Error Handling

Semua error memakai RFC 9457 Problem Details berikut. `type` harus URL stabil yang menjelaskan kategori masalah dan `instance` berisi path request (tanpa data sensitif).

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "Request validation failed",
  "status": 400,
  "detail": "One or more fields are invalid.",
  "instance": "/api/products",
  "errors": [
    { "field": "price", "message": "must be a positive number with at most 2 decimal places" }
  ]
}
```

| Status | Problem type suffix | Kapan digunakan |
|---:|---|---|
| 400 | `invalid-product-id` | Route parameter ID kosong, bukan angka bulat, atau tidak positif. |
| 400 | `invalid-json` | JSON malformed atau body tidak dapat diparse. |
| 400 | `validation-error` | Field POST hilang, tipe salah, nilai tidak memenuhi schema, atau ada field tak dikenal. |
| 404 | `product-not-found` | ID valid tetapi produk tidak ada. |
| 404 | `route-not-found` | Rute API tidak tersedia. |
| 415 | `unsupported-media-type` | POST tanpa `Content-Type: application/json`. |
| 500 | `internal-server-error` | Kesalahan tak terduga; detail internal tidak boleh dibocorkan. |

## 9. Acceptance Criteria

### GET collection dan detail

- AC-01: `GET /api/products` merespons `200`, `Content-Type: application/json`, dan `data` berupa array.
- AC-02: Setiap produk GET memiliki minimal `id`, `name`, `price`, `image`, `variants`, dan `description`.
- AC-03: Seed data memuat Adjustable Chill Pillow, harga `89`, serta varian ukuran Queen dan King.
- AC-04: `GET /api/products/1` merespons `200` dan ID produk sama dengan ID pada path.
- AC-05: `GET /api/products/abc` merespons `400`, `application/problem+json`, dan problem type `invalid-product-id`.
- AC-06: `GET /api/products/999999` merespons `404`, `application/problem+json`, dan problem type `product-not-found`.

### POST dan validasi

- AC-07: POST payload valid membuat tepat satu resource baru, merespons `201`, dan ID dibuat oleh server.
- AC-08: Respons POST sukses menyertakan `Location` yang menunjuk ke resource baru dan resource tersebut dapat diambil dengan GET detail.
- AC-09: POST tanpa setiap field wajib (`name`, `price`, `image`, `variants`, `variants.size`, `variants.quantity`, `description`) merespons `400` tanpa mengubah koleksi.
- AC-10: Harga nol/negatif, kuantitas pecahan/negatif, URL gambar non-HTTP(S), dan description kurang dari 10 karakter ditolak sebagai RFC 9457 `validation-error` dengan detail field.
- AC-11: Payload dengan field tidak dikenal, body array, body `null`, atau JSON malformed tidak tersimpan.
- AC-12: Jika `Content-Type` POST bukan JSON, API merespons `415`.
- AC-13: Produk yang gagal validasi tidak dapat ditemukan pada endpoint GET setelah request selesai.

### Keandalan dan keamanan dasar

- AC-14: Error tidak mengungkap stack trace, path lokal, atau detail runtime ke client.
- AC-15: Respons sukses memakai envelope `data` (serta `meta`/`links` bila relevan); respons gagal memakai RFC 9457 `application/problem+json`.
- AC-16: Handler unknown `/api/*` mengembalikan JSON `404`, bukan HTML default Express.

## 10. Arsitektur Direktori — Layered MVC

Implementasi menggunakan Layered Architecture dengan MVC sebagai batas antarlapisan. Route hanya mendaftarkan HTTP endpoint; controller menerjemahkan HTTP; service memegang use case; repository mengisolasi penyimpanan in-memory. Arah dependensi adalah `route → controller → service → repository`; controller tidak boleh mengakses array produk langsung.

```text
api-project/
├── package.json
├── .env.example                 # PORT, NODE_ENV; tanpa secret nyata
├── README.md                    # cara menjalankan, kontrak ringkas, batasan in-memory
├── openapi.yaml                 # kontrak OpenAPI 3.1
├── src/
│   ├── server.js                # bootstrap HTTP server dan graceful shutdown
│   ├── app.js                   # Express app, global middleware, mount routes
│   ├── config/
│   │   └── env.js               # baca + validasi environment
│   ├── routes/
│   │   └── product.routes.js    # definisi GET/POST dan urutan middleware
│   ├── controllers/
│   │   └── product.controller.js # request/response HTTP; tanpa business logic
│   ├── services/
│   │   └── product.service.js   # use case list, detail, create; ID dan timestamp
│   ├── repositories/
│   │   └── product.repository.js # query/mutasi array in-memory
│   ├── models/
│   │   └── product.schema.js    # schema/DTO dan aturan bentuk Product
│   ├── data/
│   │   └── products.seed.js     # seed Adjustable Chill Pillow
│   ├── middlewares/
│   │   ├── validate-product.js  # validasi POST body
│   │   ├── validate-id.js       # validasi params.id
│   │   ├── require-json.js      # Content-Type untuk POST
│   │   ├── not-found.js         # Problem Details untuk API route tidak ada
│   │   └── error-handler.js     # parser/error tak terduga → Problem Details
│   └── utils/
│       ├── api-response.js      # pembuat envelope sukses dan links
│       └── problem-details.js   # pembuat RFC 9457 response
└── tests/
    ├── integration/
    │   └── products.api.test.js # endpoint via Supertest
    └── unit/
        ├── product.service.test.js
        └── validate-product.test.js
```

Tanggung jawab lapisan:

| Layer | Tanggung jawab | Tidak boleh dilakukan |
|---|---|---|
| Route | Pemetaan method/path dan middleware per endpoint. | Business logic atau format data. |
| Controller | Membaca input tervalidasi, memanggil service, menetapkan status/header HTTP. | Memanipulasi data store langsung. |
| Service | Aturan use case, pembuatan ID/timestamp, keputusan not-found. | Mengakses `req`/`res` Express. |
| Repository | Akses dan mutasi array produk in-memory. | Menetapkan HTTP status atau validasi request. |
| Model/schema | Kontrak Product/DTO dan validasi bentuk data. | Efek samping HTTP atau storage. |
| Middleware | Cross-cutting request handling dan konversi error. | Menjalankan use case produk. |

## 11. Middleware dan Urutan Implementasi

Urutan yang direkomendasikan pada Express:

1. `express.json({ limit: '100kb' })` untuk parsing dan pembatasan body.
2. Middleware pengecekan `Content-Type` khusus `POST /api/products`.
3. Middleware `validateCreateProduct` untuk whitelist, tipe, panjang, angka, URL, nested `variants`, dan aturan lintas field.
4. Handler route yang baru membuat ID, timestamp, dan melakukan `products.push(...)` setelah validasi lolos.
5. Error handler JSON untuk kesalahan parser dan error tak terduga.
6. Handler 404 JSON untuk rute `/api` yang tidak ada.

Validasi tidak boleh berada hanya di frontend: request HTTP langsung, Postman, atau script tetap harus ditolak server bila tidak valid.

## 12. Data Lifecycle dan Batasan

`POST` mengubah array di memori proses. Produk baru tersedia bagi request berikutnya selama proses Node.js masih hidup, lalu hilang ketika server restart. Batasan ini disengaja untuk scope exercise dan harus disebutkan pada README implementasi.

Pada fase integrasi, frontend dapat mengganti sumber `productData` dengan `fetch('/api/products/:id')`, lalu memetakan `variants.size` ke selector ukuran dan `variants.quantity` ke batas pembelian/stok. UI tetap dapat mempertahankan detail presentasional lain hingga API diperluas.

## 13. Success Metrics

- Semua acceptance criteria otomatis/manual lulus di Postman atau test runner.
- Tidak ada produk invalid yang tersimpan setelah percobaan POST negatif.
- Halaman detail dapat mengambil field wajib dari respons detail tanpa hardcode untuk nama, harga, foto, variasi, kuantitas, dan deskripsi.
- API dapat dijalankan secara lokal menggunakan Node.js dan Express tanpa layanan eksternal.

## 14. Out of Scope / Open Decisions

- Skema saat ini menggunakan `size` dan `color`; kategori produk lain dapat memerlukan dimensi variasi tambahan (misalnya material). Perluasan harus versioned atau didokumentasikan sebelum ditambahkan.
- `quantity` berarti stok tersedia, bukan jumlah yang dipilih pembeli pada UI.
- Bila API dipakai di lintas origin, konfigurasi CORS perlu diputuskan saat integrasi; tidak diwajibkan pada exercise lokal yang sama origin.
- Persistensi database, authentication, rate limiting, dan sanitasi untuk rich text menjadi kebutuhan fase produksi, bukan phase ini.

---

Dokumen ini mengacu pada data dan kebutuhan halaman detail produk di `mini-prd.md` serta pedoman *Practical Guidance: Modern Back-End Development with AI*. Dalam pedoman tersebut, API detail produk harus menyediakan nama, harga, foto, variasi, quantity, dan deskripsi; PRD ini memperluasnya menjadi kontrak katalog yang tervalidasi dengan endpoint `GET` dan `POST` sesuai spesifikasi proyek.
