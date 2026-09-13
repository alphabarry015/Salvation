import Link from "next/link";
import { ExegesisNote } from "@/components/ExegesisNote";
import { Footer } from "@/components/Footer";
import { HomeCompare } from "@/components/home/HomeCompare";
import { getTexts } from "@/lib/texts";

export default function Home() {
  const themes = getTexts();

  return (
    <div className="flex-1">
      <section className="hero-wash">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-xs font-medium tracking-[0.22em] text-flame uppercase">
            Lecture respectueuse · français
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.15] text-ink sm:text-6xl">
            Lire la Torah, la Bible et le Coran
            <span className="text-flame"> l&apos;un à l&apos;écoute de l&apos;autre</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Un lieu calme pour accueillir ces trois Écritures ensemble. Chaque
            texte est offert en français, dans le respect de sa voix — sans
            prétendre en épuiser le sens.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/comparer"
              className="rounded-control bg-flame px-5 py-2.5 text-sm font-medium text-white shadow-harvest-sm hover:bg-flame-hover"
            >
              Lire ensemble
            </Link>
            <Link
              href="/torah"
              className="rounded-control border border-parchment bg-paper px-5 py-2.5 text-sm text-ink shadow-harvest-sm"
            >
              Lire la Torah
            </Link>
            <Link
              href="/bible"
              className="rounded-control border border-parchment bg-paper px-5 py-2.5 text-sm text-ink shadow-harvest-sm"
            >
              Lire la Bible
            </Link>
            <Link
              href="/coran"
              className="rounded-control border border-parchment bg-paper px-5 py-2.5 text-sm text-ink shadow-harvest-sm"
            >
              Lire le Coran
            </Link>
          </div>
        </div>
      </section>

      <HomeCompare themes={themes} />

      <section className="px-4 pb-16 sm:px-6">
        <ExegesisNote />
      </section>

      <Footer />
    </div>
  );
}
