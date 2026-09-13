"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [
  { href: "/", label: "Accueil", icon: HomeIcon },
  { href: "/torah", label: "Torah", icon: BookIcon },
  { href: "/bible", label: "Bible", icon: BookIcon },
  { href: "/coran", label: "Coran", icon: BookIcon },
  { href: "/comparer", label: "Rencontre", icon: SplitIcon },
] as const;

export function AppSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-5">
        <span className="text-accent">
          <Logo className="size-8" />
        </span>
        <div>
          <p className="font-serif text-lg leading-none text-ink">Salvation</p>
          <p className="mt-1 text-[11px] tracking-wide text-muted">
            Lecture croisée
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Pages">
        {LINKS.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-accent text-paper"
                  : "text-ink hover:bg-accent-soft"
              }`}
            >
              <Icon />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-line px-4 py-4">
        <p className="text-xs text-muted">Mode d&apos;affichage</p>
        <ThemeToggle />
      </div>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="7" height="15" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.5" y="4.5" width="7" height="15" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
