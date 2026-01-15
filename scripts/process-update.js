#!/usr/bin/env node

/**
 * Process a project update from a GitHub issue.
 * Parses the update JSON, validates it, and applies changes to the project.
 * Used by the process-update GitHub Action.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fields that cannot be changed via update
const PROTECTED_FIELDS = ['id', 'name', 'github', 'submittedBy'];

// Fields that can be updated
const UPDATABLE_FIELDS = ['tagline', 'description', 'tags', 'docs', 'pypi', 'condaForge', 'homepage', 'example', 'logo'];

function isValidUrl(string) {
	try {
		const url = new URL(string);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

function parseUpdate(issueBody) {
	// Extract project ID from dropdown
	const projectMatch = issueBody.match(/### Project\s*\n\s*(\S+)/);
	if (!projectMatch) {
		throw new Error('Could not find project selection in issue body');
	}
	const projectId = projectMatch[1].trim();

	// Extract reason
	const reasonMatch = issueBody.match(/### Reason for update\s*\n\s*([\s\S]*?)(?=\n###|$)/);
	const reason = reasonMatch ? reasonMatch[1].trim() : 'No reason provided';

	// Extract JSON from the issue body
	const jsonMatch = issueBody.match(/### Updated Data\s*\n```json\s*\n([\s\S]*?)\n```/);
	if (!jsonMatch) {
		throw new Error('Could not find Updated Data JSON in issue body');
	}

	// Clean up JSON (remove trailing commas)
	let jsonStr = jsonMatch[1]
		.replace(/,\s*}/g, '}')
		.replace(/,\s*]/g, ']');

	let updates;
	try {
		updates = JSON.parse(jsonStr);
	} catch (parseError) {
		throw new Error(`Invalid JSON: ${parseError.message}`);
	}

	// Check for protected fields
	const protectedAttempts = Object.keys(updates).filter(key => PROTECTED_FIELDS.includes(key));
	if (protectedAttempts.length > 0) {
		throw new Error(`Cannot update protected fields: ${protectedAttempts.join(', ')}`);
	}

	// Check for unknown fields
	const unknownFields = Object.keys(updates).filter(key => !UPDATABLE_FIELDS.includes(key));
	if (unknownFields.length > 0) {
		throw new Error(`Unknown fields: ${unknownFields.join(', ')}`);
	}

	// Validate URLs
	const urlFields = ['docs', 'pypi', 'condaForge', 'homepage', 'example', 'logo'];
	const invalidUrls = [];
	for (const field of urlFields) {
		if (updates[field] && !isValidUrl(updates[field])) {
			invalidUrls.push(`${field}: ${updates[field]}`);
		}
	}
	if (invalidUrls.length > 0) {
		throw new Error(`Invalid URLs:\n${invalidUrls.join('\n')}`);
	}

	// Validate tags if provided
	if (updates.tags) {
		if (!Array.isArray(updates.tags) || updates.tags.length === 0) {
			throw new Error('Tags must be a non-empty array');
		}
	}

	return { projectId, updates, reason };
}

function applyUpdate(projectId, updates, projectsPath) {
	const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'));

	// Find the project
	const projectIndex = projects.findIndex(p => p.id === projectId);
	if (projectIndex === -1) {
		throw new Error(`Project with ID '${projectId}' not found`);
	}

	const project = projects[projectIndex];

	// Apply updates
	for (const [key, value] of Object.entries(updates)) {
		if (value === '' || value === null) {
			// Remove field if empty
			delete project[key];
		} else {
			project[key] = value;
		}
	}

	// Write back
	writeFileSync(projectsPath, JSON.stringify(projects, null, '\t') + '\n');

	return project;
}

// Main execution
const issueBody = process.env.ISSUE_BODY;
const issueAuthor = process.env.ISSUE_AUTHOR;
const projectsPath = join(__dirname, '..', 'static', 'data', 'projects.json');

if (!issueBody) {
	console.error('ISSUE_BODY environment variable is required');
	process.exit(1);
}

try {
	const { projectId, updates, reason } = parseUpdate(issueBody);
	const project = applyUpdate(projectId, updates, projectsPath);

	// Check if updater is different from original submitter
	const isOriginalSubmitter = project.submittedBy === issueAuthor;

	// Output for GitHub Actions
	console.log(`PROJECT_ID=${projectId}`);
	console.log(`PROJECT_NAME=${project.name}`);
	console.log(`UPDATED_FIELDS=${Object.keys(updates).join(', ')}`);
	console.log(`REASON=${reason}`);
	console.log(`IS_ORIGINAL_SUBMITTER=${isOriginalSubmitter}`);

	// Write to GITHUB_OUTPUT if available
	if (process.env.GITHUB_OUTPUT) {
		const output = [
			`id=${projectId}`,
			`name=${project.name}`,
			`updated_fields=${Object.keys(updates).join(', ')}`,
			`reason=${reason}`,
			`is_original_submitter=${isOriginalSubmitter}`,
			`original_submitter=${project.submittedBy || 'unknown'}`
		].join('\n');
		writeFileSync(process.env.GITHUB_OUTPUT, output + '\n', { flag: 'a' });
	}
} catch (error) {
	console.error(`ERROR=${error.message}`);
	process.exit(1);
}
