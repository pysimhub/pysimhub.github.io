import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Project } from '$lib/types/project';

const fuseOptions: IFuseOptions<Project> = {
	keys: [
		{ name: 'name', weight: 2 },
		{ name: 'tagline', weight: 1.5 },
		{ name: 'tags', weight: 1.2 },
		{ name: 'description', weight: 0.5 }
	],
	threshold: 0.4,
	ignoreLocation: true,
	includeScore: true
};

let fuseInstance: Fuse<Project> | null = null;

export function initSearch(projects: Project[]): void {
	fuseInstance = new Fuse(projects, fuseOptions);
}

export function searchProjects(query: string, projects: Project[]): Project[] {
	if (!query.trim()) {
		return projects;
	}

	if (!fuseInstance) {
		initSearch(projects);
	}

	const results = fuseInstance!.search(query);
	return results.map((result) => result.item);
}

export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}
