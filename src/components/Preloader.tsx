"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { emitPreloaderDone } from "@/lib/events";
import { lockScroll } from "@/lib/lenis";

/* =====================================================================
   CONFIG
   ===================================================================== */
export const LOADER_BRAND = {
  name: "ARSHXWEBSTUDIO",
  boldPart: "ARSHX", // used in twoTone mode
  wordmarkStyle: "solid" as "solid" | "twoTone", // "solid" (v1) | "twoTone" (v2)
  bg: "#1E1E20",
  curtain: "#0A0A0A",
};
export const LOADER_TIMING = {
  dot: 0.15,
  ring: 0.45,
  morph: 0.3,
  slide: 0.4,
  letters: 0.6,
  letterStagger: 0.04,
  zoom: 0.3,
  hold: 0.15,
  curtain: 0.5,
};
/** true = play the full intro on every page load. false = once per browser session (repeat loads fade quickly). */
const ALWAYS_SHOW = true;
const SEEN_KEY = "arshx_loader_seen";

/**
 * ArshXWebStudio intro: dot → radio ring → "A" mark → slide left → letters reveal →
 * zoom → curtain. Hands off to the page with the "preloader:done" event.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const bold = LOADER_BRAND.name.slice(0, LOADER_BRAND.boldPart.length);
  const rest = LOADER_BRAND.name.slice(LOADER_BRAND.boldPart.length);

  useGSAP(
    () => {
      const loader = root.current!;
      const lockup = loader.querySelector<HTMLElement>(".ax-lockup")!;
      const slot = loader.querySelector<HTMLElement>(".ax-slot")!;
      const ring = loader.querySelector<SVGElement>(".ax-ring")!;
      const mark = loader.querySelector<SVGElement>(".ax-mark")!;
      const word = loader.querySelector<HTMLElement>(".ax-word")!;
      const curtain = loader.querySelector<HTMLElement>(".ax-curtain")!;
      const letters = Array.from(word.querySelectorAll<HTMLElement>(".ax-ch"));
      const T = LOADER_TIMING;

      lockScroll(true);

      /* ---- Wordmark style + responsive fit (wrap WEBSTUDIO under ARSHX if needed) ---- */
      const applyStyle = (style: "solid" | "twoTone") => {
        word.classList.toggle("twoTone", style === "twoTone");
        letters.forEach((el) => {
          const dim = style === "twoTone" && el.parentElement!.classList.contains("rest");
          el.dataset.final = dim ? "rgba(255,255,255,0.55)" : "#FFFFFF";
        });
      };
      const fitWordmark = () => {
        word.classList.remove("wrap");
        const q = new URLSearchParams(window.location.search).get("style");
        applyStyle(q === "twoTone" || q === "solid" ? q : LOADER_BRAND.wordmarkStyle);
        const gap = parseFloat(getComputedStyle(lockup).columnGap) || 0;
        const available = window.innerWidth - slot.offsetWidth - gap - 32;
        if (word.scrollWidth > available) {
          applyStyle("twoTone");
          word.classList.add("wrap");
        }
        letters.forEach((el) => (el.style.color = el.dataset.final!));
      };

      /* ---- Handoff ---- */
      let handedOff = false;
      let safety = 0;
      const armSafety = (seconds: number, fn: () => void) => {
        window.clearTimeout(safety);
        safety = window.setTimeout(fn, (seconds + 2) * 1000);
      };
      const handoff = () => {
        if (handedOff) return;
        handedOff = true;
        window.clearTimeout(safety);
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* storage blocked */
        }
        loader.classList.remove("is-animating");
        loader.style.display = "none";
        lockScroll(false);
        emitPreloaderDone();
        window.dispatchEvent(new Event("preloader:done"));
        ScrollTrigger.refresh();
      };
      const showFinalFrame = () => {
        fitWordmark();
        gsap.set(ring, { opacity: 0 });
        gsap.set(mark, { opacity: 1 });
        gsap.set(letters, { opacity: 1 });
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {
        seen = false;
      }
      const alwaysShow = ALWAYS_SHOW || new URLSearchParams(window.location.search).get("always") === "1";

      /* ---- Repeat visit in this session: quick 0.3 s fade to the page ---- */
      if (seen && !alwaysShow) {
        gsap.to(loader, { autoAlpha: 0, duration: 0.3, ease: "power1.out", onComplete: handoff });
        armSafety(0.3, handoff);
        return;
      }

      /* ---- Reduced motion: static final logo 0.6 s, fade, hand off ---- */
      if (reduced) {
        showFinalFrame();
        gsap.to(loader, { autoAlpha: 0, duration: 0.3, delay: 0.6, ease: "power1.out", onComplete: handoff });
        armSafety(0.9, handoff);
        return;
      }

      let started = false;
      const play = () => {
        if (started || handedOff) return;
        started = true;
        fitWordmark();
        loader.classList.add("is-animating");

        // FLIP: start the mark at screen centre, end at its place in the lockup.
        const box = slot.getBoundingClientRect();
        const startX = window.innerWidth / 2 - (box.left + box.width / 2);
        const startY = window.innerHeight / 2 - (box.top + box.height / 2);
        const zoom = Math.min(1.25, (window.innerWidth * 0.94) / lockup.getBoundingClientRect().width);
        const dotScale = 8 / slot.offsetWidth;
        const letterDur = Math.max(0.35, T.letters - T.letterStagger * (letters.length - 1));

        gsap.set(slot, { x: startX, y: startY });
        gsap.set(ring, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
        gsap.set(mark, { opacity: 0, rotation: -90, scale: 0.9, transformOrigin: "50% 50%" });
        gsap.set(letters, { opacity: 0, x: 20, filter: "blur(8px)", color: "#555555" });
        gsap.set(curtain, { clipPath: "inset(100% 0% 0% 0%)" });

        const tl = gsap.timeline({ delay: 0.1, onComplete: handoff });
        // 1) Dot appears in the centre
        tl.to(ring, { opacity: 1, scale: dotScale, duration: T.dot, ease: "power2.out" }, "dot")
          // 2) Dot grows into the radio-button ring
          .to(ring, { scale: 1, duration: T.ring, ease: "back.out(1.6)" }, "ring")
          // 3) Ring morphs into the "A" mark
          .to(ring, { opacity: 0, rotation: 90, scale: 1.05, duration: T.morph, ease: "power3.out" }, "morph")
          .to(mark, { opacity: 1, rotation: 0, scale: 1, duration: T.morph, ease: "power3.out" }, "morph")
          // 4) Mark slides to the left of the lockup
          .to(slot, { x: 0, y: 0, duration: T.slide, ease: "power3.inOut" }, "slide")
          // 5) Letters reveal one by one
          .to(
            letters,
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              color: (_i: number, el: HTMLElement) => el.dataset.final!,
              duration: letterDur,
              stagger: T.letterStagger,
              ease: "power3.out",
            },
            `slide+=${T.slide * 0.35}`,
          )
          // 6) Zoom + hold
          .to(lockup, { scale: zoom, duration: T.zoom, ease: "power2.inOut" }, ">-0.05")
          .to({}, { duration: T.hold })
          // 7) Curtain sweeps up, lockup lifts and fades
          .to(curtain, { clipPath: "inset(0% 0% 0% 0%)", duration: T.curtain, ease: "expo.inOut" }, "curtain")
          .to(lockup, { y: -40, opacity: 0, duration: T.curtain * 0.8, ease: "power2.in" }, "curtain");

        // If animation frames stall (background tab), force the end.
        armSafety(tl.duration() + 0.1, () => tl.progress(1));
      };

      // Wait for Montserrat (1.5 s safety timeout) so letters don't jump.
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(play);
      armSafety(1.5, play);

      return () => window.clearTimeout(safety);
    },
    { scope: root },
  );

  const letters = (text: string) =>
    text.split("").map((c, i) => (
      <span className="ax-ch" key={i}>
        {c}
      </span>
    ));

  return (
    <div className="preloader" ref={root} role="status" aria-label="Loading ArshXWebStudio">
      <span className="sr-only">ArshXWebStudio</span>
      <div className="ax-lockup" aria-hidden="true">
        <div className="ax-slot">
          <svg className="ax-ring" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6.5" />
            <circle cx="50" cy="50" r="19" fill="#fff" />
          </svg>
          <svg className="ax-mark" viewBox="0 0 100 100">
            <defs>
              <mask id="arshxMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                <rect width="100" height="100" fill="#fff" />
                <path fill="#000" fillRule="evenodd" d="M44.5 27H55.5L77 75H61L57 66H43L39 75H23Z M50 44L43.7 58H56.3Z" />
              </mask>
            </defs>
            <circle cx="50" cy="50" r="49" fill="#fff" mask="url(#arshxMask)" />
          </svg>
        </div>
        <div className="ax-word">
          <span className="ax-grp bold">{letters(bold)}</span>
          <span className="ax-grp rest">{letters(rest)}</span>
        </div>
      </div>
      <div className="ax-curtain" />
    </div>
  );
}
