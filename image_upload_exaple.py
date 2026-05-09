import os
import json
import requests
import threading
from pathlib import Path
from dotenv import load_dotenv
from imagekitio import ImageKit
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

from rich.console import Console
from rich.progress import (
    Progress, SpinnerColumn, BarColumn,
    TextColumn, TimeElapsedColumn, TimeRemainingColumn, MofNCompleteColumn
)
from rich.panel import Panel
from rich.table import Table

load_dotenv()

console = Console()

INPUT_FILE    = "structured_data.json"
OUTPUT_FILE   = "structured_data_updated.json"
PROGRESS_FILE = "migration_progress.json"
LOG_FILE      = "log.txt"
TEMP_DIR      = Path("temp_uploads")

# ── Thread-safe locks ─────────────────────────────────────────────────────────
progress_lock = threading.Lock()
output_lock   = threading.Lock()
log_lock      = threading.Lock()
console_lock  = threading.Lock()

# ── ImageKit: one client per thread (not thread-safe to share) ────────────────
thread_local = threading.local()

def get_imagekit():
    if not hasattr(thread_local, "client"):
        thread_local.client = ImageKit(
            private_key=os.getenv("IMAGEKIT_PRIVATE_KEY")
        )
    return thread_local.client

# ── Load data ─────────────────────────────────────────────────────────────────
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    artists = json.load(f)

if Path(PROGRESS_FILE).exists():
    with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
        progress_data = json.load(f)
    console.print(f"[yellow]⚡ Resuming — {len(progress_data)} artists already done[/yellow]")
else:
    progress_data = {}
    console.print("[green]Fresh run[/green]")

already_done = sum(1 for a in artists if str(a.get("id")) in progress_data and progress_data[str(a.get("id"))]["status"] == "done")

console.print(Panel(
    f"[bold green]ImageKit Image Migrator — Multithreaded[/bold green]\n"
    f"[white]Total artists :[/white] [cyan]{len(artists)}[/cyan]\n"
    f"[white]Already done  :[/white] [cyan]{already_done}[/cyan]\n"
    f"[white]Remaining     :[/white] [cyan]{len(artists) - already_done}[/cyan]\n"
    f"[white]Workers       :[/white] [cyan]10 threads[/cyan]",
    title="Config", border_style="green"
))

# ── Shared state ──────────────────────────────────────────────────────────────
results_map  = {}   # artist_id -> updated artist dict
log_entries  = {}   # artist_id -> log entry

def save_progress():
    with progress_lock:
        with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
            json.dump(progress_data, f, ensure_ascii=False, indent=2)

