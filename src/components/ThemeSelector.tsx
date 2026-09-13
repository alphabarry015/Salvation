import type { TextEntry } from "@/types/scripture";

function corpusLabel(reference: string): string {
  if (reference.startsWith("Sourate")) {
    const parts = reference.split(",").map((part) => part.trim());
    return parts[1] ?? parts[0];
  }

  return reference.split(/[\s,]/)[0] ?? reference;
}

interface ThemeSelectorProps {
  entries: TextEntry[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ThemeSelector({
  entries,
  selectedId,
  onSelect,
}: ThemeSelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Thèmes et récits croisés"
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {entries.map((entry) => {
        const selected = entry.id === selectedId;

        return (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(entry.id)}
            className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition-colors ${
              selected
                ? "border-accent bg-accent text-paper"
                : "border-line bg-paper text-ink hover:bg-accent-soft"
            }`}
          >
            <span className="block font-medium">{entry.theme}</span>
            <span
              className={`mt-1 block text-xs ${
                selected ? "text-paper/80" : "text-muted"
              }`}
            >
              {corpusLabel(entry.bible.reference)} ·{" "}
              {corpusLabel(entry.coran.reference)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
