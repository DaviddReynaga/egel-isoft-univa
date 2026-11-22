// ================= Retroalimentación: por qué sí / por qué no =================
function lessonOf(qi){ return LESSONS.find(l=>l.id===Q2L[qi]); }
function lessonBtn(qi){ const L=lessonOf(qi); return L? `<button class="lessonlink" onclick="openLesson('${L.id}')">Estudiar este tema: ${esc(L.t)} →</button>` : ""; }
function fbHTML(qi, chosen){
  const q=Q[qi], ok=chosen===q.c;
  if(!ok) return `<div class="fb bad"><div class="fbh">No era esa.</div>
    <p><b>Por qué no es “${esc(q.o[chosen])}”:</b> ${esc(W[qi][chosen-1])}</p>
    <p><b>La correcta es “${esc(q.o[q.c])}”:</b> ${esc(q.e)}</p>${lessonBtn(qi)}</div>`;
  return `<div class="fb good"><div class="fbh">¡Correcto!</div><p>${esc(q.e)}</p>
    <details><summary>¿Por qué las otras opciones no?</summary><ul>${[1,2].map(k=>`<li><b>${esc(q.o[k])}:</b> ${esc(W[qi][k-1])}</li>`).join("")}</ul></details>${lessonBtn(qi)}</div>`;
}

