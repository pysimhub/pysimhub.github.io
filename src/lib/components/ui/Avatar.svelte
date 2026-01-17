<script lang="ts">
	interface Props {
		src?: string;
		alt: string;
		fallback?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		class?: string;
	}

	let { src, alt, fallback, size = 'md', class: className = '' }: Props = $props();

	let imageError = $state(false);

	// Reset error state when src changes
	$effect(() => {
		src; // Track src changes
		imageError = false;
	});

	const showFallback = $derived(!src || imageError);

	const sizeClasses = {
		sm: 'h-10 w-10 text-sm',
		md: 'h-14 w-14 text-lg',
		lg: 'h-16 w-16 text-2xl',
		xl: 'h-20 w-20 text-3xl',
		'2xl': 'h-28 w-28 text-4xl'
	};

	const imgSizeClasses = {
		sm: 'h-10 w-auto max-w-16',
		md: 'h-14 w-auto max-w-24',
		lg: 'h-16 w-auto max-w-32',
		xl: 'h-20 w-auto max-w-40',
		'2xl': 'h-28 w-auto max-w-48'
	};

	// Generate initials from alt text or fallback
	const initials = $derived(fallback || alt.slice(0, 2));

	function handleError() {
		imageError = true;
	}
</script>

{#if src && !showFallback}
	<img
		{src}
		{alt}
		class="{imgSizeClasses[size]} flex-shrink-0 object-contain object-left {className}"
		loading="lazy"
		onerror={handleError}
	/>
{/if}
{#if showFallback || !src}
	<div
		class="{sizeClasses[size]} flex flex-shrink-0 items-center justify-center rounded-lg font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent)] {className}"
		class:hidden={src && !showFallback}
	>
		{initials}
	</div>
{/if}
