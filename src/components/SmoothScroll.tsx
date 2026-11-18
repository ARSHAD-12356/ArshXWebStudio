"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { isPreloaderDone } from "@/lib/events";

/** Lenis smooth scrolling wired into GSAP's ticker and ScrollTrigger. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (!isPreloaderDone()) lenis.stop();

    // Anchor links scroll through Lenis.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -20 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
