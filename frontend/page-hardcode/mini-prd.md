# PRODUCT REQUIREMENT DOCUMENT
## Halaman Detail Produk – E-Commerce Web

---

> **Adjustable Chill Pillow**  
> *by Leesa Sleep*

---

| Field | Detail |
|---|---|
| **Platform** | Web (Desktop & Mobile Responsive) |
| **Bahasa Pemrograman** | HTML, CSS, Vanilla JavaScript |
| **Data Backend** | Lokal (tanpa API) |
| **Tipe Dokumen** | PRD Exercise Bootcamp Front-End Dev |
| **Versi Dokumen** | v3.0 |
| **Tanggal** | Oktober 2026 |

---

## 1. Product Overview

Halaman Detail Produk Adjustable Chill Pillow adalah halaman web statis yang dibangun dengan HTML, CSS, dan Vanilla JavaScript. Halaman ini mereplikasi tampilan dan fungsionalitas halaman produk e-commerce Leesa.com, difokuskan sebagai latihan front-end development dalam konteks bootcamp pemrograman web.

### 1.1 Informasi Produk

| Field | Detail |
|---|---|
| **Nama Produk** | Adjustable Chill Pillow |
| **Brand** | Leesa Sleep |
| **Kategori** | Bedding / Pillow |
| **Harga Normal** | $119 (King), $119 (Queen) |
| **Harga Promo** | $89 (Queen) \| $89 (King) — 25% OFF, hemat $30 |
| **Ukuran Tersedia** | Queen: 20" x 30" \| King: 20" x 36" |
| **Berat Isian** | Queen: 80 oz. \| King: 90 oz. |
| **Garansi** | 1 tahun garansi terbatas + 30 hari uji coba bebas risiko |

### 1.2 Deskripsi Singkat

> *"Fluff, adjust, and fall in love."*

Adjustable Chill Pillow dirancang untuk semua posisi tidur. Isian yang dapat disesuaikan memungkinkan pengguna menciptakan ketinggian (loft) ideal, sementara penutup berteknologi pendingin menarik panas dari kepala dan leher sepanjang malam. Bersertifikat OEKO-TEX® STANDARD 100 untuk keamanan bahan.

### 1.3 Referensi Halaman Asli

🔗 https://www.leesa.com/products/adjustable-chill-pillow?size=Queen

---

## 2. Problem Statement

### 2.1 Masalah Pengguna (User Problem)

Pelanggan yang ingin membeli bantal berkualitas secara online seringkali kesulitan memahami nilai produk hanya dari daftar teks. Mereka membutuhkan halaman yang menyampaikan:

- Keunggulan dan keunikan produk secara visual dan naratif.
- Informasi harga, promo, dan ukuran yang jelas dan mudah dipahami.
- Detail teknis (material, spesifikasi, cara perawatan) yang mudah diakses.
- Jaminan pembelian (garansi, return policy, free shipping) yang meyakinkan.
- Cara menambahkan produk ke keranjang dengan langkah minimal.

### 2.2 Masalah Pengembang (Dev Problem — Konteks Bootcamp)

Sebagai latihan front-end development, developer perlu membangun satu halaman penuh yang mencakup:

- Layout kompleks dengan dua kolom, galeri gambar, dan komponen interaktif.
- Manajemen state sederhana (tab aktif, pilihan ukuran, jumlah qty) tanpa framework.
- Data produk lokal (tanpa API) yang disimpan di file `data.js`.
- Desain responsif yang berfungsi di desktop dan mobile.
- Komponen UI yang reusable: accordion, carousel, tabs, dropdown.

### 2.3 Pernyataan Masalah Utama

Bagaimana cara membangun halaman detail produk e-commerce yang informatif, menarik secara visual, dan fungsional menggunakan hanya HTML, CSS, dan Vanilla JavaScript dengan data lokal, sehingga dapat merepresentasikan pengalaman belanja online yang nyata?

---

## 3. Goals + Non-Goals

### 3.1 Goals (Tujuan)

**Tujuan Produk**

