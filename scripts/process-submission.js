#!/usr/bin/env node

/**
 * Process a project submission from a GitHub issue.
 * Parses the JSON, validates it, and outputs the project data.
 * Used by the process-submission GitHub Action.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function isValidUrl(string) {
	try {
		const url = new URL(string);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

function parseSubmission(issueBody) {
	// Extract JSON from the issue body
	const jsonMatch = issueBody.match(/### Project Data\s*\n```json\s*\n([\s\S]*?)\n```/);
	if (!jsonMatch) {
		throw new Error('Could not find Project Data JSON in issue body');
	}

	// Clean up JSON (remove trailing commas)
	let jsonStr = jsonMatch[1]
		.replace(/,\s*}/g, '}')
		.replace(/,\s*]/g, ']');

	let project;
	try {
		project = JSON.parse(jsonStr);
	} catch (parseError) {
		throw new Error(`Invalid JSON: ${parseError.message}`);
	}

	// Validate required fields
	const required = ['name', 'tagline', 'description', 'github'];
	const missing = required.filter(f => !project[f]);
	if (missing.length > 0) {
		throw new Error(`Missing required fields: ${missing.join(', ')}`);
	}

	// Validate tags
	if (!project.tags || !Array.isArray(project.tags) || project.tags.length === 0) {
		throw new Error('At least one tag is required');
	}

	// Validate URLs
	const urlFields = ['github', 'docs', 'pypi', 'condaForge', 'homepage', 'example'];
	const invalidUrls = [];
	for (const field of urlFields) {
		if (project[field] && !isValidUrl(project[field])) {
			invalidUrls.push(`${field}: ${project[field]}`);
		}
	}
	if (invalidUrls.length > 0) {
		throw new Error(`Invalid URLs:\n${invalidUrls.join('\n')}`);
	}

	// Generate ID from name
	const id = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	project.id = id;

	// Remove empty optional fields
	for (const key of ['docs', 'pypi', 'condaForge', 'homepage', 'example', 'description']) {
		if (project[key] === '') delete project[key];
	}

	// Check for logo
	const logoMatch = issueBody.match(/### Logo \(optional\)\s*\n\s*([\s\S]*?)(?=\n###|$)/);
	if (logoMatch) {
		const logoContent = logoMatch[1].trim();
		if (logoContent && logoContent !== '_No response_') {
			// Check for markdown image or URL
			const mdMatch = logoContent.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
			const urlMatch = logoContent.match(/(https?:\/\/\S+\.(png|svg|jpg|jpeg|webp|gif)(\?[^\s]*)?)/i);
			const ghMatch = logoContent.match(/(https:\/\/github\.com\/user-attachments\/assets\/[^\s)]+)/);

			const logoUrl = mdMatch?.[1] || urlMatch?.[1] || ghMatch?.[1];
			if (logoUrl) {
				project.logo = logoUrl;
			}
		}
	}

	return project;
}

function addProjectToFile(project, projectsPath) {
	const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'));

	// Check for duplicates
	if (projects.some(p => p.id === project.id)) {
		throw new Error(`Project with ID '${project.id}' already exists`);
	}

	projects.unshift(project);
	writeFileSync(projectsPath, JSON.stringify(projects, null, '\t') + '\n');

	return projects;
}

// Main execution
const issueBody = process.env.ISSUE_BODY;
const projectsPath = join(__dirname, '..', 'static', 'data', 'projects.json');

if (!issueBody) {
	console.error('ISSUE_BODY environment variable is required');
	process.exit(1);
}

try {
	const project = parseSubmission(issueBody);
	addProjectToFile(project, projectsPath);

	// Output for GitHub Actions
	console.log(`PROJECT_ID=${project.id}`);
	console.log(`PROJECT_NAME=${project.name}`);
	console.log(`PROJECT_TAGLINE=${project.tagline}`);
	console.log(`PROJECT_TAGS=${project.tags.join(', ')}`);
	console.log(`PROJECT_GITHUB=${project.github}`);

	// Write to GITHUB_OUTPUT if available
	if (process.env.GITHUB_OUTPUT) {
		const output = [
			`id=${project.id}`,
			`name=${project.name}`,
			`tagline=${project.tagline}`,
			`tags=${project.tags.join(', ')}`,
			`github=${project.github}`
		].join('\n');
		writeFileSync(process.env.GITHUB_OUTPUT, output + '\n', { flag: 'a' });
	}
} catch (error) {
	console.error(`ERROR=${error.message}`);
	process.exit(1);
}
