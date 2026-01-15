<img src="static/branding/logo-with-text.svg" alt="PySimHub" width="500">

## About

PySimHub is an open community catalog for Python simulation tools. We help researchers, engineers, and developers discover libraries across all simulation domains - from robotics and control systems to fluid dynamics and agent-based modeling.

## Submit a Project

Have a Python simulation library you'd like to add?

**Requirements:**
- Open source with a recognized license
- Available on PyPI or conda-forge
- Active maintenance (updated within the last 2 years)
- Documentation available

**How to submit:**

Use our [submission form](https://github.com/pysimhub/pysimhub.github.io/issues/new?template=project_submission.yml) - a PR will be created automatically.

## Update a Project

Need to fix a broken link or update project information?

Use our [update form](https://github.com/pysimhub/pysimhub.github.io/issues/new?template=project_update.yml) - a PR will be created automatically.

## Remove a Project

Need to remove a project (abandoned, duplicate, author request)?

Use our [removal form](https://github.com/pysimhub/pysimhub.github.io/issues/new?template=project_removal.yml) - a PR will be created for maintainer review.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build
npm run build

# Type check
npm run check
```

### Update GitHub data

Fetch live stats (stars, releases) from GitHub:

```bash
# With a GitHub token (recommended - 5000 req/hr)
GITHUB_TOKEN=your_token npm run fetch-github

# Without token (60 req/hr)
npm run fetch-github
```

## Automation

GitHub Actions handle:
- **Daily data updates** - Fetches GitHub stats at 6 AM UTC
- **Project submissions** - Converts issue forms to PRs
- **Project updates** - Converts update forms to PRs
- **Project removals** - Converts removal requests to PRs
- **Link checking** - Weekly validation with submitter notifications
- **Deployment** - Auto-deploys to GitHub Pages on changes

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) with static adapter
- [Svelte 5](https://svelte.dev/) with runes
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Fuse.js](https://fusejs.io/) for fuzzy search
- [MDsveX](https://mdsvex.pngwn.io/) for markdown content
- GitHub Actions for CI/CD

## License

MIT
