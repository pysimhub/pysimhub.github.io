#!/usr/bin/env node

/**
 * Process a project removal request from a GitHub issue.
 * Parses the issue body, validates the request, and removes the project.
 * Used by the process-removal GitHub Action.
 */

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function extractField(issueBody, label) {
	// Match "### Label\n\nvalue" or "### Label\n\nvalue\n\n### Next"
	const regex = new RegExp(`### ${label}\\s*\\n\\n([\\s\\S]*?)(?=\\n\\n###|$)`, 'i');
	const match = issueBody.match(regex);
	if (!match) return null;

	const value = match[1].trim();
	if (value === '_No response_' || value === '') return null;
	return value;
}

function parseRemoval(issueBody) {
	// Extract project ID from dropdown
	const projectMatch = issueBody.match(/### Project\s*\n\n(\S+)/);
	if (!projectMatch) {
		throw new Error('Could not find project selection in issue body');
	}
	const projectId = projectMatch[1].trim();

	// Extract reason type from dropdown
	const reasonTypeMatch = issueBody.match(/### Reason for Removal\s*\n\n(.+)/);
	if (!reasonTypeMatch) {
		throw new Error('Could not find reason for removal in issue body');
	}
	const reasonType = reasonTypeMatch[1].trim();

	// Extract additional details (optional)
	const reasonDetails = extractField(issueBody, 'Additional Details');

	return { projectId, reasonType, reasonDetails };
}

function removeProject(projectId, projectsPath, logosDir) {
	const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'));

	// Find the project
	const projectIndex = projects.findIndex(p => p.id === projectId);
	if (projectIndex === -1) {
		throw new Error(`Project with ID '${projectId}' not found`);
	}

	const project = projects[projectIndex];

	// Remove logo file if it exists locally
	if (project.logo && project.logo.startsWith('/logos/')) {
		const logoFilename = project.logo.replace('/logos/', '');
		const logoPath = join(logosDir, logoFilename);
		if (existsSync(logoPath)) {
			unlinkSync(logoPath);
			console.log(`Deleted logo file: ${logoPath}`);
		}
	}

	// Remove the project from the array
	projects.splice(projectIndex, 1);

	// Write back
	writeFileSync(projectsPath, JSON.stringify(projects, null, '\t') + '\n');

	return project;
}

// Main execution
const issueBody = process.env.ISSUE_BODY;
const issueAuthor = process.env.ISSUE_AUTHOR;
const projectsPath = join(__dirname, '..', 'static', 'data', 'projects.json');
const logosDir = join(__dirname, '..', 'static', 'logos');

if (!issueBody) {
	console.error('ISSUE_BODY environment variable is required');
	process.exit(1);
}

try {
	const { projectId, reasonType, reasonDetails } = parseRemoval(issueBody);
	const project = removeProject(projectId, projectsPath, logosDir);

	// Output for GitHub Actions
	console.log(`PROJECT_ID=${projectId}`);
	console.log(`PROJECT_NAME=${project.name}`);
	console.log(`REASON_TYPE=${reasonType}`);
	console.log(`REASON_DETAILS=${reasonDetails || ''}`);
	console.log(`ORIGINAL_SUBMITTER=${project.submittedBy || 'unknown'}`);

	// Write to GITHUB_OUTPUT if available
	if (process.env.GITHUB_OUTPUT) {
		const output = [
			`id=${projectId}`,
			`name=${project.name}`,
			`reason_type=${reasonType}`,
			`reason_details=${reasonDetails || ''}`,
			`original_submitter=${project.submittedBy || 'unknown'}`
		].join('\n');
		writeFileSync(process.env.GITHUB_OUTPUT, output + '\n', { flag: 'a' });
	}
} catch (error) {
	console.error(`ERROR=${error.message}`);
	process.exit(1);
}
