// ===================== Formulario y resumen de la última noche =====================
const FORM_HTML=`
<section class="fsec"><h2>Formulario de cálculo</h2>
<div class="fgrid">
<div class="fbox"><h3>PERT (tres estimaciones)</h3>
<p class="fx">T<sub>e</sub> = (O + 4M + P) / 6</p><p class="fx">σ = (P − O) / 6 &nbsp;&nbsp; σ² = varianza</p>
<p>Ruta: <b>T<sub>e</sub> de la ruta</b> = suma de los T<sub>e</sub>; <b>σ de la ruta</b> = √(suma de varianzas). Nunca sumes desviaciones.</p>
<p class="fx">Z = (T objetivo − T<sub>e</sub> ruta) / σ ruta</p></div>
<div class="fbox"><h3>Ruta crítica (CPM)</h3>
<p>Ida: IT = máximo FT de las predecesoras; FT = IT + duración.<br>Regreso: FT tardío = mínimo IT tardío de las sucesoras; IT tardío = FT tardío − duración.</p>
<p class="fx">Holgura = IT tardío − IT temprano</p><p>Ruta crítica: la más larga, con holgura 0. Un retraso mayor que la holgura retrasa el proyecto por la diferencia.</p></div>
<div class="fbox"><h3>COCOMO básico</h3>
<p class="fx">E = a · KLOC<sup>b</sup> (personas-mes) &nbsp; D = c · E<sup>d</sup> (meses) &nbsp; Personas = E / D</p>
<table class="ft"><tr><th>Modo</th><th>a</th><th>b</th><th>c</th><th>d</th></tr><tr><td>Orgánico (equipo pequeño, conocido)</td><td>2.4</td><td>1.05</td><td>2.5</td><td>0.38</td></tr><tr><td>Semiacoplado (intermedio)</td><td>3.0</td><td>1.12</td><td>2.5</td><td>0.35</td></tr><tr><td>Empotrado (restricciones fuertes)</td><td>3.6</td><td>1.20</td><td>2.5</td><td>0.32</td></tr></table></div>
<div class="fbox"><h3>Complejidad ciclomática (McCabe)</h3>
<p class="fx">V(G) = E − N + 2 &nbsp;=&nbsp; predicados + 1 &nbsp;=&nbsp; regiones cerradas + 1</p>
<p>Cada if, while, for, case y cada AND/OR dentro de una condición suman un predicado. V(G) = número mínimo de casos para cubrir los caminos independientes.</p></div>
<div class="fbox"><h3>Riesgo y valor ganado</h3>
<p class="fx">Exposición = probabilidad × impacto</p>
<p>Se atiende primero la mayor exposición, no la más probable.</p>
<p class="fx">CPI = EV / AC &nbsp;&nbsp; SPI = EV / PV</p><p>Menor que 1: sobrecosto (CPI) o atraso (SPI).</p></div>
<div class="fbox"><h3>Pruebas de caja negra</h3>
<p><b>Partición de equivalencia:</b> una clase válida y las inválidas (debajo, arriba, tipo incorrecto).</p>
<p><b>Valores límite</b> para el rango [a, b]: a−1, a, b, b+1 (y opcionalmente a+1, b−1). En cada frontera entre rangos se prueban los dos lados exactos.</p></div>
<div class="fbox"><h3>Complejidad de algoritmos</h3>
<p>Ciclo simple O(n) · dos ciclos anidados O(n²) · la variable se duplica o se divide O(log n) · ciclo de n con uno interno que se duplica O(n log n).</p>
<p>Búsqueda binaria O(log n) · lineal O(n) · Merge sort O(n log n) · Burbuja O(n²) · Quicksort promedio O(n log n), peor O(n²).</p></div>
<div class="fbox"><h3>Versionado semántico</h3>
<p class="fx">MAYOR . MENOR . PARCHE</p><p>Cambio incompatible → MAYOR y lo demás a 0 · función nueva compatible → MENOR y parche a 0 · corrección → PARCHE.</p></div>
</div></section>

<section class="fsec"><h2>Área 1 · Análisis de sistemas</h2>
<div class="fgrid">
<div class="fbox"><h3>Tipos de requerimientos</h3><p><b>Negocio:</b> meta de la organización, medible. <b>Usuario:</b> tarea que hace la persona. <b>Funcional:</b> lo que hace el sistema. <b>No funcional:</b> cómo (rendimiento, seguridad, disponibilidad, usabilidad). <b>Dominio:</b> regla del campo o de una ley. <b>Restricción:</b> plazos, presupuesto, licencias, tecnología impuesta. <b>Calidad interna:</b> propiedades del código (complejidad, cobertura).</p><p>Buen requerimiento: completo, correcto, verificable (métrica), consistente, factible, sin ambigüedad.</p></div>
<div class="fbox"><h3>Técnicas de elicitación</h3><p><b>Entrevista:</b> pocos expertos, temas complejos. <b>Cuestionario:</b> muchos usuarios dispersos. <b>Observación:</b> el usuario no sabe explicar lo que hace. <b>JAD / taller:</b> conflicto entre áreas, pocos decisores. <b>Prototipo:</b> el usuario no sabe lo que quiere. <b>Lluvia de ideas</b>, <b>análisis de documentos</b>.</p><p><b>Validación:</b> revisión o inspección de la SRS antes de construir.</p></div>
<div class="fbox"><h3>Priorización y factibilidad</h3><p><b>MoSCoW:</b> Must (sin esto no se libera; incluye lo legal), Should, Could, Won't (esta vez no). <b>100 puntos</b>: reparto entre interesados. <b>Planning Poker:</b> estima esfuerzo; votos extremos explican y se vuelve a votar.</p><p><b>INVEST:</b> Independiente, Negociable, Valiosa, Estimable, pequeña (Small), Testeable.</p><p><b>Factibilidad TELOS:</b> Técnica, Económica, Legal, Operativa (¿la usarán?), de calendario (Schedule).</p></div>
<div class="fbox"><h3>Casos de uso y DFD</h3><p><b>«include»</b>: siempre ocurre; flecha del base al incluido. <b>«extend»</b>: opcional o condicional; flecha de la extensión al base. <b>Generalización de actores:</b> uno hace todo lo del otro y más.</p><p><b>DFD:</b> entidad externa, proceso, almacén, flujo. Todo flujo entra o sale de un proceso: nunca entidad–almacén ni almacén–almacén. Contexto (nivel 0) = un solo proceso, sin almacenes.</p><p><b>BPMN:</b> × exclusiva (un camino), + paralela (todos), ○ inclusiva (uno o más). Entre pools: flujo de mensaje punteado.</p></div>
</div></section>

<section class="fsec"><h2>Área 2 · Diseño de sistemas</h2>
<div class="fgrid">
<div class="fbox"><h3>Patrones GoF por familia</h3><p><b>Creacionales:</b> Singleton (una instancia), Factory Method (subclase decide qué crear), Abstract Factory (familias de objetos), Builder (paso a paso), Prototype (clonar).</p><p><b>Estructurales:</b> Adapter (interfaz incompatible), Bridge, Composite (árbol parte-todo), Decorator (agregar funciones envolviendo), Facade (interfaz simple a un subsistema), Flyweight (compartir estado), Proxy (sustituto: carga perezosa, acceso).</p><p><b>Comportamiento:</b> Observer (notificar suscriptores), Strategy (cambiar algoritmo), State (comportamiento según estado), Command (acción como objeto, deshacer), Chain of Responsibility (pasar la solicitud), Template Method (esqueleto fijo, pasos variables), Mediator (coordinador central), Memento (guardar y restaurar estado), Iterator, Visitor.</p></div>
<div class="fbox"><h3>SOLID, cohesión y acoplamiento</h3><p><b>S</b> una razón para cambiar · <b>O</b> extender sin modificar · <b>L</b> la subclase sustituye a la base sin romperla · <b>I</b> interfaces pequeñas · <b>D</b> depender de abstracciones (inyección).</p><p><b>Cohesión</b> (peor → mejor): coincidental, lógica, temporal, procedimental, comunicacional, secuencial, funcional.</p><p><b>Acoplamiento</b> (peor → mejor): contenido, común (global), externo, control (bandera), estampado, datos.</p></div>
<div class="fbox"><h3>Datos</h3><p><b>1FN:</b> valores atómicos, sin grupos repetidos. <b>2FN:</b> sin dependencias parciales de una llave compuesta. <b>3FN:</b> sin dependencias transitivas (no llave → no llave). <b>FNBC:</b> todo determinante es superllave.</p><p>Desnormalizar o vista materializada para reportes de lectura intensiva. Replicación síncrona = no perder transacciones; asíncrona = menos latencia. Fragmentación horizontal (filas), vertical (columnas), mixta. NoSQL: incrustar lo que se lee junto y es acotado; referenciar lo que crece sin límite.</p></div>
<div class="fbox"><h3>Arquitectura, UML e interfaces</h3><p><b>Microservicios:</b> despliegue y escalado independientes. <b>Capas / MVC:</b> separación de responsabilidades (reglas en el modelo). <b>Eventos:</b> desacople, consistencia eventual. Disponibilidad → redundancia y balanceo. 4+1: lógica, procesos, desarrollo, física, escenarios.</p><p><b>UML:</b> composición (rombo relleno, la parte muere con el todo) · agregación (rombo vacío) · herencia (triángulo a la superclase) · loop / alt / opt en secuencia.</p><p><b>REST:</b> GET seguro e idempotente; PUT y DELETE idempotentes; POST no; PATCH no garantizado.</p></div>
</div></section>

<section class="fsec"><h2>Área 3 · Desarrollo de sistemas</h2>
<div class="fgrid">
<div class="fbox"><h3>SQL</h3><p><b>Orden lógico:</b> FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.</p><p>WHERE filtra filas; HAVING filtra grupos. Toda columna del SELECT va en el GROUP BY o en una función de agregación. INNER = solo coincidencias; LEFT = todo lo de la izquierda con NULL.</p><p><b>NULL:</b> = NULL nunca es verdadero (usa IS NULL); COUNT(*) cuenta filas, COUNT(col) ignora NULL; AVG y SUM ignoran NULL; NOT IN con un NULL en la lista no devuelve nada. AND se evalúa antes que OR.</p><p>DELETE fila por fila y con triggers; TRUNCATE vacía de golpe; DROP borra la tabla. UNION quita duplicados; UNION ALL no.</p></div>
<div class="fbox"><h3>Transacciones y CAP</h3><p><b>ACID:</b> atomicidad, consistencia, aislamiento, durabilidad.</p><p><b>Anomalías:</b> lectura sucia (dato sin confirmar), no repetible (misma fila, otro valor), fantasma (aparecen o desaparecen filas).</p><p><b>CAP:</b> ante una partición, elegir consistencia o disponibilidad (con consistencia eventual).</p></div>
<div class="fbox"><h3>Paradigmas y lenguajes</h3><p><b>POO:</b> encapsulamiento, herencia, polimorfismo (enlace dinámico: se ejecuta el método del objeto real), abstracción. private · protected (paquete y subclases) · public · static (de la clase).</p><p><b>Funcional:</b> funciones puras, sin efectos secundarios, inmutabilidad. <b>Lógico:</b> hechos, reglas, unificación (Prolog). <b>Declarativo:</b> SQL.</p><p>Compilador (todo antes, ejecutable) vs intérprete (línea por línea). Java → bytecode → JVM. Tipado estático (al compilar) vs dinámico (al ejecutar); fuerte vs débil ("5" − 2 = 3 y "5" + 2 = "52" en JS).</p></div>
<div class="fbox"><h3>Entornos y plataformas</h3><p><b>Git:</b> branch, merge (conflictos: editar, add, commit), rebase, revert (commit inverso) vs reset (mover la rama). Lockfile y contenedores = entornos reproducibles. CI/CD. Mocks para aislar dependencias. Refactorizar = mejorar estructura sin cambiar comportamiento.</p><p><b>Nube:</b> IaaS (controlas el SO), PaaS (solo tu código), SaaS (software listo), FaaS (funciones por evento). Contenedores comparten kernel; las VM cargan su propio SO. Kubernetes orquesta. RTOS para plazos estrictos. Nativo = máximo rendimiento; Flutter = multiplataforma; PWA = acceso limitado al hardware.</p></div>
</div></section>

<section class="fsec"><h2>Área 4 · Gestión de proyectos</h2>
<div class="fgrid">
<div class="fbox"><h3>Pruebas</h3><p>Unitaria → integración → sistema → aceptación. Integración descendente usa stubs; ascendente usa drivers. Caja blanca (estructura: sentencias, ramas, caminos) vs caja negra (entradas y salidas). Cobertura de ramas ≥ cobertura de sentencias.</p><p>Alfa: en el sitio del desarrollador · beta: usuarios reales en su entorno · humo: chequeo rápido de la build · regresión: el cambio no rompió nada · carga: demanda esperada · estrés: más allá del límite.</p></div>
<div class="fbox"><h3>Calidad</h3><p><b>ISO/IEC 25010:2011</b> (8): adecuación funcional, eficiencia de desempeño, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad, portabilidad. En la versión 2023 son 9: usabilidad pasa a capacidad de interacción, portabilidad a flexibilidad y se agrega protección (safety).</p><p>Seguridad: confidencialidad, integridad, no repudio, responsabilidad (rastrear quién hizo qué), autenticidad. Calidad en uso: eficacia, eficiencia, satisfacción, libertad de riesgo, cobertura de contexto.</p><p><b>CMMI:</b> 1 Inicial · 2 Gestionado · 3 Definido · 4 Gestionado cuantitativamente · 5 En optimización.</p></div>
<div class="fbox"><h3>Mantenimiento e implantación</h3><p>Correctivo (defecto) · adaptativo (cambia el entorno: SO, ley, plataforma) · perfectivo (mejorar lo que funciona) · preventivo (evitar fallas futuras, refactorizar).</p><p>Implantación directa (rápida, riesgosa) · paralela (dos sistemas a la vez, la más segura) · piloto (una sede) · por fases (por módulos).</p><p>Licencias: MIT y Apache permisivas · GPL copyleft (el derivado distribuido debe ser GPL) · LGPL copyleft débil.</p></div>
<div class="fbox"><h3>Metodologías</h3><p><b>Scrum 2020:</b> Product Owner (qué y valor; puede cancelar el Sprint), Scrum Master (facilita), Developers (cómo). Sprint ≤ 1 mes · Planning ≤ 8 h · Daily 15 min · Review ≤ 4 h · Retrospectiva ≤ 3 h (para Sprint de un mes). Equipos de 10 o menos; si crecen, varios equipos con un mismo Product Backlog y un mismo PO.</p><p><b>Kanban:</b> flujo continuo, límites WIP. <b>XP:</b> parejas, TDD, integración continua. <b>RUP:</b> inicio, elaboración, construcción, transición. <b>Espiral:</b> análisis de riesgos en cada vuelta. <b>Cascada:</b> requisitos estables. <b>V:</b> cada fase con su prueba.</p></div>
</div></section>

<section class="fsec"><h2>Lenguaje y Comunicación</h2>
<div class="fgrid">
<div class="fbox"><h3>Comprensión lectora</h3><p>Idea principal: la que engloba todo el texto, a menudo al inicio o al final. Inferencia: lo que se deduce sin estar escrito; desconfía de absolutos (siempre, nunca, todos). Conectores: “sin embargo”, “no obstante” y “aun así” contrastan; “por lo tanto” indica consecuencia; “es decir” reformula; “además” suma.</p></div>
<div class="fbox"><h3>Redacción</h3><p>Gerundio solo para simultaneidad o anterioridad, nunca posterioridad ni como adjetivo. “Si hubiera…, habría…”. Pasiva refleja concuerda: “se venden casas”. Punto y coma para separar elementos con comas internas. Días y meses en minúscula. Adverbios en -mente conservan la tilde del adjetivo. “Sobre todo” (principalmente) vs “sobretodo” (abrigo). Evita redundancias: “volver a repetir”, “subir arriba”.</p></div>
</div></section>

<section class="fsec"><h2>La noche del 3 de diciembre</h2>
<div class="fbox"><ul class="fcheck"><li>Repasa solo este formulario y tus errores marcados: nada de temas nuevos.</li><li>Ten listos tu pase de ingreso y una identificación vigente y autorizada; revisa en el pase la sede, la hora y la modalidad (impreso, en línea o desde casa). Si es impreso, la hoja de respuestas se llena con lápiz. Puedes llevar calculadora científica no programable (no se presta entre sustentantes).</li><li>La sesión 1 dura 4 h 30 min y la 2 dura 4 h 30 min con lenguaje al final: lleva agua y algo ligero para el receso.</li><li>Duerme al menos 7 horas. Rendir con 92 reactivos seguidos depende más del descanso que de una hora extra de estudio.</li><li>En el examen: no dejes nada en blanco (no hay penalización), descarta primero la opción claramente falsa y marca las dudosas para regresar.</li></ul></div></section>`;
function formSetup(){
  $("#formBox").innerHTML=`<div class="row noprint" style="margin-top:0;align-items:center"><button class="btn pri" id="fDl">Descargar PDF</button><span class="mut" id="fDlMsg">5 páginas tamaño carta, en blanco para imprimir.</span><button class="lnk" id="fPrint" style="margin-left:auto">Imprimir esta página</button></div><div class="formsheet">${FORM_HTML}</div>`;
  $("#fDl").onclick=formDownload;
  $("#fPrint").onclick=()=>{ try{ window.print(); }catch(e){ toast("Usa Ctrl + P para imprimir"); } };
}

