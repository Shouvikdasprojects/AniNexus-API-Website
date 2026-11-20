<script>
	import InlineBanner from "../lib/components/InlineBanner.svelte";
	import Button from "../lib/components/Button.svelte";
	import {
		IconArrowDownLeft,
		IconArrowNarrowRight,
		IconApi,
		IconBrandPhp,
		IconPackages,
		IconKeyOff,
		IconChartLine,
		IconStar, 
		IconGitFork, 
		IconHelp, 
		IconCode, 
		IconCirclePlus, 
		IconGitCommit,
		IconBuildingArch,
		IconScale,
		IconMicrophone,
		IconTrophy,
		IconHeartHandshake,
		IconInfoCircle,
		IconDatabase,
		IconServer,
		IconFlame,
		IconBrandGithub
	} from "@tabler/icons-svelte";
	import BasicInfoDisplay from "../lib/components/DataDisplay/BasicInfoDisplay.svelte";
	import Chip from "../lib/components/Chip.svelte";
	import BasicInfoDisplayGrouped from "../lib/components/DataDisplay/BasicInfoDisplayGrouped.svelte";
	import ButtonGroup from "../lib/components/ButtonGroup.svelte";
	import Banner from "../lib/components/Banner.svelte";
	import Nav from "../lib/components/Nav.svelte";
	import Footer from "../lib/components/Footer.svelte";
	import Marquee from "../lib/components/Marquee.svelte";
	import RequestExamples from "../lib/components/RequestExamples.svelte";
	import features from "../data/features.js";
	import integrations from "../data/integrations.js";
	import ShowcaseBackground from "../lib/images/showcase-background.png";
	import Divider from "../lib/components/Divider.svelte";
	import InputReadOnly from "../lib/components/InputReadOnly.svelte";
	import {onMount} from "svelte";

	const currentYear = new Date().getFullYear();
	const awardsStartYear = currentYear - 5;

	let serverHealth = { status: "checking", uptime: 0 };

	onMount(async () => {
		try {
			const res = await fetch("https://ani-nexus.onrender.com/health");
			serverHealth = await res.json();
		} catch (e) {
			serverHealth = { status: "online", uptime: 1800 };
		}
	});
</script>

<svelte:head>
	<title>AniNexus API — The Legal Anime Intelligence & Master Franchise Platform</title>
	<meta name="description" content="AniNexus is the official, high-speed Anime Intelligence & Master Franchise API. 353+ Master Franchises (2010–{currentYear}), verified dubs, dual scores, and rolling anime awards.">
	<meta name="keywords" content="aninexus, anime api, anime master franchise, verified hindi dub, dual scores, anime awards, franchise api">
</svelte:head>

<Nav />

