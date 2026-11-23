// ===== Temario ampliado: Áreas 1 y 2 (se agrega al final de cada lección) =====
const LBX = {};

// ---------------------------------------------------------------- 1-1
LBX["1-1"] = [
["Clasificar, caso por caso",`<p>Imagina el sistema de citas de una clínica veterinaria. Estos son enunciados reales de su documento de requerimientos. Intenta clasificarlos antes de ver la columna de la derecha:</p>
${tbl(["Enunciado","Tipo","Por qué"],[
["Reducir 25% las citas perdidas en el primer año","Negocio","Es una meta de la organización, medible, que justifica el proyecto"],
["El recepcionista agenda una cita para una mascota","Usuario","Describe una tarea que hace una persona con el sistema"],
["El sistema impide agendar dos citas al mismo veterinario a la misma hora","Funcional","Es un comportamiento concreto del sistema"],
["La agenda del día carga en menos de 2 s con 50 recepcionistas conectados","No funcional (rendimiento)","No dice qué hace, sino qué tan bien lo hace; tiene métrica"],
["Las vacunas antirrábicas se registran con lote y fecha, como exige la norma sanitaria","Dominio","La regla viene del campo de aplicación, no del cliente"],
["Debe entregarse antes de diciembre usando la base de datos que ya tiene licencia","Restricción","Limita cómo y cuándo se construye, no lo que hace"],
["Solo el veterinario tratante puede ver las notas clínicas","No funcional (seguridad)","Restringe el acceso a la información"],
["Ningún método debe superar una complejidad ciclomática de 10","Calidad interna","Habla del código, no del comportamiento visible"]])}
${note("Truco del examen: si el enunciado tiene un <b>verbo de acción del sistema</b> (calcula, registra, envía, impide) es funcional. Si tiene un <b>adjetivo o una métrica</b> (rápido, seguro, disponible, en menos de…) es no funcional. Si menciona una <b>ley, norma o regla del oficio</b>, es de dominio.")}`],
["Las características de un buen requerimiento",`<p>Un analista escribió: <i>“El sistema deberá ser fácil de usar y responder rápido.”</i> El cliente lo aprobó, el equipo lo construyó y en la entrega nadie se puso de acuerdo en si se cumplió. El problema no fue el código: fue el requerimiento.</p>
<p>La norma ISO/IEC/IEEE 29148 (sucesora de la IEEE 830) pide que cada requerimiento sea:</p>
${tbl(["Característica","Qué significa","Señal de que falla"],[
["Completo","Tiene toda la información para construirlo y probarlo","“Enviará una notificación” (¿por qué canal?, ¿cuándo?, ¿a quién?)"],
["Correcto","Lo que dice corresponde a la necesidad real","Pide calcular con una tarifa de impuestos que ya no está vigente"],
["No ambiguo","Solo admite una interpretación","“Rápido”, “amigable”, “adecuado”, “etc.”"],
["Verificable","Se puede probar con un criterio objetivo","No tiene métrica ni condición de prueba"],
["Consistente","No contradice a otros requerimientos","Uno pide guardar 5 años de historial y otro borrar a los 2"],
["Factible","Se puede construir con los recursos y la tecnología disponibles","Disponibilidad de 100% con un solo servidor"],
["Trazable","Se sabe de dónde viene y a qué diseño, código y prueba lleva","Nadie sabe quién lo pidió ni por qué"],
["Priorizado","Tiene una importancia asignada","Todo es “indispensable”"]])}
<p>Reescribir es el remedio. Compara:</p>
${tbl(["Mal escrito","Bien escrito"],[
["El sistema responderá rápido","El 95% de las búsquedas de producto responderá en 1.5 s o menos con 1,000 usuarios concurrentes"],
["El sistema será seguro","Las contraseñas se almacenarán con hash bcrypt y la sesión expirará tras 15 minutos de inactividad"],
["El sistema será fácil de usar","Un usuario nuevo completará su primera compra en menos de 3 minutos sin ayuda, en 4 de cada 5 pruebas"]])}`],
["Jerarquía y trazabilidad de los requerimientos",`<p>Los tipos de requerimiento no están sueltos: forman una cadena que va del “por qué” al “cómo”.</p>
${svg(660,130,`${B(8,40,140,54,"Negocio\n¿por qué?","l2")}${A(148,67,176,67)}${B(176,40,140,54,"Usuario\n¿quién hace qué?","l2")}${A(316,67,344,67)}${B(344,40,160,54,"Sistema: funcional\ny no funcional","l2")}${A(504,67,532,67)}${B(532,40,120,54,"Diseño, código\ny prueba")}`,"Cada requerimiento de sistema debe poder rastrearse hasta una necesidad del usuario y una meta del negocio.")}
<p>Ejemplo: la meta “reducir 25% las citas perdidas” (negocio) se convierte en “el cliente recibe un recordatorio” (usuario), que a su vez se especifica como “el sistema envía un WhatsApp 24 horas antes de la cita” (funcional) y “el envío se realiza aunque el servidor de mensajería tarde hasta 30 s en responder” (no funcional).</p>
<p>Si un requerimiento de sistema no se puede ligar a ninguna necesidad de arriba, probablemente sobra (<i>gold plating</i>). Si una meta del negocio no tiene requerimientos de sistema debajo, falta algo. Esa revisión en ambos sentidos es lo que hace la <b>matriz de trazabilidad</b>.</p>
${note("Requerimientos <b>emergentes</b>: propiedades que solo aparecen al juntar las partes, como la confiabilidad o la seguridad del sistema completo. No se pueden asignar a un solo módulo.")}`]
];

