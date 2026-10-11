# Frontend Task List — Product Detail API Integration

Referensi: `mini-prd.md`, `api-prd.md`, dan `architecture.md`. Scope frontend tetap halaman detail di `project-AI`; API backend menjadi sumber data produk.

## Tech Stack

Project ini menggunakan HTML, CSS, dan Vanilla JavaScript murni dengan ES Modules. Tidak menggunakan framework frontend, build tool, atau bundler. Semua logika render, event handler, dan interaksi UI ditulis dalam JavaScript native, sementara file HTML memuat modul JavaScript melalui `<script type="module" src="js/app.js"></script>`.

## 1. Persiapan Integrasi

- [ ] Jalankan PostgreSQL melalui `docker compose up -d postgres` dari root workspace bila mengembangkan stack secara lokal.
- [ ] Ketahui bahwa frontend tidak pernah terhubung langsung ke PostgreSQL; frontend hanya berbicara dengan Express API.
- [ ] Tetapkan URL API development melalui konfigurasi, misalnya `API_BASE_URL=http://localhost:3000/api` atau proxy development.
- [ ] Pastikan frontend dan backend same-origin atau konfigurasikan CORS secara eksplisit bila berbeda origin.
- [ ] Buat module API terpisah, misalnya `project-AI/api.js`; jangan menaruh `fetch` langsung di seluruh fungsi render.
- [ ] Buat type/JSDoc atau kontrak data frontend untuk Product, ProductImage, dan ProductVariant.
- [ ] Tentukan fallback yang aman bila backend belum tersedia saat development.

### Struktur direktori target

Gunakan struktur folder berikut sebagai acuan saat frontend mulai dipisahkan dari static asset lama dan disiapkan untuk integrasi API:

frontend/
    ├── dist/               # Folder output hasil build produksi
    ├── node_modules/       # Library & dependensi npm
    ├── src/                # File kode sumber aplikasi (JS, CSS, assets)
    ├── tests/              # File pengujian (unit testing / integration test)
    ├── .env.example        # Template variabel lingkungan/environment
    ├── index.html          # File HTML entry point utama
    └── package.json        # Konfigurasi dependensi dan script npm

Penjelasan singkat per file:

- `src/`: berisi kode aplikasi utama, termasuk logika rendering, gaya, dan asset lokal.
- `tests/`: tempat pengujian komponen, integrasi, dan skenario API mocking.
- `.env.example`: template konfigurasi environment seperti `API_BASE_URL` dan variabel aman.
- `index.html`: file HTML entry point yang memuat seluruh aplikasi.
- `package.json`: definisi dependency, script `dev`, `build`, dan `test` ketika project mulai memakai tooling terbatas.

Cara load modul JavaScript di HTML tetap disarankan dengan pola berikut:

```html
<script type="module" src="js/app.js"></script>
```

Pola ini memastikan modul dapat di-load sebagai ES module dan memudahkan pemisahan logika API, state, serta render UI.

### Migrasi `data.js`

`data.js` tidak dihapus, tetapi dikurangi fungsinya menjadi penyimpanan data UI lokal yang tidak tersedia di API. Pada tahap integrasi, field berikut harus berasal dari backend dan bukan lagi dari `productData` hardcoded:

- [ ] `name`
- [ ] `price`
- [ ] `images`
- [ ] `sizes` / `variants`
- [ ] `description`

Sedangkan field berikut masih dapat tetap lokal di `data.js` sampai endpoint backend tersedia:

- [ ] `nav`
- [ ] `footer`
- [ ] `features`
- [ ] `faq`
- [ ] `socialProof`
- [ ] `needHelp`
- [ ] `promo`

Prinsipnya adalah memindahkan data produk inti ke API, sementara `data.js` hanya menyimpan konten non-produk yang sifatnya tetap statis atau UI lokal. Dengan demikian, `productData` tidak lagi menjadi satu-satunya sumber data untuk halaman detail.

## 2. Fetch Data dan State

- [ ] Ambil detail produk dengan `GET /api/products/:id` saat halaman dimuat.
- [ ] Gunakan `AbortController` atau mekanisme serupa untuk menghindari update state dari request yang sudah tidak relevan.
- [ ] Tampilkan loading state sebelum data detail tersedia.
- [ ] Tampilkan error state yang ramah pengguna bila request gagal atau produk `404`.
- [ ] Tangani empty state bila `GET /api/products` tidak mengembalikan produk.
- [ ] Simpan state pilihan varian, quantity pembelian, gambar aktif, dan status add-to-cart secara terpisah dari data API.

### Refaktor `app.js`

