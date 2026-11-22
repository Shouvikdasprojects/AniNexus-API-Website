import {
    IconBuildingArch,
    IconCalendarEvent,
    IconDeviceTv,
    IconLanguage,
    IconMicrophone,
    IconMovie,
    IconNews,
    IconScale,
    IconSearch,
    IconSparkles,
    IconTrophy,
    IconVideo,
    IconCheckupList,
    IconChartBar,
    IconShieldCheck,
    IconLayersLinked,
    IconBook,
    IconUserCheck,
    IconMessages
} from "@tabler/icons-svelte";

const currentYear = new Date().getFullYear();
const awardsStartYear = currentYear - 5;

export default {
    available: [
        {
            icon: IconBuildingArch,
            highlight: true,
            onVersion: 1,
            label: "Master Franchise Vault",
            description: `634+ curated franchises (1960s–${currentYear}+) with consolidated multi-season timelines, movies, and specials.`
        },
        {
            icon: IconLanguage,
            highlight: true,
            onVersion: 1,
            label: "Characters & Seiyuu Archive",
            description: "3,553+ character dossiers with physical traits, Markdown bios, and 2,172+ multilingual voice actor profiles."
        },
        {
            icon: IconScale,
            highlight: true,
            onVersion: 1,
            label: "Dual Community Scores",
            description: "Proprietary dual scoring engine aggregating verified independent global community consensus for unbiased rankings."
        },
        {
            icon: IconMicrophone,
            highlight: true,
            onVersion: 1,
            label: "Verified Dub Matrix",
            description: "100% verified Indian & global audio dub tracks (Hindi, English, Japanese, Bengali, Tamil, Telugu)."
        },
        {
            icon: IconTrophy,
            highlight: true,
            onVersion: 1,
            label: "5-Year Rolling Awards",
            description: `Annual Industry Anime Awards (${awardsStartYear}–${currentYear}) with automated 6th-year auto-purge and HTTP 410 protection.`
        },
        {
            icon: IconCalendarEvent,
            highlight: false,
            onVersion: 1,
            label: "Seasonal Airing Hub",
            description: "Live tracker for current airing seasons (/seasons/now), upcoming previews, and historical archives."
        },
        {
            icon: IconCheckupList,
            highlight: false,
            onVersion: 1,
            label: "7-Day Broadcast Schedule",
            description: "Live weekly calendar with 138+ broadcasting episodes, exact UTC countdowns, and animation studio credits."
        },
        {
            icon: IconChartBar,
            highlight: false,
            onVersion: 1,
            label: "Curated Top Collections",
            description: "Instantly query Trending, Popular, Highest Rated, and Box Office anime movie leaderboards."
        },
        {
            icon: IconSearch,
            highlight: false,
            onVersion: 1,
            label: "Fast-Text Fuzzy Search",
            description: "Search across English titles, Romaji transliterations, and native Japanese Kanji."
        },
        {
            icon: IconShieldCheck,
            highlight: false,
            onVersion: 1,
            label: "Legal OTT Licensing",
            description: "Verified streaming availability for Crunchyroll, Netflix, Muse Asia, Ani-One, and JioCinema."
        },
        {
            icon: IconNews,
            highlight: false,
            onVersion: 1,
            label: "60-Day News Feed",
            description: "Curated anime industry announcements and licensing bulletins with automated 60-day cleanup."
        },
        {
            icon: IconVideo,
            highlight: false,
            onVersion: 1,
            label: "Official 4K Trailers",
            description: "Direct YouTube trailer embeds and PV promotional teasers mapped to each franchise."
        },
        {
            icon: IconLayersLinked,
            highlight: false,
            onVersion: 1,
            label: "CORS & Auth-less",
            description: "Public REST API with instant CORS headers, zero API tokens required, and 100% free access."
        }
    ],
    upcoming: [
        {
            icon: IconBook,
            highlight: true,
            onVersion: 2,
            label: "Manga & Light Novel Engine",
            description: "Complete manga & light novel catalog, volume/chapter tracking, and anime adaptation chapter-range mapping."
        },
        {
            icon: IconUserCheck,
            highlight: true,
            onVersion: 2,
            label: "Personal Watchlists & User Sync",
            description: "OAuth2 authentication, custom user watchlists (Watching, Completed, Plan to Watch), and cross-device sync."
        },
        {
            icon: IconMessages,
            highlight: true,
            onVersion: 2,
            label: "Community Discussions & Social Layer",
            description: "Episode reaction threads, community reviews, rating submissions, and character popularity fan polls."
        },
        {
            icon: IconDeviceTv,
            highlight: false,
            onVersion: 2,
            label: "GraphQL & WebSocket Streams",
            description: "Single-query flexible GraphQL endpoint and real-time WebSocket push notifications for episode broadcasts."
        },
        {
            icon: IconSparkles,
            highlight: false,
            onVersion: 2,
            label: "AI Semantic Vector Search",
            description: "Natural language anime discovery powered by high-dimensional vector embeddings and mood analysis."
        }
    ]
};
