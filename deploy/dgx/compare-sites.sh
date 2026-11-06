#!/bin/bash
# Byte-compares every file on origin/main between GitHub Pages and the new site.
# Run from a clone. Exit 0 = the only differences are the expected ones.
# Usage: compare-sites.sh [base-url]. On the DGX, pass http://127.0.0.1:3079 to test the
# origin: the public URL also shows Cloudflare's edge edits (managed robots.txt, email
# obfuscation), which are not differences in the site.
set -u

PAGES=https://taj3rconnect.github.io/amjad-cyber
NEW=${1:-https://amjad.haslani.com}
# manifest.json is rewritten by nginx. Dotfiles and the non-site files are blocked on purpose.
EXPECTED_DIFF='^(manifest\.json|\.nojekyll|\.dockerignore|\.claude/.*|deploy/.*|docker/.*|Dockerfile|docker-compose\.yml)$'

same=0; expected=0; bad=0
while IFS= read -r f; do
  path=${f// /%20}
  a=$(curl -sS -m 30 "$PAGES/$path" | sha256sum | cut -c1-16)
  b=$(curl -sS -m 30 "$NEW/$path" | sha256sum | cut -c1-16)
  if [ "$a" = "$b" ]; then
    same=$((same + 1))
  elif [[ "$f" =~ $EXPECTED_DIFF ]]; then
    expected=$((expected + 1)); echo "expected diff: $f"
  else
    bad=$((bad + 1)); echo "DIFF: $f"
  fi
done < <(git ls-tree -r --name-only origin/main)

echo "identical=$same expected_diff=$expected unexpected_diff=$bad"
[ "$bad" -eq 0 ]
