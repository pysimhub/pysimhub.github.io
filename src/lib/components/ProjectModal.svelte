<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { formatNumber } from '$lib/utils/countup';
	import { selectedTags, resetVisible } from '$lib/stores/projects';
	import { formatDate } from '$lib/utils/format';
	import { fade, scale } from 'svelte/transition';
	import { Icon } from '$lib/components/icons';
	import { Avatar, Badge, Button } from '$lib/components/ui';

	interface Props {
		project: Project;
		onclose: () => void;
	}

	let { project, onclose }: Props = $props();

	function filterByTag(tag: string) {
		selectedTags.update((tags) => {
			if (!tags.includes(tag)) {
				return [...tags, tag];
			}
			return tags;
		});
		resetVisible();
		onclose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onclose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
	onclick={handleBackdropClick}
	transition:fade={{ duration: 200 }}
>
	<div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

	<!-- Modal -->
	<div
		class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-2xl"
		transition:scale={{ duration: 200, start: 0.95 }}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Header -->
		<div class="sticky top-0 z-10 flex items-start gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
			<Avatar src={project.avatarUrl} alt="{project.name} logo" fallback={project.name.slice(0, 2)} size="lg" />

			<div class="min-w-0 flex-1">
				<h2 id="modal-title" class="text-2xl font-bold text-[var(--color-text-primary)]">
					{project.name}
				</h2>
				<!-- Stats Row - below name like card, but with more stats -->
				<div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-muted)]">
					<span class="flex items-center gap-1">
						<Icon name="star" size="sm" />
						{formatNumber(project.stars)}
					</span>
					{#if project.forks}
						<span class="flex items-center gap-1">
							<Icon name="fork" size="sm" />
							{formatNumber(project.forks)}
						</span>
					{/if}
					{#if project.releaseVersion}
						<span class="flex items-center gap-1">
							<Icon name="tag" size="sm" />
							{project.releaseVersion}
						</span>
					{/if}
					{#if project.lastRelease}
						<span class="flex items-center gap-1">
							<Icon name="calendar" size="sm" />
							{formatDate(project.lastRelease)}
						</span>
					{/if}
					{#if project.license}
						<span class="flex items-center gap-1">
							<Icon name="shield" size="sm" />
							{project.license}
						</span>
					{/if}
				</div>
			</div>

			<button
				onclick={onclose}
				class="flex-shrink-0 rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
				aria-label="Close modal"
			>
				<Icon name="close" size="lg" />
			</button>
		</div>

		<!-- Content -->
		<div class="p-6 space-y-6">
			<!-- Tagline -->
			<p class="text-[var(--color-text-secondary)] italic">
				{project.tagline}
			</p>

			<!-- About Section -->
			{#if project.description}
				<div>
					<h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">About</h3>
					<p class="mt-2 text-[var(--color-text-secondary)] leading-relaxed">
						{project.description}
					</p>
				</div>
			{/if}

			<!-- Tags -->
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Tags</h3>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each project.tags as tag}
						<Badge variant="default" size="md" interactive onclick={() => filterByTag(tag)}>
							{tag}
						</Badge>
					{/each}
				</div>
			</div>

			<!-- Links -->
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Links</h3>
				<div class="mt-2 flex flex-wrap gap-2">
					<Button variant="secondary" size="sm" href={project.github} target="_blank">
						<Icon name="github" size="sm" />
						GitHub
					</Button>

					{#if project.docs}
						<Button variant="secondary" size="sm" href={project.docs} target="_blank">
							<Icon name="docs" size="sm" />
							Docs
						</Button>
					{/if}

					{#if project.pypi}
						<Button variant="secondary" size="sm" href={project.pypi} target="_blank">
							<Icon name="package" size="sm" />
							PyPI
						</Button>
					{/if}

					{#if project.condaForge}
						<Button variant="secondary" size="sm" href={project.condaForge} target="_blank">
							<Icon name="package" size="sm" />
							conda-forge
						</Button>
					{/if}

					{#if project.homepage}
						<Button variant="secondary" size="sm" href={project.homepage} target="_blank">
							<Icon name="globe" size="sm" />
							Website
						</Button>
					{/if}

					{#if project.example}
						<Button variant="secondary" size="sm" href={project.example} target="_blank">
							<Icon name="play" size="sm" />
							Example
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
