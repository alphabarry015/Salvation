import type { BibleBook } from "@/data/bible-books";

export interface TorahBook extends BibleBook {
  hebrew: string;
  latin: string;
}

export const TORAH_BOOKS: TorahBook[] = [
  { id: "GEN", name: "Bereshit", hebrew: "Bereshit", latin: "Genèse", chapters: 50 },
  { id: "EXO", name: "Shemot", hebrew: "Shemot", latin: "Exode", chapters: 40 },
  { id: "LEV", name: "Vayikra", hebrew: "Vayikra", latin: "Lévitique", chapters: 27 },
  { id: "NUM", name: "Bamidbar", hebrew: "Bamidbar", latin: "Nombres", chapters: 36 },
  { id: "DEU", name: "Devarim", hebrew: "Devarim", latin: "Deutéronome", chapters: 34 },
];

export function getTorahBook(id: string): TorahBook | undefined {
  return TORAH_BOOKS.find((book) => book.id === id);
}

export function isTorahBook(id: string): boolean {
  return TORAH_BOOKS.some((book) => book.id === id);
}
