// ===================== Registro de vistas nuevas =====================
VIEWS.push("examen","diagramas","sql","formulario");
Object.assign(NEWV,{diagramas:dgSetup, sql:sqSetup, formulario:formSetup});
Object.assign(ICONS,{examen:'<path d="M9 3h6l1 2h3v16H5V5h3z"/><path d="M9 11l2 2 4-4M9 17h6"/>',diagramas:'<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/><circle cx="17.5" cy="6" r="3"/><path d="M6.5 8v5.5h11V16M10 5.5h4.5"/>',sql:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',formulario:'<path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h7M9 16h7"/>'});
$$("nav button").forEach(b=>{ const k=b.dataset.v; if(["examen","diagramas","sql","formulario"].includes(k) && !b.querySelector("svg")) b.insertAdjacentHTML("afterbegin", ico(k)); });
MODES.splice(2,0,["examen","Examen completo","La jornada real: 143 reactivos disciplinares por subárea y lenguaje, en dos sesiones con su tiempo oficial."]);
MODES.splice(MODES.findIndex(m=>m[0]==="lectura"),0,["diagramas","Encuentra el error","Diagramas BPMN, DFD, casos de uso, clases, secuencia y estados con un error que debes señalar."],["sql","SQL con tablas","Tablas con datos y una consulta: predice el resultado. Joins, NULL, agregación y orden."]);
MODES.push(["formulario","Formulario","Fórmulas, distinciones clave por área y checklist de la noche anterior. Imprimible."]);

// Sin memorama
{ const k=VIEWS.indexOf("memorama"); if(k>=0) VIEWS.splice(k,1); const m=MODES.findIndex(x=>x[0]==="memorama"); if(m>=0) MODES.splice(m,1); }
