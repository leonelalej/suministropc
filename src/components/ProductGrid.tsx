/**
 * ProductGrid.tsx — reactive catalog island.
 * Subscribes to $filteredProducts (search + category) and renders the
 * responsive grid: 2 columns mobile → 3 md → 4 lg. Includes the
 * technical empty state when no product matches.
 */
import { useStore } from '@nanostores/react';
import { PackageSearch, RotateCcw } from 'lucide-react';
import { $activeCategory, $filteredProducts, $search } from '../stores/catalog';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const products = useStore($filteredProducts);
  const query = useStore($search);
  const category = useStore($activeCategory);

  const hasFilters = query.trim() !== '' || category !== 'Todos';
  const reset = () => {
    $search.set('');
    $activeCategory.set('Todos');
  };

  return (
    <section aria-label="Catálogo de productos" className="mt-3">
      {/* Technical result counter */}
      <div className="mb-3 flex items-center justify-between">
        <p className="tnum font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          {products.length} {products.length === 1 ? 'resultado' : 'resultados'}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="flex h-8 items-center gap-1.5 rounded-md px-2 font-mono text-[11px] text-zinc-400 transition-all duration-150 ease-tactile hover:text-zinc-100 active:scale-95"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            reset
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="blueprint-bg flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-800 px-6 py-14 text-center">
          <PackageSearch className="h-8 w-8 text-zinc-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-zinc-300">
              Sin resultados{query.trim() !== '' ? ` para "${query.trim()}"` : ''}
            </p>
            <p className="mt-1 font-mono text-[11px] text-zinc-500">
              {'// ajusta la búsqueda o la categoría'}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-1 h-11 rounded-lg border border-zinc-700 bg-zinc-900 px-5 text-[13px] font-medium text-zinc-200 transition-all duration-150 ease-tactile hover:border-zinc-500 active:scale-95"
          >
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
