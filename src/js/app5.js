// ================= Ronda relámpago (sin puntajes, con pregunta explícita) =================
const RAYO_Q = {"Patrones GoF":"¿Qué patrón de diseño resuelve esta situación?","SOLID":"¿Qué principio SOLID describe o se viola aquí?","Diagramas UML":"¿Qué diagrama UML usarías para mostrar esto?","Elicitación":"¿Qué técnica de elicitación conviene en este caso?","Factibilidad":"¿Qué tipo de factibilidad está en riesgo?","Tipos de prueba":"¿Qué tipo de prueba es?","Mantenimiento":"¿Qué tipo de mantenimiento es?","Riesgos":"¿Qué estrategia de respuesta al riesgo es?","ISO 25010":"¿Qué característica de calidad de ISO 25010 corresponde?","Nielsen":"¿Qué heurística de usabilidad de Nielsen aplica?","Implantación":"¿Qué estrategia de implantación es?","Scrum":"¿Qué rol o evento de Scrum corresponde?","NoSQL y datos":"¿Qué tipo de base de datos o de dato corresponde?","Estructuras":"¿Qué estructura de datos conviene?"};
function rayoSetup(){
  clearInterval(window._ry);
  const cats=["Mezcla",...Object.keys(RAYO)];
  $("#rayoBox").innerHTML = `<div class="card setup"><h2>Ronda relámpago</h2><p class="mut">Durante 60 segundos ves situaciones cortas, cada una con su pregunta (por ejemplo, “¿Qué patrón de diseño resuelve esta situación?”), y eliges el concepto correcto entre cuatro. Sirve para entrenar la identificación rápida que pide el examen: leer el caso y reconocer el concepto en menos de 90 segundos. Al final ves cuáles fallaste.</p>
  <label>Tema</label><div class="chips" id="rC">${cats.map(c=>`<button class="chip ${rayoCat===c?'on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
  <button class="btn pri big" id="rGo">Empezar</button></div>`;
  $("#rC").onclick=e=>{ const b=e.target.closest("[data-c]"); if(b){ rayoCat=b.dataset.c; $$("#rC .chip").forEach(x=>x.classList.toggle("on",x===b)); } };
  $("#rGo").onclick=rayoStart;
}
function rayoStart(){ rayo={items:rayoItems(), i:0, hits:0, miss:0, missed:[], end:Date.now()+60000}; clearInterval(window._ry); window._ry=setInterval(()=>{ const l=Math.max(0,Math.ceil((rayo.end-Date.now())/1000)); const el=$("#rT"); if(el){ el.textContent=l; el.parentElement.style.setProperty("--t", l/60); } if(l<=0) rayoEnd(); },200); rayoRender(); }
function rayoRender(){
  if(rayo.i>=rayo.items.length){ rayo.items=rayo.items.concat(rayoItems()); }
  const it=rayo.items[rayo.i]; const pool=[...new Set(RAYO[it.c].map(x=>x[1]))].filter(x=>x!==it.r);
  const opts=shuffle([it.r,...shuffle(pool).slice(0,3)]);
  $("#rayoBox").innerHTML = `<div class="rayohud"><div class="timer"><span id="rT">${Math.max(0,Math.ceil((rayo.end-Date.now())/1000))}</span></div><div class="rcount"><span>Aciertos <b>${rayo.hits}</b></span><span>Errores <b>${rayo.miss}</b></span></div><button class="btn ghost" id="rStop" style="margin-left:auto">Terminar</button></div>
  <div class="card q rayo"><span class="tag">${esc(it.c)}</span><p class="rq">${esc(RAYO_Q[it.c]||"¿Qué concepto corresponde?")}</p><div class="sit"><span class="mut">Situación:</span> ${esc(it.s)}</div><div class="rgrid">${opts.map((o,k)=>`<button class="ropt" data-o="${esc(o)}"><kbd>${k+1}</kbd>${esc(o)}</button>`).join("")}</div></div>`;
  $$(".ropt").forEach(b=>b.onclick=()=>rayoPick(b, b.dataset.o===it.r));
  $("#rStop").onclick=rayoEnd;
}
function rayoPick(b, ok){
  if(rayo.lock) return; rayo.lock=true;
  const it=rayo.items[rayo.i];
  if(ok){ rayo.hits++; b.classList.add("right"); }
  else { rayo.miss++; b.classList.add("wrong"); $$(".ropt").forEach(x=>{ if(x.dataset.o===it.r) x.classList.add("right"); }); rayo.missed.push({c:it.c, s:it.s, r:it.r, y:b.dataset.o}); }
  setTimeout(()=>{ rayo.lock=false; rayo.i++; if(Date.now()<rayo.end && !rayo.over) rayoRender(); }, ok?300:1300);
}
function rayoEnd(){
  clearInterval(window._ry); if(!rayo||rayo.over) return; rayo.over=true; bump("r"); touchDay(); save();
  const ms=rayo.missed, tot=rayo.hits+rayo.miss;
  $("#rayoBox").innerHTML = `<div class="card center res2"><h2>Fin de la ronda</h2><p>${rayo.hits} de ${tot} correctas en el tema ${esc(rayoCat)}.</p><div class="row center"><button class="btn pri" id="rAg">Otra ronda</button><button class="btn" id="rCh">Cambiar tema</button></div></div>
  ${ms.length?`<div class="card"><h3>Repasa los que fallaste</h3>${ms.map(m=>`<div class="mrow2"><p class="mut sm">${esc(RAYO_Q[m.c]||"")}</p><p><b>Situación:</b> ${esc(m.s)}</p><p><span class="wr">Elegiste: ${esc(m.y)}</span> · <span class="rt">Correcta: ${esc(m.r)}</span></p></div>`).join("")}</div>`:""}`;
  $("#rAg").onclick=rayoStart; $("#rCh").onclick=rayoSetup;
}
