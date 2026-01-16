import type { RequestHandler } from './$types';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const prerender = true;

const SITE_URL = 'https://pysimhub.io';

// Static pages with their priority and change frequency
const staticPages = [
	{ path: '/', priority: 1.0, changefreq: 'daily' },
	{ path: '/about', priority: 0.6, changefreq: 'monthly' },
	{ path: '/submit', priority: 0.5, changefreq: 'monthly' }
];

// Get all project pages
function getProjectPages() {
	const projectsPath = join(process.cwd(), 'static', 'data', 'projects.json');
	const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'));
	return projects.map((p: { id: string }) => ({
		path: `/projects/${p.id}`,
		priority: 0.8,
		changefreq: 'weekly'
	}));
}

export const GET: RequestHandler = async () => {
	const allPages = [...staticPages, ...getProjectPages()];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
