from pathlib import Path
import shutil

ROOT = Path.cwd()

OLD_APP_DIR = ROOT / "src" / "app"
NEW_APP_DIR = ROOT / "app"

OLD_GLOBALS = OLD_APP_DIR / "globals.css"
NEW_STYLES_DIR = ROOT / "styles"
NEW_GLOBALS = NEW_STYLES_DIR / "globals.css"

DOCS_DIR = ROOT / "docs"

DOC_FILES = [
    "ProjectDemo.html",
    "ProjectPlan.md",
    "ProjectSRS.md",
    "ProjectTree.py"
]

LEGACY_DIR = ROOT / "src" / "legacy" / "app"

DIRECTORIES_TO_CREATE = [
    "app",
    "components",
    "lib",
    "hooks",
    "types",
    "styles",
    "docs",
]

def create_directories():
    for directory in DIRECTORIES_TO_CREATE:
        directory_path = ROOT / directory
        directory_path.mkdir(parents=True, exist_ok=True)
        print(f"[CREATED] {directory_path}")

def move_app_directory():
    if OLD_APP_DIR.exists():
        if NEW_APP_DIR.exists():
            shutil.rmtree(NEW_APP_DIR)

        shutil.copytree(OLD_APP_DIR, NEW_APP_DIR)
        print(f"[MOVED] {OLD_APP_DIR} -> {NEW_APP_DIR}")
    else:
        print(f"[SKIPPED] {OLD_APP_DIR} not found")

def move_globals_css():
    NEW_STYLES_DIR.mkdir(parents=True, exist_ok=True)

    if OLD_GLOBALS.exists():
        shutil.copy2(OLD_GLOBALS, NEW_GLOBALS)
        print(f"[MOVED] {OLD_GLOBALS} -> {NEW_GLOBALS}")
    else:
        print(f"[SKIPPED] globals.css not found")

def update_layout_import():
    layout_file = NEW_APP_DIR / "layout.tsx"

    if not layout_file.exists():
        print(f"[SKIPPED] {layout_file} not found")
        return

    content = layout_file.read_text(encoding="utf-8")

    content = content.replace(
        'import "./globals.css"',
        'import "@/styles/globals.css"'
    )

    layout_file.write_text(content, encoding="utf-8")

    print(f"[UPDATED] {layout_file}")

def move_documentation():
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    for file_name in DOC_FILES:
        source = ROOT / file_name
        destination = DOCS_DIR / file_name

        if source.exists():
            shutil.move(str(source), str(destination))
            print(f"[MOVED] {source} -> {destination}")
        else:
            print(f"[SKIPPED] {source} not found")

def create_legacy_backup():
    if OLD_APP_DIR.exists():
        LEGACY_DIR.parent.mkdir(parents=True, exist_ok=True)

        if LEGACY_DIR.exists():
            shutil.rmtree(LEGACY_DIR)

        shutil.copytree(OLD_APP_DIR, LEGACY_DIR)

        note_file = LEGACY_DIR.parent / "note.txt"

        note_file.write_text(
            "Legacy backup generated automatically during migration.",
            encoding="utf-8"
        )

        print(f"[BACKUP] Legacy app backup created")

def remove_next_config_ts():
    next_config_ts = ROOT / "next.config.ts"

    if next_config_ts.exists():
        next_config_ts.unlink()
        print(f"[REMOVED] {next_config_ts}")
    else:
        print(f"[SKIPPED] next.config.ts not found")

def create_basic_files():
    files = {
        ROOT / "middleware.ts": "",
        ROOT / "tailwind.config.ts": "",
        ROOT / ".env.local": ""
    }

    for file_path, content in files.items():
        if not file_path.exists():
            file_path.write_text(content, encoding="utf-8")
            print(f"[CREATED] {file_path}")
        else:
            print(f"[EXISTS] {file_path}")

def main():
    print("\n=== BlueEye MIGRATION STARTED ===\n")

    create_directories()

    create_legacy_backup()

    move_app_directory()

    move_globals_css()

    update_layout_import()

    move_documentation()

    remove_next_config_ts()

    create_basic_files()

    print("\n=== MIGRATION COMPLETED ===\n")

if __name__ == "__main__":
    main()