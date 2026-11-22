// ================= Estado =================
const KEY = "egel_isoft_estudio_v1";
const EXAM = new Date(2026, 11, 4, 8, 30, 0);
let S = {xp:0, days:[], stats:{}, wrong:{}, box:{}, best:{}, hist:[]};
function load(){ try{ const r = localStorage.getItem(KEY); if(r){ S = Object.assign(S, JSON.parse(r)); } }catch(e){} }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
load();
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
function today(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function touchDay(){ const t=today(); if(!S.days.includes(t)){ S.days.push(t); save(); } }
function streak(){ let n=0; const d=new Date(); for(;;){ const k=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); if(S.days.includes(k)){ n++; d.setDate(d.getDate()-1);} else break; } return n; }
function bump(k,n=1){ S.daily=S.daily||{}; const t=today(); S.daily[t]=S.daily[t]||{q:0,c:0,r:0,x:0}; S.daily[t][k]=(S.daily[t][k]||0)+n; save(); }
function addXP(n){ touchDay(); save(); }
function level(){ return Math.floor(S.xp/250)+1; }
function record(qi, ok){ bump("q"); S.qs=S.qs||{}; const qq=S.qs[qi]=S.qs[qi]||{ok:0,tot:0}; qq.tot++; if(ok) qq.ok++; const a=Q[qi].a; S.stats[a]=S.stats[a]||{ok:0,tot:0}; S.stats[a].tot++; if(ok){ S.stats[a].ok++; if(S.wrong[qi]){ S.wrong[qi]--; if(S.wrong[qi]<=0) delete S.wrong[qi]; } } else { S.wrong[qi]=(S.wrong[qi]||0)+1; } save(); }
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("on"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("on"),1800); }

// ================= Top bar =================
function renderTop(){
  const ms = EXAM - new Date(); const d = Math.max(0, Math.ceil(ms/86400000));
  $("#cd").textContent = ms>0 ? d + (d===1?" día":" días") : "¡Hoy es el examen!";

}

// ================= Navegación =================
const VIEWS = ["inicio","aprender","simulacro","tarjetas","relampago","clasificar","ordenar","lectura","taller","memorama","gatillos","errores"];
function go(v){ if(!VIEWS.includes(v)) v="inicio"; $$(".view").forEach(x=>x.classList.toggle("on", x.id==="v-"+v)); $$("nav button").forEach(b=>b.classList.toggle("on", b.dataset.v===v)); const r={inicio:renderHome,aprender:learnSetup,simulacro:simSetup,tarjetas:cardSetup,relampago:rayoSetup,clasificar:clasSetup,ordenar:ordSetup,lectura:lectSetup,taller:tallerSetup,memorama:memoSetup,gatillos:gatSetup,errores:renderErr}[v]; r&&r(); try{ if(location.hash!=="#"+v) history.replaceState(null,"","#"+v); }catch(e){} window.scrollTo(0,0); }
document.addEventListener("click", e => { const b=e.target.closest("[data-v]"); if(b){ go(b.dataset.v); } });
window.addEventListener("hashchange", ()=>go(location.hash.slice(1)));

// ================= Inicio =================
const PLAN = [["2026-11-17","2026-11-20",3,"Área 3 · Desarrollo"],["2026-11-21","2026-11-24",2,"Área 2 · Diseño"],["2026-11-25","2026-11-27",4,"Área 4 · Gestión"],["2026-11-28","2026-11-29",1,"Área 1 · Análisis"],["2026-11-30","2026-11-30",5,"Lenguaje y Comunicación"],["2026-12-01","2026-12-02",0,"Simulacros contra reloj"],["2026-12-03","2026-12-03",-1,"Descanso total: nada de estudiar"],["2026-12-04","2026-12-04",-2,"Día D: 8:30 a 19:00"]];
function todayPlan(){ const t=today(); return PLAN.find(p=>t>=p[0]&&t<=p[1]); }
function renderHome(){
  const p = todayPlan();
  let html = "";
  if(p){
    let btn = "";
    if(p[2]>0) btn = `<button class="btn pri" onclick="quick(${p[2]},15)">Simulacro de ${esc(AREAS[p[2]])} (15)</button><button class="btn" onclick="go('tarjetas');setTimeout(()=>{cardArea=${p[2]};cardSetup()},0)">Tarjetas del área</button>`;
    else if(p[2]===0) btn = `<button class="btn pri" onclick="quick(0,40)">Simulacro mixto de 40 a 2.3 min</button>`;
    html += `<div class="hoy"><div class="tag">Hoy toca</div><h2>${esc(p[3])}</h2><div class="row">${btn}</div></div>`;
  }
  $("#todayBox").innerHTML = html;
  const names = [1,2,3,4,5];
  $("#areaBars").innerHTML = names.map(a=>{
    const s=S.stats[a]||{ok:0,tot:0}; const pct = s.tot? Math.round(s.ok/s.tot*100):0;
    const cls = !s.tot? "": pct>=75?"top":pct>=65?"ok":"low";
    return `<div class="abar" onclick="quick(${a},10)" title="Practicar ${esc(AREAS[a])}">
      <div class="aname"><span class="dot a${a}"></span>${esc(AREAS[a])}</div>
      <div class="track"><div class="fill fa${a}" style="width:${pct}%"></div></div>
      <div class="apct">${s.tot? pct+"%":"—"}<small>${s.tot? s.ok+"/"+s.tot:"sin datos"}</small></div></div>`;
  }).join("");
  const weak = names.filter(a=>(S.stats[a]||{}).tot>=5).sort((x,y)=>(S.stats[x].ok/S.stats[x].tot)-(S.stats[y].ok/S.stats[y].tot))[0];
  $("#weak").innerHTML = weak ? `Tu área más baja ahora: <b>${esc(AREAS[weak])}</b> (${Math.round(S.stats[weak].ok/S.stats[weak].tot*100)}%). <button class="lnk" onclick="quick(${weak},15)">Atacarla →</button>` : `Responde al menos 5 reactivos por área y aquí te diré cuál atacar primero.`;
  const nErr = Object.keys(S.wrong).length;
  if($("#errChip")) $("#errChip").textContent = nErr;
  const due = CARDS.filter((c,i)=>(S.box[i]||1)<=2).length;
  if($("#dueChip")) $("#dueChip").textContent = due;
  $("#hist").innerHTML = S.hist.slice(-8).reverse().map(h=>`<div class="hrow"><span>${esc(h.d)}</span><span>${esc(h.lab)}</span><b class="${h.p>=75?'top':h.p>=65?'ok':'low'}">${h.p}%</b><span class="mut">${h.n} reactivos</span></div>`).join("") || `<p class="mut">Aún no hay simulacros. Haz el primero y aquí verás tu evolución.</p>`;
}
function quick(area, n){ go("simulacro"); simCfg.area = area; simCfg.n = n; simCfg.timer = n>=40; simStart(); }

