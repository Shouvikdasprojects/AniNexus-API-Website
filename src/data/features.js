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
    IconLayersLinked
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
            description: `353+ curated franchises (2010–${currentYear}) with consolidated multi-season timelines, movies, and specials.`
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
            description: `Crunchyroll Anime Awards (${awardsStartYear}–${currentYear}) with automated 6th-year auto-purge and HTTP 410 protection.`
        },
        {
            icon: IconCalendarEvent,
            highlight: false,
            onVersion: 1,
            label: "Seasonal Airing Hub",
            description: "Live tracker for current airing seasons (/seasons/now), upcoming previews, and historical archives."
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
            icon: IconCheckupList,
            highlight: false,
            onVersion: 1,
            label: "Daily Schedules",
            description: "Day-by-day release broadcast schedules with Indian Standard Time (IST) localization."
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
            icon: IconSparkles,
            highlight: false,
            onVersion: 2,
            label: "AI Semantic Search",
            description: "Natural language anime discovery powered by vector embeddings."
        },
        {
            icon: IconMovie,
            highlight: false,
            onVersion: 2,
            label: "Box Office Tracker",
            description: "Global & Indian theatrical anime box office collections tracking."
        },
        {
            icon: IconLanguage,
            highlight: false,
            onVersion: 2,
            label: "Voice Actor DB",
            description: "Complete Seiyuu & Indian dubbing artist credits and role mappings."
        }
    ]
};
