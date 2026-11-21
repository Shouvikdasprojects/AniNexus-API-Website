<div align="center">

# ⛩️ AniNexus REST API
### The Open Anime Metadata, Master Franchise & Intelligence Platform

[![Architecture: REST API v1](https://img.shields.io/badge/Architecture-REST%20API%20v1-8B5CF6?style=for-the-badge&logo=fastapi&logoColor=white)](https://aninexus-api-website.pages.dev/docs)
[![Gateway Status](https://img.shields.io/badge/Gateway-99.9%25%20Healthy-10B981?style=for-the-badge&logo=render&logoColor=white)](https://ani-nexus.onrender.com/health)
[![Master Franchises](https://img.shields.io/badge/Franchises-371%2B%20Curated-EC4899?style=for-the-badge&logo=myanimelist&logoColor=white)](https://aninexus-api-website.pages.dev/docs#series-slug)
[![Auth: Zero-Token](https://img.shields.io/badge/Auth-100%25%20Free%20%2F%20Open-3B82F6?style=for-the-badge&logo=open-source-initiative&logoColor=white)](https://aninexus-api-website.pages.dev/docs)
[![CORS: Enabled](https://img.shields.io/badge/CORS-Enabled%20(*)-F59E0B?style=for-the-badge)](https://aninexus-api-website.pages.dev/docs)
[![OpenAPI Spec](https://img.shields.io/badge/OpenAPI-3.1.0%20Standard-0284C7?style=for-the-badge&logo=openapiinitiative&logoColor=white)](https://aninexus-api-website.pages.dev/openapi.json)
[![AI Ready](https://img.shields.io/badge/AI%20Agent-llms.txt%20Ready-6366F1?style=for-the-badge&logo=openai&logoColor=white)](https://aninexus-api-website.pages.dev/llms.txt)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="https://aninexus-api-website.pages.dev"><strong>Explore Website Portal »</strong></a>
  •
  <a href="https://aninexus-api-website.pages.dev/docs"><strong>Interactive API Playground »</strong></a>
  •
  <a href="https://aninexus-api-website.pages.dev/openapi.json"><strong>OpenAPI 3.1 Spec »</strong></a>
  •
  <a href="https://aninexus-api-website.pages.dev/llms.txt"><strong>AI Agent Guide (llms.txt) »</strong></a>
  •
  <a href="https://aninexus-api-website.pages.dev/showcase"><strong>Community Showcase »</strong></a>
</p>

</div>

---

## 📖 Overview

**AniNexus** is a next-generation, high-performance **Anime Metadata & Media REST API (v1)** engineered to solve the fragmentation problem in existing anime databases. 

Instead of treating every season, movie, OVA, and special as disconnected individual records (as Jikan, MyAnimeList, or AniList do), **AniNexus links all parts into unified Master Franchise Watch-Order Timelines** across 371+ curated franchises (2010–2026). It also features a dual-score consensus engine, verified multi-language dubbing tracks (including Hindi and English), a 5-year rolling Anime Awards vault, and real-time auto-purging news feeds.

> **100% Free & Legal:** AniNexus hosts zero pirated video files and requires no API keys or subscription tokens. Safe for deployment in Google Play Store apps, Apple App Store apps, educational projects, Discord bots, and production websites.

---

## ⚡ Live Endpoints Base URLs

| Service | Production URL | Status |
| :--- | :--- | :--- |
| **REST API Gateway (v1)** | `https://ani-nexus.onrender.com/api/v1` | `200 OK` (HTTPS) |
| **System Health & Uptime** | `https://ani-nexus.onrender.com/health` | `200 OK` (Latency ~300ms) |
| **Official Documentation & Portal** | `https://aninexus-api-website.pages.dev` | `Active` (Cloudflare Pages) |
| **Machine-Readable OpenAPI Spec** | `https://aninexus-api-website.pages.dev/openapi.json` | `OpenAPI 3.1.0` |
| **AI Agent Prompting Context** | `https://aninexus-api-website.pages.dev/llms.txt` | `LLM Optimized` |

---

## 🌟 Why AniNexus vs Traditional Anime APIs?

| Feature | Standard APIs (Jikan / MAL / Kitsu) | **AniNexus REST API** |
| :--- | :---: | :---: |
| **Franchise Organization** | ❌ Fragmented seasons & disconnected movies | ✅ **Unified Master Timelines** (e.g. Attack on Titan's 11 parts in chronological order) |
| **Community Rating** | ❌ Single-platform bias | ✅ **Dual-Score Consensus Engine** (blends MAL 1-10 & AniList 1-100) |
| **Audio Dubbing Matrix** | ❌ Incomplete or missing | ✅ **100% Verified Dub Flags** (Hindi, English, Japanese, Bengali, Tamil, Telugu) |
| **Anime Awards Vault** | ❌ None | ✅ **5-Year Rolling Window** (Crunchyroll Awards 2021–2026 with 410 auto-purge) |
| **Weekly Airing Calendar** | ⚠️ Raw broadcasts without dub info | ✅ **7-Day Live Airing Schedule** with localized dub availability |
| **Industry News Engine** | ❌ Rare or unstructured text | ✅ **Image-Categorized Feeds** (`/news` with cover images, `/articles` text-only, 60-day TTL) |
| **Authentication Barrier** | ⚠️ Complex OAuth / strict rate-limits | ✅ **Zero-Token Auth & CORS `*` Enabled** |

---

## 🚀 Quickstart in 30 Seconds

Zero registration or API tokens needed. Start making requests immediately:

### 1. cURL (Terminal)
```bash
# Fetch Popular Anime Franchises
curl -s "https://ani-nexus.onrender.com/api/v1/top?type=popular&limit=5"

# Search for a Franchise with Chronological Watch Order
curl -s "https://ani-nexus.onrender.com/api/v1/series/attack-on-titan/timeline"
```

### 2. JavaScript / TypeScript (Fetch API)
```javascript
const response = await fetch("https://ani-nexus.onrender.com/api/v1/top?type=trending&limit=10");
const data = await response.json();

data.data.forEach(anime => {
  console.log(`${anime.title.english || anime.title.romaji} — Combined Score: ${anime.combinedScore}/100`);
  console.log(`Hindi Dub: ${anime.dubAvailability?.hasHindiDub ? '✅ Yes' : '❌ No'}`);
  console.log(`English Dub: ${anime.dubAvailability?.hasEnglishDub ? '✅ Yes' : '❌ No'}`);
});
```

### 3. Python (Requests)
```python
import requests

url = "https://ani-nexus.onrender.com/api/v1/seasons/now"
response = requests.get(url).json()

print(f"Current Season: {response.get('season')} {response.get('year')}")
for title in response.get('data', [])[:5]:
    print(f"- {title['title']['romaji']} (Score: {title.get('combinedScore')})")
```

---

## 📋 Complete REST API Endpoints (19 Live Endpoints)

All endpoints accept standard `GET` requests and return UTF-8 JSON.

### 1. System & Health
* `GET /health` — Real-time server process uptime, ISO timestamp, and health status.
* `GET /` — Root API index with operational status and ecosystem links.

### 2. Top Curated Collections
* `GET /api/v1/top?type=trending` — Trending anime leaderboards.
* `GET /api/v1/top?type=popular` — All-time most popular master franchises.
* `GET /api/v1/top?type=rated` — Highest-rated anime franchises by combined dual score.
* `GET /api/v1/top?type=movies` — Top theatrical box-office anime films.
* `GET /api/v1/top?type=airing` — Currently broadcasting top series.

### 3. Seasonal Broadcast Hub
* `GET /api/v1/seasons/now` — Currently airing anime in the active broadcast quarter.
* `GET /api/v1/seasons/upcoming` — Upcoming anime queued for the next quarter.
* `GET /api/v1/seasons/:year/:season` — Historical archive (e.g. `/api/v1/seasons/2024/fall`).

### 4. Anime Awards Engine (5-Year Rolling Window: 2021–2026)
* `GET /api/v1/awards` — Award window metadata and active years.
* `GET /api/v1/awards/latest` — Official 2026 Crunchyroll Anime Awards winners & nominees.
* `GET /api/v1/awards/:year` — Award edition by year (2021–2026 active; `< 2021` returns `410 Gone`).
* `GET /api/v1/awards/category/:categorySlug` — Category history (e.g. `anime-of-the-year`, `best-animation`).

### 5. Master Franchise Vault
* `GET /api/v1/series/:slug` — Consolidated franchise dossier (e.g. `attack-on-titan`, `solo-leveling`, `jujutsu-kaisen`).
* `GET /api/v1/series/:slug/timeline` — Chronological watch order of all seasons, movies, and specials.
* `GET /api/v1/series/:slug/episodes` — Complete episode directory with canon/filler classifications.
* `GET /api/v1/anime/:idOrSlug` — Single season or movie part by MAL ID or slug.
* `GET /api/v1/anime/:idOrSlug/languages` — Verified audio dub and subtitle availability matrix.

### 6. Search, Filter & Taxonomy
* `GET /api/v1/search?q={query}` — Typo-tolerant omni-search across Romaji, English, Kanji, and aliases.
* `GET /api/v1/filter?genre={genre}&year={year}` — Multi-criteria catalog filter.
* `GET /api/v1/genres` — Master list of 34 curated official anime genres.

### 7. Broadcast Schedules & Media
* `GET /api/v1/schedule` — Weekly 7-day broadcast calendar organized by day of the week.
* `GET /api/v1/news` — Anime industry news with guaranteed high-resolution cover photos (60-day TTL).
* `GET /api/v1/articles` — Editorial articles, character analyses, and text reviews (60-day TTL).
* `GET /api/v1/trailers` — Official YouTube promotional videos with embed URLs and video stills.

---

## 🤖 AI Agent Prompting with `llms.txt`

AniNexus adheres to the official `llms.txt` standard. You can prompt any modern AI tool (ChatGPT, Claude, Cursor, Copilot, Antigravity) to build apps with AniNexus by passing our context link:

> **Example Prompt:**  
> *"Read https://aninexus-api-website.pages.dev/llms.txt and create a React/Flutter app that displays trending anime, checks whether each anime has a Hindi dub, and shows the chronological watch order when clicked."*

The AI agent will read the exact schema and build working code in seconds without guessing endpoints!

---

## 🤝 Community Contributions (Showcase & Integrations)

We invite the global developer community to build on top of AniNexus!

* **Submit Your Application to the Showcase:** Built a website, mobile app, or bot using AniNexus? Follow our guide to edit [`src/data/showcase.js`](src/data/showcase.js) and open a Pull Request.
* **Submit an SDK Wrapper:** Built a wrapper in Python, Rust, Go, Dart, or Swift? Add your package to [`src/data/integrations.js`](src/data/integrations.js).

---

## 🛠️ Local Website Development

```bash
# 1. Clone the repository
git clone https://github.com/Shouvikdasprojects/AniNexus-API-Website.git
cd AniNexus-API-Website

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Compile production build
npm run build
```

---

## 👨‍💻 Author & Connect

**Engineered & Maintained by [Shouvik Das](https://github.com/Shouvikdasprojects)**

Feel free to reach out for collaboration, API integrations, or feature requests:

<p align="left">
  <a href="https://heylink.me/ShouvikDas/"><img src="https://img.shields.io/badge/All%20Socials-HeyLink-00C4CC?style=for-the-badge&logo=linktree&logoColor=white" alt="HeyLink" /></a>
  <a href="https://x.com/shouvikdas155"><img src="https://img.shields.io/badge/X%20(Twitter)-@shouvikdas155-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
  <a href="https://instagram.com/shouvik_das_official"><img src="https://img.shields.io/badge/Instagram-@shouvik__das__official-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
  <a href="mailto:shouvikdaswork@gmail.com"><img src="https://img.shields.io/badge/Email-shouvikdaswork@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  <a href="https://github.com/Shouvikdasprojects"><img src="https://img.shields.io/badge/GitHub-Shouvikdasprojects-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</p>

- 📬 **Direct Email:** [shouvikdaswork@gmail.com](mailto:shouvikdaswork@gmail.com)
- 🌐 **All Socials in One Place:** [heylink.me/ShouvikDas](https://heylink.me/ShouvikDas/)
- 𝕏 **X (Twitter):** [@shouvikdas155](https://x.com/shouvikdas155)
- 📸 **Instagram:** [@shouvik_das_official](https://instagram.com/shouvik_das_official)
- 🐙 **GitHub:** [@Shouvikdasprojects](https://github.com/Shouvikdasprojects)
- 📊 **Consensus Data Sources:** MyAnimeList, AniList, TMDB, Anime News Network, Crunchyroll, Anime Corner.
- 📄 **License:** Open-source licensed under the [MIT License](LICENSE).