// ================= Simulacro =================
let simCfg = {area:0, n:15, timer:false, inst:true, conf:true, prop:0, d:0};
let sim = null;
function simSetup(){
  if(sim && !sim.done){ simRender(); return; }
  const areas = [[0,"Todas"],[1,"Análisis"],[2,"Diseño"],[3,"Desarrollo"],[4,"Gestión"],[5,"Lenguaje"]];
  const counts = [10,15,25,40,0];
  $("#simBox").innerHTML = `<div class="card setup">
    <h2>Arma tu simulacro</h2>
    <p class="mut">Tres opciones por reactivo, como en el examen real. Atajos: <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> para responder, <kbd>Enter</kbd> para avanzar y <kbd>F</kbd> para marcar.</p>
    <label>Área</label><div class="chips" id="cA">${areas.map(a=>`<button class="chip ${simCfg.area===a[0]?'on':''}" data-a="${a[0]}">${a[1]}</button>`).join("")}</div>
    <label>Reactivos</label><div class="chips" id="cN">${counts.map(c=>`<button class="chip ${simCfg.n===c?'on':''}" data-n="${c}">${c||"Todos"}</button>`).join("")}</div>
    <label>Exámenes modelo (respetan el peso real de cada área)</label><div class="chips"><button class="chip" id="pre40">Mini examen · 40 reactivos · 92 min</button><button class="chip" id="pre100">Maratón · 100 reactivos · 3 h 50 min</button></div>
    <label>Dificultad</label><div class="chips" id="cD"><button class="chip ${!simCfg.d?'on':''}" data-d="0">Todas</button><button class="chip ${simCfg.d===3?'on':''}" data-d="3">Solo avanzadas</button></div>
    <label>Modo</label><div class="chips">
      <button class="chip ${simCfg.conf?'on':''}" id="tConf">Calibrar mi seguridad</button>
      <button class="chip ${simCfg.inst?'on':''}" id="tInst">Retro inmediata</button>
      <button class="chip ${simCfg.timer?'on':''}" id="tTimer">Cronómetro (2.3 min por reactivo)</button></div>
    <div class="row"><button class="btn pri big" id="goSim">Empezar</button><span class="mut" id="poolInfo"></span></div></div>`;
  const upd=()=>{ const pool = Q.filter(q=>(!simCfg.area||q.a===simCfg.area)&&(!simCfg.d||q.d===3)).length; const fresh = Q.map((q,i)=>i).filter(i=>(!simCfg.area||Q[i].a===simCfg.area)&&(!simCfg.d||Q[i].d===3)&&!seenN(i)).length; $("#poolInfo").textContent = pool + " reactivos disponibles · " + fresh + " que aún no has visto (salen primero)"; };
  upd();
  $("#cA").onclick = e=>{ const b=e.target.closest("[data-a]"); if(!b) return; simCfg.area=+b.dataset.a; $$("#cA .chip").forEach(x=>x.classList.toggle("on",x===b)); upd(); };
  $("#cN").onclick = e=>{ const b=e.target.closest("[data-n]"); if(!b) return; simCfg.n=+b.dataset.n; $$("#cN .chip").forEach(x=>x.classList.toggle("on",x===b)); };
  $("#cD").onclick = e=>{ const b=e.target.closest("[data-d]"); if(!b) return; simCfg.d=+b.dataset.d; $$("#cD .chip").forEach(x=>x.classList.toggle("on",x===b)); upd(); };
  $("#tInst").onclick = e=>{ simCfg.inst=!simCfg.inst; e.target.classList.toggle("on",simCfg.inst); };
  $("#tTimer").onclick = e=>{ simCfg.timer=!simCfg.timer; e.target.classList.toggle("on",simCfg.timer); };
  $("#tConf").onclick = e=>{ simCfg.conf=!simCfg.conf; e.target.classList.toggle("on",simCfg.conf); };
  $("#pre40").onclick = ()=>{ simCfg.prop=40; simCfg.timer=true; simCfg.inst=false; simStart(); };
  $("#pre100").onclick = ()=>{ simCfg.prop=100; simCfg.timer=true; simCfg.inst=false; simStart(); };
  $("#goSim").onclick = ()=>{ simCfg.prop=0; simStart(); };
}
function simStart(ids){
  let pool = ids ? ids.slice() : Q.map((q,i)=>i).filter(i=>(!simCfg.area||Q[i].a===simCfg.area)&&(!simCfg.d||Q[i].d===3));
  pool = ids? shuffle(pool) : pickFresh(pool); if(!ids && simCfg.n) pool = pool.slice(0, simCfg.n);
  let label = ids? "Repaso de errores" : (simCfg.area? AREAS[simCfg.area] : "Mixto");
  if(!ids && simCfg.prop){ const W={1:.22,2:.23,3:.34,4:.21}; pool=[]; [1,2,3,4].forEach(a=>{ const k=Math.round(simCfg.prop*W[a]); pool=pool.concat(pickFresh(Q.map((q,i)=>i).filter(i=>Q[i].a===a&&(!simCfg.d||Q[i].d===3))).slice(0,k)); }); pool=shuffle(pool); label="Examen modelo "+simCfg.prop; }
  sim = {ids:pool, i:0, ans:{}, ord:{}, flag:{}, conf:{}, done:false, t0:Date.now(), lim: simCfg.timer? Math.round(pool.length*2.3*60):0, label};
  pool.forEach(qi=>{ sim.ord[qi]=shuffle([0,1,2]); });
  clearInterval(window._simT);
  if(sim.lim) window._simT=setInterval(simTick,1000);
  simRender();
}
function simTick(){ if(!sim||sim.done){ clearInterval(window._simT); return; } const left = sim.lim - Math.floor((Date.now()-sim.t0)/1000); const el=$("#simClock"); if(el){ el.textContent = fmt(Math.max(0,left)); el.classList.toggle("warn", left<120); } if(left<=0){ toast("Se acabó el tiempo"); simFinish(); } }
function fmt(s){ const m=Math.floor(s/60), r=s%60; return m+":"+String(r).padStart(2,"0"); }
function simRender(){
  if(sim.done) return simResults();
  const qi = sim.ids[sim.i], q = Q[qi], ord = sim.ord[qi], chosen = sim.ans[qi];
  const answered = chosen!==undefined, show = answered && simCfg.inst;
  const L = ["A","B","C"];
  const dots = sim.ids.map((id,k)=>{ const a=sim.ans[id]; let c = a===undefined? "" : (simCfg.inst? (a===Q[id].c?"g":"r") : "b"); return `<span class="pd ${c} ${k===sim.i?'cur':''} ${sim.flag[id]?'fl':''}" data-k="${k}"></span>`; }).join("");
  $("#simBox").innerHTML = `<div class="simtop"><span class="tag a${q.a}">${esc(AREAS[q.a])}</span><span class="mut">Reactivo ${sim.i+1} de ${sim.ids.length}</span>${sim.lim?`<span class="clock" id="simClock">${fmt(Math.max(0,sim.lim-Math.floor((Date.now()-sim.t0)/1000)))}</span>`:""}<button class="lnk" id="flagB">${sim.flag[qi]?"Marcado":"Marcar"}</button></div>
  <div class="pdots" id="pdots">${dots}</div>
  <div class="card q">${ctxHTML(q)}<p class="qt">${advTag(q)}${esc(q.q)}</p>
  ${simCfg.conf&&!show?`<div class="confrow"><span class="mut">Antes de responder, ¿qué tan seguro estás?</span><button class="cf ${sim.conf[qi]!=="d"?"on":""}" data-cf="s">Seguro</button><button class="cf ${sim.conf[qi]==="d"?"on":""}" data-cf="d">Lo dudo</button></div>`:""}
  <div class="opts">${ord.map((oi,k)=>{ let cls=""; if(show){ if(oi===q.c) cls="right"; else if(oi===chosen) cls="wrong"; } else if(answered && oi===chosen) cls="sel"; return `<button class="opt ${cls}" data-oi="${oi}" ${show?"disabled":""}><span class="ol">${L[k]}</span><span>${esc(q.o[oi])}</span></button>`; }).join("")}</div>
  ${show? fbHTML(qi, chosen) : ""}
  </div>
  <div class="row nav2"><button class="btn" id="prevB" ${sim.i===0?"disabled":""}>← Anterior</button><button class="btn pri" id="nextB">${sim.i===sim.ids.length-1?"Terminar":"Siguiente →"}</button><button class="btn ghost" id="endB">Terminar ya</button></div>`;
  $$(".opt").forEach(b=>b.onclick=()=>simAnswer(+b.dataset.oi));
  $$(".cf").forEach(b=>b.onclick=()=>{ sim.conf[qi]=b.dataset.cf; $$(".cf").forEach(x=>x.classList.toggle("on",x===b)); });
  $("#prevB").onclick=()=>{ sim.i--; simRender(); };
  $("#nextB").onclick=simNext;
  $("#endB").onclick=simFinish;
  $("#flagB").onclick=()=>{ sim.flag[qi]=!sim.flag[qi]; simRender(); };
  $("#pdots").onclick=e=>{ const d=e.target.closest("[data-k]"); if(d){ sim.i=+d.dataset.k; simRender(); } };
}
function simAnswer(oi){ const qi=sim.ids[sim.i]; if(simCfg.inst && sim.ans[qi]!==undefined) return; const first = sim.ans[qi]===undefined; sim.ans[qi]=oi; if(simCfg.inst && first){ const ok = oi===Q[qi].c; record(qi, ok); addXP(ok?10:2); } simRender(); }
function simNext(){ if(sim.i<sim.ids.length-1){ sim.i++; simRender(); } else simFinish(); }
function simFinish(){
  if(sim.done) return; clearInterval(window._simT);
  if(!simCfg.inst){ sim.ids.forEach(qi=>{ if(sim.ans[qi]!==undefined){ const ok=sim.ans[qi]===Q[qi].c; record(qi,ok); addXP(ok?10:2);} }); }
  sim.done=true;
  const ok = sim.ids.filter(qi=>sim.ans[qi]===Q[qi].c).length; const p = Math.round(ok/sim.ids.length*100);
  S.hist.push({d:today(), lab:sim.label, p, n:sim.ids.length}); if(S.hist.length>60) S.hist=S.hist.slice(-60);
  if(p===100 && sim.ids.length>=10) addXP(50);
  save(); simResults();
}
function simResults(){
  const ids=sim.ids, ok=ids.filter(qi=>sim.ans[qi]===Q[qi].c).length, p=Math.round(ok/ids.length*100);
  const secs = Math.round((Date.now()-sim.t0)/1000);
  const by = {}; ids.forEach(qi=>{ const a=Q[qi].a; by[a]=by[a]||{ok:0,t:0}; by[a].t++; if(sim.ans[qi]===Q[qi].c) by[a].ok++; });
  const bad = ids.filter(qi=>sim.ans[qi]!==Q[qi].c);
  const msg = bad.length? "Abajo tienes cada error con la explicación de por qué tu opción no era la correcta y un enlace a su lección." : "Sin errores en este intento.";
  $("#simBox").innerHTML = `<div class="card res"><div class="ring" style="--p:${p}"><span>${p}%</span></div>
    <div><h2>${ok} de ${ids.length} correctas</h2><p>${msg}</p><p class="mut">Tiempo: ${fmt(secs)} · ${(secs/ids.length/60).toFixed(1)} min por reactivo (meta ≤ 2.3)</p>
    <div class="row"><button class="btn pri" id="againB">Otro simulacro</button>${bad.length?`<button class="btn" id="badB">${bad.length===1?"Repetir mi error":"Repetir mis "+bad.length+" errores"}</button>`:""}</div></div></div>
    ${simCfg.conf? (()=>{ const m={ss:0,sx:0,ds:0,dx:0}; ids.forEach(qi=>{ if(sim.ans[qi]===undefined) return; const ok=sim.ans[qi]===Q[qi].c, d=sim.conf[qi]==="d"; m[(d?"d":"s")+(ok?"s":"x")]++; }); const danger=ids.filter(qi=>sim.ans[qi]!==undefined && sim.conf[qi]!=="d" && sim.ans[qi]!==Q[qi].c);
      return `<div class="card"><h3>Calibración: qué tan bien sabes lo que sabes</h3><div class="calib"><div class="cb g"><b>${m.ss}</b>Seguro y acertaste<small>Dominado</small></div><div class="cb r"><b>${m.sx}</b>Seguro y fallaste<small>Concepto mal aprendido: el más peligroso</small></div><div class="cb y"><b>${m.ds}</b>Dudaste y acertaste<small>Suerte o intuición: refuérzalo</small></div><div class="cb n"><b>${m.dx}</b>Dudaste y fallaste<small>Laguna conocida: estúdiala</small></div></div>${danger.length?`<p class="mut" style="margin-top:12px">Los errores con seguridad se repiten en el examen real, porque ni siquiera sospechas que están mal. Prioriza estos: ${danger.map(qi=>`<span class="tag a${Q[qi].a}">${esc(Q[qi].q.slice(0,48))}…</span>`).join(" ")}</p>`:""}</div>`; })() : ""}
    <div class="card"><h3>Por área</h3>${Object.keys(by).map(a=>{ const x=by[a], pp=Math.round(x.ok/x.t*100); return `<div class="abar"><div class="aname"><span class="dot a${a}"></span>${esc(AREAS[a])}</div><div class="track"><div class="fill fa${a}" style="width:${pp}%"></div></div><div class="apct">${pp}%<small>${x.ok}/${x.t}</small></div></div>`; }).join("")}</div>
    ${bad.length?`<div class="card"><h3>Revisa estos</h3>${bad.map(qi=>{ const q=Q[qi], a=sim.ans[qi]; return `<div class="rev"><span class="tag a${q.a}">${esc(AREAS[q.a])}</span>${ctxHTML(q,1)}<p class="qt sm">${advTag(q)}${esc(q.q)}</p>${a!==undefined?`<p class="wr">Elegiste: ${esc(q.o[a])}</p>`:`<p class="wr">— Sin responder</p>`}<p class="rt">Correcta: ${esc(q.o[q.c])}</p>${a!==undefined&&a!==q.c?`<p class="why"><b>Por qué no:</b> ${esc(W[qi][q.o.indexOf(q.o[a])-1]||"")}</p>`:""}<p class="mut"><b>Por qué sí:</b> ${esc(q.e)}</p>${lessonBtn(qi)}</div>`; }).join("")}</div>`:""}`;
  $("#againB").onclick=()=>{ sim=null; simCfg.prop=0; simCfg.inst=true; simSetup(); };
  const bb=$("#badB"); if(bb) bb.onclick=()=>simStart(bad);
}

