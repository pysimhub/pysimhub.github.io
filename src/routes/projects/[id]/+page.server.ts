import type { PageServerLoad, EntryGenerator } from './$types';
import { loadAllProjects } from '$lib/server/projects';
import { error } from '@sveltejs/kit';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const prerender = true;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const projects = await loadAllProjects(fetch);
	const project = projects.find((p) => p.id === params.id);

	if (!project) {
		throw error(404, 'Project not found');
	}

	// Find related projects (share at least one tag), sorted by number of shared tags
	const relatedProjects = projects
		.filter((p) => p.id !== project.id)
		.map((p) => ({
			project: p,
			sharedTags: p.tags.filter((tag) => project.tags.includes(tag)).length
		}))
		.filter((item) => item.sharedTags > 0)
		.sort((a, b) => b.sharedTags - a.sharedTags)
		.slice(0, 6)
		.map((item) => item.project);

	return {
		project,
		relatedProjects
	};
};

export const entries: EntryGenerator = () => {
	const projectsPath = join(process.cwd(), 'static', 'data', 'projects.json');
	const configs = JSON.parse(readFileSync(projectsPath, 'utf-8'));
	return configs.map((config: { id: string }) => ({ id: config.id }));
};
