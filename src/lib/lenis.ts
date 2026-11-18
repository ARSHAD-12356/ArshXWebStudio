"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = (): Lenis | null => instance;

/** Lock or unlock page scrolling (works with or without Lenis). */
export function lockScroll(lock: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("is-locked", lock);
  if (instance) {
    if (lock) instance.stop();
    else instance.start();
  }
}
