import { BIBLE_BOOKS, getBibleBook } from "@/data/bible-books";
import { QURAN_SURAHS } from "@/data/quran-surahs";
import type { BibleQuery, QuranQuery } from "@/types/scripture";

interface ReferenceExplorerProps {
  bibleQuery: BibleQuery;
  quranQuery: QuranQuery;
  loading: boolean;
  onBibleChange: (query: BibleQuery) => void;
  onQuranChange: (query: QuranQuery) => void;
  onSubmit: () => void;
}

const fieldClass =
  "w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent";

export function ReferenceExplorer({
  bibleQuery,
  quranQuery,
  loading,
  onBibleChange,
  onQuranChange,
  onSubmit,
}: ReferenceExplorerProps) {
  const book = getBibleBook(bibleQuery.book);
  const surah = QURAN_SURAHS.find((item) => item.number === quranQuery.surah);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="rounded-2xl border border-line bg-paper p-5 sm:p-6"
    >
      <div className="mb-5 space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Lecture libre
        </p>
        <h3 className="font-serif text-xl text-ink sm:text-2xl">
          Choisir une référence
        </h3>
        <p className="text-sm leading-relaxed text-muted">
          Les textes sont chargés à la demande depuis Free Use Bible API
          (Louis Segond) et Al Quran Cloud (arabe + Hamidullah).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-ink">Bible</legend>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-muted">
              Livre
            </span>
            <select
              className={fieldClass}
              value={bibleQuery.book}
              onChange={(event) =>
                onBibleChange({
                  ...bibleQuery,
                  book: event.target.value,
                  chapter: 1,
                  verseStart: 1,
                  verseEnd: 1,
                })
              }
            >
              {BIBLE_BOOKS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <NumberField
              label="Chapitre"
              min={1}
              max={book?.chapters ?? 150}
              value={bibleQuery.chapter}
              onChange={(chapter) =>
                onBibleChange({ ...bibleQuery, chapter })
              }
            />
            <NumberField
              label="Du verset"
              min={1}
              value={bibleQuery.verseStart}
              onChange={(verseStart) =>
                onBibleChange({
                  ...bibleQuery,
                  verseStart,
                  verseEnd: Math.max(verseStart, bibleQuery.verseEnd),
                })
              }
            />
            <NumberField
              label="Au verset"
              min={bibleQuery.verseStart}
              value={bibleQuery.verseEnd}
              onChange={(verseEnd) =>
                onBibleChange({ ...bibleQuery, verseEnd })
              }
            />
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-ink">Coran</legend>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-wider text-muted">
              Sourate
            </span>
            <select
              className={fieldClass}
              value={quranQuery.surah}
              onChange={(event) =>
                onQuranChange({
                  surah: Number(event.target.value),
                  ayahStart: 1,
                  ayahEnd: 1,
                })
              }
            >
              {QURAN_SURAHS.map((item) => (
                <option key={item.number} value={item.number}>
                  {item.number}. {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="Du verset"
              min={1}
              max={surah?.ayahs ?? 286}
              value={quranQuery.ayahStart}
              onChange={(ayahStart) =>
                onQuranChange({
                  ...quranQuery,
                  ayahStart,
                  ayahEnd: Math.max(ayahStart, quranQuery.ayahEnd),
                })
              }
            />
            <NumberField
              label="Au verset"
              min={quranQuery.ayahStart}
              max={surah?.ayahs ?? 286}
              value={quranQuery.ayahEnd}
              onChange={(ayahEnd) => onQuranChange({ ...quranQuery, ayahEnd })}
            />
          </div>
        </fieldset>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-accent px-5 py-2.5 text-sm text-paper transition-opacity disabled:opacity-60"
        >
          {loading ? "Chargement…" : "Afficher les textes"}
        </button>
        <p className="text-xs text-muted">
          {book?.name} {bibleQuery.chapter} · Sourate {quranQuery.surah}
          {surah ? ` (${surah.ayahs} versets)` : ""}
        </p>
      </div>
    </form>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || min)}
        className={fieldClass}
      />
    </label>
  );
}
