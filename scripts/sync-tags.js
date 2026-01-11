#!/usr/bin/env node

/**
 * Script to sync tags from projects.json to the issue template.
 * Keeps the submission form's tag dropdown in sync with actual tags used.
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
	const lines = readFileSync(templatePath, 'utf-8').split('\n');

	// Find the tags dropdown options section and replace it
	let inTagsDropdown = false;
	let inOptions = false;
	let optionsIndent = '';
	const newLines = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// Detect entering the tags dropdown
		if (line.includes('id: tags')) {
			inTagsDropdown = true;
		}

		// Detect options start within tags dropdown
		if (inTagsDropdown && line.trim().startsWith('options:')) {
			inOptions = true;
			optionsIndent = line.match(/^(\s*)/)[1] + '  '; // indent for option items
			newLines.push(line);
			// Add all tags
			for (const tag of tags) {
				newLines.push(`${optionsIndent}- ${tag}`);
			}
			continue;
		}

		// Skip old option lines
		if (inOptions && line.trim().startsWith('- ') && !line.trim().startsWith('- type:')) {
			continue;
		}

		// Detect end of options (validations section)
		if (inOptions && line.trim().startsWith('validations:')) {
			inOptions = false;
			inTagsDropdown = false;
		}

		newLines.push(line);
	}

	// Write updated template
	writeFileSync(templatePath, newLines.join('\n'));
	console.log(`Updated issue template with ${tags.length} tags`);
}

main();
