<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'accent' | 'muted' | 'success' | 'danger';
		size?: 'sm' | 'md';
		rounded?: 'md' | 'full';
		interactive?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'default',
		size = 'sm',
		rounded = 'full',
		interactive = false,
		class: className = '',
		onclick,
		children
	}: Props = $props();

	const baseClasses = 'inline-flex items-center font-medium transition-colors';

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-3 py-1.5 text-sm'
	};

	const roundedClasses = {
		md: 'rounded-md',
		full: 'rounded-full'
	};

	const variantClasses = {
		default:
			'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
		accent: 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]',
		muted: 'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)]',
		success: 'bg-emerald-500/10 text-emerald-500',
		danger: 'bg-red-500/10 text-red-500'
	};

	const interactiveClasses = {
		default: 'hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-border-hover)]',
		accent: 'hover:bg-[var(--color-accent)]/20',
		muted: 'hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-accent)]',
		success: 'hover:bg-emerald-500/20',
		danger: 'hover:bg-red-500/20'
	};

	const classes = $derived(
		`${baseClasses} ${sizeClasses[size]} ${roundedClasses[rounded]} ${variantClasses[variant]} ${interactive ? interactiveClasses[variant] : ''} ${className}`
	);
</script>

{#if onclick || interactive}
	<button type="button" class={classes} {onclick}>
		{@render children()}
	</button>
{:else}
	<span class={classes}>
		{@render children()}
	</span>
{/if}
