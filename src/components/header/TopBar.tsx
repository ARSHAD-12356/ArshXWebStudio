import { ArrowRight, Globe2 } from "lucide-react";
import { NAV, whatsappHref } from "@/data/navigation";

/** 46px announcement bar. Hidden entirely when NAV.topBar.show is false. */
export default function TopBar() {
  if (!NAV.topBar.show) return null;
  return (
    <div className="hd-top">
      <a href={NAV.topBar.href} className="hd-top-promo">
        <span className="hd-top-dot" aria-hidden="true" />
        {NAV.topBar.text}
        <span className="hd-top-arrow" aria-hidden="true">
          <ArrowRight size={13} />
        </span>
      </a>
      <div className="hd-top-right">
        {NAV.topBar.right.map((l) =>
          l.href === "WA" ? (
            <a key={l.label} href={whatsappHref()} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ) : (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ),
        )}
        <button type="button" className="hd-top-lang" aria-label="Language: English">
          <Globe2 size={15} /> EN
        </button>
      </div>
    </div>
  );
}
