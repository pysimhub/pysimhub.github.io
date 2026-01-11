#!/usr/bin/env node

/**
 * Script to sync tags from projects.json to the issue template.
 * Updates the Available Tags list in the markdown section.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function main() {
	// Load projects
	const projectsPath = join(__dirname, '..', 'static', 'data', 'projects.json');
	const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'));

	// Extract all unique tags
	const tagsSet = new Set();
	for (const project of projects) {
		if (project.tags) {
			project.tags.forEach(tag => tagsSet.add(tag));
		}
	}
	const tags = Array.from(tagsSet).sort();
	console.log(`Found ${tags.length} unique tags: ${tags.join(', ')}`);

	// Read issue template
	const templatePath = join(__dirname, '..', '.github', 'ISSUE_TEMPLATE', 'project_submission.yml');
	let template = readFileSync(templatePath, 'utf-8');

	// Build the new tags line with backticks
	const tagsLine = tags.map(t => `\`${t}\``).join(' ');

	// Replace the Available Tags line (matches line starting with backtick after "### Available Tags")
	template = template.replace(
		/(### Available Tags\n\s+)`[^`]+`(?:\s+`[^`]+`)*/,
		`$1${tagsLine}`
	);

	// Write updated template
	writeFileSync(templatePath, template);
	console.log(`Updated issue template with ${tags.length} tags`);
}

main();
