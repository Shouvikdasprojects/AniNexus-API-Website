<script>
import Nav from "../../lib/components/Nav.svelte";
import Footer from "../../lib/components/Footer.svelte";
import entries from "../../data/showcase.js";
import ShowcaseCard from "../../lib/components/ShowcaseCard.svelte";
import Button from "../../lib/components/Button.svelte";
import Divider from "../../lib/components/Divider.svelte";
import {IconCirclePlus} from "@tabler/icons-svelte";
</script>

<svelte:head>
    <title>Showcase — Apps Powered by AniNexus API</title>
    <meta name="description" content="Discover modern applications, community streaming portals, and platforms powered by AniNexus API, including AnimeNation India.">
</svelte:head>

<Nav />

<header class="showcaseHero">
    <div class="showcaseHero__content">
        <h1>Apps Powered by <span>AniNexus API</span></h1>
        <p>Explore community projects, streaming platforms, and anime trackers utilizing the AniNexus Master Franchise Vault.</p>
    </div>
</header>

<section class="showcaseWrapper">
    <div class="showcase">
        {#each entries as entry}
            <ShowcaseCard
                title={entry.title}
                url={entry.url}
                imageUrl={entry.imageUrl}
                summary={entry.summary}
            />
        {/each}
    </div>
</section>

<Footer />

<style lang="scss">
    .showcaseHero {
        padding: 120px 24px 40px;
        background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 70%),
                    linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, #0B0F19 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        text-align: center;

        &__content {
            max-width: 800px;
            margin: 0 auto;

            h1 {
                font-size: 2.2rem;
                font-weight: 800;
                color: #FFFFFF;
                margin: 0 0 12px;

                span {
                    color: #8B5CF6;
                }
            }

            p {
                color: #94A3B8;
                font-size: 1.05rem;
                margin: 0;
            }
        }
    }

    .showcaseWrapper {
        display: flex;
        justify-content: center;
        padding: 60px 24px 100px;
        background: #0B0F19;
    }

    .showcase {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
        width: 100%;
        max-width: 1280px;
    }
</style>
