#!/bin/sh
# Fast-forwards the mounted clone to origin/main, the branch GitHub Pages builds from.
# Runs from cron on the DGX. A failed pull is logged and the site keeps its last good copy.
set -eu

SITE=/home/admin/claude/amjad/site
LOG=/home/admin/claude/amjad/sync.log

before=$(git -C "$SITE" rev-parse --short HEAD)
if ! out=$(git -C "$SITE" pull --ff-only --quiet origin main 2>&1); then
  echo "$(date -Is) FAIL at $before: $out" >> "$LOG"
  exit 1
fi
after=$(git -C "$SITE" rev-parse --short HEAD)
if [ "$before" != "$after" ]; then
  echo "$(date -Is) updated $before -> $after" >> "$LOG"
fi
