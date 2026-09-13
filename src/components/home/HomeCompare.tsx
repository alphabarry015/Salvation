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
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-flame uppercase">
            Mise en regard
          </p>
          <h2 className="mt-1 font-serif text-3xl text-ink">
            {current.theme}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {CATEGORY_LABELS[current.category]} · passages en français
          </p>
        </div>
        <Link
          href={`/comparer?theme=${current.id}`}
          className="self-start rounded-control bg-flame px-4 py-2 text-sm font-medium text-white shadow-harvest-sm hover:bg-flame-hover"
        >
          Lire en regard
        </Link>
      </div>

      <div
        role="tablist"
        aria-label="Sujets"
        className="mb-8 flex gap-2 overflow-x-auto pb-1"
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
              className={`shrink-0 rounded-pill border px-4 py-1.5 text-sm transition-colors ${
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

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid gap-5 lg:col-span-2 lg:grid-cols-2">
          <HomePassage
            source="torah"
            reference={current.torah.reference}
            text={current.torah.text}
            edition={current.torah.version}
            linked={link.kind === "same"}
            linkLabel="Lié à la Bible"
          />
          <HomePassage
            source="bible"
            reference={current.bible.reference}
            text={current.bible.text}
            edition={current.bible.version}
            linked={Boolean(link.kind)}
            linkLabel={
              link.kind === "same" ? "Lié à la Torah" : "Echo de la Torah"
            }
          />
        </div>
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
      className={`rounded-card bg-paper p-6 shadow-harvest sm:p-8 ${
        linked ? "ring-1 ring-mark/40" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge source={source} />
        {linked && linkLabel && (
          <span className="text-[11px] text-mark">{linkLabel}</span>
        )}
      </div>
      <h3 className="mt-3 font-serif text-xl text-ink">{reference}</h3>
      <blockquote className="mt-5 font-serif text-[1.05rem] leading-[1.85] text-ink">
        «&nbsp;{text}&nbsp;»
      </blockquote>
      <p className="mt-6 text-xs text-muted">{edition}</p>
    </article>
  );
}
