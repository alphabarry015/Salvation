export function Footer() {
  return (
    <footer className="border-t border-parchment">
      <div className="mx-auto max-w-6xl space-y-4 px-5 py-8 text-sm leading-relaxed text-muted sm:px-8 sm:py-10">
        <p>
          Les passages sont offerts dans une traduction française usuelle, sans
          commentaire ajouté. Chaque livre a son exégèse : une lecture seule ne
          permet pas de dire que l&apos;on en connaît le vrai sens. Chacun est
          invité à relire ces textes dans leur tradition et leur contexte
          entier.
        </p>
        <p>
          Bible : Louis Segond, 1910, grâce à{" "}
          <a
            href="https://bible.helloao.org"
            className="underline underline-offset-2 hover:text-ink"
          >
            Free Use Bible API
          </a>
          . Coran : texte arabe (Uthmani) et traduction Hamidullah, grâce à{" "}
          <a
            href="https://alquran.cloud/api"
            className="underline underline-offset-2 hover:text-ink"
          >
            Al Quran Cloud
          </a>
          .
        </p>
        <p>
          Salvation est un projet ouvert, accueillant, sans appartenance
          confessionnelle.
        </p>
      </div>
    </footer>
  );
}
