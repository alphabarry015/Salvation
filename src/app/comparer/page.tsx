import { CompareWorkspace } from "@/components/reader/CompareWorkspace";
import { getTexts, getTorahBibleLink } from "@/lib/texts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rencontre, Salvation",
  description:
    "Lire la Torah, la Bible et le Coran l’un à l’écoute de l’autre, chacun avec sa propre navigation.",
};

export default async function ComparerPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const { theme } = await searchParams;
  const entry = getTexts().find((item) => item.id === theme);
  const link = entry ? getTorahBibleLink(entry) : { kind: null, note: "" };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-cream">
      <CompareWorkspace
        themeTitle={entry?.theme}
        themeCategory={entry?.category}
        kinshipKind={link.kind}
        kinshipNote={link.note}
        torahBook={entry?.torah.query?.book}
        torahChapter={entry?.torah.query?.chapter}
        torahVerseStart={entry?.torah.query?.verseStart}
        torahVerseEnd={entry?.torah.query?.verseEnd}
        bibleBook={entry?.bible.query?.book}
        bibleChapter={entry?.bible.query?.chapter}
        bibleVerseStart={entry?.bible.query?.verseStart}
        bibleVerseEnd={entry?.bible.query?.verseEnd}
        quranSurah={entry?.coran.query?.surah}
        quranAyahStart={entry?.coran.query?.ayahStart}
        quranAyahEnd={entry?.coran.query?.ayahEnd}
      />
    </div>
  );
}
