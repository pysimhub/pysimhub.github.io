<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		date: string;
		author?: string;
		tags?: string[];
		readingTime?: string;
		description?: string;
		children: Snippet;
	}

	let { title, date, author = 'PySimHub Team', tags = [], readingTime, description, children }: Props = $props();

	const formattedDate = $derived(
		new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<svelte:head>
	<title>{title} - PySimHub Blog</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	<!-- KaTeX CSS for math rendering -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
</svelte:head>

<article class="px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-3xl">
		<!-- Header -->
		<header class="mb-12 text-center">
			{#if tags.length > 0}
				<div class="mb-4 flex flex-wrap justify-center gap-2">
					{#each tags as tag}
						<span class="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-sm text-[var(--color-accent)]">
							{tag}
						</span>
					{/each}
				</div>
			{/if}
			<h1 class="text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
				{title}
			</h1>
			<div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--color-text-muted)]">
				<span class="flex items-center gap-1">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
					{author}
				</span>
				<span class="flex items-center gap-1">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					{formattedDate}
				</span>
				{#if readingTime}
					<span class="flex items-center gap-1">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						{readingTime}
					</span>
				{/if}
			</div>
		</header>

		<!-- Content -->
		<div class="prose">
			{@render children()}
		</div>

		<!-- Footer -->
		<footer class="mt-16 border-t border-[var(--color-border)] pt-8">
			<a
				href="/blog"
				class="flex items-center gap-2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to Blog
			</a>
		</footer>
	</div>
</article>
