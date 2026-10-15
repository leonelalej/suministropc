/**
 * CartDrawer.tsx — mobile-first slide-up order sheet.
 * Zero background scroll while open, Escape/backdrop dismissal,
 * +/- quantity triggers, single-tap remove, live USD/Bs. totals and a
 * WhatsApp deep link carrying the fully formatted order inquiry.
 */
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  MessageCircle,
  Minus,
  PackageOpen,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  $cartCount,
  $cartItems,
  $cartOpen,
  $cartTotalUSD,
  clearCart,
  closeCart,
  decrementItem,
  incrementItem,
  removeItem,
} from '../stores/cart';
import { buildWhatsAppOrderUrl, fmtBs, fmtUSD } from '../lib/format';
import { STORE, USD_TO_VES } from '../data/products';

export default function CartDrawer() {
  const open = useStore($cartOpen);
  const items = useStore($cartItems);
  const total = useStore($cartTotalUSD);
  const count = useStore($cartCount);

  /* Lock background scroll only while the sheet is open. */
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Escape closes the sheet (desktop hygiene). */
  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const totalBs = total * USD_TO_VES;
  const whatsappUrl =
    items.length > 0
      ? buildWhatsAppOrderUrl({
          phone: STORE.whatsapp,
          storeName: STORE.name,
          items,
          totalUSD: total,
          bsReference: fmtBs(totalBs).replace('Bs. ', ''),
        })
      : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tu pedido"
      aria-hidden={!open}
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] w-full max-w-5xl flex-col rounded-t-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/80 transition-transform duration-300 ease-tactile ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-zinc-800" aria-hidden="true" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 px-4 pb-2 pt-1.5">
          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-zinc-50">Tu Pedido</h2>
            <p className="tnum font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              {count} {count === 1 ? 'ítem' : 'ítems'} • {STORE.location}
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="flex h-11 items-center rounded-lg px-2.5 font-mono text-[11px] text-zinc-500 transition-all duration-150 ease-tactile hover:text-zinc-200 active:scale-95"
              >
                vaciar
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              aria-label="Cerrar pedido"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 transition-all duration-150 ease-tactile hover:text-zinc-100 active:scale-90"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-14 text-center">
            <PackageOpen className="h-9 w-9 text-zinc-700" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-300">Tu carrito está vacío</p>
            <p className="font-mono text-[11px] text-zinc-500">
              {'// agrega productos desde el catálogo'}
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 h-11 rounded-lg border border-zinc-700 bg-zinc-900 px-5 text-[13px] font-medium text-zinc-200 transition-all duration-150 ease-tactile hover:border-zinc-500 active:scale-95"
            >
              Explorar catálogo
            </button>
          </div>
        ) : (
          <>
            {/* Itemized list */}
            <ul className="drawer-scroll flex-1 divide-y divide-zinc-800/60 overflow-y-auto px-4">
              {items.map((item) => {
                const lineTotal = item.qty * item.priceUSD;
                return (
                  <li key={item.id} className="py-3">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-zinc-100">
                          {item.name}
                        </p>
                        <p className="truncate font-mono text-[10px] text-zinc-500">{item.specs}</p>
                        <p className="tnum mt-0.5 font-mono text-[10.5px] text-zinc-400">
                          {fmtUSD(item.priceUSD)} c/u
                        </p>
                      </div>
                      <div className="shrink-0 text-right leading-tight">
                        <p className="tnum text-sm font-bold text-zinc-50">{fmtUSD(lineTotal)}</p>
                        <p className="tnum font-mono text-[10px] text-zinc-500">
                          {fmtBs(lineTotal * USD_TO_VES)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center justify-between pl-[60px]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.id)}
                          aria-label={`Quitar una unidad de ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-all duration-150 ease-tactile hover:border-zinc-600 active:scale-90"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="tnum w-8 text-center font-mono text-sm font-semibold text-zinc-100">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.id)}
                          aria-label={`Agregar una unidad de ${item.name}`}
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-all duration-150 ease-tactile hover:border-zinc-600 active:scale-90"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Eliminar ${item.name} del pedido`}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 transition-all duration-150 ease-tactile hover:text-zinc-200 active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Totals + WhatsApp checkout */}
            <div className="shrink-0 border-t border-zinc-800 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <div className="mb-1 flex items-end justify-between">
                <span className="text-[13px] text-zinc-400">Subtotal</span>
                <span className="tnum text-base font-bold text-zinc-50">{fmtUSD(total)}</span>
              </div>
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-[13px] text-zinc-400">Referencia Bs.</span>
                <span className="tnum font-mono text-[12px] text-zinc-400">{fmtBs(totalBs)}</span>
              </div>
              <p className="mb-3 font-mono text-[10px] leading-relaxed text-zinc-600">
                {'// envío y forma de pago se coordinan por WhatsApp'}
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-zinc-950 shadow-lg shadow-accent/20 transition-all duration-150 ease-tactile hover:bg-accent-soft active:scale-[0.98]"
              >
                <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
                Completar por WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
