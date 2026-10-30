"""Scan public ATS job APIs (Greenhouse, Lever, Ashby) for IAM / identity / cloud-security roles -> ats_raw.json."""
import json,re,html,urllib.request,concurrent.futures as F
from slugs import GREENHOUSE,LEVER,ASHBY
REL=re.compile(r'identity|\biam\b|access management|okta|sailpoint|cyberark|entra|privileged|\bpam\b|ciam|\bidm\b|directory services|cloud security',re.I)
UA={'User-Agent':'Mozilla/5.0 Chrome/130'}
def get(u):
    try: return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30))
    except Exception: return None
def txt(h): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',html.unescape(h or ''))))
PAY=re.compile(r'\$\s?(\d{2,3}(?:,\d{3})+|\d{2,3}(?:\.\d+)?\s?[kK])(?:\.\d+)?\s*(?:USD)?\s*(?:-|–|—|to)\s*\$?\s?(\d{2,3}(?:,\d{3})+|\d{2,3}(?:\.\d+)?\s?[kK])',re.I)
HR=re.compile(r'\$\s?(\d{2,3}(?:\.\d+)?)\s*(?:-|–|to)\s*\$?(\d{2,3}(?:\.\d+)?)\s*(?:/|per)\s*h',re.I)
def pay(d):
    m=HR.search(d)
    if m: return (float(m.group(1)),float(m.group(2))),'hr'
    m=PAY.search(d)
    if m:
        f=lambda s:float(s.replace(',','').lower().replace('k','').strip())*(1000 if 'k' in s.lower() else 1)
        lo,hi=f(m.group(1)),f(m.group(2))
        if lo>=30000: return (lo,hi),'yr'
    return None,None
def gh(s):
    d=get(f'https://boards-api.greenhouse.io/v1/boards/{s}/jobs?content=true') or {};out=[]
    for j in d.get('jobs',[]):
        if not REL.search(j['title']): continue
        desc=txt(j.get('content'));p,u=pay(desc)
        out.append(dict(src='Greenhouse (company ATS)',id=str(j['id']),title=j['title'],company=(j.get('company_name') or s.title()),location=(j.get('location') or {}).get('name',''),desc=desc,pay=p,unit=u,url=j['absolute_url'],posted=(j.get('updated_at') or '')[:10]))
    return out
def lv(s):
    d=get(f'https://api.lever.co/v0/postings/{s}?mode=json') or [];out=[]
    for j in d if isinstance(d,list) else []:
        if not REL.search(j.get('text','')): continue
        desc=txt(j.get('descriptionPlain') or j.get('description'))+' '+' '.join(txt(l.get('content')) for l in j.get('lists',[]))
        sr=j.get('salaryRange') or {};p,u=((float(sr['min']),float(sr['max'])),'hr' if sr.get('interval')=='per-hour-wage' else 'yr') if sr.get('min') else pay(desc)
        c=j.get('categories',{});out.append(dict(src='Lever (company ATS)',id=j['id'][-6:],title=j['text'],company=s.title(),location=c.get('location','')+(' '+j.get('workplaceType','') if j.get('workplaceType') in ('remote','hybrid') else ''),desc=desc,pay=p,unit=u,url=j['hostedUrl'],crit={'Employment type':c.get('commitment','')}))
    return out
def ab(s):
    d=get(f'https://api.ashbyhq.com/posting-api/job-board/{s}?includeCompensation=true') or {};out=[]
    for j in d.get('jobs',[]):
        if not REL.search(j['title']) or not j.get('isListed',True): continue
        desc=txt(j.get('descriptionHtml'));p,u=pay(((j.get('compensation') or {}).get('compensationTierSummary') or '')+' '+desc)
        out.append(dict(src='Ashby (company ATS)',id=j['id'][-6:],title=j['title'],company=s.title(),location=(j.get('location','')+(' (Remote)' if j.get('isRemote') else '')),desc=desc,pay=p,unit=u,url=j['jobUrl'],posted=(j.get('publishedAt') or '')[:10],crit={'Employment type':j.get('employmentType','')}))
    return out
def safe(fs):
    try: return fs[0](fs[1])
    except Exception as e: print('  source failed',fs[1],type(e).__name__); return []
def main():
    R=[]
    with F.ThreadPoolExecutor(8) as ex:
        for r in ex.map(safe,[(gh,s) for s in GREENHOUSE]+[(lv,s) for s in LEVER]+[(ab,s) for s in ASHBY]): R+=r
    json.dump(R,open('ats_raw.json','w'),indent=0);print('ATS relevant postings:',len(R))
if __name__=='__main__': main()
