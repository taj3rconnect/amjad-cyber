"""Events page data: curated (events_seed.json; recurring entries roll forward) + Luma -> drop past -> site/events.json.
Usage: python3 build_events.py [--dry]  (7:30 AM ET routine runs luma.py first, then this, then ../deploy.sh)."""
import json,re,os,sys,datetime as D,zoneinfo
Z=zoneinfo.ZoneInfo('America/New_York');H=os.path.dirname(os.path.abspath(__file__));S=os.path.join(H,'..','..','site')
now=D.datetime.now(D.timezone.utc)
def p(s): return D.datetime.fromisoformat(s.replace('Z','+00:00'))
def roll(e):
    if not e.get('recurring'): return e
    t=p(e['start'])
    while t<now-D.timedelta(hours=2) or (e['recurring']=='Weekdays' and t.astimezone(Z).weekday()>4): t+=D.timedelta(days=7 if e['recurring']=='Weekly' else 1)
    e['start']=t.isoformat().replace('+00:00','Z');return e
seed=[roll(dict(e)) for e in json.load(open(os.path.join(H,'events_seed.json')))]
luma=json.load(open(os.path.join(H,'luma_raw.json'))) if os.path.exists(os.path.join(H,'luma_raw.json')) else []
prev=[e for e in json.load(open(os.path.join(S,'events.json'))) if e.get('src')=='Luma'] if os.path.exists(os.path.join(S,'events.json')) else []  # carry upcoming Luma events already listed
seen=set();ev=[]
for e in seed+luma+prev:
    end=p(e['end']) if e.get('end') else p(e['start'])+D.timedelta(hours=2)
    k=(e['url'],e['start'])
    if end<now or k in seen: continue
    seen.add(k);ev.append(e)
ev.sort(key=lambda e:p(e['start']))
for i,e in enumerate(ev):
    e['id']=f"ev-{i}-"+re.sub(r'[^a-z0-9]+','-',e['title'].lower())[:22].strip('-')
    e['start_et']=p(e['start']).astimezone(Z).strftime('%a %b %d, %Y · %-I:%M %p ET')
out='/tmp/events.dry.json' if '--dry' in sys.argv else os.path.join(S,'events.json')
json.dump(ev,open(out,'w'),indent=1,ensure_ascii=False);print(f'{len(ev)} events ({len(luma)} from Luma) -> {out}')
