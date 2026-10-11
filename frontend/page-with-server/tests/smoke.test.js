/**
 * smoke.test.js — Smoke test frontend
 *
 * Test ini memverifikasi bahwa modul utama dapat di-import tanpa error,
 * dan kontrak data lokal memenuhi shape yang dibutuhkan app.js.
 *
 * Jalankan: (setelah test runner dikonfigurasi, misal vitest)
 *   npx vitest run tests/smoke.test.js
 *
 * TODO: tambahkan test runner ke devDependencies dan konfigurasi vitest.config.js
 * untuk test yang lebih lengkap (mock API, render DOM, interaksi).
 */

// ─── Smoke test: config ───────────────────────────────────────────────────────
import { API_BASE_URL, PRODUCT_ID, FETCH_TIMEOUT_MS } from '../src/js/config.js';

console.assert(typeof API_BASE_URL === 'string' && API_BASE_URL.startsWith('http'),
  'API_BASE_URL harus string URL yang valid');

console.assert(Number.isInteger(PRODUCT_ID) && PRODUCT_ID > 0,
  'PRODUCT_ID harus integer positif');

console.assert(Number.isFinite(FETCH_TIMEOUT_MS) && FETCH_TIMEOUT_MS > 0,
  'FETCH_TIMEOUT_MS harus angka positif');

// ─── Smoke test: localData shape ──────────────────────────────────────────────
import { localData, localFallbackProduct } from '../src/js/data.js';

console.assert(Array.isArray(localData.nav),           'localData.nav harus array');
console.assert(Array.isArray(localData.features),      'localData.features harus array');
console.assert(Array.isArray(localData.faq),           'localData.faq harus array');
console.assert(typeof localData.socialProof === 'object', 'localData.socialProof harus object');
console.assert(typeof localData.footer === 'object',   'localData.footer harus object');

// ─── Smoke test: localFallbackProduct shape ───────────────────────────────────
const fallback = localFallbackProduct();

console.assert(typeof fallback.name === 'string' && fallback.name.length > 0,
  'fallback.name harus string non-kosong');

console.assert(typeof fallback.price === 'number' && fallback.price > 0,
  'fallback.price harus angka positif');

console.assert(Array.isArray(fallback.images) && fallback.images.length > 0,
  'fallback.images harus array non-kosong');

console.assert(Array.isArray(fallback.variants?.size) && fallback.variants.size.length > 0,
  'fallback.variants.size harus array non-kosong');

console.assert(typeof fallback.variants?.quantity === 'number',
  'fallback.variants.quantity harus number');

console.assert(typeof fallback.description === 'string' && fallback.description.length >= 10,
  'fallback.description minimal 10 karakter');

console.log('[smoke.test.js] ✓ Semua smoke test lulus');
