import type { ProjectConfig, Project } from '$lib/types/project';
import { parseGitHubUrl, getAvatarUrl } from '$lib/utils/github';

export interface GitHubCache {
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

export function enrichProjectWithCache(config: ProjectConfig, cache: GitHubCache): Project {
	const cachedData = cache[config.id];
	const parsed = parseGitHubUrl(config.github);
	const owner = parsed?.owner;
	const manual = config.manualStats;

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

	return {
		...config,
		stars: 0,
		avatarUrl
	};
}

export async function loadAllProjects(fetch: typeof globalThis.fetch): Promise<Project[]> {
	const [projectsResponse, cacheResponse] = await Promise.all([
		fetch('/data/projects.json'),
		fetch('/data/github-cache.json').catch(() => null)
	]);

	const configs: ProjectConfig[] = await projectsResponse.json();

	let cache: GitHubCache = {};
	if (cacheResponse?.ok) {
		try {
			cache = await cacheResponse.json();
		} catch {
			console.warn('Failed to parse github-cache.json');
		}
	}

	return configs.map((config) => enrichProjectWithCache(config, cache));
}

export function getAllTags(projects: Project[]): { tag: string; count: number }[] {
	const tagCounts = new Map<string, number>();

	projects.forEach((project) => {
		project.tags.forEach((tag) => {
			tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
		});
	});

	return Array.from(tagCounts.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count);
}
