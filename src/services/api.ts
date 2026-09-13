import { BIBLE_BOOKS, getBibleBook } from "@/data/bible-books";
import { isTorahBook, TORAH_BOOKS } from "@/data/torah-books";
import { QURAN_SURAHS } from "@/data/quran-surahs";
import type {
  BibleExcerpt,
  BibleQuery,
  QuranExcerpt,
  QuranQuery,
  ScriptureVerse,
} from "@/types/scripture";

export const BIBLE_API_BASE =
  process.env.BIBLE_API_BASE ?? "https://bible.helloao.org";
export const QURAN_API_BASE =
  process.env.QURAN_API_BASE ?? "https://api.alquran.cloud";

const REQUEST_TIMEOUT_MS = 12_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return "Une erreur inattendue est survenue. Réessayez dans un instant.";
}

async function requestJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new ApiError(
        `Le service distant a répondu ${response.status}.`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Le délai d'attente de l'API a été dépassé.");
    }

    throw new ApiError(
      "L'API est injoignable pour le moment. Vérifiez votre connexion.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

interface HelloaoVerse {
  type: string;
  number?: number;
  text?: string;
}

interface HelloaoChapterResponse {
  translation?: { name?: string };
  book?: { name?: string };
  chapter: {
    number: number;
    content: HelloaoVerse[];
  };
}

export function normalizeBibleQuery(query: BibleQuery): BibleQuery {
  const book = getBibleBook(query.book);
  const chapter = Math.max(1, Math.floor(query.chapter));
  const verseStart = Math.max(1, Math.floor(query.verseStart));
  const verseEnd = Math.max(verseStart, Math.floor(query.verseEnd));

  if (!book) {
    throw new ApiError("Ce livre biblique n'est pas reconnu.", 400);
  }

  if (chapter > book.chapters) {
    throw new ApiError(
      `${book.name} compte ${book.chapters} chapitre${book.chapters > 1 ? "s" : ""}.`,
      400,
    );
  }

  return { book: book.id, chapter, verseStart, verseEnd };
}

export async function fetchBibleFromProvider(
  query: BibleQuery,
): Promise<BibleExcerpt> {
  const normalized = normalizeBibleQuery(query);
  const url = `${BIBLE_API_BASE}/api/fra_lsg/${normalized.book}/${normalized.chapter}.simple.json`;
  const data = await requestJson<HelloaoChapterResponse>(url);

  const verses = data.chapter.content.filter(
    (item): item is HelloaoVerse & { type: "verse"; number: number; text: string } =>
      item.type === "verse" &&
      typeof item.number === "number" &&
      typeof item.text === "string",
  );

  const selected = verses.filter(
    (verse) =>
      verse.number >= normalized.verseStart &&
      verse.number <= normalized.verseEnd,
  );

  if (selected.length === 0) {
    throw new ApiError(
      `Aucun verset ${normalized.verseStart}–${normalized.verseEnd} dans ce chapitre (${verses.length} versets).`,
      404,
    );
  }

  const bookName = getBibleBook(normalized.book)?.name ?? normalized.book;
  const first = selected[0].number;
  const last = selected[selected.length - 1].number;
  const wholeChapter = first === 1 && last === verses.length;
  const reference = wholeChapter
    ? `${bookName} ${normalized.chapter}`
    : first === last
      ? `${bookName} ${normalized.chapter}, ${first}`
      : `${bookName} ${normalized.chapter}, ${first}-${last}`;

  const verseLines: ScriptureVerse[] = selected.map((verse) => ({
    number: verse.number,
    text: verse.text.trim(),
  }));

  return {
    reference,
    version: data.translation?.name ?? "Louis Segond, 1910",
    text: verseLines.map((verse) => verse.text).join(" "),
    verses: verseLines,
    query: normalized,
  };
}

interface QuranAyah {
  numberInSurah: number;
  text: string;
}

interface QuranEditionPayload {
  englishName: string;
  number: number;
  ayahs: QuranAyah[];
  edition?: { identifier: string };
}

interface QuranEditionsResponse {
  code: number;
  data: QuranEditionPayload[];
}

export function normalizeQuranQuery(query: QuranQuery): QuranQuery {
  const surah = QURAN_SURAHS.find((item) => item.number === query.surah);

  if (!surah) {
    throw new ApiError("Cette sourate n'existe pas (1 à 114).", 400);
  }

  const ayahStart = Math.min(
    surah.ayahs,
    Math.max(1, Math.floor(query.ayahStart || 1)),
  );
  const ayahEnd = Math.min(
    surah.ayahs,
    Math.max(ayahStart, Math.floor(query.ayahEnd || surah.ayahs)),
  );

  return { surah: surah.number, ayahStart, ayahEnd };
}

export async function fetchQuranFromProvider(
  query: QuranQuery,
): Promise<QuranExcerpt> {
  const normalized = normalizeQuranQuery(query);
  const url = `${QURAN_API_BASE}/v1/surah/${normalized.surah}/editions/quran-uthmani,fr.hamidullah`;
  const payload = await requestJson<QuranEditionsResponse>(url);

  if (!payload.data?.[0] || !payload.data[1]) {
    throw new ApiError("Réponse inattendue d'Al Quran Cloud.");
  }

  const [arabicEdition, frenchEdition] = payload.data;
  const inRange = (ayah: QuranAyah) =>
    ayah.numberInSurah >= normalized.ayahStart &&
    ayah.numberInSurah <= normalized.ayahEnd;

  const arabicAyahs = arabicEdition.ayahs.filter(inRange);
  const frenchAyahs = frenchEdition.ayahs.filter(inRange);

  if (frenchAyahs.length === 0) {
    throw new ApiError("Aucun verset coranique ne correspond à cette plage.", 404);
  }

  const surah = QURAN_SURAHS.find((item) => item.number === normalized.surah);
  const first = frenchAyahs[0].numberInSurah;
  const last = frenchAyahs[frenchAyahs.length - 1].numberInSurah;
  const wholeSurah = first === 1 && last === (surah?.ayahs ?? last);
  const range = first === last ? `${first}` : `${first}-${last}`;

  const verseLines: ScriptureVerse[] = frenchAyahs.map((ayah) => {
    const arabic = arabicAyahs.find(
      (item) => item.numberInSurah === ayah.numberInSurah,
    )?.text;

    return {
      number: ayah.numberInSurah,
      text: ayah.text.trim(),
      arabic: arabic?.trim(),
    };
  });

  return {
    reference: wholeSurah
      ? `Sourate ${normalized.surah}, ${surah?.name ?? frenchEdition.englishName}`
      : `Sourate ${normalized.surah}, ${surah?.name ?? frenchEdition.englishName}, ${range}`,
    translator: "Hamidullah",
    text: verseLines.map((verse) => verse.text).join(" "),
    arabic: verseLines
      .map((verse) => verse.arabic)
      .filter(Boolean)
      .join(" "),
    verses: verseLines,
    query: normalized,
  };
}

async function fetchFromProxy<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  const body = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new ApiError(
      body.error ?? "Le service local n'a pas pu joindre l'API.",
      response.status,
    );
  }

  return body;
}

