# Amjad site build (rebuilt Oct 22, 2026 after build/ was lost)
All scripts force TZ=America/New_York (box clock is Europe/Lisbon; do not change it).
Site repo = ../site (GitHub Pages, branch main). Backup of this folder: repo branch `build-backup` (not served) + agent store.

| Routine | Command |
|---|---|
| 7:30 AM ET events | `events/refresh.sh` (DRY=1 for test) |
| 8:00 AM ET jobs | `jobscan/refresh.sh` (DRY=1 for test) |
| 8:30 AM ET morning email input | `./fetch_askdad_log.sh` (DRY=1 keeps markers) + `./fetch_visits.sh` |
| Rebuild search | `python3 search_index.py` |
| New transcripts | `python3 import_tx.py <dump.json>` then `search_index.py` |
| Deploy | `./deploy.sh "msg"` (bumps VERSION + sw.js V + ?v= stamps, commits, pushes) |
| Backup | `./backup.sh` |

Content sources now: index.html (live, edited in place), and the JSON files in ../site
(network, features, newsletters, exam, docs, today) are edited directly. The old generators
(site.py/content.py/tpl.html, network.py, features.py, newsletters.py, exam_gen.py, docs.py) were lost and not rebuilt.
