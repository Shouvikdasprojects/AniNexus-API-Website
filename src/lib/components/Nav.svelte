<script>
import Button from "./Button.svelte";
import {IconArrowDownLeft, IconBrandGithub, IconMenu, IconX} from "@tabler/icons-svelte";
import Chip from "./Chip.svelte";
import Logo from "$lib/images/aninexus.svg";

let scrollY;
let mobileNavToggled = false;
$: isMinimized = scrollY > 50 ? 'navWrapper--minimize' : '';

function toggleMobileNav() {
    mobileNavToggled = !mobileNavToggled;
    const navEl = document.getElementById("nav");
    if (navEl) navEl.classList.toggle('active', mobileNavToggled);
}

function closeMobileNav() {
    mobileNavToggled = false;
    const navEl = document.getElementById("nav");
    if (navEl) navEl.classList.remove('active');
}
</script>

<svelte:window bind:scrollY />

<div id="nav" class="navWrapper {isMinimized} {mobileNavToggled ? 'active' : ''}">
    <nav class="nav">
        <div class="nav__top">
            <a href="/" class="logo" on:click={closeMobileNav}>
                <img src={Logo} alt="AniNexus API Logo" class="logo-img" />
                <span class="logo-title">AniNexus <span class="apiBadge">API</span></span>
            </a>
            <div id="mobile-nav">
                <Button type="nav-trigger" size="small"
                    callback={toggleMobileNav}
                    title="Toggle mobile menu"
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
                        callback={closeMobileNav}
                    >
                        <IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
                        Documentation
                        <Chip type="outline" size="small">v1</Chip>
                    </Button>
                    <Button type="nav-link" url="/#features" callback={closeMobileNav}>Features</Button>
                    <Button type="nav-link" url="/#how-it-works" callback={closeMobileNav}>How it works</Button>
                    <Button type="nav-link" url="/showcase" callback={closeMobileNav}>Showcase</Button>
                    <Button type="nav-link" url="/docs" callback={closeMobileNav}>API Playground</Button>
                </div>

                <div class="links">
                    <a href="https://ani-nexus.onrender.com/health/detailed" target="_blank" rel="noopener noreferrer" class="statusPill" title="Live Telemetry: Operational (99.9% Uptime)">
                        <span class="pulseDot"></span>
                        Operational
                    </a>
                    <Button type="nav-icon-link" size="small" urlTarget="_blank" url="https://github.com/Shouvikdasprojects/AniNexus-API-Website" title="View Source on GitHub">
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
      background: rgba(15, 23, 42, 0.85);
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
        justify-content: space-between;
        width: 100%;
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
        width: 38px;
        height: 38px;
        filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
        transition: transform 0.3s ease;
      }

      &:hover .logo-img {
        transform: scale(1.08) rotate(6deg);
      }

      .logo-title {
        font-family: inherit;
        font-size: 1.3rem;
        font-weight: 800;
        color: #FFFFFF;
        letter-spacing: -0.02em;
        display: flex;
        align-items: center;
        gap: 6px;

        .apiBadge {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%);
          color: #FFFFFF;
          padding: 2px 7px;
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
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

    @media (min-width: 861px) {
      .nav__top {
        width: auto;
      }
    }

    @media (max-width: 860px) {
      #mobile-nav {
        display: block;
      }

      .navWrapper {
        height: 70px;
      }

      .navWrapper.active {
        background: rgba(15, 23, 42, 0.98);

        .nav__bodyWrapper {
          display: flex;
          position: fixed;
          top: 70px;
          left: 0;
          width: 100vw;
          height: calc(100vh - 70px);
          background: rgba(15, 23, 42, 0.98);
          backdrop-filter: blur(25px);
          flex-direction: column;
          padding: 24px;
          overflow-y: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.08);

          .nav__body {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            gap: 20px;

            .main {
              flex-direction: column;
              align-items: stretch;
              width: 100%;
              gap: 12px;
            }

            .links {
              width: 100%;
              justify-content: space-between;
              padding-top: 16px;
              border-top: 1px solid rgba(255, 255, 255, 0.08);
            }
          }
        }
      }

      .nav__bodyWrapper {
        display: none;
      }
    }
</style>
