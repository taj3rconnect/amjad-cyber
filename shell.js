/* App shell: fixed top bar + left menu + jobs sidebar + hash-routed main pane. */
(()=>{const $=(s,r=document)=>[...r.querySelectorAll(s)],q1=(s,r=document)=>r.querySelector(s),E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const W=()=>(window.ASKDAD_URL||'').replace(/\/$/,''),LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},SET=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const ET=ts=>new Date(ts).toLocaleString('en-US',{timeZone:'America/New_York',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})+' ET';
const md=t=>E(String(t??'').replace(/^#+\s*/gm,'')).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|\W)\*(?!\s)(.+?)\*(?=\W|$)/g,'$1<i>$2</i>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\n/g,'<br>');
const hl=(t,w)=>{t=E(t);if(!w)return t;return t.replace(new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>')};
/* ---------- CSS ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
:root{--mw:220px;--jw:300px;--tb:58px}
html{scroll-padding-top:calc(var(--tb) + 12px)}
.top{position:fixed!important;left:0;right:0;top:0}
body{padding-top:var(--tb)}
body,main,.hero,.sec,.coach,h1,h2,h3,p,.bd .m,.modal,.qz{text-align:left!important}
main{max-width:none!important;margin:0!important;padding:0 20px 120px!important}
#views>section,#views>div{max-width:980px}
.navg{display:none!important}.vhide{display:none!important}
#smenu{position:fixed;left:0;top:var(--tb);bottom:0;width:var(--mw);background:#0b1b3f;color:#cfd8ff;overflow:auto;z-index:45;padding:10px 8px 80px;font:600 14px/1.3 Inter,system-ui,sans-serif}
#smenu a{display:flex;gap:10px;align-items:center;color:#cfd8ff;text-decoration:none;padding:10px 12px;border-radius:12px;min-height:40px}
#smenu a:hover{background:rgba(255,255,255,.08)}#smenu a.on{background:linear-gradient(90deg,#4f46e5,#db2777);color:#fff}
#smenu .mh{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8ea0d6;padding:14px 12px 4px}
#jside{position:fixed;left:var(--mw);top:var(--tb);bottom:0;width:var(--jw);background:#fff;border-right:1px solid #e3e8f7;z-index:40;display:flex;flex-direction:column;font:14px/1.45 Inter,system-ui,sans-serif}
#jside .jh{position:sticky;top:0;background:#fff;padding:10px 12px 6px;border-bottom:1px solid #eef1fb}
#jside h3{margin:0 0 6px;font-size:15px;color:#0b1b3f}
#jside .ls{overflow:auto;flex:1;padding:4px 10px 90px}
.jsq{width:100%;box-sizing:border-box;height:38px;border:1px solid #e3e8f7;border-radius:10px;padding:0 10px;font-size:16px}
.pills{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 0}.pills .pl{font:600 12px/1 Inter,system-ui;border:1px solid #dfe4f5;background:#f6f8ff;color:#33415c;border-radius:99px;padding:6px 9px;cursor:pointer;min-height:28px}
.pills .pl.on{background:#4f46e5;color:#fff;border-color:#4f46e5}.pills .pl i{font-style:normal;opacity:.7;margin-left:3px}.pills .gl{font-size:10.5px;color:#6b7590;width:100%;margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
#jside .pills{max-height:118px;overflow:auto}
.pfold{font-size:12px;color:#4f46e5;background:none;border:0;padding:4px 0;cursor:pointer}
.jbc{display:block;border:1px solid #e3e8f7;border-radius:14px;padding:10px 12px;margin:8px 0;background:linear-gradient(180deg,#fff,#f8f9ff);color:inherit;text-decoration:none;cursor:pointer}
.jbc:hover{border-color:#a5b4fc}.jbc.on{border-color:#4f46e5;box-shadow:0 0 0 2px #c7d2fe}.jbc.ap{opacity:.65}
.jbc .t{font-weight:700;color:#3730a3}.jbc .m{font-size:12px;color:#6b7590}.jbc .p{font-weight:700;color:#047857}.jbc .new{background:#fde68a;color:#78350f;border-radius:99px;padding:0 7px;font-size:11px;font-weight:700;margin-left:4px}
.jbc .row{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.chip{font-size:11px;background:#eef2ff;color:#4338ca;border-radius:99px;padding:2px 8px}
.jbtn{display:inline-flex;align-items:center;gap:6px;border:0;border-radius:12px;padding:9px 14px;font-weight:700;cursor:pointer;text-decoration:none;min-height:40px;font-size:14px}
.jbtn.pri{background:linear-gradient(90deg,#4f46e5,#db2777);color:#fff}.jbtn.sec2{background:#eef2ff;color:#3730a3}.jbtn.sm{padding:5px 10px;min-height:30px;font-size:12.5px}
.vw h1{font-size:clamp(24px,3vw,34px);color:#0b1b3f;margin:18px 0 6px}.vw .card{background:#fff;border:1px solid #e3e8f7;border-radius:18px;padding:18px 20px;margin:14px 0}
.vw .mut{color:#6b7590}.vw .kv{display:grid;grid-template-columns:max-content 1fr;gap:4px 14px;font-size:14.5px}.vw .kv b{color:#0b1b3f}
.vw iframe.jd{width:100%;height:70vh;border:1px solid #e3e8f7;border-radius:14px;background:#fff}
.qcard .qt{font-weight:700;color:#0b1b3f}.qcard .ty{font-size:11px;font-weight:700;text-transform:uppercase;color:#db2777;letter-spacing:.06em}.spin{display:inline-block;width:16px;height:16px;border:3px solid #c7d2fe;border-top-color:#4f46e5;border-radius:50%;animation:sp .8s linear infinite;vertical-align:-3px}@keyframes sp{to{transform:rotate(360deg)}}.sk{height:14px;border-radius:7px;margin:10px 0;background:linear-gradient(90deg,#eef1fb,#f8f9ff,#eef1fb);background-size:200% 100%;animation:skl 1.2s infinite}@keyframes skl{to{background-position:-200% 0}}.mock .b.iv p{margin:.3em 0}
.qcard .ans{display:none;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px 14px;margin-top:10px}.qcard .ans.on{display:block}
.qcard .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.mk.on{outline:2px solid #4f46e5}
.mock{display:flex;flex-direction:column;gap:10px}.mock .b{border-radius:14px;padding:12px 14px;white-space:pre-wrap;max-width:760px}.mock .iv{background:#fff;border:1px solid #e3e8f7}.mock .me{background:#eef2ff;align-self:flex-start}
.mockin{display:flex;gap:8px;align-items:flex-end;margin-top:10px}.mockin textarea{flex:1;min-height:70px;border:1px solid #dfe4f5;border-radius:12px;padding:10px;font:16px/1.4 Inter,system-ui}
.tl{border-left:3px solid #c7d2fe;margin-left:6px;padding-left:14px}.tl .e{margin:10px 0}.tl .e small{color:#6b7590;display:block}
#sres .gh{display:block;padding:6px 12px 2px;font-size:11px;font-weight:800;text-transform:uppercase;color:#6b7590;letter-spacing:.06em;pointer-events:none}
.hamb{display:none;background:none;border:0;color:#fff;font-size:24px;width:44px;height:44px;cursor:pointer}
#mshade{display:none}
#jside{transition:transform .25s ease,opacity .25s}body{transition:padding-left .25s ease}
.jcol{position:absolute;right:8px;top:8px;border:0;background:#eef1fb;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:16px}
#jrail{display:none;position:fixed;left:var(--mw);top:calc(var(--tb) + 12px);z-index:41;writing-mode:vertical-rl;transform:rotate(180deg);background:linear-gradient(180deg,#4f46e5,#db2777);color:#fff;border:0;border-radius:12px 0 0 12px;padding:14px 8px;font:700 13px Inter,system-ui;cursor:pointer;box-shadow:0 6px 18px rgba(79,70,229,.3)}
.jtop{background:rgba(255,255,255,.12);border:0;color:#fff;border-radius:10px;height:40px;padding:0 10px;font:700 13px Inter,system-ui;cursor:pointer;display:none}
@media(min-width:1280px){body.jcollapsed{padding-left:var(--mw)}body.jcollapsed #jside{transform:translateX(-110%);opacity:0;pointer-events:none}body.jcollapsed #jrail{display:block}body.jcollapsed .totop{left:calc(var(--mw) + 16px)!important}.jtop{display:inline-block}}
.more{display:block;margin:10px auto;}
@media(min-width:1280px){body{padding-left:calc(var(--mw) + var(--jw))}.totop{left:calc(var(--mw) + var(--jw) + 16px)!important}}
@media(min-width:900px) and (max-width:1279px){body{padding-left:var(--mw)}#jside{display:none}.totop{left:calc(var(--mw) + 16px)!important}}
@media(max-width:899px){.hamb{display:block}#jside{display:none}
 #smenu{transform:translateX(-105%);transition:transform .22s;width:min(82vw,300px);z-index:210;top:0;padding-top:max(14px,env(safe-area-inset-top))}
 body.mopen #smenu{transform:none}body.mopen #mshade{display:block;position:fixed;inset:0;background:rgba(11,27,63,.45);z-index:205}
 main{padding:0 14px 120px!important}}
</style>`);
/* ---------- menu ---------- */
const MENU=[['home','🏠','Home'],['progress','📈','My progress'],['steps','🪜','Steps'],['certs','🎓','Certifications'],['jobs','💼','Jobs found for you'],['jobsearch','🧭','Job search track'],['mustwatch','🎬','Must-watch'],['mustread','📚','Must-read'],['prompts','✨','Prompts'],['bots','🤖','Bots & tools'],['gigs','🧠','AI training gigs'],['network','🤝','LinkedIn networking'],['events','📅','Events'],['newsletters','📰','Newsletters'],['projects','🛠️','Portfolio projects'],['apps','📋','Application tracker'],['exam','🎓','Cert exam prep'],['content','✍️','LinkedIn content plan'],['companies','🏢','Target companies'],['mentors','🧭','Mentorship'],['today','📰','Today history'],['history','🕘','Ask Dad history'],['guides','📄','Guides'],['quiz','🧩','Retake quiz'],['claudecert','🎓','Get Claude certified']];
const top=q1('header.top'),brand=q1('a.brand');
top.insertAdjacentHTML('afterbegin','<button class="hamb" aria-label="Open menu" type="button">☰</button>');
document.body.insertAdjacentHTML('beforeend',`<div id="mshade"></div><nav id="smenu" aria-label="Main menu">${MENU.map(([k,i,t])=>`<a href="#/${k}" data-v="${k}"><span>${i}</span>${t}</a>`).join('')}</nav>
<aside id="jside" aria-label="Jobs found for you"><div class="jh" style="position:relative"><button class="jcol" type="button" aria-label="Hide jobs panel" title="Hide jobs panel">⟨</button><h3>💼 Jobs found for you <span class="jcount mut" style="font-weight:600"></span></h3><input class="jsq" type="search" placeholder="Search jobs: title, skill, city, pay…" aria-label="Search jobs"><div class="pills"></div><button class="pfold" type="button">Hide filters</button> · <button class="rf" type="button">Reset filters</button></div><div class="ls">Loading…</div></aside><button id="jrail" type="button" aria-label="Show jobs panel">💼 Jobs (<span class="jcount2"></span>) ⟩</button>`);top.querySelector('.brand').insertAdjacentHTML('afterend','<button class="jtop" type="button" aria-label="Show or hide jobs panel" title="Show or hide jobs panel">💼 Jobs</button>');
const body=document.body,mopen=o=>body.classList.toggle('mopen',o);
q1('.hamb').onclick=()=>mopen(!body.classList.contains('mopen'));q1('#mshade').onclick=()=>mopen(false);
q1('#smenu').addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.dataset.v==='quiz'){e.preventDefault();mopen(false);q1('.retake').click();return}mopen(false)});
brand.onclick=e=>{e.preventDefault();$('.bd.on').forEach(b=>{b.classList.remove('on')});location.hash='#/home'};
const UK='amjad-ui',ui=()=>LS(UK,{}),setUI=(k,v)=>{const u=ui();u[k]=v;SET(UK,u)};
function applyUI(){const u=ui();body.classList.toggle('jcollapsed',!!u.jcol);const p=q1('#jside .pills');p.hidden=!!u.pills;q1('#jside .pfold').textContent=u.pills?'Show filters':'Hide filters'}
q1('#jside .pfold').onclick=()=>{setUI('pills',!ui().pills);applyUI()};
q1('.jcol').onclick=()=>{setUI('jcol',true);applyUI()};q1('#jrail').onclick=()=>{setUI('jcol',false);applyUI()};
document.addEventListener('click',e=>{if(e.target.closest('.jtop')){if(innerWidth<1280){location.hash='#/jobs';return}setUI('jcol',!ui().jcol);applyUI()}});
applyUI();
/* ---------- views from existing sections ---------- */
const main=q1('main');const views=document.createElement('div');views.id='views';
const MAP={hero:'home',coach:'home',letter:'home',accounts:'home',glance:'home','askdad-help':'home',certs:'certs',soc:'steps',grcb:'steps',jobsearch:'jobsearch',roles:'jobsearch',resume:'jobsearch',linkedin:'jobsearch',interview:'jobsearch',apply:'jobsearch',jobs:'_hide',aitrain:'gigs',mustwatch:'mustwatch',mustread:'mustread',bots:'bots'};
const kids=[...main.children];let pending=[];
kids.forEach(el=>{if(el.id==='sres'||el.classList.contains('navg'))return;let v=el.classList.contains('hero')?'home':(el.id||'').startsWith('step-')?'steps':MAP[el.id];
 if(!v){pending.push(el);return}pending.forEach(p=>p.dataset.view=v);pending=[];el.dataset.view=v});
pending.forEach(p=>p.dataset.view='home');
$('main>[data-view]').forEach(el=>{if(el.dataset.view==='_hide'){el.hidden=true;el.classList.add('vhide')}else views.append(el)});
main.append(views);
const dyn=document.createElement('div');dyn.className='vw';dyn.id='dyn';views.append(dyn);
/* ---------- data ---------- */
let JOBS=[],TODAY=[],HIST=null;const jobsReady=fetch('jobs.json?'+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(d=>{JOBS=d.jobs||[];return JOBS}).catch(()=>[]);
const AK='amjad-applied-v1',FK='amjad-jobfilters',MK='amjad-ivmarks';
const applied=()=>LS(AK,{}),isAp=j=>{const a=applied();return a[j.id]||a[j.url]};
function toggleAp(j,on){const a=applied();delete a[j.url];if(on)a[j.id]=new Date().toLocaleDateString('en-US',{timeZone:'America/New_York'});else delete a[j.id];SET(AK,a);drawSide();if(cur.v==='job'||cur.v==='jobs')route()}
/* ---------- filters ---------- */
const FG=[['work_mode','Work mode',['On-site','Hybrid','Remote','Remote + travel']],['job_type','Job type',['Contract','Full-time','Contract-to-hire']],['employer_type','Employer',['Direct employer','Consulting/SI','Staffing agency','AI training gig']],['state','State',[]]];
const getF=()=>Object.assign({work_mode:[],job_type:[],employer_type:[],state:[]},LS(FK,{}));
const opts=(k,os)=>k==='state'?[...new Set(JOBS.map(j=>j.state).filter(Boolean))].sort((a,b)=>(a==='US')-(b==='US')||a.localeCompare(b)):os;
let SQ={side:'',main:''};
const hay=j=>[j.title,j.company,j.location,j.pay,j.mode,j.summary,(j.reqs||[]).join(' '),j.fit,j.source,j.employer_type,j.job_type].join(' ').toLowerCase();
function filt(w,skipG){const F=getF();return JOBS.filter(j=>FG.every(([k])=>k===skipG||!F[k]?.length||F[k].includes(j[k]))&&(!w||w.toLowerCase().split(/\s+/).every(x=>hay(j).includes(x))))}
function pillsHTML(w){const F=getF();const all=!FG.some(([k])=>F[k]?.length);
 return `<button class="pl${all?' on':''}" data-all="1" type="button">All<i>${filt(w).length}</i></button>`+FG.map(([k,l,os])=>`<span class="gl">${l}</span>`+opts(k,os).map(o=>{const n=filt(w,k).filter(j=>j[k]===o).length;return `<button class="pl${F[k]?.includes(o)?' on':''}" data-g="${k}" data-o="${E(o)}" type="button">${E(o==='US'?'Remote (any US)':o)}<i>${n}</i></button>`}).filter((h,i,a)=>k!=='state'||!/<i>0<\/i>/.test(h)||getF().state.includes(opts(k,os)[i])).join('')).join('')}
document.addEventListener('click',e=>{const p=e.target.closest('.pills .pl');if(!p)return;let F=getF();
 if(p.dataset.all)F={work_mode:[],job_type:[],employer_type:[],state:[]};else{const g=p.dataset.g,o=p.dataset.o;F[g]=F[g]||[];F[g]=F[g].includes(o)?F[g].filter(x=>x!==o):[...F[g],o]}
 SET(FK,F);drawSide();if(cur.v==='jobs')route()});
const sortJ=L=>[...L].sort((a,b)=>(a.group==='gig')-(b.group==='gig')||String(b.posted).localeCompare(String(a.posted)));
const wk=Date.now()-7*864e5,loc=j=>j.location&&j.location.toLowerCase().startsWith(String(j.work_mode).toLowerCase())?j.location:`${j.work_mode} · ${j.location}`;
function card(j,w,act){return `<a class="jbc${isAp(j)?' ap':''}${act?' on':''}" href="#/job/${E(j.id)}"><span class="t">${hl(j.title,w)}</span>${Date.parse(j.posted)>wk?'<span class="new">NEW</span>':''}<div class="m">${hl(j.company,w)}</div><div class="p">${hl(j.pay,w)}</div><div class="m">${hl(loc(j),w)} · ${E(j.job_type)} · ${E(j.employer_type)}</div><div class="m">${j.source&&j.source!==j.employer_type?E(j.source)+' · ':''}posted ${E(j.posted)}${j.pay_est?' · pay est.':''}${isAp(j)?' · ✅ Applied '+E(isAp(j)):''}</div>
<div class="row"><button class="jbtn sec2 sm" data-ap="${E(j.id)}" type="button">${isAp(j)?'✅ Applied':'Mark applied'}</button><button class="jbtn sec2 sm" data-iv="${E(j.id)}" type="button">🎤 Practice interview</button></div></a>`}
document.addEventListener('click',e=>{const a=e.target.closest('[data-ap]'),v=e.target.closest('[data-iv]');if(a){e.preventDefault();e.stopPropagation();const j=JOBS.find(x=>x.id===a.dataset.ap);toggleAp(j,!isAp(j))}else if(v){e.preventDefault();e.stopPropagation();location.hash='#/interview/'+v.dataset.iv}},true);
let PG={side:30,main:30};
function drawSide(){const w=SQ.side,L=sortJ(filt(w));$('.jcount').forEach(e=>e.textContent='('+L.length+')');$('.jcount2').forEach(e=>e.textContent=L.length);q1('#jside .pills').innerHTML=pillsHTML(w);q1('#jside .ls').innerHTML=L.slice(0,PG.side).map(j=>card(j,w,cur.v==='job'&&cur.a===j.id||cur.v==='interview'&&cur.a===j.id)).join('')+(L.length>PG.side?`<button class="jbtn sec2 more" data-more="side" type="button">Show more (${L.length-PG.side})</button>`:'')||'<p class="mut" style="padding:8px">No jobs match these filters. Tap All to reset.</p>'}
q1('#jside .jsq').addEventListener('input',e=>{SQ.side=e.target.value.trim();drawSide()});
document.addEventListener('click',e=>{const m=e.target.closest('[data-more]');if(!m)return;PG[m.dataset.more]+=30;if(m.dataset.more==='side')drawSide();else{route.keep=true;const y=scrollY;RV.jobs().then(()=>scrollTo(0,y))}});
const ls=q1('#jside .ls');ls.addEventListener('scroll',()=>{if(ls.scrollTop+ls.clientHeight>ls.scrollHeight-300&&q1('[data-more=side]',ls)){PG.side+=30;const t=ls.scrollTop;drawSide();ls.scrollTop=t}},{passive:true});
/* ---------- router ---------- */
let cur={v:'home'};
function parse(){const h=location.hash||'#/home';if(h.startsWith('#/')){const [v0,...a]=h.slice(2).split('?')[0].split('/'),v=v0;return {v:v||'home',a:decodeURIComponent(a.join('/'))}}
 const id=h.slice(1);const el=document.getElementById(id);if(id==='today')return {v:'today'};if(el){const sec=el.closest('[data-view]');if(sec)return {v:sec.dataset.view,anchor:id}}return {v:'home'}}
function show(v){$('#views>[data-view]').forEach(el=>el.classList.toggle('vhide',el.dataset.view!==v));dyn.hidden=$('#views>[data-view]').some(el=>el.dataset.view===v);
 $('#smenu a').forEach(a=>a.classList.toggle('on',a.dataset.v===v||(v==='job'||v==='interview')&&a.dataset.v==='jobs'))}
async function route(){cur=parse();const v=cur.v;show(v);dyn.innerHTML='';drawSide();
 const R=RV[v];if(R){await R(cur.a)}
 if(cur.anchor){const el=document.getElementById(cur.anchor);el&&setTimeout(()=>el.scrollIntoView({behavior:'auto',block:'start'}),30)}else if(!route.keep)scrollTo(0,0);route.keep=false}
addEventListener('hashchange',route);
/* ---------- dynamic views ---------- */
const RV={};
RV.jobs=async()=>{await jobsReady;const w=SQ.main,L=sortJ(filt(w));dyn.innerHTML=`<h1>💼 Jobs found for you</h1><p class="mut">Verified roles paying $100K+ (or $75+/hr contract): NY/NJ on-site or hybrid, remote anywhere in the US, and travel roles. AI training gigs are listed separately and can pay less. Tap a job for details, interview practice and the apply link.</p>
<input class="jsq" id="jmq" type="search" placeholder="Search jobs: title, skill, city, pay…" value="${E(w)}" style="max-width:520px"><button class="rf" type="button">Reset filters</button><div class="pills">${pillsHTML(w)}</div><div id="jml">${L.slice(0,PG.main).map(j=>card(j,w)).join('')+(L.length>PG.main?`<button class="jbtn sec2 more" data-more="main" type="button">Show more (${L.length-PG.main})</button>`:'')||'<p class="mut">No jobs match these filters. Tap All to reset.</p>'}</div>`;
 const i=q1('#jmq');i.oninput=()=>{SQ.main=i.value.trim();q1('#jml').innerHTML=sortJ(filt(SQ.main)).slice(0,PG.main).map(j=>card(j,SQ.main)).join('');q1('.vw .pills').innerHTML=pillsHTML(SQ.main)}};
RV.job=async id=>{await jobsReady;const j=JOBS.find(x=>x.id===id);if(!j){dyn.innerHTML='<h1>Job not found</h1><p><a href="#/jobs">Back to jobs</a></p>';return}drawSide();
 const site=(()=>{try{return new URL(j.url).hostname.replace(/^www\./,'')}catch(e){return 'the site'}})();
 dyn.innerHTML=`<p><a href="#/jobs">← All jobs</a></p><h1>${E(j.title)}</h1><p class="mut" style="font-size:17px">${E(j.company)}</p>
<div class="card"><div class="kv"><b>Pay</b><span>${E(j.pay)}</span><b>Work mode</b><span>${E(j.work_mode)}</span><b>Location</b><span>${E(j.location)}${j.also_in?` <span class="mut">(also posted in ${E(j.also_in.join("; "))})</span>`:""}</span><b>Job type</b><span>${E(j.job_type)}</span><b>Employer</b><span>${E(j.employer_type)}</span><b>Posted</b><span>${E(j.posted)}</span><b>Source</b><span>${E(j.source)}</span></div>
<div class="row" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><a class="jbtn pri" href="${E(j.url)}" target="_blank" rel="noopener">Apply on ${E(site)} ↗</a><button class="jbtn sec2" data-iv="${E(j.id)}" type="button">🎤 Practice interview</button><button class="jbtn sec2" data-ap="${E(j.id)}" type="button">${isAp(j)?'✅ Applied '+E(isAp(j))+' (tap to undo)':'Mark as applied'}</button></div></div>
${j.summary?`<div class="card"><h3>About the role</h3><p>${E(j.summary)}</p>${(j.reqs||[]).length?'<h3>Key requirements</h3><ul>'+j.reqs.map(r=>`<li>${E(r)}</li>`).join('')+'</ul>':''}</div>`:''}
${j.fit?`<div class="card"><h3>💪 Why it fits you</h3><p>${E(j.fit)}</p></div>`:''}
${(j.gaps||[]).length?`<div class="card"><h3>🎯 Gaps to prep</h3><ul>${j.gaps.map(g=>`<li>${E(g)}</li>`).join('')}</ul></div>`:''}
<div class="card"><h3>Original listing</h3><p style="word-break:break-all">🔗 <a href="${E(j.url)}" target="_blank" rel="noopener">${E(j.url)} ↗</a></p>${j.frameable?`<iframe class="jd" src="${E(j.url)}" title="Original job listing" loading="lazy" referrerpolicy="no-referrer"></iframe><p class="mut">If the listing looks blank, <a href="${E(j.url)}" target="_blank" rel="noopener">open it on ${E(site)} ↗</a>.</p>`:`<p class="mut">This listing can't be shown inside the app, so open it in a new tab:</p><a class="jbtn pri" href="${E(j.url)}" target="_blank" rel="noopener">Open on ${E(site)} ↗</a>`}</div>`};
/* interview */
const post=(b)=>fetch(W()+'/interview',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
const marks=()=>LS(MK,{});function setMark(k,m,q){const M=marks();M[k]={m,q:String(q).slice(0,200),ts:Date.now()};SET(MK,M)}
const jobLite=j=>({id:j.id,title:j.title,company:j.company,mode:j.work_mode,location:j.location,pay:j.pay,summary:j.summary,reqs:j.reqs});
async function learn(btn,concept){btn.disabled=true;btn.textContent='Finding a video…';try{const d=await post({mode:'video',concept,job:{}});
 if(d.video){btn.outerHTML=`<a class="jbtn sec2 sm" href="${E(d.video.url)}" target="_blank" rel="noopener">▶ ${E(d.video.title)} <span class="mut">(${E(d.video.channel)}, ${E(d.video.date)})</span></a>`}else{btn.textContent='No recent video found. Ask Dad?';btn.disabled=false;btn.onclick=()=>window.askDad&&window.askDad('Explain '+concept+' for an IAM interview')}}catch(e){btn.textContent='Try again';btn.disabled=false}}
function qcard(k,q,i){const M=marks()[k];return `<div class="card qcard"><div class="ty">${E(q.type||'Question')} · Q${i+1}</div><div class="qt">${E(q.q)}</div>
<div class="acts"><button class="jbtn sec2 sm" data-show type="button">👀 Show the right answer</button>${q.concept?`<button class="jbtn sec2 sm" data-learn="${E(q.concept)}" type="button">🎓 Learn this concept: ${E(q.concept)}</button>`:''}
<button class="jbtn sec2 sm mk${M?.m==='got'?' on':''}" data-mk="got" data-k="${E(k)}" type="button">✅ Got it</button><button class="jbtn sec2 sm mk${M?.m==='again'?' on':''}" data-mk="again" data-k="${E(k)}" type="button">🔁 Practice again</button></div>
<div class="ans">${md(q.a)}${(q.points||[]).length?'<p><b>Key points to hit</b></p><ul>'+q.points.map(p=>`<li>${md(p)}</li>`).join('')+'</ul>':''}</div></div>`}
dyn.addEventListener('click',e=>{const s=e.target.closest('[data-show]'),l=e.target.closest('[data-learn]'),m=e.target.closest('[data-mk]');
 if(s){const a=q1('.ans',s.closest('.qcard'));a.classList.toggle('on');s.textContent=a.classList.contains('on')?'🙈 Hide answer':'👀 Show the right answer'}
 if(l)learn(l,l.dataset.learn);
 if(m){const c=m.closest('.qcard');setMark(m.dataset.k,m.dataset.mk,q1('.qt',c).textContent);$('[data-mk]',c).forEach(b=>b.classList.toggle('on',b===m))}});
RV.interview=async id=>{await jobsReady;const j=JOBS.find(x=>x.id===id);if(!j){dyn.innerHTML='<h1>Job not found</h1>';return}
 dyn.innerHTML=`<p><a href="#/job/${E(j.id)}">← ${E(j.title)}</a></p><h1>🎤 Interview practice</h1><p class="mut">${E(j.title)} · ${E(j.company)}. You've got this: every rep makes the real one easier.</p>
<div class="row" style="display:flex;gap:8px;flex-wrap:wrap"><button class="jbtn pri" id="mockGo" type="button">▶ Start live mock interview</button></div><div id="mockBox"></div><div id="prep"><div class="card"><span class="spin"></span> <b>Preparing questions tailored to this job and your experience…</b><p class="mut">First time only takes about 20 seconds, then it's saved and instant.</p><div class="sk"></div><div class="sk" style="width:80%"></div><div class="sk" style="width:60%"></div></div></div>`;
 q1('#mockGo').onclick=()=>mock(j);
 try{const p=await post({mode:'prep',job:jobLite(j)});if(p.error)throw p;
  q1('#prep').innerHTML=`<div class="card"><h3>What the interview will likely look like</h3><p>${E(p.format)}</p></div><h2>Likely questions</h2>`+(p.questions||[]).map((q,i)=>qcard(j.id+':'+i,q,i)).join('')+((p.gaps||[]).length?`<div class="card"><h3>🎯 Gaps to prep for this job</h3><ul>${p.gaps.map(g=>`<li>${E(g)}</li>`).join('')}</ul></div>`:'');
  window.__ivq=window.__ivq||{};window.__ivq[j.id]=p;
 }catch(e){q1('#prep').innerHTML='<div class="card">Couldn\'t prepare questions right now. Please try again in a minute.</div>'}};
function mock(j){const sid='iv-'+j.id+'-'+Date.now();let msgs=[],n=0;const box=q1('#mockBox');q1('#mockGo').hidden=true;
 box.innerHTML=`<div class="card"><h3>Live mock interview</h3><p class="mut">One question at a time. Answer by typing or tap 🎤 to speak. After each answer you get feedback, a score, the right answer and a concept video.</p><div class="mock" id="mk"></div>
<div class="mockin"><textarea id="mkT" placeholder="Type your answer…"></textarea><div style="display:flex;flex-direction:column;gap:6px"><button class="jbtn sec2" id="mkMic" type="button" aria-label="Record answer">🎤</button><button class="jbtn pri" id="mkS" type="button">Send</button></div></div>
<p><button class="jbtn sec2 sm" id="mkEnd" type="button">Finish & get my summary</button></p></div>`;
 const mk=q1('#mk'),T=q1('#mkT');
 const add=(cls,txt)=>{const d=document.createElement('div');d.className='b '+cls;d.textContent=txt;if(cls==='me')mk.append(d);else mk.append(d);d.scrollIntoView({block:'nearest'});return d};const _x=(cls,txt)=>{const d=document.createElement('div');d.className='b '+cls;d.textContent=txt;mk.append(d);d.scrollIntoView({block:'nearest'});return d};
 async function turn(end){const w=add('iv','');w.innerHTML='<span class="spin"></span> Interviewer is thinking…';
  try{const d=await post({mode:'turn',sid,job:jobLite(j),msgs,end,max:6});msgs.push({role:'assistant',content:[d.feedback&&'Feedback: '+d.feedback,d.question&&'Question: '+d.question].filter(Boolean).join('\n')});
   let h='';if(d.greeting)h+=`<p>${md(d.greeting)}</p>`;
   if(d.feedback)h+=`<p><b>Feedback:</b> ${md(d.feedback)}</p>`;if(d.score!=null&&!d.summary)h+=`<p><b>Score:</b> ${E(d.score)}/10</p>`;
   if(d.better_answer)h+=`<details><summary>💡 A stronger version of your answer</summary><p>${md(d.better_answer)}</p></details>`;
   if(d.summary){const S=d.summary;h+=`<h3>🎉 Interview summary: ${E(S.score)}/10</h3><p><b>Strengths</b></p><ul>${(S.strengths||[]).map(x=>`<li>${md(x)}</li>`).join('')}</ul><p><b>Practise next</b></p><ul>${(S.practice||[]).map(x=>`<li>${md(x)}</li>`).join('')}</ul><p>${md(S.closing||'')}</p>`}
   w.innerHTML=h||'';if(!h)w.remove();
   if(d.question){n++;const k=j.id+':mock:'+sid+':'+n,qc=document.createElement('div');qc.className='card qcard';
    qc.innerHTML=`<div class="ty">Question ${n}</div><div class="qt">${md(d.question)}</div><div class="acts"><button class="jbtn sec2 sm" data-show type="button">👀 Show suggested answer</button>${d.video?`<a class="jbtn sec2 sm" href="${E(d.video.url)}" target="_blank" rel="noopener">🎓 Learn this concept: ▶ ${E(d.video.title)} <span class="mut">(${E(d.video.channel)}, ${E(d.video.date)})</span></a>`:d.concept?`<button class="jbtn sec2 sm" data-learn="${E(d.concept)}" type="button">🎓 Learn this concept: ${E(d.concept)}</button>`:''}<button class="jbtn sec2 sm mk" data-mk="got" data-k="${E(k)}" type="button">✅ Got it</button><button class="jbtn sec2 sm mk" data-mk="again" data-k="${E(k)}" type="button">🔁 Practice again</button></div><div class="ans">${md(d.suggested_answer||'')}${(d.key_points||[]).length?'<p><b>Key points to hit</b></p><ul>'+d.key_points.map(x=>`<li>${md(x)}</li>`).join('')+'</ul>':''}</div>`;
    mk.append(qc);qc.scrollIntoView({block:'nearest'})}
   if(d.ended){q1('.mockin',box)?.remove();q1('#mkEnd')?.remove();add('iv','Saved to My progress. Great work, Amjad! 💪')}}catch(e){w.textContent='Connection hiccup. Tap Send again.'}}
 q1('#mkS').onclick=()=>{const t=T.value.trim();if(!t)return;T.value='';add('me',t);msgs.push({role:'user',content:t});n++;turn(false)};
 q1('#mkEnd').onclick=()=>{if(msgs.length)turn(true)};
 let rec=null;q1('#mkMic').onclick=async()=>{const b=q1('#mkMic');if(rec){rec.stop();return}
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const ty=['audio/webm','audio/mp4','audio/ogg'].find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))||'';const ch=[];rec=new MediaRecorder(st,ty?{mimeType:ty}:{});
   rec.ondataavailable=e=>e.data.size&&ch.push(e.data);rec.onstop=async()=>{st.getTracks().forEach(t=>t.stop());rec=null;b.textContent='…';const bl=new Blob(ch,{type:ty||'audio/webm'});
    try{const r=await fetch(W()+'/stt',{method:'POST',headers:{'Content-Type':bl.type},body:bl});const d=await r.json();if(d.text)T.value=(T.value+' '+d.text).trim()}catch(e){}b.textContent='🎤'};
   rec.start();b.textContent='⏹'}catch(e){alert('Microphone permission is needed to record. You can type instead.')}};
 turn(false)}
/* prompts */
RV.prompts=()=>{const items=$('.tpb').filter(b=>!b.closest('#dyn')&&b.dataset.k!=='today').map(b=>{const sec=b.closest('section'),h=sec&&q1('h2',sec);const li=b.closest('li');return {k:b.dataset.k,sec:h?h.textContent:'',t:li?(q1('b',li)?.textContent||li.textContent.slice(0,80)):(h?h.textContent:'Prompt'),id:sec?.id}});
 dyn.innerHTML=`<h1>✨ Prompts</h1><p class="mut">Every "Try this prompt" in one place. Tap one to open it for your AI tool.</p>`+items.map(i=>`<div class="card"><div class="mut" style="font-size:12px">${E(i.sec)}</div><b>${E(i.t)}</b><div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="tpb" data-k="${E(i.k)}" type="button">✨ Try this prompt</button>${i.id?`<a class="jbtn sec2 sm" href="#${E(i.id)}">Go to section</a>`:''}</div></div>`).join('')};
/* today */
RV.today=async()=>{dyn.innerHTML='<h1>📰 Today in AI & Cyber</h1><p class="mut">One item a day, newest first.</p><div id="tdl">Loading…</div>';
 try{const d=await (await fetch('today.json?'+Date.now(),{cache:'no-store'})).json();TODAY=d.items||[];q1('#tdl').innerHTML=TODAY.map(t=>`<div class="card"><span class="chip">${E(t.product)}</span> <span class="mut">${E(t.date)}</span><h3>${E(t.headline)}</h3><p>${E(t.explanation)}</p>${t.why?`<p><b>Why it matters:</b> ${E(t.why)}</p>`:''}${t.say?`<p><b>Say it in an interview:</b> ${E(t.say)}</p>`:''}${t.video?`<p><a href="https://www.youtube.com/watch?v=${E(t.video)}" target="_blank" rel="noopener">▶ Watch the video</a></p>`:''}${t.source?`<p class="mut"><a href="${E(t.source)}" target="_blank" rel="noopener">Source ↗</a></p>`:''}</div>`).join('')}catch(e){q1('#tdl').textContent='Couldn\'t load right now.'}};
/* history */
async function loadHist(){if(HIST)return HIST;try{HIST=await (await fetch(W()+'/history',{cache:'no-store'})).json()}catch(e){HIST=[]}return HIST}
RV.history=async()=>{dyn.innerHTML='<h1>🕘 Ask Dad history</h1><p class="mut">Every Ask Dad conversation, newest first. Times are Eastern (ET). Same history on every device.</p><input class="jsq" id="hq" type="search" placeholder="Search questions and answers…" style="max-width:520px"><p class="mut" id="hn">Loading…</p><div id="hl"></div>';
 HIST=null;const D=await loadHist();const r=()=>{const w=q1('#hq').value.trim().toLowerCase();const L=D.filter(x=>!w||(x.q+' '+x.a).toLowerCase().includes(w));q1('#hn').textContent=L.length+' conversation'+(L.length===1?'':'s');
  q1('#hl').innerHTML=L.map(x=>`<div class="card" id="h-${x.id}"><div class="mut" style="font-size:13px">${ET(x.ts)}</div><p><b>Q: ${hl(x.q,w)}</b></p><div style="white-space:pre-wrap">${hl(x.a,w)}</div>${x.videos.length?'<p><b>Videos</b><br>'+x.videos.map(v=>`<a href="${E(v.url)}" target="_blank" rel="noopener">▶ ${E(v.title)}</a> <span class="mut">(${E(v.channel)}, ${E(v.date)})</span>`).join('<br>')+'</p>':''}</div>`).join('')||'<p class="mut">Nothing yet. Tap the Ask Dad bubble to ask your first question.</p>'};
 q1('#hq').oninput=r;r();if(cur.a){const el=document.getElementById('h-'+cur.a);el&&el.scrollIntoView()}};
/* guides */
RV.guides=()=>{dyn.innerHTML=`<h1>📄 Guides</h1><div class="card"><h3>Your IAM Career Path guide</h3><p>The whole path on paper: every Step, certifications, job search and resources.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><a class="jbtn pri" href="Amjad_Khan_IAM_Career_Path.pdf" target="_blank" rel="noopener">📄 PDF guide</a><a class="jbtn sec2" href="Amjad_Khan_IAM_Career_Path.docx">📝 Word version</a></div></div>`};
/* progress */
RV.progress=async()=>{dyn.innerHTML='<h1>📈 My progress</h1><p class="mut">Saved securely and synced across your devices.</p><div id="pg">Loading…</div>';
 let st=null;try{st=await (await fetch(W()+'/state',{cache:'no-store'})).json()}catch(e){}
 await jobsReady;const R=LS('amjad-roadmap-v1',{}),P=LS('amjad-profile',null),S=LS('amjad-streak',{}),A=applied(),M=marks();
 const nSteps=$('.day').length,stepsDone=[];for(let d=1;d<=nSteps;d++){const bs=$(`#step-${d} input[data-k]`);if(bs.length&&bs.every(b=>R[b.dataset.k]))stepsDone.push(d)}
 const certSteps=$('.day').filter(s=>/SC-300|SC-500|Okta/i.test(q1('h2',s)?.textContent||'')&&+s.dataset.day>14);
 const accDone=Object.keys(R).filter(k=>k.startsWith('acc-')&&R[k]).length;
 const ap=Object.entries(A).map(([k,d])=>({j:JOBS.find(x=>x.id===k||x.url===k),d})).filter(x=>x.j);
 const ivs=(st&&st.interviews)||[],ev=(st&&st.events)||[];
 const lab=x=>({check:'Checked a box',applied:'Job applied',quiz:'Quiz answers saved',tool:'AI tool choice',interview:'Started mock interview',interview_done:'Finished mock interview',ivmark:'Interview question marked'}[x]||x);
 const det=e=>{const d=e.d||{};if(e.kind==='applied'){const j=JOBS.find(x=>x.id===d.key||x.url===d.key);return (d.on?'':'Un-marked: ')+(j?j.title+' · '+j.company:d.key)}
  if(e.kind==='check'){const el=q1(`input[data-k="${CSS.escape(d.key)}"]`);return (d.on?'✅ ':'↩️ ')+(el?el.parentElement.textContent.trim().slice(0,110):d.key)}
  if(e.kind==='quiz')return 'Direction: '+[].concat(d.dir||[]).join(', ')+' · Tools: '+[].concat(d.tools||[]).join(', ')+(d.toolsOther?' + '+d.toolsOther:'');
  if(e.kind==='tool')return String(d.v||'').replace(/"/g,'');if(e.kind==='interview'||e.kind==='interview_done')return (d.job?d.job.title+' · '+d.job.company:'')+(d.score!=null?' · score '+d.score+'/10':'');
  if(e.kind==='ivmark')return (d.m==='got'?'✅ Got it: ':'🔁 Practice again: ')+(d.q||'');return ''};
 const quizH=ev.filter(e=>e.kind==='quiz');
 q1('#pg').innerHTML=`<div class="card"><div class="kv"><b>Steps complete</b><span>${stepsDone.length} of ${nSteps}${stepsDone.length?' (Steps '+stepsDone.join(', ')+')':''}</span><b>Streak</b><span>${S.n||S.count||0} day(s)</span><b>Job accounts set up</b><span>${accDone}</span><b>Jobs applied</b><span>${ap.length}</span><b>Mock interviews</b><span>${ivs.length}</span><b>Questions mastered</b><span>${Object.values(M).filter(m=>m.m==='got').length} got it · ${Object.values(M).filter(m=>m.m==='again').length} to practise</span></div></div>
<div class="card"><h3>🎓 Certification milestones</h3><ul>${certSteps.map(s=>`<li>${stepsDone.includes(+s.dataset.day)?'✅':'⬜'} ${E(q1('h2',s).textContent)}</li>`).join('')}</ul></div>
<div class="card"><h3>🧩 Quiz answers</h3>${P?`<div class="kv">${Object.entries(P).filter(([k])=>!/^_/.test(k)).map(([k,v])=>`<b>${E(k)}</b><span>${E([].concat(v).join(', '))}</span>`).join('')}</div>`:'<p class="mut">Not taken yet.</p>'}${quizH.length>1?`<p class="mut">Retaken ${quizH.length} times: ${quizH.map(e=>ET(e.ts)).join(' · ')}</p>`:quizH.length?`<p class="mut">Saved ${ET(quizH[0].ts)}</p>`:''}</div>
<div class="card"><h3>💼 Jobs applied</h3>${ap.length?'<ul>'+ap.map(x=>`<li><a href="#/job/${E(x.j.id)}">${E(x.j.title)}</a> · ${E(x.j.company)} · ${E(x.d)}</li>`).join('')+'</ul>':'<p class="mut">None yet. Your first application is the hardest. Pick one from Jobs found for you.</p>'}</div>
<div class="card"><h3>🎤 Mock interviews</h3>${ivs.length?ivs.map(s=>`<details><summary>${ET(s.started||s.ts)} · ${E(s.job?.title)} · ${E(s.job?.company)}${s.score!=null?' · last score '+s.score+'/10':''}${s.ended?' · finished':''}</summary><div style="white-space:pre-wrap;font-size:14px">${s.msgs.map(m=>(m.role==='user'?'You: ':'Interviewer: ')+E(m.content)).join('\n\n')}</div></details>`).join(''):'<p class="mut">No mock interviews yet. Open any job and tap Practice interview.</p>'}</div>
<div class="card"><h3>🕒 Timeline</h3><div class="tl">${ev.length?ev.slice(0,150).map(e=>`<div class="e"><small>${ET(e.ts)}</small><b>${E(lab(e.kind))}</b> ${E(det(e))}</div>`).join(''):'<p class="mut">Your activity will show here.</p>'}</div></div>`};
/* ---------- global search additions ---------- */
function addSearch(){if(typeof SEARCH==='undefined'||addSearch.done)return;addSearch.done=1;
 $('.embed button[aria-label]').forEach(b=>{const s=b.closest('[data-view]');const id=b.closest('[id]')?.id;SEARCH.push({id:(s&&s.closest('section')?.id)||id,t:b.getAttribute('aria-label').replace(/^Play /,''),k:'Video',x:''})});
 $('.tpb').forEach(b=>{const li=b.closest('li'),sec=b.closest('section');if(li&&sec)SEARCH.push({id:sec.id,t:'Prompt: '+(q1('b',li)?.textContent||li.textContent.slice(0,60)),k:'Prompt',x:li.textContent.toLowerCase()})});
 jobsReady.then(J=>J.forEach(j=>SEARCH.push({id:'/job/'+j.id,t:j.title+' · '+j.company,k:'Job',x:hay(j)})));
 fetch('today.json').then(r=>r.json()).then(d=>(d.items||[]).forEach(t=>SEARCH.push({id:'/today',t:t.headline,k:'Today',x:(t.explanation+' '+t.product).toLowerCase()}))).catch(()=>{});
 loadHist().then(H=>H.forEach(h=>SEARCH.push({id:'/history/'+h.id,t:h.q,k:'Ask Dad history',x:h.a.toLowerCase()})));
 [['/progress','My progress'],['/guides','Guides: PDF and Word'],['/prompts','All prompts'],['/jobs','Jobs found for you']].forEach(([id,t])=>SEARCH.push({id,t,k:'Page',x:''}));
 setTimeout(()=>{const ivq=window.__ivq||{};for(const [jid,p] of Object.entries(ivq))(p.questions||[]).forEach(q=>SEARCH.push({id:'/interview/'+jid,t:q.q,k:'Interview question',x:(q.a||'').toLowerCase()}))},0)}
/* group search results by type */
const sres=q1('#sres');if(sres){new MutationObserver(()=>{if(sres.__g)return;const as=$('a[data-i]',sres);if(!as.length)return;sres.__g=1;const by={};as.forEach(a=>{const k=q1('small',a)?.textContent||'';(by[k]=by[k]||[]).push(a)});sres.innerHTML='';Object.entries(by).forEach(([k,L])=>{sres.insertAdjacentHTML('beforeend',`<span class="gh">${E(k)}</span>`);L.forEach(a=>sres.append(a))});sres.__g=0}).observe(sres,{childList:true})}
/* legacy */
$('a[href="history.html"]').forEach(a=>a.setAttribute('href','#/history'));
$('a[href="#jobs"]').forEach(a=>a.setAttribute('href','#/jobs'));
/* clear (×) buttons on every search field */
document.head.insertAdjacentHTML('beforeend','<style>.sxw{position:relative;display:block}.sxw>input{padding-right:36px!important;width:100%;box-sizing:border-box}.sxb{position:absolute;right:6px;top:50%;transform:translateY(-50%);width:28px;height:28px;border:0;border-radius:50%;background:#e3e8f7;color:#33415c;font-size:16px;line-height:1;cursor:pointer;display:none}.sxw.has .sxb{display:block}input[type=search]::-webkit-search-cancel-button{display:none}.rf{font-size:12px;color:#db2777;background:none;border:0;cursor:pointer;padding:4px 0}</style>');
function enh(i){if(i.__sx)return;i.__sx=1;const w=document.createElement('span');w.className='sxw';if(i.style.maxWidth)w.style.maxWidth=i.style.maxWidth;i.parentNode.insertBefore(w,i);w.append(i);
 const b=document.createElement('button');b.type='button';b.className='sxb';b.setAttribute('aria-label','Clear search');b.textContent='×';w.append(b);
 const up=()=>w.classList.toggle('has',!!i.value);i.addEventListener('input',up);up();
 const clr=()=>{i.value='';i.dispatchEvent(new Event('input',{bubbles:true}));up();i.focus()};b.onclick=clr;
 i.addEventListener('keydown',e=>{if(e.key==='Escape'&&i.value){e.preventDefault();e.stopPropagation();clr()}})}
const enhAll=()=>$('input[type=search],#sq,.jsq').forEach(enh);enhAll();new MutationObserver(enhAll).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target.closest('.rf')){SET(FK,{work_mode:[],job_type:[],employer_type:[],state:[]});drawSide();if(cur.v==='jobs')route()}});
window.__shell={RV,route,dyn,E,md,hl,LS,SET,ET,W,jobsReady,getJobs:()=>JOBS,cur:()=>cur,loadHist};
addSearch();drawSide();jobsReady.then(drawSide);setTimeout(route,0);
window.addEventListener('amjad-quiz-done',()=>{location.hash='#/home'});
})();
