#!/usr/bin/env bash
# Back up build/ to the agent store and to repo branch build-backup (path build/, never served: Pages serves main only). No secrets are in build/.
set -euo pipefail; export TZ=America/New_York; cd "$(dirname "$0")"
ST=/cursor/stores/store-389efb40-c207-4ce4-88b2-1706916c4bf8/amjad-build
cpy(){ rm -rf "$1"; mkdir -p "$1"; tar --exclude='*_raw.json' -cf - . | tar -xf - -C "$1"; }
cpy $ST/build && echo "store backup ok"
W=/tmp/amjad-backup-wt; R=../site
git -C $R fetch -q origin build-backup 2>/dev/null || true
rm -rf $W; git -C $R worktree prune
if git -C $R rev-parse -q --verify origin/build-backup >/dev/null; then git -C $R worktree add -q -B build-backup $W origin/build-backup; else git -C $R worktree add -q --orphan -b build-backup $W 2>/dev/null || { git -C $R worktree add -q --detach $W && git -C $W checkout -q --orphan build-backup && git -C $W rm -rqf .; }; fi
cpy $W/build; cp -r ../worker/worker.js $W/ 2>/dev/null || true
git -C $W add -A; git -C $W -c user.name=taj3rconnect -c user.email=taj3rconnect@users.noreply.github.com commit -qm "build backup $(date '+%F %H:%M %Z')" || echo "nothing new"
git -C $W push -q origin build-backup && echo "branch backup ok"; git -C $R worktree remove --force $W
