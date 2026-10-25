"""Workday public CXS job APIs (no login): IAM searches on large employers' career sites -> wd_raw.json. Added Oct 25, 2026."""
import json,re,html,urllib.request,concurrent.futures as F
from scan import pay as findpay
T=[('sailpoint',1,'SailPoint'),('pru',5,'Careers'),('jj',5,'JJ'),('msd',5,'SearchJobs'),('citi',5,'2'),('ms',5,'External'),('statestreet',1,'Global'),('travelers',5,'External'),('cvshealth',1,'CVS_Health_Careers'),('humana',5,'Humana_External_Career_Site'),('mastercard',1,'CorporateCareers'),('verizon',12,'verizon-careers'),('pfizer',1,'PfizerCareers'),('cigna',5,'cignacareers'),('capitalone',12,'Capital_One'),('salesforce',12,'External_Career_Site'),('nvidia',5,'NVIDIAExternalCareerSite'),('intel',1,'External'),('mufgub',3,'MUFG-Careers'),('tiaa',1,'Search'),('blackrock',1,'BlackRock_Professional'),('db',3,'DBWebsite'),('mmc',1,'MMC'),('aig',1,'aig'),('leidos',5,'External'),('crowdstrike',5,'crowdstrikecareers'),('equifax',5,'External'),('fiserv',5,'EXT'),('kyndryl',5,'KyndrylProfessionalCareers'),('zoetis',5,'zoetis')]
NAME={'pru':'Prudential','jj':'Johnson & Johnson','msd':'Merck','citi':'Citi','ms':'Morgan Stanley','statestreet':'State Street','cvshealth':'CVS Health','mmc':'Marsh McLennan','aig':'AIG','mufgub':'MUFG','tiaa':'TIAA','db':'Deutsche Bank','nvidia':'NVIDIA','sailpoint':'SailPoint','capitalone':'Capital One','blackrock':'BlackRock'}
REL=re.compile(r'identity|\biam\b|access management|okta|sailpoint|cyberark|entra|privileged|\bpam\b|ciam|\bidm\b|\biga\b',re.I)
Q=['identity access management','IAM','identity','Okta','SailPoint','CyberArk','privileged access']
H={'Content-Type':'application/json','Accept':'application/json','User-Agent':'Mozilla/5.0'}
def req(u,body=None):
    try: return json.load(urllib.request.urlopen(urllib.request.Request(u,data=json.dumps(body).encode() if body else None,headers=H),timeout=25))
    except Exception: return None
def txt(h): return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',html.unescape(h or ''))))
def tenant(t):
    ten,n,site=t;base=f'https://{ten}.wd{n}.myworkdayjobs.com';api=f'{base}/wday/cxs/{ten}/{site}';paths={}
    for q in Q:
        for off in (0,20):
            d=req(api+'/jobs',{"appliedFacets":{},"limit":20,"offset":off,"searchText":q}) or {}
            js=d.get('jobPostings',[])
            for j in js:
                if REL.search(j.get('title','')): paths[j['externalPath']]=j
            if len(js)<20: break
    out=[]
    for p in paths:
        d=(req(api+p) or {}).get('jobPostingInfo')
        if not d or (d.get('country') or {}).get('descriptor') not in (None,'United States of America','United States'): continue
        desc=txt(d.get('jobDescription'));pr,u=findpay(desc)
        loc='; '.join([d.get('location','')]+d.get('additionalLocations',[]))
        rt=(d.get('remoteType') or '')
        if rt: loc+=f' ({rt})'
        out.append(dict(src='Workday (company ATS)',id=d.get('jobReqId') or p[-8:],title=d.get('title',''),company=NAME.get(ten,ten.title()),location=loc,desc=desc,pay=pr,unit=u,
            url=d.get('externalUrl') or base+'/'+site+p,posted=(d.get('startDate') or '')[:10],crit={'Employment type':d.get('timeType',''),'Workplace type':rt}))
    print(' ',ten,len(paths),'->',len(out));return out
if __name__=='__main__':
    R=[]
    with F.ThreadPoolExecutor(8) as ex:
        for r in ex.map(lambda t:(lambda:tenant(t))() if True else [],T): R+=r
    json.dump(R,open('wd_raw.json','w'),indent=0);print('Workday relevant postings:',len(R))
