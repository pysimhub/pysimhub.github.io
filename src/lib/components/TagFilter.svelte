<script lang="ts">
	import { selectedTags, allTags, resetVisible } from '$lib/stores/projects';

	function toggleTag(tag: string) {
		selectedTags.update((tags) => {
			if (tags.includes(tag)) {
				return tags.filter((t) => t !== tag);
			} else {
				return [...tags, tag];
			}
		});
		resetVisible();
	}

	function clearTags() {
		selectedTags.set([]);
		resetVisible();
	}

	// Show top tags first (by frequency), limit display
	const MAX_VISIBLE_TAGS = 15;
	let showAll = $state(false);

	const visibleTags = $derived(showAll ? $allTags : $allTags.slice(0, MAX_VISIBLE_TAGS));
	const hasMoreTags = $derived($allTags.length > MAX_VISIBLE_TAGS);
</script>

<div class="flex flex-wrap items-center gap-2">
	<button
		onclick={clearTags}
		class="tag-btn"
		class:active={$selectedTags.length === 0}
	>
		All
	</button>
	{#each visibleTags as tag}
		<button
			onclick={() => toggleTag(tag)}
			class="tag-btn"
			class:active={$selectedTags.includes(tag)}
		>
			{tag}
		</button>
	{/each}
	{#if hasMoreTags}
		<button
			onclick={() => (showAll = !showAll)}
			class="show-more-btn"
		>
			{#if showAll}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
				</svg>
				Show less
			{:else}
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
				</svg>
				{$allTags.length - MAX_VISIBLE_TAGS} more
			{/if}
		</button>
	{/if}
</div>

{#if $selectedTags.length > 0}
	<div class="mt-3 flex flex-wrap items-center gap-2">
		<span class="text-sm text-[var(--color-text-muted)]">Active filters:</span>
		{#each $selectedTags as tag}
			<button
				onclick={() => toggleTag(tag)}
				class="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-3 py-1 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)] hover:scale-105"
			>
				{tag}
				<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/each}
		<button
			onclick={clearTags}
			class="clear-all-btn"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
			</svg>
			Clear all
		</button>
	</div>
{/if}

<style>
	.tag-btn {
		border: 1px solid transparent;
		border-radius: 9999px;
		padding: 0.375rem 0.875rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 150ms ease;
	}

	.tag-btn:not(.active) {
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

	.show-more-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		border-radius: 9999px;
		padding: 0.375rem 0.875rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-accent);
		background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
		border: 1px dashed var(--color-accent);
		transition: all 150ms ease;
	}

	.show-more-btn:hover {
		background-color: color-mix(in srgb, var(--color-accent) 20%, transparent);
		transform: translateY(-1px);
	}

	.clear-all-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		border-radius: 9999px;
		padding: 0.375rem 0.875rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: #ef4444;
		background-color: color-mix(in srgb, #ef4444 10%, transparent);
		border: 1px solid color-mix(in srgb, #ef4444 30%, transparent);
		transition: all 150ms ease;
	}

	.clear-all-btn:hover {
		background-color: color-mix(in srgb, #ef4444 20%, transparent);
		border-color: #ef4444;
		transform: translateY(-1px);
	}
</style>
