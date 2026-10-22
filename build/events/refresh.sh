#!/usr/bin/env bash
# 7:30 AM ET events refresh. DRY=1 -> write /tmp/events.dry.json only.
set -uo pipefail; export TZ=America/New_York; cd "$(dirname "$0")"
python3 luma.py || echo "Luma failed; keeping curated events only"
if [ "${DRY:-0}" = 1 ]; then python3 build_events.py --dry; exit; fi
python3 build_events.py && (cd .. && ./deploy.sh "events refresh $(date +%F)")