// ================= Tarjetas (Leitner) =================
let cardArea = 0, deck = [], ci = 0, flipped = false;
function cardSetup(){
  const areas=[[0,"Todas"],[1,"Análisis"],[2,"Diseño"],[3,"Desarrollo"],[4,"Gestión"],[5,"Lenguaje"]];
  const idx = CARDS.map((c,i)=>i).filter(i=>!cardArea||CARDS[i][0]===cardArea);
  const dist=[0,0,0,0,0]; idx.forEach(i=>dist[(S.box[i]||1)-1]++);
  deck = shuffle(idx).sort((x,y)=>(S.box[x]||1)-(S.box[y]||1)).slice(0,20); ci=0; flipped=false;
  $("#cardBox").innerHTML = `<div class="chips" id="cardA">${areas.map(a=>`<button class="chip ${cardArea===a[0]?'on':''}" data-a="${a[0]}">${a[1]}</button>`).join("")}</div>
  <div class="boxes">${dist.map((n,k)=>`<div class="bx"><div class="bxn">${n}</div><div class="bxl">Caja ${k+1}</div></div>`).join("")}</div>
  <p class="mut center">Sistema Leitner: lo que no sabes vuelve a la caja 1 y se repite más; lo que dominas sube hasta la 5. Cada sesión trae 20 tarjetas, primero las de las cajas bajas.</p>
  <div id="flipArea"></div>`;
  $("#cardA").onclick=e=>{ const b=e.target.closest("[data-a]"); if(b){ cardArea=+b.dataset.a; cardSetup(); } };
  cardRender();
}
function cardRender(){
  const fa=$("#flipArea"); if(!fa) return;
  if(ci>=deck.length){ fa.innerHTML=`<div class="card center"><h2>¡Sesión terminada!</h2><p>Repasaste ${deck.length} tarjetas.</p><button class="btn pri" onclick="cardSetup()">Otra ronda</button></div>`; return; }
  const k=deck[ci], c=CARDS[k], b=S.box[k]||1;
  fa.innerHTML = `<div class="prog"><div style="width:${ci/deck.length*100}%"></div></div>
  <div class="flip ${flipped?'f':''}" id="flipC"><div class="inner">
    <div class="face front"><span class="tag a${c[0]}">${esc(AREAS[c[0]])}</span><span class="bxt">Caja ${b}</span><p>${esc(c[1])}</p><small>Toca o pulsa espacio para voltear</small></div>
    <div class="face back"><span class="tag a${c[0]}">${esc(AREAS[c[0]])}</span><p>${esc(c[2])}</p></div></div></div>
  <div class="row center ${flipped?'':'hide'}" id="rateRow"><button class="btn bad" data-r="0">No me la sé <kbd>1</kbd></button><button class="btn" data-r="1">Más o menos <kbd>2</kbd></button><button class="btn good" data-r="2">Me la sé <kbd>3</kbd></button></div>`;
  $("#flipC").onclick=()=>{ flipped=!flipped; cardRender(); };
  $("#rateRow").onclick=e=>{ const b=e.target.closest("[data-r]"); if(b) rate(+b.dataset.r); };
}
function rate(r){ bump("c"); const k=deck[ci]; let b=S.box[k]||1; if(r===0) b=1; else if(r===2) b=Math.min(5,b+1); S.box[k]=b; save(); addXP(r===2?3:1); ci++; flipped=false; cardRender(); }

