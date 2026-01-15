<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import { Badge } from '$lib/components/ui';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectModal from '$lib/components/ProjectModal.svelte';
	import { activeModalProject, closeProjectModal } from '$lib/stores/projects';

	let { data } = $props();
	const { tag, projects, relatedTags, totalProjects } = data;
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
	<div class="mx-auto max-w-7xl">
		<!-- Breadcrumb -->
		<nav class="mb-6 text-sm text-[var(--color-text-muted)]">
			<a href="/" class="hover:text-[var(--color-accent)]">Projects</a>
			<span class="mx-2">/</span>
			<a href="/" class="hover:text-[var(--color-accent)]">Tags</a>
			<span class="mx-2">/</span>
			<span class="text-[var(--color-text-primary)]">{tag}</span>
		</nav>

		<!-- Header -->
		<header class="mb-8">
			<div class="flex items-center gap-3">
				<Icon name="tag" size="lg" class="text-[var(--color-accent)]" />
				<h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">
					{tag}
				</h1>
			</div>
			<p class="mt-3 text-lg text-[var(--color-text-secondary)]">
				{projects.length} Python {projects.length === 1 ? 'library' : 'libraries'} for {tag}
			</p>
		</header>

		<div class="flex flex-col lg:flex-row gap-8">
			<!-- Main Content -->
			<div class="flex-1">
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
					{#each projects as project}
						<div class="flex">
							<ProjectCard {project} />
						</div>
					{/each}
				</div>
			</div>

			<!-- Sidebar -->
			<aside class="lg:w-64 flex-shrink-0">
				{#if relatedTags.length > 0}
					<div class="sticky top-24">
						<h2 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
							Related Tags
						</h2>
						<div class="mt-3 flex flex-wrap gap-2">
							{#each relatedTags as { tag: relatedTag, count }}
								<a href="/tags/{encodeURIComponent(relatedTag)}">
									<Badge variant="default" size="sm" interactive>
										{relatedTag}
										<span class="ml-1 text-[var(--color-text-muted)]">({count})</span>
									</Badge>
								</a>
							{/each}
						</div>

						<div class="mt-8 pt-6 border-t border-[var(--color-border)]">
							<a href="/" class="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:underline">
								<Icon name="arrow-right" size="sm" class="rotate-180" />
								Browse all {totalProjects} projects
							</a>
						</div>
					</div>
				{/if}
			</aside>
		</div>
	</div>
</div>

<!-- Modal -->
{#if $activeModalProject}
	<ProjectModal project={$activeModalProject} onclose={closeProjectModal} />
{/if}