- Menampilkan informasi lengkap produk Adjustable Chill Pillow secara jelas dan menarik.
- Membantu pengguna mengambil keputusan pembelian melalui tampilan fitur, spesifikasi, dan jaminan produk.
- Memberikan pengalaman berbelanja yang mudah: pilih ukuran → pilih qty → add to cart.
- Membangun kepercayaan pengguna melalui informasi garansi, return policy, dan sertifikasi.

**Tujuan Teknis (Bootcamp)**

- Mempraktikkan pembuatan layout dua kolom dengan HTML semantik dan CSS Flexbox/Grid.
- Melatih manipulasi DOM dengan Vanilla JavaScript (tab switching, accordion, carousel).
- Memahami cara menyimpan dan menggunakan data lokal (`data.js`) tanpa backend/API.
- Melatih pembuatan komponen interaktif: dropdown selector, qty input, sticky header.
- Menerapkan prinsip desain responsif (mobile-first atau desktop-first).

### 3.2 Non-Goals (Bukan Tujuan)

- ❌ BUKAN membangun sistem keranjang belanja (cart) yang berfungsi penuh atau terhubung ke payment gateway.
- ❌ BUKAN menggunakan framework JavaScript (React, Vue, Angular, dll.).
- ❌ BUKAN mengintegrasikan API pihak ketiga (inventory, harga real-time, review eksternal).
- ❌ BUKAN membangun halaman lain selain halaman detail produk ini.
- ❌ BUKAN menerapkan autentikasi pengguna atau sistem akun.
- ❌ BUKAN mengoptimalkan SEO secara mendalam (meta tags lanjutan, schema markup).
- ❌ BUKAN menyediakan fitur pencarian produk atau filter koleksi.

---

## 4. User Flow

### 4.1 Flow Utama — Melihat dan Memilih Produk

Alur utama pengguna dari masuk ke halaman hingga melakukan aksi "Add to Cart":

1. **Masuk ke Halaman**  
   Pengguna membuka URL halaman detail produk. Halaman load dengan semua data dari `data.js`.

2. **Lihat Announcement Banner**  
   Banner promo di bagian atas menampilkan informasi diskon (misal: "25% OFF").

3. **Navigasi Header**  
   Pengguna melihat logo, menu navigasi, nomor telepon, dan ikon keranjang.

4. **Lihat Breadcrumb**  
   Pengguna memahami posisi: Home / Bedding / Adjustable Chill Pillow.

5. **Jelajahi Galeri Gambar**  
   Pengguna mengklik thumbnail atau tombol prev/next untuk melihat 6 foto produk.

6. **Baca Informasi Tab Produk**  
   Pengguna mengklik tab Benefits, Best For, atau Bonuses untuk melihat informasi berbeda.

7. **Lihat Harga & Promo**  
   Pengguna melihat harga normal (strikethrough) dan harga promo beserta badge diskon.

8. **Pilih Ukuran**  
   Pengguna memilih ukuran dari dropdown (Queen / King). Harga menyesuaikan jika berbeda.

9. **Pilih Jumlah (Qty)**  
   Pengguna memilih jumlah pembelian (1–10) dari dropdown Qty.

10. **Klik "Add to Cart"**  
    Pengguna mengklik tombol CTA. Muncul feedback visual (misal: pesan konfirmasi atau perubahan label tombol).

11. **Scroll ke Bawah — Fitur Produk**  
    Pengguna membaca section fitur: Deconstructed Design, Easy to Adjust, Cooling Cover.

12. **Baca FAQ Accordion**  
    Pengguna mengklik item FAQ (Spesifikasi, Garansi, Cara Kerja, dll.) untuk membaca detail.

13. **Lihat Social Proof**  
    Pengguna melihat counter "Mattresses Donated" sebagai bukti kepercayaan brand.

14. **Lihat Footer**  
    Pengguna menemukan link navigasi, kontak, sosial media, dan kebijakan privasi.

### 4.2 Flow Tambahan — Sticky Header (saat scroll)

- Saat pengguna men-scroll melewati section "Add to Cart", sticky header muncul di bagian atas.
- Sticky header menampilkan: Nama produk | Ukuran yang dipilih | Harga | Tombol "Add to Cart".
- Memungkinkan pengguna langsung checkout tanpa harus scroll kembali ke atas.

