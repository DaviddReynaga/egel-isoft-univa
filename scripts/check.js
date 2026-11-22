// Revisión rápida del banco: tamaños consistentes y cada reactivo ligado a una lección.
const fs = require("fs"), path = require("path"), vm = require("vm");
const js = f => fs.readFileSync(path.join(__dirname, "..", "src", "js", f), "utf8");
const ctx = { console };
vm.createContext(ctx);
const code = ["data.js", "lessons.js", "why.js", "hard1.js", "hard2.js", "hard4.js"].map(js).join("\n")
  + "\nconst esc=x=>x, shuffle=a=>a, S={};\n" + js("hard3.js")
  + `\nthis.r={Q:Q.length,W:W.length,mal:Q.filter((q,i)=>q.o.length!==3||!W[i]||W[i].length!==2).length,
  sinLeccion:Q.filter((q,i)=>!Q2L[i]).length};`;
vm.runInContext(code, ctx);
console.log(ctx.r);
if (ctx.r.Q !== ctx.r.W || ctx.r.mal || ctx.r.sinLeccion) { console.error("Hay reactivos incompletos"); process.exit(1); }
console.log("Banco correcto");
