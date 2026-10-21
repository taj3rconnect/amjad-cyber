// Ask Dad live chat (Amjad). Floating bubble; mic = MediaRecorder -> worker /stt on ALL devices.
(()=>{const URL_=(window.ASKDAD_URL||'').replace(/\/$/,''),K='amjad-askdad-v1';
const css=`.ad-p{position:fixed;right:16px;bottom:84px;width:min(380px,calc(100vw - 24px));height:min(560px,calc(100dvh - 110px));background:#fff;border-radius:20px;box-shadow:0 18px 50px rgba(60,20,90,.28);display:none;flex-direction:column;overflow:hidden;z-index:9999;font-family:inherit}
.ad-p.on{display:flex}.ad-h{background:linear-gradient(135deg,#4f46e5,#06b6d4);color:#fff;padding:12px 14px;display:flex;align-items:center;gap:8px}.ad-h b{flex:1;font-size:1.05rem}.ad-h button{background:none;border:0;color:#fff;font-size:1.3rem;cursor:pointer;padding:4px 8px}
.ad-m{flex:1;overflow-y:auto;padding:12px;background:#f6f8ff;display:flex;flex-direction:column;gap:8px}.ad-b{max-width:85%;padding:9px 12px;border-radius:16px;white-space:pre-wrap;line-height:1.4;font-size:.95rem;word-wrap:break-word}
.ad-u{align-self:flex-end;background:#4f46e5;color:#fff;border-bottom-right-radius:4px}.ad-a{align-self:flex-start;background:#fff;border:1px solid #e3e8f7;color:#0b1b3f;border-bottom-left-radius:4px}.ad-e{align-self:center;background:#fff0f3;color:#a0153e;font-size:.85rem}
.ad-t span{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:#a5b4fc;animation:adb 1s infinite}.ad-t span:nth-child(2){animation-delay:.15s}.ad-t span:nth-child(3){animation-delay:.3s}@keyframes adb{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}
.ad-f{display:flex;gap:6px;padding:10px;border-top:1px solid #eee;background:#fff}.ad-f textarea{flex:1;resize:none;border:1px solid #ddd;border-radius:14px;padding:9px 11px;font:inherit;font-size:16px;max-height:110px}.ad-f button{border:0;border-radius:14px;background:#4f46e5;color:#fff;padding:0 16px;font-weight:600;cursor:pointer}.ad-f button:disabled{opacity:.5}
.ad-v{align-self:flex-start;display:flex;flex-direction:column;gap:6px;max-width:85%}.ad-v a{display:flex;gap:9px;align-items:center;background:#fff;border:1px solid #c7d2fe;border-radius:14px;padding:6px;text-decoration:none;color:#0b1b3f}.ad-v a:hover{border-color:#06b6d4}.ad-v img{width:96px;height:54px;object-fit:cover;border-radius:9px;flex:none}.ad-v .vt{font-size:.85rem;font-weight:600;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.ad-v .vc{font-size:.75rem;color:#6b7590;margin-top:2px}.ad-v .vl{font-size:.75rem;color:#a0153e;font-weight:600}
.ad-mic{border:0;border-radius:50%;width:44px;height:44px;min-width:44px;background:#eef2ff;color:#4f46e5;font-size:1.25rem;cursor:pointer;position:relative;align-self:flex-end}.ad-mic.on{background:#e0245e;color:#fff;animation:adp 1.2s infinite}@keyframes adp{0%{box-shadow:0 0 0 0 rgba(224,36,94,.55)}70%{box-shadow:0 0 0 12px rgba(224,36,94,0)}100%{box-shadow:0 0 0 0 rgba(224,36,94,0)}}.ad-mic.busy{opacity:.6}
.ad-o{display:flex;align-items:center;gap:6px;padding:0 12px 8px;font-size:.78rem;color:#6b7590;background:#fff}.ad-o[hidden]{display:none}.ad-n{align-self:center;background:#fff7e6;color:#8a5a00;font-size:.85rem}
.ad-f .ad-s{align-self:flex-end;height:44px}.ad-fab{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:9998;border:0;border-radius:999px;padding:0 18px 0 14px;height:56px;display:flex;align-items:center;gap:8px;font-size:22px;color:#fff;background:linear-gradient(135deg,#4f46e5,#06b6d4);box-shadow:0 10px 28px rgba(79,70,229,.45);cursor:pointer}.ad-fab span{font-size:15px;font-weight:700}.ad-p.on~.ad-fab{display:none}
@media(max-width:600px){.ad-mic{width:52px;height:52px;min-width:52px;font-size:1.4rem}.ad-f .ad-s{height:52px}.ad-p{right:0;left:0;bottom:0;width:100vw;height:100dvh;border-radius:0}}`;
const s=document.createElement('style');s.textContent=css;document.head.append(s);
const p=document.createElement('div');p.className='ad-p';p.setAttribute('role','dialog');p.setAttribute('aria-label','Ask Dad chat');
p.innerHTML='<div class="ad-h"><b>💬 Ask Dad</b><a href="history.html" title="Ask Dad history" aria-label="Ask Dad history" style="color:#fff;text-decoration:none;font-size:1.2rem;padding:4px 8px">🕘</a><button class="ad-c" title="New chat" aria-label="Start a new chat">↺</button><button class="ad-x" aria-label="Close">×</button></div><div class="ad-m" aria-live="polite"></div><form class="ad-f"><textarea rows="1" maxlength="4000" placeholder="Ask me anything…"></textarea><button type="button" class="ad-mic" aria-label="Speak your question" title="Tap to speak" hidden>🎤</button><button type="submit" class="ad-s">Send</button></form><label class="ad-o" hidden><input type="checkbox" class="ad-auto"> Send automatically when I stop talking</label>';
document.body.append(p);const M=p.querySelector('.ad-m'),ta=p.querySelector('textarea'),btn=p.querySelector('.ad-s');
let H=[];try{H=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}
const save=()=>localStorage.setItem(K,JSON.stringify(H.slice(-60)));
function add(c,t){const d=document.createElement('div');d.className='ad-b '+c;d.textContent=t;M.append(d);M.scrollTop=M.scrollHeight;return d}
function vids(v){if(!v||!v.length)return;const w=document.createElement('div');w.className='ad-v';w.innerHTML='<div class="vl">▶ Watch this</div>';v.forEach(x=>{const m=(x.url||'').match(/v=([\w-]{11})/);if(!m)return;const a=document.createElement('a');a.href='https://www.youtube.com/watch?v='+m[1];a.target='_blank';a.rel='noopener';const i=document.createElement('img');i.src='https://i.ytimg.com/vi/'+m[1]+'/mqdefault.jpg';i.alt='';i.loading='lazy';const d=document.createElement('div');const t=document.createElement('div');t.className='vt';t.textContent=x.title||'YouTube video';const c=document.createElement('div');c.className='vc';c.textContent=(x.channel||'')+(x.date?' · '+x.date:'');d.append(t,c);a.append(i,d);w.append(a)});M.append(w);M.scrollTop=M.scrollHeight}
function render(){M.innerHTML='';add('ad-a','Hi Amjad 👋 Ask me anything: a lab, a cert, a job posting, salary, or a pep talk. Type or tap 🎤 to speak.');H.forEach(m=>{add(m.role==='user'?'ad-u':'ad-a',m.content);vids(m.videos)})}
render();
const fab=document.createElement('button');fab.className='ad-fab';fab.setAttribute('aria-label','Ask Dad');fab.innerHTML='💬<span>Ask Dad</span>';document.body.append(fab);
const open=v=>{p.classList.toggle('on',v);if(v){M.scrollTop=M.scrollHeight;setTimeout(()=>ta.focus(),150)}};
fab&&fab.addEventListener('click',()=>open(!p.classList.contains('on')));document.querySelector('.fab-l')?.addEventListener('click',()=>open(true));
p.querySelector('.ad-x').onclick=()=>open(false);document.addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
window.askDad=(t)=>{open(true);if(t){ta.value=t;grow()}};p.querySelector('.ad-c').onclick=()=>{H=[];save();render()};
ta.addEventListener('input',()=>{ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,110)+'px'});
ta.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();p.querySelector('form').requestSubmit()}});

