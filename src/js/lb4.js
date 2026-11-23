// ===== Temario ampliado: Áreas 3, 4 y Lenguaje =====
const LBY = {};

// ---------------------------------------------------------------- 3-1
LBY["3-1"] = [
["Del código fuente al programa: las fases de un compilador",`<p>Escribes <code>int total = precio * 2</code> y olvidas declarar <code>precio</code>. El compilador no se queja al leer las palabras, ni al revisar la estructura de la línea, sino hasta que comprueba el significado. Cada error aparece en una fase distinta:</p>
${tbl(["Fase","Qué hace","Error que detecta"],[
["Análisis léxico","Separa el texto en tokens (palabras clave, identificadores, números)","Un carácter inválido: <code>int t@tal</code>"],
["Análisis sintáctico","Comprueba la gramática y arma el árbol sintáctico","Falta un punto y coma o un paréntesis"],
["Análisis semántico","Comprueba el significado: tipos, declaraciones, alcance","Variable no declarada, asignar texto a un int"],
["Código intermedio","Traduce a una representación independiente de la máquina","—"],
["Optimización","Mejora el código (quita cálculos repetidos o inútiles)","—"],
["Generación de código","Produce código máquina o bytecode","—"],
["Enlazado (linker)","Une el programa con bibliotecas y otros módulos","Función declarada pero nunca definida"]])}
${note("Compilador: traduce todo antes de ejecutar y genera un ejecutable (C, C++, Go, Rust). Intérprete: traduce y ejecuta instrucción por instrucción (Python, JavaScript clásico, PHP). Híbrido: compila a <b>bytecode</b> que ejecuta una máquina virtual, a menudo con compilación <b>JIT</b> (Java, C#, Kotlin).")}`],
["Tipado: estático o dinámico, fuerte o débil",`<p>En JavaScript, <code>"5" - 2</code> da 3 y <code>"5" + 2</code> da "52". En Python, <code>"5" + 2</code> lanza un error. En Java, ni siquiera compila. Son dos ejes distintos:</p>
${tbl(["","Tipado fuerte (no convierte en silencio)","Tipado débil (convierte en silencio)"],[
["<b>Estático</b> (los tipos se revisan al compilar)","Java, C#, Kotlin, Rust, TypeScript","C (permite conversiones implícitas y punteros)"],
["<b>Dinámico</b> (los tipos se revisan al ejecutar)","Python, Ruby","JavaScript, PHP"]])}
<p><b>Inferencia de tipos</b>: con <code>var x = 10</code> en C# o Java, el compilador deduce que x es int y lo fija; no lo vuelve dinámico. Con tipado estático, más errores se descubren antes de ejecutar; con dinámico, se escribe menos y se prototipa más rápido, pero hacen falta más pruebas.</p>`],
["Herramientas del entorno de desarrollo",`${tbl(["Herramienta","Para qué sirve"],[
["IDE","Editor con compilación, depuración, autocompletado y refactorización integrados"],
["Depurador","Detener en un breakpoint, avanzar paso a paso (step over, step into) e inspeccionar variables"],
["Linter / analizador estático","Detectar errores probables y malas prácticas sin ejecutar el código"],
["Profiler","Medir dónde se gasta el tiempo y la memoria"],
["Gestor de dependencias","Instalar y fijar versiones de bibliotecas (npm, Maven, pip)"],
["Sistema de construcción","Compilar, empaquetar y correr pruebas de forma repetible (Gradle, Maven, Make)"],
["Control de versiones","Historial y trabajo en equipo (Git)"]])}
${note("<b>Step over</b> ejecuta la línea completa (si llama a una función, no entra). <b>Step into</b> entra a la función llamada. <b>Step out</b> termina la función actual y regresa a quien la llamó.")}`]
];

