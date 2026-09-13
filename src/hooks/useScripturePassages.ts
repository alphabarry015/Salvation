"use client";

import { useCallback, useState } from "react";
import {
  fetchBiblePassage,
  fetchQuranPassage,
  getApiErrorMessage,
} from "@/services/api";
import type {
  BibleQuery,
  PassageView,
  QuranQuery,
  TextEntry,
} from "@/types/scripture";

function fromLocal(entry?: TextEntry): { bible: PassageView; quran: PassageView } {
  return {
    bible: {
      status: entry ? "success" : "idle",
      reference: entry?.bible.reference ?? "",
      edition: entry?.bible.version ?? "",
      text: entry?.bible.text ?? "",
      fromApi: false,
    },
    quran: {
      status: entry ? "success" : "idle",
      reference: entry?.coran.reference ?? "",
      edition: entry?.coran.translator ?? "",
      text: entry?.coran.text ?? "",
      fromApi: false,
    },
  };
}

export function useScripturePassages(initial?: TextEntry) {
  const [bible, setBible] = useState<PassageView>(
    () => fromLocal(initial).bible,
  );
  const [quran, setQuran] = useState<PassageView>(
    () => fromLocal(initial).quran,
  );

  const lookup = useCallback(
    async (
      bibleQuery: BibleQuery,
      quranQuery: QuranQuery,
      fallback?: TextEntry,
    ) => {
      setBible({
        status: "loading",
        reference: fallback?.bible.reference ?? "",
        edition: fallback?.bible.version ?? "",
        text: "",
      });
      setQuran({
        status: "loading",
        reference: fallback?.coran.reference ?? "",
        edition: fallback?.coran.translator ?? "",
        text: "",
      });

      const [bibleResult, quranResult] = await Promise.allSettled([
        fetchBiblePassage(bibleQuery),
        fetchQuranPassage(quranQuery),
      ]);

      if (bibleResult.status === "fulfilled") {
        setBible({
          status: "success",
          reference: bibleResult.value.reference,
          edition: bibleResult.value.version,
          text: bibleResult.value.text,
          fromApi: true,
        });
      } else {
        setBible({
          status: "error",
          reference: fallback?.bible.reference ?? "",
          edition: fallback?.bible.version ?? "",
          text: fallback?.bible.text ?? "",
          error: getApiErrorMessage(bibleResult.reason),
          fromApi: false,
        });
      }

      if (quranResult.status === "fulfilled") {
        setQuran({
          status: "success",
          reference: quranResult.value.reference,
          edition: quranResult.value.translator,
          text: quranResult.value.text,
          arabic: quranResult.value.arabic,
          fromApi: true,
        });
      } else {
        setQuran({
          status: "error",
          reference: fallback?.coran.reference ?? "",
          edition: fallback?.coran.translator ?? "",
          text: fallback?.coran.text ?? "",
          error: getApiErrorMessage(quranResult.reason),
          fromApi: false,
        });
      }
    },
    [],
  );

  return { bible, quran, lookup };
}
