/**
 * Manual stats for projects not on GitHub (e.g., GitLab)
 */
export interface ManualStats {
	stars?: number;
	forks?: number;
	description?: string;
	license?: string;
	lastRelease?: string;
	releaseVersion?: string;
}

/**
 * Static project configuration (stored in projects.json)
 * Only contains data that can't be fetched from GitHub
 */
export interface ProjectConfig {
	id: string;
	name: string;
	tagline: string;
	tags: string[];
	github: string;
	docs?: string;
	// Additional links
	homepage?: string;
	pypi?: string;
	condaForge?: string;
	example?: string;
	// Custom logo path (falls back to GitHub org avatar)
	logo?: string;
	// Optional overrides for GitHub data - longer description for the modal
	description?: string;
	// Manual stats for non-GitHub projects
	manualStats?: ManualStats;
}

/**
 * Full project data with GitHub metadata
 */
export interface Project extends ProjectConfig {
	// GitHub-derived data
	stars: number;
	lastRelease?: string;
	releaseVersion?: string;
	lastUpdate?: string;
	avatarUrl?: string;
	forks?: number;
	license?: string;
}

export type SortOption = 'random' | 'alphabetical' | 'stars' | 'release';

export type SortDirection = 'asc' | 'desc';

export interface SortInfo {
	id: SortOption;
	name: string;
	reverseName?: string; // Name when reversed (asc)
	supportsDirection: boolean;
}

export const SORT_OPTIONS: SortInfo[] = [
	{ id: 'random', name: 'Random', supportsDirection: false },
	{ id: 'alphabetical', name: 'A-Z', reverseName: 'Z-A', supportsDirection: true },
	{ id: 'stars', name: 'Most Stars', reverseName: 'Least Stars', supportsDirection: true },
	{ id: 'release', name: 'New Releases', reverseName: 'Oldest Releases', supportsDirection: true }
];
