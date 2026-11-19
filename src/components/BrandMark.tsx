import AxMark from "./AxMark";

/** Full brand lockup: AX mark + "ArshX Web Studio" ("Web Studio" in silver). */
export function Logo({ className = "", idPrefix }: { className?: string; idPrefix: string }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo-mark">
        <AxMark idPrefix={idPrefix} />
      </span>
      <span className="logo-word">
        <b>ArshX</b> Web Studio
      </span>
    </span>
  );
}
