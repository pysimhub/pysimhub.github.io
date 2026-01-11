<script lang="ts">
	import { searchQuery, resetVisible } from '$lib/stores/projects';
	import { debounce } from '$lib/utils/search';
	import { Icon } from '$lib/components/icons';

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
		<Icon name="search" class="text-[var(--color-text-muted)]" />
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
			<Icon name="close" />
		</button>
	{/if}
</div>

