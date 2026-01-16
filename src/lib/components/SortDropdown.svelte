<script lang="ts">
	import { sortOption, sortDirection, resetVisible } from '$lib/stores/projects';
	import { SORT_OPTIONS, type SortOption } from '$lib/types/project';
	import { Icon } from '$lib/components/icons';
	import { Tooltip } from '$lib/components/ui';

	let isOpen = $state(false);

	const currentSort = $derived(SORT_OPTIONS.find((s) => s.id === $sortOption) || SORT_OPTIONS[0]);
	const displayName = $derived(
		currentSort.supportsDirection && $sortDirection === 'asc' && currentSort.reverseName
			? currentSort.reverseName
			: currentSort.name
	);

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectSort(option: SortOption) {
		sortOption.set(option);
		// Reset to default direction (desc) when changing sort type
		sortDirection.set('desc');
		resetVisible();
		isOpen = false;
	}

	function toggleDirection() {
		sortDirection.update((d) => (d === 'desc' ? 'asc' : 'desc'));
		resetVisible();
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.sort-dropdown')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="sort-dropdown relative flex items-center gap-1">
	<button
		onclick={toggleDropdown}
		class="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-hover)]"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<Icon name="sort" size="sm" class="text-[var(--color-text-muted)]" />
		{displayName}
		<Icon
			name="chevron-down"
			size="sm"
			class="transition-transform {isOpen ? 'rotate-180' : ''}"
		/>
	</button>

	<!-- Direction toggle button -->
	{#if currentSort.supportsDirection}
		<Tooltip text={$sortDirection === 'desc' ? 'Switch to ascending' : 'Switch to descending'}>
			<button
				onclick={toggleDirection}
				class="flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-2 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
				aria-label={$sortDirection === 'desc' ? 'Switch to ascending order' : 'Switch to descending order'}
			>
				<Icon name={$sortDirection === 'desc' ? 'chevron-down' : 'chevron-up'} size="sm" />
			</button>
		</Tooltip>
	{/if}

	{#if isOpen}
		<ul
			class="absolute right-0 top-full z-20 mt-2 min-w-[150px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1 shadow-lg"
			role="listbox"
		>
			{#each SORT_OPTIONS as option}
				<li>
					<button
						onclick={() => selectSort(option.id)}
						class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--color-bg-hover)]"
						class:active={$sortOption === option.id}
						role="option"
						aria-selected={$sortOption === option.id}
					>
						{#if $sortOption === option.id}
							<Icon name="check" size="sm" class="text-[var(--color-accent)]" />
						{:else}
							<span class="w-4"></span>
						{/if}
						{option.name}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	button.active {
		color: var(--color-accent);
	}
</style>