// ================= Relámpago =================
let rayo=null, rayoCat="Mezcla";
function rayoSetup(){
  clearInterval(window._ry);
  const cats=["Mezcla",...Object.keys(RAYO)];
  $("#rayoBox").innerHTML = `<div class="card setup"><h2>Ronda relámpago</h2><p class="mut">60 segundos. Lees el escenario y eliges el concepto. Cada acierto seguido sube tu multiplicador; un error te quita 3 segundos y rompe el combo. Así se entrena el “escenario → respuesta” en menos de 90 segundos.</p>
  <label>Tema</label><div class="chips" id="rC">${cats.map(c=>`<button class="chip ${rayoCat===c?'on':''}" data-c="${esc(c)}">${esc(c)}${S.best["r_"+c]?` · ${S.best["r_"+c]}`:""}</button>`).join("")}</div>
  <button class="btn pri big" id="rGo">¡Arrancar!</button></div>`;
  $("#rC").onclick=e=>{ const b=e.target.closest("[data-c]"); if(b){ rayoCat=b.dataset.c; $$("#rC .chip").forEach(x=>x.classList.toggle("on",x===b)); } };
  $("#rGo").onclick=rayoStart;
}
function rayoItems(){ const cats = rayoCat==="Mezcla"? Object.keys(RAYO) : [rayoCat]; const out=[]; cats.forEach(c=>RAYO[c].forEach(it=>out.push({c, s:it[0], r:it[1]}))); return shuffle(out); }
function rayoStart(){ rayo={items:rayoItems(), i:0, score:0, combo:0, hits:0, miss:0, end:Date.now()+60000}; clearInterval(window._ry); window._ry=setInterval(()=>{ const l=Math.max(0,Math.ceil((rayo.end-Date.now())/1000)); const el=$("#rT"); if(el){ el.textContent=l; el.parentElement.style.setProperty("--t", l/60); } if(l<=0) rayoEnd(); },200); rayoRender(); }
function rayoRender(){
  if(rayo.i>=rayo.items.length){ rayo.items=rayo.items.concat(rayoItems()); }
  const it=rayo.items[rayo.i]; const pool=[...new Set(RAYO[it.c].map(x=>x[1]))].filter(x=>x!==it.r);
  const opts=shuffle([it.r,...shuffle(pool).slice(0,3)]);
  $("#rayoBox").innerHTML = `<div class="rayohud"><div class="timer"><span id="rT">${Math.max(0,Math.ceil((rayo.end-Date.now())/1000))}</span></div><div><div class="sc">${rayo.score}</div><div class="mut">puntos</div></div><div class="combo ${rayo.combo>=3?'hot':''}">x${1+Math.floor(rayo.combo/3)}<small>combo ${rayo.combo}</small></div></div>
  <div class="card q rayo"><span class="tag">${esc(it.c)}</span><p class="qt">${esc(it.s)}</p><div class="rgrid">${opts.map((o,k)=>`<button class="ropt" data-o="${esc(o)}"><kbd>${k+1}</kbd>${esc(o)}</button>`).join("")}</div></div>`;
  $$(".ropt").forEach(b=>b.onclick=()=>rayoPick(b, b.dataset.o===it.r));
}
function rayoPick(b, ok){
  if(rayo.lock) return; rayo.lock=true;
  if(ok){ rayo.combo++; rayo.hits++; rayo.score+=10*(1+Math.floor(rayo.combo/3)); b.classList.add("right"); }
  else { rayo.combo=0; rayo.miss++; rayo.end-=3000; b.classList.add("wrong"); $$(".ropt").forEach(x=>{ if(x.dataset.o===rayo.items[rayo.i].r) x.classList.add("right"); }); rayo.missed=(rayo.missed||[]).concat([rayo.items[rayo.i]]); }
  setTimeout(()=>{ rayo.lock=false; rayo.i++; if(Date.now()<rayo.end) rayoRender(); }, ok?250:900);
}
function rayoEnd(){
  clearInterval(window._ry); if(!rayo||rayo.over) return; rayo.over=true;
  bump("r"); const k="r_"+rayoCat, rec = rayo.score > (S.best[k]||0); if(rec) S.best[k]=rayo.score; addXP(Math.round(rayo.score/10)); save();
  const ms = (rayo.missed||[]);
  $("#rayoBox").innerHTML = `<div class="card center res2"><h2>${rec?"¡Nuevo récord!":"Se acabó el tiempo"}</h2><div class="big1">${rayo.score}</div><p>${rayo.hits} aciertos · ${rayo.miss} errores · récord en ${esc(rayoCat)}: ${S.best[k]||0}</p><div class="row center"><button class="btn pri" id="rAg">Otra ronda</button><button class="btn" id="rCh">Cambiar tema</button></div></div>
  ${ms.length?`<div class="card"><h3>Los que fallaste</h3>${ms.map(m=>`<div class="mrow"><span>${esc(m.s)}</span><b>${esc(m.r)}</b></div>`).join("")}</div>`:""}`;
  $("#rAg").onclick=rayoStart; $("#rCh").onclick=rayoSetup;
}