// ---- Voice input ----
const mic=p.querySelector('.ad-mic'),opt=p.querySelector('.ad-o'),auto=p.querySelector('.ad-auto');
auto.checked=localStorage.getItem(K+'-auto')==='1';auto.onchange=()=>localStorage.setItem(K+'-auto',auto.checked?'1':'0');
function note(t){const d=add('ad-b ad-n',t);setTimeout(()=>d.remove(),6000)}
function grow(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,110)+'px'}
function done(){mic.classList.remove('on','busy');mic.setAttribute('aria-label','Speak your question');if(auto.checked&&ta.value.trim())p.querySelector('form').requestSubmit();else ta.focus()}
const ANDROID=/Android/i.test(navigator.userAgent);
// Rebuild the transcript from scratch on every result. Android Chrome re-sends cumulative
// results ("How", "How can", "How can I"...), so a segment that extends the previous one replaces it.
function srText(R){const fin=[];let interim='';const norm=x=>x.toLowerCase().replace(/\s+/g,' ').trim();
 for(let i=0;i<R.length;i++){const t=(R[i][0]&&R[i][0].transcript||'').trim();if(!t)continue;
  if(R[i].isFinal){const l=fin.length?norm(fin[fin.length-1]):null;if(l!==null&&norm(t).startsWith(l))fin[fin.length-1]=t;else if(l!==null&&l.startsWith(norm(t))){}else fin.push(t)}else interim=t}
 let f=fin.join(' ');if(interim){const n=norm(interim),nf=norm(f);if(nf&&n.startsWith(nf))f=interim;else if(!(nf&&nf.endsWith(n)))f=(f?f+' ':'')+interim}return f.trim()}
