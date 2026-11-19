<script>
import Button from "./Button.svelte";
import {IconArrowDownLeft, IconBrandGithub, IconExternalLink, IconHeart} from "@tabler/icons-svelte";
import Logo from "$lib/images/aninexus.svg";
</script>

<footer class="footer">
    <div class="footer__body">
        <div class="footer__content">
            <div class="footer__brand">
                <a href="/" class="logo">
                    <img src={Logo} alt="AniNexus API Logo" class="footerLogo" />
                    <span class="footerTitle">AniNexus <span>API</span></span>
                </a>
                <p>The Master Franchise & Legal Anime Intelligence Platform for AnimeNation India</p>

                <div class="statusPill">
                    <span class="pulseDot"></span>
                    <span>Live Gateway: <code>https://ani-nexus.onrender.com</code></span>
                </div>
            </div>

            <div class="footer__linksWrapper">
                <div class="footer__links">
                    <strong>Navigation</strong>
                    <ul>
                        <li><Button url="/docs" type="link">Documentation (v1)</Button></li>
                        <li><Button url="/#features" type="link">Features</Button></li>
                        <li><Button url="/#how-it-works" type="link">How It Works</Button></li>
                        <li><Button url="/docs" type="link">API Playground</Button></li>
                    </ul>
                </div>
                <div class="footer__links">
                    <strong>Endpoints</strong>
                    <ul>
                        <li><Button url="/docs#top-trending" type="link">Top Collections</Button></li>
                        <li><Button url="/docs#seasons-now" type="link">Seasonal Airing</Button></li>
                        <li><Button url="/docs#awards-latest" type="link">Anime Awards (2021-2026)</Button></li>
                        <li><Button url="/docs#series-slug" type="link">Master Franchises</Button></li>
                    </ul>
                </div>
                <div class="footer__links">
                    <strong>Ecosystem</strong>
                    <ul>
                        <li><Button url="https://github.com/Shouvikdasprojects/ani-nexus" urlTarget="_blank" type="link"><IconBrandGithub size={16} /> GitHub Repo</Button></li>
                        <li><Button url="https://ani-nexus.onrender.com/health" urlTarget="_blank" type="link">Health Monitor</Button></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</footer>

<div class="copyright">
    <div class="copyright__content">
        <span>© 2024–2026 AniNexus API. Built with <IconHeart size={14} color="#EF4444" style="margin: 0 4px; display: inline;" /> for AnimeNation India.</span>
        <span>Open-Source Anime Metadata Engine. Powered by Express, TypeScript & MongoDB Atlas.</span>
    </div>
</div>

<style lang="scss">
  .footer {
    padding: 80px 0;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 100%;
    background: #0B0F19;
    border-top: 1px solid rgba(255, 255, 255, 0.06);

    &__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 64px;
      width: 100%;
      max-width: 1280px;
      padding: 0 32px;
    }

    &__brand {
      max-width: 400px;

      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
        margin-bottom: 12px;

        .footerLogo {
          width: 32px;
          height: 32px;
        }

        .footerTitle {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;

          span {
            color: #8B5CF6;
          }
        }
      }

      p {
        color: #94A3B8;
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0 0 16px;
      }

      .statusPill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.78rem;
        color: #CBD5E1;
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 5px 12px;
        border-radius: 9999px;

        code {
          color: #A78BFA;
          font-family: monospace;
        }

        .pulseDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }
      }
    }

    &__content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      gap: 40px;
    }

    &__linksWrapper {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 56px;
    }

    &__links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;

      strong {
        color: #F8FAFC;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      ul {
        margin: 0; padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      li {
        list-style: none;
        margin: 0; padding: 0;
      }
    }
  }

  .copyright {
    box-sizing: border-box;
    padding: 24px 32px;
    align-items: center;
    justify-content: center;
    display: flex;
    width: 100%;
    background: #070A12;
    border-top: 1px solid rgba(255, 255, 255, 0.04);

    &__content {
      font-size: 0.82rem;
      display: flex;
      justify-content: space-between;
      color: #64748B;
      align-items: center;
      gap: 32px;
      width: 100%;
      max-width: 1280px;

      span {
        display: flex;
        align-items: center;
      }
    }
  }

  @media screen and (max-width: 900px) {
    .footer {
      padding: 60px 16px;

      &__content {
        flex-direction: column;
        gap: 40px;
      }

      &__linksWrapper {
        flex-wrap: wrap;
        gap: 32px;
      }
    }

    .copyright__content {
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
  }
</style>
