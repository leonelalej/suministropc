/**
 * SearchBar.tsx — instant catalog search island.
 * Binds to the shared $search store; the grid reacts with zero prop-drilling.
 */
import { useStore } from '@nanostores/react';
import { Search, X } from 'lucide-react';
import { $search } from '../stores/catalog';

export default function SearchBar() {
  const query = useStore($search);

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        aria-hidden="true"
      />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={query}
        onChange={(event) => $search.set(event.target.value)}
        placeholder="Buscar componente, marca o spec…"
        aria-label="Buscar en el catálogo"
        className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-9 pr-10 text-sm text-zinc-100 outline-none transition-all duration-150 placeholder:text-zinc-500 focus:border-accent/50 focus:bg-zinc-900 focus:ring-2 focus:ring-accent/15"
      />
      {query.length > 0 && (
        <button
          type="button"
          onClick={() => $search.set('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 transition-all duration-150 ease-tactile hover:text-zinc-100 active:scale-90"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
