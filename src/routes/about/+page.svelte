<script lang="ts">
	import { Avatar } from '$lib/components/ui';

	let { data } = $props();
</script>

<svelte:head>
	<title>PySimHub - About</title>
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
			<h1 class="text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl md:text-6xl">
				About Py<span class="text-[var(--color-accent)]">Sim</span>Hub
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
				PySimHub is an open community catalog spanning all Python simulation domains - an awesome
				list that's also awesome to use. Live data, real exploration, no stale links. Our mission
				is to help researchers, engineers, and developers discover the best tools for their
				simulation needs.
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

		<!-- Design Philosophy -->
		<section class="mt-16">
			<h2 class="text-2xl font-bold text-[var(--color-text-primary)]">Design Philosophy</h2>
			<div class="mt-6 space-y-6">
				<div>
					<h3 class="font-semibold text-[var(--color-text-primary)]">Tag-Based Exploration</h3>
					<p class="mt-2 text-[var(--color-text-secondary)]">
						Rather than forcing projects into rigid hierarchical categories, we use flexible tags.
						A single library might span multiple domains - a robotics simulator could also be relevant
						for control theory, visualization, and real-time systems. Tags let you discover these
						cross-domain connections naturally.
					</p>
				</div>
				<div>
					<h3 class="font-semibold text-[var(--color-text-primary)]">Random Default Sorting</h3>
					<p class="mt-2 text-[var(--color-text-secondary)]">
						We deliberately randomize the default project order. This gives every project - whether
						it has 50 stars or 50,000 - a fair chance to be discovered. The best tool for your needs
						isn't always the most popular one; sometimes it's a focused library that does one thing
						exceptionally well.
					</p>
				</div>
				<div>
					<h3 class="font-semibold text-[var(--color-text-primary)]">Recent Release Highlighting</h3>
					<p class="mt-2 text-[var(--color-text-secondary)]">
						Projects with releases in the last 30 days get a subtle visual highlight. Active maintenance
						matters - it signals that bugs get fixed, features get added, and the community is engaged.
						This helps you find tools that are alive and evolving.
					</p>
				</div>
			</div>
		</section>

		<!-- Members -->
		{#if data.members && data.members.length > 0}
			<section class="mt-16">
				<h2 class="text-2xl font-bold text-[var(--color-text-primary)]">Members</h2>
				<p class="mt-2 text-[var(--color-text-secondary)]">
					The people behind PySimHub.
				</p>
				<div class="mt-8 flex flex-wrap justify-center gap-6">
					{#each data.members as member}
						<a
							href={member.profileUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex flex-col items-center gap-3 rounded-xl p-4 transition-colors hover:bg-[var(--color-bg-hover)]"
						>
							<Avatar
								src={member.avatarUrl}
								alt={member.name || member.login}
								fallback={member.login.slice(0, 2).toUpperCase()}
								size="xl"
								class="border-2 border-[var(--color-border)] transition-all group-hover:border-[var(--color-accent)]"
							/>
							<div class="text-center">
								{#if member.name}
									<div class="font-medium text-[var(--color-text-primary)]">{member.name}</div>
								{/if}
								<div class="text-sm text-[var(--color-text-muted)]">@{member.login}</div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</div>

