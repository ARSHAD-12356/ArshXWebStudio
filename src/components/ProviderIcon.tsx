/** Neutral placeholder icons standing in for third-party AI-provider logos. */
export type ProviderKind = "s" | "swirl" | "knot" | "m" | "grid" | "a" | "swirl2" | "book";

export default function ProviderIcon({ kind, size = 22 }: { kind: ProviderKind; size?: number }) {
  const s = size;
  switch (kind) {
    case "s":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <text x="3" y="19" fontSize="19" fontWeight="800" fill="#7C3AED" fontFamily="inherit">S</text>
          <circle cx="19" cy="17" r="2.4" fill="#E11D48" />
        </svg>
      );
    case "swirl":
    case "swirl2":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" style={{ fill: kind === "swirl" ? "var(--ax-blue)" : "var(--ax-blue-light)" }} />
          <path d="M16 9a5 5 0 1 0 1 4h-5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "knot":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="#A855F7" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" fill="none" stroke="#EC4899" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.6" fill="#6366F1" />
        </svg>
      );
    case "m":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 20V4h4l5 7 5-7h4v16h-4V11l-5 6-5-6v9z" fill="#6366F1" />
          <path d="M3 4h4v4H3zM17 4h4v4h-4z" fill="#22D3EE" />
        </svg>
      );
    case "grid":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="8.5" height="8.5" rx="2" fill="#F43F5E" />
          <rect x="12.5" y="3" width="8.5" height="8.5" rx="2" fill="#22C55E" />
          <rect x="3" y="12.5" width="8.5" height="8.5" rx="2" fill="#3B82F6" />
          <rect x="12.5" y="12.5" width="8.5" height="8.5" rx="2" fill="#EAB308" />
        </svg>
      );
    case "a":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 3 21h4l5-10 5 10h4z" fill="#2563EB" />
          <path d="M8 16h8" stroke="#60A5FA" strokeWidth="2" />
        </svg>
      );
    case "book":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="4" fill="#7C5CFF" />
          <path d="M4 13h16" stroke="#B4A5FF" strokeWidth="3" />
        </svg>
      );
  }
}
