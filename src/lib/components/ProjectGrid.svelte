<script lang="ts">
	import { visibleProjects, hasMore, loadMore, filteredProjects, activeModalProject, closeProjectModal } from '$lib/stores/projects';
	import ProjectCard from './ProjectCard.svelte';
	import ProjectModal from './ProjectModal.svelte';
	import { browser } from '$app/environment';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { prefersReducedMotion } from '$lib/utils/accessibility';
	import { EmptyState } from '$lib/components/ui';

	let loadMoreTrigger: HTMLElement | undefined = $state();

	$effect(() => {
		if (!browser || !loadMoreTrigger) return;

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
</script>

{#if $filteredProjects.length === 0}
	<EmptyState
		icon="sad-face"
		title="No projects found"
		description="Try adjusting your search or filter to find what you're looking for."
	/>
{:else}
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each $visibleProjects as project (project.id)}
			<div
				class="flex"
				animate:flip={{ duration: $prefersReducedMotion ? 0 : 300 }}
				in:fade={{ duration: $prefersReducedMotion ? 0 : 200 }}
				out:scale={{ duration: $prefersReducedMotion ? 0 : 150, start: 0.95 }}
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

<!-- Modal rendered at grid level to survive card re-renders -->
{#if $activeModalProject}
	<ProjectModal project={$activeModalProject} onclose={closeProjectModal} />
{/if}
