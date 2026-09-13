export function KinshipNote({
  kind,
  note,
}: {
  kind: "same" | "echo";
  note: string;
}) {
  return (
    <p className="inline-flex max-w-full items-start gap-2 rounded-2xl bg-mark-soft px-3 py-2 text-left text-xs leading-snug text-mark sm:max-w-2xl sm:items-center sm:rounded-pill sm:py-1.5">
      <span aria-hidden className="font-medium">
        {kind === "same" ? "↔" : "↻"}
      </span>
      <span>{note}</span>
    </p>
  );
}
