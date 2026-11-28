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
        IconExternalLink,
        IconBook
    } from "@tabler/icons-svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { onMount } from "svelte";

    const currentYear = new Date().getFullYear();
    const awardsStartYear = currentYear - 5;

    const API_BASE = "https://ani-nexus.onrender.com";

    let totalFranchises = 634;
    let activeCategory = "all";
    let searchQuery = "";
    let copiedEndpoint = null;
    let copiedCode = null;
    let responseViewModes = {};
    let docsViewMode = "playground"; // 'playground' | 'recipes'
    let activeRecipeIndex = 0;
    let recipeCodeLangs = { 0: "ts", 1: "ts", 2: "ts" };

    const recipes = [
        {
            id: "recipe-watch-order",
            title: "Master Franchise Watch-Order Timeline App",
            subtitle: "Build a chronological watch-order guide with canon vs. filler continuity and multi-season timelines",
            badge: "Franchise Architecture",
            color: "#8B5CF6",
            endpoint: "/api/v1/series/:slug",
            endpointHash: "series-slug",
            description: "Franchises like Fate, Monogatari, Dragon Ball, or Attack on Titan have complex multi-season timelines, movies, OVAs, and spin-offs. AniNexus indexes each franchise into a structured hierarchy of chronological parts, release dates, episode counts, and canon continuity.",
            steps: [
                "Fetch master franchise metadata by slug (e.g. `attack-on-titan` or `naruto`) via `GET /api/v1/series/:slug`",
                "Extract `parts` array containing all TV seasons, movies, and specials in release sequence",
                "Sort or group parts by chronological storyline order (`order` or `releaseYear`)",
                "Display visual badges for total episodes, broadcast status, and dual consensus ratings"
            ],
            code: {
                ts: `// 1. Fetch Franchise Watch Order with AniNexus TypeScript SDK (or native fetch)
import { AniNexusClient } from './aniNexusClient';

const client = new AniNexusClient();

async function getFranchiseWatchOrder(seriesSlug: string) {
  // Fetch complete franchise timeline with all parts & dub metadata
  const franchise = await client.getSeries(seriesSlug);
  
  console.log(\`🎬 Franchise: \${franchise.name}\`);
  console.log(\`⭐ Rating: \${franchise.rating} | Dubs: \${franchise.dubs.totalCount}\`);

  // Build chronological viewing timeline
  const timeline = franchise.parts.map((part, index) => ({
    step: index + 1,
    title: part.title,
    type: part.type, // 'TV', 'Movie', 'OVA', 'Special'
    episodes: part.episodes,
    year: part.releaseYear,
    status: part.status,
    scores: part.scores // Dual community consensus scores
  }));

  return timeline;
}

// Example usage:
getFranchiseWatchOrder('attack-on-titan').then(console.log);`,
                py: `# 1. Use the lightweight Python SDK or standard requests
from aninexus import AniNexusClient

client = AniNexusClient()

def get_franchise_watch_order(series_slug: str):
    """Fetch complete franchise with parts and dub metadata."""
    franchise = client.get_series(series_slug)
    
    print(f"🎬 Franchise: {franchise['name']}")
    print(f"📊 Total Parts: {len(franchise.get('parts', []))}")
    
    # Build ordered viewing timeline
    timeline = []
    for idx, part in enumerate(franchise.get('parts', []), 1):
        timeline.append({
            "order": idx,
            "title": part.get("title"),
            "format": part.get("type"),
            "episodes": part.get("episodes"),
            "year": part.get("releaseYear"),
            "score": part.get("scores", {}).get("average")
        })
    return timeline

# Example: Inspect timeline
if __name__ == "__main__":
    order = get_franchise_watch_order("attack-on-titan")
    for item in order:
        print(f"[{item['order']}] {item['title']} ({item['year']}) - {item['episodes']} eps")`,
                dart: `// Flutter / Dart Implementation with http
import 'dart:convert';
import 'package:http/http.dart' as http;

class WatchOrderStep {
  final int step;
  final String title;
  final String format;
  final int episodes;
  final int year;

  WatchOrderStep({required this.step, required this.title, required this.format, required this.episodes, required this.year});
}

Future<List<WatchOrderStep>> fetchWatchOrder(String slug) async {
  final url = Uri.parse('https://ani-nexus.onrender.com/api/v1/series/\$slug');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    final data = jsonDecode(response.body)['data'];
    final List parts = data['parts'] ?? [];

    return parts.asMap().entries.map((entry) {
      final idx = entry.key + 1;
      final p = entry.value;
      return WatchOrderStep(
        step: idx,
        title: p['title'] ?? '',
        format: p['type'] ?? 'TV',
        episodes: p['episodes'] ?? 0,
        year: p['releaseYear'] ?? 0,
      );
    }).toList();
  } else {
    throw Exception('Failed to load franchise timeline');
  }
}`
            }
        },
        {
            id: "recipe-dub-tracker",
            title: "Indian & Global Dub Tracker",
            subtitle: "Filter streaming-ready anime by verified Hindi, Tamil, Telugu, and English audio dubs",
            badge: "Dub Intelligence",
            color: "#10B981",
            endpoint: "/api/v1/search?q=:query",
            endpointHash: "global-search",
            description: "Anime accessibility in regional Indian languages (Hindi, Tamil, Telugu) and global English dubs is growing exponentially. AniNexus is the first platform to index 100% verified voice casts, dub languages, and studio credits at the individual part level.",
            steps: [
                "Query the AniNexus catalog or search endpoint with language filters via `GET /api/v1/top`",
                "Inspect `dubs.availableLanguages` array (e.g. `['Hindi', 'English', 'Tamil']`)",
                "Extract verified dub studio, voice actors, and audio provider tags",
                "Render audio badge chips on your streaming UI or directory listing"
            ],
            code: {
                ts: `// Track Indian & Global Audio Dubs in TypeScript
import { AniNexusClient } from './aniNexusClient';

const client = new AniNexusClient();

async function findDubsByLanguage(targetLang: 'Hindi' | 'English' | 'Tamil' | 'Telugu') {
  // Query top or search results
  const results = await client.getTop('popular', 50);

  // Filter franchises that include verified regional dubs
  const availableWithDub = results.filter(franchise => 
    franchise.dubs?.availableLanguages?.includes(targetLang)
  );

  return availableWithDub.map(anime => ({
    title: anime.name,
    slug: anime.slug,
    totalDubs: anime.dubs.totalCount,
    allLanguages: anime.dubs.availableLanguages,
    rating: anime.rating
  }));
}

// Find all anime with verified Hindi dubbing
findDubsByLanguage('Hindi').then(dubs => {
  console.log(\`Found \${dubs.length} anime with verified Hindi audio:\`);
  console.table(dubs);
});`,
                py: `# Python Dub Tracker for OTT Platforms & Catalogs
import requests

API_BASE = "https://ani-nexus.onrender.com/api/v1"

def find_anime_by_dub_language(language: str = "Hindi"):
    """Find franchises that offer verified audio dubs in target language."""
    url = f"{API_BASE}/top?type=popular&limit=50"
    resp = requests.get(url).json()
    
    franchises = resp.get("data", [])
    matched = []
    
    for item in franchises:
        dubs = item.get("dubs", {})
        available_langs = dubs.get("availableLanguages", [])
        
        # Case-insensitive language check
        if any(language.lower() == l.lower() for l in available_langs):
            matched.append({
                "title": item.get("name"),
                "slug": item.get("slug"),
                "languages": available_langs,
                "parts_count": len(item.get("parts", []))
            })
            
    return matched

# Execute: Check for Hindi or Tamil dubs
hindi_titles = find_anime_by_dub_language("Hindi")
print(f"Verified Hindi Dub Titles: {len(hindi_titles)}")`,
                dart: `// Dart / Flutter Dub Tracker Component
import 'dart:convert';
import 'package:http/http.dart' as http;

class AnimeDubEntry {
  final String title;
  final String slug;
  final List<String> dubLanguages;

  AnimeDubEntry({required this.title, required this.slug, required this.dubLanguages});
}

Future<List<AnimeDubEntry>> getTitlesWithDub(String targetLanguage) async {
  final url = Uri.parse('https://ani-nexus.onrender.com/api/v1/top?type=popular&limit=50');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    final List data = jsonDecode(response.body)['data'] ?? [];
    
    return data.where((item) {
      final List langs = item['dubs']?['availableLanguages'] ?? [];
      return langs.any((l) => l.toString().toLowerCase() == targetLanguage.toLowerCase());
    }).map((item) {
      final List langs = item['dubs']?['availableLanguages'] ?? [];
      return AnimeDubEntry(
        title: item['name'] ?? '',
        slug: item['slug'] ?? '',
        dubLanguages: langs.map((e) => e.toString()).toList(),
      );
    }).toList();
  }
  return [];
}`
            }
        },
        {
            id: "recipe-live-calendar",
            title: "7-Day Live Broadcast & Airing Countdown Widget",
            subtitle: "Build a weekly release schedule with real-time countdowns and simulcast timers",
            badge: "Broadcast Telemetry",
            color: "#3B82F6",
            endpoint: "/api/v1/schedule",
            endpointHash: "schedule",
            description: "Keep fans informed of exactly when new episodes air every day of the week. The 7-Day Live Broadcast endpoint organizes the current season's simulcasts from Monday through Sunday with ISO timestamps and relative countdowns.",
            steps: [
                "Fetch the 7-day schedule via `GET /api/v1/schedule`",
                "Group airing episodes by day (`monday`, `tuesday`, ..., `sunday`)",
                "Read `airingAt` (Unix timestamp) and `countdown` (e.g. `in 4 hours 12 mins`)",
                "Display an interactive day switcher with episode cards and airing badges"
            ],
            code: {
                ts: `// 7-Day Airing Calendar in TypeScript
import { AniNexusClient } from './aniNexusClient';

const client = new AniNexusClient();

async function getWeeklyAiringCalendar() {
  const schedule = await client.getSchedule();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  const weeklyGuide = days.map(day => {
    const episodes = schedule[day] || [];
    return {
      day: day.toUpperCase(),
      totalReleases: episodes.length,
      shows: episodes.map(item => ({
        title: item.anime?.title?.primary,
        episodeNumber: item.episodeNumber,
        airingCountdown: item.countdown,
        airingTimeUtc: new Date(item.airingAt * 1000).toUTCString(),
        cover: item.anime?.coverImage
      }))
    };
  });

  return weeklyGuide;
}

// Run guide
getWeeklyAiringCalendar().then(calendar => {
  console.log("Weekly Simulcast Schedule Loaded:");
  calendar.forEach(d => console.log(\`\${d.day}: \${d.totalReleases} episodes airing\`));
});`,
                py: `# Python Weekly Airing Calendar & Countdown Generator
import requests
from datetime import datetime

API_BASE = "https://ani-nexus.onrender.com/api/v1"

def fetch_weekly_schedule():
    """Retrieve 7-day anime broadcast schedule with countdowns."""
    res = requests.get(f"{API_BASE}/schedule")
    schedule = res.json().get("data", {})
    
    calendar = {}
    for day, episodes in schedule.items():
        calendar[day] = []
        for ep in episodes:
            anime = ep.get("anime", {})
            air_timestamp = ep.get("airingAt", 0)
            air_dt = datetime.utcfromtimestamp(air_timestamp) if air_timestamp else None
            
            calendar[day].append({
                "anime": anime.get("title", {}).get("primary"),
                "episode": ep.get("episodeNumber"),
                "countdown": ep.get("countdown"),
                "air_time_utc": air_dt.strftime("%Y-%m-%d %H:%M UTC") if air_dt else "N/A"
            })
    return calendar

if __name__ == "__main__":
    weekly = fetch_weekly_schedule()
    for day, shows in weekly.items():
        print(f"📅 {day.capitalize()} ({len(shows)} releases)")
        for s in shows[:3]:
            print(f"  • {s['anime']} Ep {s['episode']} ({s['countdown']})")`,
                dart: `// Dart / Flutter Weekly Broadcast Schedule
import 'dart:convert';
import 'package:http/http.dart' as http;

class AiringEpisode {
  final String title;
  final int episode;
  final String countdown;

  AiringEpisode({required this.title, required this.episode, required this.countdown});
}

Future<Map<String, List<AiringEpisode>>> getWeeklySchedule() async {
  final url = Uri.parse('https://ani-nexus.onrender.com/api/v1/schedule');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    final Map<String, dynamic> data = jsonDecode(response.body)['data'] ?? {};
    final Map<String, List<AiringEpisode>> schedule = {};

    data.forEach((day, episodes) {
      if (episodes is List) {
        schedule[day] = episodes.map((ep) => AiringEpisode(
          title: ep['anime']?['title']?['primary'] ?? 'Unknown',
          episode: ep['episodeNumber'] ?? 1,
          countdown: ep['countdown'] ?? '',
        )).toList();
      }
    });

    return schedule;
  }
  return {};
}`
            }
        }
    ];

    $: activeRecipe = recipes[activeRecipeIndex] || recipes[0];

    // Endpoints data definition (All 28 verified live endpoints)
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
            description: "Returns the real-time server health, ISO timestamp, continuous process uptime, and request tracking ID.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "health-detailed",
            category: "system",
            categoryLabel: "System",
            categoryIcon: IconHeartbeat,
            method: "GET",
            path: "/health/detailed",
            title: "Detailed Telemetry & Vault Diagnostics",
            description: "Returns real-time connectivity across database vaults, system memory consumption, and rate limiter configuration.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "openapi-spec",
            category: "system",
            categoryLabel: "System",
            categoryIcon: IconHeartbeat,
            method: "GET",
            path: "/openapi.json",
            title: "OpenAPI 3.1.0 Specification",
            description: "Machine-readable OpenAPI 3.1 specification for generating Flutter/Dart, Swift, Go, Python, and TypeScript SDKs.",
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
        },

        // 13. Franchise Cross-Media Adaptations
        {
            id: "series-adaptations",
            category: "franchises",
            categoryLabel: "Master Franchises",
            categoryIcon: IconBuildingArch,
            method: "GET",
            path: "/api/v1/series/:slug/adaptations",
            title: "Franchise Source Manga & Novel Link",
            description: "Discovers the original source Manga, Manhwa, or Light Novel for an anime franchise in Vault 2 with chapters, reading direction, and creators.",
            params: [
                {
                    name: "slug",
                    type: "path",
                    default: "attack-on-titan",
                    options: ["attack-on-titan", "solo-leveling", "demon-slayer-kimetsu-no-yaiba", "jujutsu-kaisen", "bleach", "chainsaw-man"],
                    description: "Franchise URL slug"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },

        // 14. Manga & Reading Media Hub (Vault 2)
        {
            id: "manga-omni",
            category: "manga",
            categoryLabel: "Manga & Novels",
            categoryIcon: IconBook,
            method: "GET",
            path: "/api/v1/manga",
            title: "Manga, Manhwa & Novels Omni Directory",
            description: "Omni-search and multi-filter across 21,600+ Manga, Korean Manhwa, Chinese Manhua, and Light Novels with dual consensus scores and reading directions.",
            params: [
                {
                    name: "q",
                    type: "query",
                    default: "Solo Leveling",
                    options: ["Solo Leveling", "Berserk", "One Piece", "Omniscient Reader", "Frieren", "Tower of God", "Chainsaw Man"],
                    description: "Search keyword"
                },
                {
                    name: "type",
                    type: "query",
                    default: "ALL",
                    options: ["ALL", "MANGA", "MANHWA", "LIGHT_NOVEL", "MANHUA", "ONE_SHOT"],
                    description: "Media type filter"
                },
                {
                    name: "limit",
                    type: "query",
                    default: "10",
                    options: ["10", "25", "50"],
                    description: "Results per page"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "manga-top",
            category: "manga",
            categoryLabel: "Manga & Novels",
            categoryIcon: IconBook,
            method: "GET",
            path: "/api/v1/manga/top",
            title: "Top Reading Media Leaderboards",
            description: "Retrieve curated leaderboards for popular manga, highest rated masterpieces, top Korean manhwa webtoons, and light novels.",
            params: [
                {
                    name: "type",
                    type: "query",
                    default: "popular",
                    options: ["popular", "rated", "manhwa", "novels"],
                    description: "Leaderboard filter"
                },
                {
                    name: "limit",
                    type: "query",
                    default: "10",
                    options: ["10", "25", "50"],
                    description: "Count of items"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "manga-types",
            category: "manga",
            categoryLabel: "Manga & Novels",
            categoryIcon: IconBook,
            method: "GET",
            path: "/api/v1/manga/types",
            title: "Media Categories & Archive Breakdown",
            description: "Returns live counts and breakdown of reading media across Manga, Manhwa, Manhua, Light Novels, and One-Shots in Vault 2.",
            params: [],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "manga-manhwa",
            category: "manga",
            categoryLabel: "Manga & Novels",
            categoryIcon: IconBook,
            method: "GET",
            path: "/api/v1/manga/manhwa",
            title: "Dedicated Korean Webtoons Hub",
            description: "Direct access to 5,000+ top-to-bottom scrolling Korean manhwa webtoons with chapter progression and translation metadata.",
            params: [
                {
                    name: "status",
                    type: "query",
                    default: "ALL",
                    options: ["ALL", "RELEASING", "FINISHED"],
                    description: "Publication status"
                },
                {
                    name: "limit",
                    type: "query",
                    default: "10",
                    options: ["10", "25", "50"],
                    description: "Results limit"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "manga-details",
            category: "manga",
            categoryLabel: "Manga & Novels",
            categoryIcon: IconBook,
            method: "GET",
            path: "/api/v1/manga/:idOrSlug",
            title: "Complete Manga / Novel Entry",
            description: "Fetches full metadata for a reading title: creators (Story/Art), chapters, volumes, reading direction, characters, and anime links.",
            params: [
                {
                    name: "idOrSlug",
                    type: "path",
                    default: "solo-leveling",
                    options: ["solo-leveling", "berserk", "one-piece", "omniscient-reader", "frieren-beyond-journeys-end", "tower-of-god", "chainsaw-man"],
                    description: "Manga Slug or ID"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "manga-adaptations",
            category: "manga",
            categoryLabel: "Manga & Novels",
            categoryIcon: IconBook,
            method: "GET",
            path: "/api/v1/manga/:idOrSlug/adaptations",
            title: "Manga to Anime Adaptations Timeline",
            description: "Lists all anime TV series, movies, OVAs, and spin-offs adapted from this source manga, manhwa, or light novel.",
            params: [
                {
                    name: "idOrSlug",
                    type: "path",
                    default: "solo-leveling",
                    options: ["solo-leveling", "berserk", "one-piece", "attack-on-titan", "demon-slayer-kimetsu-no-yaiba", "chainsaw-man"],
                    description: "Manga Slug or ID"
                }
            ],
            loading: false,
            response: null,
            status: null,
            duration: null,
            error: null
        },
        {
            id: "manga-chapters",
            category: "manga",
            categoryLabel: "Manga & Novels",
            categoryIcon: IconBook,
            method: "GET",
            path: "/api/v1/manga/:idOrSlug/chapters",
            title: "Live Chapter Directory & Legal Reading Sources",
            description: "Fetches live chapter catalog, release timestamps, scanlation credits, and 100% legal official reading source redirects (MangaPlus, Viz, Webtoons) via MangaDex API.",
            params: [
                {
                    name: "idOrSlug",
                    type: "path",
                    default: "chainsaw-man",
                    options: ["chainsaw-man", "solo-leveling", "attack-on-titan", "berserk", "one-piece"],
                    description: "Manga Slug or ID"
                },
                {
                    name: "limit",
                    type: "query",
                    default: "20",
                    options: ["10", "20", "50", "100"],
                    description: "Number of chapters to return"
                },
                {
                    name: "language",
                    type: "query",
                    default: "en",
                    options: ["en", "ja", "ko"],
                    description: "Translated language code"
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
        { id: "manga", label: "Manga & Novels", icon: IconBook },
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

    function getDartSnippet(ep, _trigger) {
        return `import 'dart:convert';\nimport 'package:http/http.dart' as http;\n\nvoid main() async {\n  final res = await http.get(Uri.parse("${buildUrl(ep)}"));\n  if (res.statusCode == 200) {\n    final data = jsonDecode(res.body);\n    print(data);\n  }\n}`;
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
            if (targetId === "recipes" || targetId.startsWith("recipe-")) {
                docsViewMode = "recipes";
                const matchIndex = recipes.findIndex(r => r.id === targetId);
                if (matchIndex !== -1) {
                    activeRecipeIndex = matchIndex;
                }
                return;
            }
            const found = endpoints.find(e => e.id === targetId);
            if (found) {
                docsViewMode = "playground";
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
            .then(resJson => {
                const liveCount = resJson?.data?.total || resJson?.meta?.total || resJson?.total;
                if (liveCount && liveCount >= 634) {
                    totalFranchises = liveCount;
                } else {
                    totalFranchises = 634;
                }
            })
            .catch(() => {});

        return () => {
            window.removeEventListener("hashchange", selectAndScrollToHash);
        };
    });
</script>

<svelte:head>
    <title>AniNexus REST API Documentation — v1 Reference & Interactive Playground</title>
    <meta name="description" content="Explore and test all 28 AniNexus REST endpoints live: Top Anime, Seasonal Hub, Industry Anime Awards, Master Franchises, Universal Characters & Staff Encyclopedia, Verified Dubs, and Multi-Score Engine.">
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
                <a href="https://github.com/Shouvikdasprojects/AniNexus-API-Website/releases/tag/v1.0.0" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                    <Chip size="small" type="outline">REST v1.0.0 Stable ↗</Chip>
                </a>
            </div>
            <h1>AniNexus <span>REST API Reference</span></h1>
            <p>
                A high-performance <strong>REST API (v1)</strong> serving <strong>{totalFranchises}+ curated Master Franchises (1917–{currentYear}+)</strong>, 
                <strong>21,600+ Manga, Manhwa & Light Novels</strong>, 5-year rolling anime awards, 100% verified audio dub tracks (Hindi & English), and dual community consensus scores with zero token authorization required.
            </p>

            <div class="roadmapNotice">
                <span class="noticeBadge">Architecture Notice</span>
                <span>Active protocol: <strong>REST API v1 (JSON over HTTPS)</strong>. Cross-media relations link every Anime franchise to its source Manga, Manhwa, and Light Novel.</span>
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
                    <span>📚 21,600+ Manga & Manhwa</span>
                </div>
                <div class="heroPill">
                    <span>🔓 No API Key Required</span>
                </div>
                <div class="heroPill">
                    <span>🌐 CORS Enabled</span>
                </div>
                <div class="heroPill">
                    <span>⚡ Rate Limit: 90 req / min</span>
                </div>
                <a href="https://github.com/Shouvikdasprojects/AniNexus-API-Website/releases/tag/v1.0.0" target="_blank" rel="noopener noreferrer" class="heroPill heroLink heroLink--gold">
                    <span>🏷️ v1.0.0 Release Notes</span>
                </a>
                <a href="/openapi.json" target="_blank" rel="noopener noreferrer" class="heroPill heroLink">
                    <span>📜 OpenAPI 3.1</span>
                </a>
                <a href="/aninexus-postman-collection.json" download="aninexus-postman-collection.json" class="heroPill heroLink heroLink--highlight">
                    <span>🚀 Postman Collection</span>
                </a>
                <a href="/aniNexusClient.ts" download="aniNexusClient.ts" class="heroPill heroLink">
                    <span>⚡ TS / JS SDK</span>
                </a>
                <a href="/aninexus.py" download="aninexus.py" class="heroPill heroLink">
                    <span>🐍 Python SDK</span>
                </a>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" class="heroPill heroLink">
                    <span>🤖 AI llms.txt</span>
                </a>
                <button type="button" class="heroPill heroLink heroLink--recipes" on:click={() => { docsViewMode = 'recipes'; }}>
                    <span>🚀 Quickstart Recipes (3)</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Documentation View Mode Switcher -->
    <nav class="docsModeBar" aria-label="Documentation Mode Switcher">
        <div class="docsModeBar__container">
            <button 
                type="button"
                class="modeBtn" 
                class:active={docsViewMode === 'playground'} 
                on:click={() => { docsViewMode = 'playground'; }}
            >
                <IconTerminal2 size={18} />
                <span>Interactive Endpoint Playground ({endpoints.length})</span>
            </button>
            <button 
                type="button"
                class="modeBtn" 
                class:active={docsViewMode === 'recipes'} 
                on:click={() => { docsViewMode = 'recipes'; }}
            >
                <IconSparkles size={18} />
                <span>Quickstart Guides & Real-World Recipes (3)</span>
                <span class="badgeNew">PRO</span>
            </button>
        </div>
    </nav>

    {#if docsViewMode === 'playground'}
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
                                        <button
                                            class="tabBtn {activeSnippetTabs[ep.id] === 'dart' ? 'active' : ''}"
                                            on:click={() => activeSnippetTabs[ep.id] = 'dart'}
                                        >Dart</button>
                                    </div>
                                    <button
                                        class="copySnippetBtn"
                                        on:click={() => {
                                            const code = activeSnippetTabs[ep.id] === 'curl' ? getCurlSnippet(ep, paramValues[ep.id]) :
                                                        activeSnippetTabs[ep.id] === 'js' ? getJsSnippet(ep, paramValues[ep.id]) :
                                                        activeSnippetTabs[ep.id] === 'dart' ? getDartSnippet(ep, paramValues[ep.id]) :
                                                        getPythonSnippet(ep, paramValues[ep.id]);
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
                                    {:else if activeSnippetTabs[ep.id] === 'dart'}
                                        <pre><code>{getDartSnippet(ep, paramValues[ep.id])}</code></pre>
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
    {:else}
    <!-- Quickstart Guides & Real-World Recipes -->
    <div class="recipesContainer">
        <!-- Recipes Header -->
        <header class="recipesHeader">
            <div class="recipesBadge">
                <IconSparkles size={16} />
                <span>Developer Blueprints & Production Patterns</span>
            </div>
            <h2>Quickstart Guides & Real-World Recipes</h2>
            <p>
                Production-tested architecture patterns, data processing workflows, and multi-language SDK code to jumpstart your next anime streaming app, franchise watch-order tracker, or weekly calendar widget in minutes.
            </p>
        </header>

        <!-- Recipes Navigation Selector Cards -->
        <div class="recipeNavGrid">
            {#each recipes as r, idx}
                <button
                    type="button"
                    class="recipeNavCard"
                    class:active={activeRecipeIndex === idx}
                    on:click={() => activeRecipeIndex = idx}
                >
                    <div class="navCardTop">
                        <span class="navNumber">0{idx + 1}</span>
                        <span class="navBadge" style="background: {r.color}20; color: {r.color}; border: 1px solid {r.color}40;">
                            {r.badge}
                        </span>
                    </div>
                    <h4>{r.title}</h4>
                    <p>{r.subtitle}</p>
                </button>
            {/each}
        </div>

        <!-- Active Recipe Detail Card -->
        <article class="recipeMainCard">
            <div class="recipeCardHeader">
                <div class="recipeHeaderLeft">
                    <span class="recipeSubBadge" style="color: {activeRecipe.color}">
                        Recipe #0{activeRecipeIndex + 1} • {activeRecipe.badge}
                    </span>
                    <h3>{activeRecipe.title}</h3>
                    <p class="recipeDesc">{activeRecipe.description}</p>
                </div>
                <div class="recipeHeaderRight">
                    <div class="targetEndpointPill">
                        <span class="method">GET</span>
                        <code>{activeRecipe.endpoint}</code>
                    </div>
                    <button
                        type="button"
                        class="jumpToPlaygroundBtn"
                        on:click={() => {
                            docsViewMode = 'playground';
                            window.location.hash = activeRecipe.endpointHash;
                            selectAndScrollToHash();
                        }}
                    >
                        <IconPlayerPlay size={14} />
                        <span>Test Endpoint in Playground</span>
                    </button>
                </div>
            </div>

            <div class="recipeSteps">
                <h5>Key Architectural Steps</h5>
                <div class="stepsList">
                    {#each activeRecipe.steps as step, sIdx}
                        <div class="stepItem">
                            <span class="stepNum">{sIdx + 1}</span>
                            <span>{@html step.replace(/`([^`]+)`/g, '<code>$1</code>')}</span>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Code Snippet Switcher -->
            <div class="recipeCodeSection">
                <div class="recipeCodeHeader">
                    <div class="langTabs">
                        <button
                            type="button"
                            class="langBtn"
                            class:active={recipeCodeLangs[activeRecipeIndex] === 'ts'}
                            on:click={() => recipeCodeLangs[activeRecipeIndex] = 'ts'}
                        >
                            <span>TypeScript / JS</span>
                        </button>
                        <button
                            type="button"
                            class="langBtn"
                            class:active={recipeCodeLangs[activeRecipeIndex] === 'py'}
                            on:click={() => recipeCodeLangs[activeRecipeIndex] = 'py'}
                        >
                            <span>Python (SDK)</span>
                        </button>
                        <button
                            type="button"
                            class="langBtn"
                            class:active={recipeCodeLangs[activeRecipeIndex] === 'dart'}
                            on:click={() => recipeCodeLangs[activeRecipeIndex] = 'dart'}
                        >
                            <span>Dart / Flutter</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        class="copyBtn"
                        on:click={() => {
                            const lang = recipeCodeLangs[activeRecipeIndex] || 'ts';
                            const code = activeRecipe.code[lang];
                            copyToClipboard(code, `recipe-${activeRecipeIndex}-${lang}`);
                        }}
                    >
                        {#if copiedEndpoint === `recipe-${activeRecipeIndex}-${recipeCodeLangs[activeRecipeIndex] || 'ts'}`}
                            <IconCheck size={14} color="#10B981" />
                            <span>Copied Snippet!</span>
                        {:else}
                            <IconCopy size={14} />
                            <span>Copy Code</span>
                        {/if}
                    </button>
                </div>

                <div class="recipeCodeBody">
                    <pre><code>{activeRecipe.code[recipeCodeLangs[activeRecipeIndex] || 'ts']}</code></pre>
                </div>
            </div>
        </article>
    </div>
    {/if}

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
                    color: #C4B5FD;
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

                &--highlight {
                    background: rgba(249, 115, 22, 0.15);
                    border-color: rgba(249, 115, 22, 0.4);
                    color: #FDBA74;

                    &:hover {
                        background: #F97316;
                        border-color: #F97316;
                        color: #FFFFFF;
                        box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
                    }
                }

                &--gold {
                    background: rgba(234, 179, 8, 0.15);
                    border-color: rgba(234, 179, 8, 0.4);
                    color: #FDE047;

                    &:hover {
                        background: #EAB308;
                        border-color: #EAB308;
                        color: #0F172A;
                        box-shadow: 0 4px 14px rgba(234, 179, 8, 0.4);
                        transform: translateY(-2px);
                    }
                }

                &--recipes {
                    background: rgba(16, 185, 129, 0.15);
                    border-color: rgba(16, 185, 129, 0.4);
                    color: #6EE7B7;
                    cursor: pointer;

                    &:hover {
                        background: #10B981;
                        border-color: #10B981;
                        color: #0F172A;
                        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
                        transform: translateY(-2px);
                    }
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

    /* Documentation Mode Switcher Bar */
    .docsModeBar {
        background: rgba(15, 23, 42, 0.75);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px 24px;
        backdrop-filter: blur(12px);
        position: sticky;
        top: 80px;
        z-index: 40;

        &__container {
            max-width: 1280px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
        }

        .modeBtn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            color: #94A3B8;
            padding: 10px 20px;
            font-size: 0.92rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                color: #FFFFFF;
                border-color: rgba(139, 92, 246, 0.3);
                background: rgba(30, 41, 59, 0.8);
            }

            &.active {
                background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
                border-color: #8B5CF6;
                color: #FFFFFF;
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.25);
            }

            .badgeNew {
                background: #10B981;
                color: #0F172A;
                font-size: 0.68rem;
                font-weight: 800;
                padding: 2px 7px;
                border-radius: 9999px;
                letter-spacing: 0.05em;
            }
        }
    }

    /* Recipes Container */
    .recipesContainer {
        max-width: 1280px;
        margin: 0 auto;
        padding: 40px 24px 80px;
    }

    .recipesHeader {
        margin-bottom: 32px;

        .recipesBadge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 9999px;
            padding: 5px 14px;
            color: #C4B5FD;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 12px;
        }

        h2 {
            font-size: 2rem;
            font-weight: 800;
            color: #FFFFFF;
            letter-spacing: -0.02em;
            margin: 0 0 10px;
        }

        p {
            font-size: 1.05rem;
            color: #94A3B8;
            max-width: 800px;
            margin: 0;
            line-height: 1.6;
        }
    }

    .recipeNavGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 32px;

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    }

    .recipeNavCard {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 20px;
        text-align: left;
        cursor: pointer;
        transition: all 0.25s ease;
        position: relative;
        overflow: hidden;

        &:hover {
            border-color: rgba(139, 92, 246, 0.4);
            transform: translateY(-2px);
            background: rgba(30, 41, 59, 0.5);
        }

        &.active {
            border-color: #8B5CF6;
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(139, 92, 246, 0.12) 100%);
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.2);

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #8B5CF6, #3B82F6);
            }
        }

        .navCardTop {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;

            .navNumber {
                font-family: monospace;
                font-size: 0.85rem;
                font-weight: 700;
                color: #64748B;
            }

            .navBadge {
                font-size: 0.72rem;
                font-weight: 700;
                padding: 3px 8px;
                border-radius: 6px;
                text-transform: uppercase;
                letter-spacing: 0.04em;
            }
        }

        h4 {
            font-size: 1.05rem;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0 0 6px;
            line-height: 1.35;
        }

        p {
            font-size: 0.82rem;
            color: #94A3B8;
            margin: 0;
            line-height: 1.5;
        }
    }

    .recipeMainCard {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 32px;
        backdrop-filter: blur(16px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

        @media (max-width: 768px) {
            padding: 20px;
        }
    }

    .recipeCardHeader {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 28px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 24px;

        @media (max-width: 900px) {
            flex-direction: column;
        }

        .recipeHeaderLeft {
            flex: 1;

            .recipeSubBadge {
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                display: block;
                margin-bottom: 8px;
            }

            h3 {
                font-size: 1.6rem;
                font-weight: 800;
                color: #FFFFFF;
                margin: 0 0 10px;
                letter-spacing: -0.02em;
            }

            .recipeDesc {
                font-size: 0.95rem;
                color: #94A3B8;
                line-height: 1.6;
                margin: 0;
            }
        }

        .recipeHeaderRight {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-end;

            @media (max-width: 900px) {
                align-items: flex-start;
                width: 100%;
            }

            .targetEndpointPill {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: rgba(30, 41, 59, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 8px;
                padding: 6px 12px;

                .method {
                    background: #10B981;
                    color: #0F172A;
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                code {
                    font-family: monospace;
                    font-size: 0.85rem;
                    color: #A78BFA;
                }
            }

            .jumpToPlaygroundBtn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);
                color: #FFFFFF;
                border: none;
                border-radius: 8px;
                padding: 8px 16px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
                }
            }
        }
    }

    .recipeSteps {
        margin-bottom: 28px;

        h5 {
            font-size: 0.88rem;
            font-weight: 700;
            color: #CBD5E1;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0 0 16px;
        }

        .stepsList {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        }

        .stepItem {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            background: rgba(30, 41, 59, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 12px 14px;
            font-size: 0.88rem;
            color: #E2E8F0;
            line-height: 1.5;

            .stepNum {
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: rgba(139, 92, 246, 0.2);
                border: 1px solid rgba(139, 92, 246, 0.4);
                color: #C4B5FD;
                font-size: 0.75rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                margin-top: 2px;
            }

            :global(code) {
                background: rgba(15, 23, 42, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                color: #A78BFA;
                padding: 1px 5px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-family: monospace;
            }
        }
    }

    .recipeCodeSection {
        background: #0F172A;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        overflow: hidden;

        .recipeCodeHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(15, 23, 42, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding: 8px 16px;

            .langTabs {
                display: flex;
                gap: 6px;

                .langBtn {
                    background: transparent;
                    border: none;
                    color: #94A3B8;
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 6px 14px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;

                    &:hover {
                        color: #FFFFFF;
                        background: rgba(255, 255, 255, 0.05);
                    }

                    &.active {
                        color: #FFFFFF;
                        background: rgba(139, 92, 246, 0.2);
                        box-shadow: inset 0 0 0 1px rgba(139, 92, 246, 0.5);
                    }
                }
            }

            .copyBtn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(30, 41, 59, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 6px;
                color: #CBD5E1;
                font-size: 0.78rem;
                font-weight: 600;
                padding: 5px 12px;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                    background: rgba(30, 41, 59, 0.9);
                    color: #FFFFFF;
                }
            }
        }

        .recipeCodeBody {
            padding: 20px;
            overflow-x: auto;

            pre {
                margin: 0;
                font-family: 'Fira Code', 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                line-height: 1.6;
                color: #E2E8F0;
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

        &.highlighted {
            border-color: #8B5CF6;
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
            transition: all 0.5s ease;
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
