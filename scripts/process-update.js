#!/usr/bin/env node

/**
 * Process a project update from a GitHub issue.
 * Parses individual form fields, validates them, and applies changes to the project.
 * Used by the process-update GitHub Action.
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

function extractField(issueBody, label) {
	// Match "### Label\n\nvalue" or "### Label\n\nvalue\n\n### Next"
	const regex = new RegExp(`### ${label}\\s*\\n\\n([\\s\\S]*?)(?=\\n\\n###|$)`, 'i');
	const match = issueBody.match(regex);
	if (!match) return null;

	const value = match[1].trim();
	if (value === '_No response_' || value === '') return null;
	return value;
}

function extractCheckedTags(issueBody, label) {
	const regex = new RegExp(`### ${label}\\s*\\n\\n([\\s\\S]*?)(?=\\n\\n###|$)`, 'i');
	const match = issueBody.match(regex);
	if (!match) return [];

	const checkboxSection = match[1];
	const tags = [];

	// Match checked checkboxes: "- [X] tag-name" or "- [x] tag-name"
	const checkboxRegex = /- \[[xX]\] (.+)/g;
	let checkboxMatch;
	while ((checkboxMatch = checkboxRegex.exec(checkboxSection)) !== null) {
		tags.push(checkboxMatch[1].trim());
	}

	return tags;
}

function cleanUrl(url) {
	if (!url) return null;
	// Remove trailing quotes, brackets, and other invalid URL characters
	return url.replace(/["'<>\]\)]+$/, '').trim();
}

function extractLogoUrl(logoContent) {
	if (!logoContent) return null;

	// Check for markdown image
	const mdMatch = logoContent.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
	if (mdMatch) return cleanUrl(mdMatch[1]);

	// Check for GitHub user attachment (UUID format)
	const ghMatch = logoContent.match(/(https:\/\/github\.com\/user-attachments\/assets\/[a-f0-9-]+)/i);
	if (ghMatch) return cleanUrl(ghMatch[1]);

	// Check for direct image URL
	const urlMatch = logoContent.match(/(https?:\/\/\S+\.(png|svg|jpg|jpeg|webp|gif)(\?[^\s]*)?)/i);
	if (urlMatch) return cleanUrl(urlMatch[1]);

	return null;
}

function parseUpdate(issueBody) {
	// Extract project ID from dropdown
	const projectMatch = issueBody.match(/### Project\s*\n\n(\S+)/);
	if (!projectMatch) {
		throw new Error('Could not find project selection in issue body');
	}
	const projectId = projectMatch[1].trim();

	// Extract reason
	const reason = extractField(issueBody, 'Reason for Update') || 'No reason provided';

	// Build updates object from individual fields
	const updates = {};

	// Text fields
	const tagline = extractField(issueBody, 'Tagline');
	const description = extractField(issueBody, 'Description');
	const docs = extractField(issueBody, 'Documentation');
	const pypi = extractField(issueBody, 'PyPI');
	const condaForge = extractField(issueBody, 'Conda-Forge');
	const homepage = extractField(issueBody, 'Homepage');
	const example = extractField(issueBody, 'Example or Tutorial');

	if (tagline) updates.tagline = tagline;
	if (description) updates.description = description;
	if (docs) updates.docs = docs;
	if (pypi) updates.pypi = pypi;
	if (condaForge) updates.condaForge = condaForge;
	if (homepage) updates.homepage = homepage;
	if (example) updates.example = example;

	// Tags from checkboxes
	const checkedTags = extractCheckedTags(issueBody, 'Select new tags');
	const customTagsRaw = extractField(issueBody, 'Additional Tags');
	const customTags = customTagsRaw
		? customTagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
		: [];

	const allTags = [...checkedTags, ...customTags];
	if (allTags.length > 0) {
		updates.tags = allTags;
	}

	// Logo
	const logoContent = extractField(issueBody, 'Logo');
	const logoUrl = extractLogoUrl(logoContent);
	if (logoUrl) {
		updates.logo = logoUrl;
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

	if (Object.keys(updates).length === 0) {
		throw new Error('No updates provided. Please fill in at least one field to update.');
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
