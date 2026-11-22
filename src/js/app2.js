// ================= Traza de código =================
function trazaGen(){
  const t = rnd(0,5);
  if(t===0){ const x0=rnd(0,5), a=rnd(1,3), b=a+rnd(2,4), k=rnd(1,3); let x=x0, rows=[]; for(let i=a;i<=b;i++){ x+=i*k; rows.push(`i=${i} → x=${x}`); }
    return {q:"¿Cuánto vale x al terminar?", code:`x ← ${x0}\npara i desde ${a} hasta ${b} hacer\n    x ← x + i * ${k}\nfin para\nescribir x`, ans:x, sol:`Traza: ${rows.join(" · ")}<br>Resultado: <b>${x}</b>`}; }
  if(t===1){ const N=rnd(100,9999); let n=N, s=0, rows=[]; while(n>0){ s+=n%10; n=Math.floor(n/10); rows.push(`s=${s}, n=${n}`); }
    return {q:"¿Qué valor escribe el algoritmo?", code:`n ← ${N}\ns ← 0\nmientras n > 0 hacer\n    s ← s + (n mod 10)\n    n ← n div 10\nfin mientras\nescribir s`, ans:s, sol:`mod 10 toma el último dígito y div 10 lo quita: suma los dígitos.<br>${rows.join(" · ")}<br>Resultado: <b>${s}</b>`}; }
  if(t===2){ const n=rnd(3,6); let f=1, parts=[]; for(let i=n;i>=1;i--){ f*=i; parts.push(i); }
    return {q:`¿Qué devuelve f(${n})?`, code:`función f(n)\n    si n <= 1 entonces regresa 1\n    si no regresa n * f(n - 1)\nfin función`, ans:f, sol:`Expande la pila: f(${n}) = ${parts.join(" · ")} = <b>${f}</b> (es el factorial)`}; }
  if(t===3){ const n=rnd(8,20), m=rnd(2,4); const c=Math.floor(n/m);
    return {q:"¿Cuánto vale c al final?", code:`c ← 0\npara i desde 1 hasta ${n} hacer\n    si i mod ${m} = 0 entonces\n        c ← c + 1\n    fin si\nfin para`, ans:c, sol:`Cuenta los múltiplos de ${m} entre 1 y ${n}: ⌊${n}/${m}⌋ = <b>${c}</b>`}; }
  if(t===4){ const N=rnd(20,200); let x=1, c=0, rows=[]; while(x<N){ x*=2; c++; rows.push(`x=${x}, c=${c}`); }
    return {q:"¿Cuántas vueltas da el ciclo (valor final de c)?", code:`x ← 1\nc ← 0\nmientras x < ${N} hacer\n    x ← x * 2\n    c ← c + 1\nfin mientras`, ans:c, sol:`${rows.join(" · ")}<br>Resultado: <b>${c}</b>. Duplicar en cada vuelta da un número logarítmico de iteraciones: O(log n).`}; }
  const b=rnd(1,5), k=rnd(2,4), n=rnd(3,6); const v=b+k*n; let parts=[]; for(let i=n;i>=0;i--) parts.push(`f(${i})`);
  return {q:`¿Qué devuelve f(${n})?`, code:`función f(n)\n    si n = 0 entonces regresa ${b}\n    si no regresa f(n - 1) + ${k}\nfin función`, ans:v, sol:`Cada llamada suma ${k} hasta llegar al caso base f(0) = ${b}: ${b} + ${k}·${n} = <b>${v}</b>`};
}

