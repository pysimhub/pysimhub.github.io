import type { RequestHandler } from './$types';

export const prerender = true;

const SITE_URL = 'https://pysimhub.io';

// Static pages with their priority and change frequency
const staticPages = [
	{ path: '/', priority: 1.0, changefreq: 'weekly' },
	{ path: '/about', priority: 0.8, changefreq: 'monthly' },
	{ path: '/blog', priority: 0.9, changefreq: 'weekly' },
	{ path: '/news', priority: 0.7, changefreq: 'weekly' },
	{ path: '/submit', priority: 0.6, changefreq: 'monthly' }
];

// Blog posts - add new posts here
const blogPosts = [
	{ path: '/blog/formatting-guide', priority: 0.7, changefreq: 'monthly' }
];

export const GET: RequestHandler = async () => {
	const allPages = [...staticPages, ...blogPosts];

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
