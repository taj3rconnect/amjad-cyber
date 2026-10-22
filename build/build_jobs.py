"""Site job builder (replaces the jobs part of the old site.py): jobs_seed.json (curated + gigs) + jobscan/scanned.json
-> multi-city _dedupe (also_in) -> frameable check (cached) -> site/jobs.json."""
import json,re,os,sys,urllib.request,concurrent.futures as F
os.environ['TZ']='America/New_York'
H=os.path.dirname(os.path.abspath(__file__));S=os.path.join(H,'..','site')
out=sys.argv[sys.argv.index('--out')+1] if '--out' in sys.argv else os.path.join(S,'jobs.json')
def n(s): return re.sub(r'[^a-z0-9]+',' ',re.sub(r'\(.*?\)|-\s*remote|remote\s*-','',s.lower())).strip()
def _dedupe(js):
    g={}
    for j in js: g.setdefault((n(j['title']),n(j['company'])),[]).append(j)
    res=[]
    for v in g.values():
        v.sort(key=lambda j:(j.get('state') not in ('NJ','NY'),bool(j.get('pay_est')),-int(j.get('posted','0000-00-00').replace('-',''))))
        k=dict(v[0]);rest=[x['location'] for x in v[1:] if x['location']!=k['location']]
        if rest: k['also_in']=list(dict.fromkeys(rest))
        res.append(k)
    return res
CF=os.path.join(H,'frame_cache.json');cache=json.load(open(CF)) if os.path.exists(CF) else {}
def frameable(u):
    if 'linkedin.com' in u: return False
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,method='GET',headers={'User-Agent':'Mozilla/5.0'}),timeout=12);h={k.lower():v for k,v in r.headers.items()}
        return not h.get('x-frame-options') and 'frame-ancestors' not in h.get('content-security-policy','')
    except Exception: return False
seed=json.load(open(os.path.join(H,'jobs_seed.json')));scan=json.load(open(os.path.join(H,'jobscan','scanned.json')))
main=_dedupe([j for j in seed if j.get('group')!='gig']+scan);gigs=[j for j in seed if j.get('group')=='gig']
todo=[j['url'] for j in main+gigs if j['url'] not in cache]
with F.ThreadPoolExecutor(8) as ex:
    for u,ok in zip(todo,ex.map(frameable,todo)): cache[u]=ok
for j in main+gigs: j['frameable']=cache[j['url']]
json.dump(cache,open(CF,'w'))
main.sort(key=lambda j:(j.get('pay_est',False),j.get('state') not in('NJ','NY'),j['posted']),reverse=False)
main.sort(key=lambda j:j['posted'],reverse=True)
json.dump({'criteria':'$100K+ salary (range midpoint) or $75+/hr; gigs listed separately','jobs':main+gigs},open(out,'w'),indent=1,ensure_ascii=False)
print(f'jobs.json -> {out}: {len(main)} main + {len(gigs)} gigs')
