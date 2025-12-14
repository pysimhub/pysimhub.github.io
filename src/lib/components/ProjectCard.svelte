<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { formatNumber } from '$lib/utils/countup';
	import { selectedTags, resetVisible } from '$lib/stores/projects';
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

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

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
	class="card-glow group relative flex h-full w-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[var(--color-border-hover)] hover:shadow-lg"
	role="button"
	tabindex="0"
	aria-haspopup="dialog"
>
	<!-- Logo and Name -->
	<div class="flex items-start gap-3">
		{#if project.avatarUrl}
			<img
				src={project.avatarUrl}
				alt="{project.name} logo"
				class="h-12 w-12 flex-shrink-0 rounded-lg object-cover bg-[var(--color-bg-hover)]"
				loading="lazy"
				onerror={(e) => {
					const target = e.currentTarget as HTMLImageElement;
					target.style.display = 'none';
					const fallback = target.nextElementSibling as HTMLElement;
					if (fallback) fallback.style.display = 'flex';
				}}
			/>
			<div
				class="hidden h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-lg font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
			>
				{project.name.slice(0, 2)}
			</div>
		{:else}
			<div
				class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-lg font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
			>
				{project.name.slice(0, 2)}
			</div>
		{/if}
		<div class="min-w-0 flex-1">
			<h3 class="truncate text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
				{project.name}
			</h3>
			<!-- Stats Row -->
			<div class="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
				<span class="flex items-center gap-1">
					<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					{formatNumber(project.stars)}
				</span>
				{#if project.lastRelease}
					<span class="flex items-center gap-1">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						{formatDate(project.lastRelease)}
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
			<button
				onclick={(e) => filterByTag(tag, e)}
				class="rounded-md bg-[var(--color-bg-hover)] px-2 py-0.5 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)]"
			>
				{tag}
			</button>
		{/each}
		{#if project.tags.length > 4}
			<span class="rounded-md bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-accent)]">
				+{project.tags.length - 4}
			</span>
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
			<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
				<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
			</svg>
			GitHub
		</a>
		{#if project.docs}
			<a
				href={project.docs}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				Docs
			</a>
		{/if}
		{#if extraLinksCount > 0}
			<span class="inline-flex items-center rounded-lg bg-[var(--color-accent)]/10 px-2.5 py-1.5 text-xs font-medium text-[var(--color-accent)]">
				+{extraLinksCount}
			</span>
		{/if}
	</div>
</article>

{#if showModal}
	<ProjectModal {project} onclose={() => showModal = false} />
{/if}