// ---------------------------------------------------------------- 1-2
LBX["1-2"] = [
["Las técnicas de elicitación a fondo",`<p>Una cadena de farmacias quiere un sistema de inventario. El director sabe lo que quiere ver en sus reportes; los encargados de almacén hacen cosas que nunca han puesto por escrito; y hay 300 sucursales con prácticas distintas. Ninguna técnica sola obtiene todo eso.</p>
${tbl(["Técnica","Úsala cuando…","Su riesgo"],[
["Entrevista estructurada","Necesitas respuestas comparables entre varias personas","Rígida: no descubre lo que no preguntaste"],
["Entrevista semiestructurada o abierta","Hay pocos expertos y el tema es complejo","Depende de la habilidad del entrevistador; consume tiempo"],
["Cuestionario o encuesta","Son muchos usuarios dispersos y quieres datos cuantitativos","Respuestas superficiales; no permite repreguntar"],
["Observación (etnografía)","El usuario no sabe explicar su trabajo o hace pasos tácitos","Efecto Hawthorne: la gente cambia su conducta al sentirse observada"],
["Taller JAD","Varias áreas deben ponerse de acuerdo rápido","Si hay muchos participantes o un jefe que domina, no funciona"],
["Prototipo desechable","El usuario no sabe lo que quiere hasta verlo","El cliente puede creer que ya está casi terminado"],
["Prototipo evolutivo","Los requisitos se aclaran de forma gradual","Puede arrastrar mala calidad del código inicial"],
["Lluvia de ideas","Buscas ideas nuevas, no validar las existentes","Genera mucho ruido que hay que depurar"],
["Análisis de documentos","Existen formatos, reportes, manuales o leyes que ya contienen reglas","Los documentos pueden estar desactualizados"],
["Escenarios e historias","Quieres entender flujos completos desde la perspectiva del usuario","Pueden omitir casos de excepción"]])}
${note("En el examen, el caso casi siempre trae la pista: <b>pocos expertos</b> → entrevista; <b>muchos usuarios</b> → encuesta; <b>no saben explicarlo</b> → observación; <b>áreas en conflicto</b> → JAD; <b>no saben qué quieren</b> → prototipo.")}`],
["Analizar y negociar: cuando los interesados no coinciden",`<p>Ventas pide que el sistema permita vender aunque no haya existencias “para no perder al cliente”. Almacén pide bloquear cualquier venta sin existencias “para no prometer lo que no hay”. Los dos requerimientos son razonables y contradictorios.</p>
<p>En el <b>análisis</b> se detectan estos conflictos, huecos y ambigüedades, y en la <b>negociación</b> se resuelven: se buscan alternativas (vender como “sobre pedido” con fecha estimada), se priorizan y se documenta la decisión con quien tiene la autoridad.</p>
<p>Para saber a quién involucrar y cuánto, se usa la <b>matriz poder/interés</b> de los interesados:</p>
${tbl(["","Poco interés","Mucho interés"],[["<b>Mucho poder</b>","Mantener satisfecho","Gestionar de cerca (participa en decisiones)"],["<b>Poco poder</b>","Monitorear","Mantener informado"]])}
<p>Al final del análisis cada requerimiento debe quedar clasificado, priorizado, sin contradicciones y con un responsable que lo aprobó.</p>`],
["Más técnicas de priorización",`<p>MoSCoW no es la única forma de decidir qué va primero. La bibliografía oficial (Hatton) compara varias:</p>
${tbl(["Técnica","Cómo funciona","Conviene cuando…"],[
["MoSCoW","Must, Should, Could, Won't (esta vez no)","Hay una fecha fija y hay que decidir qué entra"],
["Asignación de 100 puntos","Cada interesado reparte 100 puntos entre los requerimientos; se suman","Hay varios interesados y quieres reflejar la intensidad de su preferencia"],
["Matriz valor/esfuerzo","Se grafica el valor contra el costo; primero lo de alto valor y bajo esfuerzo","El equipo puede estimar el esfuerzo con cierta confianza"],
["Modelo Kano","Clasifica en básicos (su ausencia molesta), de desempeño (más es mejor) y atractivos (sorprenden)","Diseñas un producto y te importa la satisfacción del cliente"],
["Ordenamiento por pares","Se comparan los requerimientos de dos en dos","Son pocos requerimientos y la decisión es delicada"],
["Planning Poker","Estima esfuerzo con cartas (secuencia tipo Fibonacci: 1, 2, 3, 5, 8, 13, 21…) y busca consenso","Equipos ágiles que necesitan estimar historias"]])}
${note("Planning Poker <b>estima</b>, no prioriza. Si dos personas votan 3 y 21, no se promedia: ambas explican sus supuestos y se vuelve a votar. La secuencia crece rápido a propósito: entre más grande la historia, mayor la incertidumbre.")}`],
["BPMN: la notación completa que debes reconocer",`<p>Un proceso de compra: el cliente hace el pedido (evento de inicio), la tienda valida el pago; si se rechaza, se notifica; si se aprueba, se empaca y se factura en paralelo; tres días después sin entrega se escala (temporizador); termina cuando el cliente recibe (evento de fin).</p>
${tbl(["Elemento","Cómo se ve","Para qué"],[
["Evento de inicio","Círculo de borde delgado","Lo que dispara el proceso"],
["Evento intermedio","Círculo de doble borde (reloj, sobre, etc.)","Algo que ocurre a la mitad: espera, mensaje, temporizador"],
["Evento de fin","Círculo de borde grueso","Dónde termina el proceso"],
["Tarea","Rectángulo redondeado","Trabajo atómico"],
["Subproceso","Rectángulo con un + abajo","Un conjunto de tareas que se detalla aparte"],
["Compuerta exclusiva (XOR)","Rombo con ×, o vacío","Elige <b>un solo</b> camino según una condición"],
["Compuerta paralela (AND)","Rombo con +","Activa <b>todos</b> los caminos; al unir, espera a todos"],
["Compuerta inclusiva (OR)","Rombo con círculo","Activa <b>uno o varios</b> caminos que cumplan su condición"],
["Compuerta basada en eventos","Rombo con pentágono","El camino lo decide el primer evento que ocurra"],
["Pool y carril (lane)","Rectángulo grande y sus franjas","Pool = participante (organización); carril = rol o área dentro de él"],
["Flujo de secuencia","Línea continua con flecha","Orden de las actividades dentro de un pool"],
["Flujo de mensaje","Línea punteada con círculo al inicio","Comunicación entre pools distintos"],
["Objeto de datos y asociación","Hoja con esquina doblada; línea punteada","Información que usa o produce una tarea"]])}
${note("Error típico: unir dos pools con un flujo de secuencia. Entre organizaciones distintas solo se comunican mensajes. Otro: dividir con compuerta paralela y unir con exclusiva; el proceso continuaría antes de que terminen todos los caminos.")}`],
["Validar los requerimientos",`<p>Antes de firmar la especificación, el equipo de la farmacia hace una sesión en la que lee cada requerimiento en voz alta y pregunta: ¿se puede probar?, ¿contradice a otro?, ¿falta algo? Encuentra 23 problemas. Corregirlos en ese momento cuesta minutos; encontrarlos en producción habría costado semanas.</p>
${tbl(["Técnica de validación","En qué consiste"],[
["Revisión","Lectura del documento por interesados y equipo, de manera informal o con lista de verificación"],
["Inspección","Revisión formal con roles (moderador, lector, autor, registrador) y métricas de defectos"],
["Prototipo","El usuario confirma que lo especificado es lo que necesita"],
["Generación de casos de prueba","Si no puedes escribir la prueba de un requerimiento, no es verificable"],
["Análisis de consistencia","Se buscan contradicciones y duplicados, a veces con herramientas"]])}
<p>No confundas: <b>validar</b> responde “¿estamos construyendo el producto correcto?” y <b>verificar</b>, “¿lo estamos construyendo bien?”.</p>`]
];

