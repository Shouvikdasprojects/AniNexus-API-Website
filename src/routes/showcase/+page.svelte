<script>
import Nav from "../../lib/components/Nav.svelte";
import Footer from "../../lib/components/Footer.svelte";
import entries from "../../data/showcase.js";
import ShowcaseCard from "../../lib/components/ShowcaseCard.svelte";
import Button from "../../lib/components/Button.svelte";
import Divider from "../../lib/components/Divider.svelte";
import {IconCirclePlus, IconBrandGithub, IconCode, IconArrowDownLeft, IconDeviceDesktop} from "@tabler/icons-svelte";
</script>

<svelte:head>
    <title>Showcase — Apps Powered by AniNexus API</title>
    <meta name="description" content="Discover modern applications, community streaming portals, and platforms powered by AniNexus API.">
</svelte:head>

<Nav />

<header class="showcaseHero">
    <div class="showcaseHero__content">
        <div class="heroBadge">
            <IconDeviceDesktop size={16} stroke={1.5} />
            <span>Community Ecosystem</span>
        </div>
        <h1>Apps Powered by <span>AniNexus API</span></h1>
        <p>Explore verified community applications, streaming portals, and anime platforms utilizing the AniNexus Master Franchise Vault.</p>
    </div>
</header>

<section class="showcaseWrapper">
    {#if entries && entries.length > 0}
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
    {:else}
        <div class="showcaseEmpty">
            <div class="emptyIcon">
                <IconCode size={48} stroke={1.5} />
            </div>
            <h2>Be the First to Feature Your Project!</h2>
            <p>Did you build an anime website, streaming portal, Discord bot, or mobile app using AniNexus API? We keep our showcase 100% genuine and verified. Submit your project via GitHub PR to be featured front and center on the official website.</p>
            <div class="emptyActions">
                <Button url="https://github.com/Shouvikdasprojects/AniNexus-API-Website/edit/master/src/data/showcase.js" urlTarget="_blank" type="primary" size="default">
                    <IconCirclePlus size={18} stroke={1.5} />
                    Submit Your Project via GitHub PR
                </Button>
                <Button url="/docs" type="secondary-outline" size="default">
                    <IconArrowDownLeft class="external-link" size={18} stroke={1.5} />
                    Explore API Playground
                </Button>
            </div>
        </div>
    {/if}
</section>

<section class="showcaseCtaSection">
    <div class="showcaseCtaCard">
        <div class="showcaseCtaCard__icon">
            <IconBrandGithub size={36} stroke={1.5} color="#A78BFA" />
        </div>
        <div class="showcaseCtaCard__content">
            <h3>Add Your Project to the Official Showcase</h3>
            <p>Anyone who builds a project with AniNexus API can get featured here for free! Simply edit <code>showcase.js</code> in GitHub and create a Pull Request.</p>
            
            <div class="stepsGrid">
                <div class="stepItem">
                    <span class="stepNum">1</span>
                    <div>
                        <strong>Click Submit</strong>
                        <p>Opens <code>showcase.js</code> directly in GitHub web editor.</p>
                    </div>
                </div>
                <div class="stepItem">
                    <span class="stepNum">2</span>
                    <div>
                        <strong>Add Your App Details</strong>
                        <p>Paste your app name, description, screenshot & live link.</p>
                    </div>
                </div>
                <div class="stepItem">
                    <span class="stepNum">3</span>
                    <div>
                        <strong>Create PR</strong>
                        <p>Click "Propose changes". Once merged, it goes live!</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="showcaseCtaCard__action">
            <Button url="https://github.com/Shouvikdasprojects/AniNexus-API-Website/edit/master/src/data/showcase.js" urlTarget="_blank" type="primary" size="default">
                <IconCirclePlus size={18} stroke={1.5} />
                Add your project via GitHub PR
            </Button>
        </div>
    </div>
</section>

<Footer />

<style lang="scss">
    .showcaseHero {
        padding: 130px 24px 50px;
        background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.2) 0%, transparent 70%),
                    linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, #0B0F19 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        text-align: center;

        &__content {
            max-width: 800px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;

            .heroBadge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: rgba(139, 92, 246, 0.12);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 999px;
                padding: 6px 14px;
                font-size: 0.82rem;
                font-weight: 600;
                color: #A78BFA;
                margin-bottom: 16px;
            }

            h1 {
                font-size: 2.4rem;
                font-weight: 800;
                color: #FFFFFF;
                margin: 0 0 12px;
                letter-spacing: -0.02em;

                span {
                    color: #8B5CF6;
                }
            }

            p {
                color: #94A3B8;
                font-size: 1.05rem;
                line-height: 1.6;
                margin: 0;
            }
        }
    }

    .showcaseWrapper {
        display: flex;
        justify-content: center;
        padding: 60px 24px 70px;
        background: #0B0F19;
    }

    .showcase {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 24px;
        width: 100%;
        max-width: 1280px;
    }

    .showcaseEmpty {
        width: 100%;
        max-width: 800px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px dashed rgba(139, 92, 246, 0.35);
        border-radius: 20px;
        padding: 64px 32px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;

        .emptyIcon {
            width: 76px;
            height: 76px;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.12);
            border: 1px solid rgba(139, 92, 246, 0.3);
            color: #A78BFA;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
        }

        h2 {
            font-size: 1.6rem;
            font-weight: 700;
            color: #FFFFFF;
            margin: 0;
        }

        p {
            color: #94A3B8;
            font-size: 1rem;
            line-height: 1.6;
            max-width: 600px;
            margin: 0;
        }

        .emptyActions {
            display: flex;
            gap: 16px;
            margin-top: 16px;
            flex-wrap: wrap;
            justify-content: center;
        }
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
        border-radius: 20px;
        padding: 40px 44px;
        display: flex;
        align-items: flex-start;
        gap: 28px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

        &__icon {
            width: 60px;
            height: 60px;
            border-radius: 14px;
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
                font-size: 1.35rem;
                font-weight: 700;
                color: #FFFFFF;
                margin: 0 0 6px;
            }

            p {
                color: #94A3B8;
                font-size: 0.95rem;
                line-height: 1.5;
                margin: 0;

                code {
                    color: #F43F5E;
                    background: rgba(244, 63, 94, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
            }

            .stepsGrid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 16px;
                margin-top: 20px;

                .stepItem {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;

                    .stepNum {
                        width: 26px;
                        height: 26px;
                        border-radius: 50%;
                        background: #8B5CF6;
                        color: #FFFFFF;
                        font-weight: 700;
                        font-size: 0.82rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }

                    strong {
                        display: block;
                        color: #FFFFFF;
                        font-size: 0.88rem;
                        margin-bottom: 2px;
                    }

                    p {
                        color: #94A3B8;
                        font-size: 0.8rem;
                        line-height: 1.4;
                        margin: 0;
                    }
                }
            }
        }

        &__action {
            flex-shrink: 0;
            align-self: center;
        }
    }

    @media screen and (max-width: 900px) {
        .showcaseCtaCard {
            flex-direction: column;
            padding: 30px 24px;
            gap: 20px;

            &__action {
                align-self: stretch;
                width: 100%;
            }
        }
    }
</style>
