<script lang="ts">
	import Logo from './Logo.svelte';
	import { IconButton } from '$lib/components/ui';
	import { onMount } from 'svelte';

	let lastDataUpdate: string | undefined = $state(undefined);

	onMount(async () => {
		try {
			const res = await fetch('/data/github-cache.json');
			const cacheData: Record<string, { fetchedAt?: string }> = await res.json();
			lastDataUpdate = Object.values(cacheData)
				.map((p) => p.fetchedAt)
				.filter(Boolean)
				.sort()
				.pop();
		} catch {
			// Ignore fetch errors
		}
	});

	function formatRelativeTime(isoString: string | undefined): string {
		if (!isoString) return 'Unknown';
		const date = new Date(isoString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) return `${diffDays}d ago`;
		if (diffHours > 0) return `${diffHours}h ago`;
		return 'Just now';
	}
</script>

<footer class="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
			<!-- Brand -->
			<div class="text-center md:text-left">
				<a href="/" class="inline-flex items-center gap-2 text-lg font-bold">
					<Logo class="h-6 w-6" />
					<span class="text-[var(--color-text-primary)]">
						Py<span class="text-[var(--color-accent)]">Sim</span>Hub
					</span>
				</a>
				<p class="mt-1 text-sm text-[var(--color-text-muted)]">
					Community hub for Python simulation and numerics tools.
				</p>
			</div>

			<!-- Social -->
			<IconButton
				icon="github"
				label="GitHub"
				href="https://github.com/pysimhub"
				target="_blank"
			/>
		</div>

		<!-- Bottom bar -->
		<div class="mt-4 flex flex-col items-center justify-between gap-2 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-muted)] md:flex-row">
			<p>&copy; {new Date().getFullYear()} PySimHub. MIT License.</p>
			<p>Data updated {formatRelativeTime(lastDataUpdate)}</p>
		</div>
	</div>
</footer>