// ---------------------------------------------------------------- 1-3
LBX["1-3"] = [
["Especificar un caso de uso completo",`<p>El diagrama solo dice que existe “Retirar efectivo”. La especificación dice cómo ocurre, paso a paso, y es lo que el CENEVAL suele mostrar para preguntarte qué parte es cuál:</p>
${tbl(["Sección","Contenido para “Retirar efectivo”"],[
["Actor principal","Cliente"],
["Precondiciones","El cajero tiene efectivo y conexión con el banco"],
["Disparador","El cliente inserta su tarjeta"],
["Flujo principal","1. El sistema solicita el NIP. 2. El cliente lo ingresa. 3. El sistema valida (incluye Autenticar). 4. El cliente elige monto. 5. El sistema verifica saldo. 6. Entrega efectivo y tarjeta. 7. Registra el movimiento."],
["Flujos alternativos","4a. El cliente elige “otro monto”: el sistema solicita una cantidad múltiplo de 100 y regresa al paso 5."],
["Excepciones","3a. NIP incorrecto 3 veces: el sistema retiene la tarjeta y termina. 5a. Saldo insuficiente: muestra el mensaje y regresa al paso 4."],
["Postcondiciones","El saldo se redujo por el monto entregado y el movimiento quedó registrado"],
["Requerimientos especiales","La operación completa tarda menos de 30 s"]])}
${note("<b>Precondición</b>: debe cumplirse <i>antes</i> de empezar. <b>Postcondición</b>: estado garantizado <i>al terminar</i> con éxito. <b>Flujo alterno</b>: otra forma válida de llegar al objetivo. <b>Excepción</b>: algo sale mal.")}`],
["include, extend y generalización sin confusiones",`<p>En una tienda en línea, “Pagar pedido” siempre valida la tarjeta, a veces aplica un cupón y puede ser con tarjeta o con transferencia. Son tres relaciones distintas:</p>
${tbl(["Relación","Cuándo","Dirección de la flecha","Ejemplo"],[
["«include»","El comportamiento ocurre <b>siempre</b> y se reutiliza en varios casos","Del caso base al incluido","Pagar pedido → Validar tarjeta"],
["«extend»","El comportamiento es <b>opcional o condicional</b>","De la extensión al caso base","Aplicar cupón → Pagar pedido"],
["Generalización de casos","Hay <b>variantes</b> de un mismo caso","De la variante al caso general (triángulo)","Pagar con transferencia → Pagar"],
["Generalización de actores","Un actor hace todo lo de otro y más","Del actor específico al general","Gerente → Cajero"]])}
<p>La extensión ocurre en un <b>punto de extensión</b> declarado en el caso base, por ejemplo “después de calcular el total”. El caso base está completo sin la extensión; en cambio, sin su inclusión, el caso base no tiene sentido.</p>
${note("Los actores siempre están <b>fuera</b> del límite del sistema. Un actor puede ser una persona, otro sistema o un dispositivo, pero nunca un componente interno como “la base de datos” del propio sistema.")}`],
["DFD por niveles y sus reglas",`<p>En el DFD de contexto, la nómina es una sola burbuja que recibe incidencias del empleado y envía la dispersión al banco. En el nivel 1 esa burbuja se abre en procesos (1.0 Capturar incidencias, 2.0 Calcular nómina, 3.0 Dispersar pagos) y aparecen los almacenes. En el nivel 2, el proceso 2.0 se abre en 2.1, 2.2, 2.3…</p>
${tbl(["Regla","Explicación"],[
["Balanceo","Los flujos que entran y salen de un proceso deben ser los mismos que entran y salen de su desglose en el nivel siguiente"],
["Todo pasa por un proceso","No hay flujos entidad–entidad, entidad–almacén ni almacén–almacén"],
["Sin milagros","Un proceso que tiene salidas pero ninguna entrada es un error"],
["Sin agujeros negros","Un proceso con entradas pero sin salidas también es un error"],
["Sin agujeros grises","Las salidas no pueden generarse con las entradas que recibe el proceso"],
["Nombres","Procesos con verbo + objeto (“Calcular nómina”); flujos y almacenes con sustantivos"],
["Contexto","Un solo proceso numerado 0, entidades externas y flujos; sin almacenes"]])}
${note("El DFD muestra <b>qué datos se mueven</b>, no el orden ni las decisiones. Si necesitas expresar “si pasa esto, entonces aquello”, eso es un diagrama de actividades o un BPMN.")}`],
["Historias de usuario y criterios de aceptación",`<p>En un equipo ágil, en lugar del caso de uso “Recuperar contraseña” se escribe una historia:</p>
${code(`Como usuario registrado
quiero recuperar mi contraseña con mi correo
para volver a entrar sin llamar a soporte.

Criterios de aceptación (Gherkin):
Dado que existo con el correo ana@mail.com
Cuando solicito recuperar mi contraseña
Entonces recibo un enlace que expira en 30 minutos

Dado que el enlace ya expiró
Cuando intento usarlo
Entonces el sistema me pide solicitar uno nuevo`)}
<p>La historia tiene tres partes: <b>rol</b>, <b>objetivo</b> y <b>beneficio</b>. Los criterios de aceptación la vuelven verificable, y el formato <i>Dado / Cuando / Entonces</i> (Given/When/Then) se puede automatizar como prueba.</p>
<p>Las <b>3 C</b> de una historia: <i>Card</i> (la tarjeta breve), <i>Conversation</i> (los detalles se conversan) y <i>Confirmation</i> (los criterios de aceptación). Una historia demasiado grande para un Sprint es una <b>épica</b> y debe dividirse.</p>`],
["La matriz de trazabilidad en la práctica",`<p>El cliente pide cambiar la regla de cálculo de descuentos. ¿Qué se rompe si la cambias? La matriz lo dice en segundos:</p>
${tbl(["Requerimiento","Caso de uso","Clase / módulo","Caso de prueba"],[
["RF-07 Calcular descuento por volumen","CU-03 Realizar pedido","Descuentos, Pedido","CP-21, CP-22"],
["RF-08 Aplicar cupón","CU-03 (extend)","Cupones","CP-23"],
["RNF-02 Total en menos de 1 s","CU-03","Pedido","CP-40 (rendimiento)"]])}
<p>Trazabilidad <b>hacia adelante</b>: del requerimiento al diseño, código y pruebas (¿quedó implementado y probado?). Trazabilidad <b>hacia atrás</b>: del código al requerimiento (¿por qué existe esto?). Con la matriz se hace el <b>análisis de impacto</b> que exige el control formal de cambios.</p>`]
];

