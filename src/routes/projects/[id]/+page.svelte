<script lang="ts">
	import { formatNumber } from '$lib/utils/countup';
	import { formatDate } from '$lib/utils/format';
	import { Icon } from '$lib/components/icons';
	import { Avatar, Badge, Button } from '$lib/components/ui';
	import { marked } from 'marked';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ProjectModal from '$lib/components/ProjectModal.svelte';
	import { activeModalProject, closeProjectModal } from '$lib/stores/projects';

	let { data } = $props();
	const project = $derived(data.project);
	const relatedProjects = $derived(data.relatedProjects);

	// Close modal when navigating to a new project
	$effect(() => {
		project.id;
		closeProjectModal();
	});

	marked.setOptions({
		breaks: true,
		gfm: true
	});

	const descriptionHtml = $derived(project.description ? marked.parse(project.description) : '');
</script>

<svelte:head>
	<title>PySimHub - {project.name}</title>
	<meta name="description" content="{project.tagline} - {project.tags.slice(0, 3).join(', ')} Python library with {formatNumber(project.stars)} stars." />

	<!-- Open Graph -->
	<meta property="og:title" content="{project.name} - PySimHub" />
	<meta property="og:description" content="{project.tagline}" />
	<meta property="og:url" content="https://pysimhub.io/projects/{project.id}" />
	{#if project.avatarUrl}
		<meta property="og:image" content="{project.avatarUrl}" />
	{/if}

	<!-- Twitter -->
	<meta name="twitter:title" content="{project.name} - PySimHub" />
	<meta name="twitter:description" content="{project.tagline}" />

	<!-- Schema.org SoftwareApplication -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": project.name,
		"description": project.tagline,
		"applicationCategory": "DeveloperApplication",
		"operatingSystem": "Cross-platform",
		"url": project.homepage || project.github,
		"codeRepository": project.github,
		...(project.license && { "license": project.license }),
		"aggregateRating": {
			"@type": "AggregateRating",
			"ratingValue": "5",
			"ratingCount": project.stars,
			"bestRating": "5"
		}
	})}</script>`}
</svelte:head>

<div class="px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-5xl">
		<!-- Breadcrumb -->
		<nav class="mb-6 text-sm text-[var(--color-text-muted)]">
			<a href="/" class="hover:text-[var(--color-accent)]">Projects</a>
			<span class="mx-2">/</span>
			<span class="text-[var(--color-text-primary)]">{project.name}</span>
		</nav>

		<!-- Header -->
		<header class="flex flex-col sm:flex-row items-start gap-6">
			<Avatar src={project.avatarUrl} alt="{project.name} logo" fallback={project.name.slice(0, 2)} size="2xl" class="flex-shrink-0" />

			<div class="flex-1">
				<h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">
					{project.name}
				</h1>

				<p class="mt-2 text-lg text-[var(--color-text-secondary)] italic">
					{project.tagline}
				</p>

				<!-- Stats -->
				<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-text-muted)]">
					<span class="flex items-center gap-1.5">
						<Icon name="star" size="sm" />
						<strong class="text-[var(--color-text-primary)]">{formatNumber(project.stars)}</strong> stars
					</span>
					{#if project.forks}
						<span class="flex items-center gap-1.5">
							<Icon name="fork" size="sm" />
							<strong class="text-[var(--color-text-primary)]">{formatNumber(project.forks)}</strong> forks
						</span>
					{/if}
					{#if project.releaseVersion}
						<span class="flex items-center gap-1.5">
							<Icon name="tag" size="sm" />
							{project.releaseVersion}
						</span>
					{/if}
					{#if project.lastRelease}
						<span class="flex items-center gap-1.5">
							<Icon name="calendar" size="sm" />
							{formatDate(project.lastRelease)}
						</span>
					{/if}
					{#if project.license}
						<span class="flex items-center gap-1.5">
							<Icon name="shield" size="sm" />
							{project.license}
						</span>
					{/if}
				</div>
			</div>
		</header>

		<!-- Action Buttons -->
		<div class="mt-8 flex flex-wrap gap-2">
			<Button variant="primary" size="md" href={project.github} target="_blank">
				<Icon name="github" size="sm" />
				View on GitHub
			</Button>

			{#if project.docs}
				<Button variant="secondary" size="md" href={project.docs} target="_blank">
					<Icon name="docs" size="sm" />
					Documentation
				</Button>
			{/if}

			{#if project.pypi}
				<Button variant="secondary" size="md" href={project.pypi} target="_blank">
					<Icon name="package" size="sm" />
					PyPI
				</Button>
			{/if}

			{#if project.homepage}
				<Button variant="secondary" size="md" href={project.homepage} target="_blank">
					<Icon name="globe" size="sm" />
					Website
				</Button>
			{/if}

			{#if project.example}
				<Button variant="secondary" size="md" href={project.example} target="_blank">
					<Icon name="play" size="sm" />
					Demo
				</Button>
			{/if}

			{#if project.condaForge}
				<Button variant="secondary" size="md" href={project.condaForge} target="_blank">
					<Icon name="package" size="sm" />
					conda-forge
				</Button>
			{/if}
		</div>

		<!-- Description -->
		{#if project.description}
			<section class="mt-12">
				<h2 class="text-xl font-semibold text-[var(--color-text-primary)]">About</h2>
				<div class="mt-4 prose prose-lg max-w-none text-[var(--color-text-secondary)]">
					{@html descriptionHtml}
				</div>
			</section>
		{/if}

		<!-- Tags -->
		<section class="mt-12">
			<h2 class="text-xl font-semibold text-[var(--color-text-primary)]">Tags</h2>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each project.tags as tag}
					<a href="/tags/{encodeURIComponent(tag)}">
						<Badge variant="default" size="md" interactive>
							{tag}
						</Badge>
					</a>
				{/each}
			</div>
		</section>

	</div>
</div>

<!-- Related Projects -->
{#if relatedProjects.length > 0}
	<section class="px-4 pb-16 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-5xl">
			<h2 class="text-xl font-semibold text-[var(--color-text-primary)]">Related Projects</h2>
			<p class="mt-1 text-sm text-[var(--color-text-muted)]">Other libraries with similar tags</p>
			<div class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-6">
				{#each relatedProjects as related}
					<div class="flex">
						<ProjectCard project={related} />
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Modal for related projects -->
{#if $activeModalProject}
	<ProjectModal project={$activeModalProject} onclose={closeProjectModal} />
{/if}
