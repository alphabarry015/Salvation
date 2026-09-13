import { QuranReader } from "@/components/reader/QuranReader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coran, Salvation",
  description:
    "Lire le Coran en arabe et en français, sourate par sourate, dans le respect du texte.",
};

export default function CoranPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-paper">
      <QuranReader />
    </div>
  );
}
