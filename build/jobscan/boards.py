"""Job boards via public pages: Dice, Levels.fyi, ClearanceJobs, Wellfound (JSON-LD JobPosting / __NEXT_DATA__) -> boards_raw.json.
Blocked / no yield (checked Oct 2026): Built In, Jobright, Welcome to the Jungle, Infosec-Jobs, CyberSecurityJobs.com, Work at a Startup."""
import re,json,html,time,urllib.request,urllib.parse
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36','Accept-Language':'en-US'}
def get(u):
    try: return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=25).read().decode('utf8','ignore')
    except Exception as e: print('  skip',u[:70],type(e).__name__); return ''
def t(s): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',html.unescape(s or '')))).strip()
def ld(h):
    for b in re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>',h,re.S):
        try: d=json.loads(b)
        except Exception: continue
        for x in (d if isinstance(d,list) else d.get('@graph',[d])):
            if isinstance(x,dict) and x.get('@type')=='JobPosting': return x
def frompost(src,url,x,clear=False):
    loc=x.get('jobLocation') or {}; loc=loc[0] if isinstance(loc,list) and loc else loc
    a=(loc or {}).get('address',{}) if isinstance(loc,dict) else {}
    where=', '.join(v for v in [a.get('addressLocality'),a.get('addressRegion')] if v)
    if x.get('jobLocationType')=='TELECOMMUTE': where=(where+' (Remote)').strip()
    bs=x.get('baseSalary') or {};v=(bs.get('value') or {}) if isinstance(bs,dict) else {}
    if not isinstance(v,dict): v={'value':v,'unitText':bs.get('unitText','') if isinstance(bs,dict) else ''}
    num=lambda z:float(str(z).replace(',','').replace('$','')) if z not in (None,'') and str(z).replace(',','').replace('$','').replace('.','',1).isdigit() else None
    lo,hi=v.get('minValue') or v.get('value'),v.get('maxValue') or v.get('minValue') or v.get('value')
    unit={'HOUR':'hr','YEAR':'yr'}.get(str(v.get('unitText','')).upper())
    org=x.get('hiringOrganization') or {}
    return dict(src=src,id=re.sub(r'\W','',url)[-10:],title=t(x.get('title')),company=t(org.get('name') if isinstance(org,dict) else org),location=where,desc=t(x.get('description')),
        pay=(num(lo),num(hi)) if num(lo) and num(hi) and unit else None,unit=unit,url=url,posted=str(x.get('datePosted',''))[:10],crit={'Employment type':str(x.get('employmentType',''))},clearance=clear)
def links(h,pat,base=''): return list(dict.fromkeys(base+m for m in re.findall(pat,h)))[:40]
def dice():
    out=[]
    for q in ['IAM engineer','identity access management','Okta','SailPoint','CyberArk']:
        h=get('https://www.dice.com/jobs?'+urllib.parse.urlencode({'q':q,'filters.postedDate':'SEVEN'}))
        for u in links(h,r'(https://www\.dice\.com/job-detail/[0-9a-f-]{36})'):
            x=ld(get(u))
            if x: out.append(frompost('Dice',u,x))
            time.sleep(.5)
    return out
def levels():
    out=[]
    for q in ['identity','IAM','access management']:
        h=get('https://www.levels.fyi/jobs?'+urllib.parse.urlencode({'searchText':q}))
        m=re.search(r'id="__NEXT_DATA__"[^>]*>(.*?)</script>',h,re.S)
        if not m: continue
        for jid in list(dict.fromkeys(re.findall(r'"jobId":"?(\d+)',m.group(1))))[:30]:
            u=f'https://www.levels.fyi/jobs?jobId={jid}';hh=get(u)
            mm=re.search(r'id="__NEXT_DATA__"[^>]*>(.*?)</script>',hh,re.S)
            try: d=json.loads(mm.group(1))['props']['pageProps']['initialJobDetails']
            except Exception: continue
            lo,hi=d.get('minBaseSalary'),d.get('maxBaseSalary')
            out.append(dict(src='Levels.fyi',id=jid,title=d.get('title',''),company=d.get('companyName',''),location='; '.join(d.get('locations') or []),desc=t(d.get('description','')),
                pay=(float(lo),float(hi)) if lo and hi else None,unit='yr',url=d.get('applicationUrl') or u,posted=str(d.get('postingDate',''))[:10]))
    return out
def clearance():
    out=[]
    for q in ['identity access management','IAM engineer']:
        h=get('https://www.clearancejobs.com/jobs?'+urllib.parse.urlencode({'keywords':q}))
        for u in links(h,r'href="(/jobs/\d+/[^"]+)"','https://www.clearancejobs.com'):
            x=ld(get(u))
            if x: out.append(frompost('ClearanceJobs',u,x,clear=True))
    return out
def wellfound():
    out=[]
    for role in ['security-engineer','identity-engineer']:
        h=get(f'https://wellfound.com/role/{role}')
        for u in links(h,r'href="(/jobs/\d+-[^"]+)"','https://wellfound.com'):
            x=ld(get(u))
            if x: out.append(frompost('Wellfound',u,x))
    return out
if __name__=='__main__':
    R=[]
    for f in (dice,levels,clearance,wellfound):
        try: r=f()
        except Exception as e: print(f.__name__,'FAILED',type(e).__name__); r=[]
        print(f.__name__,len(r));R+=r
    json.dump(R,open('boards_raw.json','w'),indent=0)
