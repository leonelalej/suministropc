/**
 * CartDock.tsx — ergonomic sticky bottom bar.
 * Floats above content when the order has items and hides while the
 * drawer is open. Runs the one-time cart persistence bootstrap.
 */
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { ClipboardList } from 'lucide-react';
import {
  $cartCount,
  $cartOpen,
  $cartTotalUSD,
  initCartPersistence,
  openCart,
} from '../stores/cart';
import { fmtBs, fmtUSD } from '../lib/format';
import { USD_TO_VES } from '../data/products';

export default function CartDock() {
  const count = useStore($cartCount);
  const total = useStore($cartTotalUSD);
  const drawerOpen = useStore($cartOpen);

  // Post-hydration localStorage bootstrap (SSR-safe).
  useEffect(() => {
    initCartPersistence();
  }, []);

  const visible = count > 0 && !drawerOpen;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-all duration-300 ease-tactile ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-2 pl-3 shadow-2xl shadow-black/60 backdrop-blur">
        {/* Count badge */}
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
          <ClipboardList className="h-5 w-5 text-zinc-300" aria-hidden="true" />
          <span className="tnum absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-zinc-950">
            {count}
          </span>
        </div>

        {/* Live subtotal */}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="tnum truncate text-sm font-bold text-zinc-50">{fmtUSD(total)}</p>
          <p className="tnum truncate font-mono text-[10.5px] text-zinc-500">
            ref {fmtBs(total * USD_TO_VES)}
          </p>
        </div>

        <button
          type="button"
          onClick={openCart}
          className="h-11 shrink-0 rounded-xl bg-accent px-4 text-[13px] font-bold text-zinc-950 shadow-lg shadow-accent/20 transition-all duration-150 ease-tactile hover:bg-accent-soft active:scale-95"
        >
          Revisar Pedido
        </button>
      </div>
    </div>
  );
}
