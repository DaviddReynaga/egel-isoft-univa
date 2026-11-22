// ===== Anexar banco avanzado y utilidades =====
QH.forEach(x=>{ const i=Q.length; Q.push({a:x.a,q:x.q,o:x.o,c:0,e:x.e,ctx:x.ctx,d:3}); W.push(x.w); const L=LESSONS.find(l=>l.id===x.l); L.q.push(i); Q2L[i]=x.l; });
function ctxHTML(q, fold){ if(!q.ctx) return ""; const t=esc(q.ctx).replace(/^(Caso [^.]*\.|Texto\.)\s*/,""); const h=(q.ctx.match(/^(Caso [^.]*|Texto)\./)||[,"Caso"])[1]; return fold? `<details class="ctx"><summary>${esc(h)} (ver texto)</summary><p>${t}</p></details>` : `<div class="ctx"><b>${esc(h)}</b><p>${t}</p></div>`; }
function advTag(q){ return q.d===3? `<span class="adv">Avanzado</span> ` : ""; }
function seenN(i){ return (S.qs && S.qs[i] && S.qs[i].tot) || 0; }
function pickFresh(arr){ return shuffle(arr).sort((x,y)=>seenN(x)-seenN(y)); }
