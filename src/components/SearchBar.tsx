interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <label htmlFor="corpus-search" className="sr-only">
        Rechercher dans les thèmes et les textes
      </label>
      <svg
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
        fill="none"
        aria-hidden
      >
        <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M16 16.5 20 20.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        id="corpus-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher un thème, une référence, un mot du texte…"
        className="w-full rounded-full border border-line bg-paper py-3 pr-4 pl-11 text-sm text-ink placeholder:text-muted/80 outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}
