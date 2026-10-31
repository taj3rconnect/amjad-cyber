# Jobs runbook (8:00 AM ET)
Rules: $100K+ salary (range midpoint) or $75+/hr. Remote anywhere in US; hybrid any state; on-site only NY/NJ.
No posted pay -> kept as "est." only for senior titles. Clearance roles excluded, except ClearanceJobs (flagged `clearance`).
Pipeline: `scan.py` (Greenhouse/Lever/Ashby APIs, slugs in slugs.py) + `li.py` (LinkedIn public guest pages only; Amjad does all
LinkedIn sending himself, we never touch his account) + `boards.py` (Dice, Levels.fyi, ClearanceJobs, Wellfound, Himalayas JSON API)
-> `merge.py` (rules, classify work_mode/job_type/employer_type/state, dedupe company+title+state, carry prior jobs <21 days) -> scanned.json
-> `live.py` (fetch every job URL in scanned.json + jobs_seed.json; drop closed/404/410/expired-validThrough; dead seed ids in live_report.json -> remove from jobs_seed.json)
-> `../build_jobs.py` (+ jobs_seed.json curated/gigs, multi-city _dedupe with also_in, frameable cache) -> site/jobs.json -> deploy.
Blocked/no yield: Built In, Jobright, Welcome to the Jungle, Infosec-Jobs, CyberSecurityJobs.com, Work at a Startup. CyberSeek = resource only.
Apollo: read-only search; no contacts/sequences/enrichment. Never create job accounts for Amjad.
Sanity: compare count vs /tmp/jobs.before.json; a drop >30% means a source broke -> don't deploy.

Oct 22, 2026: Levels.fyi search is no longer server-rendered (always returns 0); Indeed/ZipRecruiter/Glassdoor/HiringCafe/SimplyHired return 401/403 to scripts;
Apify plan can't run public Actors (Indeed scrapers, web-fetch). merge.py REL fixed (\bentra\b, \bsso\b matched 'Central'/'Associate') + NOTIAM title filter.
Oct 25, 2026: Workday public CXS API works (POST {tenant}.wd{n}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs) -> new jobscan/workday.py (wd_raw.json, ~30 tenants; 422 = wrong site name). Wellfound /role/identity-engineer 404s (security-engineer still works). +GH trace3/point72/block/roblox, Ashby lumos/1password.
Oct 30, 2026: +14 Workday tenants (workday, ghr=Bank of America/Lateral-US, paypal, cardinalhealth, lplfinancial, adobe, hp, thehartford, elevancehealth, broadridge, nasdaq, sonyglobal, hpe, unum) -> WD 49->71. 422 (wrong site name, skipped): comcast, dell, bny, wellsfargo, gm, boozallen, kpmg, optum, paloaltonetworks. fmr/targeted = 0.
