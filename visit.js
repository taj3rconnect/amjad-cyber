(()=>{try{const q=new URLSearchParams(location.search);if(q.has('notrack'))localStorage.setItem('amjad-notrack','1');if(localStorage.getItem('amjad-notrack')||navigator.webdriver)return}catch(e){return}
const U=()=>(window.ASKDAD_URL||'').replace(/\/$/,'')+'/visit';const sid=Date.now().toString(36)+Math.random().toString(36).slice(2,8),start=Date.now();
let active=0,lastAct=Date.now(),tick=Date.now();const pages=new Set();const pg=()=>pages.add((location.hash||'#/home').split('?')[0].slice(0,60));pg();addEventListener('hashchange',pg);
['mousemove','keydown','scroll','touchstart','click'].forEach(e=>addEventListener(e,()=>{lastAct=Date.now()},{passive:true}));
setInterval(()=>{const n=Date.now();if(document.visibilityState==='visible'&&n-lastAct<120000)active+=Math.round((n-tick)/1000);tick=n},5000);
const send=()=>{if(!window.ASKDAD_URL)return;const b=JSON.stringify({sid,start,active,pages:[...pages]});try{navigator.sendBeacon(U(),new Blob([b],{type:'text/plain'}))}catch(e){}};
setTimeout(send,3000);setInterval(send,60000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')send()});addEventListener('pagehide',send)})();
