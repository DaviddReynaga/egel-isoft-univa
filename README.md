# Arena EGEL ISOFT

App web de estudio para el **EGEL Plus ISOFT (Ingeniería de Software)** del CENEVAL.

Incluye lecciones con diagramas, simulacros con más de 300 reactivos estilo CENEVAL, examen completo con tiempos oficiales, repaso espaciado de errores, ejercicios de diagramas y de SQL, ronda relámpago, tarjetas y un formulario descargable en PDF.

El progreso de cada persona se guarda en su propio navegador (`localStorage`); no hay servidor ni cuentas.

> Material de estudio no oficial, basado en la Guía para el sustentante EGEL Plus ISOFT. Verifica fechas y requisitos en tu pase de ingreso.

## Estructura

```
src/index.template.html   Estilos, encabezado, menú y secciones (con marcas /*NOMBRE*/)
src/js/*.js               Datos y módulos de la app; build.js los inserta en orden
public/                   Archivos que se publican tal cual (formulario en PDF)
build.js                  Genera dist/index.html
scripts/check.js          Revisa que el banco de reactivos esté completo
scripts/generar_pdf.py    Regenera el PDF del formulario
```

Archivos de datos principales:

| Archivo | Contenido |
|---|---|
| `data.js` | Banco base de reactivos `Q`, tarjetas, ronda relámpago |
| `hard1.js`, `hard2.js`, `hard4.js` | Reactivos avanzados `QH` (con `w`: por qué cada distractor es incorrecto) |
| `why.js` | Por qué son incorrectos los distractores del banco base |
| `lessons.js`, `lb1.js`, `lb2.js` | Lecciones y sus diagramas |
| `rayo2.js` | Situaciones de la ronda relámpago |
| `app8.js`, `sql2.js` | Plantillas de los ejercicios de SQL |
| `app7.js` | Ejercicios de "encuentra el error en el diagrama" |
| `app9.js` | Contenido del formulario |

## Trabajar en local

```bash
npm run build      # genera dist/index.html
npm run check      # build + revisión del banco
```

Abre `dist/index.html` en el navegador.

## Publicación

El sitio se publica en Vercel. Cada pull request genera una vista previa con su propia URL y, al hacer merge a `main`, se actualiza la página principal.

Para agregar reactivos: añádelos a `src/js/hard*.js` con la forma
`{a: área, l: "id de lección", q, o: [correcta, distractor1, distractor2], e, w: [porqué1, porqué2]}`
(la correcta va siempre primero; la app revuelve las opciones). Si cambias el formulario de `app9.js`, regenera el PDF con `python3 scripts/generar_pdf.py`.
