import { writable, derived } from 'svelte/store';
import type { Project, SortOption } from '$lib/types/project';
import { shuffle } from '$lib/utils/shuffle';
import { searchProjects, initSearch } from '$lib/utils/search';

// Raw projects data
export const allProjects = writable<Project[]>([]);

// Search query
export const searchQuery = writable<string>('');

// Selected tags filter (array for multi-select)
export const selectedTags = writable<string[]>([]);

// Sort option
export const sortOption = writable<SortOption>('random');

// Initialize search when projects are loaded
allProjects.subscribe((projects) => {
	if (projects.length > 0) {
		initSearch(projects);
	}
});

// All unique tags from projects (sorted by frequency)
export const allTags = derived(allProjects, ($allProjects) => {
	const tagCounts = new Map<string, number>();

	$allProjects.forEach((project) => {
		project.tags.forEach((tag) => {
			tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
		});
	});

	// Sort by frequency (descending), then alphabetically
	return Array.from(tagCounts.entries())
		.sort((a, b) => {
			if (b[1] !== a[1]) return b[1] - a[1]; // By count descending
			return a[0].localeCompare(b[0]); // Alphabetically
		})
		.map(([tag]) => tag);
});

// Filtered and sorted projects
export const filteredProjects = derived(
	[allProjects, searchQuery, selectedTags, sortOption],
	([$allProjects, $searchQuery, $selectedTags, $sortOption]) => {
		let result = $allProjects;

		// Apply search
		if ($searchQuery.trim()) {
			result = searchProjects($searchQuery, result);
		}

		// Apply tag filter (AND logic - project must have all selected tags)
		if ($selectedTags.length > 0) {
			result = result.filter((p) => $selectedTags.every((tag) => p.tags.includes(tag)));
		}

		// Apply sorting (skip if search is active - search results are already ranked)
		if (!$searchQuery.trim()) {
			switch ($sortOption) {
				case 'random':
					result = shuffle(result);
					break;
				case 'alphabetical':
					result = [...result].sort((a, b) => a.name.localeCompare(b.name));
					break;
				case 'stars':
					result = [...result].sort((a, b) => b.stars - a.stars);
					break;
				case 'recent':
					result = [...result].sort((a, b) => {
						if (!a.lastRelease) return 1;
						if (!b.lastRelease) return -1;
						return new Date(b.lastRelease).getTime() - new Date(a.lastRelease).getTime();
					});
					break;
			}
		}

		return result;
	}
);

// Aggregated stats
export const stats = derived(allProjects, ($allProjects) => {
	const totalStars = $allProjects.reduce((sum, p) => sum + p.stars, 0);
	const totalProjects = $allProjects.length;

	// Count unique tags
	const uniqueTags = new Set<string>();
	$allProjects.forEach((p) => p.tags.forEach((tag) => uniqueTags.add(tag)));

	return {
		totalStars,
		totalProjects,
		totalTags: uniqueTags.size
	};
});

// Visible projects (for infinite scroll)
export const visibleCount = writable<number>(20);

export const visibleProjects = derived(
	[filteredProjects, visibleCount],
	([$filteredProjects, $visibleCount]) => {
		return $filteredProjects.slice(0, $visibleCount);
	}
);

export const hasMore = derived(
	[filteredProjects, visibleCount],
	([$filteredProjects, $visibleCount]) => {
		return $visibleCount < $filteredProjects.length;
	}
);

export function loadMore(): void {
	visibleCount.update((n) => n + 20);
}

export function resetVisible(): void {
	visibleCount.set(20);
}
