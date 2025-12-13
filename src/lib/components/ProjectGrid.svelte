<script lang="ts">
	import { visibleProjects, hasMore, loadMore, filteredProjects } from '$lib/stores/projects';
	import ProjectCard from './ProjectCard.svelte';
	import { browser } from '$app/environment';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';

	let loadMoreTrigger: HTMLElement | undefined = $state();

	$effect(() => {
		if (!browser || !loadMoreTrigger) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && $hasMore) {
						loadMore();
					}
				});
			},
			{ rootMargin: '200px' }
		);

		observer.observe(loadMoreTrigger);

		return () => observer.disconnect();
	});

	const prefersReducedMotion = browser
		? window.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false;
</script>

{#if $filteredProjects.length === 0}
	<div class="py-16 text-center">
		<svg
			class="mx-auto h-16 w-16 text-[var(--color-text-muted)]"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="1"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<h3 class="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">No projects found</h3>
		<p class="mt-2 text-[var(--color-text-secondary)]">
			Try adjusting your search or filter to find what you're looking for.
		</p>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each $visibleProjects as project (project.id)}
			<div
				class="flex"
				animate:flip={{ duration: prefersReducedMotion ? 0 : 300 }}
				in:fade={{ duration: prefersReducedMotion ? 0 : 200 }}
				out:scale={{ duration: prefersReducedMotion ? 0 : 150, start: 0.95 }}
			>
				<ProjectCard {project} />
			</div>
		{/each}
	</div>

	<!-- Load more trigger -->
	{#if $hasMore}
		<div bind:this={loadMoreTrigger} class="flex justify-center py-8">
			<div class="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]"></div>
		</div>
	{:else if $visibleProjects.length > 0}
		<p class="py-8 text-center text-sm text-[var(--color-text-muted)]">
			Showing all {$filteredProjects.length} projects
		</p>
	{/if}
{/if}
