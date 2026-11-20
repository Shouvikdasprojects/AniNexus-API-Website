<script>
import Nav from "../../lib/components/Nav.svelte";
import Footer from "../../lib/components/Footer.svelte";
import entries from "../../data/showcase.js";
import ShowcaseCard from "../../lib/components/ShowcaseCard.svelte";
import Button from "../../lib/components/Button.svelte";
import Divider from "../../lib/components/Divider.svelte";
import {IconCirclePlus, IconBrandGithub} from "@tabler/icons-svelte";
</script>

<svelte:head>
    <title>Showcase — Apps Powered by AniNexus API</title>
    <meta name="description" content="Discover modern applications, community streaming portals, and platforms powered by AniNexus API.">
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

<section class="showcaseCtaSection">
    <div class="showcaseCtaCard">
        <div class="showcaseCtaCard__icon">
            <IconBrandGithub size={36} stroke={1.5} color="#A78BFA" />
        </div>
        <div class="showcaseCtaCard__content">
            <h3>Add Your Project to the Showcase</h3>
            <p>Built an anime application, streaming UI, Discord bot, or watchlist tracker using AniNexus API? Submit your project via GitHub PR to be featured live on the official website.</p>
        </div>
        <Button url="https://github.com/Shouvikdasprojects/AniNexus-API-Website/edit/master/src/data/showcase.js" urlTarget="_blank" type="primary">
            <IconCirclePlus size={20} stroke={1.5} />
            Add your project via GitHub PR
        </Button>
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
        padding: 60px 24px 60px;
        background: #0B0F19;
    }

    .showcase {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
        width: 100%;
        max-width: 1280px;
    }

    .showcaseCtaSection {
        display: flex;
        justify-content: center;
        padding: 0 24px 100px;
        background: #0B0F19;
    }

    .showcaseCtaCard {
        width: 100%;
        max-width: 1280px;
        background: #0F172A;
        border: 1px solid rgba(139, 92, 246, 0.3);
        border-radius: 16px;
        padding: 36px 40px;
        display: flex;
        align-items: center;
        gap: 28px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

        &__icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        &__content {
            flex: 1;

            h3 {
                font-size: 1.3rem;
                font-weight: 700;
                color: #FFFFFF;
                margin: 0 0 6px;
            }

            p {
                color: #94A3B8;
                font-size: 0.95rem;
                line-height: 1.5;
                margin: 0;
            }
        }
    }

    @media screen and (max-width: 768px) {
        .showcaseCtaCard {
            flex-direction: column;
            text-align: center;
            padding: 28px 20px;
            gap: 20px;

            &__content {
                margin-bottom: 8px;
            }
        }
    }
</style>
