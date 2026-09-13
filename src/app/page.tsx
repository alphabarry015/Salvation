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
        <div className="mx-auto max-w-3xl px-5 py-10 text-center sm:px-8 sm:py-20 md:py-24 lg:py-28">
          <p className="text-[11px] font-medium tracking-[0.16em] text-flame uppercase sm:text-xs">
            Lecture en français, avec respect
          </p>
          <h1 className="mt-3 text-balance font-serif text-[1.7rem] leading-[1.2] text-ink sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
            Lire la Torah, la Bible et le Coran
            <span className="text-flame">
              {" "}
              l&apos;un à l&apos;écoute de l&apos;autre
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-muted sm:mt-6 sm:text-base md:text-lg">
            Un lieu calme pour accueillir ces trois Écritures ensemble. Chaque
            texte est offert en français, dans le respect de sa voix, sans
            prétendre en épuiser le sens.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:items-center">
            <Link
              href="/comparer"
              className="inline-flex min-h-12 items-center justify-center rounded-control bg-flame px-5 py-3 text-sm font-medium text-white shadow-harvest-sm hover:bg-flame-hover sm:px-6"
            >
              Lire ensemble
            </Link>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center">
              <Link
                href="/torah"
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-parchment bg-paper px-2 py-2.5 text-center text-sm text-ink shadow-harvest-sm sm:px-5"
              >
                Torah
              </Link>
              <Link
                href="/bible"
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-parchment bg-paper px-2 py-2.5 text-center text-sm text-ink shadow-harvest-sm sm:px-5"
              >
                Bible
              </Link>
              <Link
                href="/coran"
                className="inline-flex min-h-11 items-center justify-center rounded-control border border-parchment bg-paper px-2 py-2.5 text-center text-sm text-ink shadow-harvest-sm sm:px-5"
              >
                Coran
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeCompare themes={themes} />

      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <ExegesisNote />
      </section>

      <Footer />
    </div>
  );
}
