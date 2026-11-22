// ===================== Encuentra el error en el diagrama =====================
const X={
  lines(t,x,y,cls,lh){ const L=String(t).split("\n"); lh=lh||15; const y0=y-(L.length-1)*lh/2; return `<text class="${cls||"dt"}" x="${x}" y="${y0}" text-anchor="middle" dominant-baseline="middle">${L.map((s,k)=>`<tspan x="${x}" dy="${k?lh:0}">${esc(s)}</tspan>`).join("")}</text>`; },
  g(id,inner){ return id? `<g class="hit" data-id="${id}">${inner}</g>` : `<g>${inner}</g>`; },
  box(id,x,y,w,h,t,o={}){ return X.g(id,`<rect class="sh ${o.cls||""}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx==null?6:o.rx}"/>${X.lines(t,x+w/2,y+h/2,o.tc)}`); },
  circ(id,cx,cy,r,t,o={}){ return X.g(id,`<circle class="sh ${o.cls||""}" cx="${cx}" cy="${cy}" r="${r}"/>${t?X.lines(t,cx,cy):""}`); },
  ell(id,cx,cy,rx,ry,t){ return X.g(id,`<ellipse class="sh" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${X.lines(t,cx,cy)}`); },
  dia(id,cx,cy,s,t){ return X.g(id,`<path class="sh gw" d="M${cx} ${cy-s}L${cx+s} ${cy}L${cx} ${cy+s}L${cx-s} ${cy}Z"/>${X.lines(t,cx,cy,"dt big")}`); },
  store(id,x,y,w,h,code,t){ return X.g(id,`<rect class="hitbg" x="${x}" y="${y}" width="${w}" height="${h}"/><path class="sh" d="M${x+w} ${y}H${x}V${y+h}H${x+w}M${x+34} ${y}V${y+h}"/>${X.lines(code,x+17,y+h/2)}${X.lines(t,x+34+(w-34)/2,y+h/2)}`); },
  actor(id,x,y,t){ return X.g(id,`<g class="sh act"><circle cx="${x}" cy="${y}" r="9"/><path d="M${x} ${y+9}V${y+36}M${x-16} ${y+18}H${x+16}M${x} ${y+36}L${x-13} ${y+56}M${x} ${y+36}L${x+13} ${y+56}"/></g>${X.lines(t,x,y+72)}`); },
  ln(id,pts,o={}){ const d="M"+pts.map(p=>p.join(" ")).join("L"); const me=o.me?`marker-end="url(#x-${o.me})"`:"", ms=o.ms?`marker-start="url(#x-${o.ms})"`:""; const lab=o.t?`<text class="dt sm ${o.tc||""}" x="${o.lx}" y="${o.ly}" text-anchor="middle">${esc(o.t)}</text>`:""; return X.g(id,`<path class="fat" d="${d}"/><path class="sh ln ${o.dash?"dash":""}" d="${d}" ${me} ${ms}/>${lab}`); },
  tx(id,x,y,t,o={}){ const w=o.w||t.length*8+10; return X.g(id,`<rect class="hitbg" x="${x-w/2}" y="${y-12}" width="${w}" height="22" rx="4"/><text class="dt ${o.c||""}" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${esc(t)}</text>`); },
  cls(id,x,y,w,name,attrs,o={}){ const h=30+attrs.length*18+8; return X.g(id,`<rect class="sh" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/><path class="sh" d="M${x} ${y+30}H${x+w}"/><text class="dt b ${o.it?"it":""}" x="${x+w/2}" y="${y+19}" text-anchor="middle">${esc(name)}</text>${attrs.map((a,k)=>`<text class="dt sm" x="${x+10}" y="${y+48+k*18}">${esc(a)}</text>`).join("")}`); },
  svg(w,h,inner){ return `<svg class="dx" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs>
   <marker id="x-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path class="mkf" d="M0 0L10 5L0 10Z"/></marker>
   <marker id="x-open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path class="mko" d="M0 0L10 5L0 10"/></marker>
   <marker id="x-tri" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="14" markerHeight="14" orient="auto-start-reverse"><path class="mkh" d="M0 0L12 6L0 12Z"/></marker>
   <marker id="x-dia" viewBox="0 0 16 10" refX="1" refY="5" markerWidth="18" markerHeight="12" orient="auto-start-reverse"><path class="mkh" d="M1 5L8 0L15 5L8 10Z"/></marker>
   <marker id="x-diaF" viewBox="0 0 16 10" refX="1" refY="5" markerWidth="18" markerHeight="12" orient="auto-start-reverse"><path class="mkf" d="M1 5L8 0L15 5L8 10Z"/></marker>
   <marker id="x-circ" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="9" markerHeight="9"><circle class="mkh" cx="5" cy="5" r="4"/></marker>
  </defs>${inner}</svg>`; }
};
const DGX=[
{t:"DFD de nivel 1",tipo:"DFD",l:"1-3",
 intro:"DFD de nivel 1 del sistema de pedidos de una distribuidora. Los proveedores informan sus existencias y el cliente recibe la factura cuando se surte su pedido.",
 w:700,h:330,wrong:"f5",
 svg:()=>X.box(null,20,60,120,50,"Cliente",{rx:0,cls:"ent"})+X.box(null,20,250,120,50,"Proveedor",{rx:0,cls:"ent"})+X.box("p1",260,40,150,70,"1.0\nRegistrar pedido",{rx:22,cls:"proc"})+X.box("p2",260,210,150,70,"2.0\nSurtir pedido",{rx:22,cls:"proc"})+X.store("d1",500,140,180,44,"D1","Pedidos")
  +X.ln("f1",[[140,80],[258,72]],{me:"arr",t:"pedido",lx:198,ly:66})+X.ln("f2",[[410,82],[560,82],[560,138]],{me:"arr",t:"datos del pedido",lx:490,ly:74})+X.ln("f3",[[600,186],[600,245],[412,245]],{me:"arr",t:"pedido pendiente",lx:520,ly:238})+X.ln("f4",[[260,250],[200,250],[200,100],[142,100]],{me:"arr",t:"factura",lx:180,ly:178})
  +X.ln("f5",[[140,290],[640,290],[640,186]],{me:"arr",t:"existencias",lx:420,ly:310}),
 why:"Una entidad externa (Proveedor) no puede escribir directo en un almacén de datos. En un DFD todo flujo entra o sale de un proceso: faltaría un proceso, por ejemplo “3.0 Registrar existencias”, entre el proveedor y el almacén. Además, las existencias deberían ir a un almacén de inventario, no al de pedidos."},
{t:"Diagrama de contexto",tipo:"DFD",l:"1-3",
 intro:"Diagrama de contexto (DFD de nivel 0) de un sistema de nómina que recibe incidencias de los empleados, envía la dispersión al banco y declara al SAT.",
 w:700,h:320,wrong:"d1",
 svg:()=>X.circ("p0",350,160,70,"0\nSistema de\nnómina",{cls:"proc"})+X.box("e1",30,40,130,50,"Empleado",{rx:0,cls:"ent"})+X.box("e2",540,40,130,50,"Banco",{rx:0,cls:"ent"})+X.box("e3",540,240,130,50,"SAT",{rx:0,cls:"ent"})+X.store("d1",20,240,190,44,"D1","Empleados")
  +X.ln("f1",[[160,65],[292,122]],{me:"arr",t:"incidencias",lx:215,ly:80})+X.ln("f2",[[410,122],[540,65]],{me:"arr",t:"dispersión de pago",lx:500,ly:84})+X.ln("f3",[[414,192],[540,262]],{me:"arr",t:"declaración",lx:490,ly:212})+X.ln("f4",[[210,262],[286,192]],{me:"arr",t:"datos",lx:232,ly:214}),
 why:"El diagrama de contexto muestra solo el sistema como un único proceso y sus entidades externas con los flujos que intercambian. Los almacenes de datos son internos al sistema y aparecen a partir del DFD de nivel 1."},
{t:"Casos de uso: include y extend",tipo:"Casos de uso",l:"1-3",
 intro:"Cajero automático. Toda operación exige autenticar al cliente; el comprobante solo se imprime si el cliente lo pide al retirar.",
 w:700,h:360,wrong:"r2",
 svg:()=>X.actor("a1",60,130,"Cliente")+X.box(null,170,20,510,325,"",{rx:4,cls:"sys"})+`<text class="dt b" x="190" y="44">Cajero automático</text>`
  +X.ell("u1",300,100,95,30,"Retirar efectivo")+X.ell("u2",300,250,95,30,"Consultar saldo")+X.ell("u3",560,175,95,30,"Autenticar cliente")+X.ell("u4",560,60,100,28,"Imprimir comprobante")
  +X.ln("c1",[[78,160],[206,108]])+X.ln("c2",[[78,170],[206,242]])
  +X.ln("r1",[[388,112],[480,158]],{dash:1,me:"open",t:"«include»",lx:420,ly:124})+X.ln("r2",[[386,240],[480,194]],{dash:1,me:"open",t:"«extend»",lx:420,ly:240})+X.ln("r3",[[470,72],[384,90]],{dash:1,me:"open",t:"«extend»",lx:430,ly:66}),
 why:"Consultar saldo siempre requiere autenticar, así que la relación debe ser «include», igual que en Retirar efectivo. «extend» se reserva para comportamiento opcional, como imprimir el comprobante solo si el cliente lo pide."},
{t:"Casos de uso: dirección de la flecha",tipo:"Casos de uso",l:"1-3",
 intro:"Tienda en línea. Pagar un pedido siempre valida la tarjeta; aplicar un cupón es opcional y solo ocurre si el cliente tiene uno.",
 w:700,h:330,wrong:"r1",
 svg:()=>X.actor("a1",60,120,"Cliente")+X.box(null,170,20,510,290,"",{rx:4,cls:"sys"})+`<text class="dt b" x="190" y="44">Tienda en línea</text>`
  +X.ell("u1",320,160,90,30,"Pagar pedido")+X.ell("u2",570,90,90,30,"Validar tarjeta")+X.ell("u3",570,240,90,30,"Aplicar cupón")
  +X.ln("c1",[[80,155],[228,160]])+X.ln("r1",[[488,104],[400,140]],{dash:1,me:"open",t:"«include»",lx:450,ly:104})+X.ln("r2",[[490,228],[396,180]],{dash:1,me:"open",t:"«extend»",lx:450,ly:232}),
 why:"En «include» la flecha va del caso base al caso incluido: de Pagar pedido hacia Validar tarjeta. Aquí está al revés. En «extend» sí es correcto que la flecha vaya de la extensión (Aplicar cupón) al caso base."},
{t:"BPMN: comunicación entre participantes",tipo:"BPMN",l:"1-2",
 intro:"La tienda solicita el cobro al banco, que es una organización independiente; el banco valida el pago y confirma a la tienda.",
 w:720,h:330,wrong:"m1",
 svg:()=>X.box(null,10,20,700,130,"",{rx:0,cls:"pool"})+X.box(null,10,20,36,130,"",{rx:0,cls:"pool"})+`<text class="dt b" transform="translate(32 85) rotate(-90)" text-anchor="middle">Tienda</text>`
  +X.box(null,10,190,700,120,"",{rx:0,cls:"pool"})+X.box(null,10,190,36,120,"",{rx:0,cls:"pool"})+`<text class="dt b" transform="translate(32 250) rotate(-90)" text-anchor="middle">Banco</text>`
  +X.circ("s",80,85,14,"",{cls:"ev"})+X.box("t1",120,60,120,50,"Recibir pedido")+X.box("t2",290,60,120,50,"Solicitar cobro")+X.box("t3",500,60,120,50,"Enviar pedido")+X.circ("e",668,85,14,"",{cls:"evend"})
  +X.box("t4",290,225,120,50,"Validar pago")+X.box("t5",500,225,120,50,"Confirmar pago")
  +X.ln("q1",[[94,85],[118,85]],{me:"arr"})+X.ln("q2",[[240,85],[288,85]],{me:"arr"})+X.ln("q4",[[620,85],[652,85]],{me:"arr"})+X.ln("q5",[[410,250],[498,250]],{me:"arr"})
  +X.ln("m1",[[350,110],[350,223]],{me:"arr",t:"cobro",lx:376,ly:170})+X.ln("m2",[[560,223],[560,112]],{dash:1,me:"open",ms:"circ",t:"confirmación",lx:610,ly:170})+X.ln("q3",[[410,85],[498,85]],{me:"arr"}),
 why:"Entre dos pools (organizaciones distintas) no puede haber flujos de secuencia (línea continua). La comunicación se representa con un flujo de mensaje: línea punteada con círculo al inicio y flecha abierta, como la de “confirmación”."},
{t:"BPMN: tipo de compuerta",tipo:"BPMN",l:"1-2",
 intro:"Una vez confirmado el pedido siempre se cobra y se empaca, y ambas tareas pueden hacerse al mismo tiempo. El envío ocurre cuando las dos terminan.",
 w:720,h:260,wrong:"g1",
 svg:()=>X.circ("s",30,130,14,"",{cls:"ev"})+X.box("t1",70,105,120,50,"Confirmar\npedido")+X.dia("g1",250,130,24,"×")+X.box("t2",320,40,110,50,"Cobrar")+X.box("t3",320,170,110,50,"Empacar")+X.dia("g2",500,130,24,"+")+X.box("t4",560,105,100,50,"Enviar")+X.circ("e",695,130,14,"",{cls:"evend"})
  +X.ln("a",[[44,130],[68,130]],{me:"arr"})+X.ln("b",[[190,130],[224,130]],{me:"arr"})+X.ln("c",[[250,106],[250,65],[318,65]],{me:"arr"})+X.ln("d",[[250,154],[250,195],[318,195]],{me:"arr"})+X.ln("f",[[430,65],[500,65],[500,104]],{me:"arr"})+X.ln("h",[[430,195],[500,195],[500,156]],{me:"arr"})+X.ln("i",[[524,130],[558,130]],{me:"arr"})+X.ln("j",[[660,130],[679,130]],{me:"arr"}),
 why:"La compuerta exclusiva (×) elige solo uno de los caminos. Como cobrar y empacar ocurren siempre y al mismo tiempo, la división debe ser una compuerta paralela (+), igual que la que las une antes de enviar."},
{t:"Clases: agregación o composición",tipo:"Clases UML",l:"2-2d",
 intro:"Un cliente hace pedidos. Una línea de pedido no existe sin su pedido: si se elimina el pedido, se eliminan sus líneas.",
 w:700,h:240,wrong:"r2",
 svg:()=>X.cls("c1",20,60,170,"Cliente",["- nombre: String","- correo: String"])+X.cls("c2",270,60,170,"Pedido",["- fecha: Date","- total: Decimal"])+X.cls("c3",510,60,170,"LíneaPedido",["- cantidad: int","- precio: Decimal"])
  +X.ln("r1",[[190,100],[270,100]])+`<text class="dt sm" x="200" y="92">1</text><text class="dt sm" x="236" y="92">0..*</text>`
  +X.ln("r2",[[441,100],[510,100]],{ms:"dia"})+`<text class="dt sm" x="460" y="122">1</text><text class="dt sm" x="478" y="92">1..*</text>`,
 why:"Si las líneas no pueden existir sin el pedido y mueren con él, la relación es una composición: rombo relleno del lado de Pedido. El rombo vacío (agregación) indica que las partes pueden existir por separado."},
{t:"Clases: multiplicidad",tipo:"Clases UML",l:"2-2d",
 intro:"Cada empleado pertenece exactamente a un departamento, y un departamento tiene uno o más empleados. Un empleado puede trabajar en varios proyectos y un proyecto tiene varios empleados.",
 w:700,h:250,wrong:"m1",
 svg:()=>X.cls("c1",20,70,170,"Departamento",["- nombre: String"])+X.cls("c2",270,70,170,"Empleado",["- nombre: String","- sueldo: Decimal"])+X.cls("c3",510,70,170,"Proyecto",["- clave: String"])
  +X.ln(null,[[190,105],[270,105]])+X.tx("m1",212,90,"0..*")+X.tx("m2",246,124,"1..*")
  +X.ln(null,[[441,105],[510,105]])+X.tx("m3",462,90,"*")+X.tx("m4",490,124,"*"),
 why:"La multiplicidad junto a Departamento indica a cuántos departamentos pertenece un empleado. Debe ser 1 (exactamente uno); 0..* permitiría empleados sin departamento o con varios. El 1..* junto a Empleado sí es correcto."},
{t:"Clases: herencia",tipo:"Clases UML",l:"2-2d",
 intro:"Perro y Gato son subclases de la clase abstracta Animal.",
 w:700,h:300,wrong:"r2",
 svg:()=>X.cls("c1",265,20,170,"Animal",["# nombre: String","+ hacerSonido()"],{it:1})+X.cls("c2",90,200,160,"Perro",["+ hacerSonido()"])+X.cls("c3",450,200,160,"Gato",["+ hacerSonido()"])
  +X.ln("r1",[[170,198],[170,150],[300,150],[300,106]],{me:"tri"})+X.ln("r2",[[400,106],[400,150],[530,150],[530,198]],{me:"tri"}),
 why:"En la generalización, el triángulo vacío apunta a la superclase. En la relación de Gato el triángulo apunta a Gato, lo que diría que Animal hereda de Gato. Debe apuntar a Animal, como en la relación de Perro."},
{t:"Secuencia: fragmento combinado",tipo:"Secuencia UML",l:"2-2d",
 intro:"El sistema prepara la lista de destinatarios y después envía un correo a cada destinatario de la lista.",
 w:700,h:330,wrong:"fr",
 svg:()=>X.box("o1",120,20,150,40,":Sistema",{rx:2})+X.box("o2",430,20,170,40,":ServicioCorreo",{rx:2})+`<path class="sh ln dash life" d="M195 60V310M515 60V310"/>`
  +X.ln("m1",[[195,95],[245,95],[245,120],[199,120]],{me:"arr",t:"prepararLista()",lx:300,ly:104})
  +X.g("fr",`<rect class="sh frag" x="140" y="150" width="440" height="140"/><path class="sh" d="M140 172H340L350 162V150"/><text class="dt sm b" x="148" y="166">opt [para cada destinatario]</text>`)
  +X.ln("m2",[[195,210],[511,210]],{me:"arr",t:"enviarCorreo(destinatario)",lx:355,ly:200})+X.ln("m3",[[515,250],[199,250]],{dash:1,me:"open",t:"confirmación",lx:355,ly:242}),
 why:"El fragmento opt ejecuta su contenido una sola vez, si se cumple la condición. Para repetir el envío por cada destinatario se usa el fragmento loop."},
{t:"Máquina de estados",tipo:"Estados UML",l:"2-2d",
 intro:"Un pedido nace en Borrador, se envía y queda Aprobado o Rechazado. Uno rechazado se puede reabrir y vuelve a Borrador; uno aprobado termina su ciclo.",
 w:720,h:300,wrong:"t5",
 svg:()=>`<circle class="mkf" cx="30" cy="80" r="11"/>`+X.box("s1",80,55,120,50,"Borrador",{rx:20})+X.box("s2",280,55,120,50,"Enviado",{rx:20})+X.box("s3",500,20,130,50,"Aprobado",{rx:20})+X.box("s4",500,150,130,50,"Rechazado",{rx:20})
  +X.g("fin",`<circle class="sh" cx="680" cy="110" r="14"/><circle class="mkf" cx="680" cy="110" r="8"/>`)
  +X.ln("t0",[[42,80],[78,80]],{me:"arr"})+X.ln("t1",[[200,80],[278,80]],{me:"arr",t:"enviar",lx:240,ly:72})+X.ln("t2",[[400,70],[498,45]],{me:"arr",t:"aprobar",lx:445,ly:46})+X.ln("t3",[[400,92],[498,170]],{me:"arr",t:"rechazar",lx:430,ly:146})
  +X.ln("t4",[[630,45],[674,98]],{me:"arr"})+X.ln("t5",[[680,124],[680,260],[140,260],[140,107]],{me:"arr",t:"reabrir",lx:410,ly:252}),
 why:"Del estado final no puede salir ninguna transición: ahí termina el ciclo de vida. La transición “reabrir” debe salir de Rechazado hacia Borrador."},
{t:"Modelo relacional: llave foránea",tipo:"Modelo relacional",l:"2-2c",
 intro:"Un departamento tiene muchos empleados; cada empleado pertenece a un solo departamento. Toca la columna que está mal ubicada.",
 w:700,h:240,wrong:"k3",
 svg:()=>X.box(null,40,30,250,36,"DEPARTAMENTO",{rx:0,cls:"th"})+X.box("k1",40,66,250,34,"PK  id_depto",{rx:0})+X.box("k2",40,100,250,34,"nombre",{rx:0})+X.box("k3",40,134,250,34,"FK  id_empleado",{rx:0})
  +X.box(null,410,30,250,36,"EMPLEADO",{rx:0,cls:"th"})+X.box("k4",410,66,250,34,"PK  id_empleado",{rx:0})+X.box("k5",410,100,250,34,"nombre",{rx:0})+X.box("k6",410,134,250,34,"sueldo",{rx:0}),
 why:"En una relación uno a muchos, la llave foránea va en la tabla del lado “muchos”. EMPLEADO debe tener id_depto como llave foránea; con id_empleado en DEPARTAMENTO, cada departamento solo podría tener un empleado."}
];
let dgI=0, dgPick=null;
function dgSetup(){
  S.dgx=S.dgx||{};
  const e=DGX[dgI];
  const done=Object.keys(S.dgx).length, okN=Object.values(S.dgx).filter(v=>v===1).length;
  $("#dgxBox").innerHTML=`<p class="mut">El CENEVAL muestra un diagrama y pregunta qué está mal. Lee el caso, analiza el diagrama y toca el elemento que tiene el error. Llevas ${done} de ${DGX.length} resueltos${done?`, ${okN} al primer intento`:""}.</p>
  <div class="chips" id="dgList">${DGX.map((d,k)=>`<button class="chip ${k===dgI?"on":""} ${S.dgx[k]===1?"dok":S.dgx[k]===0?"dbad":""}" data-k="${k}">${k+1}. ${esc(d.tipo)}</button>`).join("")}</div>
  <div class="card"><span class="fxh">${esc(e.tipo)} · ejercicio ${dgI+1} de ${DGX.length}</span><h2 style="margin-top:6px">${esc(e.t)}</h2>
  <div class="ctx"><b>Caso</b><p>${esc(e.intro)}</p></div>
  <p class="mut" id="dgMsg">Toca el elemento que tiene el error.</p>
  <div class="dxwrap ${dgPick!=null?"done":""}">${X.svg(e.w,e.h,e.svg())}</div>
  <div id="dgFb"></div>
  <div class="row"><button class="btn" id="dgPrev" ${dgI===0?"disabled":""}>← Anterior</button><button class="btn pri" id="dgNext">${dgI===DGX.length-1?"Volver al primero":"Siguiente diagrama →"}</button></div></div>`;
  $("#dgList").onclick=ev=>{ const b=ev.target.closest("[data-k]"); if(b){ dgI=+b.dataset.k; dgPick=null; dgSetup(); } };
  $("#dgPrev").onclick=()=>{ dgI--; dgPick=null; dgSetup(); };
  $("#dgNext").onclick=()=>{ dgI=(dgI+1)%DGX.length; dgPick=null; dgSetup(); window.scrollTo(0,0); };
  const svg=$("#dgxBox svg.dx");
  if(dgPick!=null) dgShow(svg, e);
  svg.onclick=ev=>{ if(dgPick!=null) return; const h=ev.target.closest(".hit"); if(!h) return; dgPick=h.dataset.id; if(S.dgx[dgI]===undefined){ S.dgx[dgI]= dgPick===e.wrong?1:0; save(); } dgShow(svg,e); };
}
function dgShow(svg,e){
  const ok=dgPick===e.wrong;
  svg.closest(".dxwrap").classList.add("done");
  const w=svg.querySelector(`.hit[data-id="${e.wrong}"]`); if(w) w.classList.add("isok");
  if(!ok){ const p=svg.querySelector(`.hit[data-id="${dgPick}"]`); if(p) p.classList.add("isbad"); }
  $("#dgMsg").textContent = ok? "Encontraste el error." : "Ese elemento está bien. El error es el que se marca en verde.";
  const L=LESSONS.find(l=>l.id===e.l);
  $("#dgFb").innerHTML=`<div class="fb ${ok?"good":"bad"}"><div class="fbh">${ok?"¡Correcto!":"No era ese."}</div><p>${esc(e.why)}</p>${L?`<button class="lessonlink" onclick="openLesson('${L.id}')">Estudiar este tema: ${esc(L.t)} →</button>`:""}</div>`;
}
