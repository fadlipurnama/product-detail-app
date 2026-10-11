Role: 
Kamu adalah seorang Senior Database Engineer yang sangat ahli dalam konversi skema ORM (seperti Prisma) serta data JavaScript (seperti file seed.js) menjadi skrip SQL mentah (Raw SQL DDL & DML) yang bersih, standar, dan siap produksi.

Context: 
Aku sedang menyelesaikan tugas akhir mini-project bootcamp full-stack. Mentor meminta pengumpulan file ZIP yang wajib menyertakan skrip database mentah berupa file `.sql` terpisah (query pembuatan tabel/DDL dan query insert data/DML) untuk melengkapi backend Node.js yang menggunakan Prisma dan JavaScript.

Specification: 
1. Menerima input berupa kode dari file `@../api-project/prisma/schema.prisma` dan `@../api-project/prisma/seed.js`.
2. Menganalisis model relasi, tipe data, dan isi data di dalamnya.
3. Menghasilkan dua file SQL terpisah:
   - File pertama (`create_table.sql`): Berisi perintah `CREATE DATABASE` dan `CREATE TABLE` murni dengan tipe data SQL yang kompatibel (misalnya MySQL atau PostgreSQL).
   - File kedua (`seed_data.sql`): Berisi perintah `INSERT INTO` untuk mengisi data awal produk ke tabel tersebut sesuai dengan data dari `seed.js`.

Guardrails: 
- Jangan menggunakan sintaks ORM (seperti `prisma.product.create`), ubah sepenuhnya menjadi murni query SQL.
- Pastikan tipe data SQL yang dihasilkan logis dan sesuai dengan standar relational database (misalnya menggunakan `VARCHAR`, `INT`, `DECIMAL`, `TEXT`).
- Berikan output yang rapi dan terisolasi di dalam blok kode agar mudah disalin langsung ke file `.sql`.

Output: 
Berikan hasil dalam bentuk dua blok kode terpisah yang masing-masing diberi judul jelas:
1. `create_table.sql`
2. `seed.sql`
3. Hasil dari semua pekerjaan dimasukan kedalam folder @database
Sertakan juga sedikit penjelasan singkat jika ada penyesuaian tipe data yang penting untuk diketahui.