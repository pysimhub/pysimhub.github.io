<script lang="ts">
	import { Icon } from '$lib/components/icons';
	import { Button } from '$lib/components/ui';
</script>

<svelte:head>
	<title>PySimHub - Submit</title>
	<meta name="description" content="Submit or update a Python simulation library on PySimHub." />

	<!-- Open Graph -->
	<meta property="og:title" content="Submit a Project - PySimHub" />
	<meta property="og:description" content="Submit or update a Python simulation library on PySimHub." />
	<meta property="og:url" content="https://pysimhub.io/submit" />

	<!-- Twitter -->
	<meta name="twitter:title" content="Submit a Project - PySimHub" />
	<meta name="twitter:description" content="Submit or update a Python simulation library on PySimHub." />
</svelte:head>

<div class="px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<!-- Header -->
		<section class="text-center">
			<h1 class="text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl md:text-6xl">
				Submit a Project
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
				Add your Python simulation library to PySimHub and help researchers, engineers, and developers discover your work.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<Button
					variant="primary"
					size="lg"
					href="https://github.com/pysimhub/pysimhub.github.io/issues/new?template=project_submission.yml"
					target="_blank"
				>
					<Icon name="plus" />
					Submit New Project
				</Button>
				<Button
					variant="outline"
					size="lg"
					href="https://github.com/pysimhub/pysimhub.github.io/issues/new?template=project_update.yml"
					target="_blank"
				>
					<Icon name="pencil" />
					Update Existing Project
				</Button>
			</div>
		</section>

		<!-- How it works -->
		<section class="mt-16">
			<h2 class="text-2xl font-bold text-[var(--color-text-primary)]">How It Works</h2>
			<div class="mt-6 space-y-4 text-[var(--color-text-secondary)]">
				<p>
					Submissions are handled via GitHub Issues. Fill out the form with your project details, and our automation will create a pull request for you. A maintainer will review it and merge once approved.
				</p>
				<p>
					Need to update an existing project? Use the update form to fix broken links, change URLs, or modify other details. Only fill in the fields you want to change.
				</p>
			</div>
		</section>

		<!-- Requirements -->
		<section class="mt-16">
			<h2 class="text-2xl font-bold text-[var(--color-text-primary)]">Requirements</h2>
			<p class="mt-2 text-[var(--color-text-secondary)]">
				Projects must meet these criteria to be listed.
			</p>
			<ul class="mt-6 space-y-3 text-[var(--color-text-secondary)]">
				<li class="flex items-start gap-3">
					<Icon name="check" size="sm" class="mt-1 flex-shrink-0 text-[var(--color-accent)]" />
					<span><strong class="text-[var(--color-text-primary)]">Open source</strong> — Licensed under MIT, Apache, GPL, BSD, or similar</span>
				</li>
				<li class="flex items-start gap-3">
					<Icon name="check" size="sm" class="mt-1 flex-shrink-0 text-[var(--color-accent)]" />
					<span><strong class="text-[var(--color-text-primary)]">Installable</strong> — Available on PyPI or conda-forge</span>
				</li>
				<li class="flex items-start gap-3">
					<Icon name="check" size="sm" class="mt-1 flex-shrink-0 text-[var(--color-accent)]" />
					<span><strong class="text-[var(--color-text-primary)]">Maintained</strong> — Updated within the last 2 years</span>
				</li>
				<li class="flex items-start gap-3">
					<Icon name="check" size="sm" class="mt-1 flex-shrink-0 text-[var(--color-accent)]" />
					<span><strong class="text-[var(--color-text-primary)]">Documented</strong> — Has documentation or README with examples</span>
				</li>
			</ul>
		</section>

	</div>
</div>
