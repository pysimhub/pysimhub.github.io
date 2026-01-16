<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text: string;
		position?: 'top' | 'bottom' | 'left' | 'right';
		children: Snippet;
	}

	let { text, position = 'top', children }: Props = $props();
</script>

<div class="tooltip-wrapper group relative inline-flex">
	{@render children()}
	<div
		class="tooltip pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-[var(--color-bg-card)] border border-[var(--color-border)] px-2 py-1 text-xs font-medium text-[var(--color-text-primary)] opacity-0 shadow-lg transition-opacity duration-150 delay-0 group-hover:opacity-100 group-hover:delay-[400ms]
		{position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
		{position === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
		{position === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
		{position === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}"
		role="tooltip"
	>
		{text}
		<!-- Arrow -->
		<div
			class="absolute h-2 w-2 rotate-45 bg-[var(--color-bg-card)] border-[var(--color-border)]
			{position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-b border-r' : ''}
			{position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-t border-l' : ''}
			{position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-t border-r' : ''}
			{position === 'right' ? 'right-full top-1/2 -translate-y-1/2 translate-x-1/2 border-b border-l' : ''}"
		></div>
	</div>
</div>
