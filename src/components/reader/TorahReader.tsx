import { BibleReader, type BibleReaderProps } from "@/components/reader/BibleReader";

export function TorahReader(props: Omit<BibleReaderProps, "canon">) {
  return <BibleReader {...props} canon="torah" />;
}
