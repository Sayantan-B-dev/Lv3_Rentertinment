from pathlib import Path

IGNORE_FOLDERS = {
    ".git",
    "__pycache__",
    ".venv",
    "venv",
    "node_modules",
    ".idea",
    ".vscode",
    ".next",
    "dist",
    "build"
}

def generate_tree(path: Path, prefix: str = ""):
    items = sorted(
        [item for item in path.iterdir() if item.name not in IGNORE_FOLDERS],
        key=lambda x: (x.is_file(), x.name.lower())
    )

    for index, item in enumerate(items):
        connector = "└── " if index == len(items) - 1 else "├── "
        print(f"{prefix}{connector}{item.name}")

        if item.is_dir():
            extension = "    " if index == len(items) - 1 else "│   "
            generate_tree(item, prefix + extension)

root_path = Path(".")
print(root_path.resolve().name)
generate_tree(root_path)