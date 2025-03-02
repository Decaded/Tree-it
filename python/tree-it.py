"""
================================================
Script: tree-it.py
Purpose: Generate project directory tree structure
Features:
- Excludes common directories and .gitignore patterns
- Detects large directories (>100 files)
- Interactive prompts for exclusions and overwrites
- Supports Markdown formatting (.md extension)
Usage: python tree-it.py [output-file]
Author: Decaded
GitHub: https://github.com/Decaded/tree-it
License: MIT License
================================================
"""

import os
import sys
import glob

def load_gitignore():
    """Load patterns from .gitignore file, ignoring comments and empty lines."""
    gitignore_path = os.path.join(os.getcwd(), '.gitignore')
    exclusions = []
    if os.path.exists(gitignore_path):
        with open(gitignore_path, 'r', encoding='utf-8') as f:
            for line in f:
                cleaned_line = line.strip()
                if cleaned_line and not cleaned_line.startswith('#'):
                    exclusions.append(cleaned_line)
    return exclusions

def load_treeignore():
    """Load patterns from .treeignore file, ignoring comments and empty lines."""
    treeignore_path = os.path.join(os.getcwd(), '.treeignore')
    exclusions = []
    if os.path.exists(treeignore_path):
        with open(treeignore_path, 'r', encoding='utf-8') as f:
            for line in f:
                cleaned_line = line.strip()
                if cleaned_line and not cleaned_line.startswith('#'):
                    exclusions.append(cleaned_line)
    return exclusions

def should_exclude(entry, exclusions):
    """Check if an entry matches any exclusion pattern."""
    for pattern in exclusions:
        # Check if the entry matches the pattern using glob
        if glob.fnmatch.fnmatch(entry, pattern):
            return True
    return False

def generate_tree(dir_path, prefix='', exclusions=[]):
    """
    Recursively generate directory tree structure.
    
    Args:
        dir_path (str): Directory to process
        prefix (str):   Current indentation prefix
        exclusions (list): Patterns to exclude
    
    Returns:
        str: Formatted tree structure
    """
    try:
        entries = [e for e in os.scandir(dir_path) if not should_exclude(e.name, exclusions)]
        
        # Separate directories and files, sort them
        dirs = [e for e in entries if e.is_dir()]
        files = [e for e in entries if e.is_file()]
        
        # Sort directories and files alphabetically
        dirs.sort(key=lambda x: x.name)
        files.sort(key=lambda x: x.name)
        
        # Combine the directories and files back together
        entries = dirs + files
    except PermissionError:
        return ''
    
    tree = ''
    for index, entry in enumerate(entries):
        is_last = index == len(entries) - 1
        connector = '└── ' if is_last else '├── '
        new_prefix = prefix + ('    ' if is_last else '│   ')
        
        tree += f"{prefix}{connector}{entry.name}\n"
        
        if entry.is_dir():
            tree += generate_tree(entry.path, new_prefix, exclusions)
    
    return tree

def main():
    """Main execution flow."""
    output_file = sys.argv[1] if len(sys.argv) > 1 else 'project-structure.txt'
    format = 'md' if output_file.endswith('.md') else 'txt'
    
    # Build exclusion list from .treeignore (priority) or .gitignore
    exclusions = load_treeignore() or load_gitignore()
    
    # Overwrite confirmation
    if os.path.exists(output_file):
        answer = input(f"{output_file} already exists. Overwrite? (Y/n): ").strip().lower()
        if answer == 'n':
            print("Operation canceled.")
            return
    
    # Generate and format tree
    tree = generate_tree('.', '', exclusions)
    if format == 'md':
        tree = f'```text\n{tree}```'
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(tree)
    
    print(f"Project tree saved to {output_file}")

if __name__ == "__main__":
    main()
