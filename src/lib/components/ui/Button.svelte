<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		target?: string;
		rel?: string;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		target,
		rel,
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-lg';

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const variantClasses = {
		primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
		secondary:
			'bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-white',
		outline:
			'border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-hover)]',
		ghost: 'text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
	};

	const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

	const classes = $derived(
		`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`
	);
</script>

{#if href && !disabled}
	<a {href} {target} rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)} class={classes}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} class={classes} {onclick}>
		{@render children()}
	</button>
{/if}
