<svelte:head>
	<title>Submit a Project - PySimHub</title>
	<meta name="description" content="Submit your Python simulation library to PySimHub. Open to submissions from day one via GitHub Issues." />

	<!-- Open Graph -->
	<meta property="og:title" content="Submit a Project - PySimHub" />
	<meta property="og:description" content="Submit your Python simulation library to PySimHub. Open to submissions from day one via GitHub Issues." />
	<meta property="og:url" content="https://pysimhub.io/submit" />

	<!-- Twitter -->
	<meta name="twitter:title" content="Submit a Project - PySimHub" />
	<meta name="twitter:description" content="Submit your Python simulation library to PySimHub. Open to submissions from day one via GitHub Issues." />
</svelte:head>

<div class="px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<div class="text-center">
			<h1 class="text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
				Submit a Project
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
				Have a Python simulation library? Add it to PySimHub and help others discover your work.
			</p>

			<!-- CTA Button - prominent placement -->
			<a
				href="https://github.com/pysimhub/pysimhub.github.io/issues/new?template=project_submission.yml&title=%5BProject%5D%3A+"
				target="_blank"
				rel="noopener noreferrer"
				class="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-[var(--color-accent-hover)]"
			>
				<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
					<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
				</svg>
				Submit via GitHub Issue
			</a>
			<p class="mt-3 text-sm text-[var(--color-text-muted)]">
				We'll review your submission and add it to the catalog.
			</p>
		</div>

		<!-- Two-column: Requirements + Info Needed -->
		<section class="mt-16">
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Requirements -->
				<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
					<h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Requirements</h2>
					<ul class="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span>Open-source license (MIT, Apache, GPL, BSD, etc.)</span>
						</li>
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span>Available on PyPI or conda-forge</span>
						</li>
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span>Updated within the last 2 years</span>
						</li>
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span>Documentation or README with examples</span>
						</li>
						<li class="flex items-start gap-2">
							<svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span>Related to simulation or scientific computing</span>
						</li>
					</ul>
				</div>

				<!-- Information Needed -->
				<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
					<h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Information Needed</h2>
					<div class="mt-4 space-y-4 text-sm">
						<div>
							<h3 class="font-medium text-[var(--color-text-primary)]">Required</h3>
							<ul class="mt-2 space-y-1 text-[var(--color-text-secondary)]">
								<li>Project name</li>
								<li>One-line tagline</li>
								<li>GitHub/GitLab URL</li>
								<li>3-5 tags (e.g., robotics, control)</li>
							</ul>
						</div>
						<div>
							<h3 class="font-medium text-[var(--color-text-primary)]">Optional</h3>
							<ul class="mt-2 space-y-1 text-[var(--color-text-secondary)]">
								<li>Documentation URL</li>
								<li>Logo (PNG/SVG, square)</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Direct PR -->
		<section class="mt-12">
			<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
				<h2 class="text-lg font-semibold text-[var(--color-text-primary)]">For Developers: Direct PR</h2>
				<p class="mt-2 text-sm text-[var(--color-text-secondary)]">
					Add your project directly to <code class="rounded bg-[var(--color-bg-hover)] px-1.5 py-0.5">static/data/projects.json</code>
				</p>
				<pre class="mt-4 overflow-x-auto rounded-lg bg-[var(--color-bg-secondary)] p-4 text-sm"><code class="text-[var(--color-text-secondary)]">{`{
  "id": "your-project",
  "name": "Your Project",
  "tagline": "Brief description",
  "tags": ["robotics", "control", "dynamics"],
  "github": "https://github.com/...",
  "docs": "https://...",
  "logo": "/logos/your-project.png"
}`}</code></pre>
				<p class="mt-3 text-xs text-[var(--color-text-muted)]">
					The <code class="rounded bg-[var(--color-bg-hover)] px-1 py-0.5">logo</code> field is optional - we'll use your GitHub org avatar as fallback.
				</p>
			</div>
		</section>
	</div>
</div>
