// ================= Aprender (versión narrativa) =================
let lqAns={}, lqOrd={}, lqPick={};
function learnSetup(){
  const B=$("#learnBox");
  const tabs=`<div class="chips"><button class="chip ${learnTab==='temas'?'on':''}" data-lt="temas">Temario por subárea</button><button class="chip ${learnTab==='glosario'?'on':''}" data-lt="glosario">Glosario de términos</button></div>`;
  if(learnTab==="glosario"){ B.innerHTML = `<h1>Glosario</h1><p class="mut">Todos los términos del temario en un solo lugar. Escribe para filtrar; toca la etiqueta para ir a la lección donde se explica con ejemplos.</p>${tabs}<input id="glq" class="search" placeholder="Busca: “Liskov”, “HAVING”, “regresión”, “queísmo”…"><div id="glList" class="gl"></div>`; bindTabs();
    const all=[]; LESSONS.forEach(L=>L.c.forEach(c=>all.push({t:c[0],d:c[1],L})));
    const norm=x=>x.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
    const draw=()=>{ const q=norm($("#glq").value||""); const f=all.filter(x=>!q||norm(x.t+" "+x.d).includes(q)).sort((a,b)=>a.t.localeCompare(b.t,"es")); $("#glList").innerHTML = `<p class="mut">${f.length} términos</p>`+f.map(x=>`<div class="glrow"><div><b>${esc(x.t)}</b><p>${esc(x.d)}</p></div><button class="tag a${x.L.a}" onclick="openLesson('${x.L.id}')">${esc(x.L.t)}</button></div>`).join(""); };
    $("#glq").oninput=draw; draw(); return; }
  if(!curLesson){
    B.innerHTML = `<h1>Aprender</h1><p class="mut">Cada lección empieza con un caso real, explica el tema paso a paso con diagramas, te muestra cómo lo pregunta el CENEVAL y cierra con un mini examen. Está organizado por las subáreas oficiales.</p>${tabs}
    ${[1,2,3,4,5].map(a=>`<h3 class="ah"><span class="dot a${a}"></span>${a<5?"Área "+a+" · ":""}${esc(AREAS[a])}</h3><div class="lgrid">${LESSONS.filter(L=>L.a===a).map(L=>{ const st=lessonStats(L), read=(S.read||{})[L.id], lb=LB[L.id]; return `<button class="lcard" onclick="openLesson('${L.id}')"><span class="lsub">${esc(L.sub)}</span><b>${esc(L.t)}</b><span class="lmeta">${lb?lb.s.length+" secciones · ":""}${(lb&&(lb.ej+lb.s.map(x=>x[1]).join("")).split("<figure").length-1)||0} diagramas · ${L.q.length} reactivos</span><div class="lfoot"><span class="lst ${read?'on':''}">${read?"Estudiada":"Sin estudiar"}</span><span class="lpct ${st.pct==null?'':st.pct>=75?'top':st.pct>=65?'ok':'low'}">${st.pct==null?"—":st.pct+"%"}</span></div></button>`; }).join("")}</div>`).join("")}`;
    bindTabs(); return; }
  const L=LESSONS.find(x=>x.id===curLesson), lb=LB[L.id]||{ej:"",s:[]}, st=lessonStats(L), idx=LESSONS.indexOf(L), read=(S.read||{})[L.id];
  const errs=L.q.filter(i=>S.wrong[i]);
  if(!lqPick[L.id]) lqPick[L.id]=pickFresh(L.q).slice(0,3);
  const quiz=lqPick[L.id];
  const secs=[["ej","Empecemos con un caso"]].concat(lb.s.map((x,i)=>["s"+i,x[0]])).concat([["cen","Cómo lo pregunta el CENEVAL"],["quiz","Comprueba lo que aprendiste"],["res","Resumen para repasar"]]);
  B.innerHTML = `<button class="lnk" id="lBack">← Todo el temario</button>
  <div class="lesson">
  <aside class="toc"><div class="tocin"><b>En esta lección</b>${secs.map((x,i)=>`<button data-go="${x[0]}"><span>${i+1}</span>${esc(x[1])}</button>`).join("")}</div></aside>
  <article class="lbody">
  <div class="lhead"><span class="tag a${L.a}">${esc(AREAS[L.a])}</span><span class="mut">${esc(L.sub)}</span></div>
  <h1>${esc(L.t)}</h1><p class="idea">${esc(L.idea)}</p>
  <section class="ls case" id="sec-ej"><div class="kicker">Empecemos con un caso</div>${lb.ej}</section>
  ${lb.s.map((x,i)=>`<section class="ls" id="sec-s${i}"><h2>${esc(x[0])}</h2>${x[1]}</section>`).join("")}
  <section class="ls" id="sec-cen"><h2>Cómo lo pregunta el CENEVAL</h2><div class="hero"><div class="card"><h3>Si el reactivo dice… → piensa en…</h3><ul class="gl2">${L.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div><div class="card warnc"><h3>Trampas frecuentes</h3><ul class="gl2">${L.tr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></div></section>
  <section class="ls" id="sec-quiz"><h2>Comprueba lo que aprendiste</h2><p class="mut">Tres reactivos del tema. Cuentan para tu avance.</p>${quiz.map((qi,k)=>{ const q=Q[qi], a=lqAns[qi]; const ord=lqOrd[qi]||(lqOrd[qi]=shuffle([0,1,2])); return `<div class="card q sm">${ctxHTML(q,1)}<p class="qt sm"><b>${k+1}.</b> ${advTag(q)}${esc(q.q)}</p><div class="opts">${ord.map((oi,j)=>{ let cls=""; if(a!==undefined){ if(oi===q.c) cls="right"; else if(oi===a) cls="wrong"; } return `<button class="opt lq ${cls}" data-qi="${qi}" data-oi="${oi}" ${a!==undefined?"disabled":""}><span class="ol">${"ABC"[j]}</span><span>${esc(q.o[oi])}</span></button>`; }).join("")}</div>${a!==undefined?fbHTML(qi,a).replace(/<button class="lessonlink"[^]*?<\/button>/,""):""}</div>`; }).join("")}
  <div class="row"><button class="btn pri" id="lPrac">Practicar todo el tema (${L.q.length} reactivos)</button>${errs.length?`<button class="btn bad" id="lErr">${errs.length===1?"Repetir mi error del tema":"Repetir mis "+errs.length+" errores del tema"}</button>`:""}<button class="btn ghost" id="lNewQ">Otras 3 preguntas</button></div></section>
  <section class="ls" id="sec-res"><details class="sum"><summary>Resumen para repasar: ${L.c.length} conceptos clave</summary><div class="row" style="margin:6px 0 12px"><button class="chip ${learnHide?'on':''}" id="lHide">Autoevaluación: ocultar definiciones</button><span class="mut">Toca un concepto para mostrar u ocultar su definición.</span></div><div class="concepts">${L.c.map(c=>`<div class="concept"><b>${esc(c[0])}</b><p class="${learnHide?'hidden':''}">${esc(c[1])}</p></div>`).join("")}</div></details></section>
  <div class="card"><h3>Tu avance en este tema</h3><p>${st.seen? `Has respondido ${st.seen} de ${st.n} reactivos del tema, con <b class="${st.pct>=75?'top':st.pct>=65?'ok':'low'}">${st.pct}%</b> de aciertos.` : "Aún no respondes reactivos de este tema."}</p>
  <div class="row"><button class="btn ${read?'':'pri'}" id="lRead">${read?"Estudiada · quitar marca":"Marcar como estudiada"}</button>${idx>0?`<button class="btn ghost" id="lPrev">← ${esc(LESSONS[idx-1].t)}</button>`:""}${idx<LESSONS.length-1?`<button class="btn ghost" id="lNext">${esc(LESSONS[idx+1].t)} →</button>`:""}</div></div>
  </article></div>`;
  $("#lBack").onclick=()=>{ curLesson=null; learnSetup(); window.scrollTo(0,0); };
  $$("[data-go]").forEach(b=>b.onclick=()=>{ const el=$("#sec-"+b.dataset.go); if(el){ if(b.dataset.go==="res") el.querySelector("details").open=true; el.scrollIntoView({behavior:"smooth",block:"start"}); } });
  $$(".opt.lq").forEach(b=>b.onclick=()=>{ const qi=+b.dataset.qi, oi=+b.dataset.oi; if(lqAns[qi]!==undefined) return; lqAns[qi]=oi; const ok=oi===Q[qi].c; record(qi,ok); addXP(ok?10:2); const y=window.scrollY; learnSetup(); window.scrollTo(0,y); });
  $("#lNewQ").onclick=()=>{ const prev=lqPick[L.id]; prev.forEach(qi=>{ delete lqAns[qi]; delete lqOrd[qi]; }); const rest=L.q.filter(i=>!prev.includes(i)); lqPick[L.id]=shuffle(rest.length>=3?rest:L.q).slice(0,3); const y=window.scrollY; learnSetup(); window.scrollTo(0,y); };
  $("#lPrac").onclick=()=>{ go("simulacro"); simCfg.inst=true; simCfg.prop=0; simStart(L.q.slice()); sim.label="Tema: "+L.t; };
  const e=$("#lErr"); if(e) e.onclick=()=>{ go("simulacro"); simCfg.inst=true; simStart(errs); sim.label="Errores: "+L.t; };
  $("#lHide").onclick=e=>{ e.preventDefault(); learnHide=!learnHide; const y=window.scrollY; learnSetup(); $("#sec-res details").open=true; window.scrollTo(0,y); };
  $$(".concept").forEach(c=>c.onclick=()=>{ c.querySelector("p").classList.toggle("hidden"); });
  $("#lRead").onclick=()=>{ S.read=S.read||{}; S.read[L.id]=!S.read[L.id]; if(S.read[L.id]) addXP(15); save(); const y=window.scrollY; learnSetup(); window.scrollTo(0,y); };
  const p=$("#lPrev"); if(p) p.onclick=()=>{ curLesson=LESSONS[idx-1].id; learnSetup(); window.scrollTo(0,0); };
  const n=$("#lNext"); if(n) n.onclick=()=>{ curLesson=LESSONS[idx+1].id; learnSetup(); window.scrollTo(0,0); };
  bindTabs();
}
function openLesson(id){ curLesson=id; learnTab="temas"; go("aprender"); window.scrollTo(0,0); }
