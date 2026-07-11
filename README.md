<div align="center">

# 🗿 teksreceh

**Generator Teks Paling Ngaco Se-Indonesia.**

Museum cara ngetik netizen +62 - mulai dari **Alay**, **UwU**, **Rimsvek**, sampai **Binary**.
Ringan, client-side, offline-ready, dan open source.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Made with React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Built with Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Styled with Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deploy on Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[Demo](https://text.thio.qzz.io) • [Kontribusi](./CONTRIBUTING.md) • [Roadmap](#-roadmap) • [Report Bug](https://github.com/flessan/teksreceh/issues/new?template=bug_report.yml) • [Request Generator](https://github.com/flessan/teksreceh/issues/new?template=generator_request.yml)

</div>

---

## ✨ Kenapa teksreceh?

Website ini **bukan sekadar text tools**.
teksreceh berfokus jadi **museum budaya mengetik netizen Indonesia**: gaya alay 2010, uwu wibu, rimsvek, bocil ML/FF, bahasa Jaksel, sampai copypasta grup WA.

Banyak website luar punya fancy font generator, tapi hampir nggak ada yang mengarsipkan **cara ngetik khas Indonesia**. teksreceh mencoba mengisi celah itu.

### Prinsip

- **Instant.** Tidak ada tombol Generate - semua realtime.
- **Simple by default.** Advanced option (Persona, slider, dll) baru muncul saat kamu butuh.
- **Mobile-first.** Layout terasa seperti app, bukan artikel.
- **Privacy-first.** Semua transformasi jalan di browser. Tidak ada backend, tidak ada tracking.
- **Zero infra.** Bisa dihosting gratis di GitHub Pages, Netlify, lainnya.

---

## 🧩 Fitur

- **50+ generator** dalam 9 kategori (Meme Indonesia, Tongkrongan, Gaming, Sosial Media, Developer, Fancy Text, Unicode, Utilities, Sosial Media).
- **Realtime transformer** dengan output langsung berubah saat mengetik.
- **Persona system** untuk mengubah gaya bahasa (Alay 2010, Wibu, Rimsvek, Discord Mod, Emak Facebook, Bocil ML/FF, Twitter, TikTok, Jaksel).
- **Command Palette (`Ctrl+K` / `⌘K`)** untuk pindah generator secepat kilat.
- **Dropdown pilih generator** yang dikelompokkan per kategori + search.
- **Share URL** yang membawa input + generator aktif.
- **Favorite & History** disimpan otomatis di `localStorage`.
- **Dark mode** biru cerah yang enak di mata (bukan hitam pekat).
- **PWA + offline support** via service worker.
- **SEO ready**: meta tag, Open Graph, Twitter Card, JSON-LD (WebApplication, BreadcrumbList, FAQPage), canonical, `sitemap.xml`, `robots.txt`.
- **A11y-friendly**: keyboard shortcut, ARIA role, focus ring, kontras tinggi.

---

## 🗺️ Kategori Generator

| Kategori | Contoh Generator |
|----------|-----------------|
| 🗿 Meme Indonesia | Alay, UwU, Rimsvek, Random Caps, Sigma Bocah, Brainrot Indo, Copypasta |
| 🤡 Tongkrongan | Alay Generator, Jakselify |
| 🎮 Gaming | Bocil ML, Bocil FF, Toxic Rank |
| ❤️ Sosial Media | Emak Facebook, Grup WA RT, Anak Discord, Anak Twitter, Anak TikTok, Komentar TikTok, FB Marketplace |
| 🔤 Fancy Text | Bubble, Bold, Italic, Small Caps, Monospace, Fraktur, Double Struck |
| ✨ Unicode | Circled, Superscript, Subscript, Mirror, Upside Down, Glitch, Zalgo, Invisible |
| 🛠 Utilities | Reverse Text, Typo Generator, Singkatin Kata |
| 💻 Developer | Lorem Ipsum, UUID, Slug, Password, Base64, ROT13, Caesar, Morse, Binary, Hex, URL/HTML/JSON Encode, Hash |

> Daftar lengkap ada di [`src/data/generators.ts`](./src/data/generators.ts).

---

## 🚀 Quick Start

Butuh **Node.js 20+** dan **npm** (atau pnpm/yarn/bun - sesuaikan sendiri).

```bash
# 1. Clone
git clone https://github.com/flessan/teksreceh.git
cd teksreceh

# 2. Install
npm install

# 3. Development server
npm run dev

# 4. Production build
npm run build

# 5. Preview production build
npm run preview
```

Buka [http://localhost:5173](http://localhost:5173).

---

## 🏗️ Tech Stack

- **[React 19](https://react.dev/)** + **TypeScript strict**
- **[Vite 7](https://vitejs.dev/)** dengan `vite-plugin-singlefile` (opsional, hasil build 1 file HTML)
- **[Tailwind CSS 4](https://tailwindcss.com/)**
- **Neo-brutalism UI** dengan palet biru cerah + dark mode navy soft
- **PWA** via service worker vanilla di `public/sw.js`
- **No backend, no tracker, no external API**

---

## 📁 Struktur Proyek

```
teksreceh/
├── public/                    # static assets, PWA, robots, sitemap
│   ├── icon.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── sw.js
│   └── _redirects             # SPA fallback (Cloudflare / Netlify)
├── src/
│   ├── components/            # UI reusable
│   │   ├── CommandPalette.tsx
│   │   └── GeneratorWorkspace.tsx
│   ├── data/
│   │   └── generators.ts      # SATU tempat konfigurasi generator
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── lib/
│   │   └── search.ts
│   ├── transformers/
│   │   └── text.ts            # SATU tempat fungsi transformasi
│   ├── types/
│   │   └── generator.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── seo.ts
│   ├── App.tsx                # Home (generator-first) + /tentang
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ➕ Menambah Generator Baru

Tambah generator baru hanya butuh **dua langkah**:

### 1. Tulis transformer

`src/transformers/text.ts`

```ts
const contohBaru = (input: string, context: TransformContext) => {
  const intensity = optionNumber(context, "intensity", 5);
  return input.toUpperCase() + (intensity > 5 ? " 🗿" : "");
};

// daftarkan di objek transformers
export const transformers: Record<TransformerId, Transformer> = {
  // ...existing
  contohBaru,
};
```

Lalu tambahkan `"contohBaru"` ke `TransformerId` union.

### 2. Tambahkan konfigurasi

`src/data/generators.ts`

```ts
{
  id: "contoh-baru",
  slug: "contoh-baru",
  title: "Contoh Baru",
  description: "Ubah teks jadi caps lock dan tambahkan batu.",
  category: "Meme Indonesia",
  icon: "🗿",
  keywords: ["contoh", "caps", "meme"],
  transformer: "contohBaru",
  defaultInput: "halo dunia",
  origin: "Penjelasan singkat asal-usul generator ini.",
  examples: [{ input: "halo dunia", output: "HALO DUNIA 🗿" }],
  faq: [
    { question: "Untuk apa generator ini?", answer: "Buat iseng." },
  ],
  options: [
    { id: "intensity", label: "Intensity", type: "range", min: 1, max: 10, step: 1, defaultValue: 5 },
  ],
  featured: true, // muncul di Trending
}
```

Selesai. Generator baru otomatis muncul di dropdown, command palette, dan sitemap. Tidak perlu bikin halaman baru.

Detail lebih lengkap ada di [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 🌐 Deployment

Karena semua client-side, kamu bisa deploy ke mana saja yang serve static file.

### Cloudflare Pages (recommended)

1. Push repo ke GitHub.
2. Buka Cloudflare Pages → **Create project** → connect repo.
3. Konfigurasi:
   - **Build command**: `npm run build`
   - **Build output**: `dist`
   - **Node version**: `20`
4. Deploy. File `public/_redirects` sudah menangani SPA fallback.

### Vercel (#KatakanTidak)

```bash
vercel israell
```

Ikuti prompt, output `dist`.

### Netlify

Netlify auto-detect Vite. Build command `npm run build`, output `dist`.

### GitHub Pages

```bash
npm run build
# push isi dist/ ke branch gh-pages
```

### Docker (opsional)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

---

## ⌨️ Keyboard Shortcut

| Shortcut | Aksi |
|----------|------|
| `Ctrl` / `⌘` + `K` | Buka command palette |
| `Ctrl` / `⌘` + `Enter` | Copy output |
| `Ctrl` / `⌘` + `C` (di luar input) | Copy output |
| `Esc` | Tutup command palette / dropdown |

---

## 🧭 Routing

teksreceh adalah SPA sederhana:

- `/` - Home, langsung buka generator aktif.
- `/?g=<slug>` - Buka generator tertentu.
- `/?g=<slug>&q=<teks>` - Share URL dengan input awal.
- `/tentang` - Halaman tentang proyek.

---

## 🗺️ Roadmap

- [ ] i18n (EN mode untuk export budaya +62 ke internasional)
- [ ] Preset karakter internet Indonesia lebih lengkap (Warnet 2009, Twitter SJW)
- [ ] Import/export favorit + history sebagai JSON
- [ ] Export hasil sebagai image / sticker
- [ ] Playground “Battle Persona” (side-by-side compare)
- [ ] CLI (`npx teksreceh alay "aku lapar"`)
- [ ] Astro static generation (satu halaman per generator untuk SEO deep-link)
- [ ] Analytics privacy-friendly opt-in (Plausible / Umami self-host)

Punya ide? [Buka issue](https://github.com/flessan/teksreceh/issues/new/choose) 🙏.

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Baca dulu:

- [CONTRIBUTING.md](./CONTRIBUTING.md) - panduan kontribusi + cara nambah generator.
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - kode etik.
- [SECURITY.md](./SECURITY.md) - laporkan celah keamanan.

Ide kontribusi ramah pemula:

- Nambah generator baru (butuh 1 fungsi + 1 objek konfig).
- Nambah persona baru.
- Perbaiki typo di teks / FAQ.
- Nambah contoh baru di generator yang sudah ada.
- Nambah bahasa daerah (Sundanese, Jawa, Batak).

---

## 📄 License

[MIT](./LICENSE) © 2026 flessan & kontributor teksreceh.

Silakan fork, remix, dan pakai di proyekmu.

---

## 🙏 Credits

- Dari web legend blogger si Pubercity (sekarang udah ilang) web nya masih ada: [Alay Generator](https://alaygenerator.blogspot.com/).
- Terinspirasi dari fenomena cara ngetik netizen Indonesia - kalian semua yang bikin bahasa ini hidup.
- Icon emoji dari Unicode Consortium & Twemoji.
- Neo-brutalism style inspired by [neobrutalism.dev](https://www.neobrutalism.dev/) & [Figma Community](https://www.figma.com/community).

---

<div align="center">

**teksreceh** - jangan sekadar text tools, jadilah museum cara ngetik +62.

Made with 🗿 in Indonesia.

</div>
