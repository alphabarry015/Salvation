"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "Accueil", match: (path: string) => path === "/" },
  { href: "/torah", label: "Torah", match: (path: string) => path.startsWith("/torah") },
  { href: "/bible", label: "Bible", match: (path: string) => path.startsWith("/bible") },
  { href: "/coran", label: "Coran", match: (path: string) => path.startsWith("/coran") },
  { href: "/comparer", label: "Rencontre", match: (path: string) => path.startsWith("/comparer") },
] as const;

const DESKTOP_LINKS = LINKS.filter((link) => link.href !== "/");

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const html = document.documentElement;
    const previousHtml = html.style.overflow;
    const previousBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu =
    open && mounted
      ? createPortal(
          <div
            id="site-menu"
            className="fixed inset-0 z-[100] flex h-dvh w-screen flex-col bg-cream xl:hidden"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="grid h-16 shrink-0 grid-cols-3 items-center border-b border-parchment bg-paper px-3 sm:h-[4.25rem] sm:px-6">
              <Link
                href="/"
                className="justify-self-start text-flame"
                aria-label="Accueil"
                onClick={() => setOpen(false)}
              >
                <Logo className="size-8 sm:size-9" />
              </Link>

              <p className="justify-self-center text-center font-serif text-lg tracking-tight text-ink sm:text-xl">
                Salvation
              </p>

              <button
                type="button"
                className="inline-flex size-10 items-center justify-center justify-self-end rounded-full border border-parchment bg-cream text-ink"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav
              className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 bg-cream px-6 text-center sm:gap-10"
              aria-label="Pages"
            >
              {LINKS.map((link) => {
                const active = link.match(pathname);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`w-full text-center font-serif text-3xl tracking-tight sm:text-5xl ${
                      active ? "text-flame" : "text-ink"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <header className="sticky top-0 z-30 border-b border-parchment bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-ink">
          <span className="shrink-0 text-flame">
            <Logo className="size-7 sm:size-8" />
          </span>
          <span className="truncate font-serif text-lg tracking-tight sm:text-xl">
            Salvation
          </span>
        </Link>

        <nav
          className="hidden items-center gap-7 xl:flex"
          aria-label="Principal"
        >
          {DESKTOP_LINKS.map((link) => {
            const active = link.match(pathname);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${
                  active
                    ? "font-medium text-flame"
                    : "text-ink hover:text-flame"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-parchment bg-paper text-ink shadow-harvest-sm xl:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {menu}
    </header>
  );
}
