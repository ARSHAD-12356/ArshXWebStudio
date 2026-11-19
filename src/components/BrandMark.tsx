import { CONFIG } from "@/lib/config";

/** The brand logomark: a rounded "G" stroke. Swap this SVG for your own mark. */
export function GMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M37.6 14.2A16.5 16.5 0 1 0 40.5 24H25.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo-mark">
        <GMark />
      </span>
      <span className="logo-word">{CONFIG.BRAND}</span>
    </span>
  );
}
