"""Link liveness check (Oct 22, 2026): every job URL in scanned.json + jobs_seed.json is fetched; closed/dead listings are
dropped from scanned.json (so they expire and are not carried), dead seed jobs are listed in live_report.json.
Unknown results (timeouts, 429/403 bot blocks) are kept. Usage: python3 live.py  (run after merge.py, before build_jobs.py)."""
import json,re,time,urllib.request,urllib.error,concurrent.futures as F
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36','Accept-Language':'en-US'}
CLOSED=re.compile(r'no longer accepting applications|this job is no longer available|job is no longer available|this job has expired|job posting has expired|position has been filled|no longer open|this position is closed|job not found|posting is no longer|job you are looking for is no longer|this job has been closed|the job you requested (?:was|has been) (?:closed|removed)',re.I)
def fetch(u):
    for i in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=25)
            return r.status,r.geturl(),r.read(600000).decode('utf8','ignore')
        except urllib.error.HTTPError as e:
            if e.code in (404,410): return e.code,u,''
            if e.code==429: time.sleep(5+i*8); continue
            return e.code,u,''
        except Exception: time.sleep(2)
    return 0,u,''
def check(u):
    """-> 'live' | 'dead' | 'unknown'"""
    m=re.search(r'linkedin\.com/jobs/view/(?:[^/]*-)?(\d+)',u)
    if m:
        st,_,h=fetch(f'https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{m.group(1)}')
        if st in (404,410): return 'dead'
        if st!=200 or not h: return 'unknown'
        if re.search(r'closed-job|No longer accepting applications',h): return 'dead'
        return 'live' if 'topcard__title' in h else 'unknown'
    st,fin,h=fetch(u)
    if st in (404,410): return 'dead'
    if st!=200: return 'unknown'
    if 'greenhouse' in u and ('error=true' in fin or re.search(r'/[a-z0-9]+/?$',fin) and 'jobs/' not in fin): return 'dead'
    if 'lever.co' in u and fin.rstrip('/').count('/')<4: return 'dead'
    vt=re.search(r'"validThrough"\s*:\s*"(\d{4}-\d\d-\d\d)',h)
    if vt and vt.group(1)<time.strftime('%Y-%m-%d'): return 'dead'
    body=re.sub(r'<script.*?</script>|<style.*?</style>','',h,flags=re.S)
    if CLOSED.search(re.sub('<[^>]+>',' ',body)): return 'dead'
    return 'live'
if __name__=='__main__':
    scan=json.load(open('scanned.json'));seed=json.load(open('../jobs_seed.json'))
    urls=list(dict.fromkeys([j['url'] for j in scan+seed]))
    li=[u for u in urls if 'linkedin.com' in u];other=[u for u in urls if u not in li];res={}
    with F.ThreadPoolExecutor(12) as ex: res.update(zip(other,ex.map(check,other)))
    with F.ThreadPoolExecutor(3) as ex: res.update(zip(li,ex.map(check,li)))
    dead={u for u,v in res.items() if v=='dead'}
    keep=[j for j in scan if j['url'] not in dead]
    json.dump(keep,open('scanned.json','w'),indent=0,ensure_ascii=False)
    rep={'checked':len(res),'live':sum(v=='live' for v in res.values()),'unknown':[u for u,v in res.items() if v=='unknown'],
         'dead_scanned':[j['url'] for j in scan if j['url'] in dead],'dead_seed':[dict(id=j['id'],url=j['url'],group=j.get('group')) for j in seed if j['url'] in dead]}
    json.dump(rep,open('live_report.json','w'),indent=1)
    print(f"links checked {rep['checked']}: live {rep['live']}, unknown {len(rep['unknown'])}, dead scanned {len(rep['dead_scanned'])}, dead seed {len(rep['dead_seed'])} -> scanned.json {len(keep)}")
