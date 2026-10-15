/**
 * src/stores/catalog.ts
 * Browsing state: instant search + active category, shared across islands
 * (header search bar, category rail and product grid) via Nano Stores.
 */
import { atom, computed } from 'nanostores';
import { CATEGORIES, PRODUCTS, type Category, type Product } from '../data/products';

/** Free-text query typed in the header search bar. */
export const $search = atom<string>('');

/** Active quick-filter chip. */
export const $activeCategory = atom<Category>('Todos');

/** Normalized query (lowercased, trimmed) for matching. */
const $normalizedQuery = computed($search, (q) => q.trim().toLowerCase());

/**
 * Products matching the current category + query.
 * Matches against name, brand and the technical spec line.
 */
export const $filteredProducts = computed(
  [$normalizedQuery, $activeCategory],
  (query, category): Product[] =>
    PRODUCTS.filter((product) => {
      const inCategory = category === 'Todos' || product.category === category;
      if (!inCategory) return false;
      if (query === '') return true;
      const haystack = `${product.name} ${product.brand} ${product.specs} ${product.category}`;
      return haystack.toLowerCase().includes(query);
    }),
);

/** Type-safe category list for the chip rail. */
export const categoryList: readonly Category[] = CATEGORIES;
