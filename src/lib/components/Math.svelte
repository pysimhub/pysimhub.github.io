<script lang="ts">
	import { onMount } from 'svelte';
	import katex from 'katex';

	interface Props {
		d?: boolean;
		f: string;
	}

	let { d = false, f }: Props = $props();
	let element: HTMLElement | undefined = $state();

	onMount(() => {
		if (element && f) {
			katex.render(f, element, {
				displayMode: d,
				throwOnError: false
			});
		}
	});
</script>

{#if d}
	<div class="katex-display" bind:this={element}></div>
{:else}
	<span bind:this={element}></span>
{/if}