// ================= Clasificador =================
let clas=null, clasIdx=0;
function clasSetup(){
  const set=CLASIF[clasIdx]; const items=shuffle(set.items).slice(0, Math.min(set.items.length, 12)).map((it,i)=>({id:i, t:it[0], c:it[1], at:-1}));
  clas={set, items, sel:null, checked:false};
  clasRender();
}
function clasRender(){
  const c=clas, set=c.set;
  $("#clasBox").innerHTML = `<div class="chips">${CLASIF.map((s,i)=>`<button class="chip ${i===clasIdx?'on':''}" data-ci="${i}">${esc(s.t)}</button>`).join("")}</div>
  <div class="card"><div class="row" style="margin-top:0"><span class="tag a${set.a}">${esc(AREAS[set.a])}</span><b>${esc(set.t)}</b><span class="mut">Toca una tarjeta y luego la columna donde va. También puedes arrastrarla.</span></div>
  <div class="pool" data-drop="-1">${c.items.filter(x=>x.at<0).map(x=>chipH(x)).join("") || `<span class="mut">Todo colocado. Pulsa “Revisar”.</span>`}</div>
  <div class="buckets" style="--n:${set.cats.length===5?5:Math.min(set.cats.length,4)}">${set.cats.map((cat,k)=>`<div class="bucket" data-drop="${k}"><div class="bh">${esc(cat)}</div>${c.items.filter(x=>x.at===k).map(x=>chipH(x)).join("")}</div>`).join("")}</div>
  <div class="row"><button class="btn pri" id="clChk" ${c.items.some(x=>x.at<0)&&!c.checked?"disabled":""}>Revisar</button><button class="btn ghost" id="clNew">Revolver otra vez</button><span id="clRes"></span></div></div>`;
  $$("[data-ci]").forEach(b=>b.onclick=()=>{ clasIdx=+b.dataset.ci; clasSetup(); });
  $$(".dchip").forEach(el=>{ el.onclick=e=>{ e.stopPropagation(); if(c.checked) return; const id=+el.dataset.id, zone=+el.closest("[data-drop]").dataset.drop; if(c.sel!=null && c.sel!==id && c.items[id].at!==c.items[c.sel].at){ c.items[c.sel].at=zone; c.sel=null; } else c.sel = c.sel===id? null : id; clasRender(); }; el.ondragstart=e=>{ e.dataTransfer.setData("text", el.dataset.id); }; });
  $$("[data-drop]").forEach(z=>{ z.onclick=()=>{ if(c.sel==null||c.checked) return; c.items[c.sel].at=+z.dataset.drop; c.sel=null; clasRender(); }; z.ondragover=e=>e.preventDefault(); z.ondrop=e=>{ e.preventDefault(); if(c.checked) return; const id=+e.dataTransfer.getData("text"); c.items[id].at=+z.dataset.drop; c.sel=null; clasRender(); }; });
  $("#clChk").onclick=()=>{ c.checked=true; const ok=c.items.filter(x=>x.at===x.c).length, p=Math.round(ok/c.items.length*100); const k="c_"+clasIdx; if(S.best[k]==null||p>S.best[k]) S.best[k]=p; bump("x"); addXP(ok*2); clasRender(); $("#clRes").innerHTML=`<b class="${p>=75?'top':p>=65?'ok':'low'}">${ok}/${c.items.length} bien (${p}%)</b> <span class="mut">Las rojas muestran dónde iban.</span>`; };
  $("#clNew").onclick=clasSetup;
}
function chipH(x){ const c=clas; let cls=""; if(c.checked) cls = x.at===x.c? "good":"bad"; return `<span class="dchip ${c.sel===x.id?'sel':''} ${cls}" draggable="true" data-id="${x.id}">${esc(x.t)}${c.checked&&x.at!==x.c?`<small>→ ${esc(c.set.cats[x.c])}</small>`:""}</span>`; }

// ================= Ordenamiento =================
let ord=null, ordIdx=0;
function ordSetup(){ const set=ORDEN[ordIdx]; let pool=shuffle(set.s.map((t,i)=>i)); if(pool.every((v,i)=>v===i)) pool.reverse(); ord={set, pool, pick:[], checked:false}; ordRender(); }
function ordRender(){
  const o=ord, set=o.set;
  $("#ordBox").innerHTML = `<div class="chips">${ORDEN.map((s,i)=>`<button class="chip ${i===ordIdx?'on':''}" data-oi="${i}">${esc(s.t)}</button>`).join("")}</div>
  <div class="card"><div class="row" style="margin-top:0"><span class="tag a${set.a}">${esc(AREAS[set.a])}</span><span class="mut">Formato de reactivo de ordenamiento, como en la guía oficial.</span></div><p class="qt" style="margin-top:12px">${esc(set.d)}</p>
  <div class="ordgrid"><div><label>Elementos</label><div class="olist">${o.pool.filter(i=>!o.pick.includes(i)).map(i=>`<button class="oitem" data-p="${i}">${esc(set.s[i])}</button>`).join("") || `<span class="mut">Listo. Pulsa “Revisar”.</span>`}</div></div>
  <div><label>Tu orden (toca un paso para regresarlo)</label><ol class="olist mine">${o.pick.map((i,k)=>`<li class="oitem ${o.checked?(i===k?'good':'bad'):''}" data-u="${i}"><span class="on">${k+1}</span>${esc(set.s[i])}</li>`).join("")}</ol></div></div>
  ${o.checked? (o.pick.every((v,k)=>v===k)? `<div class="exp okx"><b>¡Orden perfecto!</b></div>` : `<div class="exp badx"><b>Orden correcto:</b><ol>${set.s.map(t=>`<li>${esc(t)}</li>`).join("")}</ol></div>`) : ""}
  <div class="row"><button class="btn pri" id="orChk" ${o.pick.length<set.s.length||o.checked?"disabled":""}>Revisar</button><button class="btn ghost" id="orNew">Reiniciar</button><button class="btn ghost" id="orNext">Siguiente secuencia →</button></div></div>`;
  $$("[data-oi]").forEach(b=>b.onclick=()=>{ ordIdx=+b.dataset.oi; ordSetup(); });
  $$("[data-p]").forEach(b=>b.onclick=()=>{ if(o.checked) return; o.pick.push(+b.dataset.p); ordRender(); });
  $$("[data-u]").forEach(b=>b.onclick=()=>{ if(o.checked) return; o.pick=o.pick.filter(x=>x!==+b.dataset.u); ordRender(); });
  $("#orChk").onclick=()=>{ o.checked=true; const ok=o.pick.every((v,k)=>v===k); bump("x"); addXP(ok?15:3); ordRender(); };
  $("#orNew").onclick=ordSetup; $("#orNext").onclick=()=>{ ordIdx=(ordIdx+1)%ORDEN.length; ordSetup(); };
}

