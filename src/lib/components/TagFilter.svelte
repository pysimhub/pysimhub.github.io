<script lang="ts">
	import { selectedTags, allTags, resetVisible } from '$lib/stores/projects';
	import { Icon } from '$lib/components/icons';
	import { browser } from '$app/environment';

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
	// Fewer tags on smaller screens
	let isCompact = $state(false);
	let showAll = $state(false);

	$effect(() => {
		if (!browser) return;
		const mediaQuery = window.matchMedia('(max-width: 1023px)');
		isCompact = mediaQuery.matches;

		const handler = (e: MediaQueryListEvent) => isCompact = e.matches;
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});

	const maxVisibleTags = $derived(isCompact ? 6 : 15);
	const visibleTags = $derived(showAll ? $allTags : $allTags.slice(0, maxVisibleTags));
	const hasMoreTags = $derived($allTags.length > maxVisibleTags);
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
				<Icon name="chevron-up" size="sm" />
				Show less
			{:else}
				<Icon name="plus" size="sm" />
				{$allTags.length - maxVisibleTags} more
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
				<Icon name="close" size="xs" strokeWidth={2.5} />
			</button>
		{/each}
		<button
			onclick={clearTags}
			class="clear-all-btn"
		>
			<Icon name="trash" size="sm" />
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
		color: var(--color-accent);
		background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
		transition: all 150ms ease;
	}

	.clear-all-btn:hover {
		background-color: color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-color: var(--color-accent);
		transform: translateY(-1px);
	}
</style>
