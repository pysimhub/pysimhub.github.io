<script lang="ts">
	import { searchQuery, resetVisible } from '$lib/stores/projects';
	import { debounce } from '$lib/utils/search';

	let inputValue = $state('');

	const updateSearch = debounce((value: string) => {
		searchQuery.set(value);
		resetVisible();
	}, 200);

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;
		updateSearch(inputValue);
	}

	function clearSearch() {
		inputValue = '';
		searchQuery.set('');
		resetVisible();
	}
</script>

<div class="relative">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
		<svg
			class="h-5 w-5 text-[var(--color-text-muted)]"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
	</div>
	<input
		type="text"
		placeholder="Search projects by name or tags..."
		value={inputValue}
		oninput={handleInput}
		class="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] py-3 pl-12 pr-10 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
	/>
	{#if inputValue}
		<button
			onclick={clearSearch}
			class="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
			aria-label="Clear search"
		>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{/if}
</div>

