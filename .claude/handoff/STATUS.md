<!-- resume-branch: main -->
# Status: move the site to amjad.haslani.com

This repo is public. Keep infrastructure detail and secret locations in the vault, not here.

**Goal:** amjad.haslani.com replaces the GitHub Pages site once it matches it, including daily updates.

**Done (2026-11-05)**
- feature/thr-1105 was merged into main.
- Container `amjad` on the DGX serves a read-only clone of main. Config is in `deploy/dgx/`.
- DNS and the tunnel route for amjad.haslani.com are live.
- A cron job fast-forwards the clone every 10 minutes.
- Pages and the DGX origin were byte-identical on all site files, apart from the intended differences.
- The Ask Dad Worker now allows the new domain. Progress sync works in a browser.
- The `noindex` header keeps the new site out of search.

**Open**
- No new refresh commit has come through the sync yet, so the daily update is unproven.
- Taj has not yet sent a real Ask Dad question on the new site. It was not tested with a real message.
- Where the morning refresh runs is unknown. It is not on TajHome-Room, tcab, or in cloud routines.
- The job list showed 185 jobs after progress loaded, against 386 before. Probably saved filters; unconfirmed.

Next step: after the next morning refresh, run `bash deploy/dgx/compare-sites.sh http://127.0.0.1:3079` from the clone on the DGX, compare `amjad-v` in `sw.js` on both sites, and ask Taj for the result of his Ask Dad test. Then tell him whether Pages is ready to turn off. Do not turn it off yourself.
