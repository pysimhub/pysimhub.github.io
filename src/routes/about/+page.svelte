<svelte:head>
	<title>About - PySimHub</title>
	<meta name="description" content="Learn about PySimHub's mission to build an open community catalog for Python simulation tools." />

	<!-- Open Graph -->
	<meta property="og:title" content="About - PySimHub" />
	<meta property="og:description" content="Learn about PySimHub's mission to build an open community catalog for Python simulation tools." />
	<meta property="og:url" content="https://pysimhub.io/about" />

	<!-- Twitter -->
	<meta name="twitter:title" content="About - PySimHub" />
	<meta name="twitter:description" content="Learn about PySimHub's mission to build an open community catalog for Python simulation tools." />
</svelte:head>

<div class="px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Mission -->
		<section class="text-center">
			<h1 class="text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
				About PySimHub
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
				PySimHub is an open community catalog spanning all Python simulation domains. Our mission is
				to help researchers, engineers, and developers discover the best tools for their simulation
				needs.
			</p>
		</section>

		<!-- Vision -->
		<section class="mt-16">
			<h2 class="text-2xl font-bold text-[var(--color-text-primary)]">Our Vision</h2>
			<div class="mt-6 space-y-4 text-[var(--color-text-secondary)]">
				<p>
					The Python ecosystem has an incredible wealth of simulation and numerics libraries, but
					they're often siloed within specific communities. PySimHub bridges these gaps by creating
					a unified discovery platform.
				</p>
				<p>
					We believe that cross-pollination between domains leads to innovation. A roboticist might
					find inspiration in fluid dynamics tools, while a systems biologist might benefit from
					discrete-event simulation techniques.
				</p>
				<p>
					<strong class="text-[var(--color-text-primary)]">Long-term goal:</strong> As our community grows,
					we aim to host a small conference bringing together Python simulation practitioners from all
					domains.
				</p>
			</div>
		</section>

		<!-- CTA -->
		<section class="mt-16 text-center">
			<p class="text-lg text-[var(--color-text-secondary)]">
				Want to contribute to PySimHub?
			</p>
			<div class="mt-4 flex flex-wrap justify-center gap-4">
				<a
					href="/submit"
					class="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
					</svg>
					Submit a Project
				</a>
				<a
					href="https://github.com/pysimhub"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-6 py-3 font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-hover)]"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
					</svg>
					View on GitHub
				</a>
			</div>
		</section>
	</div>
</div>

