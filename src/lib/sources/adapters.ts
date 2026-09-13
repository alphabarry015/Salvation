import { getTexts } from "@/lib/texts";
import {
  fetchBibleFromProvider,
  fetchQuranFromProvider,
} from "@/services/api";
import type { BibleExcerpt, QuranExcerpt, TextEntry } from "@/types/scripture";

export interface ScriptureAdapter {
  loadTexts(): Promise<TextEntry[]>;
}

export const localAdapter: ScriptureAdapter = {
  async loadTexts() {
    return getTexts();
  },
};

export function getScriptureAdapter(): ScriptureAdapter {
  return localAdapter;
}

export const fetchBibleFromApi = fetchBibleFromProvider;
export const fetchQuranFromApi = (
  surah: number,
  ayah: number,
): Promise<QuranExcerpt> =>
  fetchQuranFromProvider({ surah, ayahStart: ayah, ayahEnd: ayah });

export type { BibleExcerpt, QuranExcerpt };
