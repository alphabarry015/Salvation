import { CATEGORY_FILTERS } from "@/lib/texts";
import type { CategoryFilter as CategoryFilterValue } from "@/types/scripture";

interface CategoryFilterProps {
  value: CategoryFilterValue;
  onChange: (value: CategoryFilterValue) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filtrer par catégorie"
      className="flex flex-wrap gap-2"
    >
      {CATEGORY_FILTERS.map((filter) => {
        const selected = filter.value === value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(filter.value)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              selected
                ? "border-accent bg-accent text-paper"
                : "border-line bg-paper text-ink hover:bg-accent-soft"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
