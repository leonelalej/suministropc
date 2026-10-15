# Mi PC Suministro — Catálogo Técnico Mobile-First

Catálogo ultra-rápido para **@mipcsuministro** (Maracaibo • Envíos y Retiro).
Estética de *spec sheet* técnica: monocromo zinc + un solo acento cian (tomado del logo),
sin banners gigantes, sin carruseles, sin popups. Cotización instantánea por WhatsApp.

## Stack

| Capa          | Tecnología                                    |
| ------------- | --------------------------------------------- |
| Base          | Astro 7 (SSG puro, `output: 'static'`)        |
| Islas reactivas | React 19 (`@astrojs/react`, 6 islas pequeñas) |
| Estilos       | Tailwind CSS 4 (`@tailwindcss/vite`)          |
| Estado        | Nano Stores (`nanostores` + `@nanostores/react`) |
| Iconos        | lucide-react                                  |
| Package manager | pnpm                                        |

## Comandos paso a paso (pnpm)

```bash
# 1. Instalar pnpm (si no lo tienes)
corepack enable pnpm          # o:  npm install -g pnpm

# 2. Instalar dependencias del proyecto
pnpm install

# 3. Desarrollo — http://localhost:3000/suministropc/  (usa el `base` de GitHub Pages)
pnpm dev

# 4. Build de producción (dist/ estático, listo para Netlify/Vercel/Cloudflare)
pnpm build

# 5. Previsualizar el build de producción en local
pnpm preview
```

## Deploy

Público en GitHub Pages: **https://leonelalej.github.io/suministropc/**

Cada push a `main` dispara `.github/workflows/deploy.yml` (build + publish).
Al mover a un dominio propio: ajustar `site` y `base: '/'` en `astro.config.mjs`.

## Estructura

```
src/
├── data/products.ts        # Interfaz Product + 8 ítems + STORE + tasa USD→Bs
├── stores/
│   ├── cart.ts             # Carrito Nano Stores (persistencia localStorage, SSR-safe)
│   └── catalog.ts          # $search + $activeCategory + $filteredProducts
├── lib/format.ts           # fmtUSD / fmtBs / buildWhatsAppOrderUrl (sin Intl → sin mismatch)
├── layouts/Layout.astro    # 100dvh, theme-color, meta, fuentes de sistema
├── components/
│   ├── SearchBar.tsx       # Búsqueda instantánea + botón limpiar (isla)
│   ├── CategoryBar.tsx     # Chips con icono por categoría, snap-x, auto-centrado (isla)
│   ├── ProductGrid.tsx     # Grilla 2/3/4 cols + estado vacío (isla)
│   ├── ProductCard.tsx     # Imagen square + fallback, badge spec mono, + Cotizar
│   ├── CartDock.tsx        # Barra inferior flotante: badge + subtotal (isla)
│   └── CartDrawer.tsx      # Sheet slide-up: +/- , eliminar, total, WhatsApp (isla)
├── pages/index.astro       # Header sticky + hero de marca + servicios + catálogo + footer
└── styles/global.css       # Tailwind v4 + utilidades (no-scrollbar, blueprint-bg, hero-grid…)
public/products/*.svg       # Line-art técnico generado (scripts/gen_product_art.py)
```

## Puntos de edición rápida

| Qué                          | Dónde                                    |
| ---------------------------- | ---------------------------------------- |
| Número de WhatsApp           | `STORE.whatsapp` en `src/data/products.ts` (formato `584141234567`) |
| Nombre / tagline de la tienda | `STORE.name` / `STORE.tagline` en `src/data/products.ts` (hero, header y footer) |
| Tasa USD → Bs. del día       | `USD_TO_VES` en `src/data/products.ts`   |
| Productos / precios / stock  | arreglo `PRODUCTS` en `src/data/products.ts` |
| Categorías                   | constante `CATEGORIES` (los chips se generan solos) |
| Color de acento              | `tailwind.config.mjs` → `colors.accent`  |

## Decisiones de arquitectura

- **Islas, no SPA**: el header es HTML estático; solo hidratan búsqueda, chips,
  grilla, dock y drawer → JS mínimo, TTI inmediato.
- **Carrito por snapshots**: el drawer y el mensaje de WhatsApp leen nombre/precio
  guardados al momento de agregar (a prueba de cambios de catálogo).
- **Formato determinista**: `fmtUSD`/`fmtBs` evitan `Intl` para que el HTML del
  servidor y la hidratación sean idénticos byte a byte.
- **Táctil real**: todos los controles ≥ 44px, `active:scale-95`, snap horizontal,
  `100dvh`, scroll de fondo bloqueado con el drawer abierto, safe-areas respetadas.
