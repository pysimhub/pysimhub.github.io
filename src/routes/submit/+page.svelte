<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import { Button } from '$lib/components/ui';
</script>

<svelte:head>
	<title>PySimHub - Submit</title>
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
			<p class="mt-6 text-lg text-[var(--color-text-secondary)]">
				Have a Python simulation library? Add it to PySimHub and help others discover your work.
			</p>

			<!-- CTA Button - prominent placement -->
			<Button variant="primary" size="lg" href="https://github.com/pysimhub/pysimhub.github.io/issues/new?template=project_submission.yml" target="_blank" class="mt-8 px-8 py-4 text-lg">
				<Icon name="github" size="lg" />
				Submit via GitHub Issue
			</Button>
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
							<Icon name="check" size="sm" class="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
							<span>Open-source license (MIT, Apache, GPL, BSD, etc.)</span>
						</li>
						<li class="flex items-start gap-2">
							<Icon name="check" size="sm" class="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
							<span>Available on PyPI or conda-forge</span>
						</li>
						<li class="flex items-start gap-2">
							<Icon name="check" size="sm" class="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
							<span>Updated within the last 2 years</span>
						</li>
						<li class="flex items-start gap-2">
							<Icon name="check" size="sm" class="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
							<span>Documentation or README with examples</span>
						</li>
						<li class="flex items-start gap-2">
							<Icon name="check" size="sm" class="mt-0.5 flex-shrink-0 text-[var(--color-accent)]" />
							<span>Related to simulation or scientific computing</span>
						</li>
					</ul>
				</div>

				<!-- Information Needed -->
				<div class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
					<h2 class="text-lg font-semibold text-[var(--color-text-primary)]">What We Need</h2>
					<div class="mt-4 space-y-4 text-sm">
						<div>
							<h3 class="font-medium text-[var(--color-text-primary)]">Required</h3>
							<ul class="mt-2 space-y-1 text-[var(--color-text-secondary)]">
								<li>Project name & tagline</li>
								<li>Repository URL</li>
								<li>3-5 tags</li>
								<li>Short description</li>
							</ul>
						</div>
						<div>
							<h3 class="font-medium text-[var(--color-text-primary)]">Optional</h3>
							<ul class="mt-2 space-y-1 text-[var(--color-text-secondary)]">
								<li>Docs, PyPI, conda-forge URLs</li>
								<li>Homepage, example links</li>
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
  "tagline": "Brief one-line description",
  "description": "2-4 sentence description.",
  "tags": ["robotics", "control", "dynamic-systems"],
  "github": "https://github.com/..."
}`}</code></pre>
			</div>
		</section>
	</div>
</div>
