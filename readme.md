# AniNexus API — Official Documentation & Showcase Website

[![AniNexus](static/aninexus.svg)](https://aninexus-api-website.pages.dev/)

The official documentation, showcase, and interactive playground website for **AniNexus API** — the open Master Franchise & Anime Intelligence platform.

> **Engineered & Maintained by [Shouvik Das](https://github.com/Shouvikdasprojects)**

---

## 🌟 Key Features

- **Master Franchise Vault**: 353+ curated franchises spanning 2010 to 2026 with consolidated multi-season timelines, movies, and specials.
- **Dual Community Scoring Engine**: Unified weighted score blending verified independent global community consensus.
- **100% Verified Dub Matrix**: Verified audio dub and subtitle mapping (Hindi, English, Japanese, Bengali, Tamil, Telugu).
- **5-Year Rolling Anime Awards Engine**: Official Crunchyroll Anime Awards winners & nominees (2021–2026) with automated 6th-year auto-purge.
- **Seasonal Airing Hub**: Real-time seasonal tracker with current airing titles (`/seasons/now`), upcoming releases, and historical archives.
- **Interactive API Playground**: Real-time request execution against live gateway (`https://ani-nexus.onrender.com`) with latency monitoring and syntax-highlighted responses.
- **Zero-Token Auth & CORS**: Instant access with standard HTTP clients without API keys.

---

## 🤝 Community Contributions

Want to add your SDK wrapper or showcase project?
- **Add your wrapper / client library**: Follow our [Contributing Guide](CONTRIBUTING.md#how-to-add-your-integration--api-wrapper) to edit [`src/data/integrations.js`](src/data/integrations.js).
- **Add your project to the Showcase**: Follow our [Contributing Guide](CONTRIBUTING.md#how-to-add-your-application-to-the-showcase) to edit [`src/data/showcase.js`](src/data/showcase.js).

---

## 🚀 Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Svelte 4
- **Styling**: SCSS & Modular CSS
- **Adapter**: `@sveltejs/adapter-static` for Cloudflare Pages & static web hosting
- **Icons**: `@tabler/icons-svelte`
- **Animations**: `svelte-typewriter`, Svelte Transitions, and 3D card tilt

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/Shouvikdasprojects/AniNexus-API-Website.git
cd AniNexus-API-Website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## ☁️ Deployment (Cloudflare Pages)

1. Connect this repository (`Shouvikdasprojects/AniNexus-API-Website`) to **Cloudflare Pages**.
2. **Framework Preset**: `SvelteKit` (or `None`).
3. **Build Command**: `npm run build`.
4. **Build Output Directory**: `build` *(Important: set to `build`, not `.svelte-kit/cloudflare`, because this site uses `@sveltejs/adapter-static`)*.
5. **Environment Variable**: `NODE_VERSION` = `20`.

---

## 📄 License & Attribution

MIT License. Engineered and Powered by **Shouvik Das**.
