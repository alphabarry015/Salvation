export function ExegesisNote({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="border-b border-parchment bg-cream px-4 py-2 text-center text-xs leading-snug text-muted sm:px-6">
        Chaque livre a son exégèse. Une lecture seule ne donne pas le vrai sens.
      </p>
    );
  }

  return (
    <aside className="mx-auto max-w-3xl rounded-card border border-parchment bg-paper px-5 py-6 text-center shadow-harvest-sm sm:px-10 sm:py-8">
      <p className="text-[10px] font-medium tracking-[0.16em] text-flame uppercase">
        Avec humilité
      </p>
      <p className="mt-2 font-serif text-xl leading-relaxed text-ink sm:text-2xl">
        Ces livres ont tous leur exégèse.
      </p>
      <p className="mt-3 text-pretty text-sm leading-relaxed text-muted sm:text-base">
        La Torah, la Bible et le Coran s&apos;entendent, dans chacune de leurs
        traditions, avec des lectures savantes et spirituelles. Lire un
        passage, surtout traduit, ne suffit pas pour affirmer que l&apos;on
        connaît le vrai sens. Salvation ouvre le texte ; il n&apos;en clôt pas
        l&apos;interprétation.
      </p>
    </aside>
  );
}
