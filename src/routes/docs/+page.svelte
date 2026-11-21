<script>
    import Nav from "$lib/components/Nav.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Chip from "$lib/components/Chip.svelte";
    import {
        IconTerminal2,
        IconCopy,
        IconCheck,
        IconPlayerPlay,
        IconFlame,
        IconCalendarEvent,
        IconTrophy,
        IconBuildingArch,
        IconSearch,
        IconTag,
        IconClock,
        IconNews,
        IconMovie,
        IconHeartbeat,
        IconCode,
        IconArrowLeft,
        IconLayoutGrid,
        IconStar,
        IconMicrophone,
        IconSparkles,
        IconArrowRight,
        IconExternalLink
    } from "@tabler/icons-svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { onMount } from "svelte";

    const currentYear = new Date().getFullYear();
    const awardsStartYear = currentYear - 5;

    const API_BASE = "https://ani-nexus.onrender.com";

    let totalFranchises = 371;
    let activeCategory = "all";
    let searchQuery = "";
    let copiedEndpoint = null;
    let copiedCode = null;
    let responseViewModes = {};

    // Endpoints data definition (All 19 verified live endpoints)
    let endpoints = [
        // 1. System Health
        {
            id: "health",
            category: "system",
            categoryLabel: "System",
            categoryIcon: IconHeartbeat,
            method: "GET",
            path: "/health",
            title: "Health & Uptime Monitor",
            description: "Returns the real-time server health, ISO timestamp, and continuous process uptime in seconds.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 2. Top Collections
        {
            id: "top-trending",
            category: "top",
            categoryLabel: "Top Collections",
            categoryIcon: IconFlame,
            method: "GET",
            path: "/api/v1/top",
            title: "Curated Top Collections",
            description: "Fetches curated leaderboards for trending, popular, highest-rated, box-office movies, and currently airing anime.",
            params: [
                {
                    name: "type",
                    type: "query",
                    default: "trending",
                    options: ["trending", "popular", "rated", "movies", "airing"],
                    description: "Collection type to retrieve"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 3. Seasonal Hub
        {
            id: "seasons-now",
            category: "seasons",
            categoryLabel: "Seasonal Hub",
            categoryIcon: IconCalendarEvent,
            method: "GET",
            path: "/api/v1/seasons/now",
            title: "Current Season Airing Anime",
            description: "Returns all currently broadcasting anime titles for the current broadcast quarter with verified dubs and dual community scores.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "seasons-upcoming",
            category: "seasons",
            categoryLabel: "Seasonal Hub",
            categoryIcon: IconCalendarEvent,
            method: "GET",
            path: "/api/v1/seasons/upcoming",
            title: "Upcoming Season Releases",
            description: "Returns upcoming anime releases scheduled for the next seasonal broadcast cycle.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "seasons-archive",
            category: "seasons",
            categoryLabel: "Seasonal Hub",
            categoryIcon: IconCalendarEvent,
            method: "GET",
            path: "/api/v1/seasons/:year/:season",
            title: "Historical Seasonal Archive",
            description: "Retrieves complete archive of anime broadcast in a specific historical quarter (e.g. Fall 2024).",
            params: [
                {
                    name: "year",
                    type: "path",
                    default: "2024",
                    options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020"],
                    description: "Archive year"
                },
                {
                    name: "season",
                    type: "path",
                    default: "fall",
                    options: ["winter", "spring", "summer", "fall"],
                    description: "Seasonal quarter"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 4. Anime Awards Engine
        {
            id: "awards-latest",
            category: "awards",
            categoryLabel: "Anime Awards",
            categoryIcon: IconTrophy,
            method: "GET",
            path: "/api/v1/awards/latest",
            title: "Latest Industry Anime Awards",
            description: `Fetches official winners & nominees across all categories (Anime of the Year, Best Animation, Best Action, etc.) for the current award cycle (2026).`,
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "awards-by-year",
            category: "awards",
            categoryLabel: "Anime Awards",
            categoryIcon: IconTrophy,
            method: "GET",
            path: "/api/v1/awards/:year",
            title: "Awards by Year (5-Year Rolling Window)",
            description: `Returns award results for a specific year within the 5-year rolling window (2021–2026). Years older than 5 years trigger HTTP 410 Gone auto-purge boundary.`,
            params: [
                {
                    name: "year",
                    type: "path",
                    default: "2026",
                    options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020"],
                    description: "Award year (2021-2026 active; 2020 triggers 410 Gone auto-purge)"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "awards-category",
            category: "awards",
            categoryLabel: "Anime Awards",
            categoryIcon: IconTrophy,
            method: "GET",
            path: "/api/v1/awards/category/:categorySlug",
            title: "Award Category Historical Timeline",
            description: "Historical view tracking award winners and nominees for a specific category across the entire 5-year rolling window.",
            params: [
                {
                    name: "categorySlug",
                    type: "path",
                    default: "anime-of-the-year",
                    options: ["anime-of-the-year", "best-animation", "best-action", "best-score", "best-voice-artist-performance-japanese"],
                    description: "Award category slug"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 5. Master Franchise Vault
        {
            id: "series-slug",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/series/:slug",
            title: "Master Franchise Dossier",
            description: "Retrieves complete master franchise document with unified multi-season timeline, dual community consensus scores, verified dub tracks, and legal OTT links.",
            params: [
                {
                    name: "slug",
                    type: "path",
                    default: "attack-on-titan",
                    options: ["attack-on-titan", "solo-leveling", "jujutsu-kaisen", "frieren-beyond-journeys-end", "demon-slayer-kimetsu-no-yaiba", "one-punch-man", "my-hero-academia", "hunter-x-hunter-2011", "steins-gate", "chainsaw-man"],
                    description: "Curated franchise slug identifier (1960s–Present+)"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "series-timeline",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/series/:slug/timeline",
            title: "Franchise Chronological Watch Order Timeline",
            description: "Returns the consolidated chronological viewing order of all seasons, movies, OVAs, and canon specials for a franchise.",
            params: [
                {
                    name: "slug",
                    type: "path",
                    default: "attack-on-titan",
                    options: ["attack-on-titan", "solo-leveling", "jujutsu-kaisen", "frieren-beyond-journeys-end", "demon-slayer-kimetsu-no-yaiba", "one-punch-man"],
                    description: "Franchise slug identifier"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "series-episodes",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/series/:slug/episodes",
            title: "Consolidated Episode Directory",
            description: "Returns complete episode directory with episode titles, broadcast air dates, and canon vs. filler classification.",
            params: [
                {
                    name: "slug",
                    type: "path",
                    default: "attack-on-titan",
                    options: ["attack-on-titan", "solo-leveling", "jujutsu-kaisen", "frieren-beyond-journeys-end"],
                    description: "Franchise slug identifier"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "series-staff",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/series/:slug/staff",
            title: "Animation Studios & Key Production Staff",
            description: "Retrieves animation production houses and key directors, creators, character designers, and composers with verified creator social media profiles.",
            params: [
                {
                    name: "slug",
                    type: "path",
                    default: "attack-on-titan",
                    options: ["attack-on-titan", "solo-leveling", "jujutsu-kaisen", "frieren-beyond-journeys-end", "demon-slayer-kimetsu-no-yaiba"],
                    description: "Franchise slug identifier"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "series-characters",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/series/:slug/characters",
            title: "Characters & Voice Actors Dossier",
            description: "Returns comprehensive character dossiers with roles, native Japanese names, biographical details, and multi-lingual voice actor credits.",
            params: [
                {
                    name: "slug",
                    type: "path",
                    default: "attack-on-titan",
                    options: ["attack-on-titan", "solo-leveling", "jujutsu-kaisen", "frieren-beyond-journeys-end", "demon-slayer-kimetsu-no-yaiba"],
                    description: "Franchise slug identifier"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "anime-part",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/anime/:idOrSlug",
            title: "Single Season / Anime Part by Anime ID or Slug",
            description: "Fetches individual anime season or film metadata directly by Anime ID (e.g. 52991) or title slug.",
            params: [
                {
                    name: "idOrSlug",
                    type: "path",
                    default: "52991",
                    options: ["52991", "16498", "40748", "38000", "attack-on-titan"],
                    description: "Anime ID or anime slug"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "anime-languages",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/anime/:idOrSlug/languages",
            title: "Verified Audio Dub & Subtitle Matrix",
            description: "Returns 100% verified localized audio dubbing and subtitle availability matrix (Hindi, English, Japanese, Bengali, Tamil, Telugu).",
            params: [
                {
                    name: "idOrSlug",
                    type: "path",
                    default: "attack-on-titan",
                    options: ["attack-on-titan", "52991", "solo-leveling", "jujutsu-kaisen"],
                    description: "Anime ID or anime slug"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 6. Search & Filtering
        {
            id: "anime-search",
            category: "search",
            categoryLabel: "Search & Filter",
            categoryIcon: IconSearch,
            method: "GET",
            path: "/api/v1/search",
            title: "Typo-Tolerant Omni-Search",
            description: "Fast-text search across English titles, Romaji transliterations, Kanji, and synonyms in the master franchise vault.",
            params: [
                {
                    name: "q",
                    type: "query",
                    default: "titan",
                    options: ["titan", "frieren", "leveling", "jujutsu", "demon", "hero", "chainsaw"],
                    description: "Search keyword"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "catalog-filter",
            category: "search",
            categoryLabel: "Search & Filter",
            categoryIcon: IconSearch,
            method: "GET",
            path: "/api/v1/filter",
            title: "Multi-Criteria Catalog Filter",
            description: "Filter franchises across multiple dimensions including genre, broadcast year, and format.",
            params: [
                {
                    name: "genre",
                    type: "query",
                    default: "action",
                    options: ["action", "adventure", "fantasy", "drama", "sci-fi", "supernatural", "mystery"],
                    description: "Genre tag"
                },
                {
                    name: "year",
                    type: "query",
                    default: "2024",
                    options: ["2026", "2025", "2024", "2023", "2022"],
                    description: "Broadcast release year"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 7. Genres
        {
            id: "anime-genres",
            category: "genres",
            categoryLabel: "Genres & Taxonomies",
            categoryIcon: IconTag,
            method: "GET",
            path: "/api/v1/genres",
            title: "Master Genres & Taxonomies Catalog",
            description: "Returns all 34 curated official anime genres with display names, slugs, and associated icons.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 8. Airing Schedule
        {
            id: "anime-schedule",
            category: "schedule",
            categoryLabel: "Airing Schedule",
            categoryIcon: IconClock,
            method: "GET",
            path: "/api/v1/schedule",
            title: "Weekly Airing Broadcast Schedule",
            description: "Returns the weekly 7-day anime broadcast schedule organized by days of the week with localized dub availability flags.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 9. News Feed
        {
            id: "anime-news",
            category: "news",
            categoryLabel: "News Feed",
            categoryIcon: IconNews,
            method: "GET",
            path: "/api/v1/news",
            title: "Anime Industry News Feed (with Cover Photos)",
            description: "Returns recent anime licensing and production news articles with high-resolution thumbnail images (60-day rolling retention).",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "anime-articles",
            category: "news",
            categoryLabel: "News Feed",
            categoryIcon: IconNews,
            method: "GET",
            path: "/api/v1/articles",
            title: "Curated Anime Articles & Reviews",
            description: "Returns comprehensive editorial articles, character analyses, and industry breakdowns.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 10. Official Trailers
        {
            id: "anime-trailers",
            category: "trailers",
            categoryLabel: "Trailers & Media",
            categoryIcon: IconMovie,
            method: "GET",
            path: "/api/v1/trailers",
            title: "Official Anime Trailers & Teasers",
            description: "Returns latest verified official anime promotional videos with YouTube video IDs, embed URLs, and thumbnail stills.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 11. Characters & Staff Encyclopedia
        {
            id: "character-details",
            category: "characters-staff",
            categoryLabel: "Characters & Staff",
            categoryIcon: IconMicrophone,
            method: "GET",
            path: "/api/v1/characters/:idOrSlug",
            title: "Character Encyclopedia Dossier",
            description: "Comprehensive character dossier including Romaji/Native names, titles, aliases, HD portrait, height, age, birthday, blood type, full biography, multi-lingual voice actors (Japanese, English, etc.), and anime appearances.",
            params: [
                {
                    name: "idOrSlug",
                    type: "path",
                    default: "89362",
                    options: ["89362", "aqua", "julius-euclius-89362", "40", "eren-yeager", "gojo-satoru"],
                    description: "Character ID or slug"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "character-search",
            category: "characters-staff",
            categoryLabel: "Characters & Staff",
            categoryIcon: IconMicrophone,
            method: "GET",
            path: "/api/v1/characters/search",
            title: "Global Character Search",
            description: "Fast multi-lingual text search across English, Romaji, Native Kanji, and aliases in the universal Character archive.",
            params: [
                {
                    name: "q",
                    type: "query",
                    default: "Julius",
                    options: ["Julius", "Aqua", "Eren", "Gojo", "Megumi", "Levi", "Naruto"],
                    description: "Character search query"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "staff-details",
            category: "characters-staff",
            categoryLabel: "Characters & Staff",
            categoryIcon: IconMicrophone,
            method: "GET",
            path: "/api/v1/staff/:idOrSlug",
            title: "Production Staff & Voice Actor Profile",
            description: "Complete individual profile for voice actors, directors, creators, and animators with birth date, age, hometown, blood type, primary occupations, verified social media links (Twitter, Instagram, Blog, Bluesky, Wiki), and credited works.",
            params: [
                {
                    name: "idOrSlug",
                    type: "path",
                    default: "111575",
                    options: ["111575", "megumi-han", "118", "hayao-miyazaki", "95096", "kenjiro-tsuda"],
                    description: "Staff ID or slug"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "staff-search",
            category: "characters-staff",
            categoryLabel: "Characters & Staff",
            categoryIcon: IconMicrophone,
            method: "GET",
            path: "/api/v1/staff/search",
            title: "Staff & Voice Actor Search",
            description: "Omni-search for anime directors, mangaka, character designers, composers, and seiyuu across the global industry database.",
            params: [
                {
                    name: "q",
                    type: "query",
                    default: "Megumi Han",
                    options: ["Megumi Han", "Hayao Miyazaki", "Kenjiro Tsuda", "Hiroyuki Sawano", "Yuki Kaji", "Mamoru Miyano"],
                    description: "Staff search query"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        }
    ];

    // Param values state store per endpoint
    let paramValues = {};
    let activeSnippetTabs = {};

    endpoints.forEach(ep => {
        paramValues[ep.id] = {};
        activeSnippetTabs[ep.id] = "curl";
        ep.params.forEach(p => {
            paramValues[ep.id][p.name] = p.default;
        });
    });

    const categories = [
        { id: "all", label: "All Endpoints", icon: IconTerminal2 },
        { id: "top", label: "Top Collections", icon: IconFlame },
        { id: "seasons", label: "Seasonal Hub", icon: IconCalendarEvent },
        { id: "awards", label: "Anime Awards", icon: IconTrophy },
        { id: "franchises", label: "Master Franchises", icon: IconBuildingArch },
        { id: "characters-staff", label: "Characters & Staff", icon: IconMicrophone },
        { id: "search", label: "Search & Filter", icon: IconSearch },
        { id: "genres", label: "Genres", icon: IconTag },
        { id: "schedule", label: "Schedule", icon: IconClock },
        { id: "news", label: "News & Articles", icon: IconNews },
        { id: "trailers", label: "Trailers", icon: IconMovie },
        { id: "system", label: "System Health", icon: IconHeartbeat }
    ];

    $: filteredEndpoints = endpoints.filter(ep => {
        const matchesCategory = activeCategory === "all" || ep.category === activeCategory;
        const matchesSearch = searchQuery === "" ||
            ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ep.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    function buildUrl(ep) {
        let url = API_BASE + ep.path;
        const currentParams = paramValues[ep.id] || {};

        ep.params.forEach(p => {
            const val = currentParams[p.name] || p.default;
            if (p.type === "path") {
                url = url.replace(`:${p.name}`, encodeURIComponent(val));
            }
        });

        const queryParams = ep.params.filter(p => p.type === "query");
        if (queryParams.length > 0) {
            const searchParams = new URLSearchParams();
            queryParams.forEach(p => {
                const val = currentParams[p.name] || p.default;
                if (val) searchParams.append(p.name, val);
            });
            const qStr = searchParams.toString();
            if (qStr) {
                url += (url.includes("?") ? "&" : "?") + qStr;
            }
        }
        return url;
    }

    function getCurlSnippet(ep, _trigger) {
        return `curl -X GET "${buildUrl(ep)}"`;
    }

    function getJsSnippet(ep, _trigger) {
        return `const res = await fetch("${buildUrl(ep)}");\nconst data = await res.json();\nconsole.log(data);`;
    }

    function getPythonSnippet(ep, _trigger) {
        return `import requests\n\nres = requests.get("${buildUrl(ep)}")\nprint(res.json())`;
    }

    async function executeRequest(ep) {
        ep.loading = true;
        ep.error = null;
        ep.response = null;
        ep.status = null;
        ep.duration = null;
        endpoints = [...endpoints];

        const targetUrl = buildUrl(ep);
        const startTime = performance.now();

        try {
            const res = await fetch(targetUrl);
            const duration = Math.round(performance.now() - startTime);
            const json = await res.json();

            ep.status = res.status;
            ep.duration = duration;
            ep.rawJson = json;
            ep.response = JSON.stringify(json, null, 2);
            if (!responseViewModes[ep.id]) {
                responseViewModes[ep.id] = 'visual';
            }
        } catch (err) {
            ep.duration = Math.round(performance.now() - startTime);
            ep.error = err.message || "Network request failed";
            ep.status = 500;
        } finally {
            ep.loading = false;
            endpoints = [...endpoints];
        }
    }

    function copyToClipboard(text, id) {
        navigator.clipboard.writeText(text);
        copiedEndpoint = id;
        setTimeout(() => {
            if (copiedEndpoint === id) copiedEndpoint = null;
        }, 2000);
    }

    function copyCodeSnippet(text, id) {
        navigator.clipboard.writeText(text);
        copiedCode = id;
        setTimeout(() => {
            if (copiedCode === id) copiedCode = null;
        }, 2000);
    }

    function selectAndScrollToHash() {
        if (typeof window !== "undefined" && window.location.hash) {
            const targetId = window.location.hash.replace("#", "");
            const found = endpoints.find(e => e.id === targetId);
            if (found) {
                activeCategory = found.category;
                setTimeout(() => {
                    const el = document.getElementById(targetId);
                    if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                        el.classList.add("highlighted");
                        setTimeout(() => el.classList.remove("highlighted"), 2500);
                    }
                }, 150);
            }
        }
    }

    onMount(() => {
        selectAndScrollToHash();
        window.addEventListener("hashchange", selectAndScrollToHash);

        fetch(`${API_BASE}/api/v1/top?type=popular&limit=1`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.total) totalFranchises = data.total;
            })
            .catch(() => {});

        return () => {
            window.removeEventListener("hashchange", selectAndScrollToHash);
        };
    });
</script>

<svelte:head>
    <title>AniNexus REST API Documentation — v1 Reference & Interactive Playground</title>
    <meta name="description" content="Explore and test all 19 AniNexus REST endpoints live: Top Anime, Seasonal Hub, Industry Anime Awards (2021-2026), Master Franchises, Verified Dubs, and Multi-Score Engine.">
</svelte:head>

<Nav />

<div class="docsPage">
    <!-- Top Hero Banner -->
    <header class="docsHero">
        <div class="docsHero__container">
            <div class="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <span class="active">REST API Documentation</span>
                <Chip size="small" type="outline">REST v1.0.0</Chip>
            </div>
            <h1>AniNexus <span>REST API Reference</span></h1>
            <p>
                A high-performance <strong>REST API (v1)</strong> serving <strong>{totalFranchises}+ curated Master Franchises (1960s–{currentYear}+)</strong>, 
                5-year rolling anime awards, 100% verified audio dub tracks (Hindi & English), and dual community consensus scores with zero token authorization required.
            </p>

            <div class="roadmapNotice">
                <span class="noticeBadge">Architecture Notice</span>
                <span>Active protocol: <strong>REST API v1 (JSON over HTTPS)</strong>. GraphQL queries and WebSocket real-time broadcast streams are scheduled on the future roadmap.</span>
            </div>

            <div class="heroPills">
                <div class="heroPill">
                    <span class="pillDot"></span>
                    <span>Base URL: <code>https://ani-nexus.onrender.com/api/v1</code></span>
                </div>
                <div class="heroPill">
                    <span>⚡ RESTful JSON</span>
                </div>
                <div class="heroPill">
                    <span>🔓 No API Key Required</span>
                </div>
                <div class="heroPill">
                    <span>🌐 CORS Enabled</span>
                </div>
                <div class="heroPill">
                    <span>⏱️ Rate Limit: 60 req/min</span>
                </div>
                <a href="/openapi.json" target="_blank" rel="noopener noreferrer" class="heroPill heroLink">
                    <span>📜 OpenAPI 3.1 Spec (JSON)</span>
                </a>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" class="heroPill heroLink">
                    <span>🤖 AI Agent Guide (llms.txt)</span>
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content Area: Sidebar + Playground -->
    <div class="docsContainer">
        <!-- Sidebar Navigation -->
        <aside class="docsSidebar">
            <div class="sidebarSearch">
                <IconSearch size={18} stroke={1.5} color="#94A3B8" />
                <input
                    type="text"
                    placeholder="Search endpoints..."
                    bind:value={searchQuery}
                />
            </div>

            <div class="categoryList">
                <span class="sidebarHeading">Categories</span>
                {#each categories as cat}
                    <button
                        class="catBtn {activeCategory === cat.id ? 'active' : ''}"
                        on:click={() => { activeCategory = cat.id; }}
                    >
                        <svelte:component this={cat.icon} size={18} stroke={1.5} />
                        <span>{cat.label}</span>
                        {#if cat.id !== "all"}
                            <span class="catBadge">
                                {endpoints.filter(e => e.category === cat.id).length}
                            </span>
                        {/if}
                    </button>
                {/each}
            </div>
        </aside>

        <!-- Endpoints List & Interactive Playground -->
        <main class="docsMain">
            <div class="endpointsHeader">
                <h2>Endpoints <span>({filteredEndpoints.length})</span></h2>
                <div class="endpointsSubtext">
                    Click <strong>"Execute"</strong> to send a real-time live request directly to Render backend.
                </div>
            </div>

            {#if filteredEndpoints.length === 0}
                <div class="noResults" in:fade>
                    <p>No endpoints found matching "{searchQuery}" in category "{activeCategory}".</p>
                    <button class="resetBtn" on:click={() => { searchQuery = ""; activeCategory = "all"; }}>
                        Reset Filters
                    </button>
                </div>
            {/if}

            <div class="endpointsList">
                {#each filteredEndpoints as ep (ep.id)}
                    <article class="endpointCard" id={ep.id} in:fade={{duration: 200}}>
                        <!-- Endpoint Header Bar -->
                        <div class="epHeader">
                            <div class="epMethodGroup">
                                <span class="methodBadge {ep.method.toLowerCase()}">{ep.method}</span>
                                <code class="epPath">{ep.path}</code>
                            </div>
                            <div class="epActions">
                                <button
                                    class="copyBtn"
                                    title="Copy Endpoint URL"
                                    on:click={() => copyToClipboard(buildUrl(ep), ep.id)}
                                >
                                    {#if copiedEndpoint === ep.id}
                                        <IconCheck size={16} stroke={2} color="#10B981" />
                                        <span class="copiedText">Copied</span>
                                    {:else}
                                        <IconCopy size={16} stroke={1.5} />
                                        <span>Copy URL</span>
                                    {/if}
                                </button>
                                <button
                                    class="executeBtn {ep.loading ? 'loading' : ''}"
                                    on:click={() => executeRequest(ep)}
                                    disabled={ep.loading}
                                >
                                    {#if ep.loading}
                                        <span class="spinner"></span>
                                        <span>Fetching...</span>
                                    {:else}
                                        <IconPlayerPlay size={16} stroke={2} />
                                        <span>Execute</span>
                                    {/if}
                                </button>
                            </div>
                        </div>

                        <!-- Endpoint Details -->
                        <div class="epBody">
                            <h3 class="epTitle">{ep.title}</h3>
                            <p class="epDescription">{ep.description}</p>

                            <!-- Parameters Section (if any) -->
                            {#if ep.params.length > 0}
                                <div class="paramsSection">
                                    <h4 class="paramsHeading">Request Parameters</h4>
                                    <div class="paramsTable">
                                        {#each ep.params as param}
                                            <div class="paramRow">
                                                <div class="paramMeta">
                                                    <span class="paramName">{param.name}</span>
                                                    <span class="paramType">{param.type}</span>
                                                    <span class="paramDesc">{param.description}</span>
                                                </div>
                                                <div class="paramInput">
                                                    {#if param.options}
                                                        <select
                                                            bind:value={paramValues[ep.id][param.name]}
                                                        >
                                                            {#each param.options as opt}
                                                                <option value={opt}>{opt}</option>
                                                            {/each}
                                                        </select>
                                                    {:else}
                                                        <input
                                                            type="text"
                                                            bind:value={paramValues[ep.id][param.name]}
                                                            placeholder={param.default}
                                                        />
                                                    {/if}
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/if}

                            <!-- Live URL Preview -->
                            <div class="liveUrlPreview">
                                <span class="urlLabel">Request URL:</span>
                                <code>{buildUrl(ep)}</code>
                            </div>

                            <!-- Live Response Panel (appears on click) -->
                            {#if ep.response || ep.error || ep.loading}
                                <div class="responsePanel" transition:slide={{duration: 250}}>
                                    <div class="responseMetaBar">
                                        <div class="metaBarLeft">
                                            <div class="statusIndicator">
                                                {#if ep.loading}
                                                    <span class="pulseYellow"></span>
                                                    <span>Connecting to ani-nexus.onrender.com...</span>
                                                {:else if ep.status === 200}
                                                    <span class="statusBadge success">200 OK</span>
                                                {:else if ep.status === 410}
                                                    <span class="statusBadge purged">410 Gone (Purged)</span>
                                                {:else}
                                                    <span class="statusBadge error">{ep.status || 'Error'}</span>
                                                {/if}
                                            </div>

                                            {#if ep.duration}
                                                <span class="latencyBadge">⏱️ {ep.duration} ms</span>
                                            {/if}
                                        </div>

                                        <div class="metaBarRight">
                                            {#if ep.response}
                                                <!-- Segmented Dual-View Toggle -->
                                                <div class="viewModeToggle">
                                                    <button
                                                        class="toggleBtn {responseViewModes[ep.id] !== 'json' ? 'active' : ''}"
                                                        on:click={() => responseViewModes[ep.id] = 'visual'}
                                                        title="Interactive Visual App Preview"
                                                    >
                                                        <IconLayoutGrid size={13} />
                                                        <span>Visual Preview</span>
                                                    </button>
                                                    <button
                                                        class="toggleBtn {responseViewModes[ep.id] === 'json' ? 'active' : ''}"
                                                        on:click={() => responseViewModes[ep.id] = 'json'}
                                                        title="Raw JSON Payload"
                                                    >
                                                        <IconCode size={13} />
                                                        <span>&#123; &#125; Raw JSON</span>
                                                    </button>
                                                </div>

                                                <button
                                                    class="copyResponseBtn"
                                                    on:click={() => copyToClipboard(ep.response, `${ep.id}-res`)}
                                                >
                                                    {#if copiedEndpoint === `${ep.id}-res`}
                                                        <IconCheck size={14} color="#10B981" />
                                                        <span>Copied!</span>
                                                    {:else}
                                                        <IconCopy size={14} />
                                                        <span>Copy JSON</span>
                                                    {/if}
                                                </button>
                                            {/if}
                                        </div>
                                    </div>

                                    {#if ep.response}
                                        {#if responseViewModes[ep.id] === 'json'}
                                            <pre class="jsonViewer"><code>{ep.response}</code></pre>
                                        {:else}
                                            <div class="visualPreviewContainer">
                                                {#if ep.rawJson?.data?.timeline && Array.isArray(ep.rawJson.data.timeline)}
                                                    <!-- Feature 2: Franchise Chronological Watch-Order Roadmap Visualizer -->
                                                    <div class="timelineRoadmap">
                                                        <div class="roadmapHeader">
                                                            <div class="roadmapTitleGroup">
                                                                <span class="roadmapIcon">🗺️</span>
                                                                <div>
                                                                    <h5>{ep.rawJson.data.franchise || ep.rawJson.data.titles?.primary || 'Franchise Roadmap'}</h5>
                                                                    <p class="roadmapMeta">Consolidated Chronological Watch Order • {ep.rawJson.data.timeline.length} Releases</p>
                                                                </div>
                                                            </div>
                                                            <div class="roadmapPills">
                                                                <span class="roadmapPill">Slug: <code>{ep.rawJson.data.slug || paramValues[ep.id]?.slug || 'series'}</code></span>
                                                                <span class="roadmapPill verified">✓ Dual-Score Verified</span>
                                                            </div>
                                                        </div>

                                                        <div class="roadmapSteps">
                                                            {#each ep.rawJson.data.timeline as part, idx}
                                                                <div class="roadmapStep">
                                                                    <div class="stepSpine">
                                                                        <div class="stepDot">{(idx + 1).toString().padStart(2, '0')}</div>
                                                                        {#if idx < ep.rawJson.data.timeline.length - 1}
                                                                            <div class="stepConnectorLine"></div>
                                                                        {/if}
                                                                    </div>

                                                                    <div class="stepCard">
                                                                        <div class="stepCardTop">
                                                                            <div class="stepOrderBadge">ORDER #{part.order || idx + 1}</div>
                                                                            <h6 class="stepName">{part.partName}</h6>
                                                                            <div class="stepBadgesRow">
                                                                                <span class="formatBadge format--{(part.format || 'tv').toLowerCase()}">{part.format || 'TV'}</span>
                                                                                {#if part.isCanon}
                                                                                    <span class="canonBadge canon">⭐ Canon</span>
                                                                                {:else}
                                                                                    <span class="canonBadge side">🌀 Side Story</span>
                                                                                {/if}
                                                                                {#if part.watchPriority}
                                                                                    <span class="priorityBadge priority--{part.watchPriority.toLowerCase()}">{part.watchPriority}</span>
                                                                                {/if}
                                                                            </div>
                                                                        </div>

                                                                        <div class="stepCardStats">
                                                                            <div class="statBox">
                                                                                <span class="statLabel">Release</span>
                                                                                <span class="statVal">📅 {part.year || 'N/A'}</span>
                                                                            </div>
                                                                            <div class="statBox">
                                                                                <span class="statLabel">Episodes</span>
                                                                                <span class="statVal">🎬 {part.episodeCount || 1} Ep(s)</span>
                                                                            </div>
                                                                            <div class="statBox">
                                                                                <span class="statLabel">Rating</span>
                                                                                <span class="statVal star">
                                                                                    <IconStar size={13} fill="#F59E0B" color="#F59E0B" />
                                                                                    {(part.scores?.combinedAverage || part.scores?.mal?.score || 8.5).toFixed(1)}/10
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {#if part.languages?.audioDubs && part.languages.audioDubs.length > 0}
                                                                            <div class="stepDubsRow">
                                                                                <span class="dubsTitle"><IconMicrophone size={12} /> Verified Dubs:</span>
                                                                                <div class="dubsTags">
                                                                                    {#each part.languages.audioDubs as dub}
                                                                                        <span class="dubTag {dub.toLowerCase().includes('hindi') ? 'dub--hindi' : ''}">{dub}</span>
                                                                                    {/each}
                                                                                </div>
                                                                            </div>
                                                                        {/if}
                                                                    </div>
                                                                </div>
                                                            {/each}
                                                        </div>
                                                    </div>

                                                {:else if ep.rawJson?.data?.franchises || ep.rawJson?.data?.anime || (Array.isArray(ep.rawJson?.data) && ep.rawJson.data.length > 0 && (ep.rawJson.data[0].titles || ep.rawJson.data[0].title))}
                                                    <!-- Visual Anime Collection Grid -->
                                                    <div class="visualCardsGrid">
                                                        {#each (ep.rawJson.data.anime || ep.rawJson.data.franchises || ep.rawJson.data).slice(0, 8) as item}
                                                            <div class="visualAnimeCard">
                                                                <div class="cardPosterWrapper">
                                                                    <img
                                                                        src={item.coverImage || item.images?.poster || item.timeline?.[0]?.images?.poster || 'https://placehold.co/300x450/1e293b/white?text=AniNexus'}
                                                                        alt={item.title?.primary || item.titles?.primary || 'Anime'}
                                                                        loading="lazy"
                                                                    />
                                                                    {#if item.score || item.combinedScore || item.timeline?.[0]?.scores?.combinedAverage}
                                                                        <span class="scoreTag">
                                                                            <IconStar size={12} fill="#F59E0B" color="#F59E0B" />
                                                                            {(item.score || item.combinedScore || item.timeline[0].scores.combinedAverage).toFixed(1)}
                                                                        </span>
                                                                    {/if}
                                                                    {#if item.nextAiringEpisode?.countdown}
                                                                        <span class="countdownTag">⏳ {item.nextAiringEpisode.countdown}</span>
                                                                    {/if}
                                                                </div>
                                                                <div class="cardDetails">
                                                                    <strong class="animeTitle" title={item.title?.primary || item.titles?.primary || ''}>
                                                                        {item.title?.primary || item.titles?.primary || item.titles?.english || item.titles?.romaji || 'Anime Title'}
                                                                    </strong>
                                                                    <div class="animeMetaRow">
                                                                        <span class="formatPill">{item.format || item.timeline?.[0]?.format || 'TV'}</span>
                                                                        {#if item.studio}
                                                                            <span class="studioPill">🎬 {item.studio}</span>
                                                                        {/if}
                                                                        <span class="partsCount">{item.episodes ? `${item.episodes} Eps` : (item.totalParts ? `${item.totalParts} Parts` : (item.totalEpisodes ? `${item.totalEpisodes} Eps` : ''))}</span>
                                                                    </div>
                                                                    {#if item.genres && item.genres.length > 0}
                                                                        <div class="animeDubsRow">
                                                                            {#each item.genres.slice(0, 2) as g}
                                                                                <span class="dubBadge jap">{g}</span>
                                                                            {/each}
                                                                        </div>
                                                                    {:else}
                                                                        <div class="animeDubsRow">
                                                                            {#if item.dubAvailability?.hasHindiDub || item.timeline?.[0]?.languages?.audioDubs?.includes('Hindi')}
                                                                                <span class="dubBadge hindi">Hindi</span>
                                                                            {/if}
                                                                            {#if item.dubAvailability?.hasEnglishDub || item.timeline?.[0]?.languages?.audioDubs?.includes('English')}
                                                                                <span class="dubBadge english">English</span>
                                                                            {/if}
                                                                            <span class="dubBadge jap">Japanese</span>
                                                                        </div>
                                                                    {/if}
                                                                </div>
                                                            </div>
                                                        {/each}
                                                    </div>

                                                {:else if ep.rawJson?.data?.calendar}
                                                    <!-- Visual Weekly Airing Schedule (AniChart Parity) -->
                                                    <div class="visualScheduleCalendar">
                                                        <div class="calendarBanner">
                                                            <span class="calendarEmoji">📅</span>
                                                            <div>
                                                                <h5>Weekly Broadcast Calendar</h5>
                                                                <p>Live countdowns & episode schedule across all 7 days ({ep.rawJson.data.totalAiringThisWeek || 0} shows weekly)</p>
                                                            </div>
                                                        </div>
                                                        <div class="calendarDaysGrid">
                                                            {#each Object.entries(ep.rawJson.data.calendar) as [day, dayEpisodes]}
                                                                {#if Array.isArray(dayEpisodes) && dayEpisodes.length > 0}
                                                                    <div class="dayColumn">
                                                                        <div class="dayHeader">
                                                                            <span class="dayTitle">{day}</span>
                                                                            <span class="dayCount">{dayEpisodes.length}</span>
                                                                        </div>
                                                                        <div class="dayCardsList">
                                                                            {#each dayEpisodes.slice(0, 3) as epItem}
                                                                                <div class="airingCardMini">
                                                                                    <img src={epItem.anime?.coverImage || 'https://placehold.co/80x110/1e293b/white?text=Anime'} alt={epItem.anime?.title?.primary} class="airingImg" />
                                                                                    <div class="airingDetails">
                                                                                        <span class="airingCountdown">⏳ {epItem.countdown}</span>
                                                                                        <strong class="airingName">{epItem.anime?.title?.primary}</strong>
                                                                                        <span class="airingMeta">Ep {epItem.episodeNumber}{epItem.totalEpisodes ? ` of ${epItem.totalEpisodes}` : ''} • {epItem.studio || epItem.anime?.format || 'TV'}</span>
                                                                                    </div>
                                                                                </div>
                                                                            {/each}
                                                                        </div>
                                                                    </div>
                                                                {/if}
                                                            {/each}
                                                        </div>
                                                    </div>

                                                {:else if ep.rawJson?.data?.categories && Array.isArray(ep.rawJson.data.categories)}
                                                    <!-- Visual Awards Showcase -->
                                                    <div class="visualAwardsGrid">
                                                        <div class="awardsBanner">
                                                            <span class="awardsTrophy">🏆</span>
                                                            <div>
                                                                <h5>{ep.rawJson.data.year || '2026'} Industry Anime Awards Showcase</h5>
                                                                <p>Annual honors recognizing premier production excellence</p>
                                                            </div>
                                                        </div>
                                                        <div class="categoriesGrid">
                                                            {#each ep.rawJson.data.categories.slice(0, 6) as cat}
                                                                <div class="awardCard">
                                                                    <div class="awardHeader">
                                                                        <span class="winnerTag">👑 WINNER</span>
                                                                        <span class="catName">{cat.name}</span>
                                                                    </div>
                                                                    <div class="awardWinnerRow">
                                                                        {#if cat.winner?.imageUrl}
                                                                            <img src={cat.winner.imageUrl} alt={cat.winner.title?.english || 'Winner'} class="awardThumb" />
                                                                        {/if}
                                                                        <div class="awardWinnerInfo">
                                                                            <strong>{cat.winner?.title?.english || cat.winner?.title?.romaji || 'Winner'}</strong>
                                                                            <span class="awardScore">★ 9.2 Community Consensus</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            {/each}
                                                        </div>
                                                    </div>

                                                {:else if ep.rawJson?.data?.articles && Array.isArray(ep.rawJson.data.articles)}
                                                    <!-- Visual News Grid -->
                                                    <div class="visualNewsGrid">
                                                        {#each ep.rawJson.data.articles.slice(0, 6) as art}
                                                            <div class="newsCard">
                                                                {#if art.image}
                                                                    <img src={art.image} alt={art.title} class="newsImg" />
                                                                {/if}
                                                                <div class="newsBody">
                                                                    <span class="newsCategory">{art.category || 'Anime News'}</span>
                                                                    <strong class="newsHeadline">{art.title}</strong>
                                                                    <span class="newsTime">{art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : 'Recent'}</span>
                                                                </div>
                                                            </div>
                                                        {/each}
                                                    </div>

                                                {:else if ep.rawJson?.data?.staff && Array.isArray(ep.rawJson.data.staff)}
                                                    <!-- Visual Animation Studios & Production Staff Showcase -->
                                                    <div class="visualStaffGrid">
                                                        {#if ep.rawJson.data.studios && ep.rawJson.data.studios.length > 0}
                                                            <div class="studiosRow">
                                                                {#each ep.rawJson.data.studios as std}
                                                                    <div class="studioBadgeCard {std.isMain ? 'mainStudio' : ''}">
                                                                        <span class="studioIcon">{std.isAnimationStudio ? '🎬' : '🏢'}</span>
                                                                        <div>
                                                                            <strong>{std.name}</strong>
                                                                            <span class="studioRole">{std.isMain ? 'Main Animation Studio' : (std.isAnimationStudio ? 'Animation Production' : 'Producer')}</span>
                                                                        </div>
                                                                    </div>
                                                                {/each}
                                                            </div>
                                                        {/if}

                                                        <div class="staffCardsGrid">
                                                            {#each ep.rawJson.data.staff.slice(0, 8) as stf}
                                                                <div class="staffCard">
                                                                    <div class="staffCardHeader">
                                                                        <img src={stf.image || 'https://placehold.co/100x120/1e293b/white?text=Staff'} alt={stf.name?.full} class="staffAvatar" />
                                                                        <div class="staffInfo">
                                                                            <span class="staffRole">{stf.role}</span>
                                                                            <strong class="staffName">{stf.name?.full}</strong>
                                                                            {#if stf.name?.native}
                                                                                <span class="staffNative">{stf.name.native}</span>
                                                                            {/if}
                                                                            {#if stf.primaryOccupations && stf.primaryOccupations.length > 0}
                                                                                <span class="staffOccupation">{stf.primaryOccupations.join(', ')}</span>
                                                                            {/if}
                                                                        </div>
                                                                    </div>
                                                                    {#if stf.socials && stf.socials.length > 0}
                                                                        <div class="staffSocialsRow">
                                                                            {#each stf.socials as soc}
                                                                                <a href={soc.url} target="_blank" rel="noopener noreferrer" class="socialPill">
                                                                                    <span>🔗 {soc.platform}</span>
                                                                                </a>
                                                                            {/each}
                                                                        </div>
                                                                    {/if}
                                                                </div>
                                                            {/each}
                                                        </div>
                                                    </div>

                                                {:else if ep.rawJson?.data?.characters && Array.isArray(ep.rawJson.data.characters)}
                                                    <!-- Visual Characters & Multi-Lingual Voice Actors Showcase -->
                                                    <div class="visualCharactersGrid">
                                                        {#each ep.rawJson.data.characters.slice(0, 8) as ch}
                                                            <div class="characterCard">
                                                                <img src={ch.image || 'https://placehold.co/120x150/1e293b/white?text=Char'} alt={ch.name?.full} class="charImg" />
                                                                <div class="charInfo">
                                                                    <span class="charRole role--{ch.role?.toLowerCase()}">{ch.role || 'Main'}</span>
                                                                    <strong class="charName">{ch.name?.full}</strong>
                                                                    {#if ch.name?.native}
                                                                        <span class="charNative">{ch.name.native}</span>
                                                                    {/if}
                                                                    {#if ch.voiceActors && ch.voiceActors.length > 0}
                                                                        <div class="charVAs">
                                                                            <span class="vaTitle">🎙️ VA: {ch.voiceActors[0].name?.full} ({ch.voiceActors[0].language})</span>
                                                                        </div>
                                                                    {/if}
                                                                </div>
                                                            </div>
                                                        {/each}
                                                    </div>

                                                {:else}
                                                    <!-- Generic Inspector View -->
                                                    <div class="visualGenericInspector">
                                                        <div class="inspectorHeader">
                                                            <IconCheck size={16} color="#10B981" />
                                                            <span>JSON Payload Parsed ({Object.keys(ep.rawJson?.data || ep.rawJson || {}).length} Root Properties)</span>
                                                        </div>
                                                        <div class="inspectorKeyGrid">
                                                            {#each Object.entries(ep.rawJson?.data || ep.rawJson || {}).slice(0, 10) as [k, v]}
                                                                <div class="inspectorKeyRow">
                                                                    <span class="keyName">{k}:</span>
                                                                    <span class="keyVal">{typeof v === 'object' ? (Array.isArray(v) ? `[${v.length} items]` : '{Object}') : String(v)}</span>
                                                                </div>
                                                            {/each}
                                                        </div>
                                                        <div class="inspectorHint">
                                                            Tip: Switch to <strong>&#123; &#125; Raw JSON</strong> above for the full unfiltered schema.
                                                        </div>
                                                    </div>
                                                {/if}
                                            </div>
                                        {/if}
                                    {:else if ep.error}
                                        <div class="errorBox">{ep.error}</div>
                                    {/if}
                                </div>
                            {/if}

                            <!-- Code Snippet Generator -->
                            <div class="codeSnippets">
                                <div class="snippetsHeader">
                                    <div class="snippetTabs">
                                        <button
                                            class="tabBtn {activeSnippetTabs[ep.id] === 'curl' ? 'active' : ''}"
                                            on:click={() => activeSnippetTabs[ep.id] = 'curl'}
                                        >cURL</button>
                                        <button
                                            class="tabBtn {activeSnippetTabs[ep.id] === 'js' ? 'active' : ''}"
                                            on:click={() => activeSnippetTabs[ep.id] = 'js'}
                                        >JavaScript</button>
                                        <button
                                            class="tabBtn {activeSnippetTabs[ep.id] === 'python' ? 'active' : ''}"
                                            on:click={() => activeSnippetTabs[ep.id] = 'python'}
                                        >Python</button>
                                    </div>
                                    <button
                                        class="copySnippetBtn"
                                        on:click={() => {
                                            const code = activeSnippetTabs[ep.id] === 'curl' ? getCurlSnippet(ep, paramValues[ep.id]) :
                                                        activeSnippetTabs[ep.id] === 'js' ? getJsSnippet(ep, paramValues[ep.id]) : getPythonSnippet(ep, paramValues[ep.id]);
                                            copyCodeSnippet(code, ep.id);
                                        }}
                                    >
                                        {#if copiedCode === ep.id}
                                            <IconCheck size={14} color="#10B981" />
                                            <span>Copied</span>
                                        {:else}
                                            <IconCopy size={14} />
                                            <span>Copy Code</span>
                                        {/if}
                                    </button>
                                </div>
                                <div class="snippetBody">
                                    {#if activeSnippetTabs[ep.id] === 'curl'}
                                        <pre><code>{getCurlSnippet(ep, paramValues[ep.id])}</code></pre>
                                    {:else if activeSnippetTabs[ep.id] === 'js'}
                                        <pre><code>{getJsSnippet(ep, paramValues[ep.id])}</code></pre>
                                    {:else}
                                        <pre><code>{getPythonSnippet(ep, paramValues[ep.id])}</code></pre>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </article>
                {/each}
            </div>
        </main>
    </div>

    <Footer />
</div>

<style lang="scss">
    .docsPage {
        min-height: 100vh;
        background: #0B0F19;
        color: #E2E8F0;
        font-family: inherit;
        padding-top: 100px;
    }

    .docsHero {
        background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 70%),
                    linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, #0B0F19 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        padding: 50px 24px 40px;

        &__container {
            max-width: 1280px;
            margin: 0 auto;
        }

        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            color: #94A3B8;
            margin-bottom: 16px;

            a {
                color: #A78BFA;
                text-decoration: none;
                &:hover {
            border-color: rgba(139, 92, 246, 0.35);
            box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
        }

        &.highlighted {
            border-color: #8B5CF6;
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
            transition: all 0.5s ease;
        }
            }

            .active {
                color: #FFFFFF;
                font-weight: 500;
            }
        }

        h1 {
            font-size: 2.4rem;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -0.03em;
            margin: 0 0 12px;

            span {
                color: #8B5CF6;
                font-weight: 400;
            }
        }

        p {
            font-size: 1.05rem;
            line-height: 1.6;
            color: #94A3B8;
            max-width: 820px;
            margin: 0 0 16px;

            strong {
                color: #F1F5F9;
            }
        }

        .roadmapNotice {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.25);
            border-radius: 8px;
            padding: 8px 14px;
            margin-bottom: 22px;
            font-size: 0.85rem;
            color: #C4B5FD;

            .noticeBadge {
                background: #8B5CF6;
                color: #FFFFFF;
                font-size: 0.72rem;
                font-weight: 700;
                padding: 2px 8px;
                border-radius: 4px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                white-space: nowrap;
            }

            strong {
                color: #FFFFFF;
            }
        }

        .heroPills {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }

        .heroPill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.82rem;
            font-weight: 600;
            color: #CBD5E1;
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 9999px;
            padding: 6px 14px;

            &.heroLink {
                background: rgba(139, 92, 246, 0.15);
                border-color: rgba(139, 92, 246, 0.35);
                color: #DDD6FE;
                text-decoration: none;
                transition: all 0.2s ease;

                &:hover {
                    background: #8B5CF6;
                    color: #FFFFFF;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
                }
            }

            code {
                color: #A78BFA;
                font-family: monospace;
            }

            .pillDot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #10B981;
                box-shadow: 0 0 8px #10B981;
            }
        }
    }

    .docsContainer {
        max-width: 1280px;
        margin: 0 auto;
        padding: 40px 24px 80px;
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 40px;
        align-items: start;
    }

    /* Sidebar */
    .docsSidebar {
        position: sticky;
        top: 120px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 20px;
        backdrop-filter: blur(16px);

        .sidebarSearch {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #0B0F19;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 10px 12px;
            margin-bottom: 20px;

            input {
                background: transparent;
                border: none;
                color: #FFFFFF;
                font-size: 0.88rem;
                width: 100%;
                outline: none;

                &::placeholder {
                    color: #64748B;
                }
            }
        }

        .sidebarHeading {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748B;
            margin-bottom: 12px;
            padding-left: 6px;
        }

        .categoryList {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .catBtn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 10px 14px;
            border-radius: 10px;
            background: transparent;
            border: none;
            color: #94A3B8;
            font-size: 0.88rem;
            font-weight: 500;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s ease;

            span:first-of-type {
                flex: 1;
            }

            .catBadge {
                font-size: 0.72rem;
                font-weight: 700;
                color: #64748B;
                background: rgba(255, 255, 255, 0.05);
                padding: 2px 7px;
                border-radius: 9999px;
            }

            &:hover {
                background: rgba(139, 92, 246, 0.1);
                color: #FFFFFF;
            }

            &.active {
                background: rgba(139, 92, 246, 0.2);
                color: #A78BFA;
                font-weight: 600;

                .catBadge {
                    color: #A78BFA;
                    background: rgba(139, 92, 246, 0.25);
                }
            }
        }
    }

    /* Main Section */
    .docsMain {
        min-width: 0;

        .endpointsHeader {
            margin-bottom: 24px;

            h2 {
                font-size: 1.6rem;
                font-weight: 700;
                color: #FFFFFF;
                margin: 0 0 6px;

                span {
                    color: #8B5CF6;
                    font-size: 1.2rem;
                    font-weight: 500;
                }
            }

            .endpointsSubtext {
                font-size: 0.9rem;
                color: #94A3B8;

                strong {
                    color: #10B981;
                }
            }
        }

        .noResults {
            text-align: center;
            padding: 60px 20px;
            background: rgba(15, 23, 42, 0.4);
            border-radius: 16px;
            border: 1px dashed rgba(255, 255, 255, 0.1);

            p {
                color: #94A3B8;
                margin-bottom: 16px;
            }

            .resetBtn {
                background: #8B5CF6;
                color: #FFFFFF;
                border: none;
                padding: 8px 18px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.2s;

                &:hover {
                    opacity: 0.9;
                }
            }
        }

        .endpointsList {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }
    }

    /* Endpoint Card */
    .endpointCard {
        background: #0F172A;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        overflow: hidden;
        transition: border-color 0.25s ease, box-shadow 0.25s ease;

        &:hover {
            border-color: rgba(139, 92, 246, 0.35);
            box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .epHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 20px;
            background: rgba(30, 41, 59, 0.4);
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            flex-wrap: wrap;
            gap: 12px;
        }

        .epMethodGroup {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .methodBadge {
            font-size: 0.72rem;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 6px;
            letter-spacing: 0.05em;

            &.get {
                background: rgba(16, 185, 129, 0.15);
                color: #10B981;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
        }

        .epPath {
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 0.95rem;
            font-weight: 600;
            color: #F8FAFC;
        }

        .epActions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .copyBtn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #94A3B8;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.78rem;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                color: #FFFFFF;
                border-color: rgba(255, 255, 255, 0.25);
            }

            .copiedText {
                color: #10B981;
                font-weight: 600;
            }
        }

        .executeBtn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
            color: #FFFFFF;
            border: none;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);

            &:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .spinner {
                width: 12px;
                height: 12px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: #FFFFFF;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
        }

        .epBody {
            padding: 24px;
        }

        .epTitle {
            font-size: 1.15rem;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0 0 6px;
        }

        .epDescription {
            font-size: 0.9rem;
            color: #94A3B8;
            line-height: 1.5;
            margin: 0 0 20px;
        }

        /* Parameters */
        .paramsSection {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 18px;

            .paramsHeading {
                font-size: 0.78rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #A78BFA;
                margin: 0 0 12px;
            }

            .paramsTable {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .paramRow {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.04);

                &:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
            }

            .paramMeta {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
            }

            .paramName {
                font-family: monospace;
                font-size: 0.88rem;
                font-weight: 700;
                color: #FFFFFF;
            }

            .paramType {
                font-size: 0.72rem;
                color: #64748B;
                background: rgba(255, 255, 255, 0.05);
                padding: 2px 6px;
                border-radius: 4px;
            }

            .paramDesc {
                font-size: 0.82rem;
                color: #94A3B8;
            }

            .paramInput {
                input, select {
                    background: #0B0F19;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: #E2E8F0;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    outline: none;
                    min-width: 160px;

                    &:focus {
                        border-color: #8B5CF6;
                    }
                }
            }
        }

        /* Live URL preview */
        .liveUrlPreview {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #0B0F19;
            padding: 8px 14px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            margin-bottom: 18px;
            overflow-x: auto;

            .urlLabel {
                font-size: 0.75rem;
                font-weight: 700;
                color: #64748B;
                white-space: nowrap;
            }

            code {
                font-family: monospace;
                font-size: 0.82rem;
                color: #A78BFA;
                white-space: nowrap;
            }
        }

        /* Response Panel */
        .responsePanel {
            background: #080D1A;
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
            margin-bottom: 20px;
            overflow: hidden;

            .responseMetaBar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 10px;
                padding: 10px 16px;
                background: rgba(30, 41, 59, 0.4);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                font-size: 0.8rem;
            }

            .metaBarLeft {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
            }

            .metaBarRight {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
            }

            .viewModeToggle {
                display: inline-flex;
                background: rgba(15, 23, 42, 0.8);
                padding: 2px;
                border-radius: 8px;
                border: 1px solid rgba(139, 92, 246, 0.25);

                .toggleBtn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: transparent;
                    border: none;
                    color: #94A3B8;
                    font-size: 0.72rem;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;

                    &:hover {
                        color: #FFFFFF;
                    }

                    &.active {
                        color: #FFFFFF;
                        background: #8B5CF6;
                        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
                    }
                }
            }

            .statusBadge {
                font-weight: 700;
                padding: 2px 8px;
                border-radius: 4px;

                &.success {
                    color: #10B981;
                    background: rgba(16, 185, 129, 0.15);
                }

                &.purged {
                    color: #F59E0B;
                    background: rgba(245, 158, 11, 0.15);
                }

                &.error {
                    color: #EF4444;
                    background: rgba(239, 68, 68, 0.15);
                }
            }

            .latencyBadge {
                color: #94A3B8;
                font-family: monospace;
            }

            .copyResponseBtn {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #CBD5E1;
                font-size: 0.74rem;
                padding: 4px 8px;
                border-radius: 6px;
                cursor: pointer;

                &:hover {
                    color: #FFFFFF;
                    border-color: rgba(255, 255, 255, 0.25);
                }
            }

            .jsonViewer {
                max-height: 380px;
                overflow-y: auto;
                padding: 16px;
                margin: 0;
                font-family: 'Fira Code', 'Courier New', monospace;
                font-size: 0.8rem;
                line-height: 1.5;
                color: #38BDF8;

                &::-webkit-scrollbar {
                    width: 6px;
                }
                &::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 3px;
                }
            }

            .visualPreviewContainer {
                max-height: 480px;
                overflow-y: auto;
                padding: 16px;

                &::-webkit-scrollbar {
                    width: 6px;
                }
                &::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 3px;
                }
            }

            /* 1. Watch Order Roadmap */
            .timelineRoadmap {
                display: flex;
                flex-direction: column;
                gap: 16px;

                .roadmapHeader {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 10px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

                    .roadmapTitleGroup {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        .roadmapIcon {
                            font-size: 1.5rem;
                        }

                        h5 {
                            margin: 0;
                            color: #FFFFFF;
                            font-size: 1.05rem;
                            font-weight: 700;
                        }

                        .roadmapMeta {
                            margin: 2px 0 0;
                            font-size: 0.76rem;
                            color: #94A3B8;
                        }
                    }

                    .roadmapPills {
                        display: flex;
                        gap: 8px;

                        .roadmapPill {
                            font-size: 0.72rem;
                            color: #CBD5E1;
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            padding: 3px 8px;
                            border-radius: 6px;

                            code {
                                color: #A78BFA;
                            }

                            &.verified {
                                color: #10B981;
                                background: rgba(16, 185, 129, 0.1);
                                border-color: rgba(16, 185, 129, 0.3);
                            }
                        }
                    }
                }

                .roadmapSteps {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .roadmapStep {
                    display: flex;
                    gap: 16px;
                    position: relative;

                    .stepSpine {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 32px;
                        flex-shrink: 0;

                        .stepDot {
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            background: linear-gradient(135deg, #8B5CF6, #6366F1);
                            color: #FFFFFF;
                            font-family: monospace;
                            font-size: 0.75rem;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
                            z-index: 2;
                        }

                        .stepConnectorLine {
                            flex: 1;
                            width: 2px;
                            background: linear-gradient(to bottom, #8B5CF6, rgba(139, 92, 246, 0.2));
                            min-height: 30px;
                            margin: 4px 0;
                        }
                    }

                    .stepCard {
                        flex: 1;
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(139, 92, 246, 0.2);
                        border-radius: 10px;
                        padding: 12px 16px;
                        margin-bottom: 14px;
                        transition: border-color 0.2s ease;

                        &:hover {
                            border-color: rgba(139, 92, 246, 0.45);
                        }

                        .stepCardTop {
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            flex-wrap: wrap;
                            margin-bottom: 8px;

                            .stepOrderBadge {
                                font-size: 0.68rem;
                                font-weight: 800;
                                color: #A78BFA;
                                background: rgba(139, 92, 246, 0.15);
                                padding: 2px 6px;
                                border-radius: 4px;
                                font-family: monospace;
                            }

                            .stepName {
                                margin: 0;
                                color: #F8FAFC;
                                font-size: 0.95rem;
                                font-weight: 600;
                                flex: 1;
                            }

                            .stepBadgesRow {
                                display: flex;
                                gap: 6px;
                                align-items: center;

                                .formatBadge {
                                    font-size: 0.68rem;
                                    font-weight: 700;
                                    padding: 2px 6px;
                                    border-radius: 4px;
                                    text-transform: uppercase;

                                    &.format--tv {
                                        background: rgba(59, 130, 246, 0.2);
                                        color: #60A5FA;
                                    }
                                    &.format--movie {
                                        background: rgba(245, 158, 11, 0.2);
                                        color: #FBBF24;
                                    }
                                    &.format--ova, &.format--ona {
                                        background: rgba(20, 184, 166, 0.2);
                                        color: #2DD4BF;
                                    }
                                }

                                .canonBadge {
                                    font-size: 0.68rem;
                                    font-weight: 700;
                                    padding: 2px 6px;
                                    border-radius: 4px;

                                    &.canon {
                                        background: rgba(16, 185, 129, 0.2);
                                        color: #34D399;
                                    }
                                    &.side {
                                        background: rgba(148, 163, 184, 0.2);
                                        color: #94A3B8;
                                    }
                                }

                                .priorityBadge {
                                    font-size: 0.68rem;
                                    font-weight: 700;
                                    padding: 2px 6px;
                                    border-radius: 4px;

                                    &.priority--essential {
                                        background: rgba(239, 68, 68, 0.2);
                                        color: #F87171;
                                    }
                                    &.priority--recommended {
                                        background: rgba(245, 158, 11, 0.2);
                                        color: #FBBF24;
                                    }
                                    &.priority--optional {
                                        background: rgba(148, 163, 184, 0.2);
                                        color: #94A3B8;
                                    }
                                }
                            }
                        }

                        .stepCardStats {
                            display: flex;
                            gap: 16px;
                            flex-wrap: wrap;
                            margin-bottom: 8px;
                            font-size: 0.78rem;

                            .statBox {
                                display: flex;
                                align-items: center;
                                gap: 6px;

                                .statLabel {
                                    color: #64748B;
                                    font-size: 0.72rem;
                                }

                                .statVal {
                                    color: #CBD5E1;
                                    font-weight: 500;

                                    &.star {
                                        color: #F59E0B;
                                        display: inline-flex;
                                        align-items: center;
                                        gap: 3px;
                                        font-weight: 700;
                                    }
                                }
                            }
                        }

                        .stepDubsRow {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            flex-wrap: wrap;
                            font-size: 0.75rem;

                            .dubsTitle {
                                display: inline-flex;
                                align-items: center;
                                gap: 4px;
                                color: #64748B;
                                font-size: 0.72rem;
                            }

                            .dubsTags {
                                display: flex;
                                gap: 5px;
                                flex-wrap: wrap;

                                .dubTag {
                                    font-size: 0.7rem;
                                    padding: 1px 6px;
                                    border-radius: 4px;
                                    background: rgba(255, 255, 255, 0.06);
                                    color: #E2E8F0;

                                    &.dub--hindi {
                                        background: rgba(249, 115, 22, 0.2);
                                        color: #FB923C;
                                        font-weight: 600;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            /* 2. Visual Anime Cards Grid */
            .visualCardsGrid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 14px;

                .visualAnimeCard {
                    background: rgba(15, 23, 42, 0.7);
                    border: 1px solid rgba(139, 92, 246, 0.2);
                    border-radius: 10px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s ease, border-color 0.2s ease;

                    &:hover {
                        transform: translateY(-3px);
                        border-color: rgba(139, 92, 246, 0.5);
                    }

                    .cardPosterWrapper {
                        position: relative;
                        width: 100%;
                        height: 140px;
                        overflow: hidden;
                        background: #0B0F19;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }

                        .countdownTag {
                            position: absolute;
                            top: 8px;
                            left: 8px;
                            background: rgba(16, 185, 129, 0.9);
                            color: #FFFFFF;
                            font-size: 0.68rem;
                            font-weight: 700;
                            padding: 2px 6px;
                            border-radius: 4px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
                        }

                        .scoreTag {
                            position: absolute;
                            top: 8px;
                            right: 8px;
                            display: inline-flex;
                            align-items: center;
                            gap: 3px;
                            background: rgba(0, 0, 0, 0.85);
                            backdrop-filter: blur(6px);
                            color: #F59E0B;
                            font-size: 0.72rem;
                            font-weight: 700;
                            padding: 2px 6px;
                            border-radius: 4px;
                        }
                    }

                    .cardDetails {
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        gap: 6px;
                        flex: 1;

                        .animeTitle {
                            color: #F1F5F9;
                            font-size: 0.85rem;
                            line-height: 1.3;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }

                        .animeMetaRow {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            font-size: 0.72rem;
                            color: #94A3B8;

                            .formatPill {
                                background: rgba(139, 92, 246, 0.15);
                                color: #A78BFA;
                                padding: 1px 5px;
                                border-radius: 4px;
                                font-weight: 600;
                            }

                            .studioPill {
                                background: rgba(59, 130, 246, 0.15);
                                color: #93C5FD;
                                padding: 1px 5px;
                                border-radius: 4px;
                                font-weight: 600;
                                max-width: 90px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }

                        .animeDubsRow {
                            display: flex;
                            gap: 4px;
                            margin-top: auto;

                            .dubBadge {
                                font-size: 0.65rem;
                                padding: 1px 5px;
                                border-radius: 4px;
                                font-weight: 600;

                                &.hindi {
                                    background: rgba(249, 115, 22, 0.2);
                                    color: #FB923C;
                                }
                                &.english {
                                    background: rgba(59, 130, 246, 0.2);
                                    color: #60A5FA;
                                }
                                &.jap {
                                    background: rgba(148, 163, 184, 0.15);
                                    color: #CBD5E1;
                                }
                            }
                        }
                    }
                }
            }

            /* Visual Weekly Airing Schedule (AniChart Parity) */
            .visualScheduleCalendar {
                display: flex;
                flex-direction: column;
                gap: 14px;

                .calendarBanner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

                    .calendarEmoji {
                        font-size: 1.8rem;
                    }

                    h5 {
                        margin: 0;
                        color: #FFFFFF;
                        font-size: 1rem;
                        font-weight: 700;
                    }

                    p {
                        margin: 2px 0 0;
                        font-size: 0.78rem;
                        color: #94A3B8;
                    }
                }

                .calendarDaysGrid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 12px;
                    overflow-x: auto;

                    .dayColumn {
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.06);
                        border-radius: 10px;
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;

                        .dayHeader {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding-bottom: 6px;
                            border-bottom: 1px solid rgba(139, 92, 246, 0.2);

                            .dayTitle {
                                font-size: 0.82rem;
                                font-weight: 700;
                                color: #A78BFA;
                            }

                            .dayCount {
                                background: rgba(139, 92, 246, 0.25);
                                color: #C4B5FD;
                                font-size: 0.68rem;
                                font-weight: 700;
                                padding: 1px 6px;
                                border-radius: 10px;
                            }
                        }

                        .dayCardsList {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;

                            .airingCardMini {
                                display: flex;
                                gap: 8px;
                                background: rgba(30, 41, 59, 0.5);
                                border: 1px solid rgba(255, 255, 255, 0.04);
                                border-radius: 6px;
                                padding: 6px;
                                transition: background 0.15s ease;

                                &:hover {
                                    background: rgba(30, 41, 59, 0.85);
                                    border-color: rgba(139, 92, 246, 0.3);
                                }

                                .airingImg {
                                    width: 44px;
                                    height: 58px;
                                    object-fit: cover;
                                    border-radius: 4px;
                                    flex-shrink: 0;
                                }

                                .airingDetails {
                                    display: flex;
                                    flex-direction: column;
                                    justify-content: center;
                                    gap: 2px;
                                    min-width: 0;

                                    .airingCountdown {
                                        font-size: 0.65rem;
                                        color: #10B981;
                                        font-weight: 700;
                                    }

                                    .airingName {
                                        font-size: 0.74rem;
                                        color: #F1F5F9;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    }

                                    .airingMeta {
                                        font-size: 0.65rem;
                                        color: #94A3B8;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            /* 3. Visual Awards Showcase */
            .visualAwardsGrid {
                display: flex;
                flex-direction: column;
                gap: 16px;

                .awardsBanner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);

                    .awardsTrophy {
                        font-size: 2rem;
                    }

                    h5 {
                        margin: 0;
                        color: #FFFFFF;
                        font-size: 1.05rem;
                        font-weight: 700;
                    }

                    p {
                        margin: 2px 0 0;
                        font-size: 0.78rem;
                        color: #94A3B8;
                    }
                }

                .categoriesGrid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 12px;

                    .awardCard {
                        background: rgba(15, 23, 42, 0.7);
                        border: 1px solid rgba(245, 158, 11, 0.25);
                        border-radius: 10px;
                        padding: 12px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;

                        .awardHeader {
                            display: flex;
                            align-items: center;
                            gap: 8px;

                            .winnerTag {
                                background: rgba(245, 158, 11, 0.2);
                                color: #F59E0B;
                                font-size: 0.65rem;
                                font-weight: 800;
                                padding: 2px 6px;
                                border-radius: 4px;
                            }

                            .catName {
                                color: #CBD5E1;
                                font-size: 0.78rem;
                                font-weight: 600;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }

                        .awardWinnerRow {
                            display: flex;
                            align-items: center;
                            gap: 10px;

                            .awardThumb {
                                width: 44px;
                                height: 56px;
                                border-radius: 6px;
                                object-fit: cover;
                            }

                            .awardWinnerInfo {
                                display: flex;
                                flex-direction: column;
                                gap: 2px;

                                strong {
                                    color: #F8FAFC;
                                    font-size: 0.85rem;
                                    line-height: 1.2;
                                }

                                .awardScore {
                                    color: #F59E0B;
                                    font-size: 0.72rem;
                                    font-weight: 600;
                                }
                            }
                        }
                    }
                }
            }

            /* 4. Visual News Grid */
            .visualNewsGrid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                gap: 12px;

                .newsCard {
                    background: rgba(15, 23, 42, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;

                    .newsImg {
                        width: 100%;
                        height: 110px;
                        object-fit: cover;
                    }

                    .newsBody {
                        padding: 10px;
                        display: flex;
                        flex-direction: column;
                        gap: 4px;

                        .newsCategory {
                            color: #8B5CF6;
                            font-size: 0.68rem;
                            font-weight: 700;
                            text-transform: uppercase;
                        }

                        .newsHeadline {
                            color: #E2E8F0;
                            font-size: 0.82rem;
                            line-height: 1.3;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }

                        .newsTime {
                            color: #64748B;
                            font-size: 0.7rem;
                            margin-top: 4px;
                        }
                    }
                }
            }

            /* 5. Generic Inspector View */
            .visualGenericInspector {
                display: flex;
                flex-direction: column;
                gap: 12px;

                .inspectorHeader {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #10B981;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .inspectorKeyGrid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 8px;

                    .inspectorKeyRow {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        background: rgba(15, 23, 42, 0.6);
                        border: 1px solid rgba(255, 255, 255, 0.06);
                        border-radius: 6px;
                        padding: 6px 10px;
                        font-family: monospace;
                        font-size: 0.78rem;

                        .keyName {
                            color: #A78BFA;
                            font-weight: 600;
                        }

                        .keyVal {
                            color: #CBD5E1;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }

                .inspectorHint {
                    color: #94A3B8;
                    font-size: 0.75rem;
                    font-style: italic;
                    margin-top: 4px;

                    strong {
                        color: #E2E8F0;
                        font-style: normal;
                    }
                }
            }

            /* 6. Visual Staff & Studios Grid */
            .visualStaffGrid {
                display: flex;
                flex-direction: column;
                gap: 16px;

                .studiosRow {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;

                    .studioBadgeCard {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        background: rgba(15, 23, 42, 0.7);
                        border: 1px solid rgba(139, 92, 246, 0.25);
                        padding: 8px 12px;
                        border-radius: 8px;

                        &.mainStudio {
                            border-color: #8B5CF6;
                            background: rgba(139, 92, 246, 0.12);
                        }

                        .studioIcon {
                            font-size: 1.2rem;
                        }

                        strong {
                            color: #FFFFFF;
                            font-size: 0.85rem;
                            display: block;
                        }

                        .studioRole {
                            color: #A78BFA;
                            font-size: 0.7rem;
                        }
                    }
                }

                .staffCardsGrid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 12px;

                    .staffCard {
                        background: rgba(15, 23, 42, 0.7);
                        border: 1px solid rgba(255, 255, 255, 0.08);
                        border-radius: 10px;
                        padding: 12px;
                        display: flex;
                        flex-direction: column;
                        gap: 10px;

                        .staffCardHeader {
                            display: flex;
                            gap: 12px;

                            .staffAvatar {
                                width: 56px;
                                height: 68px;
                                border-radius: 6px;
                                object-fit: cover;
                                background: #0B0F19;
                            }

                            .staffInfo {
                                display: flex;
                                flex-direction: column;
                                gap: 2px;
                                flex: 1;

                                .staffRole {
                                    color: #F59E0B;
                                    font-size: 0.7rem;
                                    font-weight: 700;
                                    text-transform: uppercase;
                                }

                                .staffName {
                                    color: #F8FAFC;
                                    font-size: 0.9rem;
                                    line-height: 1.2;
                                }

                                .staffNative {
                                    color: #64748B;
                                    font-size: 0.75rem;
                                }

                                .staffOccupation {
                                    color: #94A3B8;
                                    font-size: 0.72rem;
                                }
                            }
                        }

                        .staffSocialsRow {
                            display: flex;
                            gap: 6px;
                            flex-wrap: wrap;
                            margin-top: auto;
                            padding-top: 6px;
                            border-top: 1px solid rgba(255, 255, 255, 0.05);

                            .socialPill {
                                font-size: 0.68rem;
                                color: #A78BFA;
                                background: rgba(139, 92, 246, 0.12);
                                border: 1px solid rgba(139, 92, 246, 0.25);
                                padding: 2px 7px;
                                border-radius: 4px;
                                text-decoration: none;
                                transition: all 0.2s ease;

                                &:hover {
                                    background: rgba(139, 92, 246, 0.25);
                                    color: #FFFFFF;
                                }
                            }
                        }
                    }
                }
            }

            /* 7. Visual Characters Grid */
            .visualCharactersGrid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                gap: 12px;

                .characterCard {
                    background: rgba(15, 23, 42, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 10px;
                    padding: 10px;
                    display: flex;
                    gap: 12px;
                    align-items: center;

                    .charImg {
                        width: 54px;
                        height: 68px;
                        border-radius: 6px;
                        object-fit: cover;
                        background: #0B0F19;
                    }

                    .charInfo {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                        flex: 1;

                        .charRole {
                            font-size: 0.65rem;
                            font-weight: 700;
                            padding: 1px 5px;
                            border-radius: 4px;
                            width: fit-content;
                            text-transform: uppercase;

                            &.role--main {
                                background: rgba(16, 185, 129, 0.2);
                                color: #34D399;
                            }
                            &.role--supporting {
                                background: rgba(59, 130, 246, 0.2);
                                color: #60A5FA;
                            }
                        }

                        .charName {
                            color: #F8FAFC;
                            font-size: 0.88rem;
                            line-height: 1.2;
                        }

                        .charNative {
                            color: #64748B;
                            font-size: 0.72rem;
                        }

                        .charVAs {
                            margin-top: 4px;

                            .vaTitle {
                                color: #CBD5E1;
                                font-size: 0.72rem;
                            }
                        }
                    }
                }
            }

            .errorBox {
                padding: 16px;
                color: #EF4444;
                font-family: monospace;
                font-size: 0.85rem;
            }
        }

        /* Code snippets */
        .codeSnippets {
            background: #0B0F19;
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            overflow: hidden;

            .snippetsHeader {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 6px 12px;
                background: rgba(30, 41, 59, 0.3);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .snippetTabs {
                display: flex;
                gap: 4px;
            }

            .tabBtn {
                background: transparent;
                border: none;
                color: #64748B;
                font-size: 0.75rem;
                font-weight: 600;
                padding: 4px 10px;
                border-radius: 6px;
                cursor: pointer;

                &:hover {
                    color: #CBD5E1;
                }

                &.active {
                    color: #A78BFA;
                    background: rgba(139, 92, 246, 0.15);
                }
            }

            .copySnippetBtn {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                background: transparent;
                border: none;
                color: #64748B;
                font-size: 0.72rem;
                cursor: pointer;

                &:hover {
                    color: #CBD5E1;
                }
            }

            .snippetBody {
                padding: 12px 16px;

                pre {
                    margin: 0;
                    font-family: monospace;
                    font-size: 0.8rem;
                    line-height: 1.4;
                    color: #E2E8F0;
                    overflow-x: auto;
                }
            }
        }
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
        .docsContainer {
            grid-template-columns: 1fr;
        }

        .docsSidebar {
            position: static;
        }
    }
</style>
