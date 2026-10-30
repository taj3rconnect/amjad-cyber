"""Merge transcript dumps (tx/tx.json, tx/tx_retry.json: {id: [{s,t}] | {error}}) into build/transcripts/<id>.json {status:'ok', segs:[[sec,text]]}."""
import json,os,sys
H=os.path.dirname(os.path.abspath(__file__));T=os.path.join(H,'transcripts');os.makedirs(T,exist_ok=True)
n=0
for f in sys.argv[1:] or [os.path.join(H,'..','tx','tx.json'),os.path.join(H,'..','tx','tx_retry.json')]:
    for k,v in json.load(open(f)).items():
        if isinstance(v,list) and v:
            json.dump({'status':'ok','segs':[[round(s['s']),s['t']] for s in v]},open(os.path.join(T,k+'.json'),'w'),ensure_ascii=False);n+=1
print('transcripts written/updated:',n,'| total ok files:',len([x for x in os.listdir(T) if not x.startswith('extra_')]))
