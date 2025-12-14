<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { formatNumber } from '$lib/utils/countup';
	import { selectedTags, resetVisible } from '$lib/stores/projects';
	import { fade, scale } from 'svelte/transition';

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

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
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
			{#if project.avatarUrl}
				<img
					src={project.avatarUrl}
					alt="{project.name} logo"
					class="h-16 w-16 flex-shrink-0 rounded-xl object-cover bg-[var(--color-bg-hover)]"
					onerror={(e) => {
						const target = e.currentTarget as HTMLImageElement;
						target.style.display = 'none';
						const fallback = target.nextElementSibling as HTMLElement;
						if (fallback) fallback.style.display = 'flex';
					}}
				/>
				<div
					class="hidden h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl text-2xl font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
				>
					{project.name.slice(0, 2)}
				</div>
			{:else}
				<div
					class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl text-2xl font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
				>
					{project.name.slice(0, 2)}
				</div>
			{/if}

			<div class="min-w-0 flex-1">
				<h2 id="modal-title" class="text-2xl font-bold text-[var(--color-text-primary)]">
					{project.name}
				</h2>
				<!-- Stats Row - below name like card, but with more stats -->
				<div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-muted)]">
					<span class="flex items-center gap-1">
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
						{formatNumber(project.stars)}
					</span>
					{#if project.forks}
						<span class="flex items-center gap-1">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
							</svg>
							{formatNumber(project.forks)}
						</span>
					{/if}
					{#if project.releaseVersion}
						<span class="flex items-center gap-1">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
							</svg>
							{project.releaseVersion}
						</span>
					{/if}
					{#if project.lastRelease}
						<span class="flex items-center gap-1">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							{formatDate(project.lastRelease)}
						</span>
					{/if}
					{#if project.license}
						<span class="flex items-center gap-1">
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
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
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
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
						<button
							onclick={() => filterByTag(tag)}
							class="rounded-full bg-[var(--color-bg-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)]"
						>
							{tag}
						</button>
					{/each}
				</div>
			</div>

			<!-- Links -->
			<div>
				<h3 class="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Links</h3>
				<div class="mt-2 flex flex-wrap gap-2">
					<a
						href={project.github}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
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
							class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
							</svg>
							Docs
						</a>
					{/if}

					{#if project.pypi}
						<a
							href={project.pypi}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12.042 0c-1.04.03-2.032.223-2.89.543-2.166.81-2.556 2.005-2.556 3.424v2.51h5.112v.837H4.56c-1.477 0-2.77.89-3.173 2.58-.465 1.938-.486 3.148 0 5.172.36 1.506 1.22 2.58 2.698 2.58h1.745v-2.326c0-1.677 1.45-3.158 3.172-3.158h5.112c1.413 0 2.556-1.164 2.556-2.58V3.967c0-1.38-1.16-2.418-2.556-2.73-.882-.197-1.803-.25-2.072-.237zm-2.89 1.996c.523 0 .948.436.948.972s-.425.972-.948.972-.948-.436-.948-.972.425-.972.948-.972z"/>
								<path d="M18.57 6.514v2.264c0 1.748-1.48 3.22-3.173 3.22h-5.112c-1.39 0-2.556 1.19-2.556 2.58v4.84c0 1.38 1.198 2.19 2.556 2.58 1.624.466 3.183.55 5.112 0 1.282-.367 2.556-1.105 2.556-2.58v-1.936h-5.112v-.647h7.668c1.478 0 2.028-1.03 2.556-2.58.546-1.596.523-3.13 0-5.17-.375-1.467-1.092-2.58-2.556-2.58l-1.94.01zm-2.89 12.244c.523 0 .948.436.948.972s-.425.972-.948.972-.948-.436-.948-.972.425-.972.948-.972z"/>
							</svg>
							PyPI
						</a>
					{/if}

					{#if project.condaForge}
						<a
							href={project.condaForge}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c5.423 0 9.818 4.395 9.818 9.818S17.423 21.818 12 21.818 2.182 17.423 2.182 12 6.577 2.182 12 2.182zm-2.863 4.91c-1.591.204-2.952 1.09-3.672 2.462-.318.607-.496 1.272-.547 1.972-.102 1.396.352 2.776 1.243 3.81.891 1.035 2.163 1.69 3.534 1.81.686.06 1.376-.01 2.03-.205.653-.196 1.257-.51 1.773-.922.516-.413.937-.922 1.23-1.498.295-.577.455-1.213.467-1.86.012-.646-.123-1.287-.392-1.875-.27-.587-.666-1.107-1.159-1.52-.493-.413-1.073-.712-1.695-.873a5.12 5.12 0 00-1.897-.15 4.88 4.88 0 00-.915.849z"/>
							</svg>
							conda-forge
						</a>
					{/if}

					{#if project.homepage}
						<a
							href={project.homepage}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
							</svg>
							Website
						</a>
					{/if}

					{#if project.example}
						<a
							href={project.example}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-bg-hover)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
						>
							<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Example
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
