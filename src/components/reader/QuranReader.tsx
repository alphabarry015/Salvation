"use client";

import { useEffect, useMemo, useState } from "react";
import { VerseList } from "@/components/reader/VerseList";
import { QURAN_SURAHS } from "@/data/quran-surahs";
import { normalizeSearch } from "@/lib/texts";
import { fetchQuranSurah, getApiErrorMessage } from "@/services/api";
import type { ScriptureVerse } from "@/types/scripture";

type Tab = "sourates" | "versets";

interface QuranReaderProps {
  compact?: boolean;
  slim?: boolean;
  initialSurah?: number;
  showArabic?: boolean;
  navPosition?: "left" | "right";
  highlightStart?: number;
  highlightEnd?: number;
  highlightLabel?: string;
}

export function QuranReader({
  compact = false,
  slim = false,
  initialSurah = 1,
  showArabic = true,
  navPosition = "left",
  highlightStart,
  highlightEnd,
  highlightLabel,
}: QuranReaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tab, setTab] = useState<Tab>(
    compact && highlightStart != null ? "versets" : "sourates",
  );
  const [search, setSearch] = useState("");
  const [surahNumber, setSurahNumber] = useState(initialSurah);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [verses, setVerses] = useState<ScriptureVerse[]>([]);
  const [reference, setReference] = useState("");
  const [edition, setEdition] = useState("Hamidullah");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const surahs = useMemo(() => {
    const needle = normalizeSearch(search);
    if (!needle || tab !== "sourates") {
      return QURAN_SURAHS;
    }

    return QURAN_SURAHS.filter(
      (item) =>
        normalizeSearch(item.name).includes(needle) ||
        String(item.number) === needle,
    );
  }, [search, tab]);

  async function load(nextSurah = surahNumber) {
    setLoading(true);
    setError(undefined);

    try {
      const passage = await fetchQuranSurah(nextSurah);
      setVerses(passage.verses ?? []);
      setReference(passage.reference);
      setEdition(passage.translator);
    } catch (reason) {
      setVerses([]);
      setError(getApiErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    fetchQuranSurah(initialSurah)
      .then((passage) => {
        if (cancelled) {
          return;
        }

        setVerses(passage.verses ?? []);
        setReference(passage.reference);
        setEdition(passage.translator);
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
  }, [initialSurah]);

  function selectSurah(number: number) {
    setSurahNumber(number);
    setActiveVerse(null);
    setTab("versets");
    setSheetOpen(false);
    void load(number);
  }

  function selectVerse(number: number) {
    setActiveVerse(number);
    setSheetOpen(false);
  }

  const fieldClass =
    "w-full rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent";

  const rowClass = compact
    ? navPosition === "right"
      ? "flex-row-reverse"
      : "flex-row"
    : "flex-col md:flex-row";
  const asideClass = compact
    ? `${sheetOpen ? "flex" : "hidden"} absolute inset-y-0 z-30 w-64 max-w-[85vw] flex-col border-line bg-paper shadow-harvest lg:relative lg:flex lg:max-w-none lg:shadow-none ${
        slim ? "lg:w-28" : "lg:w-40"
      } ${navPosition === "right" ? "right-0 border-l" : "left-0 border-r"}`
    : `${sheetOpen ? "flex" : "hidden"} absolute inset-y-0 left-0 z-30 w-72 max-w-[88vw] flex-col border-r border-line bg-paper shadow-harvest md:relative md:flex md:w-64 md:max-w-none md:shadow-none`;

  return (
    <div className={`relative flex min-h-0 flex-1 ${rowClass}`}>
      {sheetOpen && (
        <button
          type="button"
          className={`absolute inset-0 z-20 bg-ink/25 ${compact ? "lg:hidden" : "md:hidden"}`}
          aria-label="Fermer le sommaire"
          onClick={() => setSheetOpen(false)}
        />
      )}
      <aside className={asideClass}>
        <div className="space-y-2 p-1.5 sm:p-3">
          <div className={`flex items-center justify-between ${compact ? "lg:hidden" : "md:hidden"}`}>
            <p className="text-xs font-medium text-ink">Sommaire</p>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="rounded-pill px-2 py-1 text-[11px] text-muted"
            >
              Fermer
            </button>
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={tab === "sourates" ? "Sourate…" : "Texte…"}
            className={fieldClass}
            aria-label="Recherche Coran"
          />

          <div className="flex gap-0.5" role="tablist" aria-label="Navigation Coran">
            {(["sourates", "versets"] as const).map((item) => (
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
                {item === "sourates" ? "Sour." : "V."}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "sourates" && (
            <ul className="px-1.5 pb-3">
              {surahs.map((item) => (
                <li key={item.number}>
                  <button
                    type="button"
                    onClick={() => selectSurah(item.number)}
                    className={`w-full rounded-md px-2 py-1 text-left text-xs sm:text-sm ${
                      item.number === surahNumber
                        ? "bg-accent-soft text-ink"
                        : "text-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {item.number}. {item.name}
                  </button>
                </li>
              ))}
            </ul>
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
        source="quran"
        title="Coran"
        reference={reference}
        edition={edition}
        verses={verses}
        search={tab === "sourates" ? "" : search}
        loading={loading}
        error={error}
        onRetry={() => void load()}
        compact={compact}
        showArabic={showArabic}
        highlightStart={
          surahNumber === initialSurah ? highlightStart : undefined
        }
        highlightEnd={surahNumber === initialSurah ? highlightEnd : undefined}
        highlightLabel={highlightLabel}
        scrollTo={activeVerse}
        onOpenNav={() => setSheetOpen(true)}
        navUntil={compact ? "lg" : "md"}
      />
    </div>
  );
}