### 4.3 Flow Error / Edge Case

- Jika pengguna belum memilih ukuran saat klik "Add to Cart": tampilkan pesan validasi inline.
- Jika Qty tidak dipilih: default ke 1.

---

## 5. Features + Functional Requirements

| ID | Fitur | Deskripsi | Implementasi Teknis | Prioritas |
|---|---|---|---|---|
| F01 | Announcement Banner | Banner di atas halaman menampilkan teks promo aktif (misal: "25% OFF"). Bisa di-dismiss. | HTML struktur banner + CSS styling. Data dari `data.js`. | **Wajib** |
| F02 | Header / Navbar | Logo brand, menu navigasi desktop, nomor telepon, ikon cart. | CSS Flexbox. Hamburger menu (toggle class) untuk mobile. | **Wajib** |
| F03 | Breadcrumb Navigasi | Tampilkan jalur: Home / Bedding / Adjustable Chill Pillow. | HTML `<nav>` + CSS styling. Data statis dari `data.js`. | **Wajib** |
| F04 | Image Gallery / Carousel | 6 gambar produk. Klik thumbnail untuk ganti gambar utama. Tombol prev/next. | Vanilla JS untuk event listener klik thumbnail & prev/next. CSS transition. | **Wajib** |
| F05 | Product Info Tab (Benefits/Best For/Bonuses) | 3 tab yang menampilkan konten berbeda (list poin). Tab aktif di-highlight. | Vanilla JS: toggle class `active` pada tab dan konten panel. | **Wajib** |
| F06 | Blok Harga & Promo | Harga normal (strikethrough + warna abu), harga promo (warna oranye/merah), badge % OFF, teks "Save $X". | HTML + CSS. Data harga dari `data.js`. | **Wajib** |
| F07 | Size Selector | Dropdown pilih ukuran (Queen/King). Saat ganti ukuran, harga dan info lain menyesuaikan. | HTML `<select>` + JS event listener `onChange`. Update DOM. | **Wajib** |
| F08 | Quantity Selector | Dropdown pilih jumlah (1–10). Default: 1. | HTML `<select>` atau tombol +/-. Default value = 1. | **Wajib** |
| F09 | Tombol Add to Cart | CTA utama. Saat diklik, tampilkan feedback (alert, perubahan teks, atau animasi). | Vanilla JS: `addEventListener click`. Tidak perlu integrasi cart session. | **Wajib** |
| F10 | Sticky Header saat Scroll | Setelah scroll melewati section produk, header sticky muncul dengan nama produk, ukuran, harga, dan tombol Add to Cart. | JS: `window.addEventListener("scroll")`. CSS `position: sticky/fixed`. | **Wajib** |
| F11 | Section Fitur Produk (Feature Cards) | 3 kartu: Deconstructed Design, Easy to Adjust, Cooling Cover. Masing-masing berisi ikon, judul, deskripsi. | HTML + CSS Grid/Flexbox. Data dari `data.js`. | **Wajib** |
| F12 | Section Detail (2 Kolom Gambar + Teks) | 2 panel: gambar produk di satu sisi, teks penjelasan di sisi lain. Layout bergantian (alternating). | CSS Grid atau Flexbox. Responsive: 1 kolom di mobile. | **Wajib** |
| F13 | FAQ Accordion | 7 item accordion (Product Specifications, Shipping/Warranty/Returns, + 5 FAQ). Expand/collapse saat diklik. | Vanilla JS: toggle class atau atribut. CSS transition `height/max-height`. | **Wajib** |
| F14 | Spesifikasi Produk (dalam accordion) | Ukuran, material cover, material fill, fill weight, sertifikasi OEKO-TEX, instruksi perawatan. | HTML definition list atau table di dalam accordion. | **Wajib** |
| F15 | Social Proof Counter | Counter animasi angka "43,000+ Mattresses Donated". | JS: animasi increment angka saat elemen masuk viewport (`IntersectionObserver`). | Opsional |
| F16 | Need Help Section | Gambar agent, teks, tombol "Chat". | HTML + CSS. Tombol Chat bisa link ke `mailto` atau trigger chat widget dummy. | **Wajib** |
| F17 | Newsletter Signup (Footer) | Input email + tombol Join. Validasi format email dasar. | HTML form + JS validasi email regex. Tampilkan pesan sukses. | Opsional |
| F18 | Footer Navigasi | 3 kolom navigasi (Shop, About, Support) + info kontak + social media icons. | HTML + CSS Grid. Data link dari `data.js`. | **Wajib** |
| F19 | Responsif Mobile | Layout menyesuaikan di lebar layar < 768px. Hamburger menu aktif. Galeri swipeable. | CSS Media Queries. Breakpoint: 768px dan 480px. | **Wajib** |
| F20 | Data Lokal (data.js) | Semua konten produk (nama, harga, gambar, fitur, spesifikasi, FAQ) disimpan dalam objek/array JS. | File `data.js` dengan export/const. `app.js` membaca data dan render ke DOM. | **Wajib** |