// ================= Taller de cálculo =================
let tTab="traza", tEx=null;
const TT = {traza:"Traza de código", pert:"PERT", mcc:"McCabe", bva:"Valores límite", coc:"COCOMO", risk:"Riesgo"};
function tallerSetup(){
  $("#tallerBox").innerHTML = `<div class="chips" id="tT">${Object.keys(TT).map(k=>`<button class="chip ${tTab===k?'on':''}" data-t="${k}">${TT[k]}</button>`).join("")}</div><div id="tW"></div>`;
  $("#tT").onclick=e=>{ const b=e.target.closest("[data-t]"); if(b){ tTab=b.dataset.t; tallerSetup(); } };
  tNew();
}
function num(v){ return parseFloat(String(v).replace(",",".")); }
function tNew(){
  const W=$("#tW"); let h="";
  if(tTab==="pert"){ const O=rnd(1,6), M=O+rnd(1,6), P=M+rnd(2,12); const Te=(O+4*M+P)/6, sg=(P-O)/6; tEx={ans:[Te,sg], sol:`Te = (O + 4M + P) / 6 = (${O} + 4·${M} + ${P}) / 6 = ${O+4*M+P} / 6 = <b>${Te.toFixed(2)}</b><br>σ = (P − O) / 6 = (${P} − ${O}) / 6 = <b>${sg.toFixed(2)}</b><br>Varianza σ² = <b>${(sg*sg).toFixed(2)}</b>`};
    h=`<div class="formula">Te = (O + 4M + P) / 6 &nbsp;·&nbsp; σ = (P − O) / 6</div><p class="qt">Una actividad tiene estimación optimista <b>O = ${O}</b> días, más probable <b>M = ${M}</b> y pesimista <b>P = ${P}</b>. Calcula el tiempo esperado y la desviación estándar.</p><div class="inp"><label>Te <input id="i0" inputmode="decimal"></label><label>σ <input id="i1" inputmode="decimal"></label></div>`; }
  if(tTab==="mcc"){ if(Math.random()<0.5){ const N=rnd(6,12), E=N+rnd(1,5); const v=E-N+2; tEx={ans:[v], sol:`V(G) = E − N + 2P = ${E} − ${N} + 2·1 = <b>${v}</b>. También es el número mínimo de casos de prueba para cubrir los caminos básicos.`}; h=`<div class="formula">V(G) = E − N + 2P &nbsp;·&nbsp; V(G) = predicados + 1</div><p class="qt">El grafo de flujo de un método tiene <b>${E} aristas</b> y <b>${N} nodos</b> (un solo componente). ¿Cuánto vale la complejidad ciclomática?</p><div class="inp"><label>V(G) <input id="i0" inputmode="numeric"></label></div>`; }
    else { const parts=[], conds=["edad >= 18","saldo > 0","intentos < 3","activo == true","tipo == 'VIP'","stock > 0"]; let pred=0; const n=rnd(2,4); for(let k=0;k<n;k++){ const kind=rnd(0,2); const c1=conds[rnd(0,5)]; if(kind===0){ parts.push(`si (${c1}) entonces …`); pred+=1; } else if(kind===1){ const c2=conds[rnd(0,5)]; parts.push(`si (${c1} AND ${c2}) entonces …`); pred+=2; } else { parts.push(`mientras (${c1}) hacer …`); pred+=1; } } const v=pred+1; tEx={ans:[v], sol:`Cuenta los predicados simples: cada si o mientras suma 1 y cada AND/OR suma otro.<br>Predicados = ${pred} → V(G) = ${pred} + 1 = <b>${v}</b>`}; h=`<div class="formula">V(G) = predicados simples + 1 (cada AND / OR suma 1)</div><p class="qt">¿Cuál es la complejidad ciclomática de este pseudocódigo?</p><pre class="code">${parts.map(esc).join("\n")}</pre><div class="inp"><label>V(G) <input id="i0" inputmode="numeric"></label></div>`; } }
  if(tTab==="bva"){ const A=rnd(1,40), B=A+rnd(10,60); tEx={ans:[A-1,A,A+1,B-1,B,B+1], set:true, sol:`Para el rango [${A}, ${B}]: A−1, A, A+1, B−1, B, B+1 → <b>${A-1}, ${A}, ${A+1}, ${B-1}, ${B}, ${B+1}</b>. ${A-1} y ${B+1} son los inválidos.`}; h=`<div class="formula">BVA en [A, B]: A−1, A, A+1, B−1, B, B+1</div><p class="qt">Un campo acepta valores enteros de <b>${A}</b> a <b>${B}</b> inclusive. Escribe los 6 valores de prueba del análisis de valores límite, separados por comas.</p><div class="inp"><label class="wide">Valores <input id="i0" placeholder="ej. 9, 10, 11, …"></label></div>`; }
  if(tTab==="coc"){ const modes=[["orgánico",2.4,1.05,"un equipo pequeño y con experiencia, requisitos flexibles"],["semiacoplado",3.0,1.12,"un equipo mixto, requisitos intermedios"],["empotrado",3.6,1.20,"restricciones de hardware y tiempo real"]]; const m=modes[rnd(0,2)], K=rnd(8,120); const E=m[1]*Math.pow(K,m[2]); tEx={ans:[E], tol:0.02, sol:`Modo <b>${m[0]}</b>: a = ${m[1]}, b = ${m[2]}.<br>E = a · KLOC^b = ${m[1]} · ${K}^${m[2]} = <b>${E.toFixed(1)} personas-mes</b>`, modo:m[0]}; h=`<div class="formula">E = a · KLOC^b &nbsp;·&nbsp; Orgánico 2.4 / 1.05 · Semiacoplado 3.0 / 1.12 · Empotrado 3.6 / 1.20</div><p class="qt">Un proyecto de <b>${K} KLOC</b> tiene ${m[3]}. Identifica el modo y calcula el esfuerzo con COCOMO básico (personas-mes, un decimal).</p><div class="inp"><label>Modo <select id="iM"><option value="">—</option><option>orgánico</option><option>semiacoplado</option><option>empotrado</option></select></label><label>Esfuerzo <input id="i0" inputmode="decimal"></label></div><p class="mut">Usa tu calculadora científica: en el examen está permitida.</p>`; }
  if(tTab==="risk"){ const p=rnd(1,9)*10, I=rnd(2,40)*5000; const ex=p/100*I; tEx={ans:[ex], sol:`Exposición = probabilidad × impacto = ${p/100} × $${I.toLocaleString("es-MX")} = <b>$${ex.toLocaleString("es-MX")}</b>`}; h=`<div class="formula">Exposición al riesgo = probabilidad × impacto</div><p class="qt">Un riesgo tiene <b>${p}%</b> de probabilidad y un impacto estimado de <b>$${I.toLocaleString("es-MX")}</b>. ¿Cuál es su exposición?</p><div class="inp"><label>$ <input id="i0" inputmode="decimal"></label></div>`; }
  if(tTab==="traza"){ const g=trazaGen(); tEx={ans:[g.ans], sol:g.sol}; h=`<div class="formula">Traza en papel: haz una tabla con cada variable y actualízala vuelta por vuelta. “hasta” incluye el límite.</div><p class="qt">${g.q}</p><pre class="code">${esc(g.code)}</pre><div class="inp"><label>Resultado <input id="i0" inputmode="numeric"></label></div>`; }
  W.innerHTML = `<div class="card">${h}<div class="row"><button class="btn pri" id="tChk">Revisar</button><button class="btn" id="tSol">Ver solución</button><button class="btn ghost" id="tNx">Nuevo ejercicio</button></div><div id="tOut"></div></div>`;
  $("#tChk").onclick=tCheck; $("#tSol").onclick=()=>{ $("#tOut").innerHTML=`<div class="exp">${tEx.sol}</div>`; }; $("#tNx").onclick=tNew;
}
function tCheck(){
  let ok=true;
  if(tEx.set){ const v=($("#i0").value.match(/-?\d+/g)||[]).map(Number).sort((a,b)=>a-b); const t=tEx.ans.slice().sort((a,b)=>a-b); ok = v.length===t.length && v.every((x,k)=>x===t[k]); }
  else { tEx.ans.forEach((a,k)=>{ const el=$("#i"+k); const v=num(el?el.value:""); const tol = tEx.tol? Math.abs(a)*tEx.tol : 0.051; if(isNaN(v)||Math.abs(v-a)>tol) ok=false; }); }
  if(tEx.modo){ const m=$("#iM").value; if(m!==tEx.modo) ok=false; }
  $("#tOut").innerHTML = `<div class="exp ${ok?'okx':'badx'}"><b>${ok?"¡Exacto!":"Todavía no."}</b> ${ok?tEx.sol:"Revisa la fórmula de arriba o pulsa “Ver solución”."}</div>`;
  if(ok){ addXP(8); }
}

