import type { PageServerLoad, EntryGenerator } from './$types';
import { loadAllProjects, getAllTags } from '$lib/server/projects';
import { error } from '@sveltejs/kit';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const prerender = true;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const tag = decodeURIComponent(params.tag);
	const allProjects = await loadAllProjects(fetch);

	// Find projects with this tag
	const projects = allProjects.filter((p) => p.tags.includes(tag));

	if (projects.length === 0) {
		throw error(404, `No projects found with tag "${tag}"`);
	}

	// Get all tags for the sidebar/related tags
	const allTags = getAllTags(allProjects);

	// Find related tags (tags that appear alongside this tag)
	const relatedTagCounts = new Map<string, number>();
	projects.forEach((project) => {
		project.tags.forEach((t) => {
			if (t !== tag) {
				relatedTagCounts.set(t, (relatedTagCounts.get(t) || 0) + 1);
			}
		});
	});

	const relatedTags = Array.from(relatedTagCounts.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10)
		.map(([t, count]) => ({ tag: t, count }));

	return {
		tag,
		projects,
		relatedTags,
		totalProjects: allProjects.length
	};
};

export const entries: EntryGenerator = () => {
	const projectsPath = join(process.cwd(), 'static', 'data', 'projects.json');
	const configs = JSON.parse(readFileSync(projectsPath, 'utf-8'));

	// Collect all unique tags
	const tags = new Set<string>();
	for (const config of configs) {
		if (config.tags) {
			config.tags.forEach((tag: string) => tags.add(tag));
		}
	}

	return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
};
