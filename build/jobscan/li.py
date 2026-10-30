"""LinkedIn public guest job pages (no login, no account touched): search -> details -> li_raw.json."""
import re,json,html,time,urllib.request,urllib.parse,concurrent.futures as F
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36'}
Q=['IAM engineer','identity and access management','Okta engineer','SailPoint engineer','CyberArk engineer','identity engineer','IAM architect','privileged access management','Entra ID engineer','IAM manager','identity governance']
LOC=[('United States','f_WT=2'),('New Jersey',''),('New York City Metropolitan Area','')]
def get(u):
    for i in range(3):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=25).read().decode('utf8','ignore')
        except Exception: time.sleep(3+i*4)
    return ''
def search():
    ids={}
    for q in Q:
        for loc,extra in LOC:
            for start in (0,25):
                h=get('https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?'+urllib.parse.urlencode({'keywords':q,'location':loc,'f_TPR':'r1209600','start':start})+('&'+extra if extra else ''))
                for m in re.finditer(r'jobPosting:(\d+)',h): ids[m.group(1)]=1
                time.sleep(1.2)
    return list(ids)
def t(s): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',s or ''))).strip()
def det(i):
    h=get(f'https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{i}')
    if not h: return None
    g=lambda p:(re.search(p,h,re.S) or [None,''])[1]
    crit={t(a):t(b) for a,b in re.findall(r'description__job-criteria-subheader">(.*?)</h3>.*?criteria-text[^>]*>(.*?)</span>',h,re.S)}
    return dict(src='LinkedIn',id=i,title=t(g(r'topcard__title[^>]*>(.*?)</h2>')),company=t(g(r'topcard__org-name-link[^>]*>(.*?)</a>')) or t(g(r'topcard__flavor">(.*?)</span>')),
        location=t(g(r'topcard__flavor topcard__flavor--bullet">(.*?)</span>')),desc=t(g(r'show-more-less-html__markup[^>]*>(.*?)</div>')),
        salary=t(g(r'salary compensation__salary">(.*?)</div>')),posted=t(g(r'posted-time-ago__text[^>]*>(.*?)</span>')),crit=crit,url=f'https://www.linkedin.com/jobs/view/{i}/')
if __name__=='__main__':
    ids=search();print('LinkedIn ids:',len(ids))
    with F.ThreadPoolExecutor(4) as ex: R=[r for r in ex.map(det,ids) if r and r['title']]
    json.dump(R,open('li_raw.json','w'),indent=0);print('LinkedIn details:',len(R))
