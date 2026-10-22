"""Apply Amjad's rules to raw scans (ats_raw, li_raw, boards_raw) -> scanned.json.
Rules: remote anywhere in US; hybrid in any state; on-site only NY/NJ; pay midpoint >= $100K/yr or >= $75/hr.
No posted pay -> kept as 'est.' only for senior titles. Clearance-required roles excluded unless from ClearanceJobs (flagged).
Previous scanned jobs (scanned_prev.json) younger than KEEP_DAYS are carried over so a broken source never empties the list."""
import json,re,os,datetime as D
os.environ['TZ']='America/New_York'
TODAY=D.date.today();KEEP_DAYS=21
ST={'Alabama':'AL','Arizona':'AZ','California':'CA','Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA','Illinois':'IL','Indiana':'IN','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Missouri':'MO','New Jersey':'NJ','New York':'NY','North Carolina':'NC','Ohio':'OH','Oregon':'OR','Pennsylvania':'PA','Tennessee':'TN','Texas':'TX','Utah':'UT','Virginia':'VA','Washington':'WA','Wisconsin':'WI','District of Columbia':'DC'}
CITY={'new york':'NY','nyc':'NY','brooklyn':'NY','jersey city':'NJ','newark':'NJ','princeton':'NJ','hoboken':'NJ','san francisco':'CA','los angeles':'CA','seattle':'WA','austin':'TX','dallas':'TX','chicago':'IL','boston':'MA','atlanta':'GA','denver':'CO','charlotte':'NC','philadelphia':'PA','kalamazoo':'MI'}
SKILLS=[('Entra ID / Azure AD',r'entra|azure ad|azure active'),('Active Directory',r'active directory|\bad\b ds'),('Okta',r'okta'),('SailPoint',r'sailpoint'),('Saviynt',r'saviynt'),('CyberArk',r'cyberark'),('BeyondTrust/Delinea',r'beyondtrust|delinea|thycotic'),('PIM / PAM',r'\bpim\b|\bpam\b|privileged'),('Ping',r'\bping ?(identity|federate)'),('SAML',r'\bsaml'),('OAuth/OIDC',r'oauth|oidc|openid'),('SCIM',r'\bscim'),('MFA',r'\bmfa\b|multi-factor'),('Joiner-Mover-Leaver',r'joiner|mover|leaver|\bjml\b|lifecycle'),('Access reviews / certifications',r'access review|certification campaign|recertif'),('RBAC',r'\brbac|role-based'),('Zero Trust',r'zero trust'),('PowerShell',r'powershell'),('Python',r'python'),('AWS IAM',r'aws'),('Terraform',r'terraform'),('SOX / audit',r'\bsox\b|audit')]
HAVE={'Entra ID / Azure AD','Active Directory','MFA','Access reviews / certifications','Joiner-Mover-Leaver','SOX / audit','AWS IAM','RBAC'}
STAFF=re.compile(r'staffing|recruit|talent|teksystems|robert half|insight global|apex|kforce|randstad|cybercoders|dice|jobot|motion recruitment|saragossa|harnham|brooksource|beacon hill|collabera|infojini|kpg|diverse lynx|genesis10',re.I)
CONS=re.compile(r'accenture|deloitte|pwc|kpmg|ernst|\bey\b|ibm|cognizant|infosys|wipro|tcs|tata|capgemini|hcl|optiv|guidepoint|booz|leidos|saic|caci|grant thornton|protiviti|slalom|simeio|idmworks|integral partners',re.I)
SENIOR=re.compile(r'senior|\bsr\b|lead|principal|staff|architect|manager|director|head',re.I)
CLR=re.compile(r'(ts/sci|top secret|secret clearance|active clearance|clearance required|polygraph)',re.I)
def state(loc):
    for k,v in ST.items():
        if k in loc: return v
    m=re.search(r',\s*([A-Z]{2})\b',loc)
    if m: return m.group(1)
    l=loc.lower()
    for k,v in CITY.items():
        if k in l: return v
    return 'US' if re.search(r'united states|remote|\bus\b',l) else ''
def money(s):
    vals=[]
    for x,k in re.findall(r'\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)\s*([kK]?)\b',s):
        v=float(x.replace(',',''))*(1000 if k else 1)
        if 15<=v<=1000000: vals.append(v)
        if len(vals)==2: break
    if not vals: return None,None
    unit='hr' if re.search(r'/\s*h|hour|/hr',s,re.I) or max(vals)<500 else 'yr'
    return (min(vals),max(vals)),unit
def mode(r):
    t=(r['location']+' '+r['title']+' '+r.get('crit',{}).get('Workplace type','')+' '+r['desc'][:1500]).lower()
    if re.search(r'hybrid',t): return 'Hybrid'
    if re.search(r'\bremote\b',r['location'].lower()+' '+r['title'].lower()) or 'fully remote' in t or '100% remote' in t: return 'Remote'
    return 'On-site'
