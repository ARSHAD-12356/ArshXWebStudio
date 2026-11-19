"use client";

import { useRef, useState } from "react";
import { ArrowRight, ChevronDown, Globe2, Menu, X } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/events";
import { lockScroll } from "@/lib/lenis";
import { B } from "@/lib/config";
import { GMark, Logo } from "./BrandMark";

type Item = { label: string; links?: string[] };

const MENU: Item[] = [
  { label: "Products", links: ["Edge Cloud", "AI Infrastructure", "CDN", "Storage", "DDoS Protection"] },
  { label: "Pricing" },
  { label: "Resources", links: ["Blog", "Documentation", "Case studies", "Developer hub"] },
  { label: "Partners", links: ["Become a partner", "Partner portal", "Technology partners"] },
  { label: `Why ${B}`, links: ["About us", "Customers", "Global network", "Careers"] },
];

export default function Navbar() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const header = root.current!.querySelector<HTMLElement>(".nav")!;

      // State A → State B after 100px of scroll.
      ScrollTrigger.create({
        start: 100,
        end: "max",
        onToggle: (self) => root.current?.classList.toggle("is-compact", self.isActive),
      });

      // Thin white ring while floating over light sections.
      gsap.utils.toArray<HTMLElement>('[data-theme="light"]').forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 40px",
          end: "bottom 40px",
          refreshPriority: -10,
          onToggle: (self) => header.classList.toggle("on-light", self.isActive),
        });
      });

      if (prefersReducedMotion()) return;
      const items = root.current!.querySelectorAll(".topbar > *, .nav-logo, .nav-menu > li, .nav-actions > *");
      gsap.set(items, { opacity: 0, y: -16 });
      onPreloaderDone(() => {
        gsap.to(items, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out", delay: 0.1 });
      });
    },
    { scope: root },
  );

  const toggleMenu = (v: boolean) => {
    setOpen(v);
    lockScroll(v);
  };

  return (
    <div className="nav-root" ref={root}>
      <div className="topbar">
        <a href="#pricing" className="topbar-promo">
          <span className="topbar-dot" />
          GPU AI/ML Apps today! Nvidia A100s &amp; H100s for €1.3/h
          <span className="topbar-arrow">
            <ArrowRight size={12} />
          </span>
        </a>
        <div className="topbar-links">
          <a href="#contact">Under attack?</a>
          <a href="#">Log in</a>
          <button type="button" className="topbar-lang" aria-label="Language: English">
            <Globe2 size={14} /> EN
          </button>
        </div>
      </div>

      <header className="nav">
        <div className="nav-inner">
          <a href="#top" className="nav-logo" aria-label={`${B} home`}>
            <Logo className="nav-logo-full" />
            <span className="nav-logo-icon">
              <GMark />
            </span>
          </a>
          <nav aria-label="Main">
            <ul className="nav-menu">
              {MENU.map((item) => (
                <li key={item.label} className={item.links ? "has-drop" : undefined}>
                  {item.links ? (
                    <>
                      <button type="button" className="nav-link" aria-haspopup="true">
                        {item.label} <ChevronDown size={14} className="chev" />
                      </button>
                      <div className="nav-drop">
                        {item.links.map((l) => (
                          <a href="#" key={l}>
                            {l}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <a href="#pricing" className="nav-link">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-actions">
            <a href="#contact" className="btn btn-ghost nav-contact">
              Contact us
            </a>
            <a href="#" className="btn btn-orange nav-signup">
              Sign up for free
            </a>
            <button type="button" className="nav-burger" aria-label="Open menu" aria-expanded={open} onClick={() => toggleMenu(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <div className="mobile-menu-head">
          <Logo />
          <button type="button" className="nav-burger" aria-label="Close menu" onClick={() => toggleMenu(false)}>
            <X size={22} />
          </button>
        </div>
        <ul>
          {MENU.map((m) => (
            <li key={m.label}>
              <a href="#pricing" onClick={() => toggleMenu(false)}>
                {m.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-actions">
          <a href="#contact" className="btn btn-ghost" onClick={() => toggleMenu(false)}>
            Contact us
          </a>
          <a href="#" className="btn btn-orange">
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
}
