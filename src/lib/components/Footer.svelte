<script lang="ts">
	import Logo from './Logo.svelte';

	const socialLinks = [
		{
			href: 'https://github.com/pysimhub',
			label: 'GitHub',
			icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
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
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
							<path fill-rule="evenodd" d={link.icon} clip-rule="evenodd" />
						</svg>
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