---

## 6. User Stories

Format: *Sebagai [tipe pengguna], saya ingin [tindakan], agar [manfaat].*

| ID | Sebagai | Saya ingin... | Agar... | Fitur Terkait |
|---|---|---|---|---|
| US-01 | Pengunjung Baru | melihat foto produk dari berbagai sudut pandang | saya dapat memahami tampilan fisik produk sebelum membeli | Galeri carousel 6 gambar dengan thumbnail |
| US-02 | Calon Pembeli | membaca keunggulan produk dalam format tab (Benefits, Best For, Bonuses) | saya dapat dengan cepat menemukan informasi yang relevan dengan kebutuhan saya | Tab panel dengan toggle konten |
| US-03 | Pengguna Sadar Harga | melihat harga promo, persentase diskon, dan jumlah penghematan secara jelas | saya merasa yakin mendapatkan penawaran terbaik | Blok harga dengan badge OFF dan teks "Save $30" |
| US-04 | Pembeli yang Membutuhkan Ukuran Tertentu | memilih ukuran bantal (Queen atau King) sebelum menambah ke keranjang | saya mendapatkan produk dengan ukuran yang sesuai kebutuhan saya | Dropdown size selector dengan update info harga |
| US-05 | Pembeli yang Ingin Beli Banyak | memilih jumlah produk (1–10) sebelum checkout | saya dapat membeli lebih dari satu produk dalam satu transaksi | Qty dropdown selector |
| US-06 | Pengguna yang Sudah Scroll Jauh | melihat sticky header dengan tombol Add to Cart saat scroll ke bawah | saya tidak perlu scroll kembali ke atas untuk menambah produk ke keranjang | Sticky header responsif saat scroll |
| US-07 | Pengguna yang Ingin Tahu Detail Teknis | membuka accordion FAQ dan Spesifikasi untuk membaca detail material dan ukuran | saya mendapat informasi lengkap sebelum memutuskan membeli | Accordion expand/collapse 7 item |
| US-08 | Pengguna yang Ragu | membaca informasi garansi, return policy, dan free shipping | saya merasa aman dan percaya untuk melakukan pembelian | Accordion "Shipping, Warranty & Returns" |
| US-09 | Pengguna Mobile | mengakses halaman dengan nyaman di layar smartphone | saya mendapat pengalaman yang sama baiknya seperti di desktop | Responsive design, hamburger menu, 1-kolom layout |
| US-10 | Pengguna yang Membutuhkan Bantuan | menemukan informasi kontak atau tombol chat dengan mudah | saya dapat mendapatkan bantuan dari tim Leesa jika ada pertanyaan | Section "Need Help" dengan tombol Chat |
| US-11 | Developer (Konteks Bootcamp) | merender semua data produk dari file `data.js` ke dalam halaman | saya memahami cara kerja penyimpanan data lokal dan manipulasi DOM | File `data.js` + rendering via `app.js` |
| US-12 | Pengguna yang Peduli Lingkungan | melihat informasi social impact (mattresses donated, sustainability) | saya merasa pembelian saya berkontribusi pada dampak sosial yang positif | Section social proof dan sustainability |

---

## 7. Acceptance Criteria

Kriteria penerimaan mendefinisikan kondisi yang harus dipenuhi agar sebuah fitur dianggap selesai dan diterima.

### AC-01: Image Gallery

