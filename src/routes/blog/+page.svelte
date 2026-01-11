<script lang="ts">
	import type { BlogPostMeta } from './+page';
	import Fuse from 'fuse.js';
	import { debounce } from '$lib/utils/search';
	import { formatDate } from '$lib/utils/format';
	import { Icon } from '$lib/components/icons';
	import { Badge, EmptyState } from '$lib/components/ui';

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
</script>

<svelte:window onclick={handleClickOutside} />

<svelte:head>
	<title>PySimHub - Blog</title>
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
						<Icon name="search" class="text-[var(--color-text-muted)]" />
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
							<Icon name="close" />
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
						<Icon name="sort" size="sm" class="text-[var(--color-text-muted)]" />
						{currentSort.name}
						<Icon
							name="chevron-down"
							size="sm"
							class="transition-transform {sortDropdownOpen ? 'rotate-180' : ''}"
						/>
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
											<Icon name="check" size="sm" class="text-[var(--color-accent)]" />
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
									<Icon name="user" size="sm" />
									{post.author}
								</span>
								<span class="flex items-center gap-1">
									<Icon name="calendar" size="sm" />
									{formatDate(post.date)}
								</span>
								<span class="flex items-center gap-1">
									<Icon name="clock" size="sm" />
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
							<Icon name="arrow-right" size="sm" />
						</a>
					</div>
				</article>
			{:else}
				<EmptyState
					icon="document"
					title="No posts found"
					description={searchQuery || selectedTag
						? 'Try adjusting your search or filters.'
						: 'Check back soon for articles and tutorials.'}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.text-accent {
		color: var(--color-accent);
	}
</style>
