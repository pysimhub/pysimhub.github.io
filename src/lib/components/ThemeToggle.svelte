<script lang="ts">
	import { theme } from '$lib/stores/theme';

	function toggle() {
		theme.toggle();
	}
</script>

<button
	onclick={toggle}
	class="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-bg-hover)]"
	aria-label={$theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if $theme === 'dark'}
		<!-- Sun icon -->
		<svg
			class="h-5 w-5 text-[var(--color-text-secondary)] transition-transform hover:text-[var(--color-text-primary)]"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
	{:else}
		<!-- Moon icon -->
		<svg
			class="h-5 w-5 text-[var(--color-text-secondary)] transition-transform hover:text-[var(--color-text-primary)]"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	{/if}
</button>
