# Jobs runbook (8:00 AM ET)
Rules: $100K+ salary (range midpoint) or $75+/hr. Remote anywhere in US; hybrid any state; on-site only NY/NJ.
No posted pay -> kept as "est." only for senior titles. Clearance roles excluded, except ClearanceJobs (flagged `clearance`).
Pipeline: `scan.py` (Greenhouse/Lever/Ashby APIs, slugs in slugs.py) + `li.py` (LinkedIn public guest pages only; Amjad does all
LinkedIn sending himself, we never touch his account) + `boards.py` (Dice, Levels.fyi, ClearanceJobs, Wellfound)
-> `merge.py` (rules, classify work_mode/job_type/employer_type/state, dedupe company+title+state, carry prior jobs <21 days) -> scanned.json
-> `../build_jobs.py` (+ jobs_seed.json curated/gigs, multi-city _dedupe with also_in, frameable cache) -> site/jobs.json -> deploy.
Blocked/no yield: Built In, Jobright, Welcome to the Jungle, Infosec-Jobs, CyberSecurityJobs.com, Work at a Startup. CyberSeek = resource only.
Apollo: read-only search; no contacts/sequences/enrichment. Never create job accounts for Amjad.
Sanity: compare count vs /tmp/jobs.before.json; a drop >30% means a source broke -> don't deploy.
