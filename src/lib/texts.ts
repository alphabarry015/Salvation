import rawTexts from "@/data/texts.json";
import type {
  CategoryFilter,
  TextCategory,
  TextEntry,
} from "@/types/scripture";

export const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "Tous", label: "Tous" },
  { value: "Prophètes", label: "Prophètes" },
  { value: "Dogme", label: "Thèmes théologiques" },
  { value: "Morale", label: "Vie morale" },
];

export const CATEGORY_LABELS: Record<TextCategory, string> = {
  Prophètes: "Prophètes",
  Dogme: "Thèmes théologiques",
  Morale: "Vie morale",
};

export function getTexts(): TextEntry[] {
  return rawTexts as TextEntry[];
}

export function getTextById(id: string): TextEntry | undefined {
  return getTexts().find((entry) => entry.id === id);
}

export function getTorahBibleLink(entry: TextEntry): {
  kind: "same" | "echo" | null;
  note: string;
} {
  const torah = entry.torah.query;
  const bible = entry.bible.query;
  const same =
    Boolean(torah && bible) &&
    torah?.book === bible?.book &&
    torah?.chapter === bible?.chapter &&
    torah?.verseStart === bible?.verseStart &&
    torah?.verseEnd === bible?.verseEnd;

  if (same) {
    return {
      kind: "same",
      note:
        entry.kinship?.note ??
        "Même passage du Pentateuque, commun à la Torah et à la Bible.",
    };
  }

  if (entry.kinship?.torahBible === "echo") {
    return {
      kind: "echo",
      note:
        entry.kinship.note ??
        "La Bible accueille ici un passage de la Torah.",
    };
  }

  return { kind: null, note: "" };
}

export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filterTexts(
  entries: TextEntry[],
  query: string,
  category: CategoryFilter,
): TextEntry[] {
  const needle = normalizeSearch(query);

  return entries.filter((entry) => {
    if (category !== "Tous" && entry.category !== category) {
      return false;
    }

    if (!needle) {
      return true;
    }

    const haystack = [
      entry.theme,
      entry.category,
      CATEGORY_LABELS[entry.category],
      entry.torah.reference,
      entry.torah.text,
      entry.torah.version,
      entry.bible.reference,
      entry.bible.text,
      entry.bible.version,
      entry.coran.reference,
      entry.coran.text,
      entry.coran.translator,
      entry.kinship?.note ?? "",
    ]
      .map(normalizeSearch)
      .join(" ");

    return haystack.includes(needle);
  });
}
