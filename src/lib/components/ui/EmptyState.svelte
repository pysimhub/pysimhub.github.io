<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '../icons/Icon.svelte';
	import type { IconName } from '../icons/icons';

	interface Props {
		icon?: IconName;
		title: string;
		description?: string;
		class?: string;
		actions?: Snippet;
	}

	let {
		icon = 'sad-face',
		title,
		description,
		class: className = '',
		actions
	}: Props = $props();
</script>

<div class="py-16 text-center {className}">
	<Icon
		name={icon}
		class="mx-auto h-16 w-16 text-[var(--color-text-muted)]"
		strokeWidth={1}
	/>
	<h3 class="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
		{title}
	</h3>
	{#if description}
		<p class="mt-2 text-[var(--color-text-secondary)]">
			{description}
		</p>
	{/if}
	{#if actions}
		<div class="mt-4">
			{@render actions()}
		</div>
	{/if}
</div>
