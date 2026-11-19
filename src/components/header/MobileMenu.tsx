"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { LINK_HREFS, NAV, QUOTE_HREF, serviceHref, whatsappHref } from "@/data/navigation";
import { ICONS } from "./icons";

type Props = { open: boolean; onClose: () => void };

/** Full-screen mobile sheet: clip-path reveal, accordions, staggered links, sticky CTAs, focus trap. */
export default function MobileMenu({ open, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState<string | null>(null);
  const [subCat, setSubCat] = useState<string | null>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const reduced = prefersReducedMotion();
      gsap.killTweensOf(el);
      if (open) {
        gsap.set(el, { autoAlpha: 1 });
        if (reduced) {
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 });
          return;
        }
        gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power3.inOut" });
        gsap.fromTo(".mb-big", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.25, ease: "power3.out" });
        gsap.fromTo(".mb-ctas", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.45, ease: "power3.out" });
      } else if (el.style.visibility !== "hidden") {
        if (reduced) {
          gsap.to(el, { autoAlpha: 0, duration: 0.15 });
          return;
        }
        gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.4, ease: "power3.inOut", onComplete: () => void gsap.set(el, { autoAlpha: 0 }) });
      }
    },
    { scope: root, dependencies: [open] },
  );

  // Focus trap + Esc while open.
  useEffect(() => {
    if (!open) return;
    const el = root.current!;
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((n) => n.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toggle = (id: string) => setSection((s) => (s === id ? null : id));

  return (
    <div ref={root} id="mobile-menu" className="mb" role="dialog" aria-modal="true" aria-label="Menu" style={{ visibility: "hidden" }} inert={!open}>
      <div className="mb-scroll">
        <nav aria-label="Mobile">
          <ul className="mb-list">
            {NAV.links.map((label) => {
              if (label === "Services") {
                return (
                  <li key={label} className="mb-big">
                    <button type="button" className="mb-acc" aria-expanded={section === "services"} onClick={() => toggle("services")}>
                      Services <ChevronDown size={22} className="mb-chev" />
                    </button>
                    <div className={`mb-panel ${section === "services" ? "open" : ""}`}>
                      {NAV.categories.map((c) => {
                        const CIcon = ICONS[c.icon];
                        return (
                          <div key={c.id} className="mb-cat">
                            <button type="button" className="mb-sub" aria-expanded={subCat === c.id} onClick={() => setSubCat((s) => (s === c.id ? null : c.id))}>
                              <span className="mm-card-ico">
                                <CIcon size={17} />
                              </span>
                              {c.label}
                              <ChevronDown size={18} className="mb-chev" />
                            </button>
                            <ul className={`mb-panel ${subCat === c.id ? "open" : ""}`}>
                              {c.services.map((s) => {
                                const SIcon = ICONS[s.icon];
                                return (
                                  <li key={s.title}>
                                    <a href={serviceHref(c, s)} className="mb-svc" onClick={onClose}>
                                      <SIcon size={17} />
                                      <span>
                                        <b>{s.title}</b>
                                        <small>{s.desc}</small>
                                      </span>
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </li>
                );
              }
              if (label === "About") {
                return (
                  <li key={label} className="mb-big">
                    <button type="button" className="mb-acc" aria-expanded={section === "about"} onClick={() => toggle("about")}>
                      About <ChevronDown size={22} className="mb-chev" />
                    </button>
                    <ul className={`mb-panel ${section === "about" ? "open" : ""}`}>
                      {NAV.about.map((a) => {
                        const AIcon = ICONS[a.icon];
                        return (
                          <li key={a.title}>
                            <a href={a.href} className="mb-svc" onClick={onClose}>
                              <AIcon size={17} />
                              <span>
                                <b>{a.title}</b>
                                <small>{a.desc}</small>
                              </span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={label} className="mb-big">
                  <a href={LINK_HREFS[label]} className="mb-link" onClick={onClose}>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="mb-ctas">
        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="hd-btn hd-wa mb-cta">
          <span className="hd-wa-ico">
            <MessageCircle size={15} />
          </span>
          Chat on WhatsApp
        </a>
        <a href={QUOTE_HREF} className="hd-btn hd-quote mb-cta" onClick={onClose}>
          Get a Free Quote <ArrowRight size={17} className="hd-arrow" />
        </a>
      </div>
    </div>
  );
}
