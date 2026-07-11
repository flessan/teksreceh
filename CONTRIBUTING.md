# Kontribusi ke teksreceh

Makasih udah tertarik kontribusi ke **teksreceh** 🗿

Panduan ini bantu kamu supaya PR/issue kamu cepat di-review dan cepat di-merge.

---

## 🎯 Filosofi Proyek

teksreceh dibuat dengan prinsip:

1. **Museum, bukan gudang.** Setiap generator harus punya konteks (asal-usul, contoh, FAQ), bukan cuma output.
2. **Simple by default, powerful on demand.** Advanced option (Persona, slider) baru muncul saat toggle Advanced.
3. **Zero infra.** Tidak boleh ada backend, API eksternal, atau tracker.
4. **Ringan.** Bundle harus tetap kecil - jangan install library besar untuk hal yang bisa ditulis 30 baris.
5. **Ramah pemula.** Menambah generator baru cukup **1 fungsi + 1 objek konfig**.

---

## 🐛 Melaporkan Bug

1. Cek dulu apakah bug sudah ada di [Issues](https://github.com/flessan/teksreceh/issues).
2. Kalau belum, buka issue baru pakai template **Bug Report**.
3. Sertakan:
   - Langkah reproduce
   - Expected vs actual behavior
   - Browser + OS
   - Screenshot / video (opsional tapi sangat membantu)

## 💡 Request Generator Baru

Buka issue pakai template **Generator Request** dan sertakan:

- Nama generator
- Kategori (Meme Indonesia, Gaming, Developer, dll)
- Contoh input → output
- Sumber tren (link tweet, video TikTok, kolom komentar, dll)

## 🎨 Request Fitur / Perbaikan UI

Buka issue **Feature Request** dulu sebelum ngoding fitur besar, biar tidak wasted effort kalau arahnya beda.

---

## 🛠️ Setup Development

```bash
git clone https://github.com/flessan/teksreceh.git
cd teksreceh
npm install
npm run dev
```

Butuh **Node.js 20+**.

Cek build sebelum PR:

```bash
npm run build
```

---

## ➕ Cara Menambah Generator Baru

### Step 1 - Tulis transformer

Edit `src/transformers/text.ts`.

```ts
const gaulSekali = (input: string, context: TransformContext) => {
  const intensity = optionNumber(context, "intensity", 5);
  const suffix = intensity > 7 ? " cuy" : "";
  return input.replace(/aku/gi, "gw").replace(/kamu/gi, "lu") + suffix;
};
```

Tambahkan ID ke union `TransformerId`:

```ts
export type TransformerId =
  | "alay"
  | "uwu"
  | // ...
  | "gaulSekali";
```

Daftarkan di `transformers`:

```ts
export const transformers: Record<TransformerId, Transformer> = {
  // ...
  gaulSekali,
};
```

### Step 2 - Tambah konfigurasi

Edit `src/data/generators.ts` dan push konfigurasi baru:

```ts
{
  id: "gaul-sekali",
  slug: "gaul-sekali",
  title: "Gaul Sekali",
  description: "Ubah aku/kamu jadi gw/lu ala anak tongkrongan.",
  category: "Tongkrongan",
  icon: "🕶️",
  keywords: ["gaul", "gw", "lu", "tongkrongan"],
  transformer: "gaulSekali",
  defaultInput: "aku suka kamu tapi kamu tidak sadar",
  origin: "Slang tongkrongan +62 yang sudah lama hidup di forum, warnet, dan grup chat.",
  examples: [
    { input: "aku suka kamu", output: "gw suka lu" },
  ],
  faq: [
    {
      question: "Apakah bisa dipakai untuk chat serius?",
      answer: "Ya bisa, terutama kalau kamu emang anak tongkrongan sejati.",
    },
  ],
  options: [
    { id: "intensity", label: "Intensity", type: "range", min: 1, max: 10, step: 1, defaultValue: 5 },
  ],
  featured: false,
}
```

### Step 3 - Update `public/sitemap.xml` (opsional)

Kalau kamu mau generator baru masuk sitemap, tambahkan entry:

```xml
<url><loc>https://text.thio.qzz.io/gaul-sekali</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
```

### Step 4 - Build & test

```bash
npm run build
npm run preview
```

Buka `http://localhost:4173`, cari generator kamu di dropdown, coba typing.

### Step 5 - Buka PR

Beri deskripsi:
- Nama generator
- Kategori
- Screenshot input → output
- Sumber tren (biar reviewer bisa cek konteks)

---

## 🎭 Cara Menambah Persona Baru

Edit `src/data/generators.ts`:

```ts
export const personas: Array<{ id: PersonaId; label: string; description: string }> = [
  // ...
  { id: "warnet-2009", label: "Warnet 2009", description: "Bahasa era warnet: capslock, singkatan, dan emoji ASCII." },
];
```

Tambahkan ID ke union `PersonaId` di `src/types/generator.ts`.

Lalu di `src/transformers/text.ts`, tambahkan transformer persona di `personaTransformers`:

```ts
const personaTransformers: Partial<Record<PersonaId, Transformer>> = {
  // ...
  "warnet-2009": (input) => input.toUpperCase().replace(/kamu/gi, "u"),
};
```

---

## 🎨 Style Guide

- **TypeScript strict** - jangan bypass dengan `any`.
- Ikuti struktur folder yang sudah ada (`components`, `data`, `hooks`, `lib`, `transformers`, `types`, `utils`).
- Reusable → letakkan di `src/components/` atau `src/lib/`.
- Warna: pakai palet biru yang sudah didefinisikan (`bg-sky-*`, `#172033`, `#4b6386`, `#1c2a3f`, dll). Jangan bikin warna baru sembarangan.
- Neo-brutalism: `border-2`, `shadow-[Xpx_Xpx_0_#172033]`, rounded lembut.
- **Jangan tambah dependency berat** tanpa diskusi dulu di issue.

## 📝 Convention Commit

Ikuti [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(generator): add jaksel maxima generator
fix(dropdown): perbaiki dark mode background di Firefox
docs(readme): update roadmap
chore(deps): bump vite to 7.4.0
```

## 🔀 Pull Request

- Fork repo → bikin branch dari `main`.
- Nama branch: `feat/nama-fitur`, `fix/nama-bug`, `docs/topic`.
- Isi PR template.
- Pastikan `npm run build` sukses tanpa error TypeScript.
- Tag reviewer atau tunggu maintainer.

---

## 📜 Kode Etik

Baca [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Singkatnya: **be kind, be receh, don't be toxic**.

---

Kalau bingung, tanya di [Discussions](https://github.com/flessan/teksreceh/discussions) atau buka issue.

Makasih udah bantu bikin museum cara ngetik +62 makin rame 🙏🗿