window.__askdadSrText=srText;
const SR=null;let rec=null,listening=false,base='',heard=false;
const MOBILE=ANDROID||/iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)||(navigator.userAgentData&&navigator.userAgentData.mobile);
if(false){mic.hidden=false;opt.hidden=false;
 mic.onclick=()=>{if(listening){rec&&rec.stop();return}
  rec=new SR();rec.lang='en-US';rec.interimResults=true;rec.continuous=!ANDROID;base=ta.value.trim()?ta.value.trim()+' ':'';heard=false;
  rec.onresult=e=>{const t=srText(e.results);heard=heard||!!t;ta.value=base+t;grow()};
  rec.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed')note('🎤 I need permission to use your microphone. Tap the lock icon by the address bar, allow the microphone, then try again.');else if(e.error==='no-speech')note('I didn’t hear anything. Tap the mic and try again 👍');else if(e.error==='audio-capture')note('No microphone found on this device.');else if(e.error!=='aborted')note('Voice typing had a hiccup. Please try again or type instead.')};
  rec.onend=()=>{listening=false;if(!heard&&!ta.value.trim()){}done()};
  try{rec.start();listening=true;mic.classList.add('on');mic.setAttribute('aria-label','Stop listening')}catch(e){note('Voice typing isn’t available right now. Please type instead.')}};
}else if(window.MediaRecorder&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&URL_){mic.hidden=false;opt.hidden=false;let mr=null,chunks=[],stream=null,ac=null,tick=null,maxT=null,sent=false;
 // Mobile (incl. Android): record only, transcribe once via our /stt (xAI). Never uses the browser speech engine.
 const setMic=(on)=>{mic.classList.toggle('on',on);mic.setAttribute('aria-label',on?'Listening… tap to stop':'Speak your question');mic.title=on?'Listening… tap to stop':'Tap to speak';ta.placeholder=on?'Listening… tap 🎤 to stop':'Ask me anything…'};
 const cleanup=()=>{clearInterval(tick);clearTimeout(maxT);tick=maxT=null;try{ac&&ac.close()}catch(e){}ac=null;stream&&stream.getTracks().forEach(t=>t.stop())};
 const stop=()=>{if(mr&&mr.state==='recording')mr.stop()};
 mic.onclick=async()=>{if(mic.classList.contains('busy'))return;if(mr&&mr.state==='recording'){stop();return}
  try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}catch(e){note(e&&e.name==='NotFoundError'?'No microphone found on this device.':'🎤 I need permission to use your microphone. Allow it in your browser settings, then try again.');return}
  const type=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/mp4'].find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))||'';
  mr=new MediaRecorder(stream,type?{mimeType:type}:{});chunks=[];sent=false;mr.ondataavailable=e=>e.data&&e.data.size&&chunks.push(e.data);
  mr.onstop=async()=>{cleanup();setMic(false);if(sent)return;sent=true;mic.classList.add('busy');const b=new Blob(chunks,{type:(mr.mimeType||type||'audio/webm')});
   if(b.size<1500){note('I didn’t hear anything. Tap the mic and try again 👍');mic.classList.remove('busy');return}
   try{const r=await fetch(URL_+'/stt',{method:'POST',headers:{'Content-Type':b.type},body:b});const d=await r.json().catch(()=>({}));
    if(!r.ok)throw 0;const t=(d.text||'').trim();if(!t){note('I didn’t catch that. Tap the mic and try again 👍');mic.classList.remove('busy');return}
    ta.value=(ta.value.trim()?ta.value.trim()+' ':'')+t;grow();done()}catch(e){note('Couldn’t turn that into text. Please try again or type instead.');mic.classList.remove('busy')}};
  mr.start(250);setMic(true);maxT=setTimeout(stop,60000);
  // Auto-stop after ~2s of silence once she has started speaking.
  try{ac=new (window.AudioContext||window.webkitAudioContext)();const an=ac.createAnalyser();an.fftSize=1024;ac.createMediaStreamSource(stream).connect(an);const buf=new Uint8Array(an.fftSize);let spoke=false,quiet=0;const t0=Date.now();
   tick=setInterval(()=>{an.getByteTimeDomainData(buf);let sum=0;for(const v of buf){const x=(v-128)/128;sum+=x*x}const rms=Math.sqrt(sum/buf.length);
    if(rms>0.04){spoke=true;quiet=0}else quiet+=100;if((spoke&&quiet>=2000)||(!spoke&&Date.now()-t0>8000))stop()},100)}catch(e){}};
}
p.querySelector('form').onsubmit=async e=>{e.preventDefault();const q=ta.value.trim();if(!q||btn.disabled)return;
ta.value='';ta.style.height='auto';H.push({role:'user',content:q});save();add('ad-u',q);
const t=add('ad-a ad-t','');t.innerHTML='<span></span><span></span><span></span>';btn.disabled=true;
try{if(!URL_)throw new Error('Dad\'s chat is getting set up. Please try again soon.');
const r=await fetch(URL_+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:H.slice(-20).map(m=>({role:m.role,content:m.content}))})});
const d=await r.json().catch(()=>({}));if(!r.ok||!d.answer)throw new Error(d.error||'Hmm, that didn’t go through. Please try again in a moment.');
t.remove();const vv=Array.isArray(d.videos)?d.videos.slice(0,2):[];H.push({role:'assistant',content:d.answer,videos:vv});save();add('ad-a',d.answer);vids(vv)}
catch(err){t.remove();H.pop();save();add('ad-e',err.message);ta.value=q}finally{btn.disabled=false}};
})();
