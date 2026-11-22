// ================= Arranque =================
setInterval(renderTop, 30000);
renderTop();
$("#bankN").textContent = Q.length; $("#cardN").textContent = CARDS.length; $("#rayoN").textContent = Object.values(RAYO).reduce((a,b)=>a+b.length,0);
go(location.hash.slice(1) || "inicio");
