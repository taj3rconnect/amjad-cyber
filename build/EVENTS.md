# Events runbook (7:30 AM ET)
`events/refresh.sh`: luma.py (Luma NYC discover feed, security/identity keywords, <=60 mi of Edison NJ or online)
+ events_seed.json (curated official events; `recurring` Weekdays/Weekly roll forward) + upcoming Luma events already on the site
-> drop ended events -> site/events.json (start_et in ET) -> deploy. Add curated events by editing events_seed.json. Verify every link works.
