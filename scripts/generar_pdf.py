# Regenera public/formulario-egel-isoft.pdf a partir del formulario de src/js/app9.js.
# Requiere: pip install playwright && playwright install chromium
# Fuentes recomendadas instaladas en el sistema: Source Serif 4, IBM Plex Sans, IBM Plex Mono.
import re, pathlib
raiz=pathlib.Path(__file__).resolve().parent.parent
body=re.search(r"const FORM_HTML=`([\s\S]*?)`;", (raiz/"src/js/app9.js").read_text()).group(1)
html='''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><style>
@page{size:Letter;margin:14mm 13mm 14mm 13mm}
*{box-sizing:border-box}
body{font:9.6pt/1.45 "IBM Plex Sans",sans-serif;color:#1c1f27;margin:0}
.mast{display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2.2pt solid #1f3a5f;padding-bottom:6pt;margin-bottom:4pt}
.mast h1{font:600 21pt "Source Serif 4",serif;margin:0;color:#1f3a5f}.mast h1 i{color:#7b1e2b}
.mast .sub{font:500 7.5pt "IBM Plex Sans";letter-spacing:.14em;text-transform:uppercase;color:#6d6555}
.mast .r{text-align:right;font-size:8pt;color:#6d6555}
.rule2{border-top:.6pt solid #1f3a5f;margin:2pt 0 10pt}
.fsec{margin:0 0 10pt}
.fsec h2{font:600 13.5pt "Source Serif 4",serif;color:#7b1e2b;margin:0 0 6pt;padding-bottom:3pt;border-bottom:.6pt solid #c9bfa9;break-after:avoid}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:7pt}
.fbox{border:.6pt solid #c9bfa9;border-radius:3pt;padding:7pt 9pt;break-inside:avoid;background:#fff}
.fbox h3{font:600 10.5pt "Source Serif 4",serif;color:#1f3a5f;margin:0 0 4pt}
.fbox p{margin:3pt 0}
.fx{font:italic 10pt "Source Serif 4",serif;background:#f4efe4;border-radius:2pt;padding:3pt 6pt}
.ft{border-collapse:collapse;width:100%;font-size:8.6pt;margin-top:3pt}.ft th,.ft td{border-bottom:.5pt solid #d8cfbd;padding:2pt 4pt;text-align:left}.ft th{color:#6d6555;font-weight:500}
b{font-weight:600}
.fcheck{margin:0;padding-left:14pt;line-height:1.6}
.foot{margin-top:8pt;font:italic 7.5pt "Source Serif 4";color:#6d6555;text-align:center}
</style></head><body>
<div class="mast"><div><div class="sub">Arena EGEL ISOFT · Cuaderno de estudio</div><h1>Formulario y resumen <i>de la última noche</i></h1></div><div class="r">EGEL Plus ISOFT<br>4 de diciembre de 2026</div></div><div class="rule2"></div>
'''+body+'''<p class="foot">Material de estudio no oficial, basado en la Guía para el sustentante EGEL Plus ISOFT. Verifica fechas y requisitos en tu pase de ingreso.</p></body></html>'''
tmp=raiz/'dist'/'_formulario.html'; tmp.parent.mkdir(exist_ok=True); tmp.write_text(html)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(); pg.goto(tmp.as_uri()); pg.wait_for_timeout(500)
    pg.pdf(path=str(raiz/"public"/"formulario-egel-isoft.pdf"), format="Letter", print_background=True, prefer_css_page_size=True)
    b.close()
