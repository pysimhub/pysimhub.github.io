<script lang="ts">
	let { class: className = 'h-8 w-8' }: { class?: string } = $props();
</script>

<svg class={className} viewBox="0 0 32 32" fill="none">
	<circle cx="16" cy="16" r="14" stroke="var(--color-accent)" stroke-width="2.5" />
	<path
		d="M16 16 L21 16 M16 16 L20 20 M16 16 L16 22.4 M16 16 L11 21 M16 16 L8 16 M16 16 L10 10 M16 16 L16 6.7 M16 16 L23 9"
		stroke="var(--color-accent)"
		stroke-width="2"
		stroke-linecap="round"
	/>
</svg>
