export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl space-y-3 px-4 py-8 text-sm leading-relaxed text-muted sm:px-6">
        <p>
          Les passages sont présentés dans une traduction française usuelle,
          sans commentaire. Chaque livre a son exégèse : lire seul ne permet
          pas de dire que l&apos;on connaît le vrai sens. Chacun est invité à
          relire ces textes dans leur tradition et leur contexte intégral.
        </p>
        <p>
          Bible&nbsp;: Louis Segond, 1910 via{" "}
          <a
            href="https://bible.helloao.org"
            className="underline underline-offset-2 hover:text-ink"
          >
            Free Use Bible API
          </a>
          . Coran&nbsp;: texte arabe (Uthmani) et traduction Hamidullah via{" "}
          <a
            href="https://alquran.cloud/api"
            className="underline underline-offset-2 hover:text-ink"
          >
            Al Quran Cloud
          </a>
          .
        </p>
        <p className="text-xs">
          Salvation est un projet ouvert, accueillant et non confessionnel.
        </p>
      </div>
    </footer>
  );
}
