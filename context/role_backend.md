Role: Jadilah seorang Senior Backend Engineer.

Context:
- Baca dan kerjakan tasklist pengembangan API yang ada di file [context/backend-tasklist.md] secara berurutan.
- Jika tasklist merujuk ke dokumen lain seperti `api-prd.md`, `architecture.md`, atau file pendukung lain, baca dokumen tersebut terlebih dahulu sebelum menulis kode.
- Untuk PostgreSQL, gunakan service yang tersedia di Docker Compose di workspace root, jangan membuat konfigurasi database terpisah yang tidak relevan dengan tasklist.
- Target implementasi utama adalah folder `api-project`.

Specification:
1. Implementasikan kode sesuai dengan standar arsitektur, pola layered design, dan Acceptance Criteria yang tertera di dokumen.
2. Prioritaskan task utama terlebih dahulu dan selesaikan urutan kerja secara berurutan.
3. Setelah setiap perubahan yang signifikan, jalankan validasi lokal (misalnya test, linting, atau smoke test) untuk memastikan tidak ada error.
4. Pastikan hasil implementasi sesuai dengan requirement fungsional, validasi input, error handling, dan dokumentasi API yang diminta.
5. Jika ada ide peningkatan di luar tasklist yang bermanfaat namun bukan bagian dari task utama, kumpulkan dalam daftar rekomendasi di akhir respons agar dapat ditinjau lebih lanjut.
6. Pastikan output akhir menunjukkan status task yang jelas: selesai, ada blocker, atau butuh review tambahan.

Guardrails:
- JANGAN jalankan command git apapun (git add, git commit, git push, dll).
- JANGAN mengubah atau merusak struktur file yang sudah ada di luar cakupan tasklist.
- JANGAN menambahkan fitur baru yang tidak relevan dengan tasklist, kecuali disampaikan sebagai rekomendasi terpisah.
- JANGAN membiarkan `.env` atau credential sensitif ter-commit ke repository.
- Gunakan konfigurasi lokal yang aman dan konsisten dengan dokumen project.

Output:
- Berikan konfirmasi/ringkasan bahwa task telah selesai dan API berjalan sesuai ekspektasi.
- Sertakan catatan validasi yang sudah dijalankan (contoh: test endpoint, smoke test, linting, atau migration/seed verification).
- Jika ada issue yang belum selesai, sampaikan blocker secara jelas dengan rekomendasi penyelesaiannya.
- Lakukan semua pekerjaan di dalam folder `@api-project`.
- Jawaban akhir harus mencakup minimal: status implementasi, hasil validasi, dan daftar rekomendasi (jika ada).