/**
 * src/stores/cart.ts
 * Lightweight reactive cart built on Nano Stores — no external deps,
 * localStorage persistence, SSR-safe (Astro islands hydrate after HTML).
 *
 * Items are stored as *snapshots* (name/price/image copied in at add-time),
 * so the drawer and the WhatsApp builder never depend on live catalog props.
 */
import { atom, computed } from 'nanostores';
import type { Product } from '../data/products';

/** Line item snapshot persisted in the cart. */
export interface CartItem {
  id: string;
  name: string;
  brand: string;
  specs: string;
  priceUSD: number;
  image: string;
  qty: number;
}

const STORAGE_KEY = 'mipc-cart-v1';

/* ------------------------------------------------------------------ */
/* Atoms                                                               */
/* ------------------------------------------------------------------ */

/** Ordered list of line items. */
export const $cartItems = atom<CartItem[]>([]);

/** Drawer visibility (slide-up order sheet). */
export const $cartOpen = atom<boolean>(false);

/* ------------------------------------------------------------------ */
/* Derived values                                                      */
/* ------------------------------------------------------------------ */

/** Total unit count, e.g. 3 items across 2 lines. */
export const $cartCount = computed($cartItems, (items) =>
  items.reduce((acc, item) => acc + item.qty, 0),
);

/** Order subtotal in USD. */
export const $cartTotalUSD = computed($cartItems, (items) =>
  items.reduce((acc, item) => acc + item.qty * item.priceUSD, 0),
);

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

/** Adds a product (or bumps qty by `delta` when already present). */
export function addToCart(product: Product, qty = 1): void {
  const items = $cartItems.get();
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    $cartItems.set(
      items.map((item) =>
        item.id === product.id ? { ...item, qty: Math.min(item.qty + qty, 99) } : item,
      ),
    );
    return;
  }

  const line: CartItem = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    specs: product.specs,
    priceUSD: product.priceUSD,
    image: product.image,
    qty: Math.min(Math.max(qty, 1), 99),
  };
  $cartItems.set([...items, line]);
}

export function incrementItem(id: string): void {
  $cartItems.set(
    $cartItems
      .get()
      .map((item) =>
        item.id === id ? { ...item, qty: Math.min(item.qty + 1, 99) } : item,
      ),
  );
}

export function decrementItem(id: string): void {
  const items = $cartItems.get();
  const target = items.find((item) => item.id === id);
  if (!target) return;

  if (target.qty <= 1) {
    // Single-tap remove at the floor — no ghost lines.
    $cartItems.set(items.filter((item) => item.id !== id));
    return;
  }
  $cartItems.set(
    items.map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item)),
  );
}

/** Single-tap remove regardless of quantity. */
export function removeItem(id: string): void {
  $cartItems.set($cartItems.get().filter((item) => item.id !== id));
}

export function clearCart(): void {
  $cartItems.set([]);
}

export function openCart(): void {
  $cartOpen.set(true);
}

export function closeCart(): void {
  $cartOpen.set(false);
}

/* ------------------------------------------------------------------ */
/* Persistence (client-only, hydration-safe)                           */
/* ------------------------------------------------------------------ */

let persistenceReady = false;

/**
 * Loads the persisted cart and keeps it in sync afterwards.
 * Must run inside a `useEffect` (post-hydration) to avoid SSR mismatch.
 */
export function initCartPersistence(): void {
  if (persistenceReady || typeof window === 'undefined') return;
  persistenceReady = true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        $cartItems.set(
          parsed.filter(
            (item): item is CartItem =>
              typeof item === 'object' &&
              item !== null &&
              typeof (item as CartItem).id === 'string' &&
              typeof (item as CartItem).priceUSD === 'number' &&
              typeof (item as CartItem).qty === 'number',
          ),
        );
      }
    }
  } catch {
    // Corrupted storage — start with a clean slate.
    window.localStorage.removeItem(STORAGE_KEY);
  }

  $cartItems.subscribe((items) => {
    try {
      if (items.length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Private mode / quota errors are non-fatal for the UI.
    }
  });
}