- ✅ Halaman menampilkan 1 gambar utama produk secara default (gambar pertama).
- ✅ Terdapat minimal 6 thumbnail gambar yang dapat diklik.
- ✅ Klik thumbnail mengganti gambar utama tanpa reload halaman.
- ✅ Tombol "Next" dan "Previous" berfungsi untuk berpindah antar gambar.
- ✅ Thumbnail yang aktif memiliki visual highlight (border/opacity berbeda).

### AC-02: Tab Informasi Produk (Benefits/Best For/Bonuses)

- ✅ Terdapat 3 tab yang dapat diklik: Benefits, Best For, Bonuses.
- ✅ Hanya satu konten tab yang tampil pada satu waktu.
- ✅ Tab aktif memiliki styling berbeda (underline atau warna berbeda).
- ✅ Konten Benefits menampilkan minimal 3 poin keunggulan produk.
- ✅ Konten Best For menampilkan informasi jaminan (free shipping, trial, warranty).
- ✅ Pergantian tab tidak menyebabkan halaman reload atau scroll ke atas.

### AC-03: Blok Harga

- ✅ Harga normal ditampilkan dengan strikethrough dan warna abu-abu.
- ✅ Harga promo ditampilkan lebih besar dengan warna kontras (oranye/merah).
- ✅ Badge "25% OFF" ditampilkan di dekat harga.
- ✅ Teks "Save $30" tampil untuk menunjukkan penghematan.
- ✅ Harga pada sticky header sinkron dengan pilihan ukuran.

### AC-04: Size Selector

- ✅ Dropdown menampilkan pilihan Queen dan King.
- ✅ Nilai default adalah Queen saat halaman pertama dibuka.
- ✅ Perubahan ukuran mengupdate informasi harga jika berbeda.
- ✅ Pilihan ukuran tersinkron antara form utama dan sticky header.

### AC-05: Tombol Add to Cart

- ✅ Tombol "Add to Cart" terlihat jelas dengan warna kontras (oranye).
- ✅ Klik tombol menampilkan feedback visual (minimal alert atau perubahan teks).
- ✅ Teks tombol menampilkan ukuran dan harga yang dipilih (misal: "Add Queen to cart for $89").
- ✅ Tombol dapat diklik ulang setelah feedback selesai.

### AC-06: Sticky Header

- ✅ Sticky header tidak tampil saat pengguna berada di atas halaman (sebelum scroll).
- ✅ Sticky header muncul setelah pengguna scroll melewati section "Add to Cart" utama.
- ✅ Sticky header menampilkan: nama produk, ukuran aktif, harga, dan tombol Add to Cart.
- ✅ Sticky header responsif dan tidak menghalangi konten utama.

### AC-07: FAQ Accordion

- ✅ Terdapat minimal 7 item accordion.
- ✅ Klik header accordion membuka/menutup konten di bawahnya.
- ✅ Hanya satu item accordion yang terbuka pada satu waktu (atau multiple, sesuai desain).
- ✅ Accordion "Product Specifications" berisi tabel ukuran, material, dan instruksi perawatan.
- ✅ Accordion "Shipping, Warranty & Returns" berisi detail pengiriman, garansi, dan return.
- ✅ Terdapat animasi expand/collapse (CSS transition).

### AC-08: Responsivitas

- ✅ Di layar desktop (>= 1024px): layout dua kolom untuk galeri + info produk.
- ✅ Di tablet (768px – 1023px): layout menyesuaikan, nav mungkin collapsible.
- ✅ Di mobile (< 768px): layout satu kolom, hamburger menu aktif, galeri full-width.
- ✅ Semua teks terbaca tanpa horizontal scroll.
- ✅ Gambar tidak overflow keluar dari container.

### AC-09: Data Lokal (data.js)

- ✅ Semua data produk (nama, harga, gambar, fitur, FAQ, footer) didefinisikan di `data.js`.
- ✅ `app.js` membaca data dari `data.js` dan melakukan render ke DOM.
- ✅ Mengubah nilai di `data.js` langsung mempengaruhi tampilan halaman.
- ✅ Tidak ada hardcode data produk langsung di `index.html` (data harus dari `data.js`).

