export function ExegesisNote({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="border-b border-parchment bg-cream px-4 py-1.5 text-center text-[11px] leading-snug text-muted sm:px-6">
        La Torah, la Bible et le Coran ont chacun leur exégèse. Lire seul ne
        permet pas de dire que l&apos;on connaît le vrai sens.
      </p>
    );
  }

  return (
    <aside className="mx-auto max-w-3xl rounded-card border border-parchment bg-paper px-6 py-5 text-center shadow-harvest-sm sm:px-8">
      <p className="text-[10px] font-medium tracking-[0.18em] text-flame uppercase">
        Avec humilité
      </p>
      <p className="mt-2 font-serif text-lg leading-relaxed text-ink">
        Ces livres ont tous leur exégèse.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        La Torah, la Bible et le Coran s&apos;entendent, dans chacune de leurs
        traditions, avec des lectures savantes et spirituelles. Lire un
        passage, surtout traduit, ne suffit pas pour affirmer que l&apos;on
        connaît le vrai sens. Salvation ouvre le texte ; il n&apos;en clôt pas
        l&apos;interprétation.
      </p>
    </aside>
  );
}
