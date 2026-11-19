"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { ArrowRight, ArrowUpRight, ChevronRight, Plus } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { NAV, QUOTE_HREF, serviceHref } from "@/data/navigation";
import { ICONS } from "./icons";
import MegaPreview from "./MegaPreview";

export type MegaHandle = { focusFirst: () => void; el: HTMLDivElement | null };

type Props = {
  open: boolean;
  /** Mount the heavy preview panel only after the menu has been opened once. */
  everOpened: boolean;
  top: number;
  notchX: number;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

const CATS = NAV.categories;

/** Cursor spotlight inside cards: CSS vars --mx/--my, throttled with requestAnimationFrame. */
function useSpotlight() {
  const frame = useRef(0);
  return useCallback((e: RPointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  }, []);
}

const MegaMenu = forwardRef<MegaHandle, Props>(function MegaMenu({ open, everOpened, top, notchX, onPointerEnter, onPointerLeave }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const [catIdx, setCatIdx] = useState(0);
  const [svcIdx, setSvcIdx] = useState(0);
  const tabTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const switching = useRef(false);
  const spotlight = useSpotlight();
  const cat = CATS[catIdx];

  useImperativeHandle(ref, () => ({
    focusFirst: () => root.current?.querySelector<HTMLButtonElement>(".mm-tab.on")?.focus(),
    get el() {
      return root.current;
    },
  }));

  // Default state each time it opens: Development tab, first card.
  useEffect(() => {
    if (open) {
      setCatIdx(0);
      setSvcIdx(0);
    }
  }, [open]);

  /* ---------------- open / close ---------------- */
  const { contextSafe } = useGSAP({ scope: root });
  useGSAP(
    () => {
      const el = root.current!;
      const shell = el.querySelector(".mm-shell");
      const reduced = prefersReducedMotion();
      gsap.killTweensOf([el, shell]);
      if (open) {
        gsap.set(el, { autoAlpha: 1 });
        if (reduced) {
          gsap.fromTo(shell, { opacity: 0 }, { opacity: 1, duration: 0.15 });
          return;
        }
        const tl = gsap.timeline();
        tl.fromTo(
          shell,
          { opacity: 0, y: -12, scale: 0.98, clipPath: "inset(0% 0% 100% 0% round 28px)" },
          { opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 0.4, ease: "power3.out", clearProps: "clipPath" },
        )
          .fromTo(".mm-tab, .mm-consult", { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, stagger: 0.04, ease: "power3.out", clearProps: "transform" }, 0.12)
          .fromTo(".mm-card", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.035, ease: "power3.out", clearProps: "transform" }, 0.15)
          .fromTo(".mm-preview", { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }, 0.18);
      } else {
        if (reduced) {
          gsap.to(el, { autoAlpha: 0, duration: 0.15 });
          return;
        }
        gsap.to(shell, { opacity: 0, y: -8, scale: 0.985, duration: 0.25, ease: "power2.in" });
        gsap.to(el, { autoAlpha: 0, duration: 0.01, delay: 0.25 });
      }
    },
    { scope: root, dependencies: [open] },
  );

  /* ---------------- tab switching ---------------- */
  const switchTo = contextSafe((next: number) => {
    if (next === catIdx || switching.current) return;
    if (prefersReducedMotion()) {
      setCatIdx(next);
      setSvcIdx(0);
      return;
    }
    switching.current = true;
    gsap.to([".mm-card", ".mm-head"], {
      y: -8,
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        switching.current = false;
        setCatIdx(next);
        setSvcIdx(0);
      },
    });
  });

  // New category: headline crossfades in, cards stagger in (grid height is fixed, so nothing jumps).
  const firstRun = useRef(true);
  useGSAP(
    () => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      if (prefersReducedMotion()) return;
      gsap.fromTo(".mm-head", { y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" });
      gsap.fromTo(".mm-card", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, stagger: 0.035, ease: "power3.out", clearProps: "transform" });
    },
    { scope: root, dependencies: [catIdx] },
  );

  const intentTab = (i: number) => {
    clearTimeout(tabTimer.current);
    tabTimer.current = setTimeout(() => switchTo(i), 80);
  };

  const onRailKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowDown" ? 1 : -1) + CATS.length) % CATS.length;
    root.current?.querySelectorAll<HTMLButtonElement>(".mm-tab")[next]?.focus();
    switchTo(next);
  };

  useEffect(() => () => clearTimeout(tabTimer.current), []);

  const [h1, h2, h3] = cat.headline;

  return (
    <div
      ref={root}
      id="mega-services"
      className="mm"
      role="region"
      aria-label="Services menu"
      style={{ top, visibility: "hidden", opacity: 0 }}
      inert={!open}
      onPointerEnter={(e) => e.pointerType === "mouse" && onPointerEnter()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onPointerLeave()}
    >
      <div className="mm-shell">
        <span className="mm-notch" style={{ left: notchX }} aria-hidden="true" />
        <div className="mm-inner">
          {/* Left: category rail */}
          <div className="mm-rail">
            <p className="mm-eyebrow">WHAT WE DO</p>
            <div className="mm-tabs" role="tablist" aria-orientation="vertical" aria-label="Service categories">
              {CATS.map((c, i) => {
                const Icon = ICONS[c.icon];
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={i === catIdx}
                    aria-controls="mega-panel"
                    className={`mm-tab ${i === catIdx ? "on" : ""}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && intentTab(i)}
                    onPointerLeave={() => clearTimeout(tabTimer.current)}
                    onFocus={() => intentTab(i)}
                    onClick={() => switchTo(i)}
                    onKeyDown={(e) => onRailKey(e, i)}
                  >
                    <span className="mm-tab-ico">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="mm-tab-txt">
                      <b>{c.label}</b>
                      <small>{c.services.length} services</small>
                    </span>
                    <ChevronRight size={16} className="mm-tab-chev" />
                  </button>
                );
              })}
            </div>
            <div className="mm-consult">
              <p className="mm-consult-title">
                <span className="mm-live" /> Free consultation
              </p>
              <p className="mm-consult-txt">Not sure what you need? Talk to an expert. We reply within 24 hours.</p>
              <a href={QUOTE_HREF} className="mm-consult-link">
                Book a call <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Centre: service cards */}
          <div className="mm-center" id="mega-panel" role="tabpanel" aria-label={`${cat.label} services`}>
            <div className="mm-head">
              <h2 className="mm-headline">
                {h1} <span className="mm-grad">{h2}</span>
                {h3 ? ` ${h3}` : ""}
              </h2>
              <a href={cat.allLink} className="mm-all">
                All {cat.label.toLowerCase()} <ArrowRight size={14} />
              </a>
            </div>
            <ul className="mm-grid">
              {cat.services.map((s, i) => {
                const Icon = ICONS[s.icon];
                return (
                  <li key={`${cat.id}-${s.title}`} className="mm-card-li">
                    <a
                      href={serviceHref(cat, s)}
                      className={`mm-card ${i === svcIdx ? "on" : ""}`}
                      onPointerEnter={() => setSvcIdx(i)}
                      onFocus={() => setSvcIdx(i)}
                      onPointerMove={spotlight}
                    >
                      <span className="mm-card-ico">
                        <Icon size={19} strokeWidth={1.8} />
                      </span>
                      <span className="mm-card-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="mm-card-title">{s.title}</span>
                      <span className="mm-card-desc">{s.desc}</span>
                      <span className="mm-card-go" aria-hidden="true">
                        <ArrowUpRight size={16} />
                      </span>
                    </a>
                  </li>
                );
              })}
              <li className="mm-card-li">
                <a href={QUOTE_HREF} className="mm-card mm-custom">
                  <span className="mm-custom-plus">
                    <Plus size={18} />
                  </span>
                  <span className="mm-card-title">Something custom?</span>
                  <span className="mm-card-desc">
                    Tell us your idea <ArrowRight size={12} />
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Right: live preview */}
          <div className="mm-preview">{everOpened && <MegaPreview cat={cat} index={svcIdx} />}</div>
        </div>
      </div>
    </div>
  );
});

export default MegaMenu;
