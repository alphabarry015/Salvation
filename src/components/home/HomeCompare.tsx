"use client";

import Link from "next/link";
import { useState } from "react";
import { KinshipNote } from "@/components/KinshipNote";
import { SourceBadge } from "@/components/SourceBadge";
import { CATEGORY_LABELS, getTorahBibleLink } from "@/lib/texts";
import type { ScriptureSource, TextEntry } from "@/types/scripture";

export function HomeCompare({ themes }: { themes: TextEntry[] }) {
  const [selectedId, setSelectedId] = useState(themes[0]?.id ?? "");
  const current = themes.find((theme) => theme.id === selectedId) ?? themes[0];

  if (!current) {
    return null;
  }

  const link = getTorahBibleLink(current);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-[0.16em] text-flame uppercase sm:text-xs">
            Accueillir ensemble
          </p>
          <h2 className="mt-1 font-serif text-2xl text-ink sm:text-3xl">
            {current.theme}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {CATEGORY_LABELS[current.category]}, passages en français
          </p>
        </div>
        <Link
          href={`/comparer?theme=${current.id}`}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-control bg-flame px-4 py-2.5 text-center text-sm font-medium text-white shadow-harvest-sm hover:bg-flame-hover md:w-auto md:self-start"
        >
          Lire ces passages ensemble
        </Link>
      </div>

      <label className="sr-only" htmlFor="theme-select">
        Choisir un sujet
      </label>
      <select
        id="theme-select"
        value={current.id}
        onChange={(event) => setSelectedId(event.target.value)}
        className="mb-6 min-h-12 w-full rounded-control border border-parchment bg-paper px-3 py-3 text-sm text-ink md:hidden"
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.theme}
          </option>
        ))}
      </select>

      <div
        role="tablist"
        aria-label="Sujets"
        className="mb-8 hidden flex-wrap gap-2 md:flex"
      >
        {themes.map((theme) => {
          const selected = theme.id === current.id;

          return (
            <button
              key={theme.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSelectedId(theme.id)}
              className={`rounded-pill border px-3 py-1.5 text-sm transition-colors ${
                selected
                  ? "border-flame bg-flame text-white"
                  : "border-parchment bg-cream text-ink hover:border-flame hover:text-flame"
              }`}
            >
              {theme.theme}
            </button>
          );
        })}
      </div>

      {link.kind && (
        <div className="mb-5">
          <KinshipNote kind={link.kind} note={link.note} />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        <HomePassage
          source="torah"
          reference={current.torah.reference}
          text={current.torah.text}
          edition={current.torah.version}
          linked={link.kind === "same"}
          linkLabel="Même passage que dans la Bible"
        />
        <HomePassage
          source="bible"
          reference={current.bible.reference}
          text={current.bible.text}
          edition={current.bible.version}
          linked={Boolean(link.kind)}
          linkLabel={
            link.kind === "same"
              ? "Même passage que dans la Torah"
              : "Un écho de la Torah"
          }
        />
        <HomePassage
          source="quran"
          reference={current.coran.reference}
          text={current.coran.text}
          edition={`Traduction : ${current.coran.translator}`}
        />
      </div>
    </section>
  );
}

function HomePassage({
  source,
  reference,
  text,
  edition,
  linked = false,
  linkLabel,
}: {
  source: ScriptureSource;
  reference: string;
  text: string;
  edition: string;
  linked?: boolean;
  linkLabel?: string;
}) {
  return (
    <article
      className={`rounded-card bg-paper p-5 shadow-harvest sm:p-6 lg:p-8 ${
        linked ? "ring-1 ring-mark/40" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={source} />
        {linked && linkLabel && (
          <span className="text-[11px] text-mark">{linkLabel}</span>
        )}
      </div>
      <h3 className="mt-3 font-serif text-lg text-ink sm:text-xl">{reference}</h3>
      <blockquote className="mt-4 font-serif text-[0.98rem] leading-[1.75] text-ink sm:mt-5 sm:text-[1.05rem] sm:leading-[1.85]">
        «&nbsp;{text}&nbsp;»
      </blockquote>
      <p className="mt-6 text-xs text-muted">{edition}</p>
    </article>
  );
}
