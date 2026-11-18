"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/** Cards fade up (y 60 → 0, scale .96 → 1) in staggered batches as they enter. */
export function cardsIn(scope: Element, selector: string, opts: { y?: number; stagger?: number; start?: string } = {}) {
  const els = gsap.utils.toArray<HTMLElement>(selector, scope);
  if (!els.length || prefersReducedMotion()) return;
  gsap.set(els, { opacity: 0, y: opts.y ?? 60, scale: 0.96 });
  ScrollTrigger.batch(els, {
    start: opts.start ?? "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        stagger: opts.stagger ?? 0.1,
        overwrite: true,
      }),
  });
}

/** Badge pills above headings fade and slide up. */
export function badgeIn(el: Element | null) {
  if (!el || prefersReducedMotion()) return;
  gsap.from(el, {
    opacity: 0,
    y: 16,
    duration: 0.8,
    scrollTrigger: { trigger: el, start: "top 88%", once: true },
  });
}

/** Radial glow that follows the cursor inside `.glow-card` elements. */
export function cursorGlow(scope: RefObject<HTMLElement | null>) {
  const root = scope.current;
  if (!root) return () => {};
  const onMove = (e: PointerEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>(".glow-card");
    if (!card || !root.contains(card)) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  root.addEventListener("pointermove", onMove);
  return () => root.removeEventListener("pointermove", onMove);
}
