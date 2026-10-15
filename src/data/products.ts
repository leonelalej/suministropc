/**
 * src/data/products.ts
 * Structured catalog data for Mi PC Suministro.
 * Strongly typed so the grid, cart and WhatsApp builder can never drift.
 */
import { assetPath } from '../lib/assets';

/** Fixed category taxonomy — drives the quick-filter chips. */
export const CATEGORIES = [
  'Todos',
  'Procesadores',
  'Almacenamiento',
  'Memorias',
  'Gráficas',
  'Monitores',
  'Consumibles',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Core catalog entity. */
export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, 'Todos'>;
  brand: string;
  /** Short technical spec line, rendered as a monospaced badge. */
  specs: string;
  /** Reference price in US dollars. */
  priceUSD: number;
  /** Static asset path (local SVG line-art, zero network cost). */
  image: string;
  inStock: boolean;
}

/** Store identity + contact constants (edit here, applies everywhere). */
export const STORE = {
  name: 'Mi PC Suministro',
  tagline: 'Soluciones Informáticas',
  handle: '@mipcsuministro',
  location: 'Maracaibo',
  delivery: 'Envíos y Retiro',
  /** Replace with the store's real WhatsApp business line (country code + number, no "+"). */
  whatsapp: '584141234567',
} as const;

/** USD → Bs. reference rate. Update daily before opening orders. */
export const USD_TO_VES = 999.99;

/**
 * Catalog — 8 realistic hardware & supply items.
 * Prices are reference USD values commonly handled by the store.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'cpu-ryzen-5-5600',
    name: 'Procesador AMD Ryzen 5 5600',
    category: 'Procesadores',
    brand: 'AMD',
    specs: 'AM4 • 6C/12T • 4.4GHz',
    priceUSD: 118,
    image: assetPath('products/ryzen-5600.svg'),
    inStock: true,
  },
  {
    id: 'cpu-i5-12400f',
    name: 'Procesador Intel Core i5-12400F',
    category: 'Procesadores',
    brand: 'Intel',
    specs: 'LGA1700 • 6C/12T • 4.4GHz',
    priceUSD: 109,
    image: assetPath('products/i5-12400f.svg'),
    inStock: false,
  },
  {
    id: 'ssd-kingston-nv2-1tb',
    name: 'Solid State Kingston NV2 1TB',
    category: 'Almacenamiento',
    brand: 'Kingston',
    specs: 'M.2 NVMe 1TB • 3500MB/s',
    priceUSD: 58,
    image: assetPath('products/kingston-nv2-1tb.svg'),
    inStock: true,
  },
  {
    id: 'ram-corsair-16gb',
    name: 'RAM Corsair Vengeance LPX 16GB',
    category: 'Memorias',
    brand: 'Corsair',
    specs: 'DDR4 2x8GB • 3200MHz CL16',
    priceUSD: 39,
    image: assetPath('products/corsair-16gb.svg'),
    inStock: true,
  },
  {
    id: 'gpu-rtx-3060-12gb',
    name: 'Gráfica Gigabyte RTX 3060 OC',
    category: 'Gráficas',
    brand: 'Gigabyte',
    specs: '12GB GDDR6 • 2 Vent.',
    priceUSD: 289,
    image: assetPath('products/rtx-3060.svg'),
    inStock: true,
  },
  {
    id: 'mon-asus-tuf-24-165',
    name: 'Monitor ASUS TUF Gaming 24"',
    category: 'Monitores',
    brand: 'ASUS',
    specs: '24" IPS • 165Hz • 1ms',
    priceUSD: 139,
    image: assetPath('products/asus-24-165hz.svg'),
    inStock: true,
  },
  {
    id: 'ton-hp-85a',
    name: 'Tóner HP 85A Original',
    category: 'Consumibles',
    brand: 'HP',
    specs: 'CE285A • ~1600 págs',
    priceUSD: 72,
    image: assetPath('products/hp-85a.svg'),
    inStock: true,
  },
  {
    id: 'con-arctic-mx4',
    name: 'Pasta Térmica Arctic MX-4',
    category: 'Consumibles',
    brand: 'ARCTIC',
    specs: '4g • 8.5 W/mK',
    priceUSD: 9,
    image: assetPath('products/arctic-mx4.svg'),
    inStock: true,
  },
];
