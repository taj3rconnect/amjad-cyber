#!/usr/bin/env bash
# 8:00 AM ET jobs refresh. DRY=1 -> scan + build jobs.json into /tmp, no site change, no deploy.
set -uo pipefail; export TZ=America/New_York; cd "$(dirname "$0")"
echo "jobs refresh $(date '+%Y-%m-%d %I:%M %p %Z')"
python3 scan.py; python3 li.py; python3 boards.py
python3 merge.py || exit 1
if [ "${DRY:-0}" = 1 ]; then python3 ../build_jobs.py --out /tmp/jobs.dry.json; exit; fi
cp ../../site/jobs.json /tmp/jobs.before.json
python3 ../build_jobs.py && cp scanned.json scanned_prev.json && (cd .. && ./deploy.sh "jobs refresh $(date +%F)")
