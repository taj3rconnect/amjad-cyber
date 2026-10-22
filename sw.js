const V='amjad-v21',SHELL=['./','index.html','today.html','history.html','app.js','askdad.js','shell.js','shell2.js','shell3.js','visit.js','claudecert.html','sync.js','config.js','manifest.json','today.json','jobs.json','icons/icon-192.png','icons/icon-512.png','favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x))))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 const net=()=>fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r});
 if(e.request.mode==='navigate'||/\.(js|html|json)$/.test(u.pathname)||u.pathname.endsWith('/')){e.respondWith(net().catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));return}
 e.respondWith(caches.match(e.request).then(r=>r||net()))});
