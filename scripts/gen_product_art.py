#!/usr/bin/env python3
"""Generate the 8 technical line-art product SVGs for Mi PC Suministro.
Shared blueprint template: zinc-950 bg, corner registration marks, zinc
strokes, ONE cyan accent detail, monospaced spec label. Edit & re-run:
python /home/z/my-project/scripts/gen_product_art.py
"""
import pathlib

OUT = pathlib.Path("/home/z/my-project/public/products")
OUT.mkdir(parents=True, exist_ok=True)

BG = "#09090b"        # zinc-950
STROKE = "#71717a"    # zinc-500
FILL = "#18181b"      # zinc-900
FAINT = "#3f3f46"     # zinc-700
DIM = "#52525b"       # zinc-600
ACCENT = "#22d3ee"    # brand cyan
MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"


def template(body: str, label: str, accent_text: str = "") -> str:
    ticks = "".join(
        f'<path d="{d}" stroke="{FAINT}" stroke-width="1.5" fill="none"/>' for d in (
            "M10 26 V10 H26", "M174 10 H190 V26",
            "M10 174 V190 H26", "M174 190 H190 V174",
        )
    )
    at = (
        f'<text x="188" y="26" text-anchor="end" font-family="{MONO}" font-size="8" '
        f'letter-spacing="1.5" fill="{ACCENT}">{accent_text}</text>' if accent_text else ""
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img">
  <rect width="200" height="200" fill="{BG}"/>
  {ticks}
  {at}
  {body}
  <text x="100" y="182" text-anchor="middle" font-family="{MONO}" font-size="9" letter-spacing="2" fill="{DIM}">{label}</text>
</svg>
'''


FILES = {}

# 1 — Ryzen 5 5600 (PGA CPU: pins on edges, accent die)
pins = ""
for i in range(6):
    x = 68 + i * 13
    pins += f'<line x1="{x}" y1="44" x2="{x}" y2="52" stroke="{STROKE}" stroke-width="2"/>'
    pins += f'<line x1="{x}" y1="148" x2="{x}" y2="156" stroke="{STROKE}" stroke-width="2"/>'
    y = 66 + i * 13
    pins += f'<line x1="44" y1="{y}" x2="52" y2="{y}" stroke="{STROKE}" stroke-width="2"/>'
    pins += f'<line x1="148" y1="{y}" x2="156" y2="{y}" stroke="{STROKE}" stroke-width="2"/>'
FILES["ryzen-5600"] = template(
    f'''<rect x="52" y="52" width="96" height="96" rx="7" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  {pins}
  <rect x="79" y="79" width="42" height="42" rx="3" fill="{ACCENT}" fill-opacity="0.12" stroke="{ACCENT}" stroke-width="2"/>
  <path d="M86 100 L100 86 L114 100 L100 114 Z" fill="none" stroke="{STROKE}" stroke-width="1.5"/>''',
    "R5 5600 · AM4", "6C/12T",
)

# 2 — i5-12400F (LGA CPU: pad grid inside, no pins)
pads = ""
for r in range(5):
    for c in range(5):
        pads += f'<circle cx="{74 + c * 13}" cy="{74 + r * 13}" r="2.2" fill="{STROKE}"/>'
FILES["i5-12400f"] = template(
    f'''<rect x="52" y="52" width="96" height="96" rx="7" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <rect x="60" y="60" width="80" height="80" rx="4" fill="none" stroke="{FAINT}" stroke-width="1.5"/>
  {pads}
  <rect x="90" y="90" width="20" height="20" rx="2" fill="none" stroke="{ACCENT}" stroke-width="2"/>''',
    "I5-12400F · LGA1700", "6C/12T",
)

# 3 — Kingston NV2 1TB (M.2 2280 stick)
FILES["kingston-nv2-1tb"] = template(
    f'''<rect x="26" y="86" width="148" height="28" rx="3" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <circle cx="31" cy="100" r="3.5" fill="{BG}" stroke="{STROKE}" stroke-width="1.5"/>
  <rect x="58" y="92" width="20" height="16" rx="1.5" fill="none" stroke="{STROKE}" stroke-width="1.8"/>
  <rect x="86" y="92" width="32" height="16" rx="1.5" fill="none" stroke="{STROKE}" stroke-width="1.8"/>
  <rect x="126" y="92" width="32" height="16" rx="1.5" fill="{ACCENT}" fill-opacity="0.12" stroke="{ACCENT}" stroke-width="1.8"/>
  <g stroke="{STROKE}" stroke-width="1.4">
    <line x1="176" y1="90" x2="176" y2="110"/><line x1="170" y1="90" x2="170" y2="110"/>
    <line x1="164" y1="90" x2="164" y2="110"/>
  </g>''',
    "M.2 2280 · NVME", "3500MB/S",
)

# 4 — Corsair Vengeance LPX 16GB (DIMM with heat spreader ridges)
ridges = "".join(
    f'<line x1="{44 + i * 14}" y1="88" x2="{44 + i * 14}" y2="112" stroke="{FAINT}" stroke-width="1.5"/>'
    for i in range(9)
)
FILES["corsair-16gb"] = template(
    f'''<rect x="30" y="84" width="140" height="32" rx="3" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  {ridges}
  <g stroke="{STROKE}" stroke-width="1.4">
    <line x1="34" y1="120" x2="86" y2="120"/><line x1="94" y1="120" x2="166" y2="120"/>
  </g>
  <line x1="88" y1="116" x2="88" y2="124" stroke="{ACCENT}" stroke-width="2"/>
  <line x1="34" y1="126" x2="166" y2="126" stroke="{ACCENT}" stroke-width="1.5" stroke-dasharray="3 3" stroke-opacity="0.55"/>''',
    "DDR4 · 2X8GB", "3200MHZ",
)

# 5 — Gigabyte RTX 3060 (GPU shroud, dual fan)
def fan(cx: int) -> str:
    return f'''<g stroke="{STROKE}" stroke-width="2" fill="none">
      <circle cx="{cx}" cy="104" r="21"/>
      <circle cx="{cx}" cy="104" r="7"/>
      <path d="M{cx} 83 A21 21 0 0 1 {cx + 18} 93"/>
      <path d="M{cx - 18} 115 A21 21 0 0 1 {cx} 125"/>
      <path d="M{cx + 18} 115 L{cx + 7} 109"/>
      <path d="M{cx - 18} 93 L{cx - 7} 99"/>
    </g>'''
FILES["rtx-3060"] = template(
    f'''<rect x="24" y="72" width="134" height="64" rx="8" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <rect x="16" y="78" width="8" height="52" rx="2" fill="none" stroke="{STROKE}" stroke-width="2"/>
  <line x1="16" y1="92" x2="24" y2="92" stroke="{STROKE}" stroke-width="1.5"/>
  <line x1="16" y1="116" x2="24" y2="116" stroke="{STROKE}" stroke-width="1.5"/>
  {fan(60)}
  {fan(116)}
  <rect x="70" y="62" width="34" height="10" rx="2" fill="none" stroke="{ACCENT}" stroke-width="1.8"/>
  <rect x="58" y="136" width="66" height="9" rx="1.5" fill="none" stroke="{STROKE}" stroke-width="1.8"/>''',
    "RTX 3060 · GDDR6", "12GB",
)

# 6 — ASUS TUF 24" 165Hz (monitor)
FILES["asus-24-165hz"] = template(
    f'''<rect x="34" y="50" width="132" height="80" rx="5" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <rect x="41" y="57" width="118" height="60" rx="2" fill="{BG}" stroke="{FAINT}" stroke-width="1.5"/>
  <line x1="41" y1="87" x2="159" y2="87" stroke="{ACCENT}" stroke-width="1.2" stroke-opacity="0.5"/>
  <line x1="41" y1="102" x2="130" y2="102" stroke="{FAINT}" stroke-width="1.2"/>
  <line x1="41" y1="110" x2="112" y2="110" stroke="{FAINT}" stroke-width="1.2"/>
  <rect x="93" y="130" width="14" height="15" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <rect x="70" y="145" width="60" height="8" rx="4" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>''',
    '24" · IPS · 1MS', "165HZ",
)

# 7 — HP 85A toner cartridge
FILES["hp-85a"] = template(
    f'''<rect x="60" y="72" width="44" height="16" rx="5" fill="none" stroke="{STROKE}" stroke-width="2.5"/>
  <rect x="42" y="88" width="92" height="42" rx="5" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <line x1="42" y1="100" x2="134" y2="100" stroke="{FAINT}" stroke-width="1.5"/>
  <circle cx="146" cy="110" r="18" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <circle cx="146" cy="110" r="9" fill="none" stroke="{ACCENT}" stroke-width="1.8" stroke-dasharray="4 3"/>
  <rect x="52" y="108" width="24" height="14" rx="2" fill="none" stroke="{FAINT}" stroke-width="1.5"/>''',
    "HP 85A · CE285A", "1600P",
)

# 8 — Arctic MX-4 thermal paste syringe
FILES["arctic-mx4"] = template(
    f'''<rect x="86" y="38" width="28" height="7" rx="2" fill="none" stroke="{STROKE}" stroke-width="2.2"/>
  <rect x="95" y="45" width="10" height="24" fill="none" stroke="{STROKE}" stroke-width="2.2"/>
  <rect x="82" y="69" width="36" height="66" rx="4" fill="{FILL}" stroke="{STROKE}" stroke-width="2.5"/>
  <rect x="86" y="90" width="28" height="41" rx="2" fill="{ACCENT}" fill-opacity="0.16"/>
  <line x1="86" y1="90" x2="114" y2="90" stroke="{ACCENT}" stroke-width="2"/>
  <g stroke="{FAINT}" stroke-width="1.3">
    <line x1="78" y1="80" x2="84" y2="80"/><line x1="78" y1="95" x2="84" y2="95"/><line x1="78" y1="110" x2="84" y2="110"/>
  </g>
  <path d="M90 135 L110 135 L100 151 Z" fill="{FILL}" stroke="{STROKE}" stroke-width="2.2"/>
  <rect x="96" y="151" width="8" height="9" rx="1.5" fill="none" stroke="{STROKE}" stroke-width="2"/>''',
    "ARCTIC MX-4", "4G",
)

for name, svg in FILES.items():
    (OUT / f"{name}.svg").write_text(svg, encoding="utf-8")

print(f"wrote {len(FILES)} SVGs to {OUT}")
