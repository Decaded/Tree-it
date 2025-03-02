/**
================================================
Script: tree-it.js
Purpose: Generate project directory tree structure
Features:
- Excludes common directories and .gitignore patterns
- Detects large directories (>100 files)
- Interactive prompts for exclusions and overwrites
- Supports Markdown formatting (.md extension)
Usage: node tree-it.js [output-file]
Author: Decaded
GitHub: https://github.com/Decaded/tree-it
License: MIT License
================================================
**/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function loadGitignore() {
	const gitignorePath = path.join(process.cwd(), '.gitignore');
	if (fs.existsSync(gitignorePath)) {
		return fs
			.readFileSync(gitignorePath, 'utf8')
			.split('\n')
			.map(line => line.trim())
			.filter(line => line && !line.startsWith('#'));
	}
	return [];
}

function loadTreeignore() {
	const treeignorePath = path.join(process.cwd(), '.treeignore');
	if (fs.existsSync(treeignorePath)) {
		return fs
			.readFileSync(treeignorePath, 'utf8')
			.split('\n')
			.map(line => line.trim())
			.filter(line => line && !line.startsWith('#'));
	}
	return [];
}

function shouldExclude(entry, exclusions) {
	// Loop through all exclusions
	for (const pattern of exclusions) {
		// Convert glob pattern to a regex pattern
		const regex = new RegExp('^' + pattern.split('*').join('.*') + '$');

		// Check if the entry matches the pattern
		if (regex.test(entry)) {
			return true;
		}
	}
	return false;
}

function generateTree(dir, prefix = '', exclusions = []) {
	const entries = fs.readdirSync(dir, { withFileTypes: true }).filter(entry => !shouldExclude(entry.name, exclusions));
	let result = '';

	// Separate directories and files
	const dirs = entries.filter(entry => entry.isDirectory());
	const files = entries.filter(entry => entry.isFile());

	// Sort directories and files alphabetically
	dirs.sort((a, b) => a.name.localeCompare(b.name));
	files.sort((a, b) => a.name.localeCompare(b.name));

	// Combine directories and files in order
	const allEntries = [...dirs, ...files];

	allEntries.forEach((entry, index) => {
		const isLast = index === allEntries.length - 1;
		const connector = isLast ? '└── ' : '├── ';
		const newPrefix = prefix + (isLast ? '    ' : '│   ');
		result += `${prefix}${connector}${entry.name}\n`;

		if (entry.isDirectory()) {
			result += generateTree(path.join(dir, entry.name), newPrefix, exclusions);
		}
	});
	return result;
}

function askQuestion(query) {
	return new Promise(resolve => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question(query, answer => {
			rl.close();
			resolve(answer.trim());
		});
	});
}

async function generateProjectTree(outputFile, format = 'txt') {
	const projectRoot = path.resolve('.');
	let exclusions = [...loadTreeignore(), ...loadGitignore()];

	if (exclusions.length === 0) {
		const entries = fs.readdirSync(projectRoot, { withFileTypes: true });
		const largeFolders = entries.filter(entry => entry.isDirectory() && fs.readdirSync(path.join(projectRoot, entry.name)).length > 100);

		if (largeFolders.length > 0) {
			console.log(`Detected large directories: ${largeFolders.map(f => f.name).join(', ')}`);
			const answer = await askQuestion(`Exclude these? (Y/n): `);
			if (answer.toLowerCase() !== 'n') {
				exclusions.push(...largeFolders.map(f => f.name));
			}
		}
	}

	let tree = generateTree(projectRoot, '', exclusions);
	if (format === 'md') {
		tree = '```text\n' + tree + '```';
	}

	if (fs.existsSync(outputFile)) {
		const answer = await askQuestion(`${outputFile} already exists. Overwrite? (Y/n): `);
		if (answer.toLowerCase() === 'n') {
			console.log('Operation canceled.');
			return;
		}
	}

	fs.writeFileSync(outputFile, tree, 'utf8');
	console.log(`Project tree saved to ${outputFile}`);
}

// Usage: node script.js output.txt (or output.md for markdown)
(async () => {
	const args = process.argv.slice(2);
	const outputFile = args[0] || 'project-structure.txt';
	const format = outputFile.endsWith('.md') ? 'md' : 'txt';
	await generateProjectTree(outputFile, format);
})();
