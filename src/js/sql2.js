// ===================== SQL: más estructuras y más esquemas =====================
Object.assign(SQ,{
  alumnos(){ const n=SQ.r(5,6), ns=SQ.pick(SQ.names,n).sort(); const car=shuffle(["ISC","ISC","IGE","IGE","IND","ISC"]).slice(0,n);
    return ns.map((nm,k)=>({id:k+1,nombre:nm,carrera:car[k],semestre:SQ.r(1,9)})); },
  calif(al){ const out=[]; const sin=al[SQ.r(0,al.length-1)].id; al.forEach(a=>{ if(a.id===sin) return; SQ.pick(["BD","Redes","POO"],SQ.r(1,2)).forEach(m=>out.push({id_alumno:a.id,materia:m,calif:SQ.r(5,10)})); }); return out; },
  deptos(){ const nm=shuffle(["Sistemas","Ventas","Compras","Legal"]); return nm.map((x,k)=>({id:k+1,nombre:x})); },
  empleados(){ const ns=SQ.pick(SQ.names,6); const su=SQ.pick([12,14,15,18,20,22,25,28,30,35,40,45],6).map(x=>x*1000);
    return ns.map((nm,k)=>({id:k+1,nombre:nm,depto:k===0?1:SQ.r(1,3),sueldo:su[k],id_jefe:k===0?null:(k<3?1:SQ.r(1,3))})); },
  productos(nullStock){ const ns=SQ.pick(["Mouse","Monitor","Laptop","Cable","Teclado","Bocina","Camara","Tablet","Bateria","Router","Audifonos","Memoria"],SQ.r(6,7));
    const pr=SQ.pick([150,200,250,300,450,600,800,1200,1500,2200,3000,4500],ns.length); const cats=["Cómputo","Audio","Accesorios"];
    return ns.map((nm,k)=>({id:k+1,nombre:nm,categoria:cats[k%3],precio:pr[k],stock:(nullStock&&k===1)?null:SQ.r(0,20)})); },
  names2(rows,key){ return rows.map(r=>[r[key]]); },
  sortBy(a,f){ return a.slice().sort(f); }
});
SQT.push(
 // ---------- Escuela ----------
 {cat:"JOIN",gen(){ const al=SQ.alumnos(), ca=SQ.calif(al); const by={}; ca.forEach(c=>{ const a=al.find(x=>x.id===c.id_alumno); (by[a.carrera]=by[a.carrera]||[]).push(c.calif); }); const ks=Object.keys(by); if(ks.length<3) return null; const avg=k=>by[k].reduce((s,x)=>s+x,0)/by[k].length; const mx=ks.slice().sort((a,b)=>avg(b)-avg(a)); if(avg(mx[0])===avg(mx[1])||avg(mx[1])===avg(mx[2])) return null; const mn=mx[2];
   return {tabs:[["alumnos",al,["id","nombre","carrera"]],["calificaciones",ca,["id_alumno","materia","calif"]]], sql:"SELECT a.carrera, AVG(c.calif) AS prom\nFROM alumnos a\nJOIN calificaciones c ON c.id_alumno = a.id\nGROUP BY a.carrera\nORDER BY prom DESC\nLIMIT 1;", q:"¿Qué carrera devuelve la consulta?",
   o:[SQ.sc(mx[0]),SQ.sc(mn),SQ.sc(mx[1])],
   e:"Se une cada calificación con la carrera del alumno, se promedian por carrera y se ordena de mayor a menor: LIMIT 1 deja el promedio más alto.",
   w:["Esa carrera tiene el promedio más bajo: saldría con ORDER BY prom ASC.","Esa carrera tiene el segundo promedio: revisa el cálculo; LIMIT 1 deja solo la primera fila tras ordenar de mayor a menor."]}; }},
 {cat:"Filtros",gen(){ const al=SQ.alumnos(), ca=SQ.calif(al); { const by={}; ca.forEach(c=>(by[c.id_alumno]=by[c.id_alumno]||[]).push(c)); const two=Object.values(by).filter(x=>x.length>=2); if(!two.length) return null; two[0].forEach(c=>c.calif=SQ.r(4,5)); } const rep=ca.filter(c=>c.calif<6); if(!rep.length) return null; const ids=[...new Set(rep.map(c=>c.id_alumno))]; if(ids.length===rep.length) return null; const nm=i=>al.find(a=>a.id===i).nombre;
   const apr=[...new Set(ca.filter(c=>c.calif>=6).map(c=>c.id_alumno))].map(nm).sort();
   return {tabs:[["alumnos",al,["id","nombre"]],["calificaciones",ca,["id_alumno","materia","calif"]]], sql:"SELECT DISTINCT a.nombre\nFROM alumnos a\nJOIN calificaciones c ON c.id_alumno = a.id\nWHERE c.calif < 6\nORDER BY a.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre"],ids.map(nm).sort().map(x=>[x])),SQ.res(["nombre"],rep.map(c=>nm(c.id_alumno)).sort().map(x=>[x])),SQ.res(["nombre"],apr.map(x=>[x]))],
   e:"El JOIN produce una fila por calificación; el WHERE deja las reprobatorias y DISTINCT quita a los alumnos repetidos (reprobaron más de una materia).",
   w:["Ese resultado repite nombres: sería la consulta sin DISTINCT.","Esos son alumnos con alguna calificación aprobatoria, lo contrario del filtro calif < 6."]}; }},
 {cat:"Agregación",gen(){ const al=SQ.alumnos(), ca=SQ.calif(al); const g={}; ca.forEach(c=>(g[c.materia]=g[c.materia]||[]).push(c.calif)); const ks=Object.keys(g).sort(); const av=k=>g[k].reduce((s,x)=>s+x,0)/g[k].length; const A=ks.filter(k=>av(k)>=8), B=ks.filter(k=>g[k].length>=2&&av(k)<8), C=ks; if(!A.length||A.length===C.length) return null;
   return {tabs:[["calificaciones",ca,["id_alumno","materia","calif"]]], sql:"SELECT materia, COUNT(*) AS n\nFROM calificaciones\nGROUP BY materia\nHAVING AVG(calif) >= 8\nORDER BY materia;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["materia","n"],A.map(k=>[k,g[k].length])),SQ.res(["materia","n"],C.map(k=>[k,g[k].length])),SQ.res(["materia","n"],A.map(k=>[k,g[k].filter(x=>x>=8).length]))],
   e:"HAVING filtra grupos completos: deja las materias cuyo promedio es 8 o más, y COUNT(*) cuenta todas sus calificaciones, no solo las de 8 o más.",
   w:["Ese es el resultado sin HAVING: aparecen todas las materias.","Ese resultado cuenta solo las calificaciones de 8 o más, como si hubiera un WHERE calif >= 8. HAVING no quita filas dentro del grupo."]}; }},
 {cat:"Subconsultas",gen(){ const al=SQ.alumnos(), ca=SQ.calif(al); [...new Set(ca.map(c=>c.id_alumno))].forEach(i=>{ if(!ca.some(c=>c.id_alumno===i&&c.materia==="BD")) ca.push({id_alumno:i,materia:"BD",calif:SQ.r(5,10)}); }); ca.sort((a,b)=>a.id_alumno-b.id_alumno); const bd=ca.filter(c=>c.materia==="BD"); if(bd.length<3) return null; const avB=bd.reduce((s,c)=>s+c.calif,0)/bd.length, avG=ca.reduce((s,c)=>s+c.calif,0)/ca.length; const nm=i=>al.find(a=>a.id===i).nombre; const f=t=>bd.filter(t).map(c=>[nm(c.id_alumno),c.calif]).sort((a,b)=>a[0]<b[0]?-1:1);
   const A=f(c=>c.calif>avB), B=f(c=>c.calif>avG), C=f(c=>c.calif>=Math.floor(avB));
   return {tabs:[["alumnos",al,["id","nombre"]],["calificaciones",ca,["id_alumno","materia","calif"]]], sql:"SELECT a.nombre, c.calif\nFROM alumnos a\nJOIN calificaciones c ON c.id_alumno = a.id\nWHERE c.materia = 'BD'\n  AND c.calif > (SELECT AVG(calif)\n                 FROM calificaciones\n                 WHERE materia = 'BD')\nORDER BY a.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre","calif"],A),SQ.res(["nombre","calif"],B),SQ.res(["nombre","calif"],C)],
   e:"La subconsulta calcula el promedio solo de BD ("+SQ.f2(avB)+") y se comparan contra él únicamente las calificaciones de BD.",
   w:["Ese resultado compara contra el promedio de todas las materias ("+SQ.f2(avG)+"), pero la subconsulta filtra materia = 'BD'.","Ese resultado incluye calificaciones iguales o menores al promedio redondeado; la condición es estrictamente mayor que "+SQ.f2(avB)+"."]}; }},
 {cat:"Funciones",gen(){ const al=SQ.alumnos(), ca=SQ.calif(al).filter(c=>c.materia==="POO"); if(ca.length<3||!ca.some(c=>c.calif>=9)||!ca.some(c=>c.calif<7)) return null; const nm=i=>al.find(a=>a.id===i).nombre; const rows=ca.map(c=>({n:nm(c.id_alumno),c:c.calif})).sort((a,b)=>a.n<b.n?-1:1);
   const real=c=>c>=7?"B":"C", naive=c=>c>=9?"A":c>=7?"B":"C", inv=c=>c>=7?"C":"B";
   return {tabs:[["alumnos",al,["id","nombre"]],["calificaciones",ca,["id_alumno","materia","calif"]]], sql:"SELECT a.nombre,\n  CASE\n    WHEN c.calif >= 7 THEN 'B'\n    WHEN c.calif >= 9 THEN 'A'\n    ELSE 'C'\n  END AS nivel\nFROM alumnos a\nJOIN calificaciones c ON c.id_alumno = a.id\nORDER BY a.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre","nivel"],rows.map(r=>[r.n,real(r.c)])),SQ.res(["nombre","nivel"],rows.map(r=>[r.n,naive(r.c)])),SQ.res(["nombre","nivel"],rows.map(r=>[r.n,inv(r.c)]))],
   e:"CASE evalúa las condiciones en orden y se queda con la primera verdadera. Un 9 o 10 ya cumple calif >= 7, así que recibe 'B': la rama 'A' nunca se alcanza. Por eso las condiciones más estrictas van primero.",
   w:["Así sería si la condición >= 9 estuviera antes que >= 7; en el orden escrito, nadie obtiene 'A'.","Ese resultado invierte las etiquetas; quien tiene 7 o más cumple la primera condición y recibe 'B'."]}; }},
 {cat:"Filtros",gen(){ const al=SQ.alumnos(); const A=al.filter(a=>a.semestre>=3&&a.semestre<=5).length, B=al.filter(a=>a.semestre>3&&a.semestre<5).length, C=al.filter(a=>a.semestre>=3&&a.semestre<5).length;
   return {tabs:[["alumnos",al,["id","nombre","semestre"]]], sql:"SELECT COUNT(*)\nFROM alumnos\nWHERE semestre BETWEEN 3 AND 5;", q:"¿Qué devuelve la consulta?",
   o:[SQ.sc(String(A)),SQ.sc(String(B)),SQ.sc(String(C))],
   e:"BETWEEN incluye los dos extremos: equivale a semestre >= 3 AND semestre <= 5.",
   w:["Ese conteo excluye los extremos 3 y 5; BETWEEN sí los incluye.","Ese conteo excluye solo el 5; BETWEEN incluye ambos extremos."]}; }},
 {cat:"Subconsultas",gen(){ const al=SQ.alumnos(), ca=SQ.calif(al); const con=al.filter(a=>ca.some(c=>c.id_alumno===a.id));
   return {tabs:[["alumnos",al,["id","nombre"]],["calificaciones",ca,["id_alumno","materia","calif"]]], sql:"SELECT a.nombre\nFROM alumnos a\nWHERE NOT EXISTS (\n  SELECT 1 FROM calificaciones c\n  WHERE c.id_alumno = a.id\n);", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre"],al.filter(a=>!con.includes(a)).map(a=>[a.nombre])),SQ.res(["nombre"],con.map(a=>[a.nombre])),SQ.res(["nombre"],[])],
   e:"La subconsulta correlacionada se evalúa por cada alumno; NOT EXISTS es verdadero cuando no encuentra ninguna calificación suya.",
   w:["Esos son los alumnos con calificaciones: el resultado de EXISTS, no de NOT EXISTS.","A diferencia de NOT IN, NOT EXISTS no tiene el problema de los NULL: sí devuelve a los alumnos sin calificaciones."]}; }},
 // ---------- Empresa ----------
 {cat:"JOIN",gen(){ const em=SQ.empleados(); const nm=i=>em.find(e=>e.id===i).nombre; const inner=em.filter(e=>e.id_jefe!==null).map(e=>[e.nombre,nm(e.id_jefe)]).sort((a,b)=>a[0]<b[0]?-1:1);
   const left=em.map(e=>[e.nombre,e.id_jefe===null?null:nm(e.id_jefe)]).sort((a,b)=>a[0]<b[0]?-1:1); const swap=inner.map(r=>[r[1],r[0]]).sort((a,b)=>a[0]<b[0]?-1:(a[0]>b[0]?1:(a[1]<b[1]?-1:1)));
   return {tabs:[["empleados",em,["id","nombre","sueldo","id_jefe"]]], sql:"SELECT e.nombre, j.nombre AS jefe\nFROM empleados e\nJOIN empleados j ON e.id_jefe = j.id\nORDER BY e.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre","jefe"],inner),SQ.res(["nombre","jefe"],left),SQ.res(["nombre","jefe"],swap)],
   e:"Es un self join: la tabla se une consigo misma con dos alias. e es el empleado y j su jefe. Con JOIN (INNER), quien no tiene jefe (id_jefe NULL) no aparece.",
   w:["Ese resultado incluye al empleado sin jefe con NULL: sería un LEFT JOIN.","Ese resultado invierte los papeles: pone al jefe en la columna nombre y al subordinado en jefe."]}; }},
 {cat:"Agregación",gen(){ const em=SQ.empleados(), dp=SQ.deptos(); const used=[...new Set(em.map(e=>e.depto))].sort(); const mx=d=>Math.max(...em.filter(e=>e.depto===d).map(e=>e.sueldo)), mn=d=>Math.min(...em.filter(e=>e.depto===d).map(e=>e.sueldo)); const top=Math.max(...em.map(e=>e.sueldo)); if(used.every(d=>mx(d)===mn(d))) return null;
   return {tabs:[["empleados",em,["id","nombre","depto","sueldo"]]], sql:"SELECT depto, MAX(sueldo) AS maximo\nFROM empleados\nGROUP BY depto\nORDER BY depto;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["depto","maximo"],used.map(d=>[d,mx(d)])),SQ.res(["depto","maximo"],used.map(d=>[d,mn(d)])),SQ.res(["depto","maximo"],used.map(d=>[d,top]))],
   e:"GROUP BY depto forma un grupo por departamento y MAX devuelve el sueldo más alto dentro de cada grupo.",
   w:["Esos son los sueldos mínimos de cada departamento: MIN(sueldo).","Ese resultado repite el máximo de toda la tabla en cada grupo; con GROUP BY, MAX se calcula por grupo."]}; }},
 {cat:"Subconsultas",gen(){ const em=SQ.empleados(); const av=d=>{ const x=em.filter(e=>e.depto===d); return x.reduce((s,e)=>s+e.sueldo,0)/x.length; }; const g=em.reduce((s,e)=>s+e.sueldo,0)/em.length;
   const A=em.filter(e=>e.sueldo>av(e.depto)).map(e=>[e.nombre]).sort(), B=em.filter(e=>e.sueldo>g).map(e=>[e.nombre]).sort(), C=em.filter(e=>e.sueldo>=av(e.depto)).map(e=>[e.nombre]).sort();
   return {tabs:[["empleados",em,["id","nombre","depto","sueldo"]]], sql:"SELECT e.nombre\nFROM empleados e\nWHERE e.sueldo > (\n  SELECT AVG(x.sueldo)\n  FROM empleados x\n  WHERE x.depto = e.depto\n)\nORDER BY e.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre"],A),SQ.res(["nombre"],B),SQ.res(["nombre"],C)],
   e:"Es una subconsulta correlacionada: por cada empleado e se calcula el promedio de su propio departamento. Un empleado solo en su departamento nunca gana más que su propio promedio.",
   w:["Ese resultado compara contra el promedio de toda la empresa ("+SQ.f2(g)+"); la subconsulta filtra por el departamento del empleado.","Ese resultado usa >=, e incluye a quien gana exactamente el promedio de su departamento (por ejemplo, el único de su área)."]}; }},
 {cat:"JOIN",gen(){ const em=SQ.empleados(), dp=SQ.deptos(); const X=20000; const on=[]; dp.forEach(d=>{ const es=em.filter(e=>e.depto===d.id&&e.sueldo>X); if(es.length) es.forEach(e=>on.push([d.nombre,e.nombre])); else on.push([d.nombre,null]); }); const wh=on.filter(r=>r[1]!==null);
   const sorter=(a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:((a[1]||"")<(b[1]||"")?-1:1); on.sort(sorter); wh.sort(sorter); const all=[]; dp.forEach(d=>{ const es=em.filter(e=>e.depto===d.id); if(es.length) es.forEach(e=>all.push([d.nombre,e.nombre])); else all.push([d.nombre,null]); }); all.sort(sorter);
   return {tabs:[["departamentos",dp,["id","nombre"]],["empleados",em,["id","nombre","depto","sueldo"]]], sql:"SELECT d.nombre, e.nombre\nFROM departamentos d\nLEFT JOIN empleados e\n  ON e.depto = d.id AND e.sueldo > 20000\nORDER BY d.nombre, e.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["d.nombre","e.nombre"],on),SQ.res(["d.nombre","e.nombre"],wh),SQ.res(["d.nombre","e.nombre"],all)],
   e:"Con LEFT JOIN, una condición en el ON solo decide qué empleados se unen; todos los departamentos se conservan, con NULL si ningún empleado cumple. Si la condición estuviera en el WHERE, esas filas con NULL se eliminarían.",
   w:["Ese sería el resultado con la condición sueldo > 20000 en el WHERE: se pierden los departamentos sin empleados que la cumplan.","Ese resultado ignora la condición de sueldo del ON."]}; }},
 {cat:"Agregación",gen(){ const em=SQ.empleados(), dp=SQ.deptos(); const n=d=>em.filter(e=>e.depto===d.id).length; const s=dp.slice().sort((a,b)=>a.nombre<b.nombre?-1:1);
   return {tabs:[["departamentos",dp,["id","nombre"]],["empleados",em,["id","nombre","depto"]]], sql:"SELECT d.nombre, COUNT(e.id) AS n\nFROM departamentos d\nLEFT JOIN empleados e ON e.depto = d.id\nGROUP BY d.nombre\nORDER BY d.nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre","n"],s.map(d=>[d.nombre,n(d)])),SQ.res(["nombre","n"],s.map(d=>[d.nombre,n(d)||1])),SQ.res(["nombre","n"],s.filter(d=>n(d)).map(d=>[d.nombre,n(d)]))],
   e:"El departamento sin empleados se conserva con una fila de NULL. COUNT(e.id) no cuenta ese NULL, así que muestra 0.",
   w:["Ese resultado usa COUNT(*), que cuenta la fila con NULL y da 1 al departamento vacío.","Con LEFT JOIN el departamento vacío sí aparece; desaparecería con INNER JOIN."]}; }},
 {cat:"Orden",gen(){ const em=SQ.empleados(); const A=SQ.sortBy(em,(a,b)=>a.depto-b.depto||b.sueldo-a.sueldo), B=SQ.sortBy(em,(a,b)=>b.sueldo-a.sueldo), C=SQ.sortBy(em,(a,b)=>a.depto-b.depto||a.sueldo-b.sueldo); const m=x=>x.slice(0,3).map(e=>[e.nombre,e.depto,e.sueldo]);
   return {tabs:[["empleados",em,["id","nombre","depto","sueldo"]]], sql:"SELECT nombre, depto, sueldo\nFROM empleados\nORDER BY depto ASC, sueldo DESC\nLIMIT 3;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre","depto","sueldo"],m(A)),SQ.res(["nombre","depto","sueldo"],m(B)),SQ.res(["nombre","depto","sueldo"],m(C))],
   e:"Primero ordena por depto de menor a mayor; dentro del mismo departamento, por sueldo de mayor a menor. Luego toma las tres primeras filas.",
   w:["Ese resultado ordena solo por sueldo descendente e ignora el depto como primer criterio.","Ese resultado ordena el sueldo ascendente dentro de cada departamento; el DESC aplica a sueldo."]}; }},
 {cat:"Modificación",gen(){ const em=SQ.empleados(); const A=em.filter(e=>e.depto===1&&e.sueldo<25000).length, B=em.filter(e=>e.depto===1||e.sueldo<25000).length, C=em.filter(e=>e.depto===1).length;
   return {tabs:[["empleados",em,["id","nombre","depto","sueldo"]]], sql:"UPDATE empleados\nSET sueldo = sueldo * 1.10\nWHERE depto = 1 AND sueldo < 25000;", q:"¿Cuántas filas modifica la sentencia?",
   o:[SQ.sc(SQ.filas(A)),SQ.sc(SQ.filas(B)),SQ.sc(SQ.filas(C))],
   e:"UPDATE solo modifica las filas que cumplen todo el WHERE: departamento 1 y sueldo menor a 25,000.",
   w:["Ese número corresponde a OR: bastaría con cumplir una de las dos condiciones.","Ese número ignora la condición del sueldo y cuenta a todo el departamento 1."]}; }},
 {cat:"Modificación",gen(){ const em=SQ.empleados(); const t=em.length, j=em.filter(e=>e.id_jefe!==null).length;
   return {tabs:[["empleados",em,["id","nombre","id_jefe"]]], sql:"DELETE FROM empleados\nWHERE id_jefe <> 1;", q:"¿Cuántas filas elimina la sentencia?",
   o:[SQ.sc(SQ.filas(em.filter(e=>e.id_jefe!==null&&e.id_jefe!==1).length)),SQ.sc(SQ.filas(em.filter(e=>e.id_jefe!==1).length)),SQ.sc(SQ.filas(t))],
   e:"Solo se eliminan las filas donde la condición es verdadera. Para el empleado con id_jefe NULL, “NULL <> 1” es desconocido, no verdadero, así que no se elimina.",
   w:["Ese número cuenta también al empleado con id_jefe NULL; la comparación con NULL no es verdadera.","Sin WHERE se borraría todo; aquí solo se borran las filas que cumplen la condición."]}; }},
 // ---------- Inventario ----------
 {cat:"Funciones",gen(){ const pr=SQ.productos(); const A=pr.filter(p=>p.nombre[1]==="a"), B=pr.filter(p=>p.nombre.toLowerCase().includes("a")), C=pr.filter(p=>p.nombre.toLowerCase().startsWith("a")); if(!A.length) return null; const m=x=>x.map(p=>[p.nombre]).sort();
   return {tabs:[["productos",pr,["id","nombre","precio"]]], sql:"SELECT nombre\nFROM productos\nWHERE nombre LIKE '_a%'\nORDER BY nombre;", q:"¿Qué devuelve la consulta? (sin distinguir mayúsculas)",
   o:[SQ.res(["nombre"],m(A)),SQ.res(["nombre"],m(B)),SQ.res(["nombre"],m(C))],
   e:"En LIKE, _ representa exactamente un carácter y % cualquier cantidad. '_a%' busca nombres cuya segunda letra es a.",
   w:["Ese resultado sería LIKE '%a%' (contiene una a en cualquier posición); _ ocupa exactamente un carácter.","Ese resultado sería LIKE 'a%' (empieza con a)."]}; }},
 {cat:"Agregación",gen(){ const pr=SQ.productos(); const c="Cómputo"; const xs=pr.filter(p=>p.categoria===c); const A=xs.reduce((s,p)=>s+p.precio*p.stock,0), B=xs.reduce((s,p)=>s+p.precio,0)*xs.reduce((s,p)=>s+p.stock,0), C=xs.reduce((s,p)=>s+p.precio,0); if(A===0) return null;
   return {tabs:[["productos",pr,["id","nombre","categoria","precio","stock"]]], sql:"SELECT SUM(precio * stock) AS valor\nFROM productos\nWHERE categoria = 'Cómputo';", q:"¿Qué devuelve la consulta?",
   o:[SQ.sc(A.toLocaleString("es-MX")),SQ.sc(B.toLocaleString("es-MX")),SQ.sc(C.toLocaleString("es-MX"))],
   e:"La expresión precio * stock se calcula por fila y SUM suma esos productos: es el valor del inventario de esa categoría.",
   w:["Ese número multiplica la suma de precios por la suma de existencias, que no es lo mismo que sumar cada precio × stock.","Ese número solo suma los precios e ignora el stock."]}; }},
 {cat:"NULL",gen(){ const pr=SQ.productos(true); const v=pr.map(p=>p.stock), nn=v.filter(x=>x!==null); const s=nn.reduce((a,b)=>a+b,0);
   return {tabs:[["productos",pr,["id","nombre","stock"]]], sql:"SELECT AVG(COALESCE(stock, 0))\nFROM productos;", q:"¿Qué devuelve la consulta? (redondeado a 2 decimales)",
   o:[SQ.sc(String(SQ.f2(s/v.length))),SQ.sc(String(SQ.f2(s/nn.length))),SQ.sc("NULL")],
   e:"COALESCE convierte el NULL en 0 antes de promediar, así que esa fila sí cuenta: se divide entre "+v.length+" filas.",
   w:["Ese sería AVG(stock) sin COALESCE, que ignora el NULL y divide entre "+nn.length+".","COALESCE ya reemplazó el NULL por 0; el promedio no puede ser NULL."]}; }},
 {cat:"Orden",gen(){ const pr=SQ.productos(); const s=SQ.sortBy(pr,(a,b)=>a.precio-b.precio); const m=x=>x.map(p=>[p.nombre,p.precio]);
   return {tabs:[["productos",pr,["id","nombre","precio"]]], sql:"SELECT nombre, precio\nFROM productos\nORDER BY precio\nLIMIT 2 OFFSET 2;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre","precio"],m(s.slice(2,4))),SQ.res(["nombre","precio"],m(s.slice(0,2))),SQ.res(["nombre","precio"],m(s.slice(1,3)))],
   e:"OFFSET 2 se salta las dos primeras filas ya ordenadas y LIMIT 2 toma las dos siguientes: el tercer y cuarto producto más baratos. Así se pagina un resultado.",
   w:["Esas son las dos primeras filas: el resultado sin OFFSET.","OFFSET 2 se salta dos filas completas; ese resultado solo se salta una."]}; }},
 {cat:"Subconsultas",gen(){ const pr=SQ.productos(); const av=pr.reduce((s,p)=>s+p.precio,0)/pr.length; const A=pr.filter(p=>p.precio>av).length, B=pr.filter(p=>p.precio<av).length; const md=SQ.sortBy(pr,(a,b)=>a.precio-b.precio)[Math.floor(pr.length/2)].precio; const C=pr.filter(p=>p.precio>md).length; if(A===C) return null;
   return {tabs:[["productos",pr,["id","nombre","precio"]]], sql:"SELECT COUNT(*)\nFROM productos\nWHERE precio > (SELECT AVG(precio) FROM productos);", q:"¿Qué devuelve la consulta?",
   o:[SQ.sc(String(A)),SQ.sc(String(B)),SQ.sc(String(C))],
   e:"La subconsulta devuelve un solo valor, el precio promedio ("+SQ.f2(av)+"), y se cuentan los productos que lo superan. Con pocos precios muy altos, el promedio queda arriba de la mayoría.",
   w:["Ese conteo corresponde a los que están por debajo del promedio.","Ese conteo usa el precio de en medio (la mediana) en lugar del promedio."]}; }},
 {cat:"Agregación",gen(){ const pr=SQ.productos(); const g={}; pr.forEach(p=>g[p.categoria]=(g[p.categoria]||0)+p.stock); const ks=Object.keys(g).sort(); const N=15; const A=ks.filter(k=>g[k]>N), C=ks.filter(k=>pr.some(p=>p.categoria===k&&p.stock>N)); if(!A.length||A.length===ks.length) return null; if(JSON.stringify(A)===JSON.stringify(C)) return null;
   return {tabs:[["productos",pr,["id","nombre","categoria","stock"]]], sql:"SELECT categoria, SUM(stock) AS total\nFROM productos\nGROUP BY categoria\nHAVING SUM(stock) > 15\nORDER BY categoria;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["categoria","total"],A.map(k=>[k,g[k]])),SQ.res(["categoria","total"],ks.map(k=>[k,g[k]])),SQ.res(["categoria","total"],C.map(k=>[k,pr.filter(p=>p.categoria===k&&p.stock>N).reduce((s,p)=>s+p.stock,0)]))],
   e:"Se suma el stock de cada categoría y HAVING deja las categorías cuyo total supera 15.",
   w:["Ese es el resultado sin HAVING.","Ese resultado filtra productos individuales con stock mayor a 15 antes de sumar, como si fuera WHERE stock > 15."]}; }},
 // ---------- Tienda ----------
 {cat:"Subconsultas",gen(){ const cl=SQ.clientes(SQ.r(4,5)), pe=SQ.pedidos(cl,SQ.r(5,6)); const big=pe.filter(p=>p.total>500); if(big.length<2) return null; const ids=[...new Set(big.map(p=>p.id_cliente))]; if(ids.length===big.length) return null; const nm=i=>cl.find(c=>c.id===i).nombre;
   const con=[...new Set(pe.map(p=>p.id_cliente))].map(nm).sort();
   return {tabs:[["clientes",cl,["id","nombre"]],["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT nombre\nFROM clientes\nWHERE id IN (SELECT id_cliente\n             FROM pedidos\n             WHERE total > 500)\nORDER BY nombre;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["nombre"],ids.map(nm).sort().map(x=>[x])),SQ.res(["nombre"],big.map(p=>nm(p.id_cliente)).sort().map(x=>[x])),SQ.res(["nombre"],con.map(x=>[x]))],
   e:"IN solo pregunta si el id está en la lista, así que cada cliente aparece una vez aunque tenga varios pedidos mayores a 500. Un JOIN sí lo repetiría.",
   w:["Ese resultado repite clientes: es lo que haría un JOIN con pedidos, no IN.","Esos son todos los clientes con algún pedido; la subconsulta solo incluye pedidos mayores a 500."]}; }},
 {cat:"JOIN",gen(){ const cl=SQ.clientes(5), pe=SQ.pedidos(cl,SQ.r(5,6)); const g={}; pe.forEach(p=>{ const c=cl.find(x=>x.id===p.id_cliente).ciudad; g[c]=(g[c]||0)+1; }); const cc={}; cl.forEach(c=>cc[c.ciudad]=(cc[c.ciudad]||0)+1); const ks=Object.keys(g).sort(), all=Object.keys(cc).sort(); if(JSON.stringify(ks.map(k=>g[k]))===JSON.stringify(ks.map(k=>cc[k]))) return null;
   return {tabs:[["clientes",cl,["id","nombre","ciudad"]],["pedidos",pe,["id","id_cliente","total"]]], sql:"SELECT c.ciudad, COUNT(*) AS pedidos\nFROM pedidos p\nJOIN clientes c ON c.id = p.id_cliente\nGROUP BY c.ciudad\nORDER BY c.ciudad;", q:"¿Qué devuelve la consulta?",
   o:[SQ.res(["ciudad","pedidos"],ks.map(k=>[k,g[k]])),SQ.res(["ciudad","pedidos"],all.map(k=>[k,cc[k]])),SQ.res(["ciudad","pedidos"],ks.map(k=>[k,new Set(pe.filter(p=>cl.find(x=>x.id===p.id_cliente).ciudad===k).map(p=>p.id_cliente)).size]))],
   e:"Cada pedido se une con la ciudad de su cliente y se cuentan los pedidos por ciudad. Las ciudades cuyos clientes no tienen pedidos no aparecen.",
   w:["Ese resultado cuenta clientes por ciudad, no pedidos.","Ese resultado cuenta clientes distintos con pedido; COUNT(*) cuenta todos los pedidos."]}; }}
);
// Rotación: primero las plantillas que menos has visto, también entre sesiones
sqNew=function(){
  S.sqs=S.sqs||{};
  const pool=SQT.map((t,i)=>i).filter(i=>sqCat==="Todos"||SQT[i].cat===sqCat);
  const order=shuffle(pool).sort((a,b)=>(S.sqs[a]||0)-(S.sqs[b]||0));
  for(const ti of order.slice(0,4)){ for(let k=0;k<60;k++){ const g=SQT[ti].gen(); if(!g) continue; if(new Set(g.o.map(o=>JSON.stringify(o))).size===3){ g.ord=shuffle([0,1,2]); g.cat=SQT[ti].cat; g.ti=ti; sqCur=g; sqAns=null; S.sqs[ti]=(S.sqs[ti]||0)+1; save(); return; } } }
};
