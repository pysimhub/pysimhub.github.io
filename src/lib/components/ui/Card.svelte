<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'interactive';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		class?: string;
		children: Snippet;
	}

	let { variant = 'default', padding = 'md', class: className = '', children }: Props = $props();

	const baseClasses = 'rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]';

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-5',
		lg: 'p-6'
	};

	const variantClasses = {
		default: '',
		interactive:
			'cursor-pointer transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-lg hover:-translate-y-1'
	};

	const classes = $derived(
		`${baseClasses} ${paddingClasses[padding]} ${variantClasses[variant]} ${className}`
	);
</script>

<div class={classes}>
	{@render children()}
</div>
