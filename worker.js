import VMAP from "./vmap.js";
const ORIGIN = "https://taj3rconnect.github.io";
const MODEL = "grok-4.20-0309-non-reasoning";
const SYSTEM = `You are Taj, answering your son-in-law Amjad Khan (husband of your daughter Rashmina) as "Dad" inside the "Ask Dad" chat on the cybersecurity career path you built for him. You are his career coach, mentor and concierge.
Voice: warm, proud, encouraging, practical and direct; plain words; short (3-7 sentences) with ONE concrete next step. Praise effort first; never scold or lecture. On your first reply in a conversation open with "Hi Amjad,". End with "Dad" on its own line when it feels natural.
About him: IT Support Coordinator at WSAudiology (since 2022) handling Joiner-Mover-Leaver for 200+ US users with Adaxes across Active Directory, Entra ID and Microsoft 365; Jira/eFlow approvals, Intune, least privilege, audit trails. Previously administered AWS IAM at APTASK (2019-2021), alarm operator at Macy's ops center, systems engineer at Entergy Nuclear (2007-2010). Certs: CompTIA Security+ (SY0-701, June 2026), AWS Cloud Practitioner; Microsoft Applied Skills in Entra and AD DS (Oct 2026); working on SC-300. Lives in Edison, NJ.
Goal: move into an IAM Analyst / Identity Engineer / Entra admin role (or SOC, cloud security or GRC if he chooses). The path is a sequence of numbered Steps (Steps 1-14 core skills, then certification milestone steps: pass SC-300, SC-500, Okta; more steps get added over time). Refer to 'Step N', never 'Day N'. It covers SC-300, Entra conditional access, MFA, PIM, access reviews, PowerShell + Microsoft Graph, SAML/OIDC/SCIM, Okta, SailPoint, CyberArk, AZ-500, optional Sentinel/CySA+, plus resume, LinkedIn, interviews and where to apply.
Rules: practice only in his own free dev/test tenants and labs, never on his employer's production systems or with real employee data unless his employer approves. Do not paste video links in your answer; relevant videos are shown separately as cards. Be honest when unsure. If he seems overwhelmed, reassure him and shrink the next step.
Honesty (very important): You and Amjad have NOT done anything together outside this site and this chat. Never claim shared past activities, meetings, calls, files, drafts or versions ("we built together", "the one we made last month", "the file I sent you") unless they appear earlier in this conversation. Never invent documents, versions, tools or pages. Only reference real site content from this list (use these exact links, the site base is https://taj3rconnect.github.io/amjad-cyber/):
- Steps 1-17: #step-1 ... #step-17 (Step 7 "Light day: lifecycle workflows and resume refresh" is where he CREATES his "Resume v2": his updated resume with numbers and a Projects section, starting from his current resume, his own Word file)
- Resume tips: #resume · LinkedIn tips: #linkedin · Interview prep: #interview · How to apply: #apply · Job search track: #/jobsearch · Set up job accounts: #accounts
- Career Path guide: Amjad_Khan_IAM_Career_Path.pdf (also .docx) · Guides page: #/guides
- Jobs found for you: #/jobs (job detail #/job/<id>, practice interview #/interview/<id>) · Application tracker: #/apps
- Certifications: #certs · Cert exam prep (SC-300 practice questions, flashcards): #/exam · Get Claude certified: #/claudecert
- Portfolio projects: #/projects · LinkedIn networking: #/network · LinkedIn content plan: #/content · Target companies: #/companies · Mentorship: #/mentors · Events: #/events · Newsletters: #/newsletters
- Must-watch videos: #mustwatch · Must-read: #mustread · Prompts: #/prompts · Bots & tools: #bots · AI training gigs: #/gigs · Today in AI & Cyber: #/today · My progress: #/progress · Ask Dad history: #/history
If he asks about something that does not exist on the site or in this chat, say so kindly and plainly (e.g. "That isn't something we've made yet"), then point him to the real next step with its link (for Resume v2: it's what he creates in Step 7, #step-7, using #resume and the Career Path guide). Write links as markdown [text](link), using the full site URL.`;


