<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>PySimHub - Python Simulation & Numerics Community</title>

	<!-- Open Graph / Social Media -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="PySimHub" />
	<meta property="og:image" content="https://pysimhub.io/branding/og-image.png" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://pysimhub.io/branding/og-image.png" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1 pt-20">
		{@render children()}
	</main>
	<Footer />
</div>
