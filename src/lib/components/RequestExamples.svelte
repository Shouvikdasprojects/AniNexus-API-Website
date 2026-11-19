<script>
import Typewriter from "svelte-typewriter";
import Chip from "./Chip.svelte";
import AnimeCard from "./AnimeCard.svelte";
import {onMount} from "svelte";
import ui from "../helpers/ui.js";
import {fly} from "svelte/transition";

let requests = [
    "https://ani-nexus.onrender.com/api/v1/top?type=trending",
    "https://ani-nexus.onrender.com/api/v1/seasons/now",
    "https://ani-nexus.onrender.com/api/v1/seasons/upcoming",
    "https://ani-nexus.onrender.com/api/v1/top?type=popular",
    "https://ani-nexus.onrender.com/api/v1/top?type=rated",
    "https://ani-nexus.onrender.com/api/v1/top?type=movies",
    "https://ani-nexus.onrender.com/api/v1/awards/latest"
];

$: requestUrl = requests[0];
$: requestIndex = 0;
$: requestInterval = null;
$: intervalLock = false;
$: showCards = false;
$: isCardTransitioning = false;
$: requestDuration = 0;
$: showDuration = false;

let entries = [];

onMount(() => {
    // Initial fetch on mount
    fetchData();
});

async function fetchData() {
    try {
        let startTime = performance.now();
        const res = await fetch(requestUrl);
        const json = await res.json();
        requestDuration = Math.ceil(performance.now() - startTime);
        showDuration = true;

        if (json.data && json.data.franchises) {
            entries = json.data.franchises.slice(0, 6).map(f => {
                const firstPart = (f.timeline && f.timeline.length > 0) ? f.timeline[0] : {};
                const dubsRaw = firstPart.languages?.audioDubs;
                let dubsList = [];
                if (Array.isArray(dubsRaw)) {
                    dubsList = dubsRaw;
                } else if (typeof dubsRaw === 'string') {
                    dubsList = dubsRaw.split(' ').filter(Boolean);
                }

                return {
                    slug: f.slug || "",
                    title: f.titles?.primary || f.titles?.english || f.titles?.romaji || "Anime",
                    romaji: f.titles?.romaji || "",
                    imageUrl: f.images?.poster || "https://placehold.co/300x450/1e293b/white?text=AniNexus",
                    score: firstPart.scores?.combinedAverage || firstPart.scores?.mal?.score || null,
                    malScore: firstPart.scores?.mal?.score || null,
                    anilistScore: firstPart.scores?.anilist?.score || null,
                    season: firstPart.season || json.data.season || "",
                    year: firstPart.year || json.data.year || 2024,
                    format: firstPart.format || "TV",
                    status: firstPart.status || "FINISHED",
                    episodes: f.totalEpisodes || firstPart.episodes || 0,
                    parts: f.totalParts || (f.timeline ? f.timeline.length : 1),
                    dubs: dubsList,
                    genres: f.classification?.genres || []
                };
            });
        } else if (json.data && json.data.categories) {
            entries = json.data.categories.slice(0, 6).map(cat => ({
                slug: cat.winner?.franchiseSlug || "anime-awards",
                title: cat.winner?.title?.english || cat.winner?.title?.romaji || cat.name,
                romaji: cat.name + " • Award Winner",
                imageUrl: cat.winner?.imageUrl || "https://placehold.co/300x450/1e293b/white?text=Award",
                score: 9.1,
                year: json.data.year || 2026,
                format: "AWARDS",
                status: "WINNER",
                episodes: 0,
                parts: 1,
                dubs: ["English", "Japanese", "Hindi"],
                genres: [{ name: cat.name }]
            }));
        }

        isCardTransitioning = true;
        await ui.sleep(80);
        showCards = true;
        await ui.sleep(80);
        isCardTransitioning = false;
    } catch (err) {
        console.error("AniNexus request failed:", err);
    }
}

async function apiCall() {
    if (intervalLock) return;

    isCardTransitioning = true;
    await ui.sleep(80);
    showCards = false;
    await ui.sleep(80);
    isCardTransitioning = false;

    await fetchData();

    intervalLock = true;
    requestInterval = setInterval(() => {
        showDuration = false;
        updateRequestUrl();
        intervalLock = false;
        clearInterval(requestInterval);
    }, 9000);
}

function updateRequestUrl() {
    requestIndex++;
    if (requestIndex >= requests.length) {
        requestIndex = 0;
    }
    requestUrl = requests[requestIndex];
}
</script>

<div class="request">
    <Chip type="request" size="small">GET</Chip>
    <Typewriter
        mode="loopOnce"
        keepCursorOnFinish={true}
        interval={18}
        unwriteInterval={5}
        on:done={apiCall}
    >
        <a href={requestUrl} target="_blank" rel="noopener noreferrer"><code>{requestUrl}</code></a>
    </Typewriter>
    {#if showDuration && requestDuration > 0}
        <span transition:fly={{delay:0, duration:150, x:-20}} class="duration">
            <span class="liveDot"></span>
            {requestDuration}ms
        </span>
    {/if}
</div>

<div class="cards">
    {#if !showCards}
        {#each {length: 6} as _}
            <AnimeCard skeleton cardExit={isCardTransitioning} />
        {/each}
    {:else}
        {#each entries as entry}
            <AnimeCard
                cardExit={isCardTransitioning}
                slug={entry.slug}
                title={entry.title}
                romaji={entry.romaji}
                imageUrl={entry.imageUrl}
                score={entry.score}
                malScore={entry.malScore}
                anilistScore={entry.anilistScore}
                season={entry.season}
                year={entry.year}
                format={entry.format}
                status={entry.status}
                episodes={entry.episodes}
                parts={entry.parts}
                dubs={entry.dubs}
                genres={entry.genres}
            />
        {/each}
    {/if}
</div>

<style lang="scss">
    .request {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(139, 92, 246, 0.3);
        padding: 10px 16px;
        border-radius: 12px;
        margin-bottom: 20px;
        backdrop-filter: blur(16px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);

        code {
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 0.88rem;
            color: #E2E8F0;
        }

        a {
            text-decoration: none;
            &:hover code {
                color: #A78BFA;
            }
        }
    }

    .duration {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: monospace;
        font-size: 0.78rem;
        font-weight: 700;
        color: #10B981;
        background: rgba(16, 185, 129, 0.12);
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 3px 8px;
        border-radius: 6px;
    }

    .liveDot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 6px #10B981;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        perspective: 1000px;
    }

    @media (max-width: 768px) {
        .cards {
            grid-template-columns: 1fr;
        }
    }
</style>
