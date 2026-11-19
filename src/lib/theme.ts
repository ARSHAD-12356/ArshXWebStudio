/**
 * Read a theme token (CSS custom property) at runtime, e.g. for canvas drawing,
 * so colours stay defined only in globals.css.
 */
export function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