// ================= Memorama =================
let memo=null;
function memoSetup(){
  const pairsN = PARES.length/2; const pick = shuffle([...Array(pairsN).keys()]).slice(0,6);
  const cards=[]; pick.forEach(p=>{ cards.push({p, t:PARES[p*2][0], s:PARES[p*2][1], k:0}); cards.push({p, t:PARES[p*2+1][0], s:PARES[p*2+1][1], k:1}); });
  // Cada tarjeta: concepto + pista; emparejas los dos conceptos "hermanos" que el examen confunde
  memo={cards:shuffle(cards), open:[], done:new Set(), moves:0, t0:Date.now()};
  memoRender();
}
function memoRender(){
  const m=memo;
  $("#memoBox").innerHTML = `<p class="mut center">Cada pareja son dos conceptos “hermanos” que el CENEVAL usa como distractor. Encuentra los pares y lee la diferencia al voltearlos.</p>
  <div class="memostat"><span>Movimientos: <b>${m.moves}</b></span><span>Pares: <b>${m.done.size}/6</b></span><button class="btn ghost" id="mR">Nuevo tablero</button></div>
  <div class="mgrid">${m.cards.map((c,i)=>{ const up=m.open.includes(i)||m.done.has(c.p); return `<button class="mc ${up?'up':''} ${m.done.has(c.p)?'ok':''}" data-i="${i}"><span class="mf">?</span><span class="mb"><b>${esc(c.t)}</b><small>${esc(c.s)}</small></span></button>`; }).join("")}</div>`;
  $("#mR").onclick=memoSetup;
  $$(".mc").forEach(b=>b.onclick=()=>memoFlip(+b.dataset.i));
  if(m.done.size===6){ const s=Math.round((Date.now()-m.t0)/1000); $("#memoBox").insertAdjacentHTML("beforeend", `<div class="card center"><h2>Encontraste todos los pares</h2><p>${m.moves} movimientos en ${fmt(s)}. Repasa las diferencias de cada pareja antes de cambiar de tablero.</p><button class="btn pri" onclick="memoSetup()">Otro tablero</button></div>`); }
}
function memoFlip(i){
  const m=memo, c=m.cards[i]; if(m.lock||m.done.has(c.p)||m.open.includes(i)) return;
  m.open.push(i);
  if(m.open.length===2){ m.moves++; const [a,b]=m.open; if(m.cards[a].p===m.cards[b].p){ m.done.add(c.p); m.open=[]; memoRender(); } else { m.lock=true; memoRender(); setTimeout(()=>{ m.open=[]; m.lock=false; memoRender(); },1100); } }
  else memoRender();
}

