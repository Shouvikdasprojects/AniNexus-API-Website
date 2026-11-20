<script>
    import Chip from "./Chip.svelte";
    import {IconStar, IconPlayerPlay, IconMicrophone} from "@tabler/icons-svelte";
    import Divider from "./Divider.svelte";
    import string from "../helpers/string.js";
    import {onMount} from "svelte";
    import tilt from "./tilt.js";

    export let slug = "";
    export let imageUrl = "";
    export let title = "";
    export let romaji = "";
    export let format = "TV";
    export let score = 0;
    export let sourceScoreA = null;
    export let sourceScoreB = null;
    export let season = "";
    export let year = 0;
    export let genres = [];
    export let status = "FINISHED";
    export let episodes = 0;
    export let parts = 0;
    export let dubs = [];
    export let skeleton = false;
    export let cardExit = false;

    $: statusClass = 'animeStatus-finished';
    $: isCardTransitioning = cardExit ? 'cardAnime--exit' : '';

    $: {
        const norm = (status || "").toLowerCase();
        if (norm.includes("finish") || norm.includes("completed")) {
            statusClass = "animeStatus-finished";
        } else if (norm.includes("airing") || norm.includes("releasing")) {
            statusClass = "animeStatus-airing";
        } else {
            statusClass = "animeStatus-upcoming";
        }
    }

    $: rawScore = score || sourceScoreA || (sourceScoreB ? sourceScoreB / 10 : null);
    $: primaryScore = typeof rawScore === 'number'
        ? (rawScore > 10 ? (rawScore / 10).toFixed(2) : rawScore.toFixed(2))
        : rawScore;
</script>

{#if skeleton}
    <div class="cardAnime cardAnime--skeleton {isCardTransitioning}"></div>
{:else}
    <a
        href="https://ani-nexus.onrender.com/api/v1/series/{slug}"
        class="cardAnime {isCardTransitioning}"
        target="_blank"
        rel="noopener noreferrer"
        use:tilt={{scale:1.02, reverse:true}}
        title="View {title} on AniNexus API"
    >
        <div class="cardAnime__cover">
            <img src="{imageUrl}" alt="{title}" loading="lazy" />
            <div class="cardAnime__overlay">
                <span class="cardAnime__format">{format || 'TV'}</span>
                {#if parts > 1}
                    <span class="cardAnime__parts">{parts} Parts</span>
                {/if}
            </div>
        </div>

        <div class="cardAnime__body">
            <div class="cardAnime__header">
                <Chip size="small" type="{statusClass}">
                    {string.capitalize(status || 'FINISHED')}
                </Chip>
                <div class="cardAnime__meta">
                    {#if season}
                        <small>{string.capitalize(season)} {year || ''}</small>
                    {:else if year}
                        <small>{year}</small>
                    {/if}
                    {#if episodes}
                        <Divider type="circle" />
                        <small>{episodes} eps</small>
                    {/if}
                </div>
            </div>

            <div class="cardAnime__titles">
                <p class="cardAnime__title" title="{title}">{title}</p>
                {#if romaji && romaji !== title}
                    <p class="cardAnime__romaji" title="{romaji}">{romaji}</p>
                {/if}
            </div>

            <div class="cardAnime__stats">
                {#if primaryScore}
                    <div class="cardAnime__score" title="Dual Community Weighted Score">
                        <IconStar stroke={1.5} size={15} color="#FBBF24" />
                        <span class="scoreVal">{typeof primaryScore === 'number' ? primaryScore.toFixed(2) : primaryScore}</span>
                    </div>
                {/if}
                {#if dubs && dubs.length > 0}
                    <div class="cardAnime__dubs" title="Verified Audio Dubs: {dubs.join(', ')}">
                        <IconMicrophone stroke={1.5} size={14} color="#8B5CF6" />
                        <span class="dubCount">{dubs.length} Dubs</span>
                    </div>
                {/if}
            </div>

            <div class="cardAnime__genres">
                {#if dubs && dubs.includes('Hindi')}
                    <span class="hindiBadge">🇮🇳 Hindi</span>
                {/if}
                {#if genres && genres.length > 0}
                    {#each genres.slice(0, 2) as genre}
                        <Chip size="small" length="small" type="flat">
                            {typeof genre === 'string' ? genre : (genre.name || '')}
                        </Chip>
                    {/each}
                {/if}
            </div>
        </div>
    </a>
{/if}

<style lang="scss">
    .cardAnime {
      position: relative;
      display: inline-flex;
      padding: 10px;
      align-items: flex-start;
      gap: 14px;
      background: linear-gradient(#0F172A, #0F172A) padding-box,
                  linear-gradient(135deg, rgba(139, 92, 246, 0.45), rgba(59, 130, 246, 0.25)) border-box;
      border: 1px solid transparent;
      border-radius: 14px;
      user-select: none;
      -webkit-user-drag: none;
      transition: all 0.25s ease;
      overflow: hidden;
      height: 210px;
      min-width: 310px;
      max-width: 360px;
      text-decoration: none;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.3);
        border-color: rgba(139, 92, 246, 0.6);
      }

      &--skeleton {
        border-radius: 14px;
        background: linear-gradient(108deg, #1E293B 2%, rgba(30, 41, 59, 0.2) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        height: 210px;
        width: 320px;
        animation: pulseSkeleton 1.6s infinite ease-in-out;
      }

      &--exit {
        filter: blur(8px) grayscale(1);
        transform: scale(0.95);
        opacity: 0;
      }

      &__cover {
        height: 190px;
        width: 125px;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;
        border-radius: 10px;
        background: #1E293B;

        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          border-radius: 10px;
          transition: transform 0.3s ease;
        }

        &:hover img {
          transform: scale(1.05);
        }
      }

      &__overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px 8px 6px;
        background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 4px;
      }

      &__format {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #F8FAFC;
        background: rgba(139, 92, 246, 0.8);
        padding: 2px 6px;
        border-radius: 4px;
      }

      &__parts {
        font-size: 0.65rem;
        font-weight: 600;
        color: #E2E8F0;
        background: rgba(0,0,0,0.6);
        padding: 2px 5px;
        border-radius: 4px;
      }

      &__body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        flex: 1;
        min-width: 0;
        padding: 2px 0;
      }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
      }

      &__meta {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #94A3B8;
        font-size: 0.75rem;
      }

      &__titles {
        margin: 6px 0;
        min-width: 0;
      }

      &__title {
        color: #FFFFFF;
        font-size: 0.92rem;
        font-weight: 600;
        line-height: 1.25;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &__romaji {
        color: #94A3B8;
        font-size: 0.72rem;
        line-height: 1.2;
        margin-top: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &__stats {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 4px 0;
      }

      &__score {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        font-weight: 700;
        color: #FBBF24;
      }

      &__dubs {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.74rem;
        font-weight: 600;
        color: #A78BFA;
      }

      &__genres {
        display: flex;
        align-items: center;
        gap: 5px;
        overflow: hidden;
        flex-wrap: nowrap;
      }

      .hindiBadge {
        font-size: 0.65rem;
        font-weight: 700;
        color: #FFedd5;
        background: rgba(249, 115, 22, 0.2);
        border: 1px solid rgba(249, 115, 22, 0.5);
        border-radius: 4px;
        padding: 2px 6px;
        white-space: nowrap;
      }
    }

    @keyframes pulseSkeleton {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
</style>
