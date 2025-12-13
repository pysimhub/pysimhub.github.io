# PySimHub

Community hub for Python simulation and numerics tools.

**Website:** [pysimhub.io](https://pysimhub.io)

## About

PySimHub is an open community catalog for Python simulation tools. We help researchers, engineers, and developers discover libraries across all simulation domains - from robotics and control systems to fluid dynamics and agent-based modeling.

## Submit a Project

Have a Python simulation library you'd like to add? We're open to submissions!

**Requirements:**
- Open source with a recognized license
- Available on PyPI or conda-forge
- Active maintenance (updated within the last 2 years)
- Documentation available

**How to submit:**
1. [Open a GitHub Issue](https://github.com/pysimhub/pysimhub.github.io/issues/new) with project details
2. Or submit a PR adding your project to `static/data/projects.json`

## Development

### Setup

```bash
npm install
```

### Development server

```bash
npm run dev
```

### Update GitHub data

Fetch live stats (stars, releases) from GitHub:

```bash
# With a GitHub token (recommended - 5000 req/hr)
GITHUB_TOKEN=your_token npm run fetch-github

# Or edit scripts/fetch-github-data.js with your token
npm run fetch-github
```

### Build

```bash
npm run build
```

### Type checking

```bash
npm run check
```

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) with static adapter
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Fuse.js](https://fusejs.io/) for fuzzy search
- [MDsveX](https://mdsvex.pngwn.io/) for blog posts
- GitHub Actions for deployment and data updates

## License

MIT
