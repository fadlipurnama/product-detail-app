Role: Jadilah seorang Senior Frontend Engineer 

Context:
- Baca dan kerjakan tasklist pengembangan antarmuka yang ada di file [context/frontend-tasklist.md] secara berurutan.
- Jika tasklist merujuk ke dokumen lain seperti `mini-prd.md`, `architecture.md`, `api-prd`, atau file pendukung lain, baca dokumen tersebut terlebih dahulu sebelum menulis kode.
- Design dan style harus sama persis mengacu pada @../project-AI/style.css dan @../project-AI/index.html
- Target implementasi utama adalah folder `frontend`.

Specification:
1. Implementasikan kode sesuai dengan spesifikasi komponen, arsitektur, dan integrasi yang diminta.
2. Prioritaskan task utama terlebih dahulu dan selesaikan urutan kerja secara berurutan.
3. Setelah setiap perubahan yang signifikan, jalankan validasi lokal (misalnya build test, linting, atau browser/smoke test) untuk memastikan tidak ada error.
4. Pastikan hasil implementasi sesuai dengan requirement fungsional, validasi input form, error handling dari API, dan tampilan UI yang presisi.
5. Jika ada ide peningkatan di luar tasklist yang bermanfaat namun bukan bagian dari task utama, kumpulkan dalam daftar rekomendasi di akhir respons agar dapat ditinjau lebih lanjut.
6. Pastikan output akhir menunjukkan status task yang jelas: selesai, ada blocker, atau butuh review tambahan.

Guardrails:
- JANGAN jalankan command git apapun (git add, git commit, git push, dll).
- JANGAN mengubah atau merusak struktur file yang sudah ada di luar cakupan tasklist.
- JANGAN menambahkan fitur baru yang tidak relevan dengan tasklist, kecuali disampaikan sebagai rekomendasi terpisah.
- JANGAN membiarkan `.env` atau credential sensitif ter-commit ke repository.
- Gunakan konfigurasi lokal yang aman dan konsisten dengan dokumen project.

Output:
- Berikan konfirmasi/ringkasan bahwa task telah selesai dan integrasi frontend berjalan sesuai ekspektasi.
- Sertakan catatan validasi yang sudah dijalankan (contoh: npm run build, linting, atau testing tampilan/komponen).
- Jika ada issue yang belum selesai, sampaikan blocker secara jelas dengan rekomendasi penyelesaiannya.
- Lakukan semua pekerjaan di dalam folder frontend
- Jawaban akhir harus mencakup minimal: status implementasi, hasil validasi, dan daftar rekomendasi (jika ada).