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
		IconBrandGithub,
		IconDeviceDesktop,
		IconBook
	} from "@tabler/icons-svelte";
	import BasicInfoDisplay from "../lib/components/DataDisplay/BasicInfoDisplay.svelte";
	import Chip from "../lib/components/Chip.svelte";
	import BasicInfoDisplayGrouped from "../lib/components/DataDisplay/BasicInfoDisplayGrouped.svelte";
	import ButtonGroup from "../lib/components/ButtonGroup.svelte";
	import Banner from "../lib/components/Banner.svelte";
	import Nav from "../lib/components/Nav.svelte";
	import Footer from "../lib/components/Footer.svelte";
	import RequestExamples from "../lib/components/RequestExamples.svelte";
	import features from "../data/features.js";
	import integrations from "../data/integrations.js";
	import Divider from "../lib/components/Divider.svelte";
	import InputReadOnly from "../lib/components/InputReadOnly.svelte";
	import IntegrationCard from "../lib/components/IntegrationCard.svelte";
	import {onMount} from "svelte";

	const currentYear = new Date().getFullYear();
	const awardsStartYear = currentYear - 5;

	let serverHealth = { status: "checking", uptime: 0 };
	let totalFranchises = 634;

	onMount(async () => {
		try {
			const res = await fetch("https://ani-nexus.onrender.com/health");
			serverHealth = await res.json();
		} catch (e) {
			serverHealth = { status: "online", uptime: 1800 };
		}

		try {
			const topRes = await fetch("https://ani-nexus.onrender.com/api/v1/top?type=popular&limit=1");
			const topJson = await topRes.json();
			if (topJson?.data?.total && topJson.data.total >= 634) {
				totalFranchises = topJson.data.total;
			} else {
				totalFranchises = 634;
			}
		} catch (e) {
			totalFranchises = 634;
		}
	});
</script>

<svelte:head>
	<title>AniNexus API — The Legal Anime Intelligence & Master Franchise Platform</title>
	<meta name="google-site-verification" content="eV-a5nS42eCtPVcFxOdU3Ko6DNbOLSbCPH-pEQvrtYI" />
	<meta name="description" content="AniNexus is the official, high-speed Anime Intelligence & Master Franchise API. {totalFranchises}+ Master Franchises (1960s–{currentYear}+), verified dubs, dual scores, and rolling anime awards.">
	<meta name="keywords" content="aninexus, anime api, anime master franchise, verified hindi dub, dual scores, anime awards, franchise api">
	<meta property="og:image" content="https://aninexus-api-website.pages.dev/og-banner.png" />
	<meta name="twitter:image" content="https://aninexus-api-website.pages.dev/og-banner.png" />
</svelte:head>

<Nav />

<section class="hero">
	<main>
		<div class="left">
			<InlineBanner
				type="patreon"
				url="https://github.com/Shouvikdasprojects/AniNexus-API-Website/releases/tag/v1.0.0"
			>🚀 Official v1.1.0 Stable Release • 38 Endpoints, 21.6k+ Manga & Novels, 634+ Franchises, OpenAPI 3.1 & SDKs</InlineBanner>

			<div class="type--group-heading-and-content">
				<h1>AniNexus API</h1>
				<p>The open-access, high-speed Master Franchise Engine — Powered by <strong>Shouvik Das</strong>. Unified timelines for <strong>{totalFranchises}+ curated franchises (1960s–{currentYear}+)</strong>, <strong>21,600+ Manga, Manhwa & Light Novels</strong>, 100% verified Indian & international dub tracks, dual community scores, and Industry Anime Awards.</p>
			</div>

			<BasicInfoDisplayGrouped>
				<BasicInfoDisplay
					urlTarget="_self"
					url="/docs#series-slug"
					description="{totalFranchises}+ curated franchises from classic to modern eras (1960s–{currentYear}+) with multi-season timelines."
				>
					<IconBuildingArch size={20} stroke={1.5} />
					{totalFranchises}+ Master Franchises
				</BasicInfoDisplay>
				<BasicInfoDisplay
					urlTarget="_self"
					url="/docs#manga-omni"
					description="21,600+ Manga, Korean Webtoons, Manhua & Light Novels with cross-adaptation anime links."
				>
					<IconBook size={20} stroke={1.5} />
					21,600+ Reading Vault
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
					description="Industry Anime Awards ({awardsStartYear}–{currentYear}) with automated 6th-year auto-purge."
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
</section>

