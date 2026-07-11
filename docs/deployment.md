# Deployment Guide

teksreceh 100% client-side. File output `dist/` bisa di-serve dari static host mana saja.

## Cloudflare Pages (Recommended)

### Otomatis (via dashboard)

1. Push repo ke GitHub.
2. Login ke [dash.cloudflare.com](https://dash.cloudflare.com).
3. **Pages → Create project → Connect to Git**.
4. Pilih repo `teksreceh`.
5. Build settings:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output**: `dist`
   - **Root directory**: `/`
   - **Node version**: `20` (env var: `NODE_VERSION=20`)
6. Deploy 🚀

SPA fallback sudah ditangani `public/_redirects`.

### Otomatis (via GitHub Actions)

Repo sudah menyertakan `.github/workflows/deploy-pages.yml`. Aktifkan dengan:

1. Buat **Cloudflare API token** dengan izin `Pages: Edit`.
2. Buka repo → **Settings → Secrets and variables → Actions**.
3. Tambah:
   - `CLOUDFLARE_API_TOKEN` (secret)
   - `CLOUDFLARE_ACCOUNT_ID` (secret)
4. Tambah **Variable**:
   - `CLOUDFLARE_PROJECT_NAME` = nama project di Cloudflare Pages.

Push ke `main` → auto deploy.

## Vercel

```bash
npm i -g vercel
vercel
```

- **Output directory**: `dist`
- Rewrites SPA otomatis ditangani Vercel.

## Netlify

```bash
npm run build
netlify deploy --dir=dist --prod
```

Atau connect via UI. File `public/_redirects` sudah cover SPA fallback.

## GitHub Pages

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

Atau pakai action `peaceiris/actions-gh-pages`.

⚠️ Kalau di-host di sub-path (contoh `username.github.io/teksreceh/`), sesuaikan `base` di `vite.config.ts`:

```ts
export default defineConfig({
  base: "/teksreceh/",
});
```

Dan update path di `public/manifest.webmanifest`, `sw.js`, dan `sitemap.xml`.

## Docker (self-host)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Long cache untuk asset dengan hash
  location ~* \.(js|css|svg|png|jpg|webp|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
EOF
EXPOSE 80
```

Build:

```bash
docker build -t teksreceh .
docker run -p 8080:80 teksreceh
```

## Preview Deploy per PR

Sudah otomatis di:

- **Cloudflare Pages** - setiap PR dapat preview URL.
- **Vercel / Netlify** - auto preview via GitHub App.

## Custom Domain

Contoh: `teks.receh.id`

1. Beli / arahkan domain.
2. Di dashboard hosting, tambah custom domain.
3. Update:
   - `public/sitemap.xml`
   - `public/robots.txt`
   - `<link rel="canonical">` di `index.html`
   - `fallbackOrigin` di `src/utils/seo.ts`

## Analitik (opsional)

Kalau butuh analitik, pakai yang **privacy-friendly & tanpa cookie**:

- [Plausible](https://plausible.io/) - hosted / self-host.
- [Umami](https://umami.is/) - self-host.
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) - gratis.

Jangan tambahkan Google Analytics tanpa banner consent.

## Cek Setelah Deploy

- [ ] `/` (home) buka generator default.
- [ ] `/?g=alay-generator` buka Alay Generator.
- [ ] `/tentang` buka halaman about.
- [ ] `/random-slug` fallback ke home (tidak 404 hard).
- [ ] Lighthouse: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95, PWA installable.
- [ ] `robots.txt` dan `sitemap.xml` bisa diakses.
