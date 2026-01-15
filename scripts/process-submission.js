#!/usr/bin/env node

/**
 * Process a project submission from a GitHub issue.
 * Parses individual form fields, validates them, and outputs the project data.
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

function parseSubmission(issueBody) {
	const project = {};

	// Extract basic fields
	project.name = extractField(issueBody, 'Project Name');
	project.tagline = extractField(issueBody, 'Tagline');
	project.description = extractField(issueBody, 'Description');

	// Validate required fields
	const required = ['name', 'tagline', 'description'];
	const missing = required.filter(f => !project[f]);
	if (missing.length > 0) {
		throw new Error(`Missing required fields: ${missing.join(', ')}`);
	}

	// Extract tags from checkboxes
	const checkedTags = extractCheckedTags(issueBody, 'Select all tags that apply');
	const customTagsRaw = extractField(issueBody, 'Additional Tags');
	const customTags = customTagsRaw
		? customTagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
		: [];

	project.tags = [...checkedTags, ...customTags];

	if (project.tags.length === 0) {
		throw new Error('At least one tag is required');
	}

	// Extract URLs
	project.github = extractField(issueBody, 'GitHub Repository');
	if (!project.github) {
		throw new Error('GitHub Repository is required');
	}

	const docs = extractField(issueBody, 'Documentation');
	const pypi = extractField(issueBody, 'PyPI');
	const condaForge = extractField(issueBody, 'Conda-Forge');
	const homepage = extractField(issueBody, 'Homepage');
	const example = extractField(issueBody, 'Example or Tutorial');

	if (docs) project.docs = docs;
	if (pypi) project.pypi = pypi;
	if (condaForge) project.condaForge = condaForge;
	if (homepage) project.homepage = homepage;
	if (example) project.example = example;

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
	project.id = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

	// Extract logo
	const logoContent = extractField(issueBody, 'Logo');
	const logoUrl = extractLogoUrl(logoContent);
	if (logoUrl) {
		project.logo = logoUrl;
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
const issueAuthor = process.env.ISSUE_AUTHOR;
const projectsPath = join(__dirname, '..', 'static', 'data', 'projects.json');

if (!issueBody) {
	console.error('ISSUE_BODY environment variable is required');
	process.exit(1);
}

try {
	const project = parseSubmission(issueBody);

	// Store the submitter's GitHub handle
	if (issueAuthor) {
		project.submittedBy = issueAuthor;
	}

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
