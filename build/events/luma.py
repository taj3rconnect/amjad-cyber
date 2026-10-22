"""Luma NYC discover feed (public API) -> security/identity/AI-security events within 60 mi of Edison, NJ -> luma_raw.json."""
import json,re,math,time,urllib.request,urllib.parse
P='discplace-Izx1rQVSh8njYpP'  # Luma "New York" discover place
HOME=(40.5187,-74.4121)        # Edison, NJ
KW=re.compile(r'secur|cyber|identity|\biam\b|zero trust|okta|grc|soc\b|hack|infosec|privacy|threat|devsecops|cloud|\bai\b agent|agentic',re.I)
STRONG=re.compile(r'secur|cyber|identity|\biam\b|zero trust|grc|infosec|hack|threat',re.I)
def miles(a,b):
    r=3958.8;p1,p2=math.radians(a[0]),math.radians(b[0]);dp=p2-p1;dl=math.radians(b[1]-a[1])
    return round(2*r*math.asin(math.sqrt(math.sin(dp/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2)))
def main():
    out=[];cur=None
    for _ in range(12):
        q={'discover_place_api_id':P,'pagination_limit':50}
        if cur: q['pagination_cursor']=cur
        d=json.load(urllib.request.urlopen(urllib.request.Request('https://api.lu.ma/discover/get-paginated-events?'+urllib.parse.urlencode(q),headers={'User-Agent':'Mozilla/5.0'}),timeout=30))
        for e in d.get('entries',[]):
            ev=e['event'];txt=ev['name']+' '+(e.get('calendar') or {}).get('name','')
            if not KW.search(txt): continue
            c=ev.get('coordinate') or {};g=ev.get('geo_address_info') or {}
            m=miles(HOME,(c['latitude'],c['longitude'])) if c.get('latitude') else None
            online=ev.get('location_type')=='online'
            if not online and (m is None or m>60): continue
            ti=e.get('ticket_info') or {}
            out.append(dict(title=ev['name'],start=ev['start_at'],end=ev.get('end_at'),online=online,venue=g.get('address') or g.get('sublocality'),city=g.get('city_state'),miles=m,
                org=', '.join(h.get('name','') for h in e.get('hosts',[])[:2]) or (e.get('calendar') or {}).get('name',''),cost='Free' if ti.get('is_free') else 'Paid',
                url='https://lu.ma/'+ev['url'],why='Security community; good for networking',src='Luma',rec=bool(re.search(r'identity|\biam\b|zero trust|grc',txt,re.I))))
        cur=d.get('next_cursor')
        if not d.get('has_more'): break
        time.sleep(.5)
    json.dump(out,open('luma_raw.json','w'),indent=0);print('Luma security events:',len(out))
if __name__=='__main__': main()
