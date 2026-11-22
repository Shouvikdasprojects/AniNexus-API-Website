<script>
import Typewriter from "svelte-typewriter";
import Chip from "./Chip.svelte";
import AnimeCard from "./AnimeCard.svelte";
import {onMount} from "svelte";
import ui from "../helpers/ui.js";
import {fly} from "svelte/transition";

let requests = [
    "https://ani-nexus.onrender.com/api/v1/top?type=trending",
    "https://ani-nexus.onrender.com/api/v1/series/attack-on-titan/timeline",
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
let cardsContainer;

function scrollCardsDown() {
    if (cardsContainer) {
        cardsContainer.scrollBy({ top: 226, behavior: 'smooth' });
    }
}

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
                    score: firstPart.scores?.combinedAverage || null,
                    sourceScoreA: firstPart.scores?.sourceA?.score || firstPart.scores?.mal?.score || null,
                    sourceScoreB: firstPart.scores?.sourceB?.score || firstPart.scores?.['ani' + 'list']?.score || null,
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
        } else if (json.data && json.data.timeline) {
            entries = json.data.timeline.slice(0, 6).map((part, idx) => {
                const dubsRaw = part.languages?.audioDubs;
                let dubsList = ["Japanese", "English"];
                if (Array.isArray(dubsRaw)) {
                    dubsList = dubsRaw;
                } else if (typeof dubsRaw === 'string' && dubsRaw.trim()) {
                    dubsList = dubsRaw.trim().split(/\s+/).filter(Boolean);
                }
                return {
                    slug: json.data.slug || "attack-on-titan",
                    title: part.partName || "Part " + (part.order || idx + 1),
                    romaji: `Step 0${idx + 1} • ${part.isCanon ? '⭐ Canon' : 'Side Story'} • ${part.watchPriority || 'Essential'}`,
                    imageUrl: part.images?.poster || json.data.images?.poster || "https://placehold.co/300x450/1e293b/white?text=Part+" + (idx + 1),
                    score: part.scores?.combinedAverage || 8.6,
                    sourceScoreA: null,
                    sourceScoreB: null,
                    season: part.watchPriority || "Watch Order",
                    year: part.year || 2013,
                    format: part.format || "TV",
                    status: part.status || "FINISHED",
                    episodes: part.episodeCount || 1,
                    parts: json.data.timeline.length,
                    dubs: dubsList,
                    genres: [{ name: `Order #${part.order || idx + 1}` }, { name: part.isCanon ? 'Canon' : 'OVA' }]
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

<div class="cardsWrapper">
    <div class="cards" bind:this={cardsContainer}>
        {#if !showCards}
            {#each {length: 4} as _}
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
                    sourceScoreA={entry.sourceScoreA}
                    sourceScoreB={entry.sourceScoreB}
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
    {#if entries && entries.length > 2}
        <button class="cardsScrollHint" on:click={scrollCardsDown} aria-label="Scroll down to see more anime items">
            <span>Scroll inside to explore all {entries.length} items</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
        </button>
    {/if}
</div>

<style lang="scss">
    .request {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(139, 92, 246, 0.3);
        padding: 8px 14px;
        border-radius: 12px;
        margin-bottom: 16px;
        backdrop-filter: blur(16px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        max-width: 100%;
        overflow: hidden;

        code {
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: clamp(0.72rem, 1.1vw, 0.86rem);
            color: #E2E8F0;
            white-space: nowrap;
        }

        a {
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
        flex-shrink: 0;
    }

    .liveDot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 6px #10B981;
    }

    .cardsWrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
    }

    .cards {
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 480px;
        max-height: 480px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding-right: 6px;
        padding-bottom: 6px;
        scroll-behavior: smooth;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        scrollbar-gutter: stable;

        /* Custom sleek scrollbar */
        scrollbar-width: thin;
        scrollbar-color: rgba(139, 92, 246, 0.5) rgba(15, 23, 42, 0.4);

        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 999px;
        }
        &::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.5);
            border-radius: 999px;
            transition: background 0.2s ease;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.9);
        }
    }

    .cardsScrollHint {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 0.76rem;
        font-weight: 600;
        color: #94A3B8;
        padding: 8px 0 2px;
        opacity: 0.85;
        animation: hintBounce 2s infinite ease-in-out;
        user-select: none;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: opacity 0.2s ease, color 0.2s ease;

        &:hover {
            opacity: 1;
            color: #C4B5FD;
        }

        svg {
            color: #A78BFA;
        }
    }

    @keyframes hintBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(3px); }
    }
</style>
