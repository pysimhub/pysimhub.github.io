<script lang="ts">
	import Icon from '../icons/Icon.svelte';
	import type { IconName } from '../icons/icons';

	interface Props {
		icon: IconName;
		label: string;
		variant?: 'ghost' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		target?: string;
		rel?: string;
		disabled?: boolean;
		class?: string;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		icon,
		label,
		variant = 'ghost',
		size = 'md',
		href,
		target,
		rel,
		disabled = false,
		class: className = '',
		onclick
	}: Props = $props();

	const baseClasses = 'flex items-center justify-center rounded-lg transition-colors';

	const sizeClasses = {
		sm: 'h-7 w-7',
		md: 'h-9 w-9',
		lg: 'h-11 w-11'
	};

	const iconSizes: Record<string, 'xs' | 'sm' | 'md' | 'lg'> = {
		sm: 'sm',
		md: 'md',
		lg: 'lg'
	};

	const variantClasses = {
		ghost: 'hover:bg-[var(--color-bg-hover)]',
		outline:
			'border border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-hover)]'
	};

	const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

	const classes = $derived(
		`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`
	);
</script>

{#if href && !disabled}
	<a
		{href}
		{target}
		rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
		class={classes}
		aria-label={label}
	>
		<Icon name={icon} size={iconSizes[size]} />
	</a>
{:else}
	<button type="button" {disabled} class={classes} aria-label={label} {onclick}>
		<Icon name={icon} size={iconSizes[size]} />
	</button>
{/if}