def write_log():
    entries = list(log_entries.values())
    with log_lock:
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            f.write(f"Migration Log — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 60 + "\n\n")
            failed  = [e for e in entries if e["status"] == "FAILED"]
            partial = [e for e in entries if e["status"] == "PARTIAL"]
            success = [e for e in entries if e["status"] == "SUCCESS"]
            f.write(f"SUMMARY\n  Total: {len(entries)}  Success: {len(success)}  Partial: {len(partial)}  Failed: {len(failed)}\n\n")
            for label, group in [("FULLY FAILED", failed), ("PARTIALLY FAILED", partial)]:
                if group:
                    f.write(f"{label}\n" + "-" * 40 + "\n")
                    for e in group:
                        f.write(f"  ID: {str(e['id']):>5}  |  {e['name']}  |  {e['category']}\n")
                        for err in e.get("errors", []):
                            f.write(f"             -> {err}\n")
                    f.write("\n")

def flush_output():
    # Write output in original artist order
    ordered = [results_map[str(a["id"])] for a in artists if str(a["id"]) in results_map]
    with output_lock:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(ordered, f, ensure_ascii=False, indent=4)

# ── Worker function (runs per artist) ────────────────────────────────────────
def process_artist(artist, prog, task_id):
    artist_id      = str(artist.get("id", "?"))
    artist_name    = artist.get("name", "Unknown")
    artist_slug    = artist.get("slug", "unknown")
    category       = artist.get("category", "Uncategorized")
    input_category = artist.get("source", {}).get("input_category", "uncategorized")
    images         = artist.get("media", {}).get("images", [])

    ik      = get_imagekit()
    ik_folder = f"/{input_category}/{artist_slug}/"
    temp_dir  = TEMP_DIR / input_category / artist_slug
    temp_dir.mkdir(parents=True, exist_ok=True)

    # ── Already fully done ────────────────────────────────────────────────────
    with progress_lock:
        checkpoint = progress_data.get(artist_id, {})

    if checkpoint.get("status") == "done":
        artist["media"]["images"] = checkpoint["urls"]
        results_map[artist_id] = artist
        log_entries[artist_id] = {
            "id": artist_id, "name": artist_name,
            "category": category, "status": "SUCCESS", "errors": []
        }
        prog.advance(task_id)
        return

    # ── Resume partial ────────────────────────────────────────────────────────
    already_uploaded = list(checkpoint.get("urls", []))
    start_index      = len(already_uploaded)

    if start_index > 0:
        with console_lock:
            console.print(f"  [yellow]↩ [{artist_id}] {artist_name} — resuming from img {start_index + 1}[/yellow]")

    if not images:
        artist["media"]["images"] = []
        results_map[artist_id] = artist
        with progress_lock:
            progress_data[artist_id] = {"status": "done", "urls": []}
        save_progress()
        log_entries[artist_id] = {
            "id": artist_id, "name": artist_name,
            "category": category, "status": "SUCCESS", "errors": []
        }
        prog.advance(task_id)
        return

    artist_errors   = []
    uploaded_images = list(already_uploaded)

    for index in range(start_index, len(images)):
        image_url = images[index]
        try:
            response = requests.get(
                image_url, timeout=30,
                headers={"User-Agent": "Mozilla/5.0"}
            )

            if response.status_code != 200:
                msg = f"Image {index+1}: HTTP {response.status_code}"
                artist_errors.append(msg)
                with console_lock:
                    console.print(f"    [red]✗ [{artist_id}] img {index+1} — HTTP {response.status_code}[/red]")
                continue

            extension  = os.path.splitext(image_url.split("?")[0])[1] or ".jpg"
            file_name  = f"image-{index + 1}{extension}"
            local_file = temp_dir / file_name

            with open(local_file, "wb") as fh:
                fh.write(response.content)

            with open(local_file, "rb") as fh:
                upload_resp = ik.files.upload(
                    file=fh.read(),
                    file_name=file_name,
                    folder=ik_folder,
                    tags=[category, artist_name, artist_slug]
                )

            uploaded_images.append(upload_resp.url)

            # Save checkpoint after every image
            with progress_lock:
                progress_data[artist_id] = {"status": "partial", "urls": uploaded_images}
            save_progress()

            with console_lock:
                console.print(
                    f"    [green]✓[/green] [{artist_id}] [bold]{artist_name}[/bold] "
                    f"— img {index+1}/{len(images)} → {upload_resp.url}"
                )

        except Exception as e:
            msg = f"Image {index+1}: {str(e)}"
            artist_errors.append(msg)
            with console_lock:
                console.print(f"    [red]✗ [{artist_id}] img {index+1} — {e}[/red]")

    # ── Finalize ──────────────────────────────────────────────────────────────
    ck_status = "done" if not artist_errors else "partial"
    with progress_lock:
        progress_data[artist_id] = {"status": ck_status, "urls": uploaded_images}
    save_progress()

    log_status = "SUCCESS" if not artist_errors else ("PARTIAL" if uploaded_images else "FAILED")
    log_entries[artist_id] = {
        "id": artist_id, "name": artist_name,
        "category": category, "status": log_status,
        "errors": artist_errors
    }

    artist["media"]["images"] = uploaded_images if uploaded_images else images
    results_map[artist_id] = artist

    flush_output()
    write_log()

    prog.advance(task_id)

# ── Run with thread pool ───────────────────────────────────────────────────────
MAX_WORKERS = 10  # tune this — ImageKit free tier may throttle above 10

with Progress(
    SpinnerColumn(),
    TextColumn("[bold blue]{task.description}"),
    BarColumn(),
    TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
    MofNCompleteColumn(),
    TextColumn("•"),
    TimeElapsedColumn(),
    TextColumn("ETA"),
    TimeRemainingColumn(),
    console=console,
    refresh_per_second=5,
) as prog:

    task_id = prog.add_task("Migrating artists...", total=len(artists))

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(process_artist, artist, prog, task_id): artist
            for artist in artists
        }
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                artist = futures[future]
                with console_lock:
                    console.print(f"[red bold]THREAD ERROR [{artist.get('id')}] {artist.get('name')}: {e}[/red bold]")

# ── Final summary ─────────────────────────────────────────────────────────────
entries = list(log_entries.values())
failed  = [e for e in entries if e["status"] == "FAILED"]
partial = [e for e in entries if e["status"] == "PARTIAL"]
success = [e for e in entries if e["status"] == "SUCCESS"]

table = Table(title="Migration Summary", border_style="cyan")
table.add_column("Status", style="bold")
table.add_column("Count", justify="right")
table.add_column("Details", style="dim")
table.add_row("[green]Success[/green]",   str(len(success)), "All images uploaded")
table.add_row("[yellow]Partial[/yellow]", str(len(partial)), "Some images failed — see log.txt")
table.add_row("[red]Failed[/red]",        str(len(failed)),  "0 images uploaded — see log.txt")
table.add_row("[white]Total[/white]",     str(len(entries)), "")
console.print(table)
console.print(f"\n[bold green]✓ Done![/bold green] Output → [cyan]{OUTPUT_FILE}[/cyan] | Log → [cyan]{LOG_FILE}[/cyan]")