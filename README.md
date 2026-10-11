# [ASSIGNMENT] DAY - 5 Mini Project: Web Developer AI First

Proyek ini dikerjakan untuk memenuhi tugas **[ASSIGNMENT] DAY - 5 Mini Project: Web Developer AI First**. Implementasinya membangun halaman detail produk **Adjustable Chill Pillow** dalam dua versi: halaman statis dengan data lokal (*hardcode*) dan halaman dinamis yang mengambil data dari REST API. Backend menyimpan katalog produk di PostgreSQL melalui Prisma ORM.

Versi dinamis menerapkan **strict error handling**: jika API gagal, halaman menampilkan kondisi error yang sesuai dan tidak mengganti respons gagal dengan data produk lokal.

## Struktur Direktori

```text
.
├── backend/                   # REST API Express, Prisma, migrasi, dan test
├── frontend/
│   ├── page-hardcode/         # Halaman HTML/CSS/JavaScript dengan data lokal
│   └── page-with-server/      # Halaman Vite yang mengambil data dari backend
├── database/                  # SQL PostgreSQL untuk membuat tabel dan seed data
├── context/                   # PRD, arsitektur, tasklist, dan panduan peran
└── README.md
```

- `backend/src/` berisi route, controller, service, repository, validasi, dan middleware API. Skema serta migrasi Prisma ada di `backend/prisma/`.
- `frontend/page-hardcode/` menggunakan HTML, CSS, dan JavaScript biasa; konten produk berasal dari `data.js`.
- `frontend/page-with-server/` menggunakan Vite dan konfigurasi proxy `/api` serta `/assets` ke backend lokal.
- `database/create_table.sql` dan `database/seed_data.sql` adalah alternatif setup database secara langsung melalui SQL.
- `context/` menyimpan dokumen pendukung spesifikasi dan implementasi.

## Prasyarat

- Node.js **20.19 atau lebih baru** dan npm.
- Docker Desktop dengan Docker Compose untuk menjalankan PostgreSQL lokal, atau layanan PostgreSQL yang sudah tersedia.
- `psql` hanya diperlukan bila memilih setup database dengan file SQL mentah.

> **Database proyek ini adalah PostgreSQL**, bukan MySQL. Backend dan skrip SQL menggunakan PostgreSQL.

## Menyiapkan Backend

Jalankan perintah dari folder `backend/`.

1. Siapkan konfigurasi environment. Buka `.env` dan sesuaikan nilai lokal, terutama password database. Jangan commit file `.env`.

   ```powershell
   Copy-Item .env.example .env
   ```

2. Jalankan PostgreSQL melalui Docker Compose, lalu install dependency:

   ```powershell
   docker compose up -d postgres
   npm install
   ```

3. Pilih **satu** metode berikut untuk menyiapkan skema dan data. Jangan jalankan migrasi Prisma dan `create_table.sql` pada database yang sama.

   **Metode Prisma (direkomendasikan):** gunakan database `product_catalog` sesuai default `.env.example`.

   ```powershell
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

   **Metode SQL mentah:** file SQL membuat database bernama `mini_project_5`. Di `.env`, arahkan `DATABASE_URL` ke database tersebut, misalnya `postgresql://app_user:<password>@localhost:5432/mini_project_5?schema=public`. Biarkan `POSTGRES_DB=product_catalog` agar database container awal tetap berbeda. Sebelum menjalankan `create_table.sql`, buka file tersebut dan aktifkan baris `\c mini_project_5;` dengan menghapus komentar `--`. Jalankan dari `backend/`:

   ```powershell
   psql -U app_user -d postgres -f ..\database\create_table.sql
   psql -U app_user -d mini_project_5 -f ..\database\seed_data.sql
   npm run prisma:generate
   ```

   Sesuaikan `-U` dengan user PostgreSQL yang digunakan. Jika diminta, masukkan password yang sama dengan konfigurasi database. Metode ini menjalankan DDL dan seed dari folder `database/`; jangan lanjutkan dengan `prisma:migrate` atau `prisma:seed` pada database tersebut.

4. Jalankan API:

   ```powershell
   npm run dev
   ```

   Backend tersedia di `http://localhost:3000`. Dokumentasi API Swagger tersedia di `http://localhost:3000/api-docs`; endpoint detail produk menggunakan `GET /api/products/:id`.

## Menjalankan Frontend

### Halaman statis (`page-hardcode`)

Buka `frontend/page-hardcode/index.html` langsung di browser. Halaman ini menggunakan data lokal dan tidak memerlukan backend atau instalasi dependency.

### Halaman dinamis (`page-with-server`)

Pastikan backend dan database berjalan. Buka terminal baru di `frontend/page-with-server/`, siapkan environment Vite, lalu jalankan:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite (default `http://localhost:5173`). Konfigurasi default menggunakan `VITE_API_BASE_URL=/api` dan meneruskan request ke backend `http://localhost:3000`. Untuk menampilkan produk lain, ubah `VITE_PRODUCT_ID` di `.env.local`.

## Catatan Teknis

Kedua halaman sengaja dipisahkan: `page-hardcode` merender konten dari data lokal, sedangkan `page-with-server` bergantung pada REST API. Versi dinamis tidak memakai fallback lokal saat request gagal, sehingga error koneksi, respons server, dan produk yang tidak ditemukan ditangani sebagai kondisi error, bukan ditampilkan seolah-olah data berhasil dimuat.