const STOP=new Set("the a an and or to of in on for with my me i how can what is it use any do you your this that make about from into be are".split(" "));
const words=t=>(t.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>w.length>2&&!STOP.has(w));
async function verify(v,cutoff){
  const m=(v.url||"").match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/); if(!m) return null; const id=m[1];
  const o=await fetch("https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v="+id); if(!o.ok) return null; const oe=await o.json();
  let date=null; try{const p=await (await fetch("https://www.youtube.com/watch?v="+id,{headers:{"Accept-Language":"en-US"}})).text(); date=(p.match(/"publishDate":"(\d{4}-\d\d-\d\d)/)||p.match(/datePublished" content="(\d{4}-\d\d-\d\d)/)||[])[1]||null;}catch{}
  date=date||(/^\d{4}-\d\d-\d\d$/.test(v.date||"")?v.date:null);
  if(!date||date<cutoff) return null;
  return {title:oe.title,channel:oe.author_name,url:"https://www.youtube.com/watch?v="+id,id,date};
}
async function isLearning(env,q){
  try{const r=await fetch("https://api.x.ai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+env.XAI_API_KEY},body:JSON.stringify({model:MODEL,temperature:0,max_tokens:3,messages:[{role:"system",content:"Classify the user's message. Reply LEARN if it asks how to do something, wants to learn a tool/skill, or is a work/tech question. Reply PERSONAL if it is mainly emotional, personal, a greeting or small talk. One word only."},{role:"user",content:q}]})});
  const d=await r.json();return /LEARN/i.test(d.choices?.[0]?.message?.content||"");}catch{return false}
}
async function findVideos(env,q){
  if(!(await isLearning(env,q))) return [];
  const cutoff=new Date(Date.now()-183*864e5).toISOString().slice(0,10); let skip=false,out=[];
  try{
    const r=await fetch("https://api.x.ai/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+env.XAI_API_KEY},body:JSON.stringify({model:MODEL,tools:[{type:"web_search",allowed_domains:["youtube.com"]}],input:[{role:"user",content:`Message from a learner (IT support coordinator moving into identity & access management / cybersecurity: SC-300, Entra ID, PowerShell, Okta, SailPoint, CyberArk, AZ-500, job search): """${q}"""\nIf it is purely emotional/personal or small talk (no how-to or learning need), reply exactly {"skip":true}. Otherwise search YouTube and find up to 3 real, beginner-friendly YouTube videos that directly help, published on or after ${cutoff}. Prefer short, clear tutorials from reputable channels. Reply with JSON only: {"videos":[{"url":"https://www.youtube.com/watch?v=...","title":"...","channel":"...","date":"YYYY-MM-DD"}]}. Only include URLs you actually found in search results.`}]})});
    const d=await r.json(); const txt=(d.output||[]).filter(o=>o.type==="message").flatMap(o=>o.content.map(c=>c.text||"")).join("");
    const j=JSON.parse((txt.match(/\{[\s\S]*\}/)||["{}"])[0]); skip=!!j.skip;
    if(!skip){ const res=await Promise.all((j.videos||[]).slice(0,4).map(v=>verify(v,cutoff).catch(()=>null))); for(const ok of res) if(ok&&out.length<2&&!out.some(x=>x.id===ok.id)) out.push(ok); }
  }catch(e){}
  if(skip) return [];
  if(out.length<1){ const qw=new Set(words(q)); if(qw.size){
    const sc=VMAP.filter(v=>v[3]>=cutoff).map(v=>({v,s:words(v[1]).filter(w=>qw.has(w)).length})).filter(x=>x.s>=2).sort((a,b)=>b.s-a.s||b.v[3].localeCompare(a.v[3]));
    for(const {v} of sc.slice(0,2-out.length)) out.push({title:v[1],channel:v[2],url:"https://www.youtube.com/watch?v="+v[0],id:v[0],date:v[3],source:"course"});
  }}
  return out.slice(0,2);
}

const IVSYS = `You are helping Amjad Khan prepare for Identity & Access Management interviews. His real background: IT Support Coordinator at WSAudiology (2022-now): Joiner-Mover-Leaver for 200+ US users automated with Adaxes across on-prem Active Directory, Entra ID and Microsoft 365; Jira/eFlow approvals, Intune device wipe at termination, least-privilege group design, audit trails. APTASK (2019-2021): administered AWS IAM (users, groups, roles, policies, MFA). Earlier: Macy's operations center alarm operator; Entergy Nuclear systems engineer (2007-2010). Certs: CompTIA Security+ (SY0-701), AWS Cloud Practitioner, Microsoft Applied Skills (Entra, AD DS); studying SC-300. Lives in Edison, NJ; US citizen. Be warm, encouraging and specific; never invent employers or certs he does not have; when he lacks a skill, show how to bridge honestly from what he has done.`;
async function transcript(id) {
  const tries = [{ clientName: "ANDROID", clientVersion: "19.09.37", androidSdkVersion: 30 }, { clientName: "WEB", clientVersion: "2.20240726.00.00" }, { clientName: "IOS", clientVersion: "19.09.3", deviceModel: "iPhone14,3" }];
  for (const c of tries) {
    try {
      const r = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": c.clientName === "ANDROID" ? "com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip" : "Mozilla/5.0" }, body: JSON.stringify({ context: { client: { ...c, hl: "en", gl: "US" } }, videoId: id }) });
      const d = await r.json(); const tr = d?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
      const t = tr.find(x => x.languageCode === "en" && x.kind !== "asr") || tr.find(x => (x.languageCode || "").startsWith("en")) || tr[0];
      if (!t) { if (d?.playabilityStatus?.status === "OK") return { id, status: "nocaptions", title: d?.videoDetails?.title, lengthSeconds: d?.videoDetails?.lengthSeconds }; continue; }
      const j = await (await fetch(t.baseUrl.replace(/&fmt=[^&]*/, "") + "&fmt=json3")).json();
      const segs = (j.events || []).filter(e => e.segs).map(e => [Math.round((e.tStartMs || 0) / 1000), e.segs.map(s => s.utf8).join("").replace(/\s+/g, " ").trim()]).filter(x => x[1]);
      if (segs.length) return { id, status: "ok", lang: t.languageCode, kind: t.kind || "manual", segs };
    } catch (e) {}
  }
  return { id, status: "failed" };
}
async function conceptVideo(env, st, c) {
  c = String(c || "").slice(0, 120).trim(); if (!c) return null;
  const ck = "v:" + c.toLowerCase(); const cached = await (await st.fetch("https://do/ivprep?id=" + encodeURIComponent(ck))).json();
  if (cached && cached.prep && Date.now() - (cached.prep.t || 0) < 7 * 864e5) return cached.prep.video;
  const vs = await findVideos(env, "How do I learn " + c + " for an IAM engineer interview? Explain " + c + ".");
  const video = vs[0] || null; await st.fetch("https://do/ivprep", { method: "POST", body: JSON.stringify({ id: ck, prep: { video, t: Date.now() } }) });
  return video;
}
const cors = (o) => ({ "Access-Control-Allow-Origin": o === ORIGIN ? ORIGIN : "null", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type,Authorization", "Vary": "Origin" });
const json = (d, s, h) => new Response(JSON.stringify(d), { status: s || 200, headers: { "Content-Type": "application/json", ...h } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url), o = req.headers.get("Origin") || "", h = cors(o);
    if (req.method === "OPTIONS") return new Response(null, { headers: h });
    const st = env.STORE.get(env.STORE.idFromName("main"));
    if (url.pathname === "/log" && req.method === "GET") {
      const k = (req.headers.get("Authorization") || "").replace(/^Bearer /, "") || url.searchParams.get("key");
      if (!env.ADMIN_KEY || k !== env.ADMIN_KEY) return json({ error: "unauthorized" }, 401);
      return st.fetch("https://do/log?since=" + encodeURIComponent(url.searchParams.get("since") || ""));
    }
    if (url.pathname === "/visit" && req.method === "POST") {
      if (o !== ORIGIN) return new Response(null, { status: 204 });
      const b = await req.text(); if (b.length > 2000) return new Response(null, { status: 413 });
      await st.fetch("https://do/visit", { method: "POST", body: b }); return new Response(null, { status: 204, headers: h });
    }
    if (url.pathname === "/visits") {
      const k = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
      if (!env.ADMIN_KEY || k !== env.ADMIN_KEY) return json({ error: "unauthorized" }, 401);
      if (req.method === "DELETE") return st.fetch("https://do/visits?sid=" + encodeURIComponent(url.searchParams.get("sid") || ""), { method: "DELETE" });
      return st.fetch("https://do/visits?limit=" + (+url.searchParams.get("limit") || 500));
    }
    if (url.pathname === "/history" && req.method === "GET") {
      if (o !== ORIGIN) return json({ error: "forbidden" }, 403, h);
      const r = await st.fetch("https://do/history"); return json(await r.json(), 200, { ...h, "Cache-Control": "no-store" });
    }
    if (url.pathname === "/state") {
      const k = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
      const admin = env.ADMIN_KEY && k === env.ADMIN_KEY;
      if (o !== ORIGIN && !admin) return json({ error: "forbidden" }, 403, h);
      if (req.method === "GET") { const r = await st.fetch("https://do/state?since=" + encodeURIComponent(url.searchParams.get("since") || "0")); return json(await r.json(), 200, { ...h, "Cache-Control": "no-store" }); }
      if (req.method === "POST" && o === ORIGIN) { const b = await req.text(); if (b.length > 200000) return json({ error: "too big" }, 413, h); const r = await st.fetch("https://do/state", { method: "POST", body: b }); return json(await r.json(), 200, h); }
      return json({ error: "method" }, 405, h);
    }
    if (url.pathname === "/interview" && req.method === "POST") {
      if (o !== ORIGIN) return json({ error: "forbidden" }, 403, h);
      let b; try { b = await req.json() } catch (e) { return json({ error: "bad json" }, 400, h) }
      const job = b.job || {}, jid = String(job.id || "").slice(0, 80), JD = `Job: ${job.title} at ${job.company} (${job.mode}, ${job.location}, ${job.pay}).\nSummary: ${job.summary || ""}\nKey requirements: ${(job.reqs || []).join("; ")}`.slice(0, 4000);
      const X = async (msgs, max, temp) => { const r = await fetch("https://api.x.ai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.XAI_API_KEY }, body: JSON.stringify({ model: MODEL, temperature: temp, max_tokens: max, messages: msgs }) }); const d = await r.json(); return d.choices?.[0]?.message?.content || "" };
      if (b.mode === "prep") {
        if (!jid) return json({ error: "no job" }, 400, h);
        const c = await (await st.fetch("https://do/ivprep?id=" + encodeURIComponent(jid))).json(); if (c && c.prep) return json(c.prep, 200, h);
        const t = await X([{ role: "system", content: IVSYS }, { role: "user", content: JD + `\nWrite interview prep for Amjad for THIS job. Reply JSON only: {"format":"2-4 sentences on the likely interview process","questions":[{"type":"Technical IAM|Scenario|Behavioral|Company-specific","q":"...","a":"strong model answer in first person, structured (situation/approach/result or definition/how/example), 4-7 sentences, drawing on his real experience","points":["3-5 key points to hit"],"concept":"2-5 word concept name for a learning video, e.g. Entra Conditional Access"}],"gaps":["specific gap + how to prep it fast"]}. 10 questions: about 4 technical IAM, 3 scenario, 2 behavioral, 1-2 company-specific. 3-5 gaps.` }], 3500, 0.4);
        let prep; try { prep = JSON.parse(t.replace(/^```(json)?|```$/g, "").trim()) } catch (e) { return json({ error: "prep failed, try again" }, 502, h) }
        await st.fetch("https://do/ivprep", { method: "POST", body: JSON.stringify({ id: jid, prep }) }); return json(prep, 200, h);
      }
      if (b.mode === "exam") {
        const cert = String(b.cert || "SC-300").slice(0, 20), topic = String(b.topic || "").slice(0, 120), key = "x:" + cert + ":" + topic + ":" + (b.n | 0);
        const c = await (await st.fetch("https://do/ivprep?id=" + encodeURIComponent(key))).json(); if (c && c.prep) return json(c.prep, 200, h);
        const t = await X([{ role: "system", content: "You write accurate, current Microsoft/CompTIA certification practice questions in the real exam style. Use current product names (Microsoft Entra ID, not Azure AD). Reply JSON only." }, { role: "user", content: `Write 10 multiple-choice practice questions for the ${cert} exam on the topic: ${topic}. Mix scenario and fact questions. JSON: {"questions":[{"q":"...","choices":["A text","B text","C text","D text"],"answer":0-3 index,"explain":"2-3 sentences why the answer is right and the others wrong","objective":"exam objective"}]}` }], 3500, 0.4);
        let r; try { r = JSON.parse((t.match(/\{[\s\S]*\}/) || ["{}"])[0]) } catch (e) { return json({ error: "gen failed" }, 502, h) }
        await st.fetch("https://do/ivprep", { method: "POST", body: JSON.stringify({ id: key, prep: r }) }); return json(r, 200, h);
      }
      if (b.mode === "explain") {
        const t = await X([{ role: "system", content: "You are a kind, clear certification tutor for Amjad, an IT support pro moving into IAM (Entra ID, AD, AWS IAM). Explain simply with a real-world example. Under 150 words. Plain text." }, { role: "user", content: String(b.q || "").slice(0, 2000) }], 500, 0.4);
        return json({ text: t }, 200, h);
      }
      if (b.mode === "video") {
        const c = String(b.concept || "").slice(0, 120).trim(); if (!c) return json({ video: null }, 200, h);
        return json({ video: await conceptVideo(env, st, c) }, 200, h);
      }
      if (b.mode === "turn") {
        const msgs = (b.msgs || []).slice(-30).map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 3000) }));
        const n = msgs.filter(m => m.role === "user").length, end = !!(b.end || n > (b.max || 6));
        const sys = IVSYS + "\n" + JD + `\nYou are the INTERVIEWER for this job in a live mock interview (friendly, professional hiring manager). Ask ONE question at a time, mixing technical IAM, scenario, behavioral and company-specific. Plain text only, no markdown. Reply with JSON only:
{"feedback":"2-3 encouraging, specific sentences on his last answer (praise first); empty string on the first turn","score":N or null,"better_answer":"3-5 sentence stronger version of his last answer using his real experience; empty on first turn","greeting":"one warm sentence, first turn only, else empty","question":"the next question"${end ? "" : ""},"suggested_answer":"strong structured model answer to the NEW question in first person, 4-6 sentences, drawing on his real experience","key_points":["3-4 key points for the NEW question"],"concept":"2-5 word concept name for the NEW question","summary":null}` + (end ? `\nThe interview is now OVER: set question, suggested_answer, key_points and concept to empty, and set "summary" to {"score":N,"strengths":["3"],"practice":["3"],"closing":"one encouraging line"}.` : "");
        const t = await X([{ role: "system", content: sys }, ...(msgs.length ? msgs : [{ role: "user", content: "I'm ready to start." }])], 1400, 0.6);
        let r; try { r = JSON.parse((t.match(/\{[\s\S]*\}/) || ["{}"])[0]) } catch (e) { r = { question: t.replace(/[*#`]/g, "") } }
        if (r.concept && !end) r.video = await conceptVideo(env, st, r.concept);
        const reply = [r.feedback, r.question].filter(Boolean).join("\n\n");
        const all = [...msgs, { role: "assistant", content: (r.greeting ? r.greeting + "\n\n" : "") + (r.feedback ? "Feedback: " + r.feedback + "\n" : "") + (r.score != null ? "Score: " + r.score + "/10\n" : "") + (r.question ? "Question: " + r.question : "") + (r.summary ? "Summary: overall " + r.summary.score + "/10" : "") }];
        const score = r.summary && r.summary.score != null ? r.summary.score : r.score;
        await st.fetch("https://do/ivsave", { method: "POST", body: JSON.stringify({ sid: String(b.sid || "").slice(0, 60), job: { id: jid, title: job.title, company: job.company }, msgs: all, ended: end, score: score ?? null }) });
        return json({ ...r, ended: end, reply }, 200, h);
      }
      return json({ error: "mode" }, 400, h);
    }
    if (url.pathname === "/transcript" || url.pathname === "/videos") {
      const k = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
      if (!env.ADMIN_KEY || k !== env.ADMIN_KEY) return json({ error: "unauthorized" }, 401);
      if (url.pathname === "/videos") return st.fetch("https://do/videos");
      const id = (url.searchParams.get("id") || "").replace(/[^\w-]/g, "").slice(0, 11);
      return json(await transcript(id), 200);
    }
    if (url.pathname === "/state-reset" && req.method === "POST") {
      const k = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
      if (!env.ADMIN_KEY || k !== env.ADMIN_KEY) return json({ error: "unauthorized" }, 401);
      return st.fetch("https://do/state-reset", { method: "POST" });
    }
    if (url.pathname === "/hide" && req.method === "POST") {
      const k = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
      if (!env.ADMIN_KEY || k !== env.ADMIN_KEY) return json({ error: "unauthorized" }, 401);
      return st.fetch("https://do/hide?id=" + encodeURIComponent(url.searchParams.get("id") || "") + "&v=" + (url.searchParams.get("v") === "0" ? 0 : 1), { method: "POST" });
    }
    if (url.pathname === "/stt" && req.method === "POST") {
      if (o !== ORIGIN) return json({ error: "forbidden" }, 403, h);
      const ip = req.headers.get("CF-Connecting-IP") || "x";
      const rl = await (await st.fetch("https://do/rate?ip=" + encodeURIComponent(ip))).json();
      if (!rl.ok) return json({ error: "Too many tries. Please wait a few minutes." }, 429, h);
      const buf = await req.arrayBuffer();
      if (!buf.byteLength || buf.byteLength > 10 * 1024 * 1024) return json({ error: "bad audio" }, 400, h);
      const ct = (req.headers.get("Content-Type") || "audio/webm").split(";")[0];
      const ext = ct.includes("ogg") ? "ogg" : ct.includes("mp4") || ct.includes("m4a") ? "m4a" : ct.includes("wav") ? "wav" : "webm";
      const fd = new FormData(); fd.append("model", "grok-voice-transcribe-2.0"); fd.append("language", "en");
      fd.append("file", new Blob([buf], { type: ct }), "speech." + ext);
      const r = await fetch("https://api.x.ai/v1/stt", { method: "POST", headers: { Authorization: "Bearer " + env.XAI_API_KEY }, body: fd });
      if (!r.ok) return json({ error: "Couldn't understand the recording. Please try again." }, 502, h);
      const d = await r.json(); return json({ text: (d.text || "").trim() }, 200, h);
    }
    if (url.pathname === "/chat" && req.method === "POST") {
      if (o !== ORIGIN) return json({ error: "forbidden" }, 403, h);
      const ip = req.headers.get("CF-Connecting-IP") || "x";
      const rl = await (await st.fetch("https://do/rate?ip=" + encodeURIComponent(ip))).json();
      if (!rl.ok) return json({ error: "Too many messages. Take a short breather and try again in a few minutes." }, 429, h);
      let body; try { body = await req.json(); } catch { return json({ error: "bad json" }, 400, h); }
      let msgs = Array.isArray(body.messages) ? body.messages : [];
      msgs = msgs.filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string").slice(-20).map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
      if (!msgs.length || msgs[msgs.length - 1].role !== "user") return json({ error: "no question" }, 400, h);
      const first = !msgs.some(m => m.role === "assistant");
      const vidP = findVideos(env, msgs[msgs.length - 1].content);
      const r = await fetch("https://api.x.ai/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + env.XAI_API_KEY },
        body: JSON.stringify({ model: MODEL, temperature: 0.7, max_tokens: 700, messages: [{ role: "system", content: SYSTEM + (first ? "\nThis is his first message in this conversation." : "\nYou've already greeted him; don't repeat 'Hi Amjad'.") }, ...msgs] }) });
      if (!r.ok) return json({ error: "Dad's line is busy right now. Please try again in a minute." }, 502, h);
      const d = await r.json(); const answer = (d.choices?.[0]?.message?.content || "").trim(); const videos = await vidP;
      await st.fetch("https://do/add", { method: "POST", body: JSON.stringify({ ts: new Date().toISOString(), q: msgs[msgs.length - 1].content, a: answer, day: body.day || null, videos }) });
      return json({ answer, videos }, 200, h);
    }
    return json({ ok: true, service: "Ask Dad (Amjad)" }, 200, h);
  }
};

export class Store {
  constructor(state) { this.sql = state.storage.sql; this.sql.exec("CREATE TABLE IF NOT EXISTS log(id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT, q TEXT, a TEXT, day INTEGER)"); this.sql.exec("CREATE TABLE IF NOT EXISTS rl(ip TEXT, t INTEGER)"); try{this.sql.exec("ALTER TABLE log ADD COLUMN videos TEXT")}catch(e){} try{this.sql.exec("ALTER TABLE log ADD COLUMN hidden INTEGER DEFAULT 0")}catch(e){}
    this.sql.exec("CREATE TABLE IF NOT EXISTS ivprep(id TEXT PRIMARY KEY, prep TEXT, ts INTEGER)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS iv(sid TEXT PRIMARY KEY, job TEXT, msgs TEXT, ended INTEGER, score REAL, ts INTEGER, started INTEGER)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT, ts INTEGER)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS visits(sid TEXT PRIMARY KEY, start INTEGER, last INTEGER, active INTEGER, pages TEXT)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS ev(id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER, kind TEXT, detail TEXT)"); }
  stEvents(k, oldV, newV, ts) {
    const P = s => { try { return JSON.parse(s || "null") } catch (e) { return null } };
    const a = P(oldV) || {}, b = P(newV) || {}, add = (kind, d) => this.sql.exec("INSERT INTO ev(ts,kind,detail) VALUES(?,?,?)", ts, kind, JSON.stringify(d));
    if (k === "amjad-ivmarks") { for (const x of Object.keys(b)) if (!a[x] || a[x].m !== b[x].m) add("ivmark", { key: x, ...b[x] }); return; }
    if (k === "amjad-roadmap-v1" || k === "amjad-applied-v1") {
      const on = Object.keys(b).filter(x => b[x] && !a[x]), off = Object.keys(a).filter(x => a[x] && !b[x]);
      for (const x of on) add(k === "amjad-applied-v1" ? "applied" : "check", { key: x, on: true });
      for (const x of off) add(k === "amjad-applied-v1" ? "applied" : "check", { key: x, on: false });
    } else if (k === "amjad-profile") add("quiz", b);
    else if (k === "amjad-pv") add("tool", { v: newV });
  }
  async fetch(req) {
    const u = new URL(req.url);
    if (u.pathname === "/rate") {
      const now = Date.now(), ip = u.searchParams.get("ip");
      this.sql.exec("DELETE FROM rl WHERE t < ?", now - 600000);
      const n = this.sql.exec("SELECT COUNT(*) c FROM rl WHERE ip = ?", ip).one().c;
      const all = this.sql.exec("SELECT COUNT(*) c FROM rl").one().c;
      if (n >= 20 || all >= 200) return Response.json({ ok: false });
      this.sql.exec("INSERT INTO rl VALUES(?,?)", ip, now); return Response.json({ ok: true });
    }
    if (u.pathname === "/add") { const e = await req.json(); this.sql.exec("INSERT INTO log(ts,q,a,day,videos) VALUES(?,?,?,?,?)", e.ts, e.q, e.a, e.day, JSON.stringify(e.videos||[])); return Response.json({ ok: true }); }
    if (u.pathname === "/videos") { const ids = new Set(); for (const r of this.sql.exec("SELECT videos FROM log").toArray()) for (const v of JSON.parse(r.videos || "[]")) if (v.id) ids.add(v.id);
      for (const r of this.sql.exec("SELECT prep FROM ivprep WHERE id LIKE 'v:%'").toArray()) { const p = JSON.parse(r.prep || "{}"); if (p.video && p.video.id) ids.add(p.video.id); } return Response.json([...ids]); }
    if (u.pathname === "/visit" && req.method === "POST") {
      let b; try { b = JSON.parse(await req.text()) } catch (e) { return Response.json({}) }
      const sid = String(b.sid || "").replace(/[^\w-]/g, "").slice(0, 40); if (!sid) return Response.json({});
      const now = Date.now(), start = Math.min(+b.start || now, now), act = Math.max(0, Math.min(+b.active || 0, 86400));
      const pages = (Array.isArray(b.pages) ? b.pages : []).map(x => String(x).slice(0, 60)).slice(0, 100);
      const cur = this.sql.exec("SELECT active,pages FROM visits WHERE sid=?", sid).toArray()[0];
      if (cur) { const P = [...new Set([...JSON.parse(cur.pages || "[]"), ...pages])].slice(0, 100); this.sql.exec("UPDATE visits SET last=?, active=?, pages=? WHERE sid=?", now, Math.max(cur.active, act), JSON.stringify(P), sid); }
      else this.sql.exec("INSERT INTO visits(sid,start,last,active,pages) VALUES(?,?,?,?,?)", sid, start, now, act, JSON.stringify(pages));
      return Response.json({ ok: true });
    }
    if (u.pathname === "/visits" && req.method === "DELETE") { const sid = u.searchParams.get("sid") || ""; this.sql.exec("DELETE FROM visits WHERE sid=?", sid); return Response.json({ ok: true, deleted: sid }); }
    if (u.pathname === "/visits") return Response.json(this.sql.exec("SELECT sid,start,last,active,pages FROM visits ORDER BY start DESC LIMIT ?", +u.searchParams.get("limit") || 500).toArray().map(r => ({ sid: r.sid, start: r.start, last: r.last, active_sec: r.active, pages: JSON.parse(r.pages || "[]") })));
    if (u.pathname === "/state-reset") { this.sql.exec("DELETE FROM kv"); this.sql.exec("INSERT INTO kv(k,v,ts) VALUES('__epoch',?,?)", String(Date.now()), Date.now()); this.sql.exec("DELETE FROM ev"); this.sql.exec("DELETE FROM iv"); return Response.json({ ok: true }); }
    if (u.pathname === "/ivprep" && req.method === "POST") { const b = JSON.parse(await req.text()); this.sql.exec("INSERT OR REPLACE INTO ivprep(id,prep,ts) VALUES(?,?,?)", b.id, JSON.stringify(b.prep), Date.now()); return Response.json({ ok: true }); }
    if (u.pathname === "/ivprep") { const r = this.sql.exec("SELECT prep FROM ivprep WHERE id=?", u.searchParams.get("id")).toArray()[0]; return Response.json(r ? { prep: JSON.parse(r.prep) } : {}); }
    if (u.pathname === "/ivsave") { const b = JSON.parse(await req.text()); if (!b.sid) return Response.json({});
      const cur = this.sql.exec("SELECT started FROM iv WHERE sid=?", b.sid).toArray()[0];
      if (!cur) this.sql.exec("INSERT INTO ev(ts,kind,detail) VALUES(?,?,?)", Date.now(), "interview", JSON.stringify({ sid: b.sid, job: b.job }));
      if (b.ended) this.sql.exec("INSERT INTO ev(ts,kind,detail) VALUES(?,?,?)", Date.now(), "interview_done", JSON.stringify({ sid: b.sid, job: b.job, score: b.score }));
      this.sql.exec("INSERT OR REPLACE INTO iv(sid,job,msgs,ended,score,ts,started) VALUES(?,?,?,?,?,?,?)", b.sid, JSON.stringify(b.job), JSON.stringify(b.msgs), b.ended ? 1 : 0, b.score, Date.now(), cur ? cur.started : Date.now()); return Response.json({ ok: true }); }
    if (u.pathname === "/state" && req.method === "POST") {
      let b; try { b = JSON.parse(await req.text()) } catch (e) { return Response.json({ error: "bad json" }) }
      const ep = (this.sql.exec("SELECT v FROM kv WHERE k='__epoch'").toArray()[0] || {}).v || "0";
      if (String(b.epoch || "") !== ep) return Response.json({ ok: false, stale: true, epoch: ep });
      const ok = ["amjad-roadmap-v1","amjad-profile","amjad-streak","amjad-pv","amjad-applied-v1","amjad-ivmarks","amjad-jobfilters","amjad-ui","amjad-net","amjad-events","amjad-nl","amjad-apps","amjad-proj","amjad-exam","amjad-posts","amjad-cos","amjad-mentor"], out = [];
      for (const [k, it] of Object.entries(b.items || {})) {
        if (!ok.includes(k) || typeof it !== "object") continue;
        const ts = +it.ts || Date.now(), v = it.v == null ? null : String(it.v).slice(0, 50000);
        const cur = this.sql.exec("SELECT v,ts FROM kv WHERE k=?", k).toArray()[0];
        if (cur && cur.ts >= ts) continue;
        if (!cur || cur.v !== v) this.stEvents(k, cur && cur.v, v, ts);
        this.sql.exec("INSERT INTO kv(k,v,ts) VALUES(?,?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v, ts=excluded.ts", k, v, ts); out.push(k);
      }
      return Response.json({ ok: true, saved: out });
    }
    if (u.pathname === "/state") {
      const items = {}; let epoch = "0"; for (const r of this.sql.exec("SELECT k,v,ts FROM kv").toArray()) { if (r.k === "__epoch") epoch = r.v; else items[r.k] = { v: r.v, ts: r.ts }; }
      const ev = this.sql.exec("SELECT id,ts,kind,detail FROM ev WHERE id > ? ORDER BY id DESC LIMIT 1000", +u.searchParams.get("since") || 0).toArray().map(r => ({ id: r.id, ts: r.ts, kind: r.kind, d: JSON.parse(r.detail || "null") }));
      const ivs = this.sql.exec("SELECT sid,job,msgs,ended,score,ts,started FROM iv ORDER BY ts DESC LIMIT 100").toArray().map(r => ({ sid: r.sid, job: JSON.parse(r.job), msgs: JSON.parse(r.msgs), ended: !!r.ended, score: r.score, ts: r.ts, started: r.started }));
      return Response.json({ epoch, items, events: ev, interviews: ivs });
    }
    if (u.pathname === "/history") { return Response.json(this.sql.exec("SELECT id,ts,q,a,videos FROM log WHERE COALESCE(hidden,0)=0 ORDER BY id DESC LIMIT 500").toArray().map(r => ({ id: r.id, ts: r.ts, q: r.q, a: r.a, videos: JSON.parse(r.videos || "[]").map(v => ({ title: v.title, channel: v.channel, url: v.url, date: v.date })) }))); }
    if (u.pathname === "/hide") { this.sql.exec("UPDATE log SET hidden=? WHERE id=?", +u.searchParams.get("v"), +u.searchParams.get("id")); return Response.json({ ok: true }); }
    if (u.pathname === "/log") { const s = u.searchParams.get("since") || ""; return Response.json(this.sql.exec("SELECT id,ts,q,a,day,videos,hidden FROM log WHERE ts > ? ORDER BY id", s).toArray()); }
    return new Response("nf", { status: 404 });
  }
}
