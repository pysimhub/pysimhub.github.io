<script lang="ts">
	import Logo from './Logo.svelte';
	import { Icon } from '$lib/components/icons';
	import type { IconName } from '$lib/components/icons';

	const socialLinks: Array<{ href: string; label: string; icon: IconName }> = [
		{
			href: 'https://github.com/pysimhub',
			label: 'GitHub',
			icon: 'github'
		}
	];
</script>

<footer class="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
			<!-- Brand -->
			<div class="text-center md:text-left">
				<a href="/" class="inline-flex items-center gap-2 text-xl font-bold">
					<Logo />
					<span class="text-[var(--color-text-primary)]">
						Py<span class="text-[var(--color-accent)]">Sim</span>Hub
					</span>
				</a>
				<p class="mt-2 text-sm text-[var(--color-text-muted)]">
					Community hub for Python simulation and numerics tools.
				</p>
			</div>

			<!-- Social -->
			<div class="flex items-center gap-4">
				<span class="text-sm text-[var(--color-text-secondary)]">Follow us</span>
				{#each socialLinks as link}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						class="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
						aria-label={link.label}
					>
						<Icon name={link.icon} />
					</a>
				{/each}
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 text-sm text-[var(--color-text-muted)] md:flex-row">
			<p>&copy; {new Date().getFullYear()} PySimHub. MIT License.</p>
			<p>
				Built with <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-accent)]">SvelteKit</a>
			</p>
		</div>
	</div>
</footer>

