import type { PageLoad } from './$types';

export interface BlogPostMeta {
	slug: string;
	title: string;
	date: string;
	author: string;
	description: string;
	tags: string[];
	readingTime: string;
}

export const load: PageLoad = async () => {
	// Automatically discover all blog posts from the file system
	const postModules = import.meta.glob<{
		metadata: Omit<BlogPostMeta, 'slug'>;
	}>('./**/+page.md', { eager: true });

	const posts: BlogPostMeta[] = [];

	for (const [path, module] of Object.entries(postModules)) {
		// Extract slug from path: ./some-post/+page.md -> some-post
		const slug = path.replace('./', '').replace('/+page.md', '');

		if (module.metadata) {
			posts.push({
				slug,
				...module.metadata
			});
		}
	}

	// Sort by date descending (newest first)
	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
};
