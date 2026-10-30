"""Build site/search.json (MiniSearch docs: t=group, ti=title, x=text, r=route/url, yt, ts, ext, i).
Static groups (Steps, Job search, AI training gigs, Certifications, Prompts, Documents, Networking, Newsletters, Portfolio projects,
Target companies, Mentorship, LinkedIn content plan, Cert exam prep, video title rows) come from search_static.json (frozen from live v19
because content.py was lost; edit that file or regenerate if the page content changes). Dynamic: Jobs, Events, Today, transcript chunks."""
import json,os,glob,re
H=os.path.dirname(os.path.abspath(__file__));S=os.path.join(H,'..','site');L=lambda f:json.load(open(os.path.join(S,f)))
docs=json.load(open(os.path.join(H,'search_static.json')))
titles={x['yt']:x['ti'] for x in docs if x.get('yt')}
for f in glob.glob(os.path.join(H,'transcripts','extra_*.json')):
    for v in json.load(open(f)):
        titles[v['id']]=v['title']
        if not any(x.get('yt')==v['id'] for x in docs):
            docs.append(dict(t='Videos',ti=v['title'],x=v.get('channel',''),r=f"https://www.youtube.com/watch?v={v['id']}",yt=v['id'],ext=1))
ntx=0
for vid,ti in titles.items():
    p=os.path.join(H,'transcripts',vid+'.json')
    if not os.path.exists(p): continue
    d=json.load(open(p))
    if d.get('status')!='ok': continue
    ntx+=1;sg=d['segs']
    for i in range(0,len(sg),8):
        c=sg[i:i+8];ts=int(c[0][0])
        docs.append(dict(t='Videos',ti=ti,x=' '.join(s[1] for s in c),r=f'https://www.youtube.com/watch?v={vid}&t={ts}s',yt=vid,ts=ts,ext=1))
for j in L('jobs.json')['jobs']:
    if j.get('group')=='gig': continue
    docs.append(dict(t='Jobs',ti=f"{j['title']} · {j['company']}",x=' '.join(str(j.get(k) or '') for k in ('pay','location','work_mode','job_type','employer_type','state','summary'))+' '+' '.join(j.get('reqs',[])),r=f"#/job/{j['id']}"))
for e in L('events.json'):
    docs.append(dict(t='Events',ti=e['title'],x=' '.join(str(e.get(k) or '') for k in ('start_et','city','venue','org','why','cost')),r=f"#/events/{e['id']}"))
for t in L('today.json').get('items',[]):
    docs.append(dict(t='Today',ti=t['headline'],x=f"{t.get('product','')} {t.get('explanation','')}",r='#/today'))
order=['Steps','Job search','AI training gigs','Certifications','Prompts','Documents','Videos','Jobs','Today','Networking','Events','Newsletters','Portfolio projects','Target companies','Mentorship','LinkedIn content plan','Cert exam prep','Claude cert']
docs.sort(key=lambda x:order.index(x['t']) if x['t'] in order else 99)
for i,x in enumerate(docs): x['i']=i
json.dump(docs,open(os.path.join(S,'search.json'),'w'),ensure_ascii=False,separators=(',',':'))
print(f'search.json: {len(docs)} docs; videos with transcripts indexed: {ntx}/{len(titles)}')
