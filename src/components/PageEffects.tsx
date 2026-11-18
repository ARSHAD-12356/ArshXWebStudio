"use client";

import { useEffect } from "react";
import { gsap, isMobile, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Global section-to-section "sheet" transitions. Rendered last so it runs after every section has
 * created its own triggers: the previous section pins (no spacing) while the next sheet slides
 * over it with rounded top corners, and the pinned one scales down to 0.95 and dims.
 */
export default function PageEffects() {
  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>("main > .section");
    sections.forEach((s, i) => (s.style.zIndex = String(i + 1)));
    if (prefersReducedMotion() || isMobile()) return;

    gsap.utils.toArray<HTMLElement>("[data-sheet-under]").forEach((prev) => {
      const dim = prev.querySelector<HTMLElement>(":scope > .sheet-dim");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: prev,
          start: "bottom bottom",
          end: "+=100%",
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      });
      tl.to(prev, { scale: 0.95, transformOrigin: "50% 100%", ease: "none" }, 0);
      if (dim) tl.fromTo(dim, { opacity: 0 }, { opacity: 0.55, ease: "none" }, 0);
    });
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });

  // Refresh once web fonts have loaded (heading heights change).
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return null;
}