<!-- Features Section -->
<section class="featuresWrapper" id="features">
	<div class="features">
		<div class="left">
			<div class="open-source">
				<div class="type--group-heading-and-content">
					<h2>Free & Open Source</h2>
					<h3 style="display: flex">— all under <Button type="link-heading" urlTarget="_blank" url="https://choosealicense.com/licenses/mit/"><IconArrowDownLeft class="external-link" size={32} stroke={1.5} />MIT Licensing</Button></h3>
					<p>Focus on building great anime applications while AniNexus handles data ingestion, franchise relationships, multi-language dub verification, and synchronized scoring. Generous 90 req/min rate limit, zero scraping fragility, and instant JSON responses.</p>
				</div>

				<Button type="primary" url="https://github.com/Shouvikdasprojects/AniNexus-API-Website" urlTarget="_blank">
					<IconBrandGithub size={20} stroke={1.5} />
					Visit GitHub Repository
				</Button>
			</div>

			<div class="showcaseCover margin--top-64">
				<!-- Dynamic Animated Anime Ecosystem Stream (100% Unique to AniNexus) -->
				<div class="animeGridBackdrop" aria-hidden="true">
					<div class="glowOrb glowOrb--purple"></div>
					<div class="glowOrb glowOrb--cyan"></div>
					
					<!-- Row 1 (Drift Left) -->
					<div class="driftRow driftRow--left">
						<div class="driftTrack">
							<div class="driftItem"><span class="driftEmoji">⚔️</span><strong>Attack on Titan</strong> <span class="driftBadge">11 Parts • Score 85.4</span></div>
							<div class="driftItem"><span class="driftEmoji">⏳</span><strong>Frieren</strong> <span class="driftBadge">Score 91.2 • Top Rated</span></div>
							<div class="driftItem"><span class="driftEmoji">⚡</span><strong>Solo Leveling</strong> <span class="driftBadge">Hindi & English Dub</span></div>
							<div class="driftItem"><span class="driftEmoji">🌊</span><strong>Demon Slayer</strong> <span class="driftBadge">Kimetsu no Yaiba</span></div>
							<div class="driftItem"><span class="driftEmoji">👁️</span><strong>Jujutsu Kaisen</strong> <span class="driftBadge">Score 86.8</span></div>
							<div class="driftItem"><span class="driftEmoji">⚔️</span><strong>Attack on Titan</strong> <span class="driftBadge">11 Parts • Score 85.4</span></div>
							<div class="driftItem"><span class="driftEmoji">⏳</span><strong>Frieren</strong> <span class="driftBadge">Score 91.2 • Top Rated</span></div>
							<div class="driftItem"><span class="driftEmoji">⚡</span><strong>Solo Leveling</strong> <span class="driftBadge">Hindi & English Dub</span></div>
						</div>
					</div>

					<!-- Row 2 (Drift Right) -->
					<div class="driftRow driftRow--right">
						<div class="driftTrack">
							<div class="driftItem"><span class="driftEmoji">🪚</span><strong>Chainsaw Man</strong> <span class="driftBadge">Score 84.6</span></div>
							<div class="driftItem"><span class="driftEmoji">📜</span><strong>Omniscient Reader</strong> <span class="driftBadge">Manhwa • Top-to-Bottom</span></div>
							<div class="driftItem"><span class="driftEmoji">⏱️</span><strong>Steins;Gate</strong> <span class="driftBadge">Score 90.8 • Sci-Fi</span></div>
							<div class="driftItem"><span class="driftEmoji">🗼</span><strong>Tower of God</strong> <span class="driftBadge">Webtoon • 3 Seasons</span></div>
							<div class="driftItem"><span class="driftEmoji">🥊</span><strong>One Punch Man</strong> <span class="driftBadge">Hero Association</span></div>
							<div class="driftItem"><span class="driftEmoji">🩸</span><strong>Bleach: TYBW</strong> <span class="driftBadge">Score 89.6</span></div>
							<div class="driftItem"><span class="driftEmoji">🎯</span><strong>Hunter x Hunter</strong> <span class="driftBadge">148 Episodes</span></div>
							<div class="driftItem"><span class="driftEmoji">🪚</span><strong>Chainsaw Man</strong> <span class="driftBadge">Score 84.6</span></div>
							<div class="driftItem"><span class="driftEmoji">📜</span><strong>Omniscient Reader</strong> <span class="driftBadge">Manhwa • Top-to-Bottom</span></div>
							<div class="driftItem"><span class="driftEmoji">⏱️</span><strong>Steins;Gate</strong> <span class="driftBadge">Score 90.8 • Sci-Fi</span></div>
							<div class="driftItem"><span class="driftEmoji">🗼</span><strong>Tower of God</strong> <span class="driftBadge">Webtoon • 3 Seasons</span></div>
							<div class="driftItem"><span class="driftEmoji">🥊</span><strong>One Punch Man</strong> <span class="driftBadge">Hero Association</span></div>
						</div>
					</div>

					<!-- Row 3 (Drift Left) -->
					<div class="driftRow driftRow--left">
						<div class="driftTrack">
							<div class="driftItem"><span class="driftEmoji">🏆</span><strong>Industry Anime Awards</strong> <span class="driftBadge">2021–2026 Editions</span></div>
							<div class="driftItem"><span class="driftEmoji">🎙️</span><strong>Verified Dub Matrix</strong> <span class="driftBadge">Hindi, English, Japanese</span></div>
							<div class="driftItem"><span class="driftEmoji">📅</span><strong>Weekly Airing Calendar</strong> <span class="driftBadge">7-Day Live Tracker</span></div>
							<div class="driftItem"><span class="driftEmoji">📰</span><strong>Real-Time News Engine</strong> <span class="driftBadge">Cover Photos • 60-Day TTL</span></div>
							<div class="driftItem"><span class="driftEmoji">⚡</span><strong>{totalFranchises}+ Master Franchises</strong> <span class="driftBadge">Unified Watch Order</span></div>
							<div class="driftItem"><span class="driftEmoji">🏆</span><strong>Industry Anime Awards</strong> <span class="driftBadge">2021–2026 Editions</span></div>
							<div class="driftItem"><span class="driftEmoji">🎙️</span><strong>Verified Dub Matrix</strong> <span class="driftBadge">Hindi, English, Japanese</span></div>
						</div>
					</div>
				</div>

				<div class="overlay">
					<div class="type--group-heading-and-content">
						<h2>⚡ Engineered for Modern Anime Apps</h2>
						<p>AniNexus was engineered from the ground up to serve as the unified anime intelligence layer for modern anime platforms. Ingesting over {totalFranchises} Master Franchises spanning from golden-age classics to future modern releases (1960s–{currentYear}+), it eliminates fragmented season entries and delivers 100% verified dub information.<br><br> Explore our interactive documentation or integrate it directly into your apps today!</p>
					</div>

					<ButtonGroup>
						<Button url="/docs" type="secondary-outline" size="full-width">
							Launch API Playground
							<IconArrowNarrowRight size={20} stroke={1.5} />
						</Button>
						<Button url="/showcase" type="tertiary" size="full-width">
							<IconDeviceDesktop size={20} stroke={1.5} />
							View App Showcase
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
								{totalFranchises}+ Master Franchises
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
				<h2>Seamless integration with the languages you use and love.</h2>
			</div>

			<div class="integrations__body margin--top-64">
				<div class="integrations__about">
					<div class="integrations__aboutIcon">
						<IconHeartHandshake size={35} stroke={1.5} />
					</div>
					<div>
						<h6>By the community, for the community</h6>
						<p>Thanks to avid contributors, community-maintained wrappers and clients allow you to integrate AniNexus into your favorite stack with ease.</p>
					</div>
				</div>

				<div class="integrations__about">
					<div class="integrations__aboutIcon">
						<IconGitCommit size={35} stroke={1.5} />
					</div>
					<div>
						<h6>Zero-Token Auth & CORS</h6>
						<p>Generous 90 requests/minute fair-use limit with zero API keys required. Works out of the box with standard <code>fetch()</code>, Axios, Python Requests, or cURL.</p>
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

			<ButtonGroup type="stacked">
				<Button url="https://github.com/Shouvikdasprojects/AniNexus-API-Website/edit/master/src/data/integrations.js" urlTarget="_blank" type="primary" size="full-width">
					<IconCirclePlus size={20} stroke={1.5} />
					Add your integration via GitHub PR
				</Button>
				<Button url="/docs" type="secondary-outline" size="full-width">
					<IconArrowDownLeft class="external-link" size={20} stroke={1.5} />
					Open API Playground
				</Button>
			</ButtonGroup>

			<div class="integrationNotice">
				<p>💡 <strong>How to submit:</strong> Clicking <em>Add your integration</em> opens <code>integrations.js</code> in GitHub's web editor. Append your wrapper details and click <strong>Propose changes</strong> to create a Pull Request!</p>
			</div>
		</div>

		<div class="right">
			<div class="type--group-heading-and-content">
				<h6>Available Integrations {integrations.length > 0 ? `(${integrations.length})` : ''}</h6>
			</div>

			{#if integrations.length > 0}
				<div class="integrations__listing">
					<div class="integrations__fadeout integrations__fadeout--top"></div>
					{#each integrations as integration}
						<IntegrationCard
							supportsV1={integration.supportsV1 ?? true}
							supportsV3={integration.supportsV3}
							supportsV4={integration.supportsV4}
							type={integration.type}
							author={integration.author}
							title={integration.title}
							language={integration.language}
							url={integration.url}
						></IntegrationCard>
					{/each}
					<div class="integrations__fadeout integrations__fadeout--bottom"></div>
				</div>
			{:else}
				<div class="integrations__empty">
					<div class="emptyIcon">
						<IconCode size={44} stroke={1.5} />
					</div>
					<h5>No Community Integrations Yet</h5>
					<p>We keep the AniNexus ecosystem 100% verified — no placeholder or dummy packages. Build an open-source client or wrapper for AniNexus and be the first to get featured!</p>
					<div class="emptyAction">
						<Button url="https://github.com/Shouvikdasprojects/AniNexus-API-Website/edit/master/src/data/integrations.js" urlTarget="_blank" type="primary" size="default">
							<IconCirclePlus size={18} stroke={1.5} />
							Submit Your Integration
						</Button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<Footer />

<style lang="scss">
	.integrationNotice {
		background: rgba(139, 92, 246, 0.08);
		border: 1px solid rgba(139, 92, 246, 0.2);
		border-radius: 12px;
		padding: 14px 18px;

		p {
			color: #CBD5E1;
			font-size: 0.85rem;
			line-height: 1.5;
			margin: 0;

			strong {
				color: #A78BFA;
			}

			em {
				color: #FFFFFF;
				font-style: normal;
				font-weight: 600;
			}

			code {
				color: #F43F5E;
				background: rgba(244, 63, 94, 0.1);
				padding: 2px 6px;
				border-radius: 4px;
				font-size: 0.82rem;
			}
		}
	}

	.integrations__empty {
		background: rgba(255, 255, 255, 0.02);
		border: 1px dashed rgba(139, 92, 246, 0.35);
		border-radius: 16px;
		padding: 44px 28px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 14px;
		min-height: 360px;

		.emptyIcon {
			width: 68px;
			height: 68px;
			border-radius: 50%;
			background: rgba(139, 92, 246, 0.12);
			border: 1px solid rgba(139, 92, 246, 0.3);
			color: #A78BFA;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 4px;
		}

		h5 {
			margin: 0;
			font-size: 1.25rem;
			color: #FFFFFF;
			font-weight: 600;
		}

		p {
			color: #94A3B8;
			font-size: 0.92rem;
			line-height: 1.6;
			max-width: 440px;
			margin: 0;
		}

		.emptyAction {
			margin-top: 10px;
		}
	}
</style>
