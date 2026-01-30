# add-gitignore

Quickly add files to `.gitignore` or `.git/info/exclude` from the VS Code explorer context menu.

## Features

- **Git Ignore Submenu**: Commands are neatly grouped under a "Git Ignore" submenu in the context menu for a cleaner experience.
- **Add to .gitignore**: Appends the relative path of the selected file to the workspace root's `.gitignore`.
- **Add to .git/info/exclude (Worktree Support)**: Ignores the file locally. Now supports **Git worktrees** and searches for the `.git` directory upwards from the selected file.
- **Duplicate Prevention**: The extension checks if the file path is already present in the target ignore file before adding it.
- **Auto-formatting**: Ensures paths are added on a new line and formatted correctly.

## Usage

1. Open the Explorer view.
2. Right-click on the file or folder you want to ignore.
3. Choose **Git Ignore**, then select either **Add to .gitignore** or **Add to .git/info/exclude**.

## Requirements

- A workspace must be open.
- For "Add to .git/info/exclude", a `.git` directory or file (for worktrees) must exist in the repository structure.

## Release Notes

### 0.0.3

- **Git Worktree Support**: Added support for Git worktrees when adding to `.git/info/exclude`.
- **Improved Discovery**: The extension now searches for the `.git` directory/file upwards from the selected file, making it more robust when working in subfolders.

### 0.0.2

- Improved extension compatibility and metadata.

### 0.0.1

- Initial release with basic functionality to add files/folders to `.gitignore` and `.git/info/exclude`.

---
**Enjoy!**

