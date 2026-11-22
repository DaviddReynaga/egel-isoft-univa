// ===================== SQL con tablas a la vista =====================
const SQ={
  names:["Ana","Luis","Eva","Raúl","Sofía","Iván","Marta","Hugo","Rosa","Diego"],
  cities:["Puebla","León","Mérida","Toluca","Oaxaca"],
  pick(a,n){ return shuffle(a).slice(0,n); },
  r(a,b){ return rnd(a,b); },
  clientes(n, needNull){ const ns=SQ.pick(SQ.names,n).sort(); const cs=SQ.pick(SQ.cities,3); let ci=ns.map((_,k)=>k<2?cs[0]:cs[SQ.r(0,2)]); ci=shuffle(ci);
    const tel=ns.map(()=>Math.random()<0.4?null:"55"+SQ.r(1000,9999)); if(needNull && !tel.includes(null)) tel[SQ.r(0,n-1)]=null; if(!tel.some(t=>t!==null)) tel[0]="55"+SQ.r(1000,9999);
    return ns.map((nm,k)=>({id:k+1,nombre:nm,ciudad:ci[k],telefono:tel[k]})); },
  pedidos(cl, n){ const ids=cl.map(c=>c.id); const without=SQ.pick(ids, Math.max(1,Math.floor(cl.length/3))); const pool=ids.filter(i=>!without.includes(i));
    const tots=SQ.pick([150,200,250,300,350,400,450,500,550,600,700,800,900],n);
    return tots.map((t,k)=>({id:100+k+1,id_cliente:pool[k<pool.length?k:SQ.r(0,pool.length-1)],total:t,descuento:Math.random()<0.35?null:SQ.r(1,4)*5})); },
  tbl(name,cols,rows){ return `<div class="sqt"><div class="sqn">${name}</div><table><tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>${rows.map(r=>`<tr>${cols.map(c=>`<td>${SQ.v(r[c])}</td>`).join("")}</tr>`).join("")}</table></div>`; },
  v(x){ return x===null||x===undefined? '<span class="null">NULL</span>' : esc(x); },
  res(cols,rows){ return {cols,rows}; },
  sc(t){ return {sc:t}; },
  show(o){ if(o.sc!==undefined) return `<span class="sqsc">${esc(o.sc)}</span>`; if(!o.rows.length) return `<span class="sqsc">Ninguna fila (resultado vacío)</span>`; return `<table class="sqr"><tr>${o.cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>${o.rows.map(r=>`<tr>${r.map(x=>`<td>${SQ.v(x)}</td>`).join("")}</tr>`).join("")}</table>`; },
  f2(x){ return Math.round(x*100)/100; },
  filas(n){ return n===1? "1 fila" : n+" filas"; }
};
const SQT=[
 {cat:"JOIN",gen(){ const cl=SQ.clientes(SQ.r(4,5)), pe=SQ.pedidos(cl,SQ.r(4,6)); const inner=pe.length, sin=cl.filter(c=>!pe.some(p=>p.id_cliente===c.id)).length;
   return {tabs:[["clientes",cl,["id","nombre","ciudad"]],["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT c.nombre, p.total\nFROM clientes c\nINNER JOIN pedidos p ON p.id_cliente = c.id;", q:"¿Cuántas filas devuelve la consulta?",
   o:[SQ.sc(SQ.filas(inner)),SQ.sc(SQ.filas(inner+sin)),SQ.sc(SQ.filas(cl.length*pe.length))],
   e:"INNER JOIN devuelve una fila por cada pareja cliente–pedido que cumple la condición: una por pedido. Los clientes sin pedidos no aparecen.",
   w:["Ese número incluye a los clientes sin pedidos: así se comportaría un LEFT JOIN, que los conserva con NULL.","Ese es el producto cartesiano (clientes × pedidos), lo que haría un CROSS JOIN sin condición."]}; }},
 {cat:"JOIN",gen(){ const cl=SQ.clientes(SQ.r(4,5)), pe=SQ.pedidos(cl,SQ.r(4,6)); const sin=cl.filter(c=>!pe.some(p=>p.id_cliente===c.id)), con=cl.filter(c=>pe.some(p=>p.id_cliente===c.id));
   return {tabs:[["clientes",cl,["id","nombre"]],["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT c.nombre\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nWHERE p.id IS NULL\nORDER BY c.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre"],sin.map(c=>[c.nombre])),SQ.res(["nombre"],con.map(c=>[c.nombre])),SQ.res(["nombre"],cl.map(c=>[c.nombre]))],
   e:"El LEFT JOIN conserva a todos los clientes; a los que no tienen pedidos les pone NULL en las columnas de pedidos. El WHERE p.id IS NULL deja solo a esos: los clientes sin pedidos.",
   w:["Esos son los clientes que sí tienen pedidos: justo los que el filtro IS NULL elimina.","Sin el WHERE saldrían todos (con repeticiones por cada pedido); el filtro IS NULL deja solo a los que no tienen pedidos."]}; }},
 {cat:"NULL",gen(){ const cl=SQ.clientes(SQ.r(4,6),true); const nn=cl.filter(c=>c.telefono!==null).length;
   return {tabs:[["clientes",cl,["id","nombre","telefono"]]], sql:"SELECT COUNT(*), COUNT(telefono)\nFROM clientes;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["COUNT(*)","COUNT(telefono)"],[[cl.length,nn]]),SQ.res(["COUNT(*)","COUNT(telefono)"],[[cl.length,cl.length]]),SQ.res(["COUNT(*)","COUNT(telefono)"],[[nn,nn]])],
   e:"COUNT(*) cuenta filas, sin importar su contenido. COUNT(columna) cuenta solo los valores que no son NULL.",
   w:["COUNT(telefono) no cuenta los NULL, así que no puede ser igual al total de filas.","COUNT(*) cuenta todas las filas, incluidas las que tienen NULL en alguna columna."]}; }},
 {cat:"Agregación",gen(){ const cl=SQ.clientes(SQ.r(5,6)); const g={}; cl.forEach(c=>g[c.ciudad]=(g[c.ciudad]||0)+1); const ks=Object.keys(g).sort(); if(!ks.some(k=>g[k]>1)||!ks.some(k=>g[k]===1)) return null;
   return {tabs:[["clientes",cl,["id","nombre","ciudad"]]], sql:"SELECT ciudad, COUNT(*) AS n\nFROM clientes\nGROUP BY ciudad\nHAVING COUNT(*) > 1\nORDER BY ciudad;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["ciudad","n"],ks.filter(k=>g[k]>1).map(k=>[k,g[k]])),SQ.res(["ciudad","n"],ks.map(k=>[k,g[k]])),SQ.res(["ciudad","n"],ks.filter(k=>g[k]===1).map(k=>[k,g[k]]))],
   e:"GROUP BY forma un grupo por ciudad y COUNT(*) cuenta sus clientes; HAVING filtra los grupos y deja solo las ciudades con más de un cliente.",
   w:["Ese sería el resultado sin la cláusula HAVING.","HAVING COUNT(*) > 1 conserva los grupos con más de uno, no los que tienen exactamente uno."]}; }},
 {cat:"NULL",gen(){ const cl=SQ.clientes(SQ.r(4,5)), pe=SQ.pedidos(cl,SQ.r(4,6)); const s={}; pe.forEach(p=>s[p.id_cliente]=(s[p.id_cliente]||0)+p.total);
   return {tabs:[["clientes",cl,["id","nombre"]],["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT c.nombre, SUM(p.total) AS total\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nombre\nORDER BY c.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre","total"],cl.map(c=>[c.nombre,s[c.id]===undefined?null:s[c.id]])),SQ.res(["nombre","total"],cl.map(c=>[c.nombre,s[c.id]||0])),SQ.res(["nombre","total"],cl.filter(c=>s[c.id]!==undefined).map(c=>[c.nombre,s[c.id]]))],
   e:"El LEFT JOIN conserva a los clientes sin pedidos, y SUM sobre puros NULL devuelve NULL, no 0. Para mostrar 0 habría que usar COALESCE(SUM(p.total), 0).",
   w:["SUM no convierte los NULL en 0: sin ningún valor que sumar, el resultado es NULL.","Con LEFT JOIN los clientes sin pedidos sí aparecen; desaparecerían con un INNER JOIN."]}; }},
 {cat:"NULL",gen(){ const cl=SQ.clientes(4), pe=SQ.pedidos(cl,SQ.r(5,6)); const vals=pe.map(p=>p.descuento); const nn=vals.filter(v=>v!==null); if(!nn.length||nn.length===vals.length) return null; const sum=nn.reduce((a,b)=>a+b,0);
   return {tabs:[["pedidos",pe,["id","total","descuento"]]], sql:"SELECT AVG(descuento)\nFROM pedidos;", q:"¿Qué devuelve la consulta? (redondeado a 2 decimales)",
   o:[SQ.sc(String(SQ.f2(sum/nn.length))),SQ.sc(String(SQ.f2(sum/vals.length))),SQ.sc("NULL")],
   e:"AVG ignora los NULL: suma los valores no nulos y divide entre cuántos son ("+sum+" / "+nn.length+").",
   w:["Ese resultado trata los NULL como 0 y divide entre todas las filas; AVG no hace eso.","Las funciones de agregación ignoran los NULL; el resultado solo es NULL si todos los valores lo son."]}; }},
 {cat:"NULL",gen(){ const cl=SQ.clientes(SQ.r(4,5)), pe=SQ.pedidos(cl,SQ.r(3,5)); pe.push({id:100+pe.length+1,id_cliente:null,total:300,descuento:null}); const sin=cl.filter(c=>!pe.some(p=>p.id_cliente===c.id));
   return {tabs:[["clientes",cl,["id","nombre"]],["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT nombre\nFROM clientes\nWHERE id NOT IN (SELECT id_cliente FROM pedidos);", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre"],[]),SQ.res(["nombre"],sin.map(c=>[c.nombre])),SQ.res(["nombre"],cl.map(c=>[c.nombre]))],
   e:"Es la trampa clásica de NOT IN: la subconsulta incluye un NULL. “id NOT IN (…, NULL)” equivale a “id <> … AND id <> NULL”, y cualquier comparación con NULL es desconocida, así que ninguna fila cumple. Se corrige con NOT EXISTS o agregando WHERE id_cliente IS NOT NULL a la subconsulta.",
   w:["Eso devolvería si la subconsulta no tuviera ningún NULL. Revisa la última fila de pedidos.","NOT IN sí excluye a los clientes con pedidos; el problema es que, con un NULL en la lista, excluye a todos."]}; }},
 {cat:"NULL",gen(){ const cl=SQ.clientes(SQ.r(4,6),true);
   return {tabs:[["clientes",cl,["id","nombre","telefono"]]], sql:"SELECT nombre\nFROM clientes\nWHERE telefono = NULL;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre"],[]),SQ.res(["nombre"],cl.filter(c=>c.telefono===null).map(c=>[c.nombre])),SQ.res(["nombre"],cl.filter(c=>c.telefono!==null).map(c=>[c.nombre]))],
   e:"Comparar con = NULL nunca es verdadero: el resultado es desconocido, así que no devuelve filas. Para buscar valores nulos se usa IS NULL.",
   w:["Ese sería el resultado de WHERE telefono IS NULL, no de = NULL.","Esos son los que sí tienen teléfono; ni siquiera IS NULL los devolvería."]}; }},
 {cat:"Orden",gen(){ const cl=SQ.clientes(4), pe=SQ.pedidos(cl,SQ.r(5,6)); const d=pe.slice().sort((a,b)=>b.total-a.total), a=pe.slice().sort((x,y)=>x.total-y.total);
   return {tabs:[["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT id, total\nFROM pedidos\nORDER BY total DESC\nLIMIT 2;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["id","total"],d.slice(0,2).map(p=>[p.id,p.total])),SQ.res(["id","total"],a.slice(0,2).map(p=>[p.id,p.total])),SQ.res(["id","total"],pe.slice(0,2).map(p=>[p.id,p.total]))],
   e:"Primero se ordena de mayor a menor total (DESC) y después LIMIT toma las dos primeras filas: los dos pedidos más caros.",
   w:["Esos son los dos más baratos: el resultado de ORDER BY total ASC (o sin DESC).","Esas son las dos primeras filas de la tabla; LIMIT se aplica después de ordenar."]}; }},
 {cat:"Conjuntos",gen(){ const cl=SQ.clientes(SQ.r(4,5)); const su=SQ.pick(SQ.cities,3).map((c,k)=>({id:k+1,ciudad:c})); const A=[...new Set(cl.map(c=>c.ciudad))], B=su.map(s=>s.ciudad); const uni=new Set([...A,...B]).size, all=cl.length+su.length, inter=A.filter(x=>B.includes(x)).length; if(uni===all||inter===uni) return null;
   return {tabs:[["clientes",cl,["id","nombre","ciudad"]],["sucursales",su,["id","ciudad"]]], sql:"SELECT ciudad FROM clientes\nUNION\nSELECT ciudad FROM sucursales;", q:"¿Cuántas filas devuelve la consulta?",
   o:[SQ.sc(SQ.filas(uni)),SQ.sc(SQ.filas(all)),SQ.sc(SQ.filas(inter))],
   e:"UNION combina ambos resultados y elimina los duplicados: cada ciudad aparece una sola vez.",
   w:["Ese número conserva los duplicados: así se comporta UNION ALL.","Ese es el número de ciudades que están en ambas tablas: el resultado de INTERSECT."]}; }},
 {cat:"Filtros",gen(){ const cl=SQ.clientes(4), pe=SQ.pedidos(cl,6); const A=p=>p.total>500||(p.total<300&&p.descuento!==null), B=p=>(p.total>500||p.total<300)&&p.descuento!==null, C=p=>p.total>500; const ra=pe.filter(A).map(p=>[p.id]), rb=pe.filter(B).map(p=>[p.id]), rc=pe.filter(C).map(p=>[p.id]);
   return {tabs:[["pedidos",pe,["id","total","descuento"]]], sql:"SELECT id\nFROM pedidos\nWHERE total > 500 OR total < 300 AND descuento IS NOT NULL;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["id"],ra),SQ.res(["id"],rb),SQ.res(["id"],rc)],
   e:"AND tiene mayor precedencia que OR: la condición se evalúa como total > 500 OR (total < 300 AND descuento IS NOT NULL).",
   w:["Ese resultado agrupa el OR primero, como si estuviera escrito (total > 500 OR total < 300) AND descuento IS NOT NULL.","Ese resultado ignora la segunda parte del OR."]}; }},
 {cat:"Agregación",gen(){ const cl=SQ.clientes(SQ.r(4,6)), pe=SQ.pedidos(cl,SQ.r(5,6)); const dis=new Set(pe.map(p=>p.id_cliente)).size; if(dis===pe.length||dis===cl.length) return null;
   return {tabs:[["clientes",cl,["id","nombre"]],["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT COUNT(DISTINCT id_cliente)\nFROM pedidos;", q:"¿Qué devuelve la consulta?",
   o:[SQ.sc(String(dis)),SQ.sc(String(pe.length)),SQ.sc(String(cl.length))],
   e:"COUNT(DISTINCT id_cliente) cuenta cuántos clientes distintos aparecen en pedidos, es decir, cuántos clientes han comprado.",
   w:["Ese es el número de pedidos: sería COUNT(*) o COUNT(id_cliente) sin DISTINCT.","Ese es el número total de clientes, pero algunos no tienen pedidos."]}; }}
];
let sqCur=null, sqAns=null, sqDeck=[], sqStat={ok:0,n:0}, sqCat="Todos";
function sqNew(){
  const pool=SQT.map((t,i)=>i).filter(i=>sqCat==="Todos"||SQT[i].cat===sqCat);
  if(!sqDeck.length||!sqDeck.every(i=>pool.includes(i))) sqDeck=shuffle(pool);
  const ti=sqDeck.shift();
  for(let k=0;k<40;k++){ const g=SQT[ti].gen(); if(!g) continue; const js=g.o.map(o=>JSON.stringify(o)); if(new Set(js).size===3){ g.ord=shuffle([0,1,2]); g.cat=SQT[ti].cat; sqCur=g; sqAns=null; return; } }
  sqNew();
}
function sqSetup(){
  if(!sqCur) sqNew();
  const g=sqCur, cats=["Todos",...new Set(SQT.map(t=>t.cat))];
  $("#sqlBox").innerHTML=`<p class="mut">Cada ejercicio usa datos generados al azar, así que nunca se repite igual. Lee las tablas, analiza la consulta y predice el resultado: así pregunta el CENEVAL la gestión de datos.${sqStat.n?` Llevas ${sqStat.ok} de ${sqStat.n} en esta sesión.`:""}</p>
  <div class="chips" id="sqCats">${cats.map(c=>`<button class="chip ${c===sqCat?"on":""}" data-c="${c}">${c}</button>`).join("")}</div>
  <div class="card"><span class="fxh">${esc(g.cat)}</span>
  <div class="sqtabs">${g.tabs.map(t=>SQ.tbl(t[0],t[2],t[1])).join("")}</div>
  <pre class="code sqcode">${esc(g.sql)}</pre>
  <p class="qt">${esc(g.q)}</p>
  <div class="opts sqopts">${g.ord.map((oi,k)=>{ let c=""; if(sqAns!==null){ if(oi===0) c="right"; else if(oi===sqAns) c="wrong"; } return `<button class="opt ${c}" data-oi="${oi}" ${sqAns!==null?"disabled":""}><span class="ol">${"ABC"[k]}</span><span class="sqo">${SQ.show(g.o[oi])}</span></button>`; }).join("")}</div>
  ${sqAns===null?"":`<div class="fb ${sqAns===0?"good":"bad"}"><div class="fbh">${sqAns===0?"¡Correcto!":"No era esa."}</div>${sqAns!==0?`<p><b>Por qué no:</b> ${esc(g.w[sqAns-1])}</p>`:""}<p><b>${sqAns===0?"Por qué":"La correcta"}:</b> ${esc(g.e)}</p><button class="lessonlink" onclick="openLesson('3-4')">Estudiar este tema: ${esc((LESSONS.find(l=>l.id==='3-4')||{t:'Gestión de datos'}).t)} →</button></div>`}
  <div class="row"><button class="btn pri" id="sqNext">${sqAns===null?"Saltar":"Siguiente consulta →"}</button></div></div>`;
  $("#sqCats").onclick=e=>{ const b=e.target.closest("[data-c]"); if(!b) return; sqCat=b.dataset.c; sqDeck=[]; sqNew(); sqSetup(); };
  $$("#sqlBox .opt").forEach(b=>b.onclick=()=>{ sqAns=+b.dataset.oi; sqStat.n++; if(sqAns===0) sqStat.ok++; bump("q"); sqSetup(); });
  $("#sqNext").onclick=()=>{ sqNew(); sqSetup(); window.scrollTo(0,0); };
}
