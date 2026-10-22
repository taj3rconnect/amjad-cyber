#!/usr/bin/env bash
# Private visit report from the worker (/visits, admin). Own test visits use ?notrack so they never appear.
# Usage: ./fetch_visits.sh [limit]     Delete one session: ./fetch_visits.sh --delete <sid>
set -euo pipefail; export TZ=America/New_York
SEC=/workspace/.secrets; U=$(cat $SEC/amjad-askdad_url); K=$(cat $SEC/amjad-askdad_admin_key)
if [ "${1:-}" = "--delete" ]; then curl -fsS -X DELETE -H "Authorization: Bearer $K" "$U/visits?sid=$2"; echo; exit; fi
VJ=$(curl -fsS -H "Authorization: Bearer $K" "$U/visits?limit=${1:-500}") || { echo "ERROR: /visits fetch failed"; exit 1; }
VJ="$VJ" python3 - <<'PY'
import os,json,datetime as D,zoneinfo,collections
Z=zoneinfo.ZoneInfo('America/New_York');V=json.loads(os.environ['VJ'])
def t(x): return D.datetime.fromtimestamp(x/1000 if x>1e11 else x,Z) if isinstance(x,(int,float)) else D.datetime.fromisoformat(str(x).replace('Z','+00:00')).astimezone(Z)
print(f"{'Date':<12}{'Start (ET)':<12}{'Minutes':>8}  Pages");tot=collections.OrderedDict()
for v in sorted(V,key=lambda v:t(v['start'])):
    s=t(v['start']);m=round((v.get('active_sec') or 0)/60,1);d=s.strftime('%a %b %d')
    pg=[p if isinstance(p,str) else p.get('p','') for p in v.get('pages',[])]
    print(f"{d:<12}{s.strftime('%I:%M %p'):<12}{m:>8}  {', '.join(dict.fromkeys(pg))[:90]}")
    a=tot.setdefault(d,[0,0]);a[0]+=1;a[1]+=m
print('\nDaily totals (ET):')
for d,(n,m) in tot.items(): print(f"  {d}: {n} visit(s), {m:.1f} active min")
print(f"Total: {len(V)} visit(s)")
PY
