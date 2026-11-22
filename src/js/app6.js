// ===================== Repaso espaciado, descarte y examen completo =====================
function addDays(d, n){ const x=new Date(d+"T12:00:00"); x.setDate(x.getDate()+n); return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0"); }
const SRS_GAP=[1,3,7];
S.srs=S.srs||{};
Object.keys(S.wrong||{}).forEach(k=>{ if(!S.srs[k]) S.srs[k]={l:0,due:today()}; });
const _record=record;
record=function(qi,ok){
  _record(qi,ok);
  const t=today(), r=S.srs[qi];
  if(!ok){ S.srs[qi]={l:0,due:addDays(t,SRS_GAP[0])}; }
  else if(r && r.due<=t){ r.l++; if(r.l>=3){ delete S.srs[qi]; S.srsDone=(S.srsDone||0)+1; } else r.due=addDays(t,SRS_GAP[r.l]); }
  save();
};
function srsDue(){ const t=today(); return Object.keys(S.srs).map(Number).filter(i=>Q[i]&&S.srs[i].due<=t); }
function srsStart(){ const ids=srsDue(); if(!ids.length) return; go("simulacro"); simCfg.inst=true; simStart(ids); sim.label="Repaso espaciado"; }

// ----- Tarjeta de repaso en Inicio y en Errores -----
function srsCard(id){
  const t=today(), all=Object.keys(S.srs).map(Number).filter(i=>Q[i]), due=srsDue();
  const days=[...Array(7)].map((_,k)=>{ const d=addDays(t,k+1); return {d, n:all.filter(i=>S.srs[i].due===d).length}; });
  const lv=[0,1,2].map(l=>all.filter(i=>S.srs[i].l===l).length);
  const wk=["dom","lun","mar","mié","jue","vie","sáb"];
  const mx=Math.max(1,...days.map(x=>x.n));
  return `<div class="card srs"><div class="srsh"><div><h3>Repaso espaciado</h3><p class="mut" style="margin:0">Cada reactivo que fallas vuelve al día siguiente, luego a los 3 días y luego a los 7. Si lo aciertas en los tres repasos, sale de la lista; si lo fallas, empieza de nuevo.</p></div>
  <div class="srsnum"><b>${due.length}</b><span>${due.length===1?"pendiente hoy":"pendientes hoy"}</span></div></div>
  <div class="srsgrid"><div class="srslv"><div><b>${lv[0]}</b><span>Primer repaso</span></div><div><b>${lv[1]}</b><span>Segundo repaso</span></div><div><b>${lv[2]}</b><span>Último repaso</span></div><div><b>${S.srsDone||0}</b><span>Ya dominados</span></div></div>
  <div class="srscal">${days.map(x=>{ const dd=new Date(x.d+"T12:00:00"); return `<div class="sc"><div class="scb"><i style="height:${Math.round(x.n/mx*100)}%"></i></div><b>${x.n}</b><span>${wk[dd.getDay()]} ${dd.getDate()}</span></div>`; }).join("")}</div></div>
  <div class="row"><button class="btn pri" id="${id}" ${due.length?"":"disabled"}>${due.length?"Hacer el repaso de hoy ("+due.length+")":"Nada pendiente por hoy"}</button></div></div>`;
}
const _rh6=renderHome;
renderHome=function(){ _rh6(); const tb=$("#todayBox"); if(tb){ tb.insertAdjacentHTML("beforeend", srsCard("srsGoH")); const b=$("#srsGoH"); if(b) b.onclick=srsStart; } };
const _re6=renderErr;
renderErr=function(){ _re6(); $("#errBox").insertAdjacentHTML("afterbegin", srsCard("srsGoE")); const b=$("#srsGoE"); if(b) b.onclick=srsStart; };

// ----- Técnica de descarte (en el simulacro) -----
if(simCfg.desc===undefined) simCfg.desc=true;
function strikeUI(box, st, qi, locked, rer){
  const x=st.x[qi]=st.x[qi]||{};
  $$(".opt",box).forEach(b=>{ const oi=+b.dataset.oi; if(x[oi]) b.classList.add("struck");
    if(locked) return;
    const s=document.createElement("span"); s.className="strike"; s.title="Tachar: sé que esta no es"; s.textContent=x[oi]?"Quitar tachado":"Tachar";
    s.onclick=e=>{ e.stopPropagation(); x[oi]=!x[oi]; rer(); };
    b.appendChild(s); });
}
function descStats(st, ids){
  let good=0, bad=0, saved=0;
  ids.forEach(qi=>{ const x=st.x&&st.x[qi]; if(!x) return; let g=0; Object.keys(x).forEach(k=>{ if(!x[k]) return; if(+k===Q[qi].c) bad++; else { good++; g++; } }); if(g && st.ans[qi]!==undefined && st.ans[qi]!==Q[qi].c) saved++; });
  return {good,bad,saved};
}
function descCard(st, ids){
  const d=descStats(st,ids); if(!d.good && !d.bad) return "";
  return `<div class="card"><h3>Técnica de descarte</h3><div class="calib"><div class="cb g"><b>${d.good}</b>Opciones bien tachadas<small>Eran incorrectas</small></div><div class="cb r"><b>${d.bad}</b>Tachaste la correcta<small>Descartaste la respuesta buena: revisa ese concepto</small></div><div class="cb y"><b>${d.saved}</b>Fallaste, pero descartaste bien<small>Ibas por buen camino: te faltó distinguir entre las dos que quedaban</small></div></div>
  <p class="mut" style="margin-top:12px">Con tres opciones, tachar una que sabes que es falsa sube tu probabilidad de acertar de 33% a 50%, aun si dudas entre las otras dos.</p></div>`;
}
const _simSetup6=simSetup;
simSetup=function(){ _simSetup6(); const m=$("#tConf"); if(m && !$("#tDesc")){ m.insertAdjacentHTML("afterend", `<button class="chip ${simCfg.desc?'on':''}" id="tDesc">Técnica de descarte</button>`); $("#tDesc").onclick=e=>{ simCfg.desc=!simCfg.desc; e.target.classList.toggle("on",simCfg.desc); }; } };
const _simRender6=simRender;
simRender=function(){ _simRender6(); if(!sim||sim.done||!simCfg.desc) return; sim.x=sim.x||{}; const qi=sim.ids[sim.i]; const locked = simCfg.inst && sim.ans[qi]!==undefined; strikeUI($("#simBox"), sim, qi, locked, simRender); };
const _simResults6=simResults;
simResults=function(){ _simResults6(); if(!sim.x) return; const c=$("#simBox .card.res"); if(c) c.insertAdjacentHTML("afterend", descCard(sim, sim.ids)); };

// ===================== Examen completo =====================
const SUBN={"1.1":12,"1.2":9,"1.3":10,"2.1":10,"2.2":16,"2.3":7,"3.1":10,"3.2":10,"3.3":10,"3.4":9,"3.5":10,"4.1":8,"4.2":10,"4.3":12};
const SUBT={"1.1":"Tipos de requerimientos","1.2":"Obtención, análisis, priorización y validación","1.3":"Documentación de requerimientos","2.1":"Diseño arquitectónico","2.2":"Módulos, componentes y datos","2.3":"Diseño de interfaces","3.1":"Lenguajes de desarrollo","3.2":"Paradigmas de programación","3.3":"Entornos de desarrollo","3.4":"Gestión de datos","3.5":"Plataformas de desarrollo","4.1":"Tiempos, costos, recursos y riesgo","4.2":"Calidad de software","4.3":"Metodologías de desarrollo"};
const FX_PARTS={s1:{n:"Sesión 1",d:"Sección disciplinar · primera parte",min:270},s2a:{n:"Sesión 2",d:"Sección disciplinar · segunda parte",min:150},s2b:{n:"Sesión 2",d:"Lenguaje y Comunicación",min:0}};
function subOf(qi){ const L=LESSONS.find(l=>l.id===Q2L[qi]); return L? L.sub.slice(0,3) : ""; }
function fxBuild(){
  const by={}; Q.forEach((q,i)=>{ if(q.a<5){ const s=subOf(i); (by[s]=by[s]||[]).push(i); } });
  let dis=[]; Object.keys(SUBN).forEach(s=>{ dis=dis.concat(pickFresh(by[s]||[]).slice(0,SUBN[s])); });
  dis=shuffle(dis);
  const len=pickFresh(Q.map((q,i)=>i).filter(i=>Q[i].a===5));
  const ids={s1:dis.slice(0,92), s2a:dis.slice(92), s2b:shuffle(len)};
  const ord={}; [...dis,...len].forEach(qi=>ord[qi]=shuffle([0,1,2]));
  S.fx={ids, part:"s1", i:0, ans:{}, ord, flag:{}, x:{}, tq:{}, used:{s1:0,s2a:0,s2b:0}, started:today(), lim:{s1:270*60, s2a:150*60, s2b:len.length*2*60}, phase:"intro"};
  save();
}
let fxT0=null, fxQ0=null, fxTimer=null;
function fxLeft(){ const f=S.fx; const run = fxT0? (Date.now()-fxT0)/1000 : 0; return Math.max(0, Math.round(f.lim[f.part]-f.used[f.part]-run)); }
function fxFlush(){ const f=S.fx; if(!f||!fxT0) return; const now=Date.now(); f.used[f.part]+=(now-fxT0)/1000; fxT0=now; const qi=f.ids[f.part][f.i]; if(fxQ0!=null&&qi!=null){ f.tq[qi]=(f.tq[qi]||0)+(now-fxQ0)/1000; } fxQ0=now; save(); }
function fxPause(){ if(fxT0){ fxFlush(); fxT0=null; fxQ0=null; } clearInterval(fxTimer); }
function fxRun(){ fxT0=Date.now(); fxQ0=Date.now(); clearInterval(fxTimer); fxTimer=setInterval(()=>{ const el=$("#fxClock"); if(!el || !$("#v-examen.on")){ fxPause(); return; } const l=fxLeft(); el.textContent=fmtH(l); el.classList.toggle("warn", l<600); if(l<=0){ fxFlush(); fxEndPart(true); } },1000); }
function fmtH(s){ const h=Math.floor(s/3600), m=Math.floor(s%3600/60), r=s%60; return (h?h+":"+String(m).padStart(2,"0"):m)+":"+String(r).padStart(2,"0"); }
function fxSetup(){
  const f=S.fx, box=$("#fxBox");
  if(!f){
    box.innerHTML=`<div class="card fxintro"><h2>Examen completo como el real</h2>
    <p>Reproduce la jornada del 4 de diciembre con las proporciones de la guía oficial: los 143 reactivos de la sección disciplinar repartidos por subárea exactamente como en el examen, y la sección de Lenguaje y Comunicación.</p>
    <div class="fxplan">
      <div><span class="fxh">Sesión 1</span><b>92 reactivos disciplinares</b><span>4 h 30 min · en el real, de 8:30 a 13:00</span></div>
      <div><span class="fxh">Receso</span><b>Pausa libre</b><span>en el real, de 13:00 a 14:30</span></div>
      <div><span class="fxh">Sesión 2</span><b>51 reactivos disciplinares</b><span>2 h 30 min · en el real, de 14:30 a 17:00</span></div>
      <div><span class="fxh">Sesión 2</span><b>${Q.filter(q=>q.a===5).length} reactivos de Lenguaje</b><span>2 min por reactivo · el real tiene 60 en 2 h</span></div></div>
    <ul class="fxrules"><li>Sin retroalimentación hasta el final, como en el examen real.</li><li>Puedes marcar reactivos, tachar opciones y regresar a cualquier reactivo de la sesión en curso, pero no a una sesión que ya cerraste.</li><li>Tu avance se guarda solo: puedes pausar y continuar otro día. Al pausar se detiene el reloj.</li><li>Al final ves tus aciertos por área y subárea, tu ritmo por reactivo y los reactivos en los que más tardaste.</li></ul>
    <div class="row"><button class="btn pri big" id="fxNew">Comenzar examen</button></div></div>`;
    $("#fxNew").onclick=()=>{ fxBuild(); fxSetup(); };
    return;
  }
  if(f.phase==="done") return fxResults();
  if(f.phase==="intro"||f.phase==="break"){
    const P=FX_PARTS[f.part], n=f.ids[f.part].length, lim=f.lim[f.part];
    const msg = f.phase==="break"? (f.part==="s2a"? "Terminaste la Sesión 1. En el examen real ahora tienes hora y media de comida: aprovecha para despejarte antes de seguir." : "Terminaste la sección disciplinar. En el examen real, Lenguaje y Comunicación empieza enseguida, sin receso.") : "Cuando empieces correrá el reloj de esta parte.";
    const prog = f.used[f.part]>0;
    box.innerHTML=`<div class="card fxintro"><span class="fxh">${P.n}</span><h2>${P.d}</h2><p>${msg}</p><p class="mut">${n} reactivos · ${fmtH(lim)} disponibles${prog? " · llevas "+fmtH(Math.round(f.used[f.part]))+" usados":""}</p>
    <div class="row"><button class="btn pri big" id="fxGo">${prog?"Continuar":"Empezar "+P.d.toLowerCase()}</button><button class="btn ghost" id="fxAbort">Abandonar este examen</button></div></div>`;
    $("#fxGo").onclick=()=>{ f.phase="run"; save(); fxRun(); fxRender(); };
    fxAbortBtn();
    return;
  }
  fxRun(); fxRender();
}
function fxAbortBtn(){ const a=$("#fxAbort"); if(a) a.onclick=()=>{ if(a.dataset.sure){ fxPause(); S.fx=null; save(); fxSetup(); } else { a.dataset.sure=1; a.textContent="¿Seguro? Se pierde el avance. Pulsa otra vez"; } }; }
function fxRender(){
  const f=S.fx, ids=f.ids[f.part], qi=ids[f.i], q=Q[qi], ord=f.ord[qi], ch=f.ans[qi];
  const answered=ids.filter(i=>f.ans[i]!==undefined).length;
  const dots=ids.map((id,k)=>`<span class="pd ${f.ans[id]!==undefined?"b":""} ${k===f.i?"cur":""} ${f.flag[id]?"fl":""}" data-k="${k}"></span>`).join("");
  $("#fxBox").innerHTML=`<div class="simtop"><span class="fxh">${FX_PARTS[f.part].n} · ${FX_PARTS[f.part].d}</span><span class="mut">Reactivo ${f.i+1} de ${ids.length} · ${answered} respondidos</span><span class="clock" id="fxClock">${fmtH(fxLeft())}</span><button class="lnk" id="fxFlag">${f.flag[qi]?"Marcado":"Marcar"}</button></div>
  <div class="pdots fxdots" id="fxDots">${dots}</div>
  <div class="card q">${ctxHTML(q)}<p class="qt">${esc(q.q)}</p>
  <div class="opts">${ord.map((oi,k)=>`<button class="opt ${ch===oi?"sel":""}" data-oi="${oi}"><span class="ol">${"ABC"[k]}</span><span>${esc(q.o[oi])}</span></button>`).join("")}</div></div>
  <div class="row nav2"><button class="btn" id="fxPrev" ${f.i===0?"disabled":""}>← Anterior</button><button class="btn pri" id="fxNext">${f.i===ids.length-1?"Revisar y cerrar":"Siguiente →"}</button><button class="btn ghost" id="fxStop">Pausar y guardar</button></div>`;
  strikeUI($("#fxBox"), f, qi, false, ()=>{ save(); fxRender(); });
  $$("#fxBox .opt").forEach(b=>b.onclick=()=>{ f.ans[qi]=+b.dataset.oi; save(); fxRender(); });
  const goTo=k=>{ fxFlush(); f.i=k; save(); fxRender(); window.scrollTo(0,0); };
  $("#fxPrev").onclick=()=>goTo(f.i-1);
  $("#fxNext").onclick=()=>{ if(f.i<ids.length-1) goTo(f.i+1); else fxReview(); };
  $("#fxFlag").onclick=()=>{ f.flag[qi]=!f.flag[qi]; save(); fxRender(); };
  $("#fxDots").onclick=e=>{ const d=e.target.closest("[data-k]"); if(d) goTo(+d.dataset.k); };
  $("#fxStop").onclick=()=>{ fxPause(); f.phase="intro"; save(); fxSetup(); toast("Avance guardado"); };
}
function fxReview(){
  fxFlush();
  const f=S.fx, ids=f.ids[f.part];
  const blank=ids.map((id,k)=>[id,k]).filter(x=>f.ans[x[0]]===undefined), fl=ids.map((id,k)=>[id,k]).filter(x=>f.flag[x[0]]);
  const chips=(arr)=>arr.map(x=>`<button class="chip" data-k="${x[1]}">${x[1]+1}</button>`).join("");
  $("#fxBox").innerHTML=`<div class="card"><h2>Antes de cerrar ${FX_PARTS[f.part].d.toLowerCase()}</h2><p class="mut">Te quedan ${fmtH(fxLeft())}. Una vez cerrada no podrás regresar a esta parte.</p>
  ${blank.length?`<h3>Sin responder (${blank.length})</h3><p class="mut">En el CENEVAL no hay penalización por error: nunca dejes un reactivo en blanco.</p><div class="chips" id="fxJ1">${chips(blank)}</div>`:`<p>Respondiste todos los reactivos.</p>`}
  ${fl.length?`<h3>Marcados (${fl.length})</h3><div class="chips" id="fxJ2">${chips(fl)}</div>`:""}
  <div class="row"><button class="btn" id="fxBack">Seguir revisando</button><button class="btn pri" id="fxClose">Cerrar esta parte</button></div></div>`;
  $$("#fxBox [data-k]").forEach(b=>b.onclick=()=>{ f.i=+b.dataset.k; save(); fxRender(); });
  $("#fxBack").onclick=()=>fxRender();
  $("#fxClose").onclick=()=>fxEndPart(false);
}
function fxEndPart(timeout){
  fxPause(); const f=S.fx;
  if(timeout) toast("Se acabó el tiempo de esta parte");
  const nx={s1:"s2a",s2a:"s2b",s2b:null}[f.part];
  if(nx){ f.part=nx; f.i=0; f.phase="break"; save(); fxSetup(); window.scrollTo(0,0); return; }
  f.phase="done"; f.finished=today();
  const all=[...f.ids.s1,...f.ids.s2a,...f.ids.s2b];
  all.forEach(qi=>{ record(qi, f.ans[qi]===Q[qi].c); });
  const dis=[...f.ids.s1,...f.ids.s2a], okD=dis.filter(qi=>f.ans[qi]===Q[qi].c).length;
  S.hist.push({d:today(), lab:"Examen completo", p:Math.round(okD/dis.length*100), n:all.length}); if(S.hist.length>60) S.hist=S.hist.slice(-60);
  save(); fxResults(); window.scrollTo(0,0);
}
function fxResults(){
  const f=S.fx, dis=[...f.ids.s1,...f.ids.s2a], len=f.ids.s2b, all=[...dis,...len];
  const ok=qi=>f.ans[qi]===Q[qi].c;
  const pct=a=>a.length? Math.round(a.filter(ok).length/a.length*100):0;
  const byA={}; dis.forEach(qi=>{ const a=Q[qi].a; (byA[a]=byA[a]||[]).push(qi); });
  const bySub={}; dis.forEach(qi=>{ const s=subOf(qi); (bySub[s]=bySub[s]||[]).push(qi); });
  const rate=p=>{ const ids=f.ids[p]; return f.used[p]/60/ids.length; };
  const slow=all.filter(qi=>f.tq[qi]).sort((a,b)=>f.tq[b]-f.tq[a]).slice(0,6);
  const bad=all.filter(qi=>!ok(qi));
  const weakSub=Object.keys(bySub).sort((a,b)=>pct(bySub[a])-pct(bySub[b])).slice(0,3);
  const bar=(lab,ids,cls)=>{ const p=pct(ids); return `<div class="abar"><div class="aname">${cls?`<span class="dot ${cls}"></span>`:""}${lab}</div><div class="track"><div class="fill ${cls?"f"+cls:""}" style="width:${p}%"></div></div><div class="apct">${p}%<small>${ids.filter(ok).length}/${ids.length}</small></div></div>`; };
  $("#fxBox").innerHTML=`<div class="card res fxres"><div class="ring" style="--p:${pct(dis)}"><span>${pct(dis)}%</span></div><div><span class="fxh">Examen completo · ${f.finished||""}</span><h2>Sección disciplinar: ${dis.filter(ok).length} de ${dis.length}</h2><p>Lenguaje y Comunicación: ${len.filter(ok).length} de ${len.length} (${pct(len)}%)</p><p class="mut">Estos porcentajes miden tu práctica: el CENEVAL convierte los aciertos a su índice de 700 a 1,300 con puntos de corte que no publica.</p>
  <div class="row"><button class="btn pri" id="fxAgain">Nuevo examen completo</button>${bad.length?`<button class="btn" id="fxBad">Practicar mis ${bad.length} errores</button>`:""}</div></div></div>
  <div class="hero"><div class="card"><h3>Por área</h3>${[1,2,3,4].map(a=>bar(esc(AREAS[a]),byA[a]||[],"a"+a)).join("")}${bar("Lenguaje",len,"a5")}</div>
  <div class="card"><h3>Ritmo</h3><table class="fxt"><tr><th>Parte</th><th>Usaste</th><th>Por reactivo</th><th>Disponible</th></tr>
  ${["s1","s2a","s2b"].map(p=>`<tr><td>${FX_PARTS[p].d}</td><td>${fmtH(Math.round(f.used[p]))}</td><td class="${rate(p)>f.lim[p]/60/f.ids[p].length?"bad":""}">${rate(p).toFixed(1)} min</td><td>${(f.lim[p]/60/f.ids[p].length).toFixed(1)} min</td></tr>`).join("")}</table>
  <p class="mut">Sin responder: ${all.filter(qi=>f.ans[qi]===undefined).length} · Marcados: ${all.filter(qi=>f.flag[qi]).length}</p>
  ${slow.length?`<h3 style="margin-top:16px">Donde más tardaste</h3>${slow.map(qi=>`<div class="slow"><span class="mono">${(f.tq[qi]/60).toFixed(1)} min</span><span class="${ok(qi)?"okt":"badt"}">${ok(qi)?"Bien":"Mal"}</span><span>${esc(Q[qi].q.slice(0,70))}…</span></div>`).join("")}`:""}</div></div>
  <div class="card subc"><h3>Por subárea (como la guía oficial)</h3><p class="mut">Prioriza estas tres: ${weakSub.map(s=>`<b>${s} ${esc(SUBT[s])}</b>`).join(", ")}.</p>${Object.keys(SUBN).map(s=>bar(s+" "+esc(SUBT[s]),bySub[s]||[],"a"+s[0])).join("")}</div>
  ${descCard(f, all)}
  ${bad.length?`<div class="card"><h3>Revisa tus errores</h3>${bad.map(qi=>{ const q=Q[qi], a=f.ans[qi]; return `<div class="rev"><span class="tag a${q.a}">${esc(q.a<5?subOf(qi)+" "+SUBT[subOf(qi)]:"Lenguaje")}</span>${ctxHTML(q,1)}<p class="qt sm">${advTag(q)}${esc(q.q)}</p>${a!==undefined?`<p class="wr">Elegiste: ${esc(q.o[a])}</p><p class="why"><b>Por qué no:</b> ${esc(W[qi][a-1]||"")}</p>`:`<p class="wr">Sin responder</p>`}<p class="rt">Correcta: ${esc(q.o[q.c])}</p><p class="mut"><b>Por qué sí:</b> ${esc(q.e)}</p>${lessonBtn(qi)}</div>`; }).join("")}</div>`:""}`;
  $("#fxAgain").onclick=()=>{ S.fx=null; save(); fxSetup(); };
  const b=$("#fxBad"); if(b) b.onclick=()=>{ go("simulacro"); simCfg.inst=true; simStart(bad); };
}
window.addEventListener("beforeunload", ()=>{ try{ fxPause(); }catch(e){} });
document.addEventListener("visibilitychange", ()=>{ if(document.hidden && fxT0) fxFlush(); });
document.addEventListener("keydown", e=>{ if(e.target.matches("input,select,textarea")) return; if(!$("#v-examen.on")||!S.fx||S.fx.phase!=="run"||!$("#fxNext")) return; const k=e.key.toLowerCase(), m={"1":0,"2":1,"3":2,"a":0,"b":1,"c":2}; if(k in m){ const o=$$("#fxBox .opt")[m[k]]; o&&o.click(); } if(k==="arrowright"||k==="enter") $("#fxNext").click(); if(k==="arrowleft"){ const p=$("#fxPrev"); p&&!p.disabled&&p.click(); } if(k==="f") $("#fxFlag").click(); });

// ===================== Rutas nuevas =====================
const NEWV={examen:fxSetup};
const _go6=go;
go=function(v){ if(S.fx && fxT0 && v!=="examen") fxPause(); _go6(v); if(NEWV[v]) NEWV[v](); };
