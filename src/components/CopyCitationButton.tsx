"use client";

import { useState } from "react";

export function formatCitation(
  source: string,
  reference: string,
  edition: string,
  text: string,
): string {
  return `${source}, ${reference} (${edition})\n\n« ${text} »`;
}

export function CopyCitationButton({ citation }: { citation: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1.5 text-xs tracking-wide text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
            <path
              d="M5 12.5 9.5 17 19 7.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copié
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" aria-hidden>
            <rect
              x="8"
              y="8"
              width="11"
              height="13"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span className="sm:hidden">Copier</span>
          <span className="hidden sm:inline">Copier la citation</span>
        </>
      )}
    </button>
  );
}
