<script lang="ts">
	import { countUp, formatNumber } from '$lib/utils/countup';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/accessibility';

	interface Props {
		stats: {
			totalStars: number;
			totalProjects: number;
			totalTags: number;
		};
	}

	let { stats }: Props = $props();

	let containerEl: HTMLElement;
	let hasAnimated = $state(false);

	const statItems = $derived([
		{ label: 'Total Stars', value: stats.totalStars, suffix: '+' },
		{ label: 'Projects', value: stats.totalProjects, suffix: '' },
		{ label: 'Tags', value: stats.totalTags, suffix: '' }
	]);

	$effect(() => {
		if (!browser || hasAnimated || !containerEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !hasAnimated) {
						hasAnimated = true;

						if (!$prefersReducedMotion) {
							const counters = containerEl.querySelectorAll('.counter');
							counters.forEach((counter, index) => {
								const value = statItems[index].value;
								const suffix = statItems[index].suffix;
								countUp(counter as HTMLElement, value, 2000, suffix);
							});
						}

						observer.disconnect();
					}
				});
			},
			{ threshold: 0.2 }
		);

		observer.observe(containerEl);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={containerEl}
	class="grid grid-cols-3 gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-4 md:gap-8"
>
	{#each statItems as stat}
		<div class="text-center">
			<div class="counter text-3xl font-bold text-[var(--color-accent)] md:text-4xl">
				{#if hasAnimated || $prefersReducedMotion}
					{formatNumber(stat.value)}{stat.suffix}
				{:else}
					0
				{/if}
			</div>
			<div class="mt-1 text-sm text-[var(--color-text-muted)]">{stat.label}</div>
		</div>
	{/each}
</div>
