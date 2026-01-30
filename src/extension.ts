import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	const addToGitIgnore = vscode.commands.registerCommand('add-gitignore.addToGitIgnore', async (uri: vscode.Uri) => {
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
		if (!workspaceFolder) {
			vscode.window.showErrorMessage('Selected file is not in a workspace.');
			return;
		}
		const targetPath = path.join(workspaceFolder.uri.fsPath, '.gitignore');
		await handleAdd(uri, targetPath, '.gitignore');
	});

	const addToGitExclude = vscode.commands.registerCommand('add-gitignore.addToGitExclude', async (uri: vscode.Uri) => {
		if (!uri) {
			vscode.window.showErrorMessage('No file selected.');
			return;
		}

		const excludePath = findGitExcludePath(path.dirname(uri.fsPath));
		if (!excludePath) {
			vscode.window.showErrorMessage('Git repository not found (could not find .git directory or file in parent directories).');
			return;
		}

		await handleAdd(uri, excludePath, '.git/info/exclude');
	});

	context.subscriptions.push(addToGitIgnore, addToGitExclude);
}

function findGitExcludePath(startDir: string): string | undefined {
	let currentDir = startDir;
	while (true) {
		const gitPath = path.join(currentDir, '.git');
		if (fs.existsSync(gitPath)) {
			const stats = fs.statSync(gitPath);
			if (stats.isDirectory()) {
				// Standard repo
				return path.join(gitPath, 'info', 'exclude');
			} else if (stats.isFile()) {
				// Git worktree or submodule: .git is a file with "gitdir: ..." content
				const content = fs.readFileSync(gitPath, 'utf8').trim();
				const match = content.match(/^gitdir:\s*(.+)$/);
				if (match) {
					let gitDir = match[1].trim();
					if (!path.isAbsolute(gitDir)) {
						gitDir = path.resolve(currentDir, gitDir);
					}

					// Check for commondir in the worktree's gitDir
					const commonDirPath = path.join(gitDir, 'commondir');
					if (fs.existsSync(commonDirPath)) {
						let commonDir = fs.readFileSync(commonDirPath, 'utf8').trim();
						if (!path.isAbsolute(commonDir)) {
							commonDir = path.resolve(gitDir, commonDir);
						}
						return path.join(commonDir, 'info', 'exclude');
					}
					return path.join(gitDir, 'info', 'exclude');
				}
			}
		}

		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) {
			break;
		}
		currentDir = parentDir;
	}

	return undefined;
}

async function handleAdd(uri: vscode.Uri, targetPath: string, displayPath: string) {
	if (!uri) {
		vscode.window.showErrorMessage('No file selected.');
		return;
	}

	const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
	if (!workspaceFolder) {
		vscode.window.showErrorMessage('Selected file is not in a workspace.');
		return;
	}

	const relativePath = path.relative(workspaceFolder.uri.fsPath, uri.fsPath).replace(/\\/g, '/');

	try {
		const targetDir = path.dirname(targetPath);
		if (!fs.existsSync(targetDir)) {
			fs.mkdirSync(targetDir, { recursive: true });
		}

		// Check if already exists in file
		if (fs.existsSync(targetPath)) {
			const existingContent = fs.readFileSync(targetPath, 'utf8');
			const lines = existingContent.split(/\r?\n/);
			if (lines.includes(relativePath)) {
				vscode.window.showInformationMessage(`${relativePath} is already in ${displayPath}`);
				return;
			}
		}

		const needsNewline = fs.existsSync(targetPath) && fs.readFileSync(targetPath, 'utf8').length > 0 && !fs.readFileSync(targetPath, 'utf8').endsWith('\n');
		const lineEnding = needsNewline ? '\n' : '';
		fs.appendFileSync(targetPath, `${lineEnding}${relativePath}\n`);
		vscode.window.showInformationMessage(`Added ${relativePath} to ${displayPath}`);
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to add to ${displayPath}: ${err}`);
	}
}

export function deactivate() { }
