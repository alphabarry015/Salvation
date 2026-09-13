import { BibleReader } from "@/components/reader/BibleReader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible, Salvation",
  description:
    "Lire la Bible en français, livre par livre, dans le respect du texte.",
};

export default function BiblePage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-paper">
      <BibleReader />
    </div>
  );
}
