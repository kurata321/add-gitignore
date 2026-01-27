import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	const addToGitIgnore = vscode.commands.registerCommand('add-gitignore.addToGitIgnore', async (uri: vscode.Uri) => {
		await handleAdd(uri, '.gitignore');
	});

	const addToGitExclude = vscode.commands.registerCommand('add-gitignore.addToGitExclude', async (uri: vscode.Uri) => {
		await handleAdd(uri, '.git/info/exclude');
	});

	context.subscriptions.push(addToGitIgnore, addToGitExclude);
}

async function handleAdd(uri: vscode.Uri, targetRelativePath: string) {
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
	const targetPath = path.join(workspaceFolder.uri.fsPath, targetRelativePath);

	try {
		const targetDir = path.dirname(targetPath);
		if (!fs.existsSync(targetDir)) {
			if (targetRelativePath.startsWith('.git/')) {
				vscode.window.showErrorMessage('Git repository not found (.git directory missing).');
				return;
			}
			fs.mkdirSync(targetDir, { recursive: true });
		}

		// Check if already exists in file
		if (fs.existsSync(targetPath)) {
			const existingContent = fs.readFileSync(targetPath, 'utf8');
			const lines = existingContent.split(/\r?\n/);
			if (lines.includes(relativePath)) {
				vscode.window.showInformationMessage(`${relativePath} is already in ${targetRelativePath}`);
				return;
			}
		}

		const needsNewline = fs.existsSync(targetPath) && fs.readFileSync(targetPath, 'utf8').length > 0 && !fs.readFileSync(targetPath, 'utf8').endsWith('\n');
		const lineEnding = needsNewline ? '\n' : '';
		fs.appendFileSync(targetPath, `${lineEnding}${relativePath}\n`);
		vscode.window.showInformationMessage(`Added ${relativePath} to ${targetRelativePath}`);
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to add to ${targetRelativePath}: ${err}`);
	}
}

export function deactivate() {}
