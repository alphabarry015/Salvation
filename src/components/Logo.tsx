export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      aria-hidden
    >
      <rect
        x="3.5"
        y="5.5"
        width="11"
        height="21"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect
        x="17.5"
        y="5.5"
        width="11"
        height="21"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M16 6v20" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M6.5 11h5M6.5 15h5M6.5 19h3.5M20.5 11h5M20.5 15h5M20.5 19h3.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
