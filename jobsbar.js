(()=>{const K='amjad-applied-v1',E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let A={};try{A=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
const css=`#jb{position:fixed;left:0;top:56px;bottom:0;width:290px;background:#fff;border-right:1px solid #e3e8f7;z-index:40;display:flex;flex-direction:column;font:14px/1.45 Inter,system-ui,sans-serif;color:#33415c;box-shadow:2px 0 18px rgba(11,27,63,.06)}
#jb h3{margin:0;padding:14px 16px 6px;font-size:16px;color:#0b1b3f}#jb .sub{padding:0 16px 8px;font-size:12px;color:#6b7590}#jb .ls{overflow:auto;padding:0 10px 90px;flex:1}
.jbc{border:1px solid #e3e8f7;border-radius:14px;padding:10px 12px;margin:8px 0;background:linear-gradient(180deg,#fff,#f8f9ff)}.jbc.ap{opacity:.6}.jbc a.t{font-weight:700;color:#4f46e5;text-decoration:none;display:block}.jbc .m{font-size:12px;color:#6b7590}.jbc .p{font-weight:700;color:#047857}
.jbc label{display:flex;gap:6px;align-items:center;font-size:12.5px;margin-top:6px;min-height:32px;cursor:pointer}.jbc .new{background:#fde68a;color:#78350f;border-radius:99px;padding:0 7px;font-size:11px;font-weight:700;margin-left:4px}
#jbt{display:none;position:fixed;left:0;top:45%;z-index:41;writing-mode:vertical-rl;transform:rotate(180deg);background:linear-gradient(180deg,#4f46e5,#db2777);color:#fff;border:0;border-radius:0 12px 12px 0;padding:14px 9px;font-weight:700;font-size:14px;box-shadow:0 6px 18px rgba(79,70,229,.35)}
#jbx{display:none;position:absolute;right:8px;top:8px;border:0;background:#eef1fb;border-radius:10px;width:40px;height:40px;font-size:20px}#jbb{display:none}
@media(min-width:1100px){body{padding-left:290px}.totop{left:306px!important}}
@media(max-width:1099px){#jb{top:0;width:min(86vw,340px);transform:translateX(-105%);transition:transform .25s;z-index:200;padding-top:env(safe-area-inset-top)}#jb.op{transform:none}#jbt{display:block}#jbx{display:block}#jbb.op{display:block;position:fixed;inset:0;background:rgba(11,27,63,.4);z-index:199}}`;
document.head.insertAdjacentHTML('beforeend','<style>'+css+'</style>');
document.body.insertAdjacentHTML('beforeend','<div id="jbb"></div><aside id="jb" aria-label="Jobs found for you"><button id="jbx" aria-label="Close jobs">×</button><h3>💼 Jobs found for you</h3><div class="sub">Newest first · $100K+ or $75+/hr · tap to apply</div><div class="ls">Loading…</div></aside><button id="jbt" aria-label="Open jobs found for you">💼 Jobs for you</button>');
const jb=document.getElementById('jb'),bb=document.getElementById('jbb'),op=o=>{jb.classList.toggle('op',o);bb.classList.toggle('op',o)};
jbt.onclick=()=>op(true);jbx.onclick=bb.onclick=()=>op(false);
const wk=Date.now()-7*864e5;
function draw(J){const L=jb.querySelector('.ls');J.sort((a,b)=>(a.group==='gig')-(b.group==='gig')||String(b.posted).localeCompare(a.posted));
 L.innerHTML=J.map((j,i)=>{const id=j.url;return `<div class="jbc${A[id]?' ap':''}"><a class="t" href="${E(j.url)}" target="_blank" rel="noopener">${E(j.title)}</a>${Date.parse(j.posted)>wk?'<span class="new">NEW</span>':''}<div class="m">${E(j.company)}</div><div class="p">${E(j.pay)}</div><div class="m">${E(j.mode)} · ${E(j.location)} · ${E(j.source)}${j.group==='gig'?' · AI training gig':''} · posted ${E(j.posted)}</div><label><input type="checkbox" data-u="${E(id)}"${A[id]?' checked':''}> Applied${A[id]?' ('+E(A[id])+')':''}</label></div>`}).join('')||'No jobs yet. Check back soon.';
 L.querySelectorAll('input[data-u]').forEach(c=>c.onchange=()=>{const u=c.dataset.u;if(c.checked)A[u]=new Date().toLocaleDateString('en-US',{timeZone:'America/New_York'});else delete A[u];localStorage.setItem(K,JSON.stringify(A));draw(J)})}
fetch('jobs.json?'+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(d=>draw(d.jobs||[])).catch(()=>{jb.querySelector('.ls').textContent='Couldn\'t load jobs right now.'});
})();