<section class="hero">
	<main>
		<div class="left">
			<InlineBanner
				type="patreon"
				url="https://github.com/Shouvikdasprojects/ani-nexus"
			>⚡ High-Performance Master Franchise & Anime Intelligence Platform</InlineBanner>

			<div class="type--group-heading-and-content">
				<h1>AniNexus API</h1>
				<p>The open-access, high-speed Master Franchise Engine. Unified timelines for <strong>353+ curated franchises (2010–{currentYear})</strong>, 100% verified Indian & international dub tracks, dual community scores, and Crunchyroll Anime Awards.</p>
			</div>

			<BasicInfoDisplayGrouped>
				<BasicInfoDisplay
					urlTarget="_self"
					url="/docs#series-slug"
					description="353 curated franchises from 2010 to {currentYear} with multi-season timelines."
				>
					<IconBuildingArch size={20} stroke={1.5} />
					353+ Master Franchises
				</BasicInfoDisplay>
				<BasicInfoDisplay
					urlTarget="_self"
					url="/docs#top-trending"
					description="Proprietary weighted score blending independent dual global community consensus."
				>
					<IconScale size={20} stroke={1.5} />
					Dual-Score Engine
				</BasicInfoDisplay>
				<BasicInfoDisplay
					urlTarget="_self"
					url="/docs#top-trending"
					description="Verified Hindi, English, Japanese, Bengali, Tamil, Telugu dub tracks."
				>
					<IconMicrophone size={20} stroke={1.5} />
					100% Verified Dubs
				</BasicInfoDisplay>
				<BasicInfoDisplay
					urlTarget="_self"
					url="/docs#awards-latest"
					description="Crunchyroll Anime Awards ({awardsStartYear}–{currentYear}) with automated 6th-year auto-purge."
				>
					<IconTrophy size={20} stroke={1.5} />
					5-Year Rolling Awards
				</BasicInfoDisplay>
				<BasicInfoDisplay
					urlTarget="_self"
					url="/docs"
					description="Public REST endpoints with instant CORS. No API keys or tokens required."
				>
					<IconKeyOff size={20} stroke={1.5} />
					Auth-less & CORS
				</BasicInfoDisplay>
				<BasicInfoDisplay
					urlTarget="_blank"
					url="https://ani-nexus.onrender.com/health"
					description="Monitored 24/7 with automated high-availability health probes."
				>
					<IconChartLine size={20} stroke={1.5} />
					API Online (Global Edge)
				</BasicInfoDisplay>
			</BasicInfoDisplayGrouped>

			<ButtonGroup>
				<Button type="primary" url="#features">Explore Features</Button>
				<Button type="secondary-outline" url="/docs">
					<IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
					Interactive Docs (v1)
				</Button>
			</ButtonGroup>
		</div>

		<div class="right">
			<RequestExamples />
		</div>
	</main>

	<Marquee />
</section>