// ---------------------------------------------------------------- 2-1
LBX["2-1"] = [
["Atributos de calidad y tácticas",`<p>El dueño de una tienda dice: “En el Buen Fin no se puede caer, tiene que aguantar diez veces más visitas y los pagos tienen que ser seguros”. Acaba de dictar tres atributos de calidad. La arquitectura responde a cada uno con <b>tácticas</b>:</p>
${tbl(["Atributo","Pregunta","Tácticas típicas"],[
["Disponibilidad","¿Sigue funcionando si algo falla?","Redundancia, balanceador con verificación de salud (heartbeat), réplicas, failover, reintentos"],
["Rendimiento","¿Responde a tiempo?","Caché, CDN, índices, procesamiento asíncrono con colas, concurrencia"],
["Escalabilidad","¿Aguanta más carga agregando recursos?","Escalado horizontal (más servidores) con servicios sin estado; particionar datos"],
["Seguridad","¿Resiste ataques y abusos?","Autenticación, autorización por roles, cifrado en tránsito (TLS) y en reposo, bitácoras de auditoría"],
["Modificabilidad","¿Es barato cambiarlo?","Bajo acoplamiento, capas, interfaces, inyección de dependencias"],
["Capacidad de prueba","¿Es fácil de probar?","Separar lógica de la interfaz, inyectar dependencias para usar mocks"],
["Interoperabilidad","¿Se integra con otros sistemas?","APIs estándar (REST, JSON), mensajería, adaptadores"]])}
${note("<b>Escalado vertical</b>: un servidor más grande (tiene límite y un solo punto de falla). <b>Escalado horizontal</b>: más servidores detrás de un balanceador; requiere que el servidor no guarde la sesión en memoria (servicio <i>stateless</i>).")}`],
["Otros estilos arquitectónicos",`<p>No todo es capas o microservicios. Identifica el estilo por cómo se comunican los componentes:</p>
${tbl(["Estilo","Cómo funciona","Conviene para","Cuidado con"],[
["Cliente-servidor","Clientes piden; un servidor central responde","Apps web y móviles clásicas","El servidor es cuello de botella y punto único de falla"],
["Orientada a eventos (publicar/suscribir)","Los productores publican eventos en un broker; los consumidores reaccionan","Desacoplar módulos, procesos asíncronos, notificaciones","Consistencia eventual; difícil rastrear el flujo completo"],
["Tuberías y filtros","Cada filtro transforma datos y los pasa al siguiente","Compiladores, procesamiento de datos, ETL","No sirve para procesos muy interactivos"],
["SOA","Servicios empresariales reutilizables, a menudo con un bus (ESB)","Integrar sistemas grandes de una empresa","El bus puede volverse complejo y central"],
["Hexagonal (puertos y adaptadores)","El núcleo de negocio no conoce la base de datos ni la interfaz; se conecta por puertos","Sistemas que cambian de tecnología o necesitan pruebas aisladas","Más clases e interfaces"],
["Peer to peer","Todos los nodos son cliente y servidor","Compartir archivos, blockchain","Seguridad y coherencia de datos"],
["Serverless","Funciones que se ejecutan por evento; el proveedor escala","Cargas esporádicas o impredecibles","Arranque en frío, dependencia del proveedor"]])}`],
["Arquitectura orientada a eventos (EDA)",`<p>Una tienda en línea confirma un pedido. En ese momento deben pasar varias cosas: inventario aparta los productos, facturación emite el CFDI, notificaciones manda un correo y, el próximo mes, marketing quiere sumar puntos de lealtad. Si el servicio de Pedidos llamara uno por uno a todos, tendría que conocerlos, esperar a cada uno y cambiar su código cada vez que llega uno nuevo. Si facturación está caída, el pedido fallaría.</p>
<p>En una <b>arquitectura orientada a eventos</b>, Pedidos solo <b>publica un hecho</b> (“PedidoConfirmado”) en un intermediario y sigue con su trabajo. Quien esté interesado se suscribe y reacciona por su cuenta.</p>
${svg(660,220,`${B(10,90,130,50,"Pedidos\n(productor)","l2")}${A(140,115,200,115,null,"publica")}${B(200,70,170,90,"Broker\ntema: PedidoConfirmado","hl")}${A(370,100,440,40)}${A(370,115,440,115)}${A(370,130,440,190)}${B(440,18,200,44,"Inventario (aparta)")}${B(440,93,200,44,"Facturación (CFDI)")}${B(440,168,200,44,"Notificaciones (correo)")}`,"El productor no sabe quién consume. Agregar el servicio de lealtad es solo suscribir un consumidor nuevo.")}
${tbl(["Elemento","Qué es"],[
["Evento","Un hecho que ya ocurrió; se nombra en pasado y no cambia: PedidoConfirmado, PagoRechazado"],
["Productor","Quien detecta el hecho y lo publica"],
["Broker o bus de eventos","Intermediario que recibe, guarda y entrega los eventos (Kafka, RabbitMQ, Amazon SNS/SQS, Google Pub/Sub)"],
["Consumidor","Quien se suscribe y reacciona; puede haber cero, uno o muchos"],
["Tema (topic) o canal","Categoría a la que se publica y a la que se suscriben los consumidores"]])}
<p><b>Dos formas de entregar mensajes</b> que el examen distingue:</p>
${tbl(["Modelo","Quién recibe cada mensaje","Ejemplo"],[
["Publicar/suscribir (topic)","<b>Todos</b> los suscriptores reciben su copia","PedidoConfirmado llega a inventario, facturación y notificaciones"],
["Cola punto a punto","<b>Solo uno</b> de los consumidores del grupo (consumidores en competencia)","Cinco trabajadores comparten la cola de “generar PDF”; cada factura la procesa uno"]])}
<p><b>Ventajas</b>: bajo acoplamiento (productor y consumidores no se conocen), extensibilidad (nuevos consumidores sin tocar al productor), escalabilidad (cada consumidor escala por separado), resiliencia (si un consumidor está caído, los eventos lo esperan en el broker) y procesamiento asíncrono.</p>
<p><b>Retos</b>, que son los que más preguntan:</p>
${tbl(["Reto","Qué pasa","Cómo se atiende"],[
["Consistencia eventual","Durante un momento, inventario ya apartó y facturación aún no emite","Diseñar la interfaz y el negocio para tolerar ese retraso"],
["Mensajes duplicados","Con entrega “al menos una vez”, un consumidor puede recibir el mismo evento dos veces","Consumidores <b>idempotentes</b>: guardar el id del evento ya procesado"],
["Orden de los eventos","PedidoCancelado podría llegar antes que PedidoConfirmado","Particionar por id de pedido o versionar los eventos"],
["Rastrear el flujo","Una operación se reparte en muchos eventos y servicios","Id de correlación, trazas distribuidas y bitácoras centralizadas"],
["Mensajes que siempre fallan","Un evento mal formado hace fallar al consumidor una y otra vez","Reintentos limitados y una cola de mensajes muertos (dead letter queue)"],
["Transacciones entre servicios","No hay un COMMIT que abarque pagos, inventario y envío","Patrón <b>Saga</b>: cada paso publica un evento y, si uno falla, se ejecutan acciones de compensación (reembolsar, liberar inventario)"]])}
<p><b>Patrones relacionados</b>:</p>
${tbl(["Patrón","Idea","Cuándo"],[
["Notificación de evento","El evento solo avisa (“cambió el pedido 15”) y el consumidor consulta los datos si los necesita","Eventos ligeros"],
["Transferencia de estado por evento","El evento trae los datos que el consumidor necesita","Evitar que todos consulten al productor"],
["Event sourcing","Se guarda la secuencia de eventos como fuente de verdad; el estado actual se reconstruye reproduciéndolos","Auditoría completa, reconstruir el estado en cualquier fecha (banca, contabilidad)"],
["CQRS","Separar el modelo de escritura (comandos) del de lectura (consultas), a menudo sincronizados con eventos","Muchas más lecturas que escrituras, o vistas de lectura muy distintas"]])}
${note("Cuándo elegir EDA: varios sistemas deben reaccionar al mismo hecho, se quiere agregar consumidores sin modificar al productor, hay picos de carga que conviene amortiguar con una cola, o integración en tiempo real (IoT, pagos, logística). Cuándo no: flujos simples en los que el usuario necesita la respuesta completa al instante y una llamada directa basta.")}`],
["ATAM paso a paso",`<p>Un banco evalúa la arquitectura de su nueva app antes de construirla. No pregunta “¿es buena?”, sino “¿cumple los atributos que nos importan y qué decisiones los ponen en riesgo?”. Eso es <b>ATAM</b> (Architecture Tradeoff Analysis Method).</p>
<ol><li><b>Presentar</b> el método, los objetivos de negocio y la arquitectura.</li><li><b>Identificar los enfoques</b> arquitectónicos (estilos y tácticas usados).</li><li><b>Construir el árbol de utilidad</b>: atributos de calidad → refinamientos → escenarios concretos, priorizados por importancia y dificultad.</li><li><b>Analizar</b> cómo responde la arquitectura a cada escenario.</li><li><b>Lluvia de ideas</b> de escenarios con todos los interesados y nueva priorización.</li><li><b>Presentar resultados</b>.</li></ol>
<p>Un <b>escenario de calidad</b> tiene seis partes: fuente del estímulo, estímulo, entorno, artefacto, respuesta y medida de la respuesta. Ejemplo: “En hora pico (entorno), si falla un servidor de aplicaciones (estímulo), el sistema (artefacto) redirige el tráfico (respuesta) sin perder sesiones y en menos de 5 s (medida)”.</p>
${tbl(["Salida de ATAM","Qué es"],[
["Punto de sensibilidad","Una decisión que afecta mucho a un atributo (el tamaño de la caché y el rendimiento)"],
["Punto de compromiso (tradeoff)","Una decisión que mejora un atributo y empeora otro (cifrar todo: más seguridad, menos rendimiento)"],
["Riesgo","Una decisión que puede llevar a no cumplir un atributo"],
["No riesgo","Una decisión que se confirmó como segura"]])}`],
["Documentar la arquitectura: el modelo 4+1",`<p>El arquitecto debe explicar el mismo sistema a un programador, a un administrador de servidores y a un gerente. Cada uno necesita una <b>vista</b> distinta:</p>
${tbl(["Vista","Muestra","Para quién","Diagramas UML típicos"],[
["Lógica","Funcionalidad: clases y sus relaciones","Analistas y diseñadores","Clases, objetos, estados"],
["De desarrollo (implementación)","Organización del código en módulos y capas","Programadores","Componentes, paquetes"],
["De procesos","Concurrencia, hilos, sincronización, rendimiento","Integradores","Actividades, secuencia"],
["Física (despliegue)","Nodos de hardware y dónde corre cada parte","Infraestructura y operaciones","Despliegue"],
["Escenarios (+1)","Casos de uso que recorren y validan las otras cuatro","Todos","Casos de uso"]])}`]
];

