<script lang="ts">
	// Placeholder news items - could be pulled from GitHub releases later
	const newsItems = [
		{
			date: '2025-12-13',
			title: 'PySimHub Launch',
			description: 'We\'re excited to announce the launch of PySimHub, a community hub for Python simulation tools!',
			type: 'announcement'
		},
		{
			date: '2025-12-13',
			title: 'Open for Submissions',
			description: 'PySimHub is now accepting project submissions. Share your simulation library with the community.',
			type: 'feature'
		}
	];

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'announcement':
				return 'var(--color-accent)';
			case 'feature':
				return '#10b981'; // emerald
			case 'release':
				return '#f97316'; // orange
			default:
				return 'var(--color-text-muted)';
		}
	}
</script>

<svelte:head>
	<title>News - PySimHub</title>
	<meta name="description" content="Latest updates and news from PySimHub, the Python simulation community hub." />

	<!-- Open Graph -->
	<meta property="og:title" content="News - PySimHub" />
	<meta property="og:description" content="Latest updates and news from PySimHub, the Python simulation community hub." />
	<meta property="og:url" content="https://pysimhub.io/news" />

	<!-- Twitter -->
	<meta name="twitter:title" content="News - PySimHub" />
	<meta name="twitter:description" content="Latest updates and news from PySimHub, the Python simulation community hub." />
</svelte:head>

<div class="px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-3xl">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
				News & Updates
			</h1>
			<p class="mt-6 text-lg text-[var(--color-text-secondary)]">
				Stay up to date with the latest from PySimHub and the Python simulation ecosystem.
			</p>
		</div>

		<!-- Timeline -->
		<div class="mt-16">
			<div class="relative">
				<!-- Timeline line -->
				<div class="absolute left-4 top-0 h-full w-0.5 bg-[var(--color-border)] md:left-1/2 md:-translate-x-1/2"></div>

				<!-- News items -->
				<div class="space-y-12">
					{#each newsItems as item, index}
						<div class="relative flex items-start gap-6 md:gap-12 {index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}">
							<!-- Dot -->
							<div class="absolute left-4 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--color-accent)] md:left-1/2">
								<div class="absolute inset-0 animate-ping rounded-full bg-[var(--color-accent)] opacity-25"></div>
							</div>

							<!-- Date (desktop) -->
							<div class="hidden w-1/2 text-right md:block {index % 2 === 0 ? '' : 'text-left'}">
								<time class="text-sm text-[var(--color-text-muted)]">{formatDate(item.date)}</time>
							</div>

							<!-- Content -->
							<div class="ml-10 w-full md:ml-0 md:w-1/2">
								<!-- Date (mobile) -->
								<time class="mb-2 block text-sm text-[var(--color-text-muted)] md:hidden">
									{formatDate(item.date)}
								</time>

								<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
									<div class="flex items-start justify-between gap-4">
										<div>
											<span
												class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
												style="background-color: color-mix(in srgb, {getTypeColor(item.type)} 15%, transparent); color: {getTypeColor(item.type)};"
											>
												{item.type}
											</span>
											<h2 class="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
												{item.title}
											</h2>
										</div>
									</div>
									<p class="mt-2 text-[var(--color-text-secondary)]">{item.description}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Coming Soon -->
		<section class="mt-24 text-center">
			<div class="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
				<svg class="mx-auto h-12 w-12 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
				</svg>
				<h3 class="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
					More Updates Coming Soon
				</h3>
				<p class="mt-2 text-[var(--color-text-secondary)]">
					We're working on auto-pulling updates from project GitHub releases. Stay tuned!
				</p>
			</div>
		</section>

	</div>
</div>