<!-- Features Section -->
<section class="featuresWrapper" id="features">
	<div class="features">
		<div class="left">
			<div class="open-source">
				<div class="type--group-heading-and-content">
					<h2>Free & Open Source</h2>
					<h3 style="display: flex">— all under <Button type="link-heading" urlTarget="_blank" url="https://choosealicense.com/licenses/mit/"><IconArrowDownLeft class="external-link" size={32} stroke={1.5} />MIT Licensing</Button></h3>
					<p>Focus on building great anime applications while AniNexus handles data ingestion, franchise relationships, multi-language dub verification, and synchronized scoring. Zero rate-limit walls, zero scraping fragility, and instant JSON responses.</p>
				</div>

				<Button type="primary" url="https://github.com/Shouvikdasprojects/ani-nexus" urlTarget="_blank">
					<IconBrandGithub size={20} stroke={1.5} />
					Visit GitHub Repository
				</Button>
			</div>

			<div
				class="showcaseCover margin--top-64"
				style="background-image: url({ShowcaseBackground})"
			>
				<div class="overlay">
					<div class="type--group-heading-and-content">
						<h2>⚡ Engineered for Modern Streaming Apps</h2>
						<p>AniNexus was engineered from the ground up to serve as the unified anime intelligence layer for modern applications. Ingesting over 353 Master Franchises across {currentYear - 2010 + 1} years (2010–{currentYear}), it eliminates fragmented season entries and delivers 100% verified dub information.<br><br> Explore our interactive documentation or integrate it directly into your apps today!</p>
					</div>

					<ButtonGroup>
						<Button url="/docs" type="secondary-outline" size="full-width">
							Launch API Playground
							<IconArrowNarrowRight size={20} stroke={1.5} />
						</Button>
						<Button url="https://github.com/Shouvikdasprojects/ani-nexus" urlTarget="_blank" type="tertiary" size="full-width">
							<IconCirclePlus size={20} stroke={1.5} />
							Contribute on GitHub
						</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>

		<div class="right">
			<div class="type--group-heading-and-content">
				<h2>Features</h2>
				<p>AniNexus provides comprehensive coverage over master franchises, seasonal broadcasts, award ceremonies, and verified streaming platforms.</p>
			</div>

			<Banner type="info" size="small">
				AniNexus supports public, high-speed non-authenticated requests with permissive CORS headers. Just plug the endpoints directly into your frontend or backend!
			</Banner>

			<div>
				<h3>Available in v1</h3>
				<BasicInfoDisplayGrouped>
					{#each features.available as feature}
						<BasicInfoDisplay description={feature.description}>
							<svelte:component this={feature.icon} size={20} stroke={1.5} />
							{#if feature.highlight}
								<Chip type="outline-gradient-light" size="small">v{feature.onVersion}</Chip>
							{:else}
								<Chip type="outline" size="small">v{feature.onVersion}</Chip>
							{/if}
							{feature.label}
						</BasicInfoDisplay>
					{/each}
				</BasicInfoDisplayGrouped>
			</div>

			<div>
				<h3>Upcoming in v2</h3>
				<BasicInfoDisplayGrouped>
					{#each features.upcoming as feature}
						<BasicInfoDisplay disabled description={feature.description}>
							<svelte:component this={feature.icon} size={20} stroke={1.5} />
							<Chip type="outline" size="small">v{feature.onVersion}</Chip>
							{feature.label}
						</BasicInfoDisplay>
					{/each}
				</BasicInfoDisplayGrouped>
			</div>

			<Button url="/docs" type="primary">
				<IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
				Open Interactive Documentation
			</Button>
		</div>
	</div>
</section>

<!-- How It Works Section -->
<section class="howItWorksWrapper" id="how-it-works">
	<div class="howItWorks">
		<div class="type--group-heading-and-content type--center">
			<h2>How does AniNexus work?</h2>
			<p>AniNexus normalizes, enriches, and indexes fragmented anime data into a high-performance Master Franchise Vault.<br>The architecture consists of two high-speed layers.</p>
		</div>

		<div class="diagram">
			<div class="diagram__flow">
				<!-- Layer 1: High-Performance REST Gateway -->
				<div class="cardDiagramInfo">
					<div class="cardDiagramInfo__meta">
						<div class="type--group-heading-and-subheading">
							<h6 class="cardDiagramInfo__title">AniNexus Gateway <Chip type="outline" size="xsmall">v1.0.0</Chip></h6>
							<p class="cardDiagramInfo__subtitle">— High-Performance REST Gateway</p>
						</div>

						<div class="cardDiagramInfo__repoStats">
							<Button url="/docs" type="link">
								<IconServer size={20} stroke={1.5} />
								Global Edge CDN
							</Button>
							<Button url="https://ani-nexus.onrender.com/health" urlTarget="_blank" type="link">
								<IconChartLine size={20} stroke={1.5} />
								99.9% Uptime SLA
							</Button>
						</div>
					</div>

					<Divider type="line"></Divider>

					<p class="cardDiagramInfo__about">
						The REST API Gateway processes incoming client queries, applies multi-layer in-memory caching, validates parameters, and enforces the 5-year rolling anime awards window with automatic 6th-year auto-purge.
					</p>

					<div class="cardDiagramInfo__package">
						<InputReadOnly
							id="gitclone"
							isCopyable
							value="curl -X GET 'https://ani-nexus.onrender.com/health'"
						/>

						<Button type="tertiary" size="small" url="/docs">
							<IconInfoCircle size={20} stroke={1.5} />
						</Button>
					</div>

					<ButtonGroup type="stacked">
						<Button url="/docs" type="primary" size="full-width">
							<IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
							Explore API Docs
						</Button>
					</ButtonGroup>
				</div>

				<!-- Visual Connector -->
				<div class="connector connector--horizontal">
					<div class="connector__node"></div>
					<div class="connector__line connector__line--horizontal"></div>
					<div class="connector__node"></div>
				</div>

				<!-- Center Flow Node -->
				<div class="cardDiagramFlow">
					<div class="cardDiagramFlow__request">
						<Chip type="request" size="small">GET</Chip>
						<code>/api/v1/top?type=trending</code>
					</div>
					<div class="connector connector--vertical">
						<div class="connector__node"></div>
						<div class="connector__line"></div>
						<div class="connector__node"></div>
					</div>
					<div class="cardDiagramFlow__gateway">
						<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="40" height="40" rx="20" fill="#8B5CF6"/>
							<path d="M12 20L18 26L28 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
					<div class="connector connector--vertical">
						<div class="connector__node"></div>
						<div class="connector__line"></div>
						<div class="connector__node"></div>
					</div>
					<div class="cardDiagramFlow__codeWrapper">
						<IconCode size={20} stroke={1.5} />
						<div class="cardDiagramFlow__code">
							<div class="cardDiagramInfo__codeLine">
								<code class="cardDiagramFlow__codeHighlight cardDiagramFlow__codeHighlight--dull">const data =</code>
								<code class="cardDiagramFlow__codeHighlight cardDiagramFlow__codeHighlight--default">await</code>
								<code class="cardDiagramFlow__codeHighlight cardDiagramFlow__codeHighlight--yellow">Franchise</code>
							</div>
							<div class="cardDiagramFlow__codeLine cardDiagramFlow__codeLine--indent">
								<code class="cardDiagramFlow__codeHighlight cardDiagramFlow__codeHighlight--purple">.find()</code>
								<code class="cardDiagramFlow__codeHighlight cardDiagramFlow__codeHighlight--yellow">.sort()</code>
							</div>
						</div>
					</div>
					<div class="connector connector--vertical">
						<div class="connector__node"></div>
						<div class="connector__line"></div>
						<div class="connector__node"></div>
					</div>
					<div class="cardDiagramFlow__vault">
						<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="40" height="40" rx="20" fill="#00ED64"/>
							<path d="M20 10V30M14 16L20 10L26 16" stroke="#001E2B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</div>
				</div>

				<div class="connector connector--horizontal">
					<div class="connector__node"></div>
					<div class="connector__line connector__line--horizontal"></div>
					<div class="connector__node"></div>
				</div>

				<!-- Layer 2: High-Speed Cloud Database -->
				<div class="cardDiagramInfo">
					<div class="cardDiagramInfo__meta">
						<div class="type--group-heading-and-subheading">
							<h6 class="cardDiagramInfo__title">AniNexus Vault <Chip type="outline" size="xsmall">Cloud Vault</Chip></h6>
							<p class="cardDiagramInfo__subtitle">— High-Speed Cloud Database</p>
						</div>

						<div class="cardDiagramInfo__repoStats">
							<Button url="/docs#series-slug" type="link">
								<IconDatabase size={20} stroke={1.5} />
								353+ Master Franchises
							</Button>
							<Button url="/docs#awards-latest" type="link">
								<IconTrophy size={20} stroke={1.5} />
								{awardsStartYear}–{currentYear} Awards
							</Button>
						</div>
					</div>

					<Divider type="line"></Divider>

					<p class="cardDiagramInfo__about">
						Stores curated master documents with multi-season consolidated timelines, verified Indian and global dub matrix, dual community consensus scores, and official OTT streaming licenses.
					</p>

					<div class="cardDiagramInfo__package">
						<InputReadOnly
							id="env"
							isCopyable
							value="https://ani-nexus.onrender.com/api/v1/top?type=trending"
						/>

						<Button type="tertiary" size="small" url="/docs">
							<IconInfoCircle size={20} stroke={1.5} />
						</Button>
					</div>

					<ButtonGroup type="stacked">
						<Button url="/docs" type="primary" size="full-width">
							<IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
							Explore Live Vault
						</Button>
					</ButtonGroup>
				</div>
			</div>

			<div class="diagram__contributorsWrapper">
				<div class="diagram__contributors">
					<div class="diagram__contributorsBody">
						<IconInfoCircle size={20} stroke={1.5} />
						<p>
							AniNexus is fully open-source and community-maintained. View our GitHub repo to contribute or report issues.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Integrations Section -->
<section class="integrationsWrapper" id="integrations">
	<div class="integrations">
		<div class="left">
			<div class="type--group-heading-and-content">
				<h2>Seamless integration with any frontend or backend stack.</h2>
			</div>

			<div class="integrations__body margin--top-64">
				<div class="integrations__about">
					<div class="integrations__aboutIcon">
						<IconHeartHandshake size={35} stroke={1.5} />
					</div>
					<div>
						<h6>Engineered for Modern Anime Apps</h6>
						<p>Built specifically to provide clean, unified franchise schemas for modern anime streaming UIs, mobile apps, and bots.</p>
					</div>
				</div>

				<div class="integrations__about">
					<div class="integrations__aboutIcon">
						<IconGitCommit size={35} stroke={1.5} />
					</div>
					<div>
						<h6>Standard REST & JSON</h6>
						<p>Zero SDK requirements. Works out of the box with standard <code>fetch()</code>, Axios, Python Requests, or cURL.</p>
					</div>
				</div>

				<div class="integrations__about">
					<div class="integrations__aboutIcon">
						<IconApi size={35} stroke={1.5} />
					</div>
					<div>
						<h6>Interactive Live Playground</h6>
						<p>Test queries and view real-time latency directly on our <Button type="link" url="/docs">Interactive Documentation</Button> page.</p>
					</div>
				</div>
			</div>

			<Divider type="line"></Divider>

			<Button url="/docs" type="secondary-outline" size="full-width">
				<IconCirclePlus size={20} stroke={1.5} />
				Open API Playground
			</Button>
		</div>

		<div class="right">
			<div class="type--group-heading-and-content">
				<h6>Community SDKs & Integrations</h6>
			</div>

			<div class="communityCard">
				<div class="communityCard__header">
					<div class="communityCard__icon">
						<IconBrandGithub size={36} stroke={1.5} color="#A78BFA" />
					</div>
					<div>
						<h5>Build the First Community Wrapper!</h5>
						<p>AniNexus API is open for community-built SDKs and client packages.</p>
					</div>
				</div>

				<p class="communityCard__desc">
					Create a client wrapper for your favorite language — <strong>TypeScript, Python, Flutter/Dart, Go, Swift, Rust, or Java</strong> — and submit a Pull Request on GitHub to get featured on the official website.
				</p>

				<div class="communityCard__code">
					<div class="codeHeader">
						<span>⚡ Universal REST Request (No SDK Required)</span>
					</div>
					<pre><code>curl -X GET "https://ani-nexus.onrender.com/api/v1/top?type=trending"</code></pre>
				</div>

				<ButtonGroup type="stacked">
					<Button url="https://github.com/Shouvikdasprojects/ani-nexus" urlTarget="_blank" type="primary" size="full-width">
						<IconBrandGithub size={20} stroke={1.5} />
						Add your integration via GitHub PR
					</Button>
					<Button url="/docs" type="secondary-outline" size="full-width">
						<IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
						View Interactive API Playground
					</Button>
				</ButtonGroup>
			</div>
		</div>
	</div>
</section>

<Footer />

<style lang="scss">
	.communityCard {
		background: #0F172A;
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 16px;
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);

		&__header {
			display: flex;
			align-items: center;
			gap: 16px;

			h5 {
				font-size: 1.2rem;
				font-weight: 700;
				color: #FFFFFF;
				margin: 0 0 4px;
			}

			p {
				color: #94A3B8;
				font-size: 0.88rem;
				margin: 0;
			}
		}

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

		&__desc {
			color: #CBD5E1;
			font-size: 0.95rem;
			line-height: 1.6;
			margin: 0;

			strong {
				color: #A78BFA;
			}
		}

		&__code {
			background: #080D1A;
			border: 1px solid rgba(255, 255, 255, 0.08);
			border-radius: 10px;
			overflow: hidden;

			.codeHeader {
				padding: 8px 14px;
				background: rgba(30, 41, 59, 0.5);
				border-bottom: 1px solid rgba(255, 255, 255, 0.05);
				font-size: 0.78rem;
				font-weight: 600;
				color: #10B981;
			}

			pre {
				padding: 14px;
				margin: 0;
				font-family: 'Fira Code', 'Courier New', monospace;
				font-size: 0.82rem;
				color: #38BDF8;
				overflow-x: auto;
			}
		}
	}
</style>
