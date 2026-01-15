<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TagFilter from '$lib/components/TagFilter.svelte';
	import SortDropdown from '$lib/components/SortDropdown.svelte';
	import StatsCounter from '$lib/components/StatsCounter.svelte';
	import ProjectGrid from '$lib/components/ProjectGrid.svelte';
	import { allProjects } from '$lib/stores/projects';
	import type { Project, ProjectConfig } from '$lib/types/project';
	import { parseGitHubUrl, getAvatarUrl } from '$lib/utils/github';
	import { Icon } from '$lib/components/icons';
	import { Button } from '$lib/components/ui';

	// Get data from server load
	let { data } = $props();

	// Test mode state
	let testMode = $state(false);
	let testDataLoaded = $state(false);

	// Check for test mode on mount
	$effect(() => {
		if (browser) {
			const urlParam = $page.url.searchParams.get('test');
			const stored = localStorage.getItem('pysimhub-test-mode');

			if (urlParam === 'true') {
				localStorage.setItem('pysimhub-test-mode', 'true');
				testMode = true;
			} else if (urlParam === 'false') {
				localStorage.removeItem('pysimhub-test-mode');
				testMode = false;
			} else if (stored === 'true') {
				testMode = true;
			}
		}
	});

	// Load test data when test mode is enabled
	$effect(() => {
		if (browser && testMode && !testDataLoaded) {
			loadTestData();
		} else if (browser && !testMode && testDataLoaded) {
			// Reset to real data only
			allProjects.set(data.projects);
			testDataLoaded = false;
		}
	});

	async function loadTestData() {
		try {
			const [projectsRes, cacheRes] = await Promise.all([
				fetch('/data/test-projects.json'),
				fetch('/data/test-github-cache.json')
			]);

			if (projectsRes.ok && cacheRes.ok) {
				const testConfigs: ProjectConfig[] = await projectsRes.json();
				const testCache = await cacheRes.json();

				// Enrich test projects with cache data
				const testProjects: Project[] = testConfigs.map(config => {
					const cached = testCache[config.id];
					const parsed = parseGitHubUrl(config.github);
					const owner = parsed?.owner;
					const fallbackAvatar = owner ? getAvatarUrl(owner, 128) : undefined;

					return {
						...config,
						stars: cached?.stars ?? 0,
						forks: cached?.forks,
						lastUpdate: cached?.lastUpdate,
						lastRelease: cached?.lastRelease,
						releaseVersion: cached?.releaseVersion,
						license: cached?.license,
						avatarUrl: config.logo || cached?.avatarUrl || fallbackAvatar,
						description: config.description || cached?.description
					};
				});

				// Merge with real projects
				allProjects.set([...data.projects, ...testProjects]);
				testDataLoaded = true;
			}
		} catch (e) {
			console.warn('Failed to load test data:', e);
		}
	}

// Initialize store with server data
	// Using $effect.pre to run before DOM updates
	$effect.pre(() => {
		if (data?.projects?.length > 0 && !testDataLoaded) {
			allProjects.set(data.projects);
		}
	});
</script>

<svelte:head>
	<title>PySimHub</title>
	<meta
		name="description"
		content="Discover Python libraries for simulation and numerics. Robotics, fluid dynamics, discrete-event, agent-based modeling, and more."
	/>

	<!-- Open Graph -->
	<meta property="og:title" content="PySimHub - Python Simulation & Numerics Community" />
	<meta property="og:description" content="Discover Python libraries for simulation and numerics. Robotics, fluid dynamics, discrete-event, agent-based modeling, and more." />
	<meta property="og:url" content="https://pysimhub.io/" />

	<!-- Twitter -->
	<meta name="twitter:title" content="PySimHub - Python Simulation & Numerics Community" />
	<meta name="twitter:description" content="Discover Python libraries for simulation and numerics. Robotics, fluid dynamics, discrete-event, agent-based modeling, and more." />
</svelte:head>

<!-- Hero Section -->
<section class="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
	<!-- Background gradient -->
	<div
		class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
		aria-hidden="true"
	>
		<div
			class="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px]"
		></div>
	</div>

	<div class="mx-auto max-w-7xl">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-6xl">
				Py<span class="text-[var(--color-accent)]">Sim</span>Hub
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
				Community hub for Python simulation and numerics tools. Discover libraries for robotics,
				fluid dynamics, discrete-event simulation, agent-based modeling, and more.
			</p>
			<div class="mt-8 flex flex-wrap justify-center gap-4">
				<Button variant="primary" size="lg" href="/submit">
					<Icon name="plus" />
					Submit a Project
				</Button>
				<Button variant="outline" size="lg" href="https://github.com/pysimhub" target="_blank">
					<Icon name="github" />
					View on GitHub
				</Button>
			</div>
		</div>

		<!-- Stats -->
		<div class="mt-10">
			<StatsCounter stats={data.stats} />
		</div>
	</div>
</section>

<!-- Projects Section -->
<section class="px-4 pb-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<!-- Search and Filters -->
		<div class="mb-8 space-y-4">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex-1 sm:max-w-md">
					<SearchBar />
				</div>
				<SortDropdown />
			</div>
			<TagFilter />
		</div>

		<!-- Project Grid -->
		<ProjectGrid />
	</div>
</section>

