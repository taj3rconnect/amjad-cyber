#!/usr/bin/env bash
# Bump the service-worker cache version, stamp ?v= on index.html assets, commit and push site/ (GitHub Pages).
# Usage: ./deploy.sh "commit message"   (DRY=1 ./deploy.sh  -> bump + show diff stat, no commit/push)
set -euo pipefail; export TZ=America/New_York
cd "$(dirname "$0")"; S=../site
OLD=$(cat VERSION); N=$(( ${OLD#amjad-v} + 1 )); NEW="amjad-v$N"
if [ "${DRY:-0}" = 1 ]; then echo "DRY: would bump $OLD -> $NEW"; git -C $S status --short | head -20; exit 0; fi
echo "$NEW" > VERSION
sed -i "s/const V='$OLD'/const V='$NEW'/" $S/sw.js
sed -i "s/?v=$OLD/?v=$NEW/g" $S/index.html
python3 search_index.py >/dev/null
git -C $S add -A
git -C $S -c user.name=taj3rconnect -c user.email=taj3rconnect@users.noreply.github.com commit -qm "${1:-update} ($NEW)"
git -C $S push -q
echo "deployed $NEW at $(date '+%Y-%m-%d %I:%M %p %Z')"
