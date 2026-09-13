import type { ScriptureSource } from "@/types/scripture";

const STYLES: Record<ScriptureSource, string> = {
  torah: "bg-[#f4efe4] text-[#6a5840]",
  bible: "bg-[#eef1f6] text-[#3f4d63]",
  quran: "bg-[#e8f2ea] text-[#3a5a42]",
};

const LABELS: Record<ScriptureSource, string> = {
  torah: "Torah",
  bible: "Bible",
  quran: "Coran",
};

export function SourceBadge({
  source,
  className = "",
}: {
  source: ScriptureSource;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-pill px-2.5 py-0.5 text-[10px] font-medium tracking-[0.14em] uppercase ${STYLES[source]} ${className}`}
    >
      {LABELS[source]}
    </span>
  );
}
