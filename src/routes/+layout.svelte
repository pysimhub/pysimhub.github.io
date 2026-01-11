<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>PySimHub</title>

	<!-- Open Graph / Social Media -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="PySimHub" />
	<meta property="og:image" content="https://pysimhub.io/branding/og-image.png" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://pysimhub.io/branding/og-image.png" />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Organization",
				"@id": "https://pysimhub.io/#organization",
				"name": "PySimHub",
				"url": "https://pysimhub.io",
				"logo": {
					"@type": "ImageObject",
					"url": "https://pysimhub.io/branding/og-image.png"
				},
				"sameAs": [
					"https://github.com/pysimhub"
				]
			},
			{
				"@type": "WebSite",
				"@id": "https://pysimhub.io/#website",
				"url": "https://pysimhub.io",
				"name": "PySimHub",
				"description": "Community hub for Python simulation and numerics tools. Discover robotics, fluid dynamics, discrete-event, agent-based, and more simulation libraries.",
				"publisher": {
					"@id": "https://pysimhub.io/#organization"
				}
			}
		]
	}
	</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1 pt-20">
		{@render children()}
	</main>
	<Footer />
</div>
