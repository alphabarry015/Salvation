export function KinshipNote({
  kind,
  note,
}: {
  kind: "same" | "echo";
  note: string;
}) {
  return (
    <p className="inline-flex max-w-2xl items-center gap-2 rounded-pill bg-mark-soft px-3 py-1 text-left text-xs leading-snug text-mark">
      <span aria-hidden className="font-medium">
        {kind === "same" ? "↔" : "↻"}
      </span>
      <span>{note}</span>
    </p>
  );
}
