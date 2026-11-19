"use client";

import { useRef, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { LINK_HREFS, NAV } from "@/data/navigation";

export type MenuId = "services" | "about";

type Props = {
  open: MenuId | null;
  triggerRefs: Record<MenuId, RefObject<HTMLButtonElement | null>>;
  onEnter: (id: MenuId) => void;
  onLeave: () => void;
  onToggle: (id: MenuId) => void;
  onKeyOpen: (id: MenuId) => void;
  /** The menu panels are rendered right after their trigger so Tab order flows into them. */
  panels: Record<MenuId, ReactNode>;
};

/** Desktop links with one shared sliding underline (GSAP x/width, 0.35 s power3.out). */
export default function NavLinks({ open, triggerRefs, onEnter, onLeave, onToggle, onKeyOpen, panels }: Props) {
  const list = useRef<HTMLUListElement>(null);
  const line = useRef<HTMLLIElement>(null);

  const moveTo = (el: HTMLElement | null) => {
    const ul = list.current;
    const ln = line.current;
    if (!ul || !ln) return;
    if (!el) {
      gsap.to(ln, { opacity: 0, duration: 0.25 });
      return;
    }
    const a = ul.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const d = prefersReducedMotion() ? 0 : 0.35;
    gsap.to(ln, { x: b.left - a.left, width: b.width, opacity: 1, duration: d, ease: "power3.out" });
  };

  // Keep the underline on the open menu's trigger.
  useGSAP(() => moveTo(open ? triggerRefs[open].current : null), { dependencies: [open] });

  const keyOpen = (e: KeyboardEvent<HTMLButtonElement>, id: MenuId) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onKeyOpen(id);
    }
  };

  return (
    <nav aria-label="Main" className="hd-nav">
      <ul className="hd-links" ref={list} onPointerLeave={() => moveTo(open ? triggerRefs[open].current : null)}>
        {NAV.links.map((label) => {
          const id: MenuId | null = label === "Services" ? "services" : label === "About" ? "about" : null;
          if (id) {
            return (
              <li key={label} className="hd-li">
                <button
                  ref={triggerRefs[id]}
                  type="button"
                  className={`hd-link ${open === id ? "on" : ""}`}
                  aria-expanded={open === id}
                  aria-controls={id === "services" ? "mega-services" : "menu-about"}
                  onPointerEnter={(e) => {
                    moveTo(e.currentTarget);
                    if (e.pointerType === "mouse") onEnter(id);
                  }}
                  onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
                  onClick={() => onToggle(id)}
                  onKeyDown={(e) => keyOpen(e, id)}
                >
                  {label} <ChevronDown size={16} className="hd-chev" />
                </button>
                {panels[id]}
              </li>
            );
          }
          return (
            <li key={label} className="hd-li">
              <a href={LINK_HREFS[label]} className="hd-link" onPointerEnter={(e) => moveTo(e.currentTarget)} onFocus={(e) => moveTo(e.currentTarget)}>
                {label}
              </a>
            </li>
          );
        })}
        <li className="hd-underline" ref={line} aria-hidden="true" />
      </ul>
    </nav>
  );
}
