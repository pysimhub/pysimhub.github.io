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
	let tagsContainer: HTMLElement | undefined = $state();
	let linksContainer: HTMLElement | undefined = $state();
	let maxVisibleTags = $state(100); // Will be calculated based on space
	let maxVisibleLinks = $state(100); // Will be calculated based on space

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

	// All available links
	const allLinks = $derived([
		{ key: 'github', href: project.github, icon: 'github' as const, label: 'GitHub' },
		project.docs ? { key: 'docs', href: project.docs, icon: 'docs' as const, label: 'Docs' } : null,
		project.pypi ? { key: 'pypi', href: project.pypi, icon: 'package' as const, label: 'PyPI' } : null,
		project.condaForge ? { key: 'conda', href: project.condaForge, icon: 'package' as const, label: 'conda' } : null,
		project.homepage ? { key: 'home', href: project.homepage, icon: 'globe' as const, label: 'Web' } : null,
		project.example ? { key: 'example', href: project.example, icon: 'play' as const, label: 'Demo' } : null,
	].filter(Boolean) as Array<{ key: string; href: string; icon: 'github' | 'docs' | 'package' | 'globe' | 'play'; label: string }>);

	// Calculate visible items for single-line containers (links)
	function calculateVisibleLinks(container: HTMLElement | undefined, setState: (count: number) => void) {
		if (!container) return;

		const items = container.querySelectorAll('[data-link]');
		if (items.length === 0) return;

		const containerRect = container.getBoundingClientRect();
		const containerRight = containerRect.right;
		const moreButtonWidth = 32;
		const gap = 8;

		let visibleCount = 0;
		items.forEach((item, index) => {
			const itemRect = item.getBoundingClientRect();
			const isLast = index === items.length - 1;
			const spaceNeeded = isLast ? 0 : moreButtonWidth + gap;

			if (itemRect.right + spaceNeeded <= containerRight) {
				visibleCount++;
			}
		});

		setState(Math.max(1, visibleCount));
	}

	// Calculate visible items for multi-line containers (tags)
	function calculateVisibleTags(container: HTMLElement | undefined, setState: (count: number) => void) {
		if (!container) return;

		const items = container.querySelectorAll('[data-tag]');
		if (items.length === 0) return;

		const containerRect = container.getBoundingClientRect();
		const containerBottom = containerRect.bottom;

		let visibleCount = 0;
		items.forEach((item) => {
			const itemRect = item.getBoundingClientRect();
			// Item is visible if its bottom is within the container
			if (itemRect.bottom <= containerBottom + 2) { // +2 for tolerance
				visibleCount++;
			}
		});

		setState(Math.max(1, visibleCount));
	}

	// Use effect to calculate on mount and resize
	$effect(() => {
		if (!tagsContainer || !linksContainer) return;

		const calculate = () => {
			calculateVisibleTags(tagsContainer, (count) => maxVisibleTags = count);
			calculateVisibleLinks(linksContainer, (count) => maxVisibleLinks = count);
		};

		// Calculate after a small delay to ensure render is complete
		const timeout = setTimeout(calculate, 10);

		const resizeObserver = new ResizeObserver(() => {
			// Reset to show all, then recalculate
			maxVisibleTags = 100;
			maxVisibleLinks = 100;
			requestAnimationFrame(calculate);
		});

		resizeObserver.observe(tagsContainer);
		resizeObserver.observe(linksContainer);

		return () => {
			clearTimeout(timeout);
			resizeObserver.disconnect();
		};
	});

	const visibleTagCount = $derived(Math.min(maxVisibleTags, project.tags.length));
	const visibleLinkCount = $derived(Math.min(maxVisibleLinks, allLinks.length));
	const hiddenTagCount = $derived(project.tags.length - visibleTagCount);
	const hiddenLinkCount = $derived(allLinks.length - visibleLinkCount);
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
	<div bind:this={tagsContainer} class="mt-3 flex flex-wrap items-start gap-1.5 max-h-[3.5rem] overflow-hidden">
		{#each project.tags.slice(0, visibleTagCount) as tag}
			<Badge data-tag variant="default" size="sm" interactive class="whitespace-nowrap" onclick={(e) => filterByTag(tag, e)}>
				{tag}
			</Badge>
		{/each}
		{#if hiddenTagCount > 0}
			<Badge variant="accent" size="sm" class="whitespace-nowrap">
				+{hiddenTagCount}
			</Badge>
		{/if}
	</div>

	<!-- Spacer -->
	<div class="flex-1"></div>

	<!-- Action Links -->
	<div bind:this={linksContainer} class="mt-4 flex flex-nowrap items-center gap-2 overflow-hidden">
		{#each allLinks.slice(0, visibleLinkCount) as link (link.key)}
			<a
				data-link
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
			>
				<Icon name={link.icon} size="sm" />
				{link.label}
			</a>
		{/each}
		{#if hiddenLinkCount > 0}
			<Badge variant="accent" size="sm" rounded="md" class="flex-shrink-0 whitespace-nowrap">
				+{hiddenLinkCount}
			</Badge>
		{/if}
	</div>
</article>

{#if showModal}
	<ProjectModal {project} onclose={() => showModal = false} />
{/if}