function bibleSearchParams(query: BibleQuery): string {
  return new URLSearchParams({
    book: query.book,
    chapter: String(query.chapter),
    from: String(query.verseStart),
    to: String(query.verseEnd),
  }).toString();
}

function quranSearchParams(query: QuranQuery): string {
  return new URLSearchParams({
    surah: String(query.surah),
    from: String(query.ayahStart),
    to: String(query.ayahEnd),
  }).toString();
}

/** Côté navigateur : passe par les routes Next.js. Côté serveur : APIs externes. */
export async function fetchBiblePassage(query: BibleQuery): Promise<BibleExcerpt> {
  if (typeof window !== "undefined") {
    return fetchFromProxy<BibleExcerpt>(`/api/bible?${bibleSearchParams(query)}`);
  }

  return fetchBibleFromProvider(query);
}

export async function fetchQuranPassage(query: QuranQuery): Promise<QuranExcerpt> {
  if (typeof window !== "undefined") {
    return fetchFromProxy<QuranExcerpt>(`/api/quran?${quranSearchParams(query)}`);
  }

  return fetchQuranFromProvider(query);
}

export function fetchBibleChapter(book: string, chapter: number) {
  return fetchBiblePassage({
    book,
    chapter,
    verseStart: 1,
    verseEnd: 9999,
  });
}

export async function fetchTorahChapter(book: string, chapter: number) {
  if (!isTorahBook(book)) {
    throw new ApiError("Ce livre n'appartient pas à la Torah.", 400);
  }

  const passage = await fetchBibleChapter(book, chapter);
  const torahBook = TORAH_BOOKS.find((item) => item.id === book);

  return {
    ...passage,
    reference: torahBook
      ? passage.reference.replace(torahBook.latin, `${torahBook.hebrew} (${torahBook.latin})`)
      : passage.reference,
    version: "Pentateuque · traduction française",
  };
}

export function fetchQuranSurah(surah: number) {
  return fetchQuranPassage({
    surah,
    ayahStart: 1,
    ayahEnd: 9999,
  });
}

export const scriptureCatalog = {
  torahBooks: TORAH_BOOKS,
  bibleBooks: BIBLE_BOOKS,
  quranSurahs: QURAN_SURAHS,
};