def jtype(r):
    t=(json.dumps(r.get('crit',{}))+' '+r['title']+' '+r['desc'][:800]).lower()
    if 'contract to hire' in t or 'contract-to-hire' in t or 'c2h' in t: return 'Contract-to-hire'
    if 'contract' in t or r.get('unit')=='hr': return 'Contract'
    return 'Full-time'
def posted(p):
    if re.match(r'\d{4}-\d\d-\d\d',p or ''): return p[:10]
    m=re.search(r'(\d+)\s+(minute|hour|day|week|month)',p or '')
    if not m: return TODAY.isoformat()
    n=int(m.group(1));d={'minute':0,'hour':0,'day':n,'week':7*n,'month':30*n}[m.group(2)]
    return (TODAY-D.timedelta(days=d)).isoformat()
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
REL=re.compile(r'identity|\biam\b|\bidm\b|\bpam\b|\biga\b|access management|access control|okta|sailpoint|saviynt|cyberark|entra|privileged|directory|ping ?identity|ciam|authentication|sso',re.I)
def norm(r):
    if not REL.search(r['title']): return None
    if r.get('pay'): p,u=tuple(r['pay']),r.get('unit') or 'yr'
    else: p,u=money(r.get('salary') or '')
    if not p:
        p2,u2=money(' '.join(re.findall(r'\$[\d,.]+\s*[kK]?\s*(?:-|–|to)\s*\$[\d,.]+\s*[kK]?(?:\s*(?:/|per)\s*h\w*)?',r['desc'])[:1]))
        p,u=p2,u2
    if p and (max(p)>1000000 or (u=='yr' and max(p)<1000)): p=None
    if p: p=(min(p),max(p))
    est=False
    if p:
        mid=sum(p)/2
        if (u=='yr' and mid<100000) or (u=='hr' and mid<75): return None
    else:
        if not SENIOR.search(r['title']): return None
        est=True
    clear=bool(r.get('clearance'))
    if CLR.search(r['title']+' '+r['desc']) and not clear: return None
    wm=mode(r);st=state(r['location'])
    if wm=='Remote' and st=='' : st='US'
    if wm=='On-site' and st not in ('NY','NJ'): return None
    txt=r['title']+' '+r['desc']
    reqs=[n for n,rx in SKILLS if re.search(rx,txt,re.I)][:8] or ['Enterprise IAM']
    have=[n for n in reqs if n in HAVE]; gaps=[f'{n}: covered in your Steps' for n in reqs if n not in HAVE][:4]
    co=r['company'] or 'Unknown'
    et='Staffing agency' if STAFF.search(co) else 'Consulting/SI' if CONS.search(co) else 'Direct employer'
    if p: pay=(f"${p[0]:,.0f}–${p[1]:,.0f}/yr" if u=='yr' else f"${p[0]:,.0f}–${p[1]:,.0f}/hr") if p[0]!=p[1] else f"${p[0]:,.0f}+/{u}"
    else: pay='est. $130,000+/yr (not posted)'
    jt=jtype(r)
    o=dict(id=f"{slug(co)}-{slug(r['title'])[:30].strip('-')}-{str(r['id'])[-6:]}",title=r['title'],company=co,pay=pay,pay_min=float(p[0]) if p else 130000.0,pay_est=est,type=jt,
        mode={'Remote':'Remote','Hybrid':'Hybrid'+(' NY/NJ' if st in('NY','NJ') else ''),'On-site':'On-site NY/NJ'}[wm],location=r['location'],state=st,source=r['src'],url=r['url'],posted=posted(r.get('posted')),
        reqs=reqs,fit=('You already work with '+', '.join(have)+'.') if have else 'Builds on your enterprise IAM operations background.',gaps=gaps,
        work_mode=wm,job_type=jt,employer_type=et,group='main',summary=r['desc'][:220].rsplit(' ',1)[0]+'…' if r['desc'] else '')
    if clear: o['clearance']=True
    return o
def key(j): return (slug(j['company']),slug(j['title']),j['state'])
def main():
    raw=[]
    for f in ('ats_raw.json','li_raw.json','boards_raw.json'):
        if os.path.exists(f): raw+=json.load(open(f))
    fresh={};
    for r in raw:
        j=norm(r)
        if j and key(j) not in fresh: fresh[key(j)]=j
    prev=json.load(open('scanned_prev.json')) if os.path.exists('scanned_prev.json') else []
    cut=(TODAY-D.timedelta(days=KEEP_DAYS)).isoformat();carried=0
    for j in prev:
        if key(j) not in fresh and j.get('posted','')>=cut: fresh[key(j)]=j;carried+=1
    out=sorted(fresh.values(),key=lambda j:j['posted'],reverse=True)
    json.dump(out,open('scanned.json','w'),indent=0,ensure_ascii=False)
    print(f'raw {len(raw)} -> kept fresh {len(out)-carried} + carried {carried} = {len(out)} (scanned.json)')
if __name__=='__main__': main()