// ================= Lectura =================
let lectIdx=0, lectAns={};
function lectSetup(){
  const L=LECT[lectIdx];
  $("#lectBox").innerHTML = `<div class="chips">${LECT.map((l,i)=>`<button class="chip ${i===lectIdx?'on':''}" data-li="${i}">Texto ${i+1}: ${esc(l.t)}</button>`).join("")}</div>
  <div class="lect"><article class="card text"><h3>${esc(L.t)}</h3><p>${esc(L.x)}</p></article>
  <div>${L.qs.map((q,k)=>{ const key=lectIdx+"_"+k, a=lectAns[key]; const ordr = q._o || (q._o=shuffle([0,1,2])); return `<div class="card q sm"><p class="qt sm"><b>${k+1}.</b> ${esc(q.q)}</p><div class="opts">${ordr.map((oi,j)=>{ let cls=""; if(a!==undefined){ if(oi===q.c) cls="right"; else if(oi===a) cls="wrong"; } return `<button class="opt ${cls}" data-k="${k}" data-oi="${oi}" ${a!==undefined?"disabled":""}><span class="ol">${"ABC"[j]}</span><span>${esc(q.o[oi])}</span></button>`; }).join("")}</div>${a!==undefined?`<div class="exp ${a===q.c?'okx':'badx'}">${esc(q.e)}</div>`:""}</div>`; }).join("")}</div></div>
  <p class="mut">Método: lee primero las preguntas, luego el texto completo. Responde con lo que dice el texto, no con tu opinión.</p>`;
  $$("[data-li]").forEach(b=>b.onclick=()=>{ lectIdx=+b.dataset.li; lectSetup(); });
  $$("#lectBox .opt").forEach(b=>b.onclick=()=>{ const k=+b.dataset.k, oi=+b.dataset.oi, q=L.qs[k]; lectAns[lectIdx+"_"+k]=oi; const ok=oi===q.c; S.stats[5]=S.stats[5]||{ok:0,tot:0}; S.stats[5].tot++; if(ok) S.stats[5].ok++; bump("q"); addXP(ok?10:2); lectSetup(); });
}

// ================= Palabras gatillo =================
let gatHide=false;
const CAT_AREA={"Patrones GoF":"Diseño","SOLID":"Diseño","Diagramas UML":"Diseño","Elicitación":"Análisis","Factibilidad":"Análisis","Tipos de prueba":"Gestión","Mantenimiento":"Gestión","Riesgos":"Gestión","ISO 25010":"Gestión","Nielsen":"Diseño","Implantación":"Gestión","Scrum":"Gestión","NoSQL y datos":"Desarrollo","Estructuras":"Desarrollo"};
function gatAll(){ const out=[]; Object.keys(RAYO).forEach(c=>RAYO[c].forEach(x=>out.push([x[0],x[1],CAT_AREA[c]||"",c]))); GATILLO_EXTRA.forEach(x=>out.push([x[0],x[1],x[2],"Caso real o trampa"])); return out; }
function gatSetup(){
  $("#gatBox").innerHTML = `<div class="row" style="margin-top:0"><input id="gq" class="search" placeholder="Busca una palabra: “instancia”, “sucursal”, “riesgo”, “HAVING”…"><button class="chip ${gatHide?'on':''}" id="gH">Modo tapado: ocultar respuestas</button></div><div id="gList"></div>`;
  const draw=()=>{ const q=($("#gq").value||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); const all=gatAll().filter(r=>!q || (r.join(" ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")).includes(q));
    $("#gList").innerHTML = `<p class="mut">${all.length} palabras gatillo. Si el reactivo dice esto → la respuesta suele ser esto.</p><div class="gtab">${all.map(r=>`<div class="grow"><span class="gk">${esc(r[0])}</span>${gatHide?`<span class="gv hid" data-a="${esc(r[1])}">Toca para ver</span>`:`<span class="gv">${esc(r[1])}</span>`}<span class="gc">${esc(r[3])}</span></div>`).join("")}</div>`;
    $$(".gv.hid").forEach(x=>x.onclick=()=>{ x.textContent=x.dataset.a; x.classList.remove("hid"); }); };
  $("#gq").oninput=draw; $("#gH").onclick=e=>{ gatHide=!gatHide; e.target.classList.toggle("on",gatHide); draw(); }; draw();
}

