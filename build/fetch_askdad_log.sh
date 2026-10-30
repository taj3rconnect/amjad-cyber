#!/usr/bin/env bash
# Morning digest input: new Ask Dad Q&A since the last marker + progress events from /state (admin).
# Markers: .askdad_since (ISO ts of last seen log row), .progress_last_ev (last ev id). DRY=1 -> don't advance markers.
# Never prints the URL key or tokens.
set -euo pipefail; export TZ=America/New_York; cd "$(dirname "$0")"
SEC=/workspace/.secrets; U=$(cat $SEC/amjad-askdad_url); K=$(cat $SEC/amjad-askdad_admin_key)
SINCE=$(cat .askdad_since 2>/dev/null || echo ""); EV=$(cat .progress_last_ev 2>/dev/null || echo 0)
LOG=$(curl -fsS -H "Authorization: Bearer $K" "$U/log?since=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$SINCE")") || { echo "ERROR: /log fetch failed"; exit 1; }
ST=$(curl -fsS -H "Authorization: Bearer $K" "$U/state?since=$EV") || { echo "ERROR: /state fetch failed"; exit 1; }
LOG="$LOG" ST="$ST" SINCE="$SINCE" EV="$EV" DRY="${DRY:-0}" python3 - <<'PY'
import os,json,datetime as D
os.environ['TZ']='America/New_York'
def et(ts):
    if isinstance(ts,(int,float)): return D.datetime.fromtimestamp(ts/1000,__import__('zoneinfo').ZoneInfo('America/New_York')).strftime('%a %b %d %I:%M %p ET')
    try: return D.datetime.fromisoformat(ts.replace('Z','+00:00')).astimezone(__import__('zoneinfo').ZoneInfo('America/New_York')).strftime('%a %b %d %I:%M %p ET')
    except Exception: return ts
L=[r for r in json.loads(os.environ['LOG']) if not r.get('hidden')];S=json.loads(os.environ['ST'])
print(f"== Ask Dad: {len(L)} new question(s) since {os.environ['SINCE'] or 'start'} ==")
for r in L:
    print(f"\n#{r['id']}  {et(r['ts'])}\nQ: {r['q']}\nA: {r['a'][:600]}{'…' if len(r['a'])>600 else ''}")
    for v in json.loads(r.get('videos') or '[]'): print(f"   video: {v.get('title')} ({v.get('url')})")
ev=S.get('events',[]);print(f"\n== Progress: {len(ev)} new event(s) ==")
from collections import Counter
for k,c in Counter(e['kind'] for e in ev).most_common(): print(f"  {k}: {c}")
for e in sorted(ev,key=lambda e:e['id'])[-15:]: print(f"  {et(e['ts'])}  {e['kind']}  {json.dumps(e['d'])[:120]}")
it=S.get('items',{})
try:
    rm=json.loads(it.get('amjad-roadmap-v1',{}).get('v','{}'));done=sum(1 for v in (rm.values() if isinstance(rm,dict) else []) if v)
    print(f"  Steps checked: {done}")
except Exception: pass
try: print(f"  Jobs marked applied: {len(json.loads(it.get('amjad-applied-v1',{}).get('v','{}')))}")
except Exception: pass
print(f"  Mock interviews on record: {len(S.get('interviews',[]))}")
if os.environ['DRY']!='1':
    if L: open('.askdad_since','w').write(max(r['ts'] for r in L))
    if ev: open('.progress_last_ev','w').write(str(max(e['id'] for e in ev)))
else: print('\n(DRY run: markers not advanced)')
PY