### AC-10: Breadcrumb

- ✅ Breadcrumb menampilkan: Home > Bedding > Adjustable Chill Pillow.
- ✅ "Home" dan "Bedding" berupa link (href bisa `#` untuk simulasi).
- ✅ "Adjustable Chill Pillow" adalah teks non-link (current page).

---

## 8. Constraints + Technical Considerations

### 8.1 Batasan Teknis (Constraints)

| Constraint | Keterangan |
|---|---|
| **Bahasa Pemrograman** | Hanya HTML5, CSS3, dan Vanilla JavaScript (ES6+). Dilarang menggunakan framework atau library JS (React, Vue, jQuery, dll.). |
| **Backend / API** | Tidak ada backend. Tidak ada API call. Semua data bersumber dari file `data.js` lokal. |
| **Database** | Tidak ada database. State sementara (pilihan size, qty) disimpan di variabel JS atau `localStorage` opsional. |
| **Bundler / Build Tool** | Tidak diperlukan. Cukup file HTML, CSS, JS yang dibuka langsung di browser (bisa via Live Server VS Code). |
| **Browser Support** | Target: Chrome, Firefox, Edge versi terbaru. Tidak perlu mendukung IE11. |
| **Gambar Produk** | Gunakan gambar dari URL Leesa CDN yang sudah ada, atau download dan simpan lokal di folder `/images/`. |
| **Responsivitas** | Wajib responsif minimal di dua breakpoint: desktop (>= 768px) dan mobile (< 768px). |
| **Aksesibilitas Dasar** | Gunakan atribut `alt` pada semua gambar. Gunakan elemen HTML semantik (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`). |
| **Performance** | Tidak ada target khusus, namun hindari file CSS/JS yang tidak digunakan. Optimalkan gambar jika disimpan lokal. |

### 8.2 Struktur File yang Direkomendasikan

Struktur direktori proyek:

```
/project-root
  ├── index.html          # Halaman utama detail produk
  ├── style.css           # Semua styling (atau dipecah per komponen)
  ├── app.js              # Logika interaktivitas & rendering DOM
  ├── data.js             # Data produk lokal (objek/array JS)
  └── /images             # Folder gambar produk (opsional, jika lokal)
        ├── pillow-01.jpg
        ├── pillow-02.jpg
        └── ...
```

### 8.3 Struktur Data Lokal (data.js)

Contoh skema `data.js` yang direkomendasikan:

```javascript
const productData = {
  id: 'adjustable-chill-pillow',
  name: 'Adjustable Chill Pillow',
  brand: 'Leesa',
  category: 'Bedding',
  breadcrumb: ['Home', 'Bedding', 'Adjustable Chill Pillow'],
  promo: { badge: '25% OFF', save: 30 },
  sizes: [
    { name: 'Queen', dimensions: '20" x 30"', price: 89, originalPrice: 119, fillWeight: '80 oz.' },
    { name: 'King',  dimensions: '20" x 36"', price: 89, originalPrice: 119, fillWeight: '90 oz.' },
  ],
  images: ['images/pillow-01.jpg', 'images/pillow-02.jpg'],
  tabs: {
    benefits: ['Fully adjustable fill...', 'Cool-to-the-touch cover...', 'OEKO-TEX certified...'],
    bestFor:  ['Free shipping and returns.', '30-night risk-free trial.', '1-year limited warranty.'],
    bonuses:  ['...'],
  },
  features: [
    { icon: 'pressure-relief.svg', title: 'Deconstructed design', desc: '...' },
    { icon: 'snap.svg',            title: 'Easy to adjust',       desc: '...' },
    { icon: 'mesh.svg',            title: 'Cooling cover',        desc: '...' },
  ],
  specifications: { size: {}, materials: {}, fillWeight: {}, care: {} },
  faq: [ { q: 'How does it work?', a: '...' } ],
  shipping: { freeShipping: true, trial: '30-day', warranty: '1-year' },
  socialProof: { mattressesDonated: 43000 },
};
```

### 8.4 Pertimbangan Teknis Tambahan

- Gunakan CSS Custom Properties (`--color-primary`, `--font-size-base`) untuk konsistensi tema.
- `IntersectionObserver` API untuk trigger animasi counter "Mattresses Donated" saat elemen masuk viewport.
- Gunakan event delegation untuk komponen yang di-render dinamis.
- Hindari inline style di HTML; semua styling via CSS classes.
- Pisahkan logika rendering (render fungsi) dari logika bisnis (event handler) di `app.js`.
- Gunakan atribut `data-*` untuk menyimpan metadata pada elemen HTML (`data-index`, `data-size`).

---

## 9. Success Criteria & Metrics

### 9.1 Kriteria Keberhasilan Fungsional

Halaman dianggap berhasil secara fungsional apabila semua item berikut terpenuhi:

- **[SC-F01]** Semua fitur "Wajib" (F01–F14, F16–F19) berjalan tanpa error di browser Chrome/Firefox terbaru.
- **[SC-F02]** Halaman dapat dibuka langsung dari file sistem (`file://`) atau via Live Server tanpa konfigurasi tambahan.
- **[SC-F03]** Semua data produk berhasil di-render dari `data.js` ke halaman — tidak ada data yang hardcode di `index.html`.
- **[SC-F04]** Semua interaksi JS (tab, carousel, accordion, size selector, add to cart) berjalan tanpa error di console browser.
- **[SC-F05]** Sticky header muncul saat scroll dan menampilkan data yang sinkron dengan pilihan pengguna.
- **[SC-F06]** Halaman responsif dan tidak ada horizontal scroll di viewport 375px (mobile) dan 1440px (desktop).
- **[SC-F07]** Semua gambar memiliki atribut `alt` yang deskriptif.
- **[SC-F08]** Tombol Add to Cart memberikan feedback yang jelas kepada pengguna.

### 9.2 Kriteria Keberhasilan Desain

- **[SC-D01]** Warna brand digunakan konsisten: hijau gelap (`#1A3C34`) untuk header/CTA sekunder, oranye (`#C46B2A`) untuk harga promo dan CTA utama.
- **[SC-D02]** Typography hierarkis: H1 > H2 > H3 > body text terbaca jelas.
- **[SC-D03]** Spacing dan padding konsisten antar section (gunakan CSS custom properties).
- **[SC-D04]** Gambar produk tampil dengan rasio aspek yang benar tanpa distorsi.
- **[SC-D05]** Visual desain menyerupai tampilan asli Leesa.com dalam hal layout, warna, dan tipografi utama.

### 9.3 Kriteria Keberhasilan Kode (Code Quality)

- **[SC-C01]** Kode HTML valid (dapat dicek via W3C Validator).
- **[SC-C02]** Tidak ada error JavaScript di browser console.
- **[SC-C03]** CSS terorganisir (dikelompokkan per komponen: reset, layout, header, gallery, product-info, features, faq, footer).
- **[SC-C04]** Penamaan variabel dan fungsi JS deskriptif (camelCase, kata kerja untuk fungsi).
- **[SC-C05]** Tidak ada kode yang di-comment out atau dead code.
- **[SC-C06]** Pemisahan yang jelas antara data (`data.js`), logika (`app.js`), dan struktur (`index.html`).

### 9.4 Metrik Penilaian (Bootcamp)

| Kriteria | Bobot | Keterangan |
|---|:---:|---|
| Implementasi HTML Semantik | **25%** | Penggunaan tag semantik yang tepat, struktur heading, aksesibilitas dasar |
| Styling CSS & Responsivitas | **25%** | Layout akurat, responsive 2 breakpoint, konsistensi desain |
| Interaktivitas Vanilla JS | **25%** | Tab, carousel, accordion, size selector, add to cart, sticky header bekerja |
| Integrasi Data Lokal (data.js) | **15%** | Semua konten di-render dari `data.js`, tidak ada hardcode di HTML |
| Kualitas Kode | **10%** | Kode bersih, terstruktur, nama variabel/fungsi deskriptif, tidak ada error |

---

*Dokumen ini dibuat untuk keperluan latihan front-end development dalam konteks bootcamp.*  
*Referensi produk: Leesa Adjustable Chill Pillow — leesa.com*  
*Dibuat dengan Chrome DevTools MCP + Python python-docx | Oktober 2026*