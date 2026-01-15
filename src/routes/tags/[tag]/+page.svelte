<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectModal from '$lib/components/ProjectModal.svelte';
	import { activeModalProject, closeProjectModal, selectedTags, resetVisible } from '$lib/stores/projects';

	let { data } = $props();
	const tag = $derived(data.tag);
	const projects = $derived(data.projects);
	const relatedTags = $derived(data.relatedTags);
	const totalProjects = $derived(data.totalProjects);

	// Get related tag names for filtering
	const relatedTagNames = $derived(relatedTags.map((t) => t.tag));

	// Reset global filters when navigating to a different tag
	$effect(() => {
		tag;
		selectedTags.set([]);
	});

	function toggleFilter(filterTag: string) {
		selectedTags.update((tags) => {
			if (tags.includes(filterTag)) {
				return tags.filter((t) => t !== filterTag);
			}
			return [...tags, filterTag];
		});
		resetVisible();
	}

	function clearFilters() {
		selectedTags.set([]);
		resetVisible();
	}

	// Only consider tags that are related to this main tag
	const activeFilters = $derived($selectedTags.filter((t) => relatedTagNames.includes(t)));

	// Filter projects by selected related tags
	const filteredProjects = $derived(
		activeFilters.length === 0
			? projects
			: projects.filter((p) => activeFilters.every((t) => p.tags.includes(t)))
	);
</script>

<svelte:head>
	<title>PySimHub - {tag}</title>
	<meta name="description" content="Discover {projects.length} Python {tag} libraries. Browse simulation and numerics tools for {tag} development." />

	<!-- Open Graph -->
	<meta property="og:title" content="{tag} Python Libraries - PySimHub" />
	<meta property="og:description" content="Discover {projects.length} Python libraries for {tag}. Compare stars, activity, and features." />
	<meta property="og:url" content="https://pysimhub.io/tags/{encodeURIComponent(tag)}" />

	<!-- Twitter -->
	<meta name="twitter:title" content="{tag} Python Libraries - PySimHub" />
	<meta name="twitter:description" content="Discover {projects.length} Python libraries for {tag}." />
</svelte:head>

<div class="px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-5xl">
		<!-- Header -->
		<header class="mb-8">
			<div class="flex items-center gap-3">
				<Icon name="tag" size="lg" class="text-[var(--color-accent)]" />
				<h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">
					{tag}
				</h1>
			</div>
		</header>

		<!-- Tags -->
		<section class="mb-8">
			<div class="flex flex-wrap items-center gap-2">
				{#each relatedTags as { tag: relatedTag }}
					<button
						onclick={() => toggleFilter(relatedTag)}
						class="tag-btn"
						class:active={$selectedTags.includes(relatedTag)}
					>
						{relatedTag}
					</button>
				{/each}
			</div>

			{#if activeFilters.length > 0}
				<div class="mt-3 flex flex-wrap items-center gap-2">
					<span class="text-sm text-[var(--color-text-muted)]">Active filters:</span>
					{#each activeFilters as filterTag}
						<button
							onclick={() => toggleFilter(filterTag)}
							class="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)] hover:scale-105"
						>
							{filterTag}
							<Icon name="close" size="xs" strokeWidth={2.5} />
						</button>
					{/each}
					<button onclick={clearFilters} class="clear-btn">
						<Icon name="trash" size="sm" />
						Clear
					</button>
				</div>
			{/if}
		</section>

		<!-- Projects Grid -->
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-6">
			{#each filteredProjects as project}
				<div class="flex">
					<ProjectCard {project} />
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Modal -->
{#if $activeModalProject}
	<ProjectModal project={$activeModalProject} onclose={closeProjectModal} />
{/if}

<style>
	.tag-btn {
		border: 1px solid transparent;
		border-radius: 9999px;
		padding: 0.375rem 0.875rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 150ms ease;
		background-color: var(--color-bg-card);
		color: var(--color-text-secondary);
		border-color: var(--color-border);
	}

	.tag-btn:not(.active):hover {
		background-color: var(--color-bg-hover);
		color: var(--color-text-primary);
		transform: translateY(-1px);
	}

	.tag-btn.active {
		background-color: var(--color-accent);
		color: white;
	}

	.clear-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		border-radius: 9999px;
		padding: 0.375rem 0.875rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-accent);
		background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
		transition: all 150ms ease;
	}

	.clear-btn:hover {
		background-color: color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-color: var(--color-accent);
		transform: translateY(-1px);
	}
</style>
