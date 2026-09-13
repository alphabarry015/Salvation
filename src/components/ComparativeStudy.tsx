"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ReferenceExplorer } from "@/components/ReferenceExplorer";
import { SearchBar } from "@/components/SearchBar";
import { SplitScreen } from "@/components/SplitScreen";
import { ThemeSelector } from "@/components/ThemeSelector";
import { useScripturePassages } from "@/hooks/useScripturePassages";
import { CATEGORY_LABELS, filterTexts } from "@/lib/texts";
import type {
  BibleQuery,
  CategoryFilter as CategoryFilterValue,
  QuranQuery,
  TextEntry,
} from "@/types/scripture";

function queriesFromEntry(entry: TextEntry): {
  bible: BibleQuery;
  quran: QuranQuery;
} {
  return {
    bible: entry.bible.query ?? {
      book: "GEN",
      chapter: 1,
      verseStart: 1,
      verseEnd: 5,
    },
    quran: entry.coran.query ?? {
      surah: 1,
      ayahStart: 1,
      ayahEnd: 7,
    },
  };
}

export function ComparativeStudy({ texts }: { texts: TextEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilterValue>("Tous");
  const [selectedId, setSelectedId] = useState(texts[0]?.id ?? "");
  const [bibleQuery, setBibleQuery] = useState<BibleQuery>(
    () => queriesFromEntry(texts[0] ?? emptyEntry()).bible,
  );
  const [quranQuery, setQuranQuery] = useState<QuranQuery>(
    () => queriesFromEntry(texts[0] ?? emptyEntry()).quran,
  );
  const [activeThemeId, setActiveThemeId] = useState<string | null>(
    texts[0]?.id ?? null,
  );

  const { bible, quran, lookup } = useScripturePassages(texts[0]);
  const didFetchInitial = useRef(false);

  const filtered = useMemo(
    () => filterTexts(texts, query, category),
    [texts, query, category],
  );

  const current =
    filtered.find((entry) => entry.id === selectedId) ?? filtered[0];

  useEffect(() => {
    if (didFetchInitial.current || !texts[0]) {
      return;
    }

    didFetchInitial.current = true;
    const next = queriesFromEntry(texts[0]);
    void lookup(next.bible, next.quran, texts[0]);
  }, [lookup, texts]);

  const loading = bible.status === "loading" || quran.status === "loading";
  const activeTheme =
    activeThemeId != null
      ? texts.find((entry) => entry.id === activeThemeId)
      : undefined;

  function loadPassages(
    nextBible: BibleQuery,
    nextQuran: QuranQuery,
    fallback?: TextEntry,
  ) {
    void lookup(nextBible, nextQuran, fallback);
  }

  function handleSelectTheme(id: string) {
    setSelectedId(id);
    const entry = texts.find((item) => item.id === id);
    if (!entry) {
      return;
    }

    const next = queriesFromEntry(entry);
    setBibleQuery(next.bible);
    setQuranQuery(next.quran);
    setActiveThemeId(entry.id);
    loadPassages(next.bible, next.quran, entry);
  }

  function handleFreeLookup() {
    setActiveThemeId(null);
    loadPassages(bibleQuery, quranQuery);
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="catalog-heading" className="space-y-5">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Catalogue
          </p>
          <h2
            id="catalog-heading"
            className="font-serif text-2xl text-ink sm:text-3xl"
          >
            Rechercher et parcourir
          </h2>
        </div>

        <SearchBar value={query} onChange={setQuery} />
        <CategoryFilter value={category} onChange={setCategory} />

        {filtered.length > 0 && current ? (
          <ThemeSelector
            entries={filtered}
            selectedId={activeThemeId ?? ""}
            onSelect={handleSelectTheme}
          />
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-paper px-5 py-8 text-sm leading-relaxed text-muted">
            Aucune fiche ne correspond à cette recherche. Essayez un autre mot,
            une référence (Genèse, Maryam…) ou une autre catégorie.
          </p>
        )}
      </section>

      <ReferenceExplorer
        bibleQuery={bibleQuery}
        quranQuery={quranQuery}
        loading={loading}
        onBibleChange={setBibleQuery}
        onQuranChange={setQuranQuery}
        onSubmit={handleFreeLookup}
      />

      <div className="space-y-4">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {activeTheme
              ? CATEGORY_LABELS[activeTheme.category]
              : "Référence libre"}
          </p>
          <h3 className="mt-1 font-serif text-2xl text-ink sm:text-3xl">
            {activeTheme?.theme ?? "Lecture côte à côte"}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            {bible.reference || quran.reference
              ? `${bible.reference || "Bible"} et ${quran.reference || "Coran"}.`
              : "Choisissez un thème ou une référence, puis lancez l'affichage."}
          </p>
        </div>
        <SplitScreen
          bible={bible}
          quran={quran}
          onRetryBible={() => loadPassages(bibleQuery, quranQuery, activeTheme)}
          onRetryQuran={() => loadPassages(bibleQuery, quranQuery, activeTheme)}
        />
      </div>
    </div>
  );
}

function emptyEntry(): TextEntry {
  return {
    id: "",
    theme: "",
    category: "Dogme",
    torah: {
      reference: "",
      version: "",
      text: "",
      query: { book: "GEN", chapter: 1, verseStart: 1, verseEnd: 5 },
    },
    bible: {
      reference: "",
      version: "",
      text: "",
      query: { book: "GEN", chapter: 1, verseStart: 1, verseEnd: 5 },
    },
    coran: {
      reference: "",
      translator: "",
      text: "",
      query: { surah: 1, ayahStart: 1, ayahEnd: 7 },
    },
  };
}