// ---------------------------------------------------------------- 2-2a
LBX["2-2a"] = [
["Patrones creacionales a fondo",`<p>Un videojuego crea enemigos. Según cómo los crea, el patrón cambia:</p>
${tbl(["Situación","Patrón","Idea clave"],[
["Solo debe existir un gestor de configuración","Singleton","Una instancia y un acceso global (cuidado: dificulta las pruebas)"],
["Cada nivel decide qué tipo de enemigo crear; el código base solo llama crearEnemigo()","Factory Method","Una subclase decide qué clase concreta instanciar"],
["El tema “bosque” crea árbol, enemigo y fondo del bosque; el tema “nieve”, los de nieve","Abstract Factory","Familias de objetos relacionados que deben usarse juntos"],
["Un personaje se configura con arma, armadura, habilidades… paso a paso","Builder","Construcción por pasos de un objeto complejo; el mismo proceso da representaciones distintas"],
["Crear 500 enemigos iguales a un modelo ya configurado","Prototype","Clonar un objeto existente en lugar de construirlo desde cero"]])}
${note("Factory Method crea <b>un producto</b> y delega la decisión a subclases. Abstract Factory crea <b>una familia completa</b> y garantiza que sus piezas sean compatibles entre sí.")}`],
["Patrones estructurales a fondo",`<p>Todos los estructurales tratan de cómo <b>componer</b> clases y objetos. Se distinguen por su intención:</p>
${tbl(["Patrón","Intención","Pista en el caso"],[
["Adapter","Convertir una interfaz incompatible en la que el cliente espera","“La biblioteca externa tiene otros métodos”"],
["Facade","Dar una interfaz sencilla a un subsistema complejo","“Un solo método que oculta muchos pasos”"],
["Decorator","Agregar responsabilidades envolviendo, sin modificar la clase","“Combinar extras: leche, crema, canela…”"],
["Proxy","Un sustituto que controla el acceso al objeto real","“Cargar solo cuando se necesite”, “verificar permisos”, “objeto remoto”"],
["Composite","Tratar igual a un elemento y a un grupo de elementos (árbol)","“Carpetas que contienen archivos y otras carpetas”"],
["Flyweight","Compartir el estado común de miles de objetos pequeños","“Millones de objetos; se acaba la memoria”"],
["Bridge","Separar una abstracción de su implementación para variarlas por separado","“Formas × motores de dibujo” sin multiplicar clases"]])}
${note("Decorator, Proxy y Adapter envuelven a otro objeto. La diferencia es la intención: Decorator <b>agrega</b> funciones y conserva la interfaz; Proxy <b>controla el acceso</b> y conserva la interfaz; Adapter <b>cambia</b> la interfaz.")}`],
["Patrones de comportamiento a fondo",`<p>Estos patrones reparten responsabilidades y definen cómo se comunican los objetos:</p>
${tbl(["Patrón","Intención","Pista en el caso"],[
["Strategy","Intercambiar algoritmos con la misma interfaz","“Elegir cómo calcular el envío”"],
["State","El comportamiento cambia según el estado interno","“Un pedido se comporta distinto si está pagado, enviado o cancelado”"],
["Observer","Notificar a muchos cuando uno cambia","“Suscriptores”, “cuando cambie, avisar a…”"],
["Command","Encapsular una petición como objeto","“Deshacer/rehacer”, “cola de acciones”, “macros”"],
["Chain of Responsibility","Pasar la petición por una cadena hasta que alguien la atienda","“Aprobación por niveles”, “filtros”"],
["Template Method","Esqueleto fijo de un algoritmo; las subclases cambian pasos","“Mismos pasos, distinto detalle”"],
["Mediator","Un objeto central coordina la comunicación entre otros","“Muchos componentes que se hablan entre sí”"],
["Memento","Guardar y restaurar el estado sin romper el encapsulamiento","“Puntos de control”, “deshacer al estado anterior”"],
["Iterator","Recorrer una colección sin exponer su estructura","“Recorrer sin saber si es lista, árbol o arreglo”"],
["Visitor","Agregar operaciones a una jerarquía sin modificar sus clases","“Exportar a XML, a JSON, calcular impuestos… sobre los mismos nodos”"]])}
${note("<b>Strategy vs State</b>: en Strategy el cliente elige el algoritmo desde fuera; en State el objeto cambia de estado por sí mismo y su comportamiento cambia con él. <b>Facade vs Mediator</b>: Facade simplifica el acceso <i>desde fuera</i> a un subsistema; Mediator coordina la comunicación <i>entre</i> los componentes.")}`],
["Cómo resolver un reactivo de patrones",`<p>Los reactivos describen un problema sin decir el nombre del patrón. Un método de tres pasos:</p>
<ol><li><b>Ubica la familia</b>: ¿el problema es de <i>crear</i> objetos (creacional), de <i>componer</i> estructuras (estructural) o de <i>repartir comportamiento y comunicación</i> (comportamiento)?</li><li><b>Busca la palabra clave</b> del caso: “familia”, “paso a paso”, “clonar”, “interfaz incompatible”, “envolver”, “sustituto”, “árbol”, “notificar”, “deshacer”, “niveles”, “esqueleto”.</li><li><b>Descarta</b> los distractores por intención: si las opciones son Decorator, Proxy y Adapter, pregúntate si se agrega, se controla o se traduce.</li></ol>`]
];