// ================= Aprender =================
let curLesson=null, learnHide=false, learnTab="temas";
function openLesson(id){ curLesson=id; learnTab="temas"; go("aprender"); }
function lessonStats(L){ let ok=0,tot=0,seen=0; L.q.forEach(i=>{ const s=(S.qs||{})[i]; if(s&&s.tot){ seen++; ok+=s.ok; tot+=s.tot; } }); return {pct: tot? Math.round(ok/tot*100):null, seen, n:L.q.length}; }
function learnSetup(){
  const B=$("#learnBox");
  const tabs=`<div class="chips"><button class="chip ${learnTab==='temas'?'on':''}" data-lt="temas">Temario por subárea</button><button class="chip ${learnTab==='glosario'?'on':''}" data-lt="glosario">Glosario de términos</button></div>`;
  if(learnTab==="glosario"){ B.innerHTML = `<h1>Glosario</h1><p class="mut">Todos los términos del temario en un solo lugar. Escribe para filtrar; toca un término para ir a su lección.</p>${tabs}<input id="glq" class="search" placeholder="Busca: “Liskov”, “HAVING”, “regresión”, “queísmo”…"><div id="glList" class="gl"></div>`; bindTabs();
    const all=[]; LESSONS.forEach(L=>L.c.forEach(c=>all.push({t:c[0],d:c[1],L})));
    const norm=x=>x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
    const draw=()=>{ const q=norm($("#glq").value||""); const f=all.filter(x=>!q||norm(x.t+" "+x.d).includes(q)).sort((a,b)=>a.t.localeCompare(b.t,"es")); $("#glList").innerHTML = `<p class="mut">${f.length} términos</p>`+f.map(x=>`<div class="glrow"><div><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div><button class="tag a${x.L.a}" onclick="openLesson('${x.L.id}')">${esc(x.L.t)}</button></div>`).join(""); };
    $("#glq").oninput=draw; draw(); return; }
  if(!curLesson){
    B.innerHTML = `<h1>Aprender</h1><p class="mut">El temario completo, organizado por las subáreas oficiales del examen. Lee la lección, prueba tu memoria ocultando las definiciones y luego practica solo ese tema. El porcentaje de cada tema sale de tus respuestas.</p>${tabs}
    ${[1,2,3,4,5].map(a=>`<h3 class="ah"><span class="dot a${a}"></span>${a<5?"Área "+a+" · ":""}${esc(AREAS[a])}</h3><div class="lgrid">${LESSONS.filter(L=>L.a===a).map(L=>{ const st=lessonStats(L), read=(S.read||{})[L.id]; return `<button class="lcard" onclick="openLesson('${L.id}')"><span class="lsub">${esc(L.sub)}</span><b>${esc(L.t)}</b><span class="lmeta">${L.c.length} conceptos · ${L.q.length} reactivos</span><div class="lfoot"><span class="lst ${read?'on':''}">${read?"Estudiada":"Sin estudiar"}</span><span class="lpct ${st.pct==null?'':st.pct>=75?'top':st.pct>=65?'ok':'low'}">${st.pct==null?"—":st.pct+"%"}</span></div></button>`; }).join("")}</div>`).join("")}`;
    bindTabs(); return; }
  const L=LESSONS.find(x=>x.id===curLesson), st=lessonStats(L), idx=LESSONS.indexOf(L), read=(S.read||{})[L.id];
  const errs=L.q.filter(i=>S.wrong[i]);
  B.innerHTML = `<button class="lnk" id="lBack">← Todo el temario</button>
  <div class="lhead"><span class="tag a${L.a}">${esc(AREAS[L.a])}</span><span class="mut">${esc(L.sub)}</span></div>
  <h1>${esc(L.t)}</h1><p class="idea">${esc(L.idea)}</p>
  <div class="row" style="margin-top:4px"><button class="btn pri" id="lPrac">Practicar este tema (${L.q.length} reactivos)</button>${errs.length?`<button class="btn bad" id="lErr">Repetir mis ${errs.length} errores de este tema</button>`:""}<button class="chip ${learnHide?'on':''}" id="lHide">Modo autoevaluación: ocultar definiciones</button></div>
  <div class="card"><h3>Conceptos clave</h3><div class="concepts">${L.c.map(c=>`<div class="concept"><b>${esc(c[0])}</b><p class="${learnHide?'hidden':''}">${esc(c[1])}</p></div>`).join("")}</div></div>
  <div class="hero"><div class="card"><h3>Palabras gatillo</h3><ul class="gl2">${L.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
  <div class="card warnc"><h3>Trampas del CENEVAL en este tema</h3><ul class="gl2">${L.tr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div>
  <div class="card"><h3>Tu avance en este tema</h3><p>${st.seen? `Has respondido ${st.seen} de ${st.n} reactivos del tema, con <b class="${st.pct>=75?'top':st.pct>=65?'ok':'low'}">${st.pct}%</b> de aciertos.` : "Aún no respondes reactivos de este tema."} ${errs.length?`Tienes ${errs.length} pendientes en tu lista de errores.`:""}</p>
  <div class="row"><button class="btn ${read?'':'pri'}" id="lRead">${read?"Estudiada · quitar marca":"Marcar como estudiada"}</button>${idx>0?`<button class="btn ghost" id="lPrev">← ${esc(LESSONS[idx-1].t)}</button>`:""}${idx<LESSONS.length-1?`<button class="btn ghost" id="lNext">${esc(LESSONS[idx+1].t)} →</button>`:""}</div></div>`;
  $("#lBack").onclick=()=>{ curLesson=null; learnSetup(); };
  $("#lPrac").onclick=()=>{ go("simulacro"); simCfg.inst=true; simCfg.prop=0; simStart(L.q.slice()); sim.label="Tema: "+L.t; };
  const e=$("#lErr"); if(e) e.onclick=()=>{ go("simulacro"); simCfg.inst=true; simStart(errs); sim.label="Errores: "+L.t; };
  $("#lHide").onclick=()=>{ learnHide=!learnHide; learnSetup(); };
  $$(".concept").forEach(c=>c.onclick=()=>{ const p=c.querySelector("p"); p.classList.toggle("hidden"); });
  $("#lRead").onclick=()=>{ S.read=S.read||{}; S.read[L.id]=!S.read[L.id]; if(S.read[L.id]) addXP(15); save(); learnSetup(); };
  const p=$("#lPrev"); if(p) p.onclick=()=>{ curLesson=LESSONS[idx-1].id; learnSetup(); window.scrollTo(0,0); };
  const n=$("#lNext"); if(n) n.onclick=()=>{ curLesson=LESSONS[idx+1].id; learnSetup(); window.scrollTo(0,0); };
  bindTabs();
}
function bindTabs(){ $$("[data-lt]").forEach(b=>b.onclick=()=>{ learnTab=b.dataset.lt; curLesson=null; learnSetup(); }); }

