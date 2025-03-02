# Project Directory Tree Generator - Tree IT

This project provides two scripts to generate a directory tree structure for your project. Both scripts allow you to exclude common directories (like `.git`, `node_modules`, etc.),
handle large directories interactively, and output the tree in a markdown-friendly format (`.md`) or a plain text format (`.txt`).

## Features

- Interactive prompts for excluding large directories and overwriting existing output files.
- Supports Markdown (`.md`) formatting for easy integration with project documentation.
- Output can be saved in `.txt` or `.md` format.

## Usage

### Python Script

1. Navigate to the `python` directory and download the file.
2. Place it in the root directory of your project (or the directory you want to generate the tree for).
3. Open a terminal and navigate to the root directory of your project.
4. Run the script with the following command (Python 3.6 [or higher] required):

   ```bash
   python tree-it.py [output-file]
   ```

   - `output-file` is optional. If not provided, the default output file is `project-structure.txt`.
   - If you want the output in Markdown format, name the output file with a `.md` extension.

### JavaScript Script

1. Navigate to the `javascript` directory and download the file.
2. Place it in the root directory of your project (or the directory you want to generate the tree for).
3. Open a terminal and navigate to the root directory of your project.
4. Run the script with the following command (ensure you have Node.js 12 [or higher] installed):

   ```bash
   node tree-it.js [output-file]
   ```

   - `output-file` is optional. If not provided, the default output file is `project-structure.txt`.
   - If you want the output in Markdown format, name the output file with a `.md` extension.

## Examples

For Python:

```bash
python tree-it.py project-structure.md
```

For JavaScript:

```bash
node tree-it.js project-structure.md
```

Both commands will generate a tree structure of the current project and save it in Markdown format.

---

## .treeignore File

The `.treeignore` file allows you to specify which files and directories should be excluded from the generated directory tree.

It works similarly to the `.gitignore` file, but it takes priority over `.gitignore` if both are present.

### Format

- One line per `folder` or `file`.
- Wildcards are _not_ supported (e.g., `*.log`).
- Files inside a directory _cannot_ be excluded without excluding the directory itself.
- Lines starting with `#` are considered comments and are ignored.
- Blank lines are also ignored.

### .treeignore File Example

```plaintext
# Exclude .git and node_modules directories
.git
node_modules

# Exclude .gitignore file
.gitignore
```

Entries from the `.gitignore` will still be applied unless they are overridden by entries in the `.treeignore` (remember - wildcards are _not_ supported).

## Contributing to Project Directory Tree Generator

Thank you for considering contributing to this project! Here are a few ways you can help:

- **Bug reports**: If you encounter any issues, please open an issue on the GitHub repository.
- **Feature requests**: We welcome suggestions for new features.
- **Pull requests**: If you want to contribute code, fork the repository and create a pull request.

Please ensure any code follows the existing style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

---

## Like what I do?

If you find this project helpful or fun to use, consider supporting me on Ko-fi! Your support helps me keep creating and improving.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L02XV6J)
