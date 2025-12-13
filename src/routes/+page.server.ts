import type { PageServerLoad } from './$types';
import type { ProjectConfig, Project } from '$lib/types/project';
import { parseGitHubUrl, getAvatarUrl } from '$lib/utils/github';

interface GitHubCache {
	[projectId: string]: {
		stars: number;
		forks?: number;
		lastUpdate?: string;
		description?: string;
		license?: string;
		avatarUrl?: string;
		lastRelease?: string;
		releaseVersion?: string;
		fetchedAt: string;
	};
}

function enrichProjectWithCache(config: ProjectConfig, cache: GitHubCache): Project {
	const cachedData = cache[config.id];
	const parsed = parseGitHubUrl(config.github);
	const owner = parsed?.owner;
	const manual = config.manualStats;

	// Custom logo takes priority, then GitHub avatar as fallback
	const fallbackAvatar = owner ? getAvatarUrl(owner, 128) : undefined;
	const avatarUrl = config.logo || cachedData?.avatarUrl || fallbackAvatar;

	if (cachedData) {
		return {
			...config,
			stars: cachedData.stars,
			forks: cachedData.forks,
			lastUpdate: cachedData.lastUpdate,
			lastRelease: cachedData.lastRelease,
			releaseVersion: cachedData.releaseVersion,
			license: cachedData.license,
			avatarUrl,
			description: config.description || cachedData.description
		};
	}

	// Use manual stats for non-GitHub projects (e.g., GitLab)
	if (manual) {
		return {
			...config,
			stars: manual.stars ?? 0,
			forks: manual.forks,
			lastRelease: manual.lastRelease,
			releaseVersion: manual.releaseVersion,
			license: manual.license,
			avatarUrl,
			description: config.description || manual.description
		};
	}

	// Fallback if no cache or manual stats exist
	return {
		...config,
		stars: 0,
		avatarUrl
	};
}

export const load: PageServerLoad = async ({ fetch }) => {
	// Load project configs from static JSON
	const [projectsResponse, cacheResponse] = await Promise.all([
		fetch('/data/projects.json'),
		fetch('/data/github-cache.json').catch(() => null)
	]);

	const configs: ProjectConfig[] = await projectsResponse.json();

	// Load cached GitHub data (may not exist on first build)
	let cache: GitHubCache = {};
	if (cacheResponse?.ok) {
		try {
			cache = await cacheResponse.json();
		} catch {
			console.warn('Failed to parse github-cache.json');
		}
	}

	// Enrich projects with cached GitHub data
	const projects: Project[] = configs.map((config) => enrichProjectWithCache(config, cache));

	// Calculate aggregate stats
	const uniqueTags = new Set<string>();
	projects.forEach((p) => p.tags.forEach((tag) => uniqueTags.add(tag)));

	const stats = {
		totalProjects: projects.length,
		totalStars: projects.reduce((sum, p) => sum + p.stars, 0),
		totalTags: uniqueTags.size
	};

	return {
		projects,
		stats
	};
};
