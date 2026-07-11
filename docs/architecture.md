# Arsitektur teksreceh

Dokumen ini menjelaskan bagaimana kode teksreceh disusun, biar kontributor bisa langsung nyemplung tanpa harus menebak-nebak.

## Prinsip

1. **Config-driven.** Menambah generator = tambah 1 objek konfig + 1 fungsi transformasi. Tidak boleh ada file per-generator.
2. **Client-only.** Semua jalan di browser. Tidak ada API, tidak ada Node runtime saat runtime.
3. **Reusable.** UI, hook, util dipisah. `GeneratorWorkspace` melayani semua generator.
4. **Progressive disclosure.** Advanced option tidak muncul kecuali user membuka.

## Diagram Alur

```
┌─────────────┐        ┌───────────────────┐
│  App.tsx    │──────▶ │ GeneratorDropdown │
│  (router)   │        └───────────────────┘
│             │
│             │        ┌─────────────────────────┐        ┌──────────────────────┐
│             │──────▶ │ GeneratorWorkspace       │──────▶ │ transformers/text.ts │
│             │        │  (input + realtime out)  │        └──────────────────────┘
│             │        └─────────────────────────┘                    ▲
│             │                                                       │
│             │        ┌─────────────────┐          reads config      │
│             │──────▶ │ CommandPalette  │──────────────────┐         │
└─────────────┘        └─────────────────┘                  │         │
                                                            ▼         │
                                                   ┌────────────────────────┐
                                                   │ data/generators.ts     │
                                                   └────────────────────────┘
```

## Modul

### `src/App.tsx`

- Router mini (tanpa library). Membaca `location.pathname` + `?g=slug` + hash.
- Halaman: `home` (dropdown + workspace) dan `about` (`/tentang`).
- Provider ringan untuk dark mode, favorite, recent, command palette.

### `src/components/GeneratorWorkspace.tsx`

- Komponen inti UI generator.
- Menampilkan input textarea, realtime output, action buttons, dan Advanced panel (persona, slider, mini lore, FAQ, history).
- Menerima `generator: GeneratorConfig` sehingga bebas dari kondisi hardcoded.

### `src/components/CommandPalette.tsx`

- Overlay `Ctrl+K` untuk cari & pindah generator cepat.
- Pakai fungsi `searchGenerators` dari `src/lib/search.ts`.

### `src/data/generators.ts`

- **Single source of truth** untuk daftar generator, kategori, dan persona.
- Setiap generator berisi: `id`, `slug`, `title`, `description`, `category`, `icon`, `keywords`, `transformer`, `defaultInput`, `origin`, `examples`, `faq`, `options`, `featured`.
- Menyimpan `generatorBySlug` map dan `defaultGenerator` untuk konsumsi App.

### `src/transformers/text.ts`

- Kumpulan fungsi murni `(input, context) => output`.
- Objek `transformers` memetakan `TransformerId` → fungsi.
- `withPersona` mengaplikasikan persona setelah transformer utama (hanya saat Advanced aktif).

### `src/hooks/useLocalStorage.ts`

- Wrapper `useState` yang otomatis sinkron ke `localStorage`, dengan fallback graceful bila JSON error.

### `src/lib/search.ts`

- Scoring sederhana untuk pencarian generator (haystack: title + description + category + slug + keywords).

### `src/utils/seo.ts`

- Mengupdate meta tag, canonical, JSON-LD saat pindah halaman.
- Support Home dan per-generator (opsional).

### `src/utils/cn.ts`

- Helper klasik `clsx` + `tailwind-merge`.

## State Management

Tidak pakai Redux / Zustand / Context berlebihan.

- Router state: `useState` di `App.tsx` + listener `popstate` / `hashchange`.
- Preferensi user: `useLocalStorage`.
- Generator aktif: `activeSlug` di `App.tsx`, diturunkan ke `GeneratorWorkspace`.
- Advanced toggle: local state di `GeneratorWorkspace` (per generator).

## Rendering Realtime

`GeneratorWorkspace` menghitung `output` via `useMemo`:

```ts
const output = useMemo(
  () => transformText(input, { options, persona }, generator.transformer),
  [generator.transformer, input, optionKey, options, persona, seed],
);
```

`seed` di-bump saat user klik **Random / Swap** untuk memaksa hasil baru bagi generator yang non-deterministik (Alay, Rimsvek, Typo, dll).

## PWA

`public/sw.js` adalah service worker vanilla dengan strategi **cache-first for GET**. Tidak butuh Workbox agar bundle tetap minim.

## Deployment Path

`vite build` → menghasilkan `dist/index.html` (dengan `vite-plugin-singlefile` bundle inline). Cocok untuk Cloudflare Pages, Netlify, Vercel, GitHub Pages, atau bahkan drop ke Cloudflare R2 sebagai static.

## Guideline Menambah Modul Baru

- **Butuh backend?** Jangan tambah. teksreceh harus tetap client-only.
- **Butuh library baru?** Buka issue dulu untuk diskusi trade-off ukuran bundle.
- **Butuh halaman baru?** Cukup tambah route di `App.tsx`. Jangan bikin router library.
- **Butuh generator baru?** Ikuti [CONTRIBUTING.md](../CONTRIBUTING.md#-cara-menambah-generator-baru).