// ================= Errores =================
function renderErr(){
  const ids=Object.keys(S.wrong).map(Number).sort((a,b)=>S.wrong[b]-S.wrong[a]);
  $("#errBox").innerHTML = ids.length? `<div class="row"><button class="btn pri" id="eGo">Practicar mis ${ids.length} errores</button><button class="btn ghost" id="eClr">Vaciar lista</button></div><p class="mut">Cada vez que aciertas un reactivo de esta lista baja su contador; cuando llega a cero, sale solo.</p>
  ${ids.map(qi=>{ const q=Q[qi]; return `<div class="card rev"><span class="tag a${q.a}">${esc(AREAS[q.a])}</span><span class="cnt">falla ×${S.wrong[qi]}</span><p class="qt sm">${esc(q.q)}</p><details><summary>Ver respuesta</summary><p class="rt">Correcta: ${esc(q.o[q.c])}</p><p class="mut">${esc(q.e)}</p></details></div>`; }).join("")}` : `<div class="card center"><h2>Sin errores pendientes</h2><p class="mut">Cuando falles un reactivo en un simulacro aparecerá aquí para que lo repases hasta dominarlo.</p><button class="btn pri" data-v="simulacro">Ir al simulacro</button></div>`;
  const g=$("#eGo"); if(g) g.onclick=()=>{ go("simulacro"); simCfg.inst=true; simStart(ids); };
  const c=$("#eClr"); if(c) c.onclick=()=>{ if(c.dataset.sure){ S.wrong={}; save(); renderErr(); } else { c.dataset.sure=1; c.textContent="¿Seguro? Pulsa otra vez"; } };
}

// ================= Teclado =================
document.addEventListener("keydown", e=>{
  if(e.target.matches("input,select,textarea")) return;
  const v = ($(".view.on")||{}).id;
  if(v==="v-simulacro" && sim && !sim.done){ const k=e.key.toLowerCase(); const map={"1":0,"2":1,"3":2,"a":0,"b":1,"c":2}; if(k in map){ const b=$$(".opt")[map[k]]; if(b&&!b.disabled) b.click(); } if(k==="enter"){ simNext(); } if(k==="f"){ $("#flagB")&&$("#flagB").click(); } if(k==="arrowleft"&&sim.i>0){ sim.i--; simRender(); } if(k==="arrowright"){ simNext(); } }
  if(v==="v-tarjetas"){ if(e.key===" "){ e.preventDefault(); const f=$("#flipC"); f&&f.click(); } if(flipped&&["1","2","3"].includes(e.key)) rate(+e.key-1); }
  if(v==="v-relampago" && rayo && !rayo.over){ const n=+e.key; if(n>=1&&n<=4){ const b=$$(".ropt")[n-1]; b&&b.click(); } }
});

