"use client";

import { useEffect, useMemo, useState } from "react";
import { VerseList } from "@/components/reader/VerseList";
import { BIBLE_BOOKS, getBibleBook } from "@/data/bible-books";
import { TORAH_BOOKS, getTorahBook } from "@/data/torah-books";
import { normalizeSearch } from "@/lib/texts";
import {
  fetchBibleChapter,
  fetchTorahChapter,
  getApiErrorMessage,
} from "@/services/api";
import type { ScriptureVerse } from "@/types/scripture";

type Tab = "livres" | "chapitres" | "versets";

export interface BibleReaderProps {
  canon?: "bible" | "torah";
  compact?: boolean;
  slim?: boolean;
  initialBook?: string;
  initialChapter?: number;
  navPosition?: "left" | "right";
  highlightStart?: number;
  highlightEnd?: number;
  highlightLabel?: string;
}

export function BibleReader({
  canon = "bible",
  compact = false,
  slim = false,
  initialBook = "GEN",
  initialChapter = 1,
  navPosition = "left",
  highlightStart,
  highlightEnd,
  highlightLabel,
}: BibleReaderProps) {
  const [tab, setTab] = useState<Tab>(
    compact && highlightStart != null ? "versets" : compact ? "chapitres" : "livres",
  );
  const [search, setSearch] = useState("");
  const [bookId, setBookId] = useState(initialBook);
  const [chapter, setChapter] = useState(initialChapter);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [verses, setVerses] = useState<ScriptureVerse[]>([]);
  const [reference, setReference] = useState("");
  const [edition, setEdition] = useState(
    canon === "torah" ? "Pentateuque · traduction française" : "Louis Segond, 1910",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const catalog = canon === "torah" ? TORAH_BOOKS : BIBLE_BOOKS;
  const isTorah = canon === "torah";
  const book =
    canon === "torah" ? getTorahBook(bookId) : getBibleBook(bookId);
  const books = useMemo(() => {
    const needle = normalizeSearch(search);
    if (!needle || tab !== "livres") {
      return catalog;
    }

    return catalog.filter((item) => {
      const latin = getTorahBook(item.id)?.latin;

      return (
        normalizeSearch(item.name).includes(needle) ||
        normalizeSearch(item.id).includes(needle) ||
        Boolean(latin && normalizeSearch(latin).includes(needle))
      );
    });
  }, [catalog, search, tab]);

  async function load(nextBook = bookId, nextChapter = chapter) {
    setLoading(true);
    setError(undefined);

    try {
      const passage = isTorah
        ? await fetchTorahChapter(nextBook, nextChapter)
        : await fetchBibleChapter(nextBook, nextChapter);
      setVerses(passage.verses ?? []);
      setReference(passage.reference);
      setEdition(passage.version);
    } catch (reason) {
      setVerses([]);
      setError(getApiErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (isTorah
      ? fetchTorahChapter(initialBook, initialChapter)
      : fetchBibleChapter(initialBook, initialChapter))
      .then((passage) => {
        if (cancelled) {
          return;
        }

        setVerses(passage.verses ?? []);
        setReference(passage.reference);
        setEdition(passage.version);
        setLoading(false);
      })
      .catch((reason) => {
        if (cancelled) {
          return;
        }

        setVerses([]);
        setError(getApiErrorMessage(reason));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialBook, initialChapter, isTorah]);

  function selectBook(id: string) {
    setBookId(id);
    setChapter(1);
    setActiveVerse(null);
    setTab("chapitres");
    void load(id, 1);
  }

  function selectChapter(number: number) {
    setChapter(number);
    setActiveVerse(null);
    setTab("versets");
    void load(bookId, number);
  }

  function selectVerse(number: number) {
    setActiveVerse(number);
  }

  const fieldClass =
    "w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent";

  const rowClass = compact
    ? navPosition === "right"
      ? "flex-row-reverse"
      : "flex-row"
    : "flex-col md:flex-row";
  const asideClass = compact
    ? `flex min-h-0 shrink-0 flex-col ${
        slim ? "w-[5.5rem] sm:w-28" : "w-[7.5rem] sm:w-40"
      } ${navPosition === "right" ? "border-l" : "border-r"} border-line`
    : "min-h-0 shrink-0 border-b border-line md:flex md:w-64 md:flex-col md:border-r md:border-b-0";

  return (
    <div className={`flex min-h-0 flex-1 ${rowClass}`}>
      <aside className={asideClass}>
        <div className="space-y-2 p-2 sm:p-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              tab === "livres"
                ? "Livre…"
                : "Texte…"
            }
            className={fieldClass}
            aria-label={isTorah ? "Recherche Torah" : "Recherche Bible"}
          />

          <div
            className="flex gap-0.5"
            role="tablist"
            aria-label={isTorah ? "Navigation Torah" : "Navigation Bible"}
          >
            {(["livres", "chapitres", "versets"] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={tab === item}
                onClick={() => setTab(item)}
                className={`flex-1 rounded-md px-1 py-1 text-[10px] capitalize sm:text-xs ${
                  tab === item
                    ? "bg-accent text-paper"
                    : "bg-canvas text-muted hover:text-ink"
                }`}
              >
                {item === "livres" ? "Livres" : item === "chapitres" ? "Ch." : "V."}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "livres" && (
            <ul className="px-1.5 pb-3">
              {books.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => selectBook(item.id)}
                    className={`w-full rounded-md px-2 py-1 text-left text-xs sm:text-sm ${
                      item.id === bookId
                        ? "bg-accent-soft text-ink"
                        : "text-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {isTorah ? (
                      <span className="block">
                        {item.name}
                        <span className="block text-[10px] text-muted">
                          {getTorahBook(item.id)?.latin}
                        </span>
                      </span>
                    ) : (
                      item.name
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {tab === "chapitres" && book && (
            <div className="px-2 pb-3">
              <p className="mb-2 px-0.5 text-[11px] leading-snug text-muted">
                {book.name}
                <span className="block text-[10px]">
                  {book.chapters} chapitres
                </span>
              </p>
              <div className={`grid gap-1 ${compact ? "grid-cols-4" : "grid-cols-5"}`}>
                {Array.from({ length: book.chapters }, (_, index) => index + 1).map(
                  (number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => selectChapter(number)}
                      className={`rounded-md py-1.5 text-xs sm:text-sm ${
                        number === chapter
                          ? "bg-accent text-paper"
                          : "bg-canvas text-ink hover:bg-accent-soft"
                      }`}
                    >
                      {number}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {tab === "versets" && (
            <div className={`grid gap-1 px-2 pb-3 ${compact ? "grid-cols-4" : "grid-cols-5"}`}>
              {verses.map((verse) => (
                <button
                  key={verse.number}
                  type="button"
                  onClick={() => selectVerse(verse.number)}
                  className={`rounded-md py-1.5 text-xs sm:text-sm ${
                    verse.number === activeVerse
                      ? "bg-accent text-paper"
                      : highlightStart != null &&
                          highlightEnd != null &&
                          verse.number >= highlightStart &&
                          verse.number <= highlightEnd
                        ? "bg-mark-soft text-ink underline decoration-mark"
                        : "bg-canvas text-ink hover:bg-accent-soft"
                  }`}
                >
                  {verse.number}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      <VerseList
        source={isTorah ? "torah" : "bible"}
        title={isTorah ? "Torah" : "Bible"}
        reference={reference}
        edition={edition}
        verses={verses}
        search={tab === "livres" ? "" : search}
        loading={loading}
        error={error}
        onRetry={() => void load()}
        compact={compact}
        highlightStart={
          bookId === initialBook && chapter === initialChapter
            ? highlightStart
            : undefined
        }
        highlightEnd={
          bookId === initialBook && chapter === initialChapter
            ? highlightEnd
            : undefined
        }
        highlightLabel={highlightLabel}
        scrollTo={activeVerse}
      />
    </div>
  );
}
