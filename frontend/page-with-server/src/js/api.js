/**
 * api.js — Modul komunikasi ke backend API
 * Semua pemanggilan fetch terpusat di sini; fungsi render tidak boleh fetch langsung.
 *
 * Kontrak data (sesuai api-prd.md § 6.1):
 *
 * @typedef {Object} ProductImage
 * @property {string} url       - URL gambar absolut
 * @property {string} [alt]     - Teks alternatif (opsional)
 * @property {number} [position] - Urutan gallery (opsional)
 *
 * @typedef {Object} ProductVariants
 * @property {string[]} size     - Daftar ukuran yang tersedia, e.g. ["Queen","King"]
 * @property {string[]} color    - Daftar warna yang tersedia, e.g. []
 * @property {number}   quantity - Stok tersedia (bukan qty pembelian UI)
 *
 * @typedef {Object} ProductPromo
 * @property {string} [badge]    - Label diskon, e.g. "25% OFF"
 * @property {number} [save]     - Nominal potongan harga
 *
 * @typedef {Object} Product
 * @property {number|string} id           - ID produk
 * @property {string}        name         - Nama produk
 * @property {number}        price        - Harga jual (selling price)
 * @property {string}        currency     - Kode mata uang ISO-4217, e.g. "USD"
 * @property {string}        image        - URL foto utama
 * @property {ProductImage[]} images      - Semua foto produk terurut position
 * @property {ProductVariants} variants   - Variasi produk
 * @property {string}        description  - Deskripsi produk
 * @property {number}        [originalPrice] - Harga asli sebelum diskon
 * @property {ProductPromo}  [promo]      - Info promosi
 * @property {string}        [createdAt]  - Timestamp ISO-8601
 */

import {
  API_BASE_URL,
  FETCH_TIMEOUT_MS,
} from "./config.js";

/**
 * Normalisasi response API agar selalu dalam format { images: ProductImage[] }
 * yang konsisten untuk dirender, terlepas dari variasi format backend.
 *
 * @param {Object} raw - Object data dari response API
 * @returns {Product}
 */
function normalizeProduct(raw) {
  // ── Normalisasi images ──────────────────────────────────────────────────────
  // Backend (mapper.js) mengembalikan: [{ url, alt, position, isPrimary, id }]
  // Fallback untuk format lain: string array, atau field imageUrl/src
  let images = [];
  if (Array.isArray(raw.images)) {
    images = raw.images
      .map((img, i) => {
        if (typeof img === "string") {
          return { url: img, alt: raw.name || "Product image", position: i };
        }
        return {
          url: img.url || img.imageUrl || img.image_url || img.src || "",
          alt:
            img.alt ||
            img.altText ||
            img.alt_text ||
            raw.name ||
            "Product image",
          position: img.position ?? i,
        };
      })
      .filter((img) => img.url); // buang entry tanpa URL
  }

  // Fallback: pakai field `image` (primary image) jika `images` kosong
  if (!images.length && raw.image) {
    images = [
      { url: raw.image, alt: raw.name || "Product image", position: 0 },
    ];
  }

  // ── Normalisasi variants ────────────────────────────────────────────────────
  // Format backend (PostgreSQL): array of objects → [{ color, size, quantity }]
  // Format api-prd (in-memory)  : object          → { size:[], color:[], quantity }
  let variants;

  if (Array.isArray(raw.variants)) {
    // Format backend PostgreSQL — konversi ke format yang diharapkan UI
    const sizes = [...new Set(raw.variants.map((v) => v.size).filter(Boolean))];
    const colors = [
      ...new Set(raw.variants.map((v) => v.color).filter(Boolean)),
    ];
    // Ambil stok minimum dari semua varian yang tersedia (most conservative)
    const minQty = raw.variants.length
      ? Math.min(...raw.variants.map((v) => v.quantity ?? 0))
      : 0;
    // Total stok untuk ditampilkan (jumlah semua varian)
    const totalQty = raw.variants.reduce(
      (sum, v) => sum + (v.quantity ?? 0),
      0,
    );

    variants = {
      size: sizes,
      color: colors,
      quantity: totalQty,
      // Simpan array asli untuk referensi (stok per kombinasi)
      _raw: raw.variants,
    };
  } else if (raw.variants && typeof raw.variants === "object") {
    // Format api-prd in-memory — langsung pakai
    variants = {
      size: raw.variants.size ?? [],
      color: raw.variants.color ?? [],
      quantity: raw.variants.quantity ?? 0,
    };
  } else {
    variants = { size: [], color: [], quantity: 0 };
  }

  return {
    id: raw.id,
    name: raw.name ?? "",
    price: Number(raw.price) || 0,
    currency: raw.currency ?? "USD",
    image: raw.image ?? images[0]?.url ?? "",
    images,
    variants,
    description: raw.description ?? "",
    originalPrice:
      raw.originalPrice != null ? Number(raw.originalPrice) : undefined,
    promo: raw.promo ?? undefined,
    createdAt: raw.createdAt ?? undefined,
  };
}

/**
 * Ambil detail satu produk dari backend.
 *
 * @param {number|string} id - ID produk
 * @param {AbortSignal}  [signal] - AbortController signal untuk cancel request
 * @returns {Promise<Product>}
 * @throws {Error} dengan properti .status (number) dan .type ('network'|'not_found'|'server'|'timeout')
 */
export async function fetchProductById(id, signal) {
  const url = `${API_BASE_URL}/products/${id}`;

  // Buat AbortController internal untuk timeout jika tidak ada signal eksternal
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(),
    FETCH_TIMEOUT_MS,
  );

  // Gabungkan signal eksternal dan timeout signal
  const combinedSignal = signal
    ? AbortSignal.any
      ? AbortSignal.any([signal, timeoutController.signal])
      : timeoutController.signal
    : timeoutController.signal;

  try {
    const response = await fetch(url, {
      signal: combinedSignal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      const err = new Error(`Product with id ${id} not found.`);
      err.status = 404;
      err.type = "not_found";
      throw err;
    }

    if (!response.ok) {
      const err = new Error(
        `API error: ${response.status} ${response.statusText}`,
      );
      err.status = response.status;
      err.type = "server";
      throw err;
    }

    const json = await response.json();

    // Response envelope: { data: Product } sesuai api-prd.md § 6.0
    const raw = json.data ?? json;
    return normalizeProduct(raw);
  } catch (err) {
    clearTimeout(timeoutId);

    // Request dibatalkan (timeout atau caller abort)
    if (err.name === "AbortError") {
      const timeoutErr = new Error("Request timed out. Please try again.");
      timeoutErr.status = 0;
      timeoutErr.type = "timeout";
      throw timeoutErr;
    }

    // Error 404 (produk tidak ditemukan) — tidak perlu fallback, ini valid error
    if (err.type === "not_found") throw err;

    // Error server (5xx) atau validasi (4xx selain 404)
    if (err.type === "server" || err.type === "timeout") {
      console.warn("[api.js] Server error", err.message);
      throw err;
    }

    const networkErr = new Error(
      "Tidak dapat terhubung ke server. Periksa koneksi Anda.",
    );
    networkErr.status = 0;
    networkErr.type = "network";
    throw networkErr;
  }
}
