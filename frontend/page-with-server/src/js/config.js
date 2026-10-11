/**
 * config.js — Konfigurasi environment frontend
 *
 * Vite mengekspos env var dengan prefix VITE_ ke browser melalui import.meta.env.
 * Definisikan nilai di .env.local (development) atau env platform deployment (production).
 * Lihat .env.example untuk daftar variabel yang didukung.
 *
 * CORS NOTE:
 * Saat development dengan `npm run dev`, gunakan URL relative `/api` (tanpa host)
 * agar request melewati Vite proxy di vite.config.js → localhost:3000.
 * Jangan gunakan `http://localhost:3000/api` langsung — browser akan blokir karena CORS.
 *
 * Saat production (`npm run build`), isi VITE_API_BASE_URL dengan URL backend yang sudah
 * dikonfigurasi CORS-nya, atau pastikan frontend dan backend satu domain/origin.
 */

/**
 * Base URL API.
 * - Development: '/api' → diteruskan Vite proxy ke http://localhost:3000/api
 * - Production: isi VITE_API_BASE_URL di environment deployment
 */
export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ?? '/api';

/** ID produk yang ditampilkan di halaman ini (Leesa Adjustable Chill Pillow) */
export const PRODUCT_ID = Number(import.meta.env?.VITE_PRODUCT_ID ?? 1);

/** Timeout request fetch dalam milidetik */
export const FETCH_TIMEOUT_MS = 10_000;

/**
 * Aktifkan fallback data lokal ketika backend tidak tersedia.
 * Berguna saat development offline — set ke false di production.
 */
// export const USE_LOCAL_FALLBACK = true;
