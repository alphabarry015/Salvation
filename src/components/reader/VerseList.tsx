"use client";

import { useEffect, useRef } from "react";
import {
  CopyCitationButton,
  formatCitation,
} from "@/components/CopyCitationButton";
import { SourceBadge } from "@/components/SourceBadge";
import { normalizeSearch } from "@/lib/texts";
import type { ScriptureSource, ScriptureVerse } from "@/types/scripture";

interface VerseListProps {
  source: ScriptureSource;
  title: string;
  reference: string;
  edition: string;
  verses: ScriptureVerse[];
  search?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  compact?: boolean;
  showArabic?: boolean;
  highlightStart?: number;
  highlightEnd?: number;
  highlightLabel?: string;
  scrollTo?: number | null;
}

function alignVerseInPane(
  container: HTMLElement,
  verseId: string,
  behavior: ScrollBehavior = "smooth",
) {
  const target = container.querySelector<HTMLElement>(`#${verseId}`);
  if (!target) {
    return false;
  }

  const offset =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;

  container.scrollTo({ top: Math.max(0, offset - 6), behavior });
  return true;
}

export function VerseList({
  source,
  title,
  reference,
  edition,
  verses,
  search = "",
  loading = false,
  error,
  onRetry,
  compact = false,
  showArabic = true,
  highlightStart,
  highlightEnd,
  highlightLabel,
  scrollTo,
}: VerseListProps) {
  const paneRef = useRef<HTMLDivElement>(null);
  const needle = normalizeSearch(search);
  const visible = needle
    ? verses.filter(
        (verse) =>
          normalizeSearch(verse.text).includes(needle) ||
          (showArabic &&
            verse.arabic &&
            normalizeSearch(verse.arabic).includes(needle)) ||
          String(verse.number) === needle,
      )
    : verses;

  const citation = formatCitation(
    title,
    reference,
    edition,
    visible.map((verse) => `${verse.number}. ${verse.text}`).join("\n"),
  );

  const focusNumber = scrollTo ?? highlightStart;

  useEffect(() => {
    if (loading || focusNumber == null || visible.length === 0) {
      return;
    }

    const verseId = `${source}-v-${focusNumber}`;
    const fromTop = scrollTo == null;
    let cancelled = false;
    const timers: number[] = [];

    function tryAlign() {
      const pane = paneRef.current;
      if (!pane || cancelled) {
        return false;
      }

      return alignVerseInPane(pane, verseId, "smooth");
    }

    if (fromTop) {
      paneRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }

    timers.push(
      window.setTimeout(() => {
        if (!tryAlign()) {
          timers.push(window.setTimeout(tryAlign, 280));
        }
      }, fromTop ? 320 : 40),
    );

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [focusNumber, loading, scrollTo, source, visible.length]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header
        className={`flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-line ${
          compact ? "min-h-[4.75rem] px-3 py-2.5" : "px-4 py-4 sm:px-6"
        }`}
      >
        <div>
          <SourceBadge source={source} />
          <h2
            className={`mt-2 font-serif text-ink ${
              compact ? "text-lg" : "text-xl sm:text-2xl"
            }`}
          >
            {reference || "Choisir un passage"}
          </h2>
          {edition && !compact && (
            <p className="mt-1 text-xs text-muted">{edition}</p>
          )}
          {highlightStart != null && highlightEnd != null && (
            <p className="mt-1 text-xs text-mark">
              {highlightLabel ? `${highlightLabel} · ` : ""}
              passage mis en regard · versets {highlightStart}
              {highlightEnd !== highlightStart ? `–${highlightEnd}` : ""}
            </p>
          )}
        </div>
        {visible.length > 0 && <CopyCitationButton citation={citation} />}
      </header>

      <div
        ref={paneRef}
        className={`min-h-0 flex-1 overflow-y-auto ${
          compact ? "px-3 py-4" : "px-4 py-5 sm:px-6"
        } ${highlightStart != null ? "pb-[70vh]" : ""}`}
      >
        {loading && (
          <div className="animate-pulse space-y-3" aria-busy>
            <div className="h-6 w-11/12 rounded bg-accent-soft" />
            <div className="h-6 w-full rounded bg-accent-soft" />
            <div className="h-6 w-9/12 rounded bg-accent-soft" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-line bg-accent-soft/50 px-4 py-3 text-sm">
            <p>{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 text-accent underline-offset-2 hover:underline"
              >
                Réessayer
              </button>
            )}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="text-sm text-muted">
            {needle
              ? "Aucun verset ne correspond à cette recherche."
              : "Sélectionnez un livre et un chapitre, ou une sourate."}
          </p>
        )}

        {!loading && (
          <div className={compact ? "space-y-4" : "space-y-5"}>
            {visible.map((verse) => {
              const focused =
                highlightStart != null &&
                highlightEnd != null &&
                verse.number >= highlightStart &&
                verse.number <= highlightEnd;

              return (
                <article
                  key={verse.number}
                  id={`${source}-v-${verse.number}`}
                  className={`scroll-mt-4 ${focused ? "border-l-2 border-mark pl-3" : ""}`}
                >
                  {showArabic && verse.arabic && (
                    <p
                      dir="rtl"
                      lang="ar"
                      className={`font-arabic text-xl leading-[2] text-ink sm:text-2xl ${
                        focused
                          ? "underline decoration-mark decoration-2 underline-offset-4"
                          : ""
                      }`}
                    >
                      {verse.arabic}
                    </p>
                  )}
                  <p
                    className={`leading-[1.8] text-ink ${
                      compact
                        ? "font-serif text-[0.98rem]"
                        : "font-serif text-[1.05rem] sm:text-lg sm:leading-[1.85]"
                    } ${
                      focused
                        ? "underline decoration-mark decoration-2 underline-offset-[6px]"
                        : ""
                    }`}
                  >
                    <span className="mr-2 text-xs font-medium text-accent">
                      {verse.number}
                    </span>
                    {verse.text}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