Saat ini, fungsi render di `app.js` membaca `productData` secara sinkronus dan langsung dari variabel global. Kondisi ini akan membuat halaman sulit dipelihara ketika data produk diganti dari backend API. Setelah integrasi, fungsi render sebaiknya menerima `product` atau `state` sebagai parameter, bukan membaca `productData` secara langsung dari scope global.

Pola yang direkomendasikan adalah fetching data di satu titik, lalu meneruskan hasilnya ke fungsi render. Contoh sebelum dan sesudah:

```js
// Sebelum
function renderProductInfo() {
  const title = document.querySelector('#product-title');
  title.textContent = productData.name;
}
```

```js
// Sesudah
function renderProductInfo(product) {
  const title = document.querySelector('#product-title');
  title.textContent = product.name;
}

async function init() {
  const product = await fetchProductById('123');
  renderProductInfo(product);
}
```

Dengan pola ini, logika fetch dan render menjadi lebih prediktif, lebih mudah diuji, dan lebih aman saat data berubah sesuai response API. Dalam implementasi nyata, fungsi seperti `renderGallery()`, `renderPrice()`, `renderTabs()`, dan `renderFooter()` sebaiknya diubah agar menerima argumen data tertentu, bukan membaca variabel global `productData` setiap saat.

## 3. Mapping Data API ke UI

- [ ] Map `data.name` ke judul produk, breadcrumb, sticky bar, dan CTA.
- [ ] Map `data.price` serta `data.currency` ke format harga menggunakan `Intl.NumberFormat`.
- [ ] Map foto utama ke hero image; map `images[]` ke thumbnail gallery berdasarkan `position`.
- [ ] Gunakan `alt` foto dari API dan fallback deskriptif bila tidak tersedia.
- [ ] Map `variants[]` ke pilihan kombinasi warna dan ukuran yang benar-benar tersedia.
- [ ] Tampilkan quantity stok varian aktif; bedakan dari quantity pembelian pengguna.
- [ ] Nonaktifkan CTA atau berikan label jelas untuk varian dengan stok `0`.
- [ ] Map `description` ke bagian deskripsi produk.
- [ ] Pertahankan data UI yang belum ada pada API (FAQ, feature cards, footer) secara lokal sampai endpoint-nya tersedia.

## 4. Interaksi Produk

- [ ] Buat selector warna bila API menyediakan lebih dari satu warna.
- [ ] Buat selector ukuran dari varian yang kompatibel dengan warna aktif.
- [ ] Saat warna/ukuran berubah, pilih varian valid pertama bila kombinasi lama tidak tersedia.
- [ ] Batasi pilihan quantity pembelian ke `min(10, variant.quantity)`.
- [ ] Tampilkan pesan validasi bila belum ada varian yang dipilih atau stok habis.
- [ ] Sinkronkan varian, harga, dan label CTA ke sticky add-to-cart bar.
- [ ] Pastikan galeri, tabs, accordion, mobile navigation, dan newsletter tetap berjalan setelah sumber data berubah.

## 5. UX, Aksesibilitas, dan Keamanan Browser

- [ ] Gunakan loading text atau skeleton yang dapat dibaca screen reader (`aria-live`).
- [ ] Tampilkan error yang dapat dimengerti tanpa mengekspos pesan internal backend.
- [ ] Tetapkan `aria-selected`, `aria-expanded`, focus state, dan keyboard handling pada selector/tab/accordion.
- [ ] Jangan memasukkan string API ke `innerHTML` tanpa sanitasi/escaping; utamakan `textContent` untuk data teks.
- [ ] Pastikan semua gambar memiliki `alt` yang bermakna.
- [ ] Uji desktop, tablet, dan mobile tanpa horizontal scroll.

## 6. Testing

- [ ] Mock response API sukses untuk test render halaman detail.
- [ ] Test loading, network error, `404`, dan malformed/unexpected response.
- [ ] Test pemilihan warna/ukuran mengubah stok, CTA, dan sticky bar dengan benar.
- [ ] Test varian habis stok dan batas quantity pembelian.
- [ ] Test keyboard navigation untuk gallery, tabs, dan accordion.
- [ ] Uji manual melalui Swagger/Postman lalu browser agar kontrak frontend dan backend cocok.

## Definition of Done

- [ ] Halaman detail tidak lagi membutuhkan hardcode nama, harga, foto, varian, stok, atau deskripsi produk.
- [ ] Loading, error, dan out-of-stock state tersedia dan dapat diakses.
- [ ] Semua interaksi lama tetap berfungsi pada viewport mobile dan desktop.
- [ ] Tidak ada error console, request gagal yang tidak tertangani, atau data API yang dirender secara tidak aman.
