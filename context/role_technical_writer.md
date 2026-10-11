 Kamu adalah technical writer dan frontend developer berpengalaman.
  
  Tugasmu adalah melengkapi file `frontend-tasklist.md` berikut ini dengan menambahkan
  bagian-bagian yang belum ada, tanpa mengubah atau menghapus task yang sudah ada.
  
  ---
  KONTEKS PROJECT:
  - Project ini adalah halaman detail produk (satu halaman/single page) berbasis HTML, CSS,
  dan Vanilla JavaScript murni — tanpa framework atau bundler.
  - File yang sudah ada: `index.html`, `style.css`, `app.js`, `data.js` (semua di folder
  `@../project-AI/`)
  - `data.js` berisi object `productData` — sumber data statis lokal saat ini.
  - `app.js` berisi semua fungsi rendering DOM dan event handler yang membaca dari
  `productData` secara sinkronus.
  - Tujuan utama: mengintegrasikan halaman ini dengan REST API backend (`GET
  /api/products/:id`) sehingga data produk utama tidak lagi di-hardcode.
  - Stack: HTML + CSS + Vanilla JS dengan native ES Modules (`type="module"`).
  
  ---
  BAGIAN YANG PERLU DITAMBAHKAN KE TASKLIST:
  
  1. **Deklarasi tech stack** — tambahkan di bagian paling atas dokumen, sebelum Section 1.
  Nyatakan secara eksplisit bahwa project menggunakan HTML, CSS, dan Vanilla JavaScript (ES
  Modules).
  
  1. **Struktur direktori target** — tambahkan sebagai sub-section di Section 1 (Persiapan
  Integrasi). Tampilkan struktur folder yang direkomendasikan seperti ini:
  
    frontend/
        ├── dist/               # Folder output hasil build produksi
        ├── node_modules/       # Library & dependensi npm
        ├── src/                # File kode sumber aplikasi (JS, CSS, assets)
        ├── tests/              # File pengujian (unit testing / integration test)
        ├── .env.example        # Template variabel lingkungan/environment
        ├── index.html          # File HTML entry point utama
        └── package.json        # Konfigurasi dependensi dan script npm

  
  Sertakan juga penjelasan singkat peran tiap file dan cara load di HTML menggunakan
  `<script type="module" src="js/app.js"></script>`.
  
  3. **Penjelasan migrasi `data.js`** — tambahkan sebagai sub-section di Section 1 atau
  Section 3. Jelaskan:
     - Field mana dari `productData` yang HARUS berasal dari API: `name`, `price`,
  `images`, `sizes`/`variants`, `description`
     - Field mana yang BOLEH tetap lokal di `data.js`: `nav`, `footer`, `features`, `faq`,
  `socialProof`, `needHelp`, `promo` (sampai endpoint-nya tersedia)
     - `data.js` tidak dihapus, tapi dikurangi hanya menyimpan data UI lokal
  
  4. **Penjelasan refaktor `app.js`** — tambahkan sebagai sub-section di Section 2 (Fetch
  Data dan State). Jelaskan bahwa:
     - Fungsi render di `app.js` saat ini membaca `productData` secara sinkronus dan
  langsung (global variable)
     - Setelah integrasi, fungsi render harus diubah untuk menerima data sebagai parameter
     - Pattern yang direkomendasikan: fetch data di satu titik (misalnya fungsi `init()`),
  lalu teruskan ke fungsi render sebagai argumen
  - Contoh pola sebelum dan sesudah (before/after) sangat membantu di sini
  
  ---
  ATURAN PENULISAN:
  - Gunakan bahasa Indonesia, konsisten dengan gaya penulisan tasklist yang sudah ada
  - Tambahan berupa checklist `[ ]` untuk task yang actionable
  - Tambahan berupa blok penjelasan/kode untuk yang sifatnya dokumentasi/reference
  - Jangan ubah Section 2–6 dan Definition of Done yang sudah ada
  - Output adalah isi lengkap file `frontend-tasklist.md` yang sudah dilengkapi
  
  ─────────────────────────────────────────────────────────────────────────────────────────
  
  Catatan penggunaan
  
  Prompt di atas akan menghasilkan output terbaik kalau kamu:
  1. Sertakan isi frontend-tasklist.md yang sekarang sebagai bagian dari prompt (paste
  setelah prompt di atas, atau attach sebagai file kalau tool-nya support).
  2. Kalau mau hasil lebih presisi lagi, sertakan juga potongan data.js dan app.js yang
  relevan — supaya AI bisa menulis contoh before/after yang akurat berdasarkan kode
  aslinya.
  