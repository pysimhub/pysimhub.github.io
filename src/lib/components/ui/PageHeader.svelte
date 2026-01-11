<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		centered?: boolean;
		class?: string;
		actions?: Snippet;
	}

	let {
		title,
		description,
		centered = true,
		class: className = '',
		actions
	}: Props = $props();
</script>

<div class={centered ? 'text-center' : ''}>
	<h1 class="text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl {className}">
		{title}
	</h1>
	{#if description}
		<p class="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
			{description}
		</p>
	{/if}
	{#if actions}
		<div class="mt-6 flex flex-wrap {centered ? 'justify-center' : ''} gap-4">
			{@render actions()}
		</div>
	{/if}
</div>
