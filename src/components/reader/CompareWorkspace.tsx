"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BibleReader } from "@/components/reader/BibleReader";
import { QuranReader } from "@/components/reader/QuranReader";
import { TorahReader } from "@/components/reader/TorahReader";
import { KinshipNote } from "@/components/KinshipNote";
import { CATEGORY_LABELS } from "@/lib/texts";
import type { ScriptureSource, TextCategory } from "@/types/scripture";

const PANES: { id: ScriptureSource; label: string }[] = [
  { id: "torah", label: "Torah" },
  { id: "bible", label: "Bible" },
  { id: "quran", label: "Coran" },
];

interface CompareWorkspaceProps {
  themeTitle?: string;
  themeCategory?: TextCategory;
  kinshipKind?: "same" | "echo" | null;
  kinshipNote?: string;
  torahBook?: string;
  torahChapter?: number;
  torahVerseStart?: number;
  torahVerseEnd?: number;
  bibleBook?: string;
  bibleChapter?: number;
  bibleVerseStart?: number;
  bibleVerseEnd?: number;
  quranSurah?: number;
  quranAyahStart?: number;
  quranAyahEnd?: number;
}

export function CompareWorkspace({
  themeTitle,
  themeCategory,
  kinshipKind,
  kinshipNote,
  torahBook,
  torahChapter,
  torahVerseStart,
  torahVerseEnd,
  bibleBook,
  bibleChapter,
  bibleVerseStart,
  bibleVerseEnd,
  quranSurah,
  quranAyahStart,
  quranAyahEnd,
}: CompareWorkspaceProps) {
  const router = useRouter();
  const [opened] = useState(() => ({
    torahBook: torahBook ?? "GEN",
    torahChapter: torahChapter ?? 1,
    bibleBook: bibleBook ?? "GEN",
    bibleChapter: bibleChapter ?? 1,
    quranSurah: quranSurah ?? 1,
  }));
  const [dismissedTitle, setDismissedTitle] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<ScriptureSource>("torah");
  const themeActive = Boolean(themeTitle) && dismissedTitle !== themeTitle;

  function quitTheme() {
    if (themeTitle) {
      setDismissedTitle(themeTitle);
    }

    router.replace("/comparer");
  }

  const readers: Record<ScriptureSource, ReactNode> = {
    torah: (
      <TorahReader
        key={`${opened.torahBook}-${opened.torahChapter}`}
        compact
        slim
        initialBook={opened.torahBook}
        initialChapter={opened.torahChapter}
        highlightStart={themeActive ? torahVerseStart : undefined}
        highlightEnd={themeActive ? torahVerseEnd : undefined}
        highlightLabel={themeActive ? themeTitle : undefined}
      />
    ),
    bible: (
      <BibleReader
        key={`${opened.bibleBook}-${opened.bibleChapter}`}
        compact
        slim
        initialBook={opened.bibleBook}
        initialChapter={opened.bibleChapter}
        highlightStart={themeActive ? bibleVerseStart : undefined}
        highlightEnd={themeActive ? bibleVerseEnd : undefined}
        highlightLabel={themeActive ? themeTitle : undefined}
      />
    ),
    quran: (
      <QuranReader
        key={opened.quranSurah}
        compact
        slim
        showArabic={false}
        initialSurah={opened.quranSurah}
        highlightStart={themeActive ? quranAyahStart : undefined}
        highlightEnd={themeActive ? quranAyahEnd : undefined}
        highlightLabel={themeActive ? themeTitle : undefined}
      />
    ),
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-cream">
      <header className="relative shrink-0 border-b border-parchment bg-cream px-3 py-2 pr-12 text-center sm:px-6 sm:py-2.5 sm:pr-14">
        {themeActive && (
          <button
            type="button"
            onClick={quitTheme}
            aria-label="Quitter ce sujet"
            title="Quitter ce sujet"
            className="absolute top-1.5 right-2 inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-flame-soft hover:text-ink sm:top-2 sm:right-4"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        <p className="text-[10px] font-medium tracking-[0.18em] text-flame uppercase">
          {themeActive ? "Sujet" : "Rencontre"}
        </p>
        <div className="mt-0.5 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-0.5">
          <h1 className="max-w-[min(100%,26rem)] text-balance font-serif text-lg leading-tight text-ink sm:max-w-none sm:text-xl md:text-2xl">
            {themeActive
              ? themeTitle
              : "Torah, Bible et Coran, l’un à l’écoute de l’autre"}
          </h1>
          {themeActive && themeCategory && (
            <p className="text-xs text-muted">
              {CATEGORY_LABELS[themeCategory]}
            </p>
          )}
        </div>
        {themeActive && kinshipKind && kinshipNote && (
          <div className="mt-2 flex justify-center">
            <KinshipNote kind={kinshipKind} note={kinshipNote} />
          </div>
        )}
      </header>

      <div
        className="grid grid-cols-3 gap-1.5 px-3 pt-2.5 md:hidden"
        role="tablist"
        aria-label="Écritures"
      >
        {PANES.map((pane) => {
          const selected = mobilePane === pane.id;

          return (
            <button
              key={pane.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setMobilePane(pane.id)}
              className={`min-h-11 rounded-control border px-2 py-2 text-sm ${
                selected
                  ? "border-flame bg-flame text-white"
                  : "border-parchment bg-paper text-ink"
              }`}
            >
              {pane.label}
            </button>
          );
        })}
      </div>

      <div className="relative grid min-h-0 flex-1 grid-cols-1 gap-2 p-2 sm:gap-3 sm:p-3 md:grid-cols-3">
        {themeActive && kinshipKind && (
          <div className="pointer-events-none absolute top-6 right-1/3 left-[calc(16.6%+0.4rem)] z-10 hidden items-center md:flex">
            <span className="h-px flex-1 bg-mark/50" />
            <span className="mx-2 rounded-pill bg-mark-soft px-2 py-0.5 text-[10px] tracking-wide text-mark uppercase">
              {kinshipKind === "same" ? "Même passage" : "Écho"}
            </span>
            <span className="h-px flex-1 bg-mark/50" />
          </div>
        )}
        {PANES.map((pane) => (
          <article
            key={pane.id}
            className={`min-h-0 min-w-0 overflow-hidden rounded-card bg-paper shadow-harvest ${
              themeActive &&
              kinshipKind &&
              (pane.id === "torah" || pane.id === "bible")
                ? "ring-1 ring-mark/35"
                : ""
            } ${
              mobilePane === pane.id ? "flex flex-col" : "hidden md:flex md:flex-col"
            }`}
          >
            {readers[pane.id]}
          </article>
        ))}
      </div>
    </div>
  );
}
