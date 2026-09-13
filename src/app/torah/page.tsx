import { TorahReader } from "@/components/reader/TorahReader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torah — Salvation",
  description:
    "Lire la Torah en français, livre par livre, dans le respect du texte.",
};

export default function TorahPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-paper">
      <TorahReader />
    </div>
  );
}
