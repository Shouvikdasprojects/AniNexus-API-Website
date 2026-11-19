<script>
import Button from "./Button.svelte";
import {IconArrowDownLeft, IconBrandGithub, IconMenu, IconX, IconActivity} from "@tabler/icons-svelte";
import Chip from "./Chip.svelte";
import Logo from "$lib/images/aninexus.svg";

let scrollY;
let mobileNavToggled = false;
$: isMinimized = scrollY > 50 ? 'navWrapper--minimize' : '';
function toggleMobileNav() {
    mobileNavToggled = !mobileNavToggled;
    const navEl = document.getElementById("nav");
    if (navEl) navEl.classList.toggle('active');
}
</script>

<svelte:window bind:scrollY />

<div id="nav" class="navWrapper {isMinimized}">
    <nav class="nav">
        <div class="nav__top">
            <a href="/" class="logo">
                <img src={Logo} alt="AniNexus API Logo" class="logo-img" />
                <span class="logo-title">AniNexus <span>API</span></span>
            </a>
            <div id="mobile-nav">
                <Button type="nav-trigger" size="small"
                    callback={toggleMobileNav}
                >
                    {#if mobileNavToggled}
                        <IconX size={25} stroke={1.5} />
                    {:else}
                        <IconMenu size={25} stroke={1.5} />
                    {/if}
                </Button>
            </div>
        </div>
        <div class="nav__bodyWrapper">
            <div class="nav__body">
                <div class="main">
                    <Button
                        type="nav-link"
                        url="/docs"
                    >
                        <IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
                        Documentation
                        <Chip type="outline" size="small">v1</Chip>
                    </Button>
                    <Button type="nav-link" url="/#features">Features</Button>
                    <Button type="nav-link" url="/#how-it-works">How it works</Button>
                    <Button type="nav-link" url="/docs">API Playground</Button>
                </div>

                <div class="links">
                    <a href="https://ani-nexus.onrender.com/health" target="_blank" class="statusPill" title="Live Health Endpoint">
                        <span class="pulseDot"></span>
                        API Online
                    </a>
                    <Button type="nav-icon-link" size="small" urlTarget="_blank" url="https://github.com/Shouvikdasprojects/ani-nexus">
                        <IconBrandGithub size={20} stroke={1.5} />
                    </Button>
                </div>
            </div>
        </div>
    </nav>
</div>

<style lang="scss">
    .navWrapper {
      display: flex;
      height: 100px;
      position: fixed;
      top: 0;
      z-index: 99999;
      justify-content: center;
      align-items: center;
      width: 100vw;
      backdrop-filter: blur(25px);
      background: rgba(15, 23, 42, 0.75);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.25s ease;

      &--minimize {
        height: 65px;
        background: rgba(15, 23, 42, 0.95);
      }
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1280px;
      padding: 0 32px;

      &__top {
        display: flex;
        align-items: center;
      }

      &__bodyWrapper {
        display: flex;
        flex: 1;
        justify-content: flex-end;
      }

      &__body {
        display: flex;
        align-items: center;
        gap: 32px;
      }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;

      .logo-img {
        width: 36px;
        height: 36px;
        filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
      }

      .logo-title {
        font-family: inherit;
        font-size: 1.25rem;
        font-weight: 700;
        color: #FFFFFF;
        letter-spacing: -0.02em;

        span {
          color: #8B5CF6;
          font-weight: 800;
        }
      }
    }

    .main {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .links {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .statusPill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #10B981;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 9999px;
      padding: 4px 12px;
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(16, 185, 129, 0.2);
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
      }
    }

    .pulseDot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    #mobile-nav {
      display: none;
    }

    @media (max-width: 860px) {
      #mobile-nav {
        display: block;
      }
      .nav__bodyWrapper {
        display: none;
      }
    }
</style>