// ---------------------------------------------------------------- 2-2b
LBX["2-2b"] = [
["Tipos de cohesión, de la peor a la mejor",`<p>La cohesión mide qué tan relacionadas están las cosas <b>dentro</b> de un módulo. Mientras más alta, mejor.</p>
${tbl(["Tipo","Las partes del módulo están juntas porque…","Ejemplo"],[
["Coincidental (peor)","No hay ninguna razón","Utilerias: fechas, correo e impuestos"],
["Lógica","Hacen cosas de la misma categoría y se elige con una bandera","manejarEntrada(tipo) para teclado, ratón y archivo"],
["Temporal","Se ejecutan en el mismo momento","inicializar(): abre la base, carga configuración, limpia temporales"],
["Procedimental","Siguen un orden de ejecución","Pasos de un trámite que no comparten datos"],
["Comunicacional","Operan sobre los mismos datos","Funciones que leen y actualizan el mismo expediente"],
["Secuencial","La salida de una es la entrada de la siguiente","Leer archivo → validar → transformar"],
["Funcional (mejor)","Todas contribuyen a una sola tarea bien definida","calcularISR()"]])}`],
["Tipos de acoplamiento, del peor al mejor",`<p>El acoplamiento mide cuánto depende un módulo de <b>otros</b>. Mientras más bajo, mejor.</p>
${tbl(["Tipo","Qué comparten","Ejemplo"],[
["De contenido (peor)","Un módulo modifica o usa el interior de otro","Cambiar directamente un atributo privado de otra clase o saltar a mitad de su código"],
["Común (global)","Datos globales compartidos","Dos módulos leen y escriben la misma variable global"],
["Externo","Un formato o protocolo externo impuesto","Ambos dependen del mismo formato de archivo de un proveedor"],
["De control","Uno controla la lógica del otro con banderas","procesar(datos, modo=2)"],
["Estampado (por estructura)","Se pasa una estructura completa aunque solo se usa una parte","Pasar el objeto Cliente entero para usar solo su correo"],
["De datos (mejor)","Solo los datos simples que se necesitan","calcularIVA(subtotal)"]])}
${note("El objetivo clásico es <b>alta cohesión y bajo acoplamiento</b>: módulos enfocados en una sola cosa, que se comunican pasando solo lo indispensable.")}`],
["SOLID con código: antes y después",`<p>Así se ve violar y respetar dos de los principios que más preguntan.</p>
<p><b>Abierto/cerrado</b>. Antes, cada tipo de envío nuevo obliga a editar el método:</p>
${code(`double costo(Envio e) {
  switch (e.tipo) {
    case "terrestre": return e.peso * 10;
    case "aereo":     return e.peso * 25;
    // cada tipo nuevo = modificar y volver a probar aquí
  }
}`)}
<p>Después, cada tipo es una clase nueva y el código existente no se toca:</p>
${code(`interface Tarifa { double costo(double peso); }
class Terrestre implements Tarifa { public double costo(double p){ return p*10; } }
class Aereo     implements Tarifa { public double costo(double p){ return p*25; } }
class Maritimo  implements Tarifa { public double costo(double p){ return p*4; } } // extensión`)}
<p><b>Inversión de dependencias</b>. Antes, el servicio crea su base de datos concreta y no se puede probar sin ella:</p>
${code(`class ServicioPedidos {
  private MySQLRepositorio repo = new MySQLRepositorio();
}`)}
<p>Después, depende de una abstracción que recibe desde fuera (inyección), y en las pruebas se le pasa un repositorio falso:</p>
${code(`class ServicioPedidos {
  private final RepositorioPedidos repo;
  ServicioPedidos(RepositorioPedidos repo) { this.repo = repo; }
}`)}`],
["Otros principios que también aparecen",`${tbl(["Principio","Qué dice","Señal de que se viola"],[
["DRY (Don't Repeat Yourself)","Cada conocimiento debe estar en un solo lugar","La misma validación copiada en cinco pantallas"],
["KISS","Mantenlo simple","Una solución genérica y compleja para un problema pequeño"],
["YAGNI","No construyas lo que todavía no se necesita","Clases “por si algún día”"],
["Ley de Demeter","Habla solo con tus vecinos directos","pedido.getCliente().getDireccion().getCiudad()"],
["Composición sobre herencia","Prefiere tener objetos a heredar de ellos","Jerarquías profundas para reutilizar un método"],
["GRASP · Experto en información","Asigna la responsabilidad a quien tiene los datos","El Pedido calcula su total, no una clase externa"],
["GRASP · Creador","Crea un objeto quien lo contiene o lo usa de cerca","El Pedido crea sus LíneasPedido"],
["GRASP · Controlador","Un objeto recibe los eventos del sistema y los coordina","Un controlador por caso de uso, no la vista"]])}`]
];

// ---------------------------------------------------------------- 2-2c
LBX["2-2c"] = [
["Llaves y dependencias funcionales",`<p>En la tabla INSCRIPCION(matricula, clave_materia, nombre_alumno, nombre_materia, calificacion), saber la matrícula te dice el nombre del alumno; saber la clave te dice el nombre de la materia; y necesitas ambas para conocer la calificación. Esas son <b>dependencias funcionales</b> (X → Y: si conoces X, conoces Y).</p>
${tbl(["Concepto","Definición","En el ejemplo"],[
["Superllave","Conjunto de atributos que identifica cada fila","(matricula, clave_materia, nombre_alumno)"],
["Llave candidata","Superllave mínima: si le quitas un atributo deja de identificar","(matricula, clave_materia)"],
["Llave primaria","La llave candidata elegida","(matricula, clave_materia)"],
["Atributo primo","Forma parte de alguna llave candidata","matricula, clave_materia"],
["Dependencia parcial","Un atributo no primo depende de solo una parte de la llave","matricula → nombre_alumno (viola 2FN)"],
["Dependencia transitiva","Un atributo no primo depende de otro no primo","id_pedido → id_cliente → ciudad (viola 3FN)"],
["Llave foránea","Atributo que referencia la llave primaria de otra tabla","INSCRIPCION.matricula → ALUMNO.matricula"]])}`],
["Más allá de la 3FN: la FNBC",`<p>En la tabla CLASE(alumno, materia, profesor), cada profesor imparte una sola materia, y cada alumno lleva cada materia con un solo profesor. La llave es (alumno, materia).</p>
<p>¿Está en 3FN? Sí: la única dependencia “rara” es profesor → materia, y materia es parte de la llave (atributo primo), lo que la 3FN permite. Pero hay redundancia: si un profesor cambia de materia, hay que actualizar muchas filas.</p>
<p>La <b>Forma Normal de Boyce-Codd</b> exige que <b>todo determinante sea superllave</b>. Como profesor determina materia y no es superllave, se viola. Se corrige separando:</p>
${tbl(["PROFESOR_MATERIA","ALUMNO_PROFESOR"],[["profesor (PK), materia","alumno, profesor (PK compuesta)"]])}
${note("Resumen rápido: <b>1FN</b> valores atómicos · <b>2FN</b> sin dependencias parciales · <b>3FN</b> sin dependencias transitivas · <b>FNBC</b> todo determinante es superllave. Cada una incluye a la anterior.")}`],
["Del modelo entidad-relación a tablas",`<p>Una universidad: un alumno se inscribe en muchas materias y una materia tiene muchos alumnos; cada alumno pertenece a una carrera; un kárdex no existe sin su alumno.</p>
${tbl(["Situación en el modelo E-R","Cómo se convierte en tablas"],[
["Relación 1:N (carrera tiene muchos alumnos)","La llave foránea va en el lado N: ALUMNO(id_carrera)"],
["Relación N:M (alumnos y materias)","Tabla intermedia INSCRIPCION(id_alumno, id_materia, …) con llave compuesta"],
["Relación 1:1","La llave foránea en cualquiera de las dos, con restricción UNIQUE (o se fusionan)"],
["Atributo multivaluado (varios teléfonos)","Tabla aparte TELEFONO(id_alumno, numero)"],
["Entidad débil (kárdex depende del alumno)","Su llave incluye la llave de la entidad fuerte"],
["Atributos de la relación (calificación)","Van en la tabla intermedia"]])}`],
["Desnormalizar a propósito",`<p>Un reporte de ventas por región tarda 40 segundos porque une siete tablas. Los datos de ventas cerradas ya no cambian. ¿Se normaliza más? No: se <b>desnormaliza</b> para ese uso.</p>
${tbl(["","OLTP (operación)","OLAP (análisis)"],[
["Uso","Muchas transacciones cortas: vender, inscribir, pagar","Consultas grandes de lectura: reportes, tendencias"],
["Diseño","Normalizado (3FN) para evitar anomalías","Desnormalizado: esquema estrella con tabla de hechos y dimensiones"],
["Prioridad","Integridad y escritura rápida","Lectura rápida de grandes volúmenes"]])}
<p>Técnicas: <b>vistas materializadas</b> (resultado precalculado que se refresca), columnas calculadas o duplicadas, tablas resumen y bodegas de datos (data warehouse). El precio es la redundancia: hay que mantenerla sincronizada.</p>`],
["NoSQL: elegir el modelo correcto",`${tbl(["Tipo","Cómo guarda","Conviene para","Ejemplos"],[
["Clave-valor","Un valor opaco por cada llave","Sesiones, carritos, caché","Redis, DynamoDB"],
["Documental","Documentos JSON/BSON con estructura flexible","Catálogos, perfiles, contenido","MongoDB, Firestore"],
["Columnar (familia de columnas)","Filas con columnas agrupadas, escritura masiva","Series de tiempo, bitácoras, IoT","Cassandra, HBase"],
["Grafos","Nodos y relaciones","Redes sociales, recomendaciones, fraude","Neo4j"]])}
<p>En un modelo documental la decisión clave es <b>incrustar o referenciar</b>: incrusta lo que se lee junto y está acotado (las direcciones de un cliente); referencia lo que crece sin límite o se consulta por separado (los millones de pedidos de un cliente). El patrón <b>Bucket</b> agrupa datos continuos (lecturas por hora) en un documento por intervalo.</p>
${note("Las bases NoSQL suelen preferir <b>BASE</b> (básicamente disponible, estado flexible, consistencia eventual) frente a <b>ACID</b>, y por el teorema CAP, ante una partición de red eligen disponibilidad o consistencia.")}`],
["Bases distribuidas: fragmentación y replicación a fondo",`<p>Una cadena con sucursales en el norte y el sur guarda la tabla CLIENTE.</p>
${tbl(["Decisión","Opciones","Efecto"],[
["Fragmentación horizontal","Filas por región: clientes del norte en el servidor norte","Consultas locales rápidas"],
["Fragmentación vertical","Columnas: datos personales en un servidor, crédito en otro","Separa datos por uso o por seguridad"],
["Fragmentación mixta","Primero por región y luego por columnas","Combina ambas ventajas, más compleja"],
["Replicación síncrona","Se confirma cuando todas las réplicas tienen el cambio","No se pierden datos; más latencia"],
["Replicación asíncrona","Se confirma y después se propaga","Rápida; puede perder los últimos cambios si cae el primario"],
["Maestro–réplicas","Un nodo escribe y los demás leen","Escala lecturas; el maestro es punto único de escritura"],
["Multimaestro","Varios nodos aceptan escrituras","Más disponibilidad; hay que resolver conflictos"]])}
<p>Una base distribuida busca <b>transparencia</b>: el usuario consulta como si todo estuviera en un solo lugar, sin saber dónde está cada fragmento (transparencia de ubicación, de fragmentación y de replicación).</p>`]
];

// ---------------------------------------------------------------- 2-2d
LBX["2-2d"] = [
["Relaciones del diagrama de clases, todas",`<p>En un sistema escolar: una Escuela tiene Salones (que se destruyen con ella); un Departamento agrupa Profesores (que existen sin él); un Profesor imparte Cursos; ReporteBoleta usa temporalmente a Calificacion; Alumno hereda de Persona; y Alumno implementa la interfaz Evaluable.</p>
${tbl(["Relación","Notación","Significado","Del ejemplo"],[
["Asociación","Línea continua","Los objetos se conocen de forma estable","Profesor — Curso"],
["Agregación","Rombo vacío en el todo","Todo–parte; las partes existen por separado","Departamento ◇— Profesor"],
["Composición","Rombo relleno en el todo","Todo–parte; las partes mueren con el todo","Escuela ◆— Salón"],
["Generalización","Triángulo vacío hacia el padre","Herencia (“es un”)","Alumno → Persona"],
["Realización","Línea punteada con triángulo vacío","Una clase implementa una interfaz","Alumno ⇢ Evaluable"],
["Dependencia","Línea punteada con flecha abierta","Uso temporal (parámetro, variable local)","ReporteBoleta ⇢ Calificacion"]])}
${tbl(["Multiplicidad","Significa","Visibilidad","Significa"],[["1","Exactamente uno","+","Pública"],["0..1","Cero o uno","-","Privada"],["* o 0..*","Cero o muchos","#","Protegida"],["1..*","Uno o muchos","~","De paquete"]])}
${note("Los atributos y métodos <b>subrayados</b> son de clase (static) y los nombres en <i>cursiva</i> indican clases o métodos abstractos.")}`],
["Los 14 diagramas de UML 2",`<p>UML 2.5 tiene 14 diagramas en dos grandes grupos. El CENEVAL suele preguntar “¿qué diagrama usarías para…?”:</p>
${tbl(["Grupo","Diagrama","Úsalo para"],[
["Estructura","Clases","Clases, atributos, métodos y relaciones"],
["Estructura","Objetos","Una instantánea de objetos concretos con sus valores"],
["Estructura","Componentes","Módulos desplegables y sus interfaces provistas y requeridas"],
["Estructura","Despliegue","Nodos de hardware y qué artefacto corre en cada uno"],
["Estructura","Paquetes","Agrupar elementos y mostrar dependencias entre grupos"],
["Estructura","Estructura compuesta","La estructura interna de una clase y sus partes"],
["Estructura","Perfiles","Extender UML con estereotipos propios"],
["Comportamiento","Casos de uso","Qué hace el sistema para cada actor"],
["Comportamiento","Actividades","Flujos de trabajo con decisiones, paralelismo y carriles"],
["Comportamiento","Máquina de estados","Ciclo de vida de un objeto ante eventos"],
["Interacción","Secuencia","Mensajes entre objetos ordenados en el tiempo"],
["Interacción","Comunicación","Los mismos mensajes, enfatizando los enlaces (numerados)"],
["Interacción","Tiempos","Cambios de estado con restricciones de tiempo precisas"],
["Interacción","Visión global de la interacción","Un flujo de actividades cuyos nodos son interacciones"]])}`],
["Secuencia: mensajes y fragmentos",`<p>Al pagar, la App llama a Pagos y espera la respuesta; luego notifica a Correo sin esperar. Si el pago se rechaza, muestra un error; si se aprueba, genera la factura. Todo eso se dibuja con estos elementos:</p>
${tbl(["Elemento","Notación","Significado"],[
["Mensaje síncrono","Línea continua, punta rellena","El emisor espera la respuesta"],
["Mensaje asíncrono","Línea continua, punta abierta","El emisor sigue sin esperar"],
["Retorno","Línea punteada","Respuesta a un mensaje síncrono"],
["Creación / destrucción","Mensaje «create» hacia el objeto / X al final de su línea de vida","Ciclo de vida del objeto"],
["alt","Fragmento con secciones separadas por línea punteada","Alternativas excluyentes (if/else)"],
["opt","Fragmento con una condición","Se ejecuta una vez si se cumple (if sin else)"],
["loop","Fragmento con condición o rango","Repetición"],
["par","Fragmento con secciones","Ejecución en paralelo"],
["break","Fragmento","Si se cumple, se ejecuta y se abandona la interacción"],
["ref","Marco que nombra otra interacción","Reutilizar un diagrama definido aparte"]])}`],
["Actividades: decisiones y paralelismo",`${svg(640,215,`<circle cx="22" cy="110" r="9" class="b hl"/>${A(31,110,58,110)}${B(58,88,112,44,"Recibir\nsolicitud")}${A(170,110,198,110)}<path d="M222 88 L246 110 L222 132 L198 110Z" class="b"/>${P("222,88 222,50 296,50","",null)}${T(258,40,"[aprobada]","sm")}${P("222,132 222,175 296,175","",null)}${T(258,193,"[rechazada]","sm")}${B(298,157,150,36,"Notificar rechazo")}<rect x="298" y="18" width="7" height="64" class="b hl"/>${A(305,30,338,30)}${A(305,70,338,70)}${B(338,10,112,38,"Facturar")}${B(338,51,112,38,"Empacar")}${A(450,30,480,30)}${A(450,70,480,70)}<rect x="480" y="18" width="7" height="64" class="b hl"/>${A(487,50,518,50)}${B(518,30,100,40,"Enviar")}`,"Rombo = decisión con guardas entre corchetes. Barra = fork (divide en paralelo) y join (espera a todos).")}
<p>Las guardas de una decisión deben ser <b>excluyentes y completas</b>: “[monto > 1000]” y “[monto < 1000]” dejan fuera el 1000. Los <b>carriles</b> (swimlanes) indican qué área o rol realiza cada acción.</p>`]
];

// ---------------------------------------------------------------- 2-3
LBX["2-3"] = [
["Las 10 heurísticas de Nielsen, completas",`${tbl(["Heurística","Se cumple cuando…","Se viola cuando…"],[
["1. Visibilidad del estado del sistema","Una barra de progreso al subir un archivo","Pulsas Pagar y la pantalla no cambia"],
["2. Relación con el mundo real","Hablar de “carrito” y usar íconos conocidos","“Error en el buffer de transacción”"],
["3. Control y libertad del usuario","Deshacer, Cancelar, salir de un asistente","Un flujo sin forma de regresar"],
["4. Consistencia y estándares","El botón Guardar siempre en el mismo lugar","“Aceptar” en un lado y “OK” en otro"],
["5. Prevención de errores","Un calendario en lugar de escribir la fecha","Borrar sin confirmar"],
["6. Reconocer antes que recordar","Mostrar búsquedas recientes y opciones visibles","Obligar a memorizar códigos"],
["7. Flexibilidad y eficiencia","Atajos de teclado para expertos","Solo existe el camino largo"],
["8. Diseño estético y minimalista","Solo la información relevante","Pantallas saturadas"],
["9. Ayudar a reconocer, diagnosticar y recuperarse de errores","“La tarjeta fue rechazada: verifica la fecha de vencimiento”","“Error 0x80045”"],
["10. Ayuda y documentación","Ayuda contextual y buscable","Un manual de 200 páginas sin índice"]])}`],
["Principios de diseño y accesibilidad",`<p>Un botón de “Comprar” pequeño y en una esquina recibe menos clics que uno grande cerca del contenido. No es gusto: es la <b>Ley de Fitts</b>.</p>
${tbl(["Principio","Qué dice","Aplicación"],[
["Ley de Fitts","El tiempo para alcanzar un objetivo depende de su distancia y su tamaño","Acciones frecuentes, grandes y cercanas"],
["Ley de Hick","Más opciones, más tiempo para decidir","Menús cortos, agrupar opciones"],
["Jerarquía visual","Tamaño, color y posición indican importancia","Un solo botón principal por pantalla"],
["Proximidad (Gestalt)","Lo cercano se percibe como relacionado","Agrupar campos que van juntos"],
["Retroalimentación","Cada acción tiene una respuesta visible","Estados de botón, mensajes de confirmación"]])}
<p><b>Accesibilidad (WCAG)</b>: contraste mínimo de 4.5:1 en texto normal, texto alternativo en imágenes, todo operable con teclado, no depender solo del color para comunicar algo y etiquetas asociadas a cada campo. Sus cuatro principios: <b>perceptible, operable, comprensible y robusto</b>.</p>`],
["Prototipos y evaluación de la usabilidad",`${tbl(["Artefacto","Fidelidad","Sirve para"],[
["Boceto en papel","Muy baja","Explorar ideas en minutos"],
["Wireframe","Baja","Estructura y distribución, sin colores ni estilo"],
["Mockup","Media-alta","Apariencia visual final, estático"],
["Prototipo interactivo","Alta","Probar flujos con usuarios antes de programar"]])}
${tbl(["Método de evaluación","Quién evalúa","Qué obtiene"],[
["Prueba de usabilidad","Usuarios reales cumpliendo escenarios de tarea","Dónde se atoran; con 5 usuarios se encuentra la mayoría de problemas"],
["Evaluación heurística","3 a 5 expertos revisan contra las heurísticas","Problemas probables, barato y rápido"],
["Recorrido cognitivo","Expertos simulan a un usuario novato paso a paso","Problemas de aprendizaje"],
["Cuestionario SUS","Usuarios, después de usar el sistema","Puntuación de 0 a 100 de usabilidad percibida"],
["Prueba A/B","Usuarios reales en producción, divididos en dos versiones","Qué versión logra mejor una métrica"]])}`],
["APIs REST a fondo",`<p>Una app móvil consulta el catálogo de una tienda con <code>GET /productos?categoria=audio</code>, crea un pedido con <code>POST /pedidos</code> y recibe <b>201 Created</b>. Si el token expiró, recibe <b>401</b>.</p>
${tbl(["Método","Uso","Seguro","Idempotente"],[["GET","Leer","Sí","Sí"],["POST","Crear o ejecutar una acción","No","No"],["PUT","Reemplazar completo","No","Sí"],["PATCH","Modificar parcialmente","No","No garantizado"],["DELETE","Eliminar","No","Sí"]])}
${tbl(["Código","Significado"],[["200 OK","Éxito"],["201 Created","Recurso creado"],["204 No Content","Éxito sin cuerpo (típico de DELETE)"],["400 Bad Request","La petición está mal formada"],["401 Unauthorized","No está autenticado"],["403 Forbidden","Está autenticado pero no tiene permiso"],["404 Not Found","El recurso no existe"],["409 Conflict","Conflicto con el estado actual (duplicado)"],["500 Internal Server Error","Falla del servidor"]])}
<p>REST es <b>sin estado</b>: cada petición trae todo lo necesario (por ejemplo, el token). Los recursos se nombran con sustantivos (<code>/pedidos/15</code>), no con verbos (<code>/obtenerPedido</code>). Alternativas: <b>SOAP</b> (XML, contrato WSDL, más formal) y <b>GraphQL</b> (el cliente pide exactamente los campos que necesita en una sola consulta).</p>`]
];

Object.keys(LBX).forEach(id=>{ if(LB[id]) LB[id].s = LB[id].s.concat(LBX[id]); });