// ================= Errores agrupados por tema =================
function renderErr(){
  const ids=Object.keys(S.wrong).map(Number);
  if(!ids.length){ $("#errBox").innerHTML=`<div class="card center"><h2>Sin errores pendientes</h2><p class="mut">Cuando falles un reactivo aparecerá aquí, agrupado por tema y con la lección donde se explica.</p><button class="btn pri" data-v="simulacro">Ir al simulacro</button></div>`; return; }
  const groups={}; ids.forEach(i=>{ const id=Q2L[i]; (groups[id]=groups[id]||[]).push(i); });
  const order=Object.keys(groups).sort((a,b)=>groups[b].length-groups[a].length);
  $("#errBox").innerHTML = `<div class="row" style="margin-top:0"><button class="btn pri" id="eGo">${ids.length===1?"Practicar mi error":"Practicar mis "+ids.length+" errores"}</button><button class="btn ghost" id="eClr">Vaciar lista</button></div>
  <p class="mut">Cada error está agrupado en su tema. Lee por qué te equivocaste, repasa la lección y vuelve a intentarlo: cuando aciertas un reactivo, su contador baja y al llegar a cero sale de la lista.</p>
  ${order.map(id=>{ const L=LESSONS.find(x=>x.id===id); const list=groups[id].sort((a,b)=>S.wrong[b]-S.wrong[a]); return `<div class="card egroup"><div class="eghead"><div><span class="tag a${L.a}">${esc(AREAS[L.a])}</span> <b>${esc(L.t)}</b> <span class="mut">· ${list.length} ${list.length===1?"error":"errores"}</span></div><div class="row" style="margin:0"><button class="btn" onclick="openLesson('${L.id}')">Estudiar la lección</button><button class="btn ghost" data-eg="${id}">Practicar estos</button></div></div>
    ${list.map(qi=>{ const q=Q[qi]; return `<div class="rev"><span class="cnt">falla ×${S.wrong[qi]}</span>${ctxHTML(q,1)}<p class="qt sm">${advTag(q)}${esc(q.q)}</p><details><summary>Ver por qué</summary><p class="rt">Correcta: ${esc(q.o[q.c])}</p><p class="mut">${esc(q.e)}</p><ul class="whyl">${[1,2].map(k=>`<li><b>${esc(q.o[k])}:</b> ${esc(W[qi][k-1])}</li>`).join("")}</ul></details></div>`; }).join("")}</div>`; }).join("")}`;
  $("#eGo").onclick=()=>{ go("simulacro"); simCfg.inst=true; simStart(ids); };
  $$("[data-eg]").forEach(b=>b.onclick=()=>{ go("simulacro"); simCfg.inst=true; simStart(groups[b.dataset.eg]); });
  const c=$("#eClr"); c.onclick=()=>{ if(c.dataset.sure){ S.wrong={}; save(); renderErr(); } else { c.dataset.sure=1; c.textContent="¿Seguro? Pulsa otra vez"; } };
}

// ================= Bienvenida =================
const _rh2 = renderHome;
renderHome = function(){
  _rh2();
  const w=$("#welcome"); if(!w) return;
  if(S.hideWelcome){ w.innerHTML=""; return; }
  w.innerHTML = `<div class="card welcome"><div><h3>¿Primera vez aquí? Así se usa la Arena</h3>
  <ol><li><b>Aprende</b> un tema en <a href="#aprender" data-v="aprender">Aprender</a>: conceptos, palabras gatillo y trampas.</li><li><b>Practica</b> ese tema con el simulacro, el clasificador o la ronda relámpago.</li><li><b>Revisa por qué fallaste</b>: cada error te dice por qué tu opción estaba mal y te lleva a su lección.</li><li><b>Repite</b> tus errores hasta que salgan de la lista, y cierra con exámenes modelo cronometrados.</li></ol></div><button class="btn ghost" id="wX">Entendido</button></div>`;
  $("#wX").onclick=()=>{ S.hideWelcome=1; save(); w.innerHTML=""; };
};
