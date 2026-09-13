export type ScriptureSource = "torah" | "bible" | "quran";
export type TextCategory = "Prophètes" | "Dogme" | "Morale";
export type CategoryFilter = "Tous" | TextCategory;
export type PassageStatus = "idle" | "loading" | "success" | "error";

export interface BibleQuery {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
}

export interface QuranQuery {
  surah: number;
  ayahStart: number;
  ayahEnd: number;
}

export interface ScriptureVerse {
  number: number;
  text: string;
  arabic?: string;
}

export interface BibleExcerpt {
  reference: string;
  version: string;
  text: string;
  verses?: ScriptureVerse[];
  query?: BibleQuery;
}

export interface QuranExcerpt {
  reference: string;
  translator: string;
  text: string;
  arabic?: string;
  verses?: ScriptureVerse[];
  query?: QuranQuery;
}

export type TorahExcerpt = BibleExcerpt;
export type TorahQuery = BibleQuery;

export type TorahBibleKinship = "same" | "echo";

export interface TextEntry {
  id: string;
  theme: string;
  category: TextCategory;
  torah: TorahExcerpt;
  bible: BibleExcerpt;
  coran: QuranExcerpt;
  kinship?: {
    torahBible?: TorahBibleKinship;
    note?: string;
  };
}

export interface PassageView {
  status: PassageStatus;
  reference: string;
  edition: string;
  text: string;
  arabic?: string;
  error?: string;
  fromApi?: boolean;
}

export type RemoteSourceId = "local" | "helloao" | "alquran-cloud";
