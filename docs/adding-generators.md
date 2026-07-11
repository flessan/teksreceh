# Menambah Generator Baru - Step by Step

Panduan lengkap dengan contoh nyata. Ikuti dari atas ke bawah.

## Contoh Kasus

Kita mau bikin generator **"Bahasa Warnet 2009"** yang:

- Mengubah "kamu" → "u", "aku" → "gue"
- Semua huruf jadi UPPERCASE
- Tambahkan `":D"` random di akhir kata

## 1. Tambah `TransformerId`

`src/transformers/text.ts`

```ts
export type TransformerId =
  | "alay"
  | "uwu"
  // ... existing
  | "warnet2009"; // 👈 tambah di sini
```

## 2. Tulis Transformer

Masih di `src/transformers/text.ts`, tambahkan fungsi transformer:

```ts
const warnet2009 = (input: string, _context: TransformContext) => {
  const words = input
    .replace(/\baku\b/gi, "gue")
    .replace(/\bkamu\b/gi, "u")
    .toUpperCase()
    .split(" ");

  return words
    .map((word) => (Math.random() < 0.15 ? `${word} :D` : word))
    .join(" ");
};
```

Daftarkan di objek `transformers`:

```ts
export const transformers: Record<TransformerId, Transformer> = {
  // ...
  warnet2009,
};
```

## 3. Tambah Konfigurasi

`src/data/generators.ts` - cari array `generators` dan push:

```ts
{
  id: "warnet-2009",
  slug: "warnet-2009",
  title: "Warnet 2009",
  description: "Bahasa gaul era warnet: caps, singkatan, dan smiley :D",
  category: "Meme Indonesia",
  icon: "💾",
  keywords: ["warnet", "2009", "old school", "chat lawas"],
  transformer: "warnet2009",
  defaultInput: "aku kangen kamu",
  origin:
    "Era warnet 2009 ditandai chat MIRC, Facebook awal, dan Yahoo Messenger. Bahasanya penuh caps lock, smiley klasik, dan singkatan spontan.",
  examples: [
    { input: "aku kangen kamu", output: "GUE KANGEN U :D" },
    { input: "kamu lagi apa", output: "U LAGI APA" },
  ],
  faq: [
    {
      question: "Bedanya sama Alay Generator?",
      answer:
        "Alay Generator fokus ke angka & huruf besar-kecil. Warnet 2009 fokus ke singkatan dan smiley klasik era warnet.",
    },
  ],
  featured: false,
}
```

## 4. (Opsional) Tambah Slider

Kalau mau atur seberapa sering smiley `:D` muncul:

```ts
options: [
  {
    id: "smileyRate",
    label: "Smiley Rate",
    type: "range",
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 3,
    hint: "0 = tanpa smiley, 10 = smiley di semua kata.",
  },
],
```

Update transformer untuk baca opsi:

```ts
const warnet2009 = (input: string, context: TransformContext) => {
  const rate = optionNumber(context, "smileyRate", 3) / 10;
  const words = input
    .replace(/\baku\b/gi, "gue")
    .replace(/\bkamu\b/gi, "u")
    .toUpperCase()
    .split(" ");

  return words
    .map((word) => (Math.random() < rate ? `${word} :D` : word))
    .join(" ");
};
```

Slider ini hanya muncul saat user membuka **Advanced**. Untuk pengguna biasa, `defaultValue` yang dipakai.

## 5. Tambahkan ke Sitemap (opsional)

`public/sitemap.xml`

```xml
<url>
  <loc>https://text.thio.qzz.io/warnet-2009</loc>
  <changefreq>monthly</changefreq>
  <priority>0.6</priority>
</url>
```

## 6. Build & Test

```bash
npm run build
npm run preview
```

Buka `http://localhost:4173`, cari **Warnet 2009** di dropdown, coba ketik.

## 7. Cek Checklist

- [ ] Generator muncul di dropdown (di kategori yang benar)
- [ ] Muncul di command palette (`Ctrl+K` → cari "warnet")
- [ ] Output realtime bekerja
- [ ] Klik Random → contoh muncul
- [ ] Copy button jalan
- [ ] Kalau ada slider: gerakkan slider → output berubah
- [ ] Dark mode oke
- [ ] Mobile (360px) tidak pecah

## 8. Commit & PR

```bash
git checkout -b feat/warnet-2009-generator
git add -A
git commit -m "feat(generator): add warnet 2009 generator"
git push origin feat/warnet-2009-generator
```

Buka PR pakai template. Selesai 🗿

## Tips

- **Bikin transformer deterministik kalau bisa.** Kalau memakai `Math.random`, seed di-bump saat swap/random dari `GeneratorWorkspace`.
- **Escape special chars.** Kalau input mengandung regex/HTML, jangan langsung inject ke output tanpa sanitize.
- **Beri contoh yang bermakna.** Contoh yang bagus = generator langsung dimengerti dalam 3 detik.
- **FAQ singkat.** Cukup 1–3 pertanyaan yang benar-benar sering ditanyakan.
