<script lang="ts">
	import type { BlogPostMeta } from './+page';
	import Fuse from 'fuse.js';
	import { debounce } from '$lib/utils/search';

	let { data } = $props();

	// Search and filter state
	let inputValue = $state('');
	let searchQuery = $state('');
	let selectedTag = $state<string | null>(null);
	let sortBy = $state<'date' | 'title'>('date');
	let sortDropdownOpen = $state(false);

	// Debounced search
	const updateSearch = debounce((value: string) => {
		searchQuery = value;
	}, 200);

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		inputValue = target.value;
		updateSearch(inputValue);
	}

	function clearSearch() {
		inputValue = '';
		searchQuery = '';
	}

	// Get all unique tags
	const allTags = $derived(() => {
		const tags = new Set<string>();
		data.posts.forEach((post: BlogPostMeta) => post.tags.forEach((tag: string) => tags.add(tag)));
		return Array.from(tags).sort();
	});

	// Setup Fuse.js for fuzzy search
	const fuse = $derived(
		new Fuse(data.posts, {
			keys: ['title', 'description', 'tags', 'author'],
			threshold: 0.3,
			includeScore: true
		})
	);

	// Filter and sort posts
	const filteredPosts = $derived(() => {
		let posts = data.posts as BlogPostMeta[];

		// Apply search filter
		if (searchQuery.trim()) {
			const results = fuse.search(searchQuery);
			posts = results.map((r) => r.item);
		}

		// Apply tag filter
		if (selectedTag) {
			posts = posts.filter((post) => post.tags.includes(selectedTag!));
		}

		// Apply sorting
		if (sortBy === 'date') {
			posts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		} else if (sortBy === 'title') {
			posts = [...posts].sort((a, b) => a.title.localeCompare(b.title));
		}

		return posts;
	});

	const sortOptions = [
		{ id: 'date' as const, name: 'Newest First' },
		{ id: 'title' as const, name: 'Title A-Z' }
	];

	const currentSort = $derived(sortOptions.find((s) => s.id === sortBy) || sortOptions[0]);

	function selectSort(option: 'date' | 'title') {
		sortBy = option;
		sortDropdownOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.sort-dropdown')) {
			sortDropdownOpen = false;
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:window onclick={handleClickOutside} />

<svelte:head>
	<title>Blog - PySimHub</title>
	<meta
		name="description"
		content="Articles, tutorials, and news from the PySimHub community."
	/>

	<!-- Open Graph -->
	<meta property="og:title" content="Blog - PySimHub" />
	<meta property="og:description" content="Articles, tutorials, and news from the PySimHub community." />
	<meta property="og:url" content="https://pysimhub.io/blog" />

	<!-- Twitter -->
	<meta name="twitter:title" content="Blog - PySimHub" />
	<meta name="twitter:description" content="Articles, tutorials, and news from the PySimHub community." />
</svelte:head>

<div class="px-4 py-16 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-4xl">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">Blog</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)]">
				Articles, tutorials, and updates from the Python simulation community.
			</p>
		</div>

		<!-- Search and filters -->
		<div class="mt-12 space-y-4">
			<!-- Search and Sort row -->
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<!-- Search bar -->
				<div class="relative flex-1 sm:max-w-md">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
						<svg
							class="h-5 w-5 text-[var(--color-text-muted)]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<input
						type="text"
						placeholder="Search posts..."
						value={inputValue}
						oninput={handleInput}
						class="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] py-3 pl-12 pr-10 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
					/>
					{#if inputValue}
						<button
							onclick={clearSearch}
							class="absolute inset-y-0 right-0 flex items-center pr-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
							aria-label="Clear search"
						>
							<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					{/if}
				</div>

				<!-- Sort dropdown -->
				<div class="sort-dropdown relative">
					<button
						onclick={() => (sortDropdownOpen = !sortDropdownOpen)}
						class="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-hover)]"
						aria-expanded={sortDropdownOpen}
						aria-haspopup="listbox"
					>
						<svg class="h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
						</svg>
						{currentSort.name}
						<svg
							class="h-4 w-4 transition-transform"
							class:rotate-180={sortDropdownOpen}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if sortDropdownOpen}
						<ul
							class="absolute right-0 top-full z-20 mt-2 min-w-[150px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] py-1 shadow-lg"
							role="listbox"
						>
							{#each sortOptions as option}
								<li>
									<button
										onclick={() => selectSort(option.id)}
										class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--color-bg-hover)]"
										class:text-accent={sortBy === option.id}
										role="option"
										aria-selected={sortBy === option.id}
									>
										{#if sortBy === option.id}
											<svg class="h-4 w-4 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
											</svg>
										{:else}
											<span class="w-4"></span>
										{/if}
										{option.name}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>

			<!-- Tag filters -->
			<div class="flex flex-wrap gap-2">
				<button
					onclick={() => (selectedTag = null)}
					class="rounded-full px-3 py-1.5 text-sm font-medium transition-colors {selectedTag === null
						? 'bg-[var(--color-accent)] text-white'
						: 'border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'}"
				>
					All
				</button>
				{#each allTags() as tag}
					<button
						onclick={() => (selectedTag = selectedTag === tag ? null : tag)}
						class="rounded-full px-3 py-1.5 text-sm font-medium transition-colors {selectedTag === tag
							? 'bg-[var(--color-accent)] text-white'
							: 'border border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>

		<!-- Posts grid -->
		<div class="mt-8 space-y-6">
			{#each filteredPosts() as post (post.slug)}
				<article
					class="group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 transition-all hover:border-[var(--color-border-hover)] hover:shadow-lg"
				>
					<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div class="flex-1">
							<!-- Tags -->
							<div class="mb-3 flex flex-wrap gap-2">
								{#each post.tags as tag}
									<button
										onclick={() => (selectedTag = tag)}
										class="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/20"
									>
										{tag}
									</button>
								{/each}
							</div>

							<!-- Title -->
							<a href="/blog/{post.slug}" class="block">
								<h2
									class="text-xl font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]"
								>
									{post.title}
								</h2>
							</a>

							<!-- Description -->
							<p class="mt-2 text-[var(--color-text-secondary)]">
								{post.description}
							</p>

							<!-- Meta -->
							<div
								class="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]"
							>
								<span class="flex items-center gap-1">
									<svg
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									{post.author}
								</span>
								<span class="flex items-center gap-1">
									<svg
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									{formatDate(post.date)}
								</span>
								<span class="flex items-center gap-1">
									<svg
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{post.readingTime}
								</span>
							</div>
						</div>

						<!-- Read more -->
						<a
							href="/blog/{post.slug}"
							class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] sm:mt-0"
						>
							Read more
							<svg
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
						</a>
					</div>
				</article>
			{:else}
				<div class="py-16 text-center">
					<svg
						class="mx-auto h-16 w-16 text-[var(--color-text-muted)]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="1"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
						/>
					</svg>
					<h2 class="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">No posts found</h2>
					<p class="mt-2 text-[var(--color-text-secondary)]">
						{#if searchQuery || selectedTag}
							Try adjusting your search or filters.
						{:else}
							Check back soon for articles and tutorials.
						{/if}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.text-accent {
		color: var(--color-accent);
	}
</style>
