Role: 
Kamu adalah seorang Technical Writer & Senior Full-Stack Developer yang ahli dalam menyusun dokumentasi proyek (README.md) yang profesional, rapi, terstruktur, dan mudah dipahami oleh evaluator atau mentor bootcamp.

Context: 
Aku sedang merapikan tugas akhir mini-project-ku (`assignment-5`) yang memiliki struktur direktori dan arsitektur sebagai berikut:
1. `backend/`: Berisi server Node.js, Express, Prisma ORM, migrasi database, dan konfigurasi lingkungan (.env, docker-compose).
2. `frontend/`: Berisi antarmuka web yang dibagi menjadi dua bagian:
   - `page-hardcode/`: Halaman detail produk statis berbasis data lokal murni.
   - `page-with-server/`: Halaman REST API dinamis yang terhubung ke backend dengan strict error handling (tanpa fallback lokal di sisi klien).
3. `database/`: Berisi file SQL mentah wajib (`create_table.sql` dan `seed_data.sql`).
4. `context/`: Berisi file spesifikasi produk (mini-prd), arsitektur, tasklist, dan panduan peran pendukung proyek.

Specification: 
Buatkan file `README.md` utama yang komprehensif untuk ditarik ke root folder proyek, mencakup bagian-bagian berikut:
1. **Judul & Deskripsi Proyek**: Menjelaskan tujuan assignment, implementasi halaman hardcode vs REST API, serta arsitektur strict error handling.
2. **Struktur Direktori**: Menjabarkan fungsi dari setiap folder utama (`backend`, `frontend`, `database`, `context`).
3. **Prasyarat Sistem (Prerequisites)**: Software yang dibutuhkan (Node.js, npm, MySQL/Database service).
4. **Panduan Instalasi & Menjalankan (Getting Started)**:
   - Langkah setup dan menjalankan Backend (termasuk instalasi dependencies, konfigurasi `.env`, dan cara import file SQL dari folder `database`).
   - Langkah menjalankan Frontend (untuk `page-hardcode` dan `page-with-server`).
5. **Catatan Teknis Tambahan**: Penjelasan singkat mengenai desain arsitektur yang memisahkan halaman statis dan dinamis secara tegas.

Guardrails: 
- Gunakan format Markdown yang bersih, rapi, dan mudah dibaca (gunakan heading `#`, `##`, *bullet points*, serta blok kode/code block untuk perintah terminal).
- Jangan membuat asumsi teknologi di luar struktur yang sudah diberikan (fokus pada Node.js, Prisma, Vite, dan SQL mentah).

Output: 
Berikan seluruh isi file `README.md` lengkap di dalam satu blok kode utama agar bisa langsung aku salin dan simpan ke file `README.md` di root folder proyekku.