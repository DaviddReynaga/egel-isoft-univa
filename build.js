// Construye dist/index.html uniendo la plantilla con los módulos de src/js.
// El orden importa: cada módulo usa lo que definen los anteriores.
const fs = require("fs");
const path = require("path");

const ORDEN = [
  ["DATA", "data.js"], ["DATA2", "data2.js"], ["LESSONS", "lessons.js"], ["WHY", "why.js"],
  ["HARD1", "hard1.js"], ["HARD2", "hard2.js"], ["HARD4", "hard4.js"], ["HARD3", "hard3.js"],
  ["APP", "app.js"], ["DG", "dg.js"], ["LB1", "lb1.js"], ["LB2", "lb2.js"],
  ["APP2", "app2.js"], ["APP3", "app3.js"], ["APP4", "app4.js"], ["APP5", "app5.js"], ["RAYO2", "rayo2.js"],
  ["APP6", "app6.js"], ["APP7", "app7.js"], ["APP8", "app8.js"], ["SQL2", "sql2.js"],
  ["APP9", "app9.js"], ["APP10", "app10.js"], ["BOOT", "boot.js"],
];

const raiz = __dirname;
let html = fs.readFileSync(path.join(raiz, "src", "index.template.html"), "utf8");
for (const [marca, archivo] of ORDEN) {
  const clave = `/*${marca}*/`;
  const veces = html.split(clave).length - 1;
  if (veces !== 1) throw new Error(`La marca ${clave} aparece ${veces} veces en la plantilla`);
  const codigo = fs.readFileSync(path.join(raiz, "src", "js", archivo), "utf8").replace(/<\/script/g, "<\\/script");
  html = html.split(clave).join(codigo);
}

const dist = path.join(raiz, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "index.html"), html);
for (const f of fs.readdirSync(path.join(raiz, "public"))) {
  fs.copyFileSync(path.join(raiz, "public", f), path.join(dist, f));
}
console.log(`dist/index.html listo (${(html.length / 1024).toFixed(0)} KB)`);
