<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { formatNumber } from '$lib/utils/countup';
	import { selectedTags, resetVisible } from '$lib/stores/projects';
	import { formatDate, isRecentDate } from '$lib/utils/format';
	import { Icon } from '$lib/components/icons';
	import { Avatar, Badge } from '$lib/components/ui';
	import ProjectModal from './ProjectModal.svelte';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
	let showModal = $state(false);

	function filterByTag(tag: string, e: MouseEvent) {
		e.stopPropagation();
		selectedTags.update((tags) => {
			if (!tags.includes(tag)) {
				return [...tags, tag];
			}
			return tags;
		});
		resetVisible();
	}

	function openModal(e: MouseEvent) {
		// Don't open if clicking a link or button inside
		const target = e.target as HTMLElement;
		if (target.closest('a') || target.closest('button')) return;
		showModal = true;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			showModal = true;
		}
	}

	const hasRecentRelease = $derived(isRecentDate(project.lastRelease, 30));

	// Count additional links not shown on card (pypi, condaForge, homepage, example)
	const extraLinksCount = $derived(
		(project.pypi ? 1 : 0) +
		(project.condaForge ? 1 : 0) +
		(project.homepage ? 1 : 0) +
		(project.example ? 1 : 0)
	);
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<article
	onclick={openModal}
	onkeydown={handleKeydown}
	class="card-glow group relative flex h-full w-full flex-col rounded-xl border bg-[var(--color-bg-card)] p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg {hasRecentRelease
		? 'border-[var(--color-accent)]/50 hover:border-[var(--color-accent)]'
		: 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'}"
	role="button"
	tabindex="0"
	aria-haspopup="dialog"
>
	<!-- New Release Badge -->
	{#if hasRecentRelease}
		<Badge variant="accent" size="sm" rounded="md" class="absolute top-2 right-2 text-[10px]">
			New Release
		</Badge>
	{/if}

	<!-- Logo and Name -->
	<div class="flex items-start gap-3">
		<Avatar src={project.avatarUrl} alt="{project.name} logo" fallback={project.name.slice(0, 2)} size="md" />
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
				{project.name}
			</h3>
			<!-- Stats Row -->
			<div class="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
				<span class="flex items-center gap-1">
					<Icon name="star" size="xs" class="h-3.5 w-3.5" />
					{formatNumber(project.stars)}
				</span>
				{#if project.lastRelease}
					<span class="flex items-center gap-1">
						<Icon name="calendar" size="xs" class="h-3.5 w-3.5" />
						{formatDate(project.lastRelease, 'short')}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Tagline -->
	<p class="mt-3 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
		{project.tagline}
	</p>

	<!-- Tags -->
	<div class="mt-3 flex flex-wrap gap-1">
		{#each project.tags.slice(0, 4) as tag}
			<Badge variant="muted" size="sm" rounded="md" interactive onclick={(e) => filterByTag(tag, e)}>
				{tag}
			</Badge>
		{/each}
		{#if project.tags.length > 4}
			<Badge variant="accent" size="sm" rounded="md">
				+{project.tags.length - 4}
			</Badge>
		{/if}
	</div>

	<!-- Spacer -->
	<div class="flex-1"></div>

	<!-- Action Links -->
	<div class="mt-4 flex flex-wrap gap-2">
		<a
			href={project.github}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
		>
			<Icon name="github" size="sm" />
			GitHub
		</a>
		{#if project.docs}
			<a
				href={project.docs}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
			>
				<Icon name="docs" size="sm" />
				Docs
			</a>
		{/if}
		{#if extraLinksCount > 0}
			<Badge variant="accent" size="sm" rounded="md">
				+{extraLinksCount}
			</Badge>
		{/if}
	</div>
</article>

{#if showModal}
	<ProjectModal {project} onclose={() => showModal = false} />
{/if}
