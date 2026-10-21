/* Server-side progress sync. localStorage = offline cache; the Ask Dad worker's Durable Object = source of truth. Latest timestamp wins per key. */
(()=>{const KEYS=['amjad-roadmap-v1','amjad-profile','amjad-streak','amjad-pv','amjad-applied-v1','amjad-ivmarks','amjad-jobfilters','amjad-ui','amjad-net','amjad-events','amjad-nl'],TK='amjad-sync-ts';
const SP=Storage.prototype,oSet=SP.setItem,oRm=SP.removeItem,ls=window.localStorage,U=()=>(window.ASKDAD_URL||'').replace(/\/$/,'')+'/state';
let T={};try{T=JSON.parse(ls.getItem(TK)||'{}')}catch(e){}
let dirty={},tm=null,quiet=false;
const saveT=()=>oSet.call(ls,TK,JSON.stringify(T));
function mark(k){if(quiet)return;T[k]=Date.now();saveT();dirty[k]=1;clearTimeout(tm);tm=setTimeout(push,1000)}
SP.setItem=function(k,v){oSet.call(this,k,v);if(this===ls&&KEYS.includes(k))mark(k)};
SP.removeItem=function(k){oRm.call(this,k);if(this===ls&&KEYS.includes(k))mark(k)};
function push(){const ks=Object.keys(dirty);if(!ks.length||!window.ASKDAD_URL)return;dirty={};const items={};ks.forEach(k=>items[k]={v:ls.getItem(k),ts:T[k]||Date.now()});
 fetch(U(),{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({items}),keepalive:true}).catch(()=>{ks.forEach(k=>dirty[k]=1)})}
window.addEventListener('online',()=>{KEYS.forEach(k=>{if(T[k]&&!T[k+'_s'])dirty[k]=1});push()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)push()});
window.amjadState={events:[],ready:null,push};
window.amjadState.ready=new Promise(res=>{const go=()=>{if(!window.ASKDAD_URL)return setTimeout(go,50);
 fetch(U(),{cache:'no-store'}).then(r=>r.json()).then(d=>{window.amjadState.events=d.events||[];let changed=false;const up={};
  KEYS.forEach(k=>{const s=(d.items||{})[k],lt=T[k]||0,lv=ls.getItem(k);
   if(s&&s.ts>lt){if(s.v!==lv){quiet=true;s.v==null?oRm.call(ls,k):oSet.call(ls,k,s.v);quiet=false;changed=true}T[k]=s.ts}
   else if(lv!=null&&(!s||lt>s.ts)){up[k]=1}});
  saveT();Object.assign(dirty,up);if(Object.keys(up).length)push();
  if(changed&&!sessionStorage.getItem('amjad-synced')){sessionStorage.setItem('amjad-synced','1');location.reload();return}
  res(d)}).catch(()=>res(null))};go()});
})();