async function formDownload(){
  const btn=$("#fDl"), msg=$("#fDlMsg");
  const c=window.claude; let dl=null;
  if(c && typeof c.use==="function"){ btn.disabled=true; btn.textContent="Preparando…"; try{ dl=await c.use("downloads"); }catch(e){ dl=null; } }
  if(!dl && /^https?:$/.test(location.protocol)){ btn.disabled=false; btn.textContent="Descargar PDF"; const a=document.createElement("a"); a.href="formulario-egel-isoft.pdf"; a.download="Formulario EGEL ISOFT.pdf"; document.body.appendChild(a); a.click(); a.remove(); msg.textContent="Listo: el PDF se está descargando."; return; }
  if(!dl){ btn.disabled=false; btn.textContent="Descargar PDF"; msg.textContent="Aquí no se puede descargar directamente: en el diálogo de impresión elige “Guardar como PDF”."; try{ window.print(); }catch(e){} return; }
  try{
    const r=await fetch("formulario-egel-isoft.pdf"); if(!r.ok) throw {code:"unavailable"};
    const blob=await r.blob();
    await dl.save({filename:"Formulario EGEL ISOFT.pdf", data:blob});
    msg.textContent="Listo: el PDF se descargó.";
  }catch(e){
    const code=e&&e.code;
    if(code==="declined") msg.textContent="Descarga cancelada.";
    else if(code==="rate_limited") msg.textContent="Ya hay una descarga pendiente de confirmar.";
    else { msg.textContent="No se pudo descargar aquí: usa “Imprimir esta página” y elige “Guardar como PDF”."; }
  }
  btn.disabled=false; btn.textContent="Descargar PDF";
}
