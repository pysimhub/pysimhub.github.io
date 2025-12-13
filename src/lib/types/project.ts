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
	// Custom logo path (falls back to GitHub org avatar)
	logo?: string;
	// Optional overrides for GitHub data
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

export type SortOption = 'random' | 'alphabetical' | 'stars' | 'recent';

export interface SortInfo {
	id: SortOption;
	name: string;
}

export const SORT_OPTIONS: SortInfo[] = [
	{ id: 'random', name: 'Random' },
	{ id: 'alphabetical', name: 'A-Z' },
	{ id: 'stars', name: 'Most Stars' },
	{ id: 'recent', name: 'Recently Updated' }
];
