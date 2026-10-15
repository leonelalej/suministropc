/**
 * ProductCard.tsx — clean technical card.
 * Square image with graceful fallback and hover glow, category + stock row,
 * monospaced spec badge, 2-line clamped title, USD price with Bs. reference
 * and a tactile quote action with brief "Agregado" feedback.
 */
import { useEffect, useRef, useState } from 'react';
import { Check, Cpu, Plus } from 'lucide-react';
import { addToCart } from '../stores/cart';
import { fmtBs, fmtUSD } from '../lib/format';
import { USD_TO_VES, type Product } from '../data/products';

const FLASH_MS = 900;

export default function ProductCard({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const flashTimer = useRef<number | undefined>(undefined);

  // Clear any pending timer if the island unmounts mid-flash.
  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const handleAdd = () => {
    if (!product.inStock || justAdded) return;
    addToCart(product);
    setJustAdded(true);
    flashTimer.current = window.setTimeout(() => setJustAdded(false), FLASH_MS);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-black/40">
      {/* Image block — square, blueprint-dark, brand chip top-right */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-zinc-800/60 bg-zinc-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(34,211,238,0.08),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
            <Cpu className="h-9 w-9 text-zinc-700" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className={`relative h-full w-full object-contain p-4 transition-transform duration-300 ease-out ${
              product.inStock ? 'group-hover:scale-[1.04]' : 'opacity-30 grayscale'
            }`}
          />
        )}

        <span className="absolute right-2 top-2 max-w-[52%] truncate rounded-md border border-zinc-800/80 bg-zinc-950/85 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-400 backdrop-blur-sm">
          {product.brand}
        </span>

        {!product.inStock && (
          <span className="absolute left-2 top-2 rounded-md border border-zinc-700/80 bg-zinc-950/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Agotado
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">
            {product.category}
          </p>
          <p
            className={`inline-flex shrink-0 items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
              product.inStock ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${product.inStock ? 'bg-accent' : 'bg-zinc-700'}`}
            />
            {product.inStock ? 'Disponible' : 'Agotado'}
          </p>
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.75em] text-[13.5px] font-semibold leading-snug tracking-tight text-zinc-100">
          {product.name}
        </h3>

        <span className="mt-1.5 w-fit max-w-full truncate rounded-md border border-zinc-800 bg-zinc-950/80 px-1.5 py-0.5 font-mono text-[9.5px] leading-relaxed text-zinc-400">
          {product.specs}
        </span>

        <div className="mt-auto pt-3">
          <div className="border-t border-zinc-800/60 pt-2.5">
            <p className="tnum text-base font-bold leading-tight tracking-tight text-zinc-50">
              {fmtUSD(product.priceUSD)}
            </p>
            <p className="tnum font-mono text-[10px] leading-relaxed text-zinc-500">
              ref. {fmtBs(product.priceUSD * USD_TO_VES)}
            </p>
          </div>

          {product.inStock ? (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Agregar ${product.name} al pedido`}
              className={`mt-2.5 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ease-tactile active:scale-[0.97] ${
                justAdded
                  ? 'bg-accent text-zinc-950 shadow-lg shadow-accent/20'
                  : 'bg-zinc-100 text-zinc-950 hover:bg-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Agregado
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Cotizar
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-2.5 flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-[12.5px] font-medium text-zinc-600"
            >
              Agotado
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
