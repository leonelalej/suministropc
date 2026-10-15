/**
 * CategoryBar.tsx — horizontal quick-filter rail.
 * Touch-first: snap alignment, 44px targets, centering auto-scroll on tap.
 * Each chip carries its category icon; the active chip uses the brand accent.
 */
import { useStore } from '@nanostores/react';
import {
  Cpu,
  Gpu,
  HardDrive,
  LayoutGrid,
  MemoryStick,
  Monitor,
  Printer,
  type LucideIcon,
} from 'lucide-react';
import { $activeCategory, categoryList } from '../stores/catalog';
import type { Category } from '../data/products';

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  Todos: LayoutGrid,
  Procesadores: Cpu,
  Almacenamiento: HardDrive,
  Memorias: MemoryStick,
  Gráficas: Gpu,
  Monitores: Monitor,
  Consumibles: Printer,
};

export default function CategoryBar() {
  const active = useStore($activeCategory);

  const select = (category: Category, el: HTMLButtonElement) => {
    $activeCategory.set(category);
    // Keep the tapped chip centered in the rail without jumping the page.
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <nav aria-label="Filtrar por categoría">
      <div className="no-scrollbar -mx-3 overflow-x-auto px-3">
        <div className="flex snap-x snap-mandatory gap-2 pb-2.5 pt-0.5">
          {categoryList.map((category) => {
            const isActive = category === active;
            const Icon = CATEGORY_ICONS[category];
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={(event) => select(category, event.currentTarget)}
                className={`flex h-11 shrink-0 snap-start items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium tracking-tight transition-all duration-150 ease-tactile active:scale-95 ${
                  isActive
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
