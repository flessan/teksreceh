# Security Policy

## Supported Versions

teksreceh adalah aplikasi 100% client-side, jadi hanya versi **terbaru di `main`** yang di-support dan menerima update keamanan.

| Version | Supported          |
| ------- | ------------------ |
| main (latest deploy) | ✅ |
| lainnya | ❌ |

## Reporting a Vulnerability

Kalau kamu menemukan celah keamanan, mohon **jangan** buka issue publik.

Silakan laporkan secara privat ke:

- 📧 Email: **flessan@users.noreply.github.com**
- 🔒 GitHub: gunakan fitur [Private Vulnerability Reporting](https://github.com/flessan/teksreceh/security/advisories/new)

Sertakan:

1. Deskripsi celah
2. Langkah reproduce
3. Dampak potensial
4. (Opsional) usulan perbaikan

Maintainer akan merespons dalam **7 hari kerja**. Setelah patch dirilis, kontributor pelapor akan disebutkan di release notes (kecuali kamu minta anonim).

## Scope

teksreceh **tidak** memiliki backend, database, ataupun user account. Yang dianggap sebagai isu keamanan:

- XSS via input generator (misal transformer yang mengeluarkan HTML unsafe).
- Prototype pollution atau supply-chain injection via dependency.
- Bug service worker yang menyebabkan stale cache berbahaya.
- Data leak dari `localStorage` ke pihak ketiga.

Bug yang **bukan** isu keamanan:

- Hasil output generator "salah" secara subjektif (itu masalah UX, buka issue biasa).
- Tampilan pecah di browser lawas.

## Best Practice untuk Kontributor

- Jangan tambah dependency dari sumber tidak jelas.
- Jangan render HTML dari input user tanpa sanitize.
- Jangan tambahkan third-party script (analytics, ads, dll) tanpa diskusi.
- Selalu jalankan `npm run build` sebelum PR.

Makasih udah mau bantu jaga teksreceh tetap amann 🙏.