// ---------------------------------------------------------------- 3-2
LBY["3-2"] = [
["Sobrecarga, sobrescritura y enlace dinámico",`<p>En una clase Calculadora existen <code>sumar(int, int)</code> y <code>sumar(double, double)</code>: mismo nombre, distintos parámetros. En una clase Perro que hereda de Animal, <code>hacerSonido()</code> se vuelve a definir para ladrar. Son dos mecanismos distintos:</p>
${tbl(["","Sobrecarga (overloading)","Sobrescritura (overriding)"],[
["Dónde","En la misma clase","En una subclase"],
["Firma","Mismo nombre, distintos parámetros","Mismo nombre y mismos parámetros"],
["Se decide","Al compilar (polimorfismo estático)","Al ejecutar, según el objeto real (enlace dinámico)"]])}
${code(`Animal a = new Perro();
a.hacerSonido();   // ladra: se ejecuta el método del objeto real (Perro)
a.buscarHueso();   // error de compilación: el tipo Animal no tiene ese método`)}
<p>El tipo de la <b>referencia</b> decide qué métodos se pueden llamar; el tipo del <b>objeto</b> decide qué implementación se ejecuta.</p>`],
["Modificadores de acceso y miembros de clase",`${tbl(["Modificador (Java)","Misma clase","Mismo paquete","Subclase en otro paquete","Cualquier clase"],[["public","Sí","Sí","Sí","Sí"],["protected","Sí","Sí","Sí","No"],["(sin modificador)","Sí","Sí","No","No"],["private","Sí","No","No","No"]])}
<p><b>static</b>: el miembro pertenece a la clase, no a cada objeto (un contador compartido, un método de utilidad). <b>final</b>: una variable que no cambia, un método que no se puede sobrescribir o una clase que no se puede heredar.</p>
${tbl(["","Clase abstracta","Interfaz"],[["Puede tener","Atributos, constructores, métodos con y sin implementación","Métodos abstractos y constantes (y métodos default en Java 8+)"],["Herencia","Una clase hereda de una sola","Una clase implementa varias"],["Relación","“Es un” (Perro es un Animal)","“Puede hacer” (Pájaro es Volador)"]])}`],
["Excepciones: try, catch, finally",`<p>Al leer un archivo puede fallar que no exista, que no haya permisos o que el disco falle. Las excepciones separan el camino normal del manejo de errores:</p>
${code(`try {
    leer("datos.csv");
} catch (FileNotFoundException e) {   // la más específica primero
    avisar("No existe el archivo");
} catch (IOException e) {             // luego la más general
    avisar("Error de lectura");
} finally {
    cerrar();                          // se ejecuta SIEMPRE, incluso con return
}`)}
${note("En Java, las excepciones <b>verificadas</b> (checked, como IOException) obligan a capturarlas o declararlas con throws; las <b>no verificadas</b> (RuntimeException, como NullPointerException) no. Los catch van de lo más específico a lo más general.")}`],
["Paradigma funcional y lógico, con ejemplos",`<p>Para obtener la suma de los cuadrados de los números pares, el estilo imperativo dice cómo; el funcional dice qué:</p>
${code(`// Imperativo
let s = 0;
for (const n of nums) if (n % 2 === 0) s += n * n;

// Funcional
const s = nums.filter(n => n % 2 === 0).map(n => n * n).reduce((a, b) => a + b, 0);`)}
${tbl(["Concepto funcional","Significado"],[["Función pura","Mismo resultado con las mismas entradas y sin efectos secundarios"],["Inmutabilidad","Los datos no se modifican; se crean nuevos"],["Función de orden superior","Recibe o devuelve funciones (map, filter, reduce)"],["Recursión","Se usa en lugar de ciclos"],["Transparencia referencial","Una llamada se puede sustituir por su resultado"]])}
<p>En el paradigma <b>lógico</b> (Prolog) se declaran hechos y reglas, y el motor busca respuestas por <b>unificación</b> y <b>backtracking</b> (si un camino falla, regresa y prueba otro):</p>
${code(`padre(juan, ana).   padre(ana, luis).
abuelo(X, Z) :- padre(X, Y), padre(Y, Z).
?- abuelo(juan, Q).    % Q = luis`)}`]
];

// ---------------------------------------------------------------- 3-2b
LBY["3-2b"] = [
["Árboles binarios de búsqueda y sus recorridos",`<p>Insertas 50, 30, 70, 20, 40, 60, 80 en un árbol binario de búsqueda: lo menor va a la izquierda y lo mayor a la derecha.</p>
${svg(640,190,`${B(290,10,60,34,"50","l2",17)}${A(300,40,200,72)}${A(340,40,440,72)}${B(170,72,60,34,"30","",17)}${B(410,72,60,34,"70","",17)}${A(180,102,120,134)}${A(220,102,260,134)}${A(420,102,380,134)}${A(460,102,520,134)}${B(90,134,60,34,"20","",17)}${B(230,134,60,34,"40","",17)}${B(350,134,60,34,"60","",17)}${B(490,134,60,34,"80","",17)}`,"Buscar en un árbol balanceado es O(log n); si se insertan datos ya ordenados, degenera en lista y es O(n).")}
${tbl(["Recorrido","Orden","Resultado"],[["Preorden","Raíz, izquierda, derecha","50, 30, 20, 40, 70, 60, 80"],["Inorden","Izquierda, raíz, derecha","20, 30, 40, 50, 60, 70, 80 (ordenado)"],["Postorden","Izquierda, derecha, raíz","20, 40, 30, 60, 80, 70, 50"],["Por niveles (BFS)","Nivel por nivel, con una cola","50, 30, 70, 20, 40, 60, 80"]])}
${note("El inorden de un árbol binario de búsqueda siempre sale ordenado. El postorden sirve para borrar un árbol (primero los hijos) y el preorden para copiarlo.")}`],
["Grafos, listas enlazadas y tablas hash",`${tbl(["Estructura","Idea","Operaciones clave"],[
["Lista enlazada","Nodos con un apuntador al siguiente","Insertar o borrar al inicio O(1); acceder al elemento i, O(n)"],
["Arreglo","Posiciones contiguas en memoria","Acceso por índice O(1); insertar en medio O(n)"],
["Tabla hash","Una función convierte la llave en una posición","Buscar e insertar O(1) promedio; colisiones por encadenamiento o direccionamiento abierto"],
["Grafo","Vértices y aristas (dirigidas o no, con peso o sin él)","Matriz de adyacencia (rápido consultar arista, ocupa V²) o lista de adyacencia (ahorra espacio)"]])}
<p>Recorrer un grafo: <b>BFS</b> (en anchura) usa una <b>cola</b> y encuentra el camino más corto en número de aristas; <b>DFS</b> (en profundidad) usa una <b>pila</b> o recursión y sirve para detectar ciclos u ordenar tareas con dependencias. Dijkstra encuentra caminos más cortos con pesos no negativos.</p>`],
["Algoritmos de ordenamiento y búsqueda",`${tbl(["Algoritmo","Mejor","Promedio","Peor","Nota"],[
["Burbuja","O(n)","O(n²)","O(n²)","Intercambia vecinos; simple y lento"],
["Selección","O(n²)","O(n²)","O(n²)","Busca el mínimo y lo coloca"],
["Inserción","O(n)","O(n²)","O(n²)","Bueno con datos casi ordenados"],
["Merge sort","O(n log n)","O(n log n)","O(n log n)","Divide y vencerás; usa memoria extra"],
["Quicksort","O(n log n)","O(n log n)","O(n²)","Muy rápido en la práctica; peor caso con mal pivote"],
["Heap sort","O(n log n)","O(n log n)","O(n log n)","Usa un montículo"],
["Búsqueda lineal","O(1)","O(n)","O(n)","No requiere orden"],
["Búsqueda binaria","O(1)","O(log n)","O(log n)","Requiere el arreglo ordenado"]])}`],
["Cómo calcular la complejidad de un código",`<p>Reglas prácticas para leer un fragmento y decir su Big-O:</p>
${tbl(["Patrón en el código","Complejidad"],[
["Instrucciones sin ciclos","O(1)"],
["Un ciclo de 1 a n","O(n)"],
["Dos ciclos anidados de 1 a n","O(n²)"],
["Ciclo interno de 1 a i (triangular)","O(n²): n(n+1)/2 vueltas"],
["La variable se duplica o se divide a la mitad","O(log n)"],
["Ciclo de n con uno interno que se duplica","O(n log n)"],
["Dos ciclos seguidos (no anidados)","O(n) + O(n) = O(n)"],
["Recursión que se llama dos veces con n−1 (Fibonacci ingenuo)","O(2ⁿ)"]])}
${note("Se conserva el término que más crece y se ignoran constantes: 3n² + 5n + 20 es O(n²). Toda recursión necesita un <b>caso base</b>; sin él, la pila de llamadas se desborda (stack overflow).")}`]
];

// ---------------------------------------------------------------- 3-3
LBY["3-3"] = [
["Git: los comandos que el examen confunde",`<p>Hiciste un commit con un error y ya lo subiste. Si usas <code>git reset</code> reescribes un historial que tus compañeros ya tienen; con <code>git revert</code> creas un commit nuevo que lo deshace sin tocar la historia publicada.</p>
${tbl(["Comando","Qué hace","Cuándo usarlo"],[
["git revert &lt;commit&gt;","Crea un commit inverso","Deshacer algo que ya se publicó"],
["git reset --soft / --hard","Mueve la rama a otro commit (--hard descarta cambios)","Deshacer en local, antes de publicar"],
["git merge","Une ramas con un commit de merge","Integrar conservando la historia tal cual"],
["git rebase","Reaplica tus commits sobre otra base; historia lineal","Actualizar tu rama local antes de integrarla (no en ramas compartidas)"],
["git cherry-pick","Aplica un commit específico de otra rama","Llevar una corrección puntual a otra rama"],
["git stash","Guarda cambios sin confirmar y limpia el área de trabajo","Cambiar de rama a mitad de algo"],
["git fetch / git pull","fetch descarga sin integrar; pull = fetch + merge","Revisar antes de integrar / actualizar"]])}
${note("Las tres áreas de Git: <b>directorio de trabajo</b> (tus archivos), <b>staging</b> (lo que preparaste con git add) y <b>repositorio</b> (lo confirmado con git commit).")}`],
["Flujos de trabajo con ramas",`${tbl(["Flujo","Cómo funciona","Conviene para"],[
["GitFlow","Ramas main, develop, feature/*, release/* y hotfix/*","Productos con versiones programadas"],
["GitHub Flow","main siempre desplegable; ramas cortas y pull requests","Aplicaciones web con despliegue continuo"],
["Trunk-based","Todos integran a la rama principal varias veces al día; feature flags","Equipos con CI/CD maduro"]])}
<p>Un <b>pull request</b> (o merge request) propone integrar una rama: dispara las pruebas automáticas, permite la revisión de código y deja registro de la decisión.</p>`],
["Pruebas del desarrollador y TDD",`<p>Antes de escribir <code>calcularDescuento()</code>, escribes una prueba que espera 10% para compras de 1,000. La prueba falla porque la función no existe; escribes lo mínimo para que pase; luego mejoras el código sin romperla. Eso es <b>TDD</b>: <b>rojo → verde → refactorizar</b>.</p>
${tbl(["Doble de prueba","Qué hace"],[["Dummy","Se pasa solo para llenar un parámetro"],["Stub","Devuelve respuestas fijas preparadas"],["Mock","Además verifica que se le llamó como se esperaba"],["Fake","Implementación simplificada que funciona (base en memoria)"]])}
<p>Una buena prueba unitaria sigue <b>FIRST</b>: rápida (Fast), independiente (Independent), repetible (Repeatable), con resultado claro (Self-validating) y escrita a tiempo (Timely). Su estructura típica es <b>Arrange, Act, Assert</b>.</p>`],
["Refactorización y code smells",`${tbl(["Code smell","Señal","Refactorización"],[
["Método largo","Una función de 200 líneas","Extraer método"],
["Clase dios","Una clase que hace de todo","Extraer clase"],
["Código duplicado","El mismo bloque en varios lugares","Extraer método o clase común"],
["Lista larga de parámetros","f(a, b, c, d, e, f, g)","Introducir objeto de parámetros"],
["Números mágicos","if (tipo == 3)","Reemplazar por constante con nombre"],
["Switch repetido por tipo","El mismo switch en varios métodos","Reemplazar condicional por polimorfismo"]])}
<p>Refactorizar es cambiar la estructura <b>sin cambiar el comportamiento</b>, y por eso se hace con pruebas que lo protejan. La <b>deuda técnica</b> es el costo futuro de las soluciones rápidas: si no se paga, cada cambio cuesta más.</p>`],
["Contenedores y orquestación",`${tbl(["","Máquina virtual","Contenedor"],[["Aísla","Un sistema operativo completo sobre un hipervisor","Procesos que comparten el kernel del host"],["Arranque","Minutos","Segundos"],["Tamaño","Gigabytes","Megabytes"],["Ejemplos","VirtualBox, VMware, Hyper-V","Docker, Podman"]])}
${code(`FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]`)}
<p>Un <b>Dockerfile</b> describe la imagen; una <b>imagen</b> es la plantilla; un <b>contenedor</b> es una imagen en ejecución. <b>Kubernetes</b> orquesta muchos contenedores: los reinicia si fallan, los escala según la carga y reparte el tráfico.</p>`]
];

// ---------------------------------------------------------------- 3-4
LBY["3-4"] = [
["Las familias de sentencias SQL",`${tbl(["Familia","Sentencias","Para qué"],[["DDL (definición)","CREATE, ALTER, DROP, TRUNCATE","Estructura: tablas, índices, vistas"],["DML (manipulación)","SELECT, INSERT, UPDATE, DELETE","Datos"],["DCL (control)","GRANT, REVOKE","Permisos"],["TCL (transacciones)","COMMIT, ROLLBACK, SAVEPOINT","Confirmar o deshacer"]])}
<p><b>Orden lógico de ejecución</b> de un SELECT (distinto del orden en que se escribe): FROM y JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. Por eso un alias definido en el SELECT no se puede usar en el WHERE, pero sí en el ORDER BY.</p>
${tbl(["Restricción","Garantiza"],[["PRIMARY KEY","Valor único y no nulo que identifica la fila"],["FOREIGN KEY","Que el valor exista en la tabla referenciada (integridad referencial)"],["UNIQUE","Que no se repita"],["NOT NULL","Que siempre tenga valor"],["CHECK","Una condición (precio > 0)"],["DEFAULT","Un valor cuando no se indica otro"]])}`],
["NULL: las reglas que hacen tropezar",`<p>La tabla de clientes tiene un teléfono vacío (NULL). La consulta <code>WHERE telefono = NULL</code> no devuelve nada. ¿Por qué? NULL significa “desconocido”, y comparar algo con lo desconocido da <b>desconocido</b>, no verdadero.</p>
${tbl(["Expresión","Resultado"],[["NULL = NULL","Desconocido (usa IS NULL)"],["5 + NULL","NULL"],["COUNT(*)","Cuenta todas las filas"],["COUNT(columna)","Ignora los NULL"],["SUM, AVG, MAX, MIN","Ignoran los NULL"],["x NOT IN (1, 2, NULL)","Nunca es verdadero: no devuelve filas"],["COALESCE(telefono, 'sin dato')","Reemplaza el NULL por un valor"],["TRUE AND NULL / TRUE OR NULL","NULL / TRUE"]])}`],
["Subconsultas, EXISTS y vistas",`${tbl(["Tipo","Ejemplo","Comentario"],[
["Escalar","WHERE sueldo > (SELECT AVG(sueldo) FROM empleados)","Devuelve un solo valor"],
["Con IN","WHERE id IN (SELECT id_cliente FROM pedidos)","Lista de valores; cuidado con los NULL en NOT IN"],
["Correlacionada","WHERE sueldo > (SELECT AVG(x.sueldo) FROM empleados x WHERE x.depto = e.depto)","Se evalúa por cada fila externa"],
["EXISTS / NOT EXISTS","WHERE NOT EXISTS (SELECT 1 FROM pedidos p WHERE p.id_cliente = c.id)","Verdadero si hay al menos una fila; seguro con NULL"]])}
<p>Una <b>vista</b> es una consulta guardada con nombre: simplifica consultas y restringe qué columnas ve cada usuario. Una <b>vista materializada</b> además guarda el resultado y se refresca. Un <b>índice</b> acelera búsquedas y JOINs pero hace más lentas las escrituras.</p>`],
["Niveles de aislamiento y concurrencia",`<p>Dos cajeros consultan y modifican el mismo saldo al mismo tiempo. Lo que cada transacción puede ver de la otra depende del <b>nivel de aislamiento</b>:</p>
${tbl(["Nivel","Lectura sucia","Lectura no repetible","Lectura fantasma"],[["Read uncommitted","Puede ocurrir","Puede ocurrir","Puede ocurrir"],["Read committed","Evitada","Puede ocurrir","Puede ocurrir"],["Repeatable read","Evitada","Evitada","Puede ocurrir"],["Serializable","Evitada","Evitada","Evitada"]])}
<p>A mayor aislamiento, menos anomalías y menos concurrencia. Un <b>interbloqueo</b> (deadlock) ocurre cuando dos transacciones esperan cada una un recurso que tiene la otra; el gestor aborta una de ellas.</p>`],
["Álgebra relacional y su SQL",`${tbl(["Operador","Símbolo","Equivale en SQL"],[["Selección","σ condición(R)","WHERE"],["Proyección","π columnas(R)","SELECT columnas (con DISTINCT)"],["Producto cartesiano","R × S","CROSS JOIN o FROM R, S"],["Reunión (join)","R ⋈ S","JOIN … ON"],["Unión","R ∪ S","UNION"],["Diferencia","R − S","EXCEPT (MINUS en Oracle)"],["Intersección","R ∩ S","INTERSECT"],["Renombrar","ρ","AS"],["División","R ÷ S","“Los que tienen relación con todos”: NOT EXISTS doble"]])}
<p>Ejemplo: π nombre(σ carrera='ISC'(ALUMNO)) es <code>SELECT DISTINCT nombre FROM alumno WHERE carrera = 'ISC'</code>. Unión, diferencia e intersección exigen que ambas relaciones sean <b>compatibles</b>: mismas columnas y tipos.</p>`]
];

// ---------------------------------------------------------------- 3-5
LBY["3-5"] = [
["Web: cómo se entrega una página",`<p>Cuando abres una tienda en línea, tu navegador (cliente) pide la página al servidor por HTTP. Lo que cambia es <b>dónde se arma el HTML</b>:</p>
${tbl(["Enfoque","Cómo funciona","Ventaja","Desventaja"],[
["MPA (multipágina)","Cada clic pide una página completa al servidor","Simple, buen SEO","Recargas constantes"],
["SPA (una sola página)","Se carga una vez; JavaScript pide datos (JSON) y actualiza la vista","Experiencia fluida como app","Primera carga pesada, SEO más difícil"],
["SSR (renderizado en servidor)","El servidor genera el HTML de cada página y luego JavaScript la vuelve interactiva","Rápido al inicio y buen SEO","Más carga en el servidor"],
["Sitio estático (SSG)","Las páginas se generan al construir y se sirven desde una CDN","Muy rápido y barato","El contenido cambia solo al volver a construir"]])}
<p>El <b>frontend</b> (HTML, CSS, JavaScript y frameworks como React o Angular) corre en el navegador; el <b>backend</b> (Node, Java, Python, PHP) corre en el servidor con la lógica y los datos.</p>`],
["Sistemas embebidos y de tiempo real",`<p>El controlador de las bolsas de aire de un auto debe responder en milisegundos, siempre. Si responde tarde, la respuesta es inútil aunque sea correcta. Eso es un sistema de <b>tiempo real duro</b>.</p>
${tbl(["Tipo","Si se pasa del plazo…","Ejemplos"],[["Tiempo real duro","Falla del sistema, con riesgo","Marcapasos, frenos ABS, control de vuelo"],["Tiempo real suave","Baja la calidad, pero sigue siendo útil","Streaming de video, videojuegos"]])}
<p>Un sistema <b>embebido</b> es una computadora dedicada a una función dentro de otro dispositivo, con recursos limitados: poca memoria, bajo consumo y sin pantalla. Se programan sobre todo en C o C++, a veces sin sistema operativo o con un <b>RTOS</b>, que garantiza tiempos de respuesta deterministas. En <b>IoT</b>, muchos de estos dispositivos envían datos a la nube con protocolos ligeros como MQTT.</p>`],
["Nube: modelos de servicio y de despliegue",`${tbl(["Modelo","Tú administras","El proveedor administra","Ejemplo"],[["On-premise","Todo","Nada","Servidores propios"],["IaaS","SO, runtime, aplicación, datos","Hardware, red, virtualización","AWS EC2, Azure VM"],["PaaS","Aplicación y datos","Además el SO y el runtime","Heroku, App Engine, Vercel"],["SaaS","Solo su uso y configuración","Todo","Gmail, Salesforce"],["FaaS (serverless)","Funciones","Todo, incluido el escalado por evento","AWS Lambda"]])}
${tbl(["Despliegue","Descripción"],[["Nube pública","Infraestructura compartida de un proveedor, pago por uso"],["Nube privada","Dedicada a una organización (propia o de un tercero)"],["Nube híbrida","Combina pública y privada, con datos sensibles en la privada"],["Nube comunitaria","Compartida por organizaciones con necesidades similares (por ejemplo, gobierno)"]])}
<p>La ventaja central de la nube es la <b>elasticidad</b>: agregar o quitar recursos según la demanda y pagar solo por lo que se usa.</p>`]
];

// ---------------------------------------------------------------- 4-1
LBY["4-1"] = [
["PERT con probabilidad: ¿terminaremos a tiempo?",`<p>La ruta crítica de un proyecto suma T<sub>e</sub> = 30 días y su varianza total es 4 (σ = 2). El cliente pregunta qué probabilidad hay de terminar en 32 días o menos.</p>
${code(`Z = (T objetivo − Te) / σ = (32 − 30) / 2 = 1
P(Z ≤ 1) ≈ 0.84  →  84% de probabilidad`)}
${tbl(["Z","Probabilidad de terminar a tiempo"],[["0","50% (exactamente en T<sub>e</sub>)"],["1","≈ 84%"],["2","≈ 97.7%"],["3","≈ 99.9%"],["−1","≈ 16%"]])}
${note("Para la σ de una ruta se <b>suman las varianzas</b> de sus actividades y se saca la raíz. Sumar desviaciones da un valor mayor y es el distractor más común.")}`],
["Ruta crítica, ida y regreso, con un ejemplo",`<p>Actividades: A (3 días), B (4 días, después de A), C (2 días, después de A), D (5 días, después de B y C).</p>
${tbl(["Act.","Dur.","Inicio temprano","Fin temprano","Inicio tardío","Fin tardío","Holgura"],[["A","3","0","3","0","3","0"],["B","4","3","7","3","7","0"],["C","2","3","5","5","7","2"],["D","5","7","12","7","12","0"]])}
<p><b>Ida</b>: el inicio temprano de D es el <i>máximo</i> fin temprano de sus predecesoras (7, de B). <b>Regreso</b>: el fin tardío de C es el <i>mínimo</i> inicio tardío de sus sucesoras (7, de D). Ruta crítica: A → B → D, con duración de 12 días. C puede retrasarse hasta 2 días sin afectar al proyecto.</p>
${note("Para acortar el proyecto se puede hacer <b>crashing</b> (agregar recursos a actividades críticas, con más costo) o <b>fast tracking</b> (hacer en paralelo lo que iba en secuencia, con más riesgo).")}`],
["Otras formas de estimar",`${tbl(["Técnica","Cómo funciona","Cuándo"],[
["Juicio experto","Alguien con experiencia estima","Al inicio, con poca información"],
["Por analogía","Se compara con un proyecto anterior parecido","Hay histórico de proyectos similares"],
["Delphi","Expertos estiman por separado y convergen en rondas anónimas","Evitar el sesgo de autoridad"],
["Puntos de función","Se cuentan entradas, salidas, consultas, archivos internos e interfaces, y se ajustan por complejidad","Medir tamaño funcional sin depender del lenguaje"],
["COCOMO","Esfuerzo a partir del tamaño en KLOC","Ya se conoce el tamaño aproximado"],
["Puntos de historia y velocidad","El equipo estima en puntos relativos; la velocidad dice cuántos termina por Sprint","Proyectos ágiles"],
["Tres puntos (PERT)","Optimista, más probable y pesimista","Hay incertidumbre en cada actividad"]])}
<p>La <b>EDT</b> (estructura de desglose del trabajo, WBS) descompone todo el alcance en entregables y paquetes de trabajo; es la base para estimar, asignar y programar. El <b>diagrama de Gantt</b> muestra esas actividades en el tiempo.</p>`],
["Gestión de riesgos completa",`<p>Riesgo: “el único experto en el sistema de pagos podría renunciar”. Probabilidad media (40%), impacto de $200,000 en retrasos. Exposición: 0.4 × 200,000 = $80,000.</p>
${tbl(["Etapa","Qué se hace"],[["Identificar","Lluvia de ideas, listas de verificación, lecciones aprendidas"],["Analizar cualitativamente","Matriz de probabilidad e impacto (alto, medio, bajo)"],["Analizar cuantitativamente","Exposición = probabilidad × impacto; simulación"],["Planear la respuesta","Evitar, mitigar, transferir o aceptar"],["Monitorear","Revisar indicadores y disparadores durante todo el proyecto"]])}
${tbl(["Respuesta","Qué hace","Ejemplo"],[["Evitar","Elimina la causa","No usar la tecnología experimental"],["Mitigar","Reduce probabilidad o impacto","Documentar y capacitar a un segundo experto"],["Transferir","Pasa el impacto a un tercero","Seguro, contrato con penalización"],["Aceptar","Asume el riesgo; activa o pasiva (con fondo de contingencia)","Riesgo menor, se vigila"]])}`],
["Valor ganado: ¿vamos bien en costo y tiempo?",`<p>A mitad del proyecto, se planeaba haber hecho trabajo por $100,000 (PV). Se terminó trabajo que vale $80,000 (EV) y se han gastado $90,000 (AC).</p>
${tbl(["Indicador","Fórmula","Resultado","Lectura"],[["Variación del costo","CV = EV − AC","−10,000","Sobrecosto"],["Variación del cronograma","SV = EV − PV","−20,000","Atraso"],["Índice de costo","CPI = EV / AC","0.89","Por cada peso gastado se obtienen 89 centavos de trabajo"],["Índice de cronograma","SPI = EV / PV","0.80","Se avanza al 80% del ritmo planeado"]])}
${note("Menor que 1 (o negativo, en las variaciones) es malo; mayor que 1 es bueno. Siempre se compara contra el <b>valor ganado</b> (EV).")}`]
];

// ---------------------------------------------------------------- 4-2a
LBY["4-2a"] = [
["Verificar y validar; error, defecto y falla",`<p>El programador escribe mal una condición (<b>error</b> humano), eso deja un <b>defecto</b> en el código, y el usuario ve que el total sale mal (<b>falla</b>). Las pruebas buscan defectos provocando fallas.</p>
${tbl(["","Verificación","Validación"],[["Pregunta","¿Lo construimos bien?","¿Construimos lo correcto?"],["Contra qué","Especificación y diseño","Necesidades reales del usuario"],["Ejemplos","Revisiones, inspecciones, pruebas unitarias","Pruebas de aceptación, beta, prototipos con usuarios"]])}
<p>Pruebas <b>estáticas</b>: revisan sin ejecutar (revisiones de código, análisis estático). Pruebas <b>dinámicas</b>: ejecutan el software.</p>`],
["Más técnicas de caja negra",`<p>Un campo de edad acepta de 18 a 65. La <b>partición de equivalencia</b> divide las entradas en grupos que el sistema debe tratar igual: menor de 18 (inválida), de 18 a 65 (válida), mayor de 65 (inválida) y no numérica (inválida). Se prueba un valor de cada grupo. Los <b>valores límite</b> se prueban justo en las orillas: 17, 18, 65 y 66.</p>
${tbl(["Técnica","Úsala cuando"],[["Partición de equivalencia","Hay rangos o categorías de entrada"],["Valores límite","Hay fronteras numéricas"],["Tabla de decisión","El resultado depende de combinaciones de condiciones (cliente VIP y monto > 1,000 → descuento)"],["Transición de estados","El comportamiento depende del estado (bloquear la cuenta al tercer intento fallido)"],["Casos de uso","Se recorren los flujos principal y alternos"],["Prueba exploratoria","Un probador experto diseña y ejecuta al mismo tiempo"]])}`],
["Cobertura de caja blanca",`${code(`si (a > 0 Y b > 0) entonces
    x ← 1
fin si`)}
${tbl(["Criterio","Qué exige","Casos mínimos aquí"],[["Sentencias","Ejecutar cada instrucción al menos una vez","1 caso: a=1, b=1"],["Ramas (decisiones)","Cada decisión en verdadero y en falso","2 casos: (1,1) y (0,1)"],["Condiciones","Cada condición simple en verdadero y en falso","2 casos: (1,0) y (0,1)"],["Caminos","Todos los caminos independientes","V(G) = 2 predicados (a > 0, b > 0) + 1 = 3 caminos básicos"]])}
<p>La cobertura de ramas incluye a la de sentencias, pero no al revés. 100% de cobertura no garantiza ausencia de defectos: solo dice qué se ejecutó.</p>`],
["Estrategias de integración y pruebas no funcionales",`${tbl(["Integración","Cómo","Usa"],[["Descendente (top-down)","De los módulos de arriba hacia abajo","Stubs para simular los de abajo"],["Ascendente (bottom-up)","De los módulos de abajo hacia arriba","Drivers para simular los de arriba"],["Sándwich","Ambas a la vez hacia el centro","Stubs y drivers"],["Big bang","Todo junto al final","Nada; difícil localizar fallas"]])}
${tbl(["Prueba no funcional","Qué mide"],[["Carga","Comportamiento con la demanda esperada"],["Estrés","Comportamiento más allá del límite y cómo se recupera"],["Volumen","Grandes cantidades de datos"],["Seguridad","Resistencia a ataques (inyección SQL, XSS)"],["Usabilidad","Facilidad de uso con usuarios reales"],["Compatibilidad","Distintos navegadores, dispositivos y sistemas"],["Recuperación","Volver a operar tras una falla"]])}`],
["Métricas de calidad",`${tbl(["Métrica","Fórmula o idea"],[["Densidad de defectos","Defectos / tamaño (KLOC o puntos de función)"],["MTBF","Tiempo medio entre fallas (más es mejor)"],["MTTR","Tiempo medio de reparación (menos es mejor)"],["Disponibilidad","MTBF / (MTBF + MTTR)"],["Eficacia en la remoción de defectos (DRE)","Defectos encontrados antes de liberar / total de defectos"],["Cobertura de pruebas","Porcentaje de código o requerimientos ejecutados por las pruebas"]])}`]
];

// ---------------------------------------------------------------- 4-2b
LBY["4-2b"] = [
["ISO/IEC 25010 con sus subcaracterísticas",`<p>Un hospital pide que su sistema “sea de calidad”. La norma convierte esa palabra vaga en características medibles:</p>
${tbl(["Característica","Subcaracterísticas (versión 2011)"],[
["Adecuación funcional","Completitud, corrección, pertinencia"],
["Eficiencia de desempeño","Comportamiento temporal, uso de recursos, capacidad"],
["Compatibilidad","Coexistencia, interoperabilidad"],
["Usabilidad","Reconocibilidad de la adecuación, aprendizaje, operabilidad, protección contra errores del usuario, estética, accesibilidad"],
["Fiabilidad","Madurez, disponibilidad, tolerancia a fallas, recuperabilidad"],
["Seguridad","Confidencialidad, integridad, no repudio, responsabilidad, autenticidad"],
["Mantenibilidad","Modularidad, reusabilidad, analizabilidad, modificabilidad, capacidad de prueba"],
["Portabilidad","Adaptabilidad, instalabilidad, reemplazabilidad"]])}
${note("En la versión 2023 son nueve: usabilidad se llama <b>capacidad de interacción</b>, portabilidad se llama <b>flexibilidad</b> (con escalabilidad) y se agrega <b>protección</b> (safety: no causar daño a personas o bienes).")}`],
["Calidad en uso y la familia SQuaRE",`<p>El software puede cumplir todas las características del producto y aun así frustrar a quien lo usa en su trabajo real. Eso lo mide el <b>modelo de calidad en uso</b>:</p>
${tbl(["Característica en uso","Pregunta"],[["Eficacia","¿El usuario logra su objetivo?"],["Eficiencia","¿Con cuántos recursos y tiempo?"],["Satisfacción","¿Le gusta, confía, le resulta cómodo?"],["Libertad de riesgo","¿Evita riesgos económicos, de salud o ambientales?"],["Cobertura de contexto","¿Funciona en todos los contextos previstos, y en otros?"]])}
<p>ISO/IEC 25010 pertenece a la familia <b>ISO/IEC 25000 (SQuaRE)</b>, que también incluye la medición (2502n) y la evaluación (2504n). Otras normas que aparecen: <b>ISO/IEC 12207</b> (procesos del ciclo de vida del software), <b>ISO 9001</b> (gestión de la calidad de cualquier organización) e <b>ISO/IEC 29110</b> (procesos para entidades muy pequeñas).</p>`],
["CMMI y MoProSoft",`${tbl(["Nivel CMMI","Nombre","Cómo es la organización"],[["1","Inicial","Procesos impredecibles; el éxito depende de héroes"],["2","Gestionado","Cada proyecto se planea, se da seguimiento y se controla"],["3","Definido","Procesos estándar de la organización, adaptados a cada proyecto"],["4","Gestionado cuantitativamente","Procesos controlados con métricas y estadística"],["5","En optimización","Mejora continua basada en esos datos"]])}
<p>CMMI tiene dos representaciones: <b>por etapas</b> (niveles de madurez de toda la organización) y <b>continua</b> (niveles de capacidad por área de proceso).</p>
<p>En México existe <b>MoProSoft</b> (norma NMX-I-059-NYCE), un modelo de procesos para pequeñas y medianas empresas de software, organizado en tres categorías: <b>Alta Dirección</b>, <b>Gestión</b> y <b>Operación</b>.</p>`]
];

// ---------------------------------------------------------------- 4-2c
LBY["4-2c"] = [
["El mantenimiento a fondo",`<p>La mayor parte del costo de un sistema no está en construirlo, sino en mantenerlo durante años. Por eso conviene distinguir bien los tipos:</p>
${tbl(["Tipo","Detonante","Ejemplo"],[["Correctivo","Un defecto","El reporte suma dos veces las devoluciones"],["Adaptativo","Cambia el entorno: sistema operativo, ley, hardware, proveedor","Nueva versión del CFDI, migrar a otra nube"],["Perfectivo","Los usuarios piden mejoras o más rendimiento","Exportar a Excel, búsquedas más rápidas"],["Preventivo","Evitar problemas futuros","Refactorizar un módulo frágil, actualizar una biblioteca que perderá soporte"]])}
${tbl(["Práctica","Qué es"],[["Ingeniería inversa","Analizar un sistema para recuperar su diseño o documentación"],["Reingeniería","Reestructurar un sistema heredado para mejorarlo sin cambiar su función"],["Migración","Llevar el sistema o sus datos a otra plataforma"]])}
${note("Las <b>leyes de Lehman</b> dicen que un sistema en uso debe cambiar continuamente o se vuelve menos útil, y que su complejidad crece a menos que se trabaje para reducirla.")}`],
["Gestión de la configuración",`<p>Un cliente reporta un error en la versión 2.3.1. El equipo ya va en la 2.5.0. ¿Cómo reproducir exactamente lo que tiene el cliente? Gracias a la <b>gestión de la configuración</b>.</p>
${tbl(["Actividad","Qué hace"],[["Identificación","Define los elementos de configuración (código, documentos, scripts, bibliotecas) y les asigna versión"],["Control de cambios","Solicitud → análisis de impacto → aprobación del comité (CCB) → implementación → verificación"],["Registro del estado","Informa qué versión tiene cada elemento y qué cambios están pendientes"],["Auditoría","Verifica que la configuración liberada coincide con lo aprobado"]])}
<p>Una <b>línea base</b> es una versión aprobada que solo cambia mediante el control formal. Un <b>release</b> es una versión que se entrega a usuarios.</p>`],
["Licencias de software",`${tbl(["Licencia","Tipo","Puedes usarla en software cerrado","Obligación principal"],[["GPL","Copyleft fuerte","No, si distribuyes el derivado","El derivado distribuido debe ser GPL con su código fuente"],["LGPL","Copyleft débil","Sí, enlazando la biblioteca","Las modificaciones a la biblioteca se liberan"],["MIT","Permisiva","Sí","Conservar el aviso de copyright"],["BSD","Permisiva","Sí","Conservar el aviso; algunas variantes prohíben usar el nombre del autor"],["Apache 2.0","Permisiva","Sí","Conservar avisos; incluye concesión de patentes"],["Propietaria","Cerrada","—","Uso según el contrato (EULA)"]])}
<p>Software <b>libre</b> se refiere a libertades (usar, estudiar, modificar y distribuir), no a precio. <b>Freeware</b> es gratuito pero cerrado.</p>`],
["Implantar: más que instalar",`${tbl(["Actividad","Incluye"],[["Preparar el entorno","Servidores, red, licencias, respaldos"],["Migrar datos","Extraer, limpiar, transformar y cargar; validar conteos y totales"],["Capacitar","Usuarios finales y administradores"],["Documentar","Manual de usuario (cómo usarlo), manual técnico (cómo instalarlo y mantenerlo), manual de operación"],["Elegir la estrategia","Directa, paralela, piloto o por fases"],["Dar soporte","Mesa de ayuda y periodo de estabilización"]])}`]
];

// ---------------------------------------------------------------- 4-3
LBY["4-3"] = [
["Scrum: eventos, duraciones y conceptos",`${tbl(["Evento","Duración máxima (Sprint de 1 mes)","Propósito"],[["Sprint","1 mes","Contenedor de todos los eventos; produce un incremento"],["Sprint Planning","8 horas","Por qué es valioso, qué se hará y cómo"],["Daily Scrum","15 minutos","Revisar el avance hacia el Objetivo del Sprint"],["Sprint Review","4 horas","Inspeccionar el incremento con los interesados"],["Sprint Retrospective","3 horas","Mejorar la forma de trabajar"]])}
${tbl(["Concepto","Qué es"],[["Definición de Terminado","Criterio de calidad que todo incremento debe cumplir"],["Refinamiento","Detallar, dividir y estimar elementos del Product Backlog (actividad continua, no evento)"],["Velocidad","Puntos que el equipo termina por Sprint; sirve para planear"],["Burndown","Gráfica del trabajo restante contra el tiempo"],["Objetivo del Producto","Meta de largo plazo; compromiso del Product Backlog"]])}
${note("Los valores de Scrum: compromiso, enfoque, apertura, respeto y coraje. Sus pilares empíricos: <b>transparencia, inspección y adaptación</b>.")}`],
["El Manifiesto Ágil y otras prácticas ágiles",`<p>El Manifiesto Ágil (2001) valora:</p>
${tbl(["Más","sobre"],[["Individuos e interacciones","Procesos y herramientas"],["Software funcionando","Documentación extensiva"],["Colaboración con el cliente","Negociación contractual"],["Respuesta ante el cambio","Seguir un plan"]])}
<p>“Sobre” no significa “en lugar de”: lo de la derecha también tiene valor.</p>
${tbl(["Método","Prácticas distintivas"],[["XP","Programación en parejas, TDD, integración continua, refactorización, entregas pequeñas, cliente en el sitio, propiedad colectiva del código"],["Kanban","Visualizar el flujo, limitar el WIP, gestionar el flujo; mide lead time (desde la solicitud) y cycle time (desde que se empieza)"],["Lean","Eliminar desperdicio, entregar rápido, decidir lo más tarde posible, amplificar el aprendizaje"],["Scrum a escala","Nexus, LeSS y SAFe coordinan varios equipos sobre un mismo producto"]])}`],
["Modelos tradicionales a fondo",`${tbl(["Modelo","Idea","Fortaleza","Debilidad"],[
["Cascada","Fases secuenciales: requisitos, diseño, implementación, pruebas, mantenimiento","Control y documentación","El cliente ve el producto hasta el final; cambios costosos"],
["Modelo en V","Cascada donde cada fase de desarrollo tiene su nivel de prueba","Planeación temprana de pruebas","Igual de rígido que cascada"],
["Incremental","Se entrega el sistema por partes funcionales","Valor temprano","Requiere una buena arquitectura inicial"],
["Iterativo","Se repite el ciclo completo refinando el producto","Aprende y ajusta","Difícil estimar el final"],
["Prototipos","Construir primero lo que menos se entiende","Aclara requisitos","El prototipo puede confundirse con el producto"],
["Espiral (Boehm)","Iteraciones con análisis de riesgos explícito en cada vuelta","Proyectos grandes y riesgosos","Requiere experiencia en riesgos"],
["RUP","Fases: inicio, elaboración, construcción, transición; iterativo y guiado por casos de uso","Arquitectura sólida temprano","Pesado para equipos pequeños"],
["RAD","Desarrollo rápido con prototipos y fuerte participación del usuario","Entregas muy rápidas","Poco adecuado para sistemas críticos"]])}
${note("En RUP, la <b>elaboración</b> estabiliza la arquitectura y los riesgos principales; la <b>construcción</b> desarrolla la mayor parte; la <b>transición</b> entrega el sistema al usuario.")}`]
];

// ---------------------------------------------------------------- 5-1
LBY["5-1"] = [
["Tipos de texto y su propósito",`${tbl(["Tipo","Propósito","Señales"],[["Narrativo","Contar hechos en el tiempo","Personajes, secuencia, verbos en pasado"],["Descriptivo","Mostrar cómo es algo","Adjetivos, características"],["Expositivo","Explicar o informar con objetividad","Definiciones, datos, ejemplos, tono neutro"],["Argumentativo","Convencer con razones","Tesis, argumentos, “por lo tanto”, “sin embargo”"],["Instructivo","Indicar cómo hacer algo","Pasos, imperativos, numeración"]])}
<p>Un texto <b>argumentativo</b> tiene tesis (la postura), argumentos (las razones), a veces un contraargumento que se refuta y una conclusión. La idea principal de un texto argumentativo es su tesis.</p>`],
["Inferir sin inventar",`<p>Texto: “Desde que la empresa adoptó revisiones de código obligatorias, los reportes de errores en producción bajaron a la mitad, aunque las entregas se retrasaron un día en promedio.”</p>
${tbl(["Afirmación","¿Se infiere?","Por qué"],[["Las revisiones se asocian con menos errores en producción","Sí","Lo dice el texto"],["Las revisiones tuvieron un costo en tiempo","Sí","El retraso de un día"],["Las revisiones eliminaron todos los errores","No","Bajaron a la mitad, no a cero"],["La empresa debería dejar de hacer revisiones","No","El texto no da esa recomendación"],["Antes no se revisaba el código de forma obligatoria","Sí, con prudencia","“Desde que adoptó” lo implica"]])}
${note("Desconfía de las opciones con <b>absolutos</b> (siempre, nunca, todos, ninguno) y de las que agregan opiniones o datos que el texto no menciona. La respuesta correcta suele ser la más prudente que se apoya en el texto.")}`],
["Propósito del autor y significado por contexto",`<p>Preguntas típicas y cómo resolverlas:</p>
${tbl(["Pregunta","Cómo resolverla"],[["¿Cuál es el propósito del autor?","Identifica el tipo de texto: informar, convencer, narrar, instruir"],["¿Qué significa la palabra X en el texto?","Sustitúyela por cada opción y ve cuál conserva el sentido de la oración"],["¿Qué función cumple el párrafo 3?","Ubica su relación con los demás: ejemplifica, contrasta, concluye, introduce"],["¿Qué título es el más adecuado?","El que abarca todo el texto, no solo una parte"],["¿Cuál es la conclusión?","Busca conectores como “en suma”, “por lo tanto”, “en conclusión”"]])}`]
];

// ---------------------------------------------------------------- 5-2
LBY["5-2"] = [
["Acentuación: las reglas completas",`${tbl(["Tipo de palabra","Sílaba tónica","Lleva tilde cuando…","Ejemplos"],[["Aguda","Última","Termina en vocal, n o s","café, canción, compás; pero reloj, pared"],["Grave (llana)","Penúltima","No termina en vocal, n o s","árbol, lápiz, fácil; pero examen, casa"],["Esdrújula","Antepenúltima","Siempre","código, número, análisis"],["Sobresdrújula","Antes de la antepenúltima","Siempre","dígaselo, entrégamelo"]])}
<p>Los adverbios en <b>-mente</b> conservan la tilde del adjetivo (rápida → rápidamente; fácil → fácilmente). Los monosílabos no llevan tilde, salvo la <b>diacrítica</b>:</p>
${tbl(["Con tilde","Sin tilde"],[["él (pronombre)","el (artículo)"],["tú (pronombre)","tu (posesivo)"],["mí (pronombre)","mi (posesivo)"],["sí (afirmación o pronombre)","si (condicional)"],["más (cantidad)","mas (pero)"],["té (bebida)","te (pronombre)"],["dé (verbo dar)","de (preposición)"],["sé (saber o ser)","se (pronombre)"]])}
<p>Los interrogativos y exclamativos llevan tilde: qué, cómo, cuándo, dónde, quién, cuál, cuánto (también en preguntas indirectas: “no sé <b>qué</b> pasó”).</p>`],
["Porque, por qué, porqué, por que y otros homófonos",`${tbl(["Forma","Uso","Ejemplo"],[["porque","Causa (respuesta)","Falló porque no había índice"],["por qué","Pregunta","¿Por qué falló?"],["porqué","Sustantivo (la causa)","No entiendo el porqué del error"],["por que","Preposición + relativo (“por el cual”)","Esa es la razón por que lo cambiamos"]])}
${tbl(["Confusión","Correcto"],[["haber / a ver","Debe haber un error · Vamos a ver el código"],["hay / ahí / ay","Hay tres errores · Ponlo ahí · ¡Ay, se cayó!"],["sino / si no","No es un error, sino una advertencia · Si no compila, revisa"],["echo / hecho","Echo el archivo a la papelera · El hecho es que funcionó"],["valla / vaya / baya","Una valla publicitaria · Que te vaya bien · Una baya roja"]])}`],
["Puntuación y concordancia",`${tbl(["Signo","Usos principales","Ejemplo"],[["Coma","Vocativo, aposición, enumeración, incisos, antes de pero","Ana, revisa el código · Luis, el líder, aprobó"],["Punto y coma","Separar elementos con comas internas; entre oraciones relacionadas","Ana, analista; Luis, tester; y Eva, arquitecta"],["Dos puntos","Antes de una enumeración, cita o explicación","Faltan tres cosas: pruebas, manual y despliegue"],["Punto","Cerrar oraciones y párrafos","—"]])}
${note("Nunca se pone coma entre sujeto y verbo: “Los usuarios del sistema<b>,</b> reportaron fallas” es incorrecto.")}
${tbl(["Fenómeno","Incorrecto","Correcto"],[["Dequeísmo (sobra “de”)","Pienso de que funciona","Pienso que funciona"],["Queísmo (falta “de”)","Me di cuenta que falló","Me di cuenta de que falló"],["Concordancia con pasiva refleja","Se vende computadoras","Se venden computadoras"],["Haber impersonal","Hubieron problemas","Hubo problemas"],["Gerundio de posterioridad","Se cayó el servidor, reiniciándose después","Se cayó el servidor y después se reinició"]])}`],
["Cohesión y coherencia",`<p>Un texto es <b>coherente</b> cuando sus ideas forman un todo con sentido y siguen un orden lógico; es <b>cohesivo</b> cuando sus oraciones están bien enlazadas mediante recursos gramaticales.</p>
${tbl(["Recurso de cohesión","Ejemplo"],[["Conectores","Sin embargo, por lo tanto, además, es decir"],["Pronombres (referencia)","Instalamos el servidor; <b>lo</b> configuramos ayer"],["Sinónimos","El sistema… la plataforma… la herramienta"],["Elipsis (omitir lo ya dicho)","Ana revisó el código y Luis, las pruebas"]])}
${tbl(["Función del conector","Ejemplos"],[["Adición","además, asimismo, también"],["Contraste u oposición","pero, sin embargo, no obstante, en cambio"],["Concesión","aunque, a pesar de que, aun así"],["Causa","porque, ya que, puesto que"],["Consecuencia","por lo tanto, por ello, en consecuencia"],["Condición","si, siempre que, en caso de que"],["Reformulación","es decir, o sea, en otras palabras"],["Ejemplificación","por ejemplo, tal como"],["Conclusión","en conclusión, en suma, finalmente"],["Orden","primero, en seguida, por último"]])}`]
];

Object.keys(LBY).forEach(id=>{ if(LB[id]) LB[id].s = LB[id].s.concat(LBY[id]); });
