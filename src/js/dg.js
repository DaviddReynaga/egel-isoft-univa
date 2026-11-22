// ================= Mini motor de diagramas SVG =================
function _lines(t){ return String(t).split("\n"); }
function _txt(x,y,t,cls,anchor){ const L=_lines(t), lh=15, y0=y-(L.length-1)*lh/2; return `<text x="${x}" y="${y0}" class="${cls||""}" text-anchor="${anchor||"middle"}" dominant-baseline="middle">${L.map((l,i)=>`<tspan x="${x}" dy="${i?lh:0}">${esc(l)}</tspan>`).join("")}</text>`; }
function svg(w,h,inner,cap){ return `<figure class="fig"><svg class="dg" viewBox="0 0 ${w} ${h}" role="img"><defs>
<marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mk"/></marker>
<marker id="tri" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" orient="auto"><path d="M0 0L12 6L0 12z" class="mkh"/></marker>
<marker id="dE" viewBox="0 0 16 10" refX="1" refY="5" markerWidth="16" markerHeight="10" orient="auto"><path d="M1 5L8 1L15 5L8 9z" class="mkh"/></marker>
<marker id="dF" viewBox="0 0 16 10" refX="1" refY="5" markerWidth="16" markerHeight="10" orient="auto"><path d="M1 5L8 1L15 5L8 9z" class="mk"/></marker>
</defs>${inner}</svg>${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`; }
function B(x,y,w,h,t,c,rx){ return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx==null?8:rx}" class="b ${c||""}"/>${t!=null?_txt(x+w/2,y+h/2,t,"t "+(c||"")):""}`; }
function C(cx,cy,r,t,c){ return `<circle cx="${cx}" cy="${cy}" r="${r}" class="b ${c||""}"/>${t!=null?_txt(cx,cy,t,"t "+(c||"")):""}`; }
function Dm(cx,cy,s,t,c){ return `<path d="M${cx} ${cy-s}L${cx+s} ${cy}L${cx} ${cy+s}L${cx-s} ${cy}z" class="b ${c||""}"/>${t!=null?_txt(cx,cy,t,"t sm"):""}`; }
function A(x1,y1,x2,y2,c,lbl,m){ const mk = m==="none"?"":` marker-end="url(#${m||"ah"})"`; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln ${c||""}"${mk}/>${lbl?_txt((x1+x2)/2,(y1+y2)/2-10,lbl,"t lb"):""}`; }
function P(pts,c,lbl,lx,ly,m){ return `<polyline points="${pts}" class="ln ${c||""}" fill="none"${m==="none"?"":` marker-end="url(#${m||"ah"})"`}/>${lbl?_txt(lx,ly,lbl,"t lb"):""}`; }
function T(x,y,t,c,a){ return _txt(x,y,t,"t "+(c||""),a); }
function actor(x,y,lbl){ return `<g class="actor"><circle cx="${x}" cy="${y}" r="9"/><line x1="${x}" y1="${y+9}" x2="${x}" y2="${y+34}"/><line x1="${x-14}" y1="${y+18}" x2="${x+14}" y2="${y+18}"/><line x1="${x}" y1="${y+34}" x2="${x-12}" y2="${y+52}"/><line x1="${x}" y1="${y+34}" x2="${x+12}" y2="${y+52}"/></g>${_txt(x,y+66,lbl,"t sm")}`; }
function E(cx,cy,rx,ry,t,c){ return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="b ${c||""}"/>${_txt(cx,cy,t,"t "+(c||""))}`; }
function cls3(x,y,w,name,attrs,meths,c){ const ah=Math.max(1,attrs.length)*16+8, mh=Math.max(1,meths.length)*16+8; return `<rect x="${x}" y="${y}" width="${w}" height="${26+ah+mh}" class="b ${c||""}" rx="4"/>${_txt(x+w/2,y+13,name,"t bold")}<line x1="${x}" y1="${y+26}" x2="${x+w}" y2="${y+26}" class="sep"/>${attrs.map((a,i)=>_txt(x+8,y+38+i*16,a,"t sm","start")).join("")}<line x1="${x}" y1="${y+26+ah}" x2="${x+w}" y2="${y+26+ah}" class="sep"/>${meths.map((m,i)=>_txt(x+8,y+38+ah+i*16,m,"t sm","start")).join("")}`; }
function tbl(head, rows, cls){ return `<div class="dtable ${cls||""}"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`; }
function code(t){ return `<pre class="code">${esc(t)}</pre>`; }
function note(t,c){ return `<div class="note ${c||""}">${t}</div>`; }
