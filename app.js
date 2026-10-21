(()=>{const $=(s,r=document)=>[...r.querySelectorAll(s)],q1=(s,r=document)=>r.querySelector(s);
const K='amjad-roadmap-v1',PK='amjad-profile',SK='amjad-streak',S=JSON.parse(localStorage.getItem(K)||'{}');
const T=q1('.toast');let tt;const toast=m=>{T.textContent=m;T.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>T.classList.remove('on'),2200)};

let prof=null;try{prof=JSON.parse(localStorage.getItem(PK)||'null')}catch(e){}
if(prof&&!Array.isArray(prof.dir)){prof=null;localStorage.removeItem(PK)}
const TT={copilot:['cop','💼 Copilot','Copilot: real work content is OK within your company\'s policy.'],chatgpt:['gpt','ChatGPT','ChatGPT: use Enterprise for work content under policy; Plus is for personal learning with lab data.'],grok:['grk','Grok','Grok: personal learning with made-up lab data.'],claude:['cla','Claude','Claude: personal learning with made-up lab data.'],gemini:['gem','Gemini','Gemini: follow your company\'s AI policy; lab data for practice.']};
const today=()=>new Date().toLocaleDateString('en-CA');
// modals
function openM(id,focus){const b=document.getElementById(id);b.classList.add('on');document.body.style.overflow='hidden';setTimeout(()=>(focus?q1(focus,b):q1('.x',b))?.focus(),50)}
function closeM(b){b.classList.remove('on');if(!$('.bd.on').length)document.body.style.overflow='';const f=q1('iframe',b);if(f&&b.id==='tmBd')f.remove()}
$('.bd').forEach(b=>{q1('.x',b).onclick=()=>closeM(b);b.addEventListener('click',e=>{if(e.target===b)closeM(b)})});
addEventListener('keydown',e=>{if(e.key==='Escape')$('.bd.on').forEach(closeM)});
// checkboxes + streak
const boxes=$('input[data-k]');
function streak(){let d=JSON.parse(localStorage.getItem(SK)||'[]'),n=0,t=new Date();for(;;){const s=t.toLocaleDateString('en-CA');if(d.includes(s)){n++;t.setDate(t.getDate()-1)}else if(n===0&&s===today()){t.setDate(t.getDate()-1)}else break}return n}
function upd(){const dayB=boxes.filter(b=>/^d\d/.test(b.dataset.k)),n=dayB.filter(b=>b.checked).length;q1('.prog i').style.width=(100*n/dayB.length)+'%';
 let dd=0;const NS=$('.day').length;for(let d=1;d<=NS;d++){const bs=dayB.filter(b=>b.dataset.k.startsWith('d'+d+'-'));if(bs.length&&bs.every(b=>b.checked))dd++}
 q1('#sDone').textContent=boxes.filter(b=>b.checked).length;q1('#sDays').textContent=dd+'/'+NS;q1('#sStreak').textContent=streak();coach()}
boxes.forEach(b=>{b.checked=!!S[b.dataset.k];b.onchange=()=>{S[b.dataset.k]=b.checked;localStorage.setItem(K,JSON.stringify(S));if(b.checked){const d=JSON.parse(localStorage.getItem(SK)||'[]');if(!d.includes(today())){d.push(today());localStorage.setItem(SK,JSON.stringify(d.slice(-60)))}toast('Nice work, Amjad! ✅')}upd()}});
// adapt to profile
const DIRN={iam:'Identity & access engineering',soc:'SOC / security analyst',cloud:'Cloud security',grc:'GRC'};
function adapt(){const p=prof||{dir:['iam'],certs:['sc300'],tools:[],mode:[],hours:'1.5'};
 $('[data-dirs]').forEach(el=>{const f=el.dataset.dirs.split(' ').some(x=>p.dir.includes(x));$('.dflag',el).forEach(x=>{x.className='badge dflag '+(f?'focus':'lite');x.textContent=f?'Focus':'Lighter for your path'})});
 const g=q1('#certGrid');$('.cert').sort((a,b)=>(p.certs.includes(b.dataset.cert)?1:0)-(p.certs.includes(a.dataset.cert)?1:0)).forEach(c=>{c.classList.toggle('pick',p.certs.includes(c.dataset.cert));g.append(c)});
 const h=+p.hours;$('.pace').forEach(x=>x.textContent=h<1.2?'🐢 Your pace: videos today, lab tomorrow':h>2?'⚡ Your pace: do the optional video too':'✅ Your pace: core videos + lab');
 $('[data-branch]').forEach(b=>b.style.order='');const soc=q1('#soc'),grc=q1('#grcb');if(soc)soc.querySelector('.eyebrow').textContent=p.dir.includes('soc')?'Recommended for you':'Optional';if(grc)grc.querySelector('.eyebrow').textContent=p.dir.includes('grc')?'Recommended for you':'Optional';
 q1('#cPath').textContent=prof?`Your path: ${p.dir.map(d=>d==='other'?(p.dirOther||'other'):DIRN[d]).join(' + ')} · Goal: ${p.goal==='internal'?'internal move first':p.goal==='new'?'new company':'internal or new'} · ${p.mode.map(m=>m==='other'?(p.modeOther||'other'):m).join(', ')||'any location'}`:'';
 q1('#cPace').textContent=prof?`Pace: about ${p.hours==='2.5'?'2+':p.hours==='1'?'<1':'1–1.5'} h/day. Small daily wins beat long weekends.`:'';
 setMode(modeDefault());upd()}
function modeDefault(){const m=(prof&&prof.mode||[]).filter(x=>x!=='other');return m.length===1?m[0]:'all'}
function coach(){if(!prof){q1('#cTitle').textContent='Let\'s get started';q1('#cNext').innerHTML='Take the 1-minute quiz so I can tailor your plan. <button class="btn" type="button" id="cQ" style="margin-top:8px">Start the quiz</button>';q1('#cQ').onclick=quiz;return}
 const acc=boxes.filter(b=>b.dataset.k.startsWith('acc-'));if(acc.filter(b=>b.checked).length<3){q1('#cTitle').textContent='Next step: set up your job accounts';q1('#cNext').innerHTML='<b>Create at least LinkedIn, HiringCafe and Jobright</b> with IAM alerts at $100K+. <a href="#accounts">Open the checklist →</a>';return}
 for(let d=1;d<=$('.day').length;d++){const bs=boxes.filter(b=>b.dataset.k.startsWith('d'+d+'-'));const nb=bs.find(b=>!b.checked);if(nb){const t=q1('#step-'+d+' h2').textContent;q1('#cTitle').textContent='Next: Step '+d;q1('#cNext').innerHTML=`<b>${t}</b><br>${nb.parentElement.textContent} <br><a href="#step-${d}">Go to Step ${d} →</a>`;return}}
 q1('#cTitle').textContent='You have completed every step so far! 🎉';q1('#cNext').innerHTML='Now: apply to 3 roles a week from the <a href="#jobs">Jobs board</a> and book your SC-300 exam.'}
// quiz
const qB=q1('#qBd'),qF=q1('#qF');function quiz(){if(prof){for(const[k,v]of Object.entries(prof)){if(Array.isArray(v))$(`input[name=${k}]`,qF).forEach(c=>c.checked=v.includes(c.value));else{const r=q1(`input[name=${k}][value="${v}"]`,qF);if(r)r.checked=true;const t=q1(`input[type=text][name=${k}]`,qF);if(t)t.value=v}}}openM('qBd','input')}
$('input[type=text]',qF).forEach(t=>t.addEventListener('input',()=>{const c=t.parentElement.querySelector('input[type=checkbox]');if(c)c.checked=!!t.value.trim()}));
$('input[name=tools]',qF).forEach(c=>c.addEventListener('change',()=>{if(c.checked){if(c.value==='none')$('input[name=tools]',qF).forEach(x=>{if(x!==c)x.checked=false});else{const n=q1('input[name=tools][value=none]',qF);n.checked=false}}}));
qF.onsubmit=e=>{e.preventDefault();const f=new FormData(qF);const tx=n=>(f.get(n)||'').trim().slice(0,60);prof={dir:f.getAll('dir'),dirOther:tx('dirOther'),certs:f.getAll('certs'),tools:f.getAll('tools'),toolsOther:tx('toolsOther'),goal:f.get('goal'),mode:f.getAll('mode'),modeOther:tx('modeOther'),hours:f.get('hours'),at:today()};if(!prof.certs.length)prof.certs=['sc300'];if(!prof.dir.length)prof.dir=['iam'];if(prof.tools.includes('other')&&!prof.toolsOther)prof.toolsOther='My work AI';
 localStorage.setItem(PK,JSON.stringify(prof));closeM(qB);adapt();toast('Your plan is ready 🎯');setTimeout(()=>{location.hash='#accounts';const a=q1('#accounts');a&&a.scrollIntoView()},300)};
$('.retake').forEach(b=>b.onclick=quiz);
// prompts
const pB=q1('#ppBd'),pre=q1('pre',pB),seg=q1('.seg',pB);let cur='';
function tabs(){const t=(prof&&prof.tools||[]).filter(x=>x!=='none');const o=[];t.forEach(x=>{if(TT[x])o.push([TT[x][0],TT[x][1],TT[x][2]]);else if(x==='other')o.push(['oth',prof.toolsOther||'My work AI','Follow your organization\'s AI and data policy.'])});if(!o.length)o.push(['cla','Claude',TT.claude[2]]);return o}
function showP(k){const p=PROMPTS[k],opts=tabs();seg.innerHTML='';seg.hidden=opts.length<2;
 let v=localStorage.getItem('amjad-pv');if(!opts.some(o=>o[0]===v))v=opts[0][0];
 const set=x=>{v=x;localStorage.setItem('amjad-pv',x);cur=p[x];pre.textContent=cur;$('button',seg).forEach(b=>b.setAttribute('aria-checked',b.dataset.v===x));q1('#ppNote').textContent=(opts.find(o=>o[0]===x)||[])[2]||''};
 opts.forEach(([x,n])=>{const b=document.createElement('button');b.type='button';b.dataset.v=x;b.setAttribute('role','radio');b.textContent=n;b.onclick=()=>set(x);seg.append(b)});set(v);if(seg.hidden)q1('#ppH').textContent='Try this prompt in '+opts[0][1];else q1('#ppH').textContent='Try this prompt';openM('ppBd','.cbtn')}
document.addEventListener('click',e=>{const t=e.target.closest('.tpb');if(t){showP(t.dataset.k)}});
q1('.cbtn',pB).onclick=async()=>{try{await navigator.clipboard.writeText(cur)}catch(e){const a=document.createElement('textarea');a.value=cur;document.body.append(a);a.select();document.execCommand('copy');a.remove()}toast('Prompt copied')};
// videos
document.addEventListener('click',e=>{const b=e.target.closest('.embed button');if(!b)return;const w=b.parentElement,i=w.dataset.id;w.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${i}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="YouTube video"></iframe>`});
// today
const E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function openToday(e){e&&e.preventDefault();openM('tmBd');const C=q1('#tmC');try{const{items}=await(await fetch('today.json?'+Date.now())).json();const t=items[0];
 let h=`<span class="tp">${E(t.product)}</span><h3 id="tmH">${E(t.headline)}</h3><p class="mut sm">${new Date(t.date+'T12:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p><p>${E(t.explanation)}</p><div class="bx"><b>Why it matters for you</b>${E(t.why)}</div><div class="bx"><b>Say this in an interview</b>“${E(t.say)}”</div>`;
 if(t.prompts){PROMPTS.today=t.prompts;h+=`<p><button class="tpb" data-k="today">✨ Try this prompt</button></p>`}
 if(t.video)h+=`<div class="embed" data-id="${E(t.video)}"><button aria-label="Play video"><img src="https://i.ytimg.com/vi/${E(t.video)}/hqdefault.jpg" alt=""><span class="pbtn">▶</span></button></div><p class="sm mut">${E(t.video_title)}</p>`;
 h+=`<p class="sm mut">Source: <a href="${E(t.source)}" target="_blank" rel="noopener">${E(t.source_label)}</a> · <a href="today.html">Earlier items</a></p>`;C.innerHTML=h}catch(err){C.textContent='Couldn\'t load today\'s item. Please try again in a moment.'}}
$('[data-today],a.tpill').forEach(a=>a.addEventListener('click',openToday));
if(location.hash==='#today')openToday();
// jobs
let JOBS=[];function card(j){return `<div class="card job"><h4>${E(j.title)}</h4><div class="sm"><b>${E(j.company)}</b> · ${E(j.location)}</div><p style="margin:8px 0"><span class="pay">${E(j.pay)}</span><span class="mode">${E(j.mode)}</span></p><p class="sm">${E(j.fit)}</p><p class="sm mut">${E(j.type)} · Source: ${E(j.source)} · Posted ${E(j.posted)}</p><a class="btn" href="${E(j.url)}" target="_blank" rel="noopener">View &amp; apply ↗</a></div>`}
function setMode(m){$('.filters button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m));const L=JOBS.filter(j=>j.group==='main'&&(m==='all'||j.mode===m));const el=q1('#jobList');if(!el)return;el.innerHTML=JOBS.length?(L.map(card).join('')||'<p class="mut">No roles in this mode right now. New ones are added regularly. Check "All" or set alerts on HiringCafe and Jobright.</p>'):'Loading jobs…';q1('#gigList').innerHTML=JOBS.filter(j=>j.group==='gig').map(card).join('')}
$('.filters button').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
fetch('jobs.json?'+Date.now()).then(r=>r.json()).then(d=>{JOBS=d.jobs;setMode(modeDefault())}).catch(()=>{});
// ask dad hooks
document.addEventListener('click',e=>{const b=e.target.closest('[data-askdad]');if(b&&window.askDad)window.askDad(b.dataset.askdad)});
// to top + brand
const tb=q1('.totop');const f=()=>tb.classList.toggle('on',scrollY>400);addEventListener('scroll',f,{passive:true});f();tb.onclick=()=>scrollTo({top:0,behavior:'smooth'});
q1('a.brand').onclick=e=>{e.preventDefault();$('.bd.on').forEach(closeM);history.replaceState(null,'',location.pathname);scrollTo({top:0,behavior:'smooth'})};
// search
const sq=q1('#sq'),box=q1('#sres'),wrap=q1('.srch');let act=-1,res=[];
q1('.sbtn').onclick=()=>{wrap.classList.toggle('open');if(wrap.classList.contains('open'))sq.focus()};
addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();wrap.classList.add('open');sq.focus()}});
function render(){const w=sq.value.trim().toLowerCase();if(w.length<2){box.classList.remove('on');return}const ws=w.split(/\s+/);
 res=SEARCH.map(o=>({o,s:ws.reduce((a,x)=>a+(o.t.toLowerCase().includes(x)?3:0)+(o.x.includes(x)?1:0),0)})).filter(r=>r.s>=ws.length).sort((a,b)=>b.s-a.s).slice(0,8).map(r=>r.o);
 act=-1;box.innerHTML=res.length?res.map((o,i)=>`<a href="#${o.id}" data-i="${i}" role="option">${E(o.t)}<small>${E(o.k)}</small></a>`).join(''):'<a>No matches. Try "PIM", "SAML" or "resume".</a>';box.classList.add('on')}
sq.addEventListener('input',render);sq.addEventListener('keydown',e=>{const a=$('a[data-i]',box);if(e.key==='ArrowDown'){act=Math.min(act+1,a.length-1)}else if(e.key==='ArrowUp'){act=Math.max(act-1,0)}else if(e.key==='Enter'){const t=a[Math.max(act,0)];if(t){t.click()}e.preventDefault();return}else if(e.key==='Escape'){box.classList.remove('on');wrap.classList.remove('open');return}else return;a.forEach((x,i)=>x.classList.toggle('act',i===act));e.preventDefault()});
box.addEventListener('click',()=>{setTimeout(()=>{box.classList.remove('on');wrap.classList.remove('open');sq.value='';sq.blur()},50)});
document.addEventListener('click',e=>{if(!wrap.contains(e.target))box.classList.remove('on')});
// install
const ib=q1('.ibtn'),iC=q1('#insC');const iOS=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),And=/Android/i.test(navigator.userAgent);
ib.onclick=async()=>{if(window.__bip){const ev=window.__bip;ev.prompt();const r=await ev.userChoice.catch(()=>({}));window.__bip=null;if(r.outcome==='accepted')toast('Installing… look for it on your home screen');return}
 let h='';if(iOS)h=`<ol class="hw"><li>Open this page in <b>Safari</b> (on iPhone the install option only appears in Safari).</li><li>Tap the <b>Share</b> button <span aria-hidden="true">(square with an up-arrow)</span> at the bottom.</li><li>Scroll down and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li><li>Open <b>Amjad IAM</b> from your home screen. It runs full-screen like an app.</li></ol>`;
 else if(And)h=`<ol class="hw"><li>Open this page in <b>Chrome</b>.</li><li>Tap the <b>⋮ menu</b> (top right).</li><li>Tap <b>Install app</b> (or <b>Add to Home screen</b> → <b>Install</b>).</li><li>Open <b>Amjad IAM</b> from your home screen or app drawer.</li></ol>`;
 else h=`<ol class="hw"><li>In <b>Chrome or Edge</b>, click the install icon (a monitor with a down-arrow) at the right end of the address bar.</li><li>Click <b>Install</b>.</li><li>On your phone: iPhone → Safari → Share → Add to Home Screen. Android → Chrome → ⋮ → Install app.</li></ol>`;
 iC.innerHTML=h+'<p class="sm mut">Your checkmarks and quiz answers stay on each device.</p>';openM('insBd')};
if(!localStorage.getItem('amjad-itip')){localStorage.setItem('amjad-itip','1');setTimeout(()=>{ib.classList.add('tipon');setTimeout(()=>ib.classList.remove('tipon'),3500)},1500)}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
adapt();if(!prof)setTimeout(quiz,700);
})();
