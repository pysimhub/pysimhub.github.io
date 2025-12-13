#!/usr/bin/env node

/**
 * Script to fetch GitHub data for all projects and cache it locally.
 * Run this periodically (e.g., via GitHub Actions) to update the cache.
 *
 * Usage: node scripts/fetch-github-data.js
 *
 * Set GITHUB_TOKEN env var for higher rate limits (5000 req/hr vs 60 req/hr)
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GitHub Personal Access Token for higher rate limits
// Create one at: https://github.com/settings/tokens (no special scopes needed for public repos)
// You can either:
// 1. Set GITHUB_TOKEN environment variable
// 2. Replace 'YOUR_GITHUB_TOKEN_HERE' with your actual token (don't commit this!)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE';

// Check if using placeholder
const hasValidToken = GITHUB_TOKEN && GITHUB_TOKEN !== 'YOUR_GITHUB_TOKEN_HERE';

const headers = {
	'Accept': 'application/vnd.github.v3+json',
	'User-Agent': 'PySimHub',
	...(hasValidToken ? { 'Authorization': `token ${GITHUB_TOKEN}` } : {})
};

function parseGitHubUrl(url) {
	const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
	if (!match) return null;
	return {
		owner: match[1],
		repo: match[2].replace(/\.git$/, '')
	};
}

async function fetchWithRetry(url, retries = 3) {
	for (let i = 0; i < retries; i++) {
		try {
			const response = await fetch(url, { headers });

			if (response.status === 403) {
				const remaining = response.headers.get('X-RateLimit-Remaining');
				const resetTime = response.headers.get('X-RateLimit-Reset');
				console.warn(`Rate limited. Remaining: ${remaining}, Reset: ${new Date(resetTime * 1000).toISOString()}`);
				if (remaining === '0') {
					const waitTime = Math.max(0, (resetTime * 1000) - Date.now() + 1000);
					console.log(`Waiting ${Math.round(waitTime / 1000)}s for rate limit reset...`);
					await new Promise(resolve => setTimeout(resolve, waitTime));
					continue;
				}
			}

			if (!response.ok) {
				if (response.status === 404) return null;
				throw new Error(`HTTP ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			if (i === retries - 1) throw error;
			await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
		}
	}
}

async function fetchRepoData(owner, repo) {
	return await fetchWithRetry(`https://api.github.com/repos/${owner}/${repo}`);
}

async function fetchLatestRelease(owner, repo) {
	return await fetchWithRetry(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
}

async function main() {
	console.log('Fetching GitHub data for projects...');
	if (hasValidToken) {
		console.log('Using authenticated requests (5000 req/hr limit)');
	} else {
		console.log('WARNING: No GitHub token configured!');
		console.log('Using unauthenticated requests (60 req/hr limit)');
		console.log('Set GITHUB_TOKEN env var or edit scripts/fetch-github-data.js');
		console.log('');
	}

	// Load project configs
	const projectsPath = join(__dirname, '..', 'static', 'data', 'projects.json');
	const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'));

	const githubData = {};

	for (const project of projects) {
		const parsed = parseGitHubUrl(project.github);
		if (!parsed) {
			// Skip non-GitHub URLs (e.g., GitLab) - they use manualStats instead
			if (project.github.includes('gitlab.com')) {
				console.log(`Skipping ${project.name} (GitLab - uses manualStats)`);
			} else {
				console.warn(`Invalid GitHub URL for ${project.name}: ${project.github}`);
			}
			continue;
		}

		const { owner, repo } = parsed;
		console.log(`Fetching ${owner}/${repo}...`);

		try {
			const [repoData, latestRelease] = await Promise.all([
				fetchRepoData(owner, repo),
				fetchLatestRelease(owner, repo)
			]);

			if (repoData) {
				githubData[project.id] = {
					stars: repoData.stargazers_count,
					forks: repoData.forks_count,
					lastUpdate: repoData.pushed_at,
					description: repoData.description,
					license: repoData.license?.spdx_id,
					avatarUrl: `https://github.com/${owner}.png?size=128`,
					lastRelease: latestRelease?.published_at || null,
					releaseVersion: latestRelease?.tag_name || null,
					fetchedAt: new Date().toISOString()
				};
				const versionInfo = latestRelease?.tag_name ? ` (${latestRelease.tag_name})` : '';
				console.log(`  ✓ ${repoData.stargazers_count} stars${versionInfo}`);
			} else {
				console.warn(`  ✗ Failed to fetch repo data`);
			}
		} catch (error) {
			console.error(`  ✗ Error fetching ${project.name}:`, error.message);
		}

		// Small delay to be nice to GitHub API
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	// Write cache file
	const cachePath = join(__dirname, '..', 'static', 'data', 'github-cache.json');
	writeFileSync(cachePath, JSON.stringify(githubData, null, '\t'));
	console.log(`\nWrote cache to ${cachePath}`);
	console.log(`Cached ${Object.keys(githubData).length}/${projects.length} projects`);
}

main().catch(console.error);
