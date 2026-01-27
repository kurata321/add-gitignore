# add-gitignore

Quickly add files to `.gitignore` or `.git/info/exclude` from the VS Code explorer context menu.

## Features

- **Add to .gitignore**: Right-click a file and select "Add to .gitignore" to append its relative path to the workspace root's `.gitignore`.
- **Add to .git/info/exclude**: Right-click a file and select "Add to .git/info/exclude" to ignore it locally without modifying the shared `.gitignore` file.
- **Duplicate Prevention**: The extension checks if the file path is already present in the target ignore file before adding it.
- **Auto-formatting**: Ensures paths are added on a new line and formatted correctly.

## Usage

1. Open the Explorer view.
2. Right-click on the file or folder you want to ignore.
3. Choose either **Add to .gitignore** or **Add to .git/info/exclude**.

## Requirements

- A workspace must be open.
- For "Add to .git/info/exclude", a `.git` directory must exist in the workspace root.

## Release Notes

### 0.0.1

- Initial release with basic functionality to add files/folders to `.gitignore` and `.git/info/exclude`.

---
**Enjoy!**

