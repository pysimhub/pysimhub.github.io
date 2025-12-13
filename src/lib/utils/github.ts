/**
 * GitHub utilities for PySimHub
 * Note: Live API fetching is done by scripts/fetch-github-data.js
 * These utilities are used at build time to enrich project data
 */

/**
 * Parse GitHub URL to extract owner and repo name
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
	const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
	if (!match) return null;
	return {
		owner: match[1],
		repo: match[2].replace(/\.git$/, '')
	};
}

/**
 * Get avatar URL for a GitHub user/org
 * GitHub avatars support size parameter
 */
export function getAvatarUrl(owner: string, size: number = 128): string {
	return `https://github.com/${owner}.png?size=${size}`;
}
