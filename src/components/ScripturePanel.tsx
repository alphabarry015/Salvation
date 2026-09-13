import {
  CopyCitationButton,
  formatCitation,
} from "@/components/CopyCitationButton";
import type { PassageView, ScriptureSource } from "@/types/scripture";

const LABELS: Record<
  ScriptureSource,
  { title: string; corpus: string; nav: string }
> = {
  torah: {
    title: "Torah",
    corpus: "Pentateuque",
    nav: "Livre",
  },
  bible: {
    title: "Bible",
    corpus: "Écritures bibliques",
    nav: "Livre",
  },
  quran: {
    title: "Coran",
    corpus: "Texte coranique",
    nav: "Sourate",
  },
};

interface ScripturePanelProps {
  source: ScriptureSource;
  passage: PassageView;
  onRetry?: () => void;
}

export function ScripturePanel({
  source,
  passage,
  onRetry,
}: ScripturePanelProps) {
  const label = LABELS[source];
  const citation = formatCitation(
    label.title,
    passage.reference,
    passage.edition,
    passage.arabic
      ? `${passage.arabic}\n\n${passage.text}`
      : passage.text,
  );

  return (
    <section
      aria-labelledby={`${source}-heading`}
      aria-busy={passage.status === "loading"}
      className="flex min-h-0 flex-1 flex-col bg-paper px-5 py-7 sm:px-8 sm:py-9"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {label.corpus}
          </p>
          <h3
            id={`${source}-heading`}
            className="mt-1 font-serif text-2xl text-ink sm:text-3xl"
          >
            {label.title}
          </h3>
          {passage.reference && (
            <p className="mt-3 text-sm text-accent">
              <span className="text-muted">{label.nav}&nbsp;· </span>
              {passage.reference}
            </p>
          )}
        </div>
        {passage.status === "success" && passage.text && (
          <CopyCitationButton citation={citation} />
        )}
      </header>

      {passage.status === "loading" && <PassageSkeleton />}

      {passage.status === "error" && (
        <div className="mt-6 rounded-xl border border-line bg-accent-soft/60 px-4 py-3 text-sm leading-relaxed text-ink">
          <p>{passage.error}</p>
          {passage.text ? (
            <p className="mt-2 text-muted">
              Le corpus local est affiché en secours.
            </p>
          ) : null}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 text-sm text-accent underline-offset-2 hover:underline"
            >
              Réessayer
            </button>
          )}
        </div>
      )}

      {passage.arabic && passage.status !== "loading" && (
        <p
          dir="rtl"
          lang="ar"
          className="mt-8 font-arabic text-2xl leading-[2.15] text-ink sm:text-[1.7rem]"
        >
          {passage.arabic}
        </p>
      )}

      {passage.text && passage.status !== "loading" && (
        <blockquote className="mt-6 font-serif text-[1.125rem] leading-[1.85] text-ink sm:text-xl sm:leading-[1.9]">
          <span className="text-muted">«&nbsp;</span>
          {passage.text}
          <span className="text-muted">&nbsp;»</span>
        </blockquote>
      )}

      {passage.edition && passage.status !== "loading" && (
        <p className="mt-8 text-xs tracking-wide text-muted">
          {source === "bible" ? "Version" : "Traduction"}&nbsp;: {passage.edition}
          {passage.fromApi ? " · source API" : ""}
        </p>
      )}
    </section>
  );
}

function PassageSkeleton() {
  return (
    <div className="mt-8 animate-pulse space-y-3" aria-hidden>
      <div className="h-7 w-11/12 rounded bg-accent-soft" />
      <div className="h-7 w-full rounded bg-accent-soft" />
      <div className="h-7 w-10/12 rounded bg-accent-soft" />
      <div className="h-7 w-8/12 rounded bg-accent-soft" />
    </div>
  );
}
