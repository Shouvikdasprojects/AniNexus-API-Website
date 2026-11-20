# Contributing to AniNexus API Directory & Showcase

Thank you for your interest in contributing to the **AniNexus API** ecosystem! This repository powers the official documentation, client integration catalog, and community showcase at [https://aninexus-api-website.pages.dev/](https://aninexus-api-website.pages.dev/).

---

## 🚀 How to Add Your Integration / API Wrapper

If you built an SDK, library, client package, or framework wrapper that communicates with the **AniNexus API** (`https://ani-nexus.onrender.com/api/v1/`), you can list it on the official website:

### Quick Steps (via GitHub Web UI)
1. Navigate directly to [`src/data/integrations.js`](https://github.com/Shouvikdasprojects/AniNexus-API-Website/edit/master/src/data/integrations.js).
2. Click the **Pencil icon** (Edit this file). GitHub will automatically create a fork of this repository under your account.
3. Scroll to the bottom of the list and append a new JSON object entry:

```javascript
{
    type: "Client Library",   // "SDK & Client", "Client Library", "Mobile Package", "Crate", etc.
    author: "YourGitHubUsername",
    title: "aninexus-py",      // Name of your package
    language: "python",        // All lowercase (javascript, typescript, python, dart, go, rust, kotlin, csharp, php, swift, ruby)
    supportsV1: true,          // true if your library supports AniNexus REST API v1
    supportsV4: false,
    url: "https://github.com/your-username/your-wrapper-repo" // Direct link to your public repository or package page
}
```

4. Write a brief commit message (e.g. `feat: add aninexus-py wrapper`).
5. Click **Propose changes**, then click **Create Pull Request**.

---

## 🌟 How to Add Your Application to the Showcase

If you built an anime streaming portal, mobile app, Discord bot, or watchlist tracker powered by the **AniNexus API**:

1. Navigate directly to [`src/data/showcase.js`](https://github.com/Shouvikdasprojects/AniNexus-API-Website/edit/master/src/data/showcase.js).
2. Append your project at the bottom of the list:

```javascript
{
    title: "My Anime Tracker",
    summary: "A sleek cross-platform anime watchlist and release tracker powered by AniNexus API.",
    imageUrl: "https://your-domain.com/screenshot.png", // Direct image URL (< 300 KB)
    url: "https://my-anime-tracker.com"                 // Live website or repository URL
}
```

3. Submit your changes via a Pull Request.

---

## 📋 Guidelines

- **Active & Public Repositories**: Please only submit wrappers and projects that are publicly accessible and open-source or freely usable.
- **Language Slugs**: Must be entirely lowercase (e.g., `python`, `typescript`, `dart`, `go`, `rust`, `csharp`).
- **Images**: Showcase screenshot URLs should be direct links (`.png`, `.jpg`, `.webp`) and optimized under 300 KB.
- **Automated Deployment**: Once your Pull Request is reviewed and merged by the maintainer, Cloudflare Pages will automatically rebuild and deploy your changes live within 60 seconds!

---

*Engineered & Maintained by [Shouvik Das](https://github.com/Shouvikdasprojects)*
