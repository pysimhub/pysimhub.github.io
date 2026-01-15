#!/usr/bin/env node

/**
 * Script to sync data from projects.json to issue templates.
 * - Syncs tags to project_submission.yml
 * - Syncs project IDs to project_update.yml
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadProjects() {
	const projectsPath = join(__dirname, '..', 'static', 'data', 'projects.json');
	return JSON.parse(readFileSync(projectsPath, 'utf-8'));
}

function syncTags(projects) {
	const templatePath = join(__dirname, '..', '.github', 'ISSUE_TEMPLATE', 'project_submission.yml');

	if (!existsSync(templatePath)) {
		console.log('Skipping tags sync: project_submission.yml not found');
		return;
	}

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
	console.log(`Updated project_submission.yml with ${tags.length} tags`);
}

function syncProjectIds(projects) {
	const templatePath = join(__dirname, '..', '.github', 'ISSUE_TEMPLATE', 'project_update.yml');

	if (!existsSync(templatePath)) {
		console.log('Skipping project IDs sync: project_update.yml not found');
		return;
	}

	// Extract all project IDs and sort alphabetically
	const projectIds = projects.map(p => p.id).sort();
	console.log(`Found ${projectIds.length} projects`);

	// Read issue template
	let template = readFileSync(templatePath, 'utf-8');

	// Build the new options list with proper YAML indentation
	const optionsYaml = projectIds.map(id => `        - ${id}`).join('\n');

	// Replace the options section under the project_id dropdown
	// Match from "options:" to the next field (validations:)
	template = template.replace(
		/(id: project_id\n[\s\S]*?options:\n)([\s\S]*?)(\n\s+validations:)/,
		`$1${optionsYaml}$3`
	);

	// Write updated template
	writeFileSync(templatePath, template);
	console.log(`Updated project_update.yml with ${projectIds.length} project options`);
}

function main() {
	const projects = loadProjects();

	syncTags(projects);
	syncProjectIds(projects);

	console.log('Issue templates sync complete');
}

main();
