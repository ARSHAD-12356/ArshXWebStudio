"use client";

import { Fragment, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { emitPreloaderDone } from "@/lib/events";
import { lockScroll } from "@/lib/lenis";
import AxMark from "./AxMark";

/* =====================================================================
   CONFIG
   ===================================================================== */
const BRAND = {
  nameBold: "ArshX",
  nameLight: "Web Studio",
  tagline: ["DESIGN", "DEVELOP", "DELIVER"],
} as const;

const TIMING = {
  spark: 0.2,
  ringDraw: 0.8,
  // Everything after the ring is slowed down a little for a calmer, premium feel.
  markIn: 0.9,
  shine: 0.55,
  letters: 0.8,
  letterStagger: 0.055,
  tagline: 0.7,
  hold: 0.6,
  exit: 0.7,
};

/** true = full intro on every page load. false = once per browser session (repeat loads: 0.3 s fade). */
const ALWAYS_SHOW = true;
const SEEN_KEY = "arshx_loader_seen";

/* Ring geometry in its own SVG viewBox (0 0 200 200). */
const R = 98;
const C = 100;

/**
 * ArshX Web Studio intro (v2): spark → ring draws with a comet head → AX mark wipes in with a
 * shine → letters → tagline → hold → portal exit. Fires "preloader:done" at the handoff.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
      const qa = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));

      const bg = q<HTMLDivElement>(".axl-bg");
      const ringWrap = q<HTMLDivElement>(".axl-ringwrap");
      const ringLine = q<SVGCircleElement>(".axl-ring-line");
      const ringGlow = q<HTMLDivElement>(".axl-ring-glow");
      const spark = q<HTMLDivElement>(".axl-spark");
      const content = q<HTMLDivElement>(".axl-content");
      const mark = q<HTMLDivElement>(".axl-mark");
      const shine = q<SVGRectElement>(".ax-shine");
      const letters = qa<HTMLSpanElement>(".axl-ch");
      const lines = qa<HTMLSpanElement>(".axl-line");
      const tagText = q<HTMLSpanElement>(".axl-tag-text");
      const dots = qa<HTMLSpanElement>(".axl-dot");
      const animated = [ringWrap, ringLine, ringGlow, spark, content, mark, ...letters, ...lines, tagText, ...dots];

      lockScroll(true);

      /* ---- Handoff: hide loader, unlock scroll, announce ---- */
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
          /* storage blocked: ignore */
        }
        gsap.set(animated, { willChange: "auto" });
        el.style.display = "none";
        lockScroll(false);
        emitPreloaderDone();
        window.dispatchEvent(new Event("preloader:done"));
        ScrollTrigger.refresh();
      };

      /* ---- Final frame, used by reduced motion ---- */
      const showFinalFrame = () => {
        gsap.set(ringLine, { strokeDashoffset: 0 });
        gsap.set([ringGlow, mark, ...letters, ...lines, tagText, ...dots], { opacity: 1 });
        gsap.set(ringGlow, { opacity: 0.8 });
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {
        seen = false;
      }
      const alwaysShow = ALWAYS_SHOW || new URLSearchParams(window.location.search).get("always") === "1";

      /* ---- Repeat visit in this session: 0.3 s fade only ---- */
      if (seen && !alwaysShow) {
        gsap.to(el, { autoAlpha: 0, duration: 0.3, ease: "power1.out", onComplete: handoff });
        armSafety(0.3, handoff);
        return () => window.clearTimeout(safety);
      }

      /* ---- Reduced motion: static final frame 0.6 s, fade, hand off ---- */
      if (reduced) {
        showFinalFrame();
        gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.6, ease: "power1.out", onComplete: handoff });
        armSafety(0.9, handoff);
        return () => window.clearTimeout(safety);
      }

      let started = false;
      const play = () => {
        if (started || handedOff) return;
        started = true;
        gsap.set(animated, { willChange: "transform, opacity, filter" });

        // Comet head position: ring radius in px (ring wrapper is square).
        const placeSpark = (progress: number) => {
          const size = ringWrap.offsetWidth;
          const r = (size / 2) * (R / C);
          const a = -Math.PI / 2 + progress * Math.PI * 2; // clockwise from the top
          gsap.set(spark, { x: Math.cos(a) * r, y: Math.sin(a) * r });
        };

        gsap.set(ringLine, { strokeDashoffset: 1000 });
        gsap.set(ringGlow, { opacity: 0 });
        gsap.set(spark, { scale: 0, opacity: 0 });
        placeSpark(0);
        gsap.set(mark, { opacity: 0, scale: 0.85, filter: "blur(10px)", clipPath: "inset(-30% 130% -30% -30%)" });
        gsap.set(shine, { attr: { x: -200 }, opacity: 0 });
        gsap.set(letters, { opacity: 0, y: 18, filter: "blur(8px)" });
        gsap.set(lines, { scaleX: 0 });
        gsap.set(tagText, { opacity: 0, letterSpacing: "0.6em" });
        gsap.set(dots, { scale: 0 });

        const draw = { p: 0 };
        const tl = gsap.timeline({ delay: 0.1, onComplete: handoff });

        // 0.00 – 0.20 s · Spark: glowing cyan dot appears at the top of the ring
        tl.to(spark, { scale: 1, opacity: 1, duration: TIMING.spark, ease: "back.out(2)" }, 0)

          // 0.20 – 1.00 s · Ring draws itself clockwise from the top, the spark rides the tip
          .to(ringLine, { strokeDashoffset: 0, duration: TIMING.ringDraw, ease: "power2.inOut" }, TIMING.spark)
          .to(
            draw,
            { p: 1, duration: TIMING.ringDraw, ease: "power2.inOut", onUpdate: () => placeSpark(draw.p) },
            TIMING.spark,
          )
          // Circle closes: spark fades, ring glow pulses once (0.4 → 1 → 0.8)
          .to(spark, { opacity: 0, scale: 0.4, duration: 0.25, ease: "power2.out" }, ">-0.02")
          .fromTo(ringGlow, { opacity: 0.4 }, { opacity: 1, duration: 0.18, ease: "power2.out", immediateRender: false }, "<")
          .to(ringGlow, { opacity: 0.8, duration: 0.3, ease: "power2.inOut" }, ">")

          // 0.90 – 1.45 s · AX mark: scale + blur + left-to-right wipe
          .to(
            mark,
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              clipPath: "inset(-30% -30% -30% -30%)",
              duration: TIMING.markIn,
              ease: "power3.out",
            },
            TIMING.spark + TIMING.ringDraw - 0.1,
          )

          // 1.35 – 1.65 s · Shine streak sweeps across the mark once
          .to(shine, { opacity: 1, duration: 0.05 }, ">-0.1")
          .to(shine, { attr: { x: 900 }, duration: TIMING.shine, ease: "power1.inOut" }, "<")
          .to(shine, { opacity: 0, duration: 0.05 }, ">-0.05")

          // 1.45 – 1.95 s · Name: letters rise out of blur, staggered
          .to(
            letters,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: TIMING.letters,
              stagger: TIMING.letterStagger,
              ease: "power3.out",
            },
            TIMING.spark + TIMING.ringDraw + TIMING.markIn - 0.3,
          )

          // 1.85 – 2.25 s · Tagline: side lines grow outward, text tightens, dots pop
          .to(lines, { scaleX: 1, duration: TIMING.tagline, ease: "power3.out" }, ">-0.35")
          .to(tagText, { opacity: 1, letterSpacing: "0.32em", duration: TIMING.tagline, ease: "power3.out" }, "<")
          .to(dots, {
            keyframes: [
              { scale: 1.4, duration: TIMING.tagline * 0.5, ease: "power2.out" },
              { scale: 1, duration: TIMING.tagline * 0.5, ease: "power2.inOut" },
            ],
            stagger: 0.06,
          }, "<0.05")

          // 2.25 – 2.50 s · Hold on the final frame; the ring breathes once
          .to(ringGlow, { opacity: 1, duration: TIMING.hold / 2, ease: "sine.inOut", yoyo: true, repeat: 1 }, ">")

          // 2.50 – 3.10 s · Exit: ring expands like a portal, content recedes, background fades
          .to(ringWrap, { scale: 4, opacity: 0, duration: TIMING.exit, ease: "expo.in" }, ">")
          .to(content, { scale: 0.92, opacity: 0, filter: "blur(6px)", duration: TIMING.exit * 0.8, ease: "power2.in" }, "<")
          .to(bg, { opacity: 0, duration: TIMING.exit * 0.6, ease: "power1.in" }, `<${TIMING.exit * 0.4}`);
        // 3.10 s · onComplete → handoff()

        // ?loaderDebug exposes the timeline (window.__axLoader) for frame-by-frame review.
        if (new URLSearchParams(window.location.search).has("loaderDebug")) {
          (window as Window & { __axLoader?: gsap.core.Timeline }).__axLoader = tl;
          return;
        }

        // If animation frames stall (background tab), force the end so the page never stays locked.
        armSafety(tl.duration() + 0.1, () => tl.progress(1));
      };

      // Start after fonts are ready (1.5 s safety timeout) so letters don't jump.
      const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();
      Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(play);
      armSafety(1.5, play);

      return () => window.clearTimeout(safety);
    },
    { scope: root },
  );

  const split = (text: string, cls: string) =>
    text.split("").map((c, i) =>
      c === " " ? (
        <span className="axl-space" key={`${cls}${i}`}>
          {" "}
        </span>
      ) : (
        <span className={`axl-ch ${cls}`} key={`${cls}${i}`}>
          {c}
        </span>
      ),
    );

  return (
    <div className="axl" ref={root} role="status" aria-live="polite" aria-label="Loading ArshX Web Studio">
      <div className="axl-bg" />
      <span className="sr-only">ArshX Web Studio</span>

      <div className="axl-stage" aria-hidden="true">
        {/* Glowing ring */}
        <div className="axl-ringwrap">
          <div className="axl-ring-glow" />
          <svg className="axl-ring" viewBox="0 0 200 200">
            <circle
              className="axl-ring-line"
              cx={C}
              cy={C}
              r={R}
              pathLength={1000}
              transform={`rotate(-90 ${C} ${C})`}
            />
          </svg>
          <div className="axl-spark" />
        </div>

        {/* Mark + name + tagline */}
        <div className="axl-content">
          <div className="axl-mark">
            <AxMark className="axl-mark-svg" />
          </div>
          <div className="axl-name">
            {split(BRAND.nameBold, "axl-bold")}
            <span className="axl-space"> </span>
            {split(BRAND.nameLight, "axl-light")}
          </div>
          <div className="axl-tag">
            <span className="axl-line left" />
            <span className="axl-tag-text">
              {BRAND.tagline.map((word, i) => (
                <Fragment key={word}>
                  {i > 0 && <span className="axl-dot">•</span>}
                  <span>{word}</span>
                </Fragment>
              ))}
            </span>
            <span className="axl-line right" />
          </div>
        </div>
      </div>
    </div>
  );
}