// ================= Inicio: misiones, mapa, Día D, respaldo =================
const ICONS = {aprender:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',simulacro:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',tarjetas:'<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',relampago:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',clasificar:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',ordenar:'<path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 5l1-1v4M3.5 11.5a1 1 0 1 1 1.6 1.2L3.5 15h2.2M3.5 17.5h2l-1 1.3a1 1 0 1 1-1 1.4"/>',lectura:'<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>',taller:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2"/>',memorama:'<rect x="3" y="3" width="11" height="11" rx="2"/><rect x="10" y="10" width="11" height="11" rx="2"/>',gatillos:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.5-4.5"/>',errores:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'};
function ico(k){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]||""}</svg>`; }
const MODES=[["aprender","Aprender","Lecciones por subárea, glosario y palabras clave para estudiar los temas."],["simulacro","Simulacro","Tres opciones, examen modelo proporcional y calibración de seguridad."],["tarjetas","Tarjetas Leitner","Repetición espaciada en 5 cajas."],["relampago","Ronda relámpago","Situación corta → elige el concepto. Entrena la identificación rápida."],["clasificar","Clasificador","Acomoda conceptos en su categoría: requerimientos, GoF, SQL, ISO 25010…"],["ordenar","Ordenamiento","El formato oficial de ordenar pasos y secuencias."],["lectura","Lectura","Textos con varias preguntas para la sección de lenguaje."],["taller","Taller de cálculo","Traza de código, PERT, McCabe, BVA, COCOMO y riesgo."],["memorama","Memorama de trampas","Empareja los conceptos “hermanos” que confunden."],["gatillos","Palabras gatillo","Buscador de “si dice X, la respuesta es Y”."],["errores","Mis errores","Lo que fallaste, agrupado por tema y con la lección para repasarlo."]];
const MISIONES=[["q",20,"Responde 20 reactivos"],["c",15,"Repasa 15 tarjetas"],["r",1,"Juega 1 ronda relámpago"],["x",2,"Resuelve 2 clasificadores u ordenamientos"]];
const _renderHome = renderHome;
renderHome = function(){
  _renderHome();
  S.diad=S.diad||{};
  $("#diad").innerHTML = DIAD.map((t,i)=>`<label class="chk"><input type="checkbox" data-dd="${i}" ${S.diad[i]?"checked":""}><span>${esc(t)}</span></label>`).join("");
  $$("[data-dd]").forEach(x=>x.onchange=()=>{ S.diad[x.dataset.dd]=x.checked; save(); });
  $("#modeGrid").innerHTML = MODES.map(m=>`<button class="mode" data-v="${m[0]}">${m[0]==="errores"?`<span class="badge">${Object.keys(S.wrong).length}</span>`:""}${m[0]==="tarjetas"?`<span class="badge b2">${CARDS.filter((c,i)=>(S.box[i]||1)<=2).length}</span>`:""}<div class="ic">${ico(m[0])}</div><b>${m[1]}</b><span>${m[2]}</span></button>`).join("");
};
function exportCode(){ try{ return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }catch(e){ return ""; } }
document.addEventListener("click", async e=>{
  if(e.target.id==="bkCopy"){ const code=exportCode(); $("#bkTxt").value=code; try{ await navigator.clipboard.writeText(code); toast("Código copiado. Pégalo en tu otro dispositivo."); }catch(err){ $("#bkTxt").select(); toast("Selecciona el código y cópialo a mano."); } }
  if(e.target.id==="bkLoad"){ try{ const o=JSON.parse(decodeURIComponent(escape(atob($("#bkTxt").value.trim())))); if(typeof o.xp!=="number") throw 0; S=Object.assign({xp:0,days:[],stats:{},wrong:{},box:{},best:{},hist:[]},o); save(); renderTop(); renderHome(); toast("Progreso restaurado"); }catch(err){ toast("Ese código no es válido"); } }
});
// Navegación con íconos
$$("nav button").forEach(b=>{ const k=b.dataset.v; if(ICONS[k]) b.insertAdjacentHTML("afterbegin", ico(k)); });